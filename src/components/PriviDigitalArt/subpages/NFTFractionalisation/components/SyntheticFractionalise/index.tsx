import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Grid, useMediaQuery, useTheme } from "@material-ui/core";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import { Color, StyledDivider } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import NFTSelectCard from "components/PriviDigitalArt/components/Cards/NFTSelectCard";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { BlockchainNets } from "shared/constants/constants";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import Web3 from "web3";
import { getNFTBalanceFromMoralis } from "shared/services/API/balances/externalAPI";
import { switchNetwork } from "shared/functions/metamask";
import { useFractionaliseStyles, PurpleSlider } from "./index.styles";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import { saveExternallyFetchedNfts, getNftDataByTokenIds, mint } from "shared/services/API/FractionalizeAPI";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import NFTCard from "./NFTCard";
import { FractionaliseModal } from "../../modals/FractionaliseModal";

// parse it to same format as fb collection
const parseMoralisData = (data, address, selectedChain) => {
  const metadata = data.metadata ? JSON.parse(data.metadata) : {};
  return {
    BlockchainId: data.token_id,
    BlockchainNetwork: selectedChain.value,
    Collabs: {},
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
    tokenAddress: data.token_address,
  };
};

const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

const SyntheticFractionalise = ({ goBack, isSynthetic = false }) => {
  const classes = useFractionaliseStyles();
  const { showAlertMessage } = useAlertMessage();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down(960));
  const [loadingnNFTS, setLoadingnNFTS] = useState<boolean>(false);
  const [userNFTs, setUserNFTs] = useState<any[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<any>();
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [prevSelectedChain, setPrevSelectedChain] = useState<any>(filteredBlockchainNets[1]);
  const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[1]);
  const [supply, setSupply] = useState<string>("");
  const [initialPrice, setInitialPrice] = useState<string>("");
  const [minUnlockingDate, setMinUnlockingDate] = useState<string>(new Date().toDateString());
  const [symbol, setSymbol] = useState<string>("");
  const { account, library, chainId } = useWeb3React();
  const [chainIdCopy, setChainIdCopy] = useState<number>(chainId!);
  const [openFractionaliseModal, setOpenFractionaliseModal] = useState<boolean>(false);

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
            const data = parseMoralisData(obj, account, selectedChain);
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
    // if (!name) {
    //   showAlertMessage("Please enter a valid name", { variant: "error" });
    //   return false;
    // } else if (!symbol) {
    //   showAlertMessage("Please enter a valid symbol", { variant: "error" });
    //   return false;
    // } else
    if (!selectedNFT) {
      showAlertMessage("Please select a NFT", { variant: "error" });
      return false;
    } else if (!initialPrice || !Number(initialPrice)) {
      showAlertMessage("Please enter a valid initial fraction price", { variant: "error" });
      return false;
    } else if (!supply || !Number(supply)) {
      showAlertMessage("Please enter a valid supply", { variant: "error" });
      return false;
    }
    //  else if (!minUnlockingDate) {
    //   showAlertMessage("Please set Minimum Unlocking Date", { variant: "error" });
    //   return false;
    // }
    return true;
  };

  const handleFractionalise = async () => {
    if (!walletConnected) {
      showAlertMessage("Please connect your wallet first", { variant: "error" });
      return;
    }
    if (validate()) {
      setOpenFractionaliseModal(true);
      // setLoading(true);
      // await handleSyncChain();
      // const web3 = new Web3(library.provider);
      // const payload = {
      //   name,
      //   symbol,
      //   token: selectedNFT.tokenAddress,
      //   id: Number(selectedNFT.BlockchainId),
      //   supply,
      //   asset: selectedChain.config.TOKEN_ADDRESSES[reservePriceToken],
      //   listPrice: reservePrice,
      //   fee: managementFee,
      //   // extra data
      //   ownerAddress: account,
      //   listToken: reservePriceToken,
      //   MediaSymbol: selectedNFT.MediaSymbol,
      //   chainId: chainId,
      // };
      // const resp = await selectedChain.apiHandler.Erc721.setApprovalForAll2(web3, account!, "ERC721_VAULT_FACTORY", selectedNFT.tokenAddress);
      // if (resp?.success) {
      //   const mintResp = await selectedChain.apiHandler.VaultFactory.mint(web3, account!, payload);
      //   if (mintResp?.success) {
      //     const data = {
      //       ...payload,
      //       ...mintResp.data,
      //     };
      //     const backendResp = await mint(data);
      //     if (backendResp?.success) {
      //       showAlertMessage("NFT successfully fractionalized", { variant: "success" });
      //       goBack();
      //     }
      //   }
      //   else {
      //     showAlertMessage("NFT failed to be fractionalized", { variant: "error" });
      //   }
      // }
      // setLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      <BackButton purple overrideFunction={goBack} />
      <div className={classes.title}>
        Synthetic Fractionalise your NFT
      </div>
      <Grid container spacing={5}>
        <Grid item xs={12} md={6}>
          <div className={classes.text}>
            Lock your NFT, get a synthetic copy, fractionalise it, create a derivative and get interest out of the trading fees.
          </div>
          {!walletConnected && (
            <div className={classes.walletRow}>
              <div>
                <img src={require("assets/emojiIcons/icon_bell.png")} alt="bell" />
                To Synthetic Fractionalise your NFTs you need first to connect your wallet.
              </div>
              <button onClick={handleConnectWallet}>Connect Your Wallet</button>
            </div>
          )}

          {isTablet && (
            <Grid item xs={12} md={6}>
              <div className={classes.nftsBox}>
                <div className={classes.nftsTitle}>
                  {isSynthetic ? "SELECTED NFT" : "SELECTED NFTS"}{" "}
                  {!isSynthetic && <span>{userNFTs?.filter(n => n.selected)?.length ?? 0}</span>}
                </div>
                {isSynthetic && (
                  <div className={classes.text} style={{ textAlign: "center" }}>
                    You can only select one NFT
                  </div>
                )}
                <StyledDivider type="solid" color={Color.GrayLight} margin={2} />
                <div className={classes.detailsLabel}>NFT Fractions details</div>
                <Grid container spacing={2} style={{ display: "flex", alignItems: "flex-end" }}>
                  {/* <Grid item xs={12} md={6}>
                    <InputWithLabelAndTooltip
                      labelName="Name"
                      inputValue={name}
                      placeHolder={"Name..."}
                      required
                      type="text"
                      onInputValueChange={e => setName(e.target.value)}
                      theme="light"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InputWithLabelAndTooltip
                      labelName="Symbol"
                      inputValue={symbol}
                      placeHolder={"Symbol..."}
                      required
                      type="text"
                      onInputValueChange={e => setSymbol(e.target.value)}
                      theme="light"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <label>Blockchain</label>
                    <Dropdown
                      value={selectedChain.value}
                      menuList={filteredBlockchainNets}
                      onChange={e => {
                        setPrevSelectedChain(selectedChain);
                        setSelectedChain(filteredBlockchainNets.find(c => c.value === e.target.value));
                      }}
                      hasImage
                    />
                  </Grid> */}
                  <Grid item xs={12} md={12}>
                    <InputWithLabelAndTooltip
                      labelName="Initial Fraction Price"
                      inputValue={!initialPrice ? "" : initialPrice.toString()}
                      minValue={0}
                      required
                      type="number"
                      onInputValueChange={e => setInitialPrice(e.target.value)}
                      theme="light"
                    />
                  </Grid>
                  <Grid item xs={12} md={12} className={classes.shortLabel}>
                    <InputWithLabelAndTooltip
                      labelName="Your NFT will be fractionalised in 10000 JOTs. How many of them do you want to keep?"
                      inputValue={!supply ? "" : supply.toString()}
                      minValue={0}
                      required
                      type="number"
                      onInputValueChange={e => setSupply(e.target.value)}
                      theme="light"
                    />
                  </Grid>
                  {/* <Grid item xs={12} md={12}>
                    <div className={classes.label}>Minimum Unlocking Date</div>
                    <DateInput
                      minDate={new Date()}
                      format="MM.dd.yyyy"
                      value={minUnlockingDate}
                      onChange={e => {
                        setMinUnlockingDate(e);
                      }}
                    />
                  </Grid>
                  <Box className={classes.description}>Early withdrawal will have a penalty</Box> */}
                  <Grid item xs={12} md={12}>
                    <Box className={classes.borderBox}>
                      A Synthetic NFT will be received when the NFT gets locked and validated.
                      <b> You can earn from fees coming from liquidity pool and derivative trading</b>
                    </Box>
                  </Grid>
                </Grid>

                <Box mt="40px" display="flex" justifyContent="flex-end">
                  <button
                    disabled={!walletConnected}
                    className={classes.nftsButton}
                    onClick={handleFractionalise}
                  >
                    Continue
                  </button>
                </Box>
              </div>
            </Grid>
          )}

          {walletConnected && (
            <LoadingWrapper loading={loadingnNFTS} theme={"blue"}>
              {userNFTs && userNFTs.length > 0 ? (
                <MasonryGrid
                  gutter={"24px"}
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
                          setSelectedNFT(nftsCopy[index]);
                          setUserNFTs(nftsCopy);
                        }
                      }}
                    />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_TWO}
                />
              ) : (
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Box className={classes.emptyBox}>
                    <Box>😞</Box>
                    <Box className={classes.detailsLabel} mt={1}>
                      Not NFT found on your wallet.
                    </Box>
                  </Box>
                </Box>
              )}
            </LoadingWrapper>
          )}
        </Grid>
        {!isTablet && (
          <Grid item xs={12} md={6}>
            <div className={classes.nftsBox}>
              <div className={classes.nftsTitle}>
                {isSynthetic ? "SELECTED NFT" : "SELECTED NFTS"}{" "}
                {!isSynthetic && <span>{userNFTs?.filter(n => n.selected)?.length ?? 0}</span>}
              </div>
              {isSynthetic && (
                <div className={classes.text} style={{ textAlign: "center" }}>
                  You can only select one NFT
                </div>
              )}
              <StyledDivider type="solid" color={Color.GrayLight} margin={2} />
              <div className={classes.detailsLabel}>NFT Fractions details</div>
              <Grid container spacing={2} style={{ display: "flex", alignItems: "flex-end" }}>
                {/* <Grid item xs={12} md={6}>
                  <InputWithLabelAndTooltip
                    labelName="Name"
                    inputValue={name}
                    placeHolder={"Name..."}
                    required
                    type="text"
                    onInputValueChange={e => setName(e.target.value)}
                    theme="light"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <label>Blockchain</label>
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
                <Grid item xs={12} md={6}>
                  <InputWithLabelAndTooltip
                    labelName="Symbol"
                    inputValue={symbol}
                    placeHolder={"Symbol..."}
                    required
                    type="text"
                    onInputValueChange={e => setSymbol(e.target.value)}
                    theme="light"
                  />
                </Grid>*/}
                <Grid item xs={12} md={12}>
                  <InputWithLabelAndTooltip
                    labelName="Initial Fraction Price"
                    inputValue={!initialPrice ? "" : initialPrice.toString()}
                    minValue={0}
                    required
                    type="number"
                    onInputValueChange={e => setInitialPrice(e.target.value)}
                    theme="light"
                  />
                </Grid>
                <Grid item xs={12} md={12} className={classes.shortLabel}>
                  <InputWithLabelAndTooltip
                    labelName="Your NFT will be fractionalised in 10000 JOTs. How many of them do you want to keep?"
                    inputValue={!supply ? "" : supply.toString()}
                    minValue={0}
                    required
                    type="number"
                    onInputValueChange={e => setSupply(e.target.value)}
                    theme="light"
                  />
                </Grid>

                {/* <Grid item xs={12} md={12}>
                  <div className={classes.label}>Minimum Unlocking Date</div>
                  <DateInput
                    minDate={new Date()}
                    format="MM.dd.yyyy"
                    value={minUnlockingDate}
                    onChange={e => {
                      setMinUnlockingDate(e);
                    }}
                  />
                </Grid>
                <Box className={classes.description}>Early withdrawal will have a penalty</Box>
                */}
                <Grid item xs={12} md={12}>
                  <Box className={classes.borderBox}>
                    A Synthetic NFT will be received when the NFT gets locked and validated.
                    <b> You can earn from fees coming from liquidity pool and derivative trading</b>
                  </Box>
                </Grid>
              </Grid>
              <Box mt="40px" display="flex" justifyContent="flex-end">
                <button className={classes.nftsButton} onClick={handleFractionalise}>
                  Continue
                </button>
              </Box>
            </div>
          </Grid>
        )}
      </Grid>
      {openFractionaliseModal && (
        <FractionaliseModal
          open={openFractionaliseModal}
          onClose={() => setOpenFractionaliseModal(false)}
          selectedNFT={selectedNFT}
          supplyToKeep={supply}
          priceFraction={initialPrice}
        />
      )}
    </div>
  );
};

const COLUMNS_COUNT_BREAK_POINTS_TWO = {
  800: 1,
  1440: 2,
};

export default SyntheticFractionalise;
