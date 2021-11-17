import React, { useState, useEffect } from "react";
import { Grid, useMediaQuery, useTheme } from "@material-ui/core";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { BlockchainNets } from "shared/constants/constants";
import { getMySyntheticFractionalisedNFT } from "shared/services/API/SyntheticFractionalizeAPI";
import { getNfts } from "shared/services/API";
import { useAlertMessage } from "shared/hooks/useAlertMessage";

import { useFractionaliseStyles } from "./index.styles";
import NFTCard from "./NFTCard";
import ChangeToSyntheticModal from "../../modals/ChangeToSynthetic";
import { useWeb3React } from "@web3-react/core";

const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");
const isProd = process.env.REACT_APP_ENV === "prod";

const ChangeNFTToSynthetic = ({ goBack, nft }) => {
  const classes = useFractionaliseStyles();
  const [loadingNFTS, setLoadingNFTS] = useState<boolean>(false);
  const [userNFTs, setUserNFTs] = useState<any[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<any>();
  const { account, library, chainId } = useWeb3React();
  const [walletConnected, setWalletConnected] = useState<boolean>(!!account);
  const [openChangeToSyntheticModal, setOpenChangeToSyntheticModal] = useState<boolean>(false);
  const isMobileScreen = useMediaQuery("(max-width:586px)");
  const [prevSelectedChain, setPrevSelectedChain] = useState<any>(filteredBlockchainNets[1]);
  const [chainIdCopy, setChainIdCopy] = useState<number>(chainId!);
  const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[1]);

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between(769, 960));
  const isMiniTablet = useMediaQuery(theme.breakpoints.between(700, 769));
  const isMobile = useMediaQuery(theme.breakpoints.down(700));
  const { showAlertMessage } = useAlertMessage();

  useEffect(() => {
    loadNFT();
  }, [chainIdCopy, walletConnected]);

  // sync metamask chain with dropdown chain selection and load nft balance from wallet
  const loadNFT = async () => {
    if (walletConnected) {
      setLoadingNFTS(true);
      let myNFTs: any[] = [];
      const res = await getMySyntheticFractionalisedNFT();
      if (res.success) {
        myNFTs = res.nfts.filter(nft => !nft.isUnlocked && nft) ?? [];
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
                myNFT => myNFT.collection_id === item.nftCollection.address && myNFT.NftId == item.nftTokenId
              ) && item.nftCollection.address === nft.collection_id
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

  const handleProceed = () => {
    setOpenChangeToSyntheticModal(true);
  };

  const fractionaliseSuccess = () => {
    goBack();
  };

  return (
    <div className={classes.root}>
      <BackButton purple overrideFunction={goBack} />
      {walletConnected ? (
        <Box className={classes.titleContainer}>
          <Box display="flex" flexDirection="column">
            <div className={classes.title}>Synthetic Fractionalise your NFT</div>
            <div className={classes.text}>You will create a synthetic copy of the NFT you are selecting.</div>
          </Box>
          {userNFTs && userNFTs.length > 0 && (
            <button
              disabled={!walletConnected || !selectedNFT}
              className={classes.nftsButton}
              onClick={handleProceed}
            >
              Continue
            </button>
          )}
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center" className={classes.titleContainer}>
          <div className={classes.title}>Change NFT to Synthetic</div>
          <div className={classes.text}>You can change your NFT to another NFT from the same collection.</div>
        </Box>
      )}
      <Grid container spacing={5}>
        <Grid item xs={12} md={12}>
          {!walletConnected && (
            <div className={classes.walletRow}>
              <button onClick={handleConnectWallet}>Connect Your Wallet</button>
            </div>
          )}

          {walletConnected && (
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
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Box className={classes.emptyBox}>
                    <Box className={classes.emptyIcon}>😞</Box>
                    <Box className={classes.detailsLabel} mt={1}>
                      Not NFT found on your wallet.
                    </Box>
                  </Box>
                </Box>
              )}
            </LoadingWrapper>
          )}
        </Grid>
      </Grid>
      {openChangeToSyntheticModal && (
        <ChangeToSyntheticModal
          open={openChangeToSyntheticModal}
          onClose={() => setOpenChangeToSyntheticModal(false)}
          selectedNFT={selectedNFT}
          currentNFT={nft}
          onSuccess={fractionaliseSuccess}
        />
      )}
    </div>
  );
};

const COLUMNS_COUNT_BREAK_POINTS_TWO = {
  586: 2,
  800: 3,
  1440: 4,
  1920: 5,
};

export default ChangeNFTToSynthetic;
