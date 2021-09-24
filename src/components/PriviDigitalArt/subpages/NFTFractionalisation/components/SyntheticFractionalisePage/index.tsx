import React, { useState, useEffect } from "react";
import Carousel from "react-elastic-carousel";
import { useHistory } from "react-router";

import { createTheme, Grid, MuiThemeProvider, useMediaQuery, useTheme } from "@material-ui/core";

import { CircularLoadingIndicator } from "shared/ui-kit";
import { nftFractionalisationStyles } from "../../index.styles";
import SyntheticCollectionCard from "components/PriviDigitalArt/components/Cards/SyntheticCollectionCard";
import { getSyntheticCollections } from "shared/services/API/SyntheticFractionalizeAPI";

const SyntheticFractionalisePage = ({
  selectedTab,
  openFractionalize,
  setSelectedTab,
  setOpenFractionalize,
}) => {
  const theme = createTheme({
    breakpoints: {
      keys: ["xs", "sm", "md", "lg", "xl"],
      values: { xs: 0, sm: 658, md: 769, lg: 860, xl: 1200 },
    },
  });
  const classes = nftFractionalisationStyles();
  const history = useHistory();
  const isTablet = useMediaQuery(theme.breakpoints.down(1200));
  const isNarrow = useMediaQuery(theme.breakpoints.down(860));

  const itemsToShow = isNarrow ? 1 : isTablet ? 2 : 3;

  const [collections, setCollections] = useState([]);

  useEffect(() => {
    if (selectedTab !== "synthetic" || openFractionalize) {
      // history.push('/pix/fractionalise/');
      setSelectedTab("synthetic");
    }
  }, [selectedTab, openFractionalize]);

  useEffect(() => {
    (async () => {
      const response = await getSyntheticCollections();
      if (response.success) {
        setCollections(response.data);
      }
    })();
  }, []);

  return (
    <>
      <div className={classes.syntheticSection}>
        <div className={classes.rewardsWrapper}>
          <div className={classes.rewardsContent}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={12} lg={6} xl={7}>
                <div className={classes.rewardsTitle}>
                  Create a synthetic
                  <br />
                  derivative out of your NFT collection
                </div>
                <div className={classes.rewardsDes}>
                  Lock your NFT, get a synthetic copy, fractionalise it, create a derivative and get interest
                  out of the trading fees.
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={12} lg={6} xl={5} className={classes.buttons}>
                <div className={classes.syntheticFractionaliseBtn} onClick={() => setOpenFractionalize(true)}>
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
              <Carousel isRTL={false} itemsToShow={itemsToShow} pagination={false}>
                {collections.map((item: any) => (
                  <SyntheticCollectionCard item={item} key={item.id} />
                ))}
              </Carousel>
            </div>
          </div>
          <div className={classes.allNFTWrapper}>
            <div className={classes.allNFTTitle}>
              <span>View all Synthetic NFTs</span>
            </div>
            <div className={classes.allNFTSection}>
              {collections.length ? (
                <MuiThemeProvider theme={theme}>
                  <Grid container spacing={2} wrap="wrap">
                    {collections.map((item: any) => (
                      <Grid item xs={12} sm={6} md={12} lg={6} xl={4} key={item.id}>
                        <SyntheticCollectionCard item={item} />
                      </Grid>
                    ))}
                  </Grid>
                </MuiThemeProvider>
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
