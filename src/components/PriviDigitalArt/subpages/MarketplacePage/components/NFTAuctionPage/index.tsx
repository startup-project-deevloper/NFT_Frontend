import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { Grid, Typography, useMediaQuery, useTheme } from "@material-ui/core";

import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import { Color, StyledDivider } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { BlockchainNets } from "shared/constants/constants";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { getNFTBalanceFromMoralis } from "shared/services/API/balances/externalAPI";
import { switchNetwork } from "shared/functions/metamask";
import { useStyles } from "./index.styles";
import { saveExternallyFetchedNfts, getNftDataByTokenIds } from "shared/services/API/FractionalizeAPI";
import axios from "axios";
import URL from "shared/functions/getURL";
import NFTCard from "components/PriviDigitalArt/subpages/NFTFractionalisation/components/SyntheticFractionalise/NFTCard";
import { Dropdown } from "shared/ui-kit/Select/Select";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import { TimeInput } from "shared/ui-kit/TimeInput";
import Web3 from "web3";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import Axios from "axios";
import TransactionProgressModal from "shared/ui-kit/Modal/Modals/TransactionProgressModal";

// parse it to same format as fb collection
const parseMoralisData = async (data, address, selectedChain) => {
  let metadata: any = {};
  if (data.metadata) {
    metadata = JSON.parse(data.metadata);
  } else {
    if (data.token_uri && data.token_uri.startsWith("http")) {
      try {
        const { data: tokenResp } = await axios.post(`${URL()}/syntheticFractionalize/getTokenInfo`, {
          url: data.token_uri,
        });
        console.log("tokenResp", tokenResp);
        if (tokenResp.success) {
          metadata = tokenResp.data;
        }
      } catch (err) {}
    }
  }
  return {
    BlockchainId: data.token_id,
    BlockchainNetwork: selectedChain.value,
    Collabs: {},
    CreatorAddress: address,
    HasPhoto: metadata.image != undefined,
    Hashtags: [],
    MediaDescription: metadata.description,
    MediaName: metadata.name ? metadata.name : data.name ? data.name : data.symbol,
    MediaSymbol: data.symbol ? data.symbol : data.name,
    Type: "DIGITAL_ART_TYPE",
    Url: metadata.image,
    chainId: selectedChain.chainId,
    contractType: data.contract_type,
    tokenAddress: data.token_address,
    tokenURI: data.token_uri,
  };
};

