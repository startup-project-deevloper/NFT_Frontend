import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
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
import { LoanBlockchainNet } from "shared/constants/constants";
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

const removeIcon = require("assets/icons/remove_red.png");

const getRandomImageUrl = () => {
  return require(`assets/backgrounds/digital_art_1.png`);
};

const COLUMNS_COUNT_BREAK_POINTS_TWO = {
  800: 1,
  1440: 2,
};

const NFTLoansDeposit = ({ setOpenDepositPage }) => {
  const classes = useDepositPageStyles();

  const [status, setStatus] = useState<any>(""); // show status of the operation
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTransactionModal, setOpenTransactionModal] = useState<boolean>(false);

  const { showAlertMessage } = useAlertMessage();
  const user = useTypedSelector(state => state.user);

  const [loadingnNFTS, setLoadingnNFTS] = useState<boolean>(false);
  const [userNFTs, setUserNFTs] = useState<any[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<any>();

  const [hash, setHash] = useState<string>("");
  const [network, setNetwork] = useState<string>("");

  const [prevSelectedChain, setPrevSelectedChain] = useState<any>(LoanBlockchainNet[0]);
  const [selectedChain, setSelectedChain] = useState<any>(LoanBlockchainNet[0]);
  const [token, setToken] = useState<string>("");
  const [tokenList, setTokenList] = useState<string[]>(Object.keys(selectedChain.config.TOKEN_ADDRESSES));

  const [interest, setInterest] = useState<string>("");
  const [reservePrice, setReservePrice] = useState<string>("");
  const currentTime = new Date();
  currentTime.setHours(new Date().getHours() + 1);
  const [expirationDate, setExpirationDate] = useState<Date>(currentTime);
  const [disableButton, setDisableButton] = useState<boolean>(false);

  const { account, library, chainId } = useWeb3React();
  const [chainIdCopy, setChainIdCopy] = useState<number>(chainId!);
  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  const [imageIPFS, setImageIPFS] = useState({});

  const getImageIPFS = async (cid: string) => {
    let files = await onGetNonDecrypt(cid, async (fileCID, download) => {
      return await downloadWithNonDecryption(fileCID, download);
    });
    if (files) {
      let base64String = _arrayBufferToBase64(files.content);
      setImageIPFS("data:image/png;base64," + base64String);
      return "data:image/png;base64," + base64String;
    }
    return "";
  };

  useEffect(() => {
    if (selectedMedia?.cid) {
      getImageIPFS(selectedMedia.cid);
    }
  }, [ipfs, selectedMedia]);

  useEffect(() => {
    const connectedChain = LoanBlockchainNet.find(chain => chain.chainId === chainId);
    if (connectedChain && connectedChain.chainId !== selectedChain.chainId) {
      setSelectedChain(connectedChain);
    }
  }, []);

  useEffect(() => {
    (async () => {
      let changed = true;
      if (prevSelectedChain.chainId !== selectedChain.chainId) {
        changed = await handleSyncChain();
      }
      if (changed) {
        setLoadingnNFTS(true);
        const { result: nfts } = await getNFTBalanceFromMoralis(account!, selectedChain.chainId!);
        if (nfts) {
          let parsedNFTData = nfts.map(nft => parseMoralisData(nft, account, selectedChain));
          let priviNFTData = parsedNFTData.filter(
            nft =>
              nft.MediaSymbol === "PRIVIERC721" || nft.MediaSymbol === "PNR" || nft.MediaSymbol === "PNFT"
          );
          let exNFTData = parsedNFTData.filter(
            nft =>
              nft.MediaSymbol !== "PRIVIERC721" && nft.MediaSymbol !== "PNR" && nft.MediaSymbol !== "PNFT"
          );

          const priviNFTIds = priviNFTData
            .map(nft => nft.BlockchainId)
            .filter((id, index, ids) => ids.indexOf(id) == index);
          const resp = await getPixUserMediasByBlockchainIds(priviNFTIds, selectedChain.value);
          if (resp && resp.success) {
            priviNFTData = resp.data.filter(
              nftData =>
                !nftData.HasNFTLoan &&
                nftData.NftConditions &&
                nftData.NftConditions.Price !== 0 &&
                nftData.NftConditions.Price !== "0"
            );
          } else {
            priviNFTData = [];
          }

          setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");

          priviNFTData = await Promise.all(
            priviNFTData.map(async nft => {
              let cidUrl = "";
              if (nft.cid) {
                cidUrl = await getImageIPFS(nft.cid);
              }
              return { ...nft, cidUrl };
            })
          );
          savePixUserMedias(exNFTData);
          setUserNFTs([...priviNFTData, ...exNFTData]);
        }
        setLoadingnNFTS(false);
      } else {
        setUserNFTs([]);
      }
    })();
  }, [chainIdCopy, selectedChain.chainId, account]);

  // set token list according chain
  useEffect(() => {
    setTokenList(Object.keys(selectedChain.config.TOKEN_ADDRESSES));
  }, [selectedChain]);

  // sync selected chain with metamask chain
  const handleSyncChain = async () => {
    if (chainId != selectedChain.chainId) {
      const changed = await switchNetwork(selectedChain.chainId);
      if (!changed) setSelectedChain(prevSelectedChain);
      else setChainIdCopy(selectedChain.chainId);
      return changed;
    }
    return true;
  };

  // parse it to same format as fb collection
  const parseMoralisData = (data, address, selectedChain) => {
    const metadata = data.metadata ? JSON.parse(data.metadata) : {};
    return {
      BlockchainId: data.token_id,
      BlockchainNetwork: selectedChain.value,
      Collabs: {},
      CreatorId: user?.id,
      CreatorAddress: address,
      HasPhoto: metadata.image != undefined,
      Hashtags: [],
      MediaDescription: metadata.description,
      MediaName: data.name ? data.name : data.symbol,
      MediaSymbol: data.symbol ? data.symbol : data.name,
      Type: "DIGITAL_ART_TYPE",
      Url: metadata.image,
      chainId: selectedChain.chainId,
      contractType: data.contract_type,
      TokenContractAddress: data.token_address,
    };
  };

  useEffect(() => {
    (async () => {
      const newNFTs = await Promise.all(
        userNFTs.map(async nft => {
          if (nft.cid) {
            const cidUrl = nft.cid ? await getImageIPFS(nft.cid) : "";
            return { ...nft, cidUrl };
          }
        })
      );
      setUserNFTs(newNFTs);
    })();
  }, [ipfs]);

  useEffect(() => {
    if (tokenList.length > 0) {
      setToken(tokenList[0]);
    }
  }, [tokenList]);

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
    } else if (!selectedMedia) {
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
      const mediaSymbol = selectedMedia?.MediaSymbol;

      handleOpenTransactionModal(selectedChain?.value);

      const tokenContractAddress =
        selectedMedia?.TokenContractAddress || web3Config.CONTRACT_ADDRESSES.PRIVIERC721;
      const tokenId = selectedMedia?.BlockchainId;
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
            web3APIHandler.Loan.createAuction(web3, account!, createAuctionRequest).then(async res => {
              if (res) {
                const tx = res.transaction;
                const blockchainRes = { output: { UpdateNftCollaterals: {}, Transactions: {} } };
                blockchainRes.output.UpdateNftCollaterals[mediaSymbol] = {
                  Available: 0,
                  Debt: 0,
                  TokenSymbol: mediaSymbol,
                  FundingToken: token,
                  Duration: endTimestamp - startTimestamp,
                  FeePct: Number(interest),
                  Bid: Number(reservePrice),
                  BidderAddress: "",
                  PodAddress: "",
                  Chain: selectedChain.name,
                  CreatorAddress: user.address,
                  docType: "NftCollateral",
                  CreationDate: startTimestamp,
                };
                blockchainRes.output.Transactions[tx.Id] = [tx];
                const body = {
                  BlockchainRes: blockchainRes,
                  AdditionalData: {
                    MediaSymbol: mediaSymbol,
                    Address: user.address,
                  },
                };
                setHash(tx.Id);
                const response = await axios.post(`${URL()}/nftloan/collateralizeNFT/v2_p`, body);
                if (response.data.success) {
                  showAlertMessage("NFT deposited successfully: ", { variant: "success" });
                  setUserNFTs(userNFTs.filter(media => media.MediaSymbol !== selectedMedia?.MediaSymbol));
                  setSelectedMedia(null);
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
            });
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

  const handleNFTSelect = (mediaSymbol: string) => {
    if (userNFTs) {
      let nftsCopy = [...userNFTs];
      const index = userNFTs.findIndex(nft => nft.MediaSymbol === mediaSymbol);
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
        setSelectedMedia(nftsCopy[index]);
      } else {
        setSelectedMedia(null);
      }
      setUserNFTs(nftsCopy);
    }
  };
  return (
    <div className={classes.root}>
      <BackButton purple overrideFunction={() => setOpenDepositPage(false)} />

      <h2 className={classes.title}>NFT Loans</h2>

      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <LoadingWrapper loading={loadingnNFTS} theme={"blue"} height="calc(100vh - 200px)">
            <MasonryGrid
              gutter={"24px"}
              data={userNFTs}
              renderItem={(item, index) => (
                <NFTSelectCard item={item} key={`item-${index}`} handleSelect={handleNFTSelect} />
              )}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_TWO}
            />
          </LoadingWrapper>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.depositForm}>
            <Grid container spacing={2}>
              {selectedMedia && (
                <div className={classes.mediaDisplay}>
                  <div className={classes.leftSection}>
                    <div
                      className={classes.mediaImage}
                      style={{
                        backgroundImage: `url(${
                          selectedMedia.cid
                            ? imageIPFS
                            : selectedMedia.Type && selectedMedia.Type !== "DIGITAL_ART_TYPE"
                            ? selectedMedia.UrlMainPhoto
                            : selectedMedia.UrlMainPhoto ??
                              selectedMedia.Url ??
                              selectedMedia.url ??
                              getRandomImageUrl()
                        })`,
                      }}
                    />
                    {selectedMedia.MediaName ?? selectedMedia.name ?? selectedMedia.MediaSymbol}
                  </div>
                  <span
                    onClick={() => {
                      let nftsCopy = userNFTs.map(nft => {
                        return { ...nft, selected: false };
                      });
                      setUserNFTs(nftsCopy);
                      setSelectedMedia(null);
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
                    setPrevSelectedChain(selectedChain);
                    setSelectedMedia(null);
                    setSelectedChain(LoanBlockchainNet.find(c => c.value === e.target.value));
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
