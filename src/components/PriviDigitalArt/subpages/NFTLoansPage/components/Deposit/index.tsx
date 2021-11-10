import React, { useEffect, useState } from "react";
import { Grid, useMediaQuery, useTheme } from "@material-ui/core";
import axios from "axios";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import { handleSetStatus, _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import Box from "shared/ui-kit/Box";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { useDepositPageStyles } from "./index.styles";
import { BlockchainNets, LoanBlockchainNet } from "shared/constants/constants";
import { onGetNonDecrypt } from "shared/ipfs/get";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { useTypedSelector } from "store/reducers/Reducer";
import { switchNetwork } from "shared/functions/metamask";
import { toNDecimals } from "shared/functions/web3";
import TransactionProgressModal from "shared/ui-kit/Modal/Modals/TransactionProgressModal";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import { TimeInput } from "shared/ui-kit/TimeInput";
import { PrimaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { getNFTBalanceFromMoralis } from "shared/services/API/balances/externalAPI";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import NFTSelectCard from "components/PriviDigitalArt/components/Cards/NFTSelectCard";
import { Dropdown } from "shared/ui-kit/Select/Select";
import { getPixUserMediasByBlockchainIds, savePixUserMedias } from "shared/services/API";

import { getNfts } from "shared/services/API";
import NFTCard from "components/PriviDigitalArt/subpages/MarketplacePage/components/NFTCard";

const removeIcon = require("assets/icons/remove_red.png");

const getRandomImageUrl = () => {
  return require(`assets/backgrounds/digital_art_1.png`);
};

const COLUMNS_COUNT_BREAK_POINTS_TWO = {
  800: 1,
  1440: 2,
};

const isProd = process.env.REACT_APP_ENV === "prod";

const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

const NFTLoansDeposit = ({ setOpenDepositPage }) => {
  const classes = useDepositPageStyles();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between(769, 960));
  const isMiniTablet = useMediaQuery(theme.breakpoints.between(700, 769));
  const isMobile = useMediaQuery(theme.breakpoints.down(700));

  const [status, setStatus] = useState<any>(""); // show status of the operation
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTransactionModal, setOpenTransactionModal] = useState<boolean>(false);

  const { showAlertMessage } = useAlertMessage();
  const user = useTypedSelector(state => state.user);

  const [loadingNFTS, setLoadingNFTS] = useState<boolean>(false);
  const [selectedNFT, setSelectedNFT] = useState<any>();

  const [userNFTs, setUserNFTs] = useState<any[]>([]);

  const [hash, setHash] = useState<string>("");
  const [network, setNetwork] = useState<string>("");

  const [interest, setInterest] = useState<string>("");
  const [reservePrice, setReservePrice] = useState<string>("");
  const currentTime = new Date();
  currentTime.setHours(new Date().getHours() + 1);
  const [expirationDate, setExpirationDate] = useState<Date>(currentTime);
  const [disableButton, setDisableButton] = useState<boolean>(false);

  const { account, library, chainId } = useWeb3React();

  const [chainIdCopy, setChainIdCopy] = useState<number>(chainId!);
  const [prevSelectedChain, setPrevSelectedChain] = useState<any>(
    filteredBlockchainNets.find(item => item.chainId === chainId) || filteredBlockchainNets[1]
  );
  const [selectedChain, setSelectedChain] = useState<any>(
    filteredBlockchainNets.find(item => item.chainId === chainId) || filteredBlockchainNets[1]
  );
  const [tokenList, setTokenList] = useState<string[]>(Object.keys(selectedChain.config.TOKEN_ADDRESSES));
  const [token, setToken] = useState<string>("USDT");

  // set token list according chain
  useEffect(() => {
    if (!selectedChain) return;
    setTokenList(Object.keys(selectedChain.config.TOKEN_ADDRESSES));
    setToken(Object.keys(selectedChain.config.TOKEN_ADDRESSES)[0]);
  }, [selectedChain]);

  useEffect(() => {
    loadNFT();
  }, [chainIdCopy]);

  useEffect(() => {
    const net = filteredBlockchainNets.find(item => item.chainId === chainId);
    if (net) {
      setSelectedChain(net);
      setChainIdCopy(net.chainId);
    }
  }, [chainId]);

  useEffect(() => {
    (async () => {
      if (chainId != selectedChain.chainId) {
        const changed = await switchNetwork(selectedChain.chainId);
        if (!changed) setSelectedChain(prevSelectedChain);
        else setChainIdCopy(selectedChain.chainId);
      }
    })();
  }, [selectedChain]);

  // sync metamask chain with dropdown chain selection and load nft balance from wallet
  const loadNFT = async () => {
    setLoadingNFTS(true);

    const response = await getNfts({
      mode: isProd ? "main" : "test",
      network: selectedChain.chainName,
    });
    if (response.success) {
      setUserNFTs(response.data);
    } else {
      showAlertMessage(`Can't fetch nfts`);
    }
    setLoadingNFTS(false);
  };

  const validate = () => {
    if (!interest || Number(interest) == NaN) {
      handleSetStatus(`Please input Interest`, "error", setStatus);
      return false;
    } else if (Number(interest) > 100 || Number(interest) <= 0) {
      handleSetStatus(`Interest should be between 1 and 100%`, "error", setStatus);
      return false;
    } else if (Number(reservePrice) <= 0) {
      handleSetStatus(`Please input Reserve Price`, "error", setStatus);
      return false;
    } else if (!selectedChain.value) {
      handleSetStatus(`Please select an NFT`, "error", setStatus);
      return false;
    } else if (!token) {
      handleSetStatus(`Please select a principal token`, "error", setStatus);
      return false;
    } else if (!selectedChain) {
      handleSetStatus(`Please select a chain`, "error", setStatus);
      return false;
    } else if (expirationDate.getTime() <= new Date().getTime()) {
      handleSetStatus(
        `Invalid expiration date. Expiration date should be later than now`,
        "error",
        setStatus
      );
      return false;
    } else if (!selectedNFT) {
      handleSetStatus(`Please select nft`, "error", setStatus);
      return false;
    }
    return true;
  };

  const handleDeposit = async () => {
    if (validate()) {
      //TODO: place bid
      setDisableButton(true);
      if (chainId && chainId !== selectedChain?.chainId) {
        const isHere = await switchNetwork(selectedChain?.chainId || 0);
        if (!isHere) {
          handleSetStatus(`Got failed while switching over to polygon netowrk`, "error", setStatus);
          setDisableButton(false);
          return;
        }
      }
      const web3APIHandler = selectedChain.apiHandler;
      const web3Config = selectedChain.config;
      const web3 = new Web3(library.provider);

      const startTimestamp = Math.ceil(new Date().getTime() / 1000);
      const endTimestamp = Math.ceil(new Date(expirationDate).getTime() / 1000);
      const decimals = await web3APIHandler.Erc20[token].decimals(web3);
      const startPrice = toNDecimals(reservePrice, decimals);

      handleOpenTransactionModal(selectedChain?.value);

      const tokenContractAddress = selectedNFT?.nftCollection?.address;
      const tokenId = selectedNFT?.nftTokenId;
      web3APIHandler.Erc721.setApprovalForAll(
        web3,
        account!,
        {
          operator: web3Config.CONTRACT_ADDRESSES.ERC721_COLLATRALISE_AUCTION,
          approve: true,
        },
        tokenContractAddress
      )
        .then(resp => {
          if (resp.success) {
            const createAuctionRequest = {
              tokenContractAddress: tokenContractAddress,
              tokenId: tokenId,
              startPrice: startPrice,
              startTimestamp: startTimestamp,
              endTimestamp: endTimestamp,
              fee: Number(interest),
              fundTokenAddress: web3Config.TOKEN_ADDRESSES[token],
            };
            web3APIHandler.Loan.createAuction(web3, account!, createAuctionRequest, setHash).then(
              async res => {
                if (res) {
                  const request = {
                    Available: 0,
                    Debt: 0,
                    TokenAddress: selectedNFT?.nftCollection.address,
                    TokenId: selectedNFT?.nftTokenId,
                    FundingToken: token,
                    Duration: endTimestamp - startTimestamp,
                    FeePct: Number(interest),
                    Bid: Number(reservePrice),
                    BidderAddress: "",
                    BlockchainNetwork: selectedChain.value,
                    CreatorAddress: user.address,
                    docType: "NftCollateral",
                    CreationDate: startTimestamp,
                  };
                  const response = await axios.post(`${URL()}/nftloan/collateralizeNFT`, request);
                  if (response.data.success) {
                    showAlertMessage("NFT deposited successfully: ", { variant: "success" });
                    setSelectedNFT(null);
                  } else {
                    showAlertMessage("NFT deposition failed: ", { variant: "error" });
                  }
                  setTransactionInProgress(false);
                  setTransactionSuccess(true);
                } else {
                  setTransactionInProgress(false);
                  setTransactionSuccess(false);
                }
                setDisableButton(false);
              }
            );
          } else {
            setTransactionInProgress(false);
            setTransactionSuccess(false);
            setDisableButton(false);
          }
        })
        .catch(e => {
          setDisableButton(false);
        });
    }
  };

  const handleOpenTransactionModal = network => {
    setOpenTransactionModal(true);
    setTransactionInProgress(true);
    setNetwork(network);
  };

  const handleCloseTransactionModal = () => {
    setOpenTransactionModal(false);
    setTransactionInProgress(false);
    setTransactionSuccess(false);
    setHash("");
    setNetwork("");
  };

  const [inputDate, setInputDate] = useState(expirationDate.getTime());

  const handleDateTime = (date: Date | null, isDate = true) => {
    if (date) {
      const existingDate = new Date(inputDate);
      let newDateStr;
      if (isDate) {
        newDateStr = `${date?.toLocaleDateString()} ${existingDate?.getHours()}:${existingDate?.getMinutes()}`;
        if (!isNaN(new Date(newDateStr).getTime())) {
          setInputDate(new Date(newDateStr).getTime());
        }
      } else {
        newDateStr = `${existingDate?.toLocaleDateString()} ${date?.getHours()}:${date?.getMinutes()}`;
        if (!isNaN(new Date(newDateStr).getTime())) {
          setInputDate(new Date(newDateStr).getTime());
        }
      }
      setExpirationDate(new Date(newDateStr));
    }
  };

  return (
    <div className={classes.root}>
      <BackButton purple overrideFunction={() => setOpenDepositPage(false)} />

      <h2 className={classes.title}>NFT Loans</h2>

      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <LoadingWrapper loading={loadingNFTS} theme={"blue"}>
            {userNFTs && userNFTs.length > 0 ? (
              <Box
                width={1}
                borderRadius={20}
                bgcolor="#EFF2FD"
                border="1px solid rgba(67, 26, 183, 0.24)"
                boxSizing="border-box"
                padding={isTablet || isMiniTablet || isMobile ? "41px 12px" : "41px 29px"}
              >
                <MasonryGrid
                  gutter={"12px"}
                  data={userNFTs}
                  renderItem={(item, index) => (
                    <NFTCard
                      item={item}
                      key={`item-${index}`}
                      handleSelect={() => {
                        if (userNFTs) {
                          let nftsCopy = [...userNFTs];
                          const selected = !userNFTs[index].selected;
                          nftsCopy[index] = {
                            ...userNFTs[index],
                            selected: !userNFTs[index].selected,
                          };
                          // only need one selected
                          if (selected) {
                            for (let i = 0; i < nftsCopy.length; i++) {
                              if (i != index) nftsCopy[i].selected = false;
                            }
                          }
                          setSelectedNFT({ index, ...nftsCopy[index] });
                          setUserNFTs(nftsCopy);
                        }
                      }}
                    />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_TWO}
                />
              </Box>
            ) : (
              <Box className={classes.emptyBox}>
                <img src={require("assets/pixImages/not_found_wallet.png")} />
                <Box className={classes.detailsLabel} mt={1}>
                  Not NFT found on your wallet.
                </Box>
              </Box>
            )}
          </LoadingWrapper>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.depositForm}>
            <Grid container spacing={2}>
              {selectedNFT && (
                <div className={classes.mediaDisplay}>
                  <div className={classes.leftSection}>
                    <div
                      className={classes.mediaImage}
                      style={{
                        backgroundImage: `url(${selectedNFT.nftPictureUrl || getRandomImageUrl()})`,
                      }}
                    />
                    {selectedNFT.nftName}
                  </div>
                  <span
                    onClick={() => {
                      let nftsCopy = userNFTs.map(nft => {
                        return { ...nft, selected: false };
                      });
                      setUserNFTs(nftsCopy);
                      setSelectedNFT(null);
                    }}
                  >
                    <img src={removeIcon} alt={"remove"} />
                  </span>
                </div>
              )}
              <Grid item xs={12} md={6}>
                <div className={classes.label}>Chain</div>
                <Dropdown
                  value={selectedChain.value}
                  menuList={LoanBlockchainNet}
                  onChange={e => {
                    setSelectedNFT(null);
                    setPrevSelectedChain(selectedChain);
                    setSelectedChain(filteredBlockchainNets.find(c => c.value === e.target.value));
                  }}
                  hasImage
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <div className={classes.label}>Principal Token</div>
                <TokenSelect
                  tokens={tokenList}
                  value={token}
                  onChange={e => {
                    setToken(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InputWithLabelAndTooltip
                  overriedClasses=""
                  type="number"
                  minValue={0}
                  onInputValueChange={e => {
                    let num = Number(e.target.value);
                    if (num != NaN) setReservePrice(num.toString());
                  }}
                  inputValue={reservePrice}
                  labelName={"Reserve Price"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InputWithLabelAndTooltip
                  overriedClasses=""
                  type="number"
                  minValue={0}
                  maxValue={100}
                  onInputValueChange={e => {
                    let num = Number(e.target.value);
                    if (num != NaN) setInterest(num.toString());
                  }}
                  inputValue={interest}
                  labelName={"Interest"}
                  endAdornment={<span>%</span>}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <div className={classes.label}>Expiration Date</div>
                <DateInput
                  id="date-picker-expiration-date"
                  minDate={new Date()}
                  format="MM.dd.yyyy"
                  placeholder="Select date..."
                  value={expirationDate}
                  onChange={e => {
                    handleDateTime(e);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <div className={classes.label}>Expiration Time</div>
                <TimeInput
                  minDate={new Date()}
                  format="HH:mm"
                  placeholder="Select time..."
                  value={expirationDate}
                  onChange={(date: Date | null) => handleDateTime(date, false)}
                />
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-end" mt="40px">
              <PrimaryButton
                className={classes.primaryBtn}
                disabled={disableButton}
                onClick={handleDeposit}
                size="medium"
              >
                Deposit now
              </PrimaryButton>
            </Box>
          </div>
        </Grid>
      </Grid>

      {status && <AlertMessage key={status.key} message={status.msg} variant={status.variant} />}
      <TransactionProgressModal
        open={openTransactionModal}
        onClose={handleCloseTransactionModal}
        transactionInProgress={transactionInProgress}
        transactionSuccess={transactionSuccess}
        hash={hash}
        network={network}
      />
    </div>
  );
};

export default NFTLoansDeposit;
