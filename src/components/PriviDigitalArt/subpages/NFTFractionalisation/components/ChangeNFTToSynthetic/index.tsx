import React, { useState } from "react";
import { Grid, useMediaQuery } from "@material-ui/core";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { useFractionaliseStyles } from "./index.styles";
import NFTCard from "./NFTCard";
import ChangeToSyntheticModal from "../../modals/ChangeToSynthetic";
import { useWeb3React } from "@web3-react/core";

const dummyNFTs = [
  {
    MediaName: "NFT Name",
    image: require(`assets/backgrounds/digital_art_1.png`),
    selected: true,
  },
  {
    MediaName: "NFT Name",
    image: require(`assets/backgrounds/digital_art_1.png`),
  },
  {
    MediaName: "NFT Name",
    image: require(`assets/backgrounds/digital_art_1.png`),
  },
  {
    MediaName: "NFT Name",
    image: require(`assets/backgrounds/digital_art_1.png`),
  },
  {
    MediaName: "NFT Name",
    image: require(`assets/backgrounds/digital_art_1.png`),
  },
  {
    MediaName: "NFT Name",
    image: require(`assets/backgrounds/digital_art_1.png`),
  },
  {
    MediaName: "NFT Name",
    image: require(`assets/backgrounds/digital_art_1.png`),
  },
  {
    MediaName: "NFT Name",
    image: require(`assets/backgrounds/digital_art_1.png`),
  },
  {
    MediaName: "NFT Name",
    image: require(`assets/backgrounds/digital_art_1.png`),
  },
];

const ChangeNFTToSynthetic = ({ goBack }) => {
  const classes = useFractionaliseStyles();
  const [loadingnNFTS, setLoadingnNFTS] = useState<boolean>(false);
  const [userNFTs, setUserNFTs] = useState<any[]>(dummyNFTs);
  const [selectedNFT, setSelectedNFT] = useState<any>();
  const { account, library, chainId } = useWeb3React();
  const [walletConnected, setWalletConnected] = useState<boolean>(!!account);
  const [openChangeToSyntheticModal, setOpenChangeToSyntheticModal] = useState<boolean>(false);
  const isMobileScreen = useMediaQuery("(max-width:586px)");

  const handleConnectWallet = () => {
    setWalletConnected(true);
  };

  const handleProceed = () => {
    setOpenChangeToSyntheticModal(true);
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
            <button disabled={!walletConnected} className={classes.nftsButton} onClick={handleProceed}>
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
            <LoadingWrapper loading={loadingnNFTS} theme={"blue"}>
              {userNFTs && userNFTs.length > 0 ? (
                <Box className={classes.nftWrapper}>
                  <MasonryGrid
                    gutter={isMobileScreen ? "14px" : "24px"}
                    data={userNFTs}
                    renderItem={(item, index) => (
                      <NFTCard item={item} key={`item-${index}`} handleSelect={() => {}} />
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
        />
      )}
    </div>
  );
};

const COLUMNS_COUNT_BREAK_POINTS_TWO = {
  586: 2,
  800: 3,
  1440: 5,
};

export default ChangeNFTToSynthetic;
