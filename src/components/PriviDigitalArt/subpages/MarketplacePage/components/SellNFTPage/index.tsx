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

const SellNFTPage = ({ goBack }) => {
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

  const [price, setPrice] = useState<number>(0);
  const [chainIdCopy, setChainIdCopy] = useState<number>(chainId!);

  const [prevSelectedChain, setPrevSelectedChain] = useState<any>(filteredBlockchainNets[1]);
  const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[1]);

  const [tokenList, setTokenList] = useState<string[]>(Object.keys(selectedChain.config.TOKEN_ADDRESSES));
  const [token, setToken] = useState<string>("USDT");

  const [hash, setHash] = useState<string>("");
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);

  const [openTransactionModal, setOpenTransactionModal] = useState<boolean>(false);

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

  const handleSellingOrder = async () => {
    if (!walletConnected) {
      showAlertMessage("Please connect your wallet first", { variant: "error" });
      return;
    }

    if (!validate()) {
      return;
    }

    const payload = {
      Address: user.address,
      ExchangeToken: selectedNFT.MediaSymbol,
      InitialAmount: 1,
      OfferToken: token,
      Price: price.toString(),
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
        operator: web3Config.CONTRACT_ADDRESSES.ERC721_TOKEN_EXCHANGE,
        approve: true,
      },
      selectedNFT.tokenAddress
    ).then(resp => {
      if (resp.success) {
        const tokenId = selectedNFT.BlockchainId;
        const createExchangeRequest = {
          input: {
            exchangeName: "erc721exchange",
            exchangeTokenAddress: selectedNFT.tokenAddress,
            offerTokenAddress: web3Config.TOKEN_ADDRESSES[token],
            tokenId: tokenId,
            price: price,
          },
          caller: account!,
        };
        web3APIHandler.Exchange.CreateERC721TokenExchange(
          web3,
          account!,
          createExchangeRequest,
          setHash
        ).then(async res => {
          if (res) {
            const exchange = res.data;
            const tx = res.transaction;
            const blockchainRes = { output: { Exchanges: {}, Transactions: {} } };
            blockchainRes.output.Exchanges[exchange.exchangeId] = {
              ...payload,
              CreatorAddress: user.address,
              Id: exchange.exchangeId,
              TokenId: tokenId,
              InitialOfferId: exchange.initialOfferId,
            };
            blockchainRes.output.Transactions[tx.Id] = [tx];
            const body = {
              BlockchainRes: blockchainRes,
              AdditionalData: {
                MediaType: selectedNFT.Type,
                MediaSymbol: selectedNFT.MediaSymbol,
              },
            };
            setTransactionInProgress(false);
            setTransactionSuccess(true);

            const response = await Axios.post(`${URL()}/exchange/createExchange/v2_p`, body);
            onAfterCreateExchange(response.data);
          } else {
            setTransactionInProgress(false);
            setTransactionSuccess(false);
          }
        });
      } else {
        onAfterCreateExchange(resp);

        setTransactionInProgress(false);
        setTransactionSuccess(false);
      }
    });
  };

  const onAfterCreateExchange = async (resp: any) => {
    if (resp?.success) {
      showAlertMessage("Selling order created successfully", { variant: "success" });
    } else {
      showAlertMessage("Selling order failed. Please try again", { variant: "error" });
    }
  };

  return (
    <div className={classes.root}>
      <BackButton purple overrideFunction={goBack} />
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <div className={classes.title}>Sell NFT</div>
        </Grid>
      </Grid>
      <Grid container spacing={isTablet || isMobile || isMiniTablet ? 1 : 3}>
        <Grid item xs={12} sm={isTablet || isMobile ? 12 : isMiniTablet ? 6 : 7}>
          <Box display="flex" flexDirection="column" height="100%">
            <div className={classes.text}>Select Media to Sell</div>
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
                    To Sell your NFTs you need first to connect your wallet.
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
                  <Box>
                    <Typography>Blockchain</Typography>
                    <Dropdown
                      value={selectedChain.value}
                      menuList={filteredBlockchainNets}
                      onChange={e => {
                        setPrevSelectedChain(selectedChain);
                        setSelectedChain(filteredBlockchainNets.find(c => c.value === e.target.value));
                      }}
                      hasImage
                    />
                  </Box>
                  <Grid container spacing={2} style={{ display: "flex", alignItems: "flex-end" }}>
                    <Grid item xs={12} md={6}>
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
                    <Grid item xs={12} md={6}>
                      <TokenSelect
                        tokens={tokenList}
                        value={token}
                        onChange={e => {
                          setToken(e.target.value);
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box mt="40px" display="flex" justifyContent="flex-end">
                    <button
                      disabled={!walletConnected}
                      className={classes.nftsButton}
                      onClick={handleSellingOrder}
                    >
                      Place Selling Order
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
              <Box>
                <Typography>Blockchain</Typography>
                <Dropdown
                  value={selectedChain.value}
                  menuList={filteredBlockchainNets}
                  onChange={e => {
                    setPrevSelectedChain(selectedChain);
                    setSelectedChain(filteredBlockchainNets.find(c => c.value === e.target.value));
                  }}
                  hasImage
                />
              </Box>
              <Grid
                container
                spacing={2}
                style={{ display: "flex", alignItems: "flex-end", marginTop: "16px" }}
              >
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
                  <TokenSelect
                    tokens={tokenList}
                    value={token}
                    onChange={e => {
                      setToken(e.target.value);
                    }}
                  />
                </Grid>
              </Grid>
              <Box mt="40px" display="flex" justifyContent="flex-end">
                <button className={classes.nftsButton} onClick={handleSellingOrder}>
                  Place Selling Order
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

const COLUMNS_COUNT_BREAK_POINTS_TWO = {
  1180: 2,
  1500: 3,
};

export default SellNFTPage;