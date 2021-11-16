import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { Grid, useMediaQuery, useTheme } from "@material-ui/core";

import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import { Color, StyledDivider } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { BlockchainNets } from "shared/constants/constants";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { useFractionaliseStyles } from "./index.styles";
import NFTCard from "./NFTCard";
import { FractionaliseModal } from "../../modals/FractionaliseModal";
import axios from "axios";
import URL from "shared/functions/getURL";
import { sanitizeIfIpfsUrl } from "shared/helpers/utils";
import { getMySyntheticFractionalisedNFT } from "shared/services/API/SyntheticFractionalizeAPI";
import { getNfts } from "shared/services/API";

const isProd = process.env.REACT_APP_ENV === "prod";

// parse it to same format as fb collection
const parseMoralisData = async (data, address, selectedChain) => {
  let metadata: any = {};
  if (data.metadata) {
    metadata = JSON.parse(data.metadata);
  } else {
    const tokenURI = sanitizeIfIpfsUrl(data.token_uri ?? "");
    if (tokenURI && tokenURI.startsWith("http")) {
      try {
        const { data: tokenResp } = await axios.post(`${URL()}/syntheticFractionalize/getTokenInfo`, {
          url: tokenURI,
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
    HasPhoto: metadata.image != undefined || metadata.image_url != undefined,
    Hashtags: [],
    MediaDescription: metadata.description,
    MediaName: metadata.name ? metadata.name : data.name ? data.name : data.symbol,
    MediaSymbol: data.symbol ? data.symbol : data.name,
    Type: "DIGITAL_ART_TYPE",
    Url: metadata.image ?? metadata.image_url,
    chainId: selectedChain.chainId,
    contractType: data.contract_type,
    tokenAddress: data.token_address,
    tokenURI: data.token_uri,
  };
};

const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

const SyntheticFractionalise = ({ goBack, isSynthetic = false }) => {
  const classes = useFractionaliseStyles();
  const { showAlertMessage } = useAlertMessage();

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between(769, 960));
  const isMiniTablet = useMediaQuery(theme.breakpoints.between(700, 769));
  const isMobile = useMediaQuery(theme.breakpoints.down(700));

  const [loadingNFTS, setLoadingNFTS] = useState<boolean>(false);
  const [userNFTs, setUserNFTs] = useState<any[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<any>();
  const { account, library, chainId } = useWeb3React();
  const [walletConnected, setWalletConnected] = useState<boolean>(!!account);
  const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[1]);
  const [supply, setSupply] = useState<string>("");
  const [initialPrice, setInitialPrice] = useState<string>("");
  const [chainIdCopy, setChainIdCopy] = useState<number>(chainId!);
  const [openFractionaliseModal, setOpenFractionaliseModal] = useState<boolean>(false);
  const [fractionaliseSuccessed, setFractionaliseSuccessed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadNFT();
  }, [chainIdCopy, walletConnected]);

  const loadNFT = async () => {
    if (walletConnected) {
      setLoadingNFTS(true);
      let myNFTs: any[] = [];
      const res = await getMySyntheticFractionalisedNFT();
      if (res.success) {
        myNFTs = res.nfts.filter(nft => !nft.isUnlocked) ?? [];
      }
      const response = await getNfts({
        mode: isProd ? "main" : "test",
        network: selectedChain.chainName,
      });
      if (response.success) {
        setUserNFTs(
          response.data.filter(
            item =>
              !myNFTs.find(
                nft => nft.collection_id === item.nftCollection.address && nft.NftId == item.nftTokenId
              )
          )
        );
      } else {
        showAlertMessage(`Can't fetch nfts`);
      }
      setLoadingNFTS(false);
    }
  };

  const handleConnectWallet = () => {
    setWalletConnected(true);
  };

  const validate = () => {
    if (!selectedNFT) {
      showAlertMessage("Please select a NFT", { variant: "error" });
      return false;
    } else if (!initialPrice || Number(initialPrice) <= 0) {
      showAlertMessage("Please enter a valid initial fraction price", { variant: "error" });
      return false;
    } else if (+supply > 10000) {
      showAlertMessage("Please enter a valid JOTs number(< 10000)", { variant: "error" });
      return false;
    }
    return true;
  };

  const handleFractionalise = async () => {
    if (!walletConnected) {
      showAlertMessage("Please connect your wallet first", { variant: "error" });
      return;
    }
    if (validate()) {
      setOpenFractionaliseModal(true);
    }
  };

  const fractionaliseSuccess = () => {
    setUserNFTs(userNFTs.filter((_, index) => index !== selectedNFT.index));
    setFractionaliseSuccessed(true);
  };

  const fractionaliseClose = () => {
    setOpenFractionaliseModal(false);
    if (fractionaliseSuccessed) {
      setSelectedNFT(null);
      setFractionaliseSuccessed(false);
    }
  };

  return (
    <div className={classes.root}>
      <BackButton purple overrideFunction={goBack} />
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <div className={classes.title}>Synthetic Fractionalise your NFT</div>
        </Grid>
      </Grid>
      <Grid container spacing={isTablet || isMobile || isMiniTablet ? 1 : 3}>
        <Grid item xs={12} sm={isTablet || isMobile ? 12 : isMiniTablet ? 6 : 7}>
          <Box display="flex" flexDirection="column" height="100%">
            <div className={classes.text}>
              {walletConnected
                ? "You will create a synthetic copy of the NFT you are selecting"
                : "Lock your NFT, get a synthetic copy, fractionalise it, create a derivative and get interest out of the trading fees."}
            </div>
            {walletConnected ? (
              <LoadingWrapper loading={loadingNFTS || loading} theme={"blue"}>
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
                              if (!userNFTs[index].selected) {
                                setSelectedNFT({ index, ...nftsCopy[index] });
                              } else {
                                setSelectedNFT(null);
                              }
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
                    {/* <Box>😞</Box> */}
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
                    To Synthetic Fractionalise your NFTs you need first to connect your wallet.
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
                    <Grid item xs={12} md={12}>
                      <InputWithLabelAndTooltip
                        labelName="Initial Fraction Price (USD)"
                        inputValue={!initialPrice ? "" : Math.abs(Number(initialPrice as string)).toString()}
                        minValue={0}
                        required
                        type="number"
                        onInputValueChange={e => setInitialPrice(e.target.value.replace("-", ""))}
                        theme="light"
                      />
                    </Grid>
                    <Grid item xs={12} md={12} className={classes.shortLabel}>
                      <InputWithLabelAndTooltip
                        labelName="Your NFT will be fractionalised in 10000 JOTs. How many of them do you want to keep?"
                        inputValue={!supply ? "" : Math.abs(Number(supply as string)).toString()}
                        minValue={0}
                        required
                        type="number"
                        onInputValueChange={e => setSupply(e.target.value)}
                        theme="light"
                      />
                    </Grid>
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
          </Box>
        </Grid>
        {!isTablet && !isMobile && (
          <Grid item xs={12} sm={isMiniTablet ? 6 : 5}>
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
                <Grid item xs={12} md={12}>
                  <InputWithLabelAndTooltip
                    labelName="Initial Fraction Price (USD)"
                    inputValue={!initialPrice ? "" : Math.abs(Number(initialPrice as string)).toString()}
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
                    inputValue={!supply ? "" : Math.abs(Number(supply as string)).toString()}
                    minValue={0}
                    required
                    type="number"
                    onInputValueChange={e => setSupply(e.target.value)}
                    theme="light"
                  />
                </Grid>
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
          onClose={fractionaliseClose}
          onSuccess={fractionaliseSuccess}
          onComplete={() => {
            fractionaliseClose();
            goBack();
          }}
          selectedNFT={selectedNFT}
          supplyToKeep={supply}
          priceFraction={initialPrice}
        />
      )}
    </div>
  );
};

const COLUMNS_COUNT_BREAK_POINTS_TWO = {
  1180: 2,
  1500: 3,
};

export default SyntheticFractionalise;
