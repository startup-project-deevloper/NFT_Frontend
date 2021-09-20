import React from "react";
import Carousel from "react-elastic-carousel";
import { useHistory } from "react-router";

import { Grid } from "@material-ui/core";

import { CircularLoadingIndicator } from "shared/ui-kit";
import {
  nftFractionalisationStyles,
} from "../../index.styles";
import SyntheticCollectionCard from "components/PriviDigitalArt/components/Cards/SyntheticCollectionCard";

const TopNFTList = [
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    price: 492.17,
    delta: 1.72,
  },
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    price: 492.17,
    delta: -0.72,
  },
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    price: 492.17,
    delta: -0.72,
  },
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    price: 492.17,
    delta: -0.72,
  },
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    price: 492.17,
    delta: -0.72,
  },
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    price: 492.17,
    delta: -0.72,
  },
];

const SyntheticFractionalisePage = ({
  selectedTab,
  openFractionalize,
  setOpenFractionalize
}) => {
  const classes = nftFractionalisationStyles();
  const history = useHistory();

  if (selectedTab !== "synthetic" || openFractionalize) {
    history.push('/pix/fractionalise/');
  }

  return (
    <>
      <div className={classes.syntheticSection}>
        <div className={classes.rewardsWrapper}>
          <div className={classes.rewardsContent}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={8}>
                <div className={classes.rewardsTitle}>
                  Create  a  synthetic<br />
                  derivative out of your NFT collection
                </div>
                <div className={classes.rewardsDes}>
                  Lock your NFT, get a synthetic copy, fractionalise it, create a derivative and get
                  interest out of the trading fees.
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <div
                  className={classes.syntheticFractionaliseBtn}
                  onClick={() => setOpenFractionalize(true)}
                >
                  Synthetic Fractionalise NFT
                </div>
                <div className={classes.tradeNFTBtnWrapper} onClick={() => {}}>
                  <div className={classes.tradeNFTBtn}>Trade NFT Derivatives</div>
                </div>
              </Grid>
            </Grid>

            <img
              src={require("assets/icons/governance.svg")}
              alt="heart eyes"
              className={classes.heartEyeImg}
            />
          </div>
        </div>
        <div className={classes.NFTSection}>
          <div className={classes.topNFTWrapper}>
            <div className={classes.topNFTTitle}>
              <span>Featured NFT Collections</span>
            </div>
            <div className={classes.topNFTContent}>
              <Carousel isRTL={false} itemsToShow={3} pagination={false}>
                {TopNFTList.map((item, idx) => (
                  <SyntheticCollectionCard item={item} />
                ))}
              </Carousel>
            </div>
          </div>
          <div className={classes.allNFTWrapper}>
            <div className={classes.allNFTTitle}>
              <span>View all Synthetic NFTs</span>
            </div>
            <div className={classes.allNFTSection}>
              {TopNFTList && TopNFTList.length ? (
                <Grid container spacing={2}>
                  {TopNFTList.map((item, idx) => (
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <SyntheticCollectionCard item={item} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 16,
                    paddingBottom: 16,
                  }}
                >
                  <CircularLoadingIndicator theme="blue" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SyntheticFractionalisePage;