const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const NFTAuctionPage = ({ goBack }) => {
  const classes = useStyles();
  const { showAlertMessage } = useAlertMessage();

  const user = useSelector((state: RootState) => state.user);

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between(769, 960));
  const isMiniTablet = useMediaQuery(theme.breakpoints.between(700, 769));
  const isMobile = useMediaQuery(theme.breakpoints.down(700));

  const [loadingnNFTS, setLoadingnNFTS] = useState<boolean>(false);
  const [userNFTs, setUserNFTs] = useState<any[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<any>();
  const { account, library, chainId } = useWeb3React();
  const [walletConnected, setWalletConnected] = useState<boolean>(!!account);

  const [chainIdCopy, setChainIdCopy] = useState<number>(chainId!);

  const [prevSelectedChain, setPrevSelectedChain] = useState<any>(filteredBlockchainNets[1]);
  const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[1]);

  const [tokenList, setTokenList] = useState<string[]>(Object.keys(selectedChain.config.TOKEN_ADDRESSES));
  const [token, setToken] = useState<string>("USDT");

  const [price, setPrice] = useState<number>(0);

  const [startDateTime, setStartDateTime] = useState<number>(new Date().getTime());
  const [endDateTime, setEndDateTime] = useState<number>(tomorrow.getTime());

  const [hash, setHash] = useState<string>("");
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);

  const [openTransactionModal, setOpenTransactionModal] = useState<boolean>(false);

  console.log(selectedNFT);
  // set token list according chain
  useEffect(() => {
    setTokenList(Object.keys(selectedChain.config.TOKEN_ADDRESSES));
    setToken(Object.keys(selectedChain.config.TOKEN_ADDRESSES)[0]);
  }, [selectedChain]);

  useEffect(() => {
    loadNFT();
  }, [chainIdCopy, selectedChain, account, walletConnected]);

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

  // sync metamask chain with dropdown chain selection and load nft balance from wallet
  const loadNFT = async () => {
    if (walletConnected) {
      const changed = await handleSyncChain();
      if (changed) {
        setLoadingnNFTS(true);
        const { result } = await getNFTBalanceFromMoralis(account!, selectedChain.chainId!);
        if (result) {
          const pixCreatedNftMap = {};
          const externallyCreatedNft: any[] = [];
          for (let obj of result) {
            const data = await parseMoralisData(obj, account, selectedChain);
            if (["PRIVIERC721", "PNR"].includes(data.MediaSymbol)) pixCreatedNftMap[data.BlockchainId] = data;
            else externallyCreatedNft.push(data);
          }
          // get pix created nft data from backend
          if (Object.keys(pixCreatedNftMap).length) {
            const resp = await getNftDataByTokenIds(Object.keys(pixCreatedNftMap));
            if (resp?.success) {
              let data = resp.data;
              Object.keys(data).forEach(k => {
                pixCreatedNftMap[k] = {
                  ...data[k],
                  tokenAddress: selectedChain.config.CONTRACT_ADDRESSES.PRIVIERC721,
                };
              });
            }
          }
          // save externally created nft to backend
          saveExternallyFetchedNfts(externallyCreatedNft);
          // set user nfts
          setUserNFTs([...Object.values(pixCreatedNftMap), ...externallyCreatedNft]);
        }
        setLoadingnNFTS(false);
      } else {
        setUserNFTs([]);
      }
    }
  };

  const handleConnectWallet = () => {
    setWalletConnected(true);
  };

  const validate = () => {
    if (!selectedNFT) {
      showAlertMessage("Please select a NFT", { variant: "error" });
      return false;
    } else if (!price || price <= 0) {
      showAlertMessage("Please enter a valid price", { variant: "error" });
      return false;
    }
    return true;
  };

  const handleStartAuction = async () => {
    if (!walletConnected) {
      showAlertMessage("Please connect your wallet first", { variant: "error" });
      return;
    }

    if (!validate()) {
      return;
    }

    const now = new Date().getTime();
    let endDate = new Date(endDateTime);
    let startDate = new Date(startDateTime);

    let startDateTimeInMs = startDate.getTime();
    if (startDateTimeInMs < now + 15 * 60 * 1000) {
      startDateTimeInMs = now + 15 * 60 * 1000;
    }
    let endDateTimeInMs = endDate.getTime();

    const payload = {
      MediaSymbol: selectedNFT.mediaSymbol,
      TokenSymbol: token,
      Owner: user.address,
      BidIncrement: "0",
      StartTime: Math.floor(startDateTimeInMs / 1000),
      EndTime: Math.floor(endDateTimeInMs / 1000),
      ReservePrice: price,
      IpfHash: "",
    };

    const web3APIHandler = selectedChain.apiHandler;
    const web3Config = selectedChain.config;
    const web3 = new Web3(library.provider);

    setOpenTransactionModal(true);
    setTransactionInProgress(true);

    web3APIHandler.Erc721.setApprovalForAll(
      web3,
      account!,
      {
        operator: web3Config.CONTRACT_ADDRESSES.ERC721_AUCTION,
        approve: true,
      },
      selectedNFT.tokenAddress
    ).then(resp => {
      if (resp.success) {
        const createAuctionRequest = {
          tokenAddress: selectedNFT.tokenAddress,
          tokenId: +selectedNFT.BlockchainId,
          mediaSymbol: selectedNFT.MediaSymbol,
          tokenSymbol: payload.TokenSymbol,
          bidToken: web3Config.TOKEN_ADDRESSES[token],
          reservePrice: payload.ReservePrice,
          ipfsHash: "0x7465737400000000000000000000000000000000000000000000000000000000",
          bidIncrement: payload.BidIncrement,
          startTime: payload.StartTime,
          endTime: payload.EndTime,
        };
        web3APIHandler.Auction.createAuction(web3, account!, createAuctionRequest, setHash).then(
          async res => {
            if (res) {
              const tx = res.transaction;
              const blockchainRes = { output: { Auctions: {}, Transactions: {} } };
              blockchainRes.output.Auctions[selectedNFT.MediaSymbol] = payload;
              blockchainRes.output.Transactions[tx.Id] = [tx];
              const body = {
                BlockchainRes: blockchainRes,
                AdditionalData: {
                  MediaSymbol: selectedNFT.MediaSymbol,
                  MediaType: selectedNFT.Type,
                },
              };

              setTransactionInProgress(false);
              setTransactionSuccess(true);

              const response = await Axios.post(`${URL()}/auction/createAuction/v2_p`, body);

              onAfterCreateAuction(response.data);
            } else {
              setTransactionInProgress(false);
              setTransactionSuccess(false);
            }
          }
        );
      } else {
        onAfterCreateAuction(resp);

        setTransactionInProgress(false);
        setTransactionSuccess(false);
      }
    });
  };

  const onAfterCreateAuction = async (resp: any) => {
    if (resp?.success) {
      showAlertMessage("Auction created successfully", { variant: "success" });
    } else {
      showAlertMessage("Auction creation failed. Please try again", { variant: "error" });
    }
  };

  return (
    <div className={classes.root}>
      <BackButton purple overrideFunction={goBack} />
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <div className={classes.title}>NFT Auction</div>
        </Grid>
      </Grid>
      <Grid container spacing={isTablet || isMobile || isMiniTablet ? 1 : 3}>
        <Grid item xs={12} sm={isTablet || isMobile ? 12 : isMiniTablet ? 6 : 7}>
          <Box display="flex" flexDirection="column" height="100%">
            <div className={classes.text}>Select Media to make an Auction</div>
            {walletConnected ? (
              <LoadingWrapper loading={loadingnNFTS} theme={"blue"}>
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
            ) : (
              <Grid container className={classes.walletRow}>
                <Grid item xs={12} md={6}>
                  <div>
                    <img src={require("assets/emojiIcons/icon_bell.png")} alt="bell" />
                    To make an Auction your NFTs you need first to connect your wallet.
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <button onClick={handleConnectWallet}>Connect Your Wallet</button>
                </Grid>
              </Grid>
            )}

            {(isTablet || isMobile) && (
              <Grid item xs={12} sm={12} style={{ marginTop: 24 }}>
                <div className={classes.nftsBox}>
                  <div className={classes.nftsTitle}>SELECTED NFT</div>
                  <StyledDivider type="solid" color={Color.GrayLight} margin={2} />
                  <div className={classes.detailsLabel}>You can only select one NFT</div>
                  <Grid container spacing={2} alignItems="flex-end">
                    <Grid item xs={12} lg={4}>
                      <Typography style={{ marginBottom: 8 }}>Blockchain</Typography>
                      <Dropdown
                        value={selectedChain.value}
                        menuList={filteredBlockchainNets}
                        onChange={e => {
                          setPrevSelectedChain(selectedChain);
                          setSelectedChain(filteredBlockchainNets.find(c => c.value === e.target.value));
                        }}
                        hasImage
                      />
                    </Grid>
                    <Grid item container xs={12} lg={8} alignItems="flex-end" spacing={2}>
                      <Grid item xs={6}>
                        <Typography>Price</Typography>
                        <InputWithLabelAndTooltip
                          inputValue={price}
                          minValue={0}
                          required
                          type="number"
                          onInputValueChange={e => setPrice(Number(e.target.value))}
                          theme="light"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TokenSelect
                          tokens={tokenList}
                          value={token}
                          onChange={e => {
                            setToken(e.target.value);
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Box mt={2}>
                    <DateAndHourSelect
                      value={startDateTime}
                      setValue={v => setStartDateTime(v)}
                      label={"Start"}
                    />
                    <DateAndHourSelect value={endDateTime} setValue={v => setEndDateTime(v)} label={"End"} />
                  </Box>
                  <Box mt="40px" display="flex" justifyContent="flex-end">
                    <button
                      disabled={!walletConnected || !selectedNFT}
                      className={classes.nftsButton}
                      onClick={handleStartAuction}
                    >
                      Start Auction
                    </button>
                  </Box>
                </div>
              </Grid>
            )}
          </Box>
        </Grid>
        {!isTablet && !isMobile && (
          <Grid item xs={12} sm={isMiniTablet ? 6 : 5}>
            <div className={classes.nftsBox}>
              <div className={classes.nftsTitle}>SELECTED NFT</div>
              <StyledDivider type="solid" color={Color.GrayLight} margin={2} />
              <div className={classes.detailsLabel}>You can only select one NFT</div>
              <Grid container spacing={2} alignItems="flex-end">
                <Grid item xs={12} lg={4}>
                  <Typography style={{ marginBottom: 8 }}>Blockchain</Typography>
                  <Dropdown
                    value={selectedChain.value}
                    menuList={filteredBlockchainNets}
                    onChange={e => {
                      setPrevSelectedChain(selectedChain);
                      setSelectedChain(filteredBlockchainNets.find(c => c.value === e.target.value));
                    }}
                    hasImage
                  />
                </Grid>
                <Grid item container xs={12} lg={8} alignItems="flex-end" spacing={2}>
                  <Grid item xs={6}>
                    <Typography>Price</Typography>
                    <InputWithLabelAndTooltip
                      inputValue={price}
                      minValue={0}
                      required
                      type="number"
                      onInputValueChange={e => setPrice(Number(e.target.value))}
                      theme="light"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TokenSelect
                      tokens={tokenList}
                      value={token}
                      onChange={e => {
                        setToken(e.target.value);
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Box mt={2}>
                <DateAndHourSelect
                  value={startDateTime}
                  setValue={v => setStartDateTime(v)}
                  label={"Start"}
                />
                <DateAndHourSelect value={endDateTime} setValue={v => setEndDateTime(v)} label={"End"} />
              </Box>
              <Box mt="40px" display="flex" justifyContent="flex-end">
                <button
                  className={classes.nftsButton}
                  onClick={handleStartAuction}
                  disabled={!walletConnected || !selectedNFT}
                >
                  Start Auction
                </button>
              </Box>
            </div>
          </Grid>
        )}
      </Grid>
      <TransactionProgressModal
        open={openTransactionModal}
        onClose={() => {
          setOpenTransactionModal(false);
        }}
        transactionInProgress={transactionInProgress}
        transactionSuccess={transactionSuccess}
        hash={hash}
        network={selectedChain?.value}
      />
    </div>
  );
};

type DateAndHourSelectProps = {
  value: number;
  setValue: (v: number) => void;
  label: string;
};

const DateAndHourSelect: React.FunctionComponent<DateAndHourSelectProps> = ({ value, setValue, label }) => {
  const classes = useStyles();
  const [inputDate, setInputDate] = useState(value);

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
      setValue(new Date(newDateStr).getTime());
    }
  };

  return (
    <div className={classes.dateHourSelect}>
      <div className="col">
        <Typography>{label} Date</Typography>
        <DateInput
          minDate={new Date()}
          format="MM.dd.yyyy"
          placeholder="Select date..."
          value={value}
          onChange={(date: Date | null) => handleDateTime(date)}
          height={40}
        />
      </div>

      <div className="col">
        <Typography>{label} Time</Typography>
        <TimeInput
          minDate={new Date()}
          format="HH:mm"
          placeholder="Select time..."
          value={value}
          onChange={(date: Date | null) => handleDateTime(date, false)}
          height={40}
        />
      </div>
    </div>
  );
};

const COLUMNS_COUNT_BREAK_POINTS_TWO = {
  1180: 2,
  1500: 3,
};

export default NFTAuctionPage;
