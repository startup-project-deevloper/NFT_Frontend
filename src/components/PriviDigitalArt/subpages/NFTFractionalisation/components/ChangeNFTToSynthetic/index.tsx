import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { useFractionaliseStyles } from "./index.styles";
import NFTCard from "./NFTCard";
import ChangeToSyntheticModal from "../../modals/ChangeToSynthetic";

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
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [openChangeToSyntheticModal, setOpenChangeToSyntheticModal] = useState<boolean>(false);

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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          className={classes.titleContainer}
        >
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
                <MasonryGrid
                  gutter={"24px"}
                  data={userNFTs}
                  renderItem={(item, index) => (
                    <NFTCard item={item} key={`item-${index}`} handleSelect={() => {}} />
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
  800: 3,
  1440: 5,
};

export default ChangeNFTToSynthetic;
