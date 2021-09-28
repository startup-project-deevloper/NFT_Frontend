import React, { useState, useEffect, useRef } from "react";
import Carousel from "react-elastic-carousel";
import { useHistory } from "react-router";

import { createTheme, Grid, useMediaQuery } from "@material-ui/core";

import { CircularLoadingIndicator } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import SyntheticCollectionCard from "components/PriviDigitalArt/components/Cards/SyntheticCollectionCard";
import { getSyntheticCollections } from "shared/services/API/SyntheticFractionalizeAPI";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { nftFractionalisationStyles } from "../../index.styles";

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  650: 2,
  1200: 3,
  1440: 4,
};

const SyntheticFractionalisePage = ({
  selectedTab,
  openFractionalize,
  setSelectedTab,
  setOpenFractionalize,
  hasScrollOnSynthetic,
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

  const carouselRef = useRef<any>();

  const [collections, setCollections] = useState<any[]>([]);
  const [hasMoreCollections, setHasMoreCollections] = useState<boolean>(true);
  const [pagination, setPagination] = useState<number>(0);
  const [lastIdx, setLastIdx] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedTab !== "synthetic" || openFractionalize) {
      // history.push('/pix/fractionalise/');
      setSelectedTab("synthetic");
    }
  }, [selectedTab, openFractionalize]);

  useEffect(() => {
    setLoading(true);
    getSyntheticCollections(0).then(resp => {
      if (resp && resp.success) {
        setCollections(resp.data);
        setHasMoreCollections(resp.hasMore);
        setPagination(pagination => pagination + 1);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (hasScrollOnSynthetic && hasMoreCollections) {
      setLoading(true);
      getSyntheticCollections(pagination).then(resp => {
        if (resp && resp.success) {
          setCollections([...collections, ...(resp.data ?? [])]);
          setHasMoreCollections(resp.hasMore);
          setPagination(pagination => pagination + 1);
        }
        setLoading(false);
      });
    }
  }, [hasScrollOnSynthetic]);

  return (
    <>
      <div className={classes.syntheticSection}>
        <Box pl={isNarrow ? 3 : 5} pr={isNarrow ? 3 : 3}>
          <div className={classes.rewardsWrapper}>
            <div className={classes.rewardsContent}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={12} lg={6} xl={7}>
                  <div className={classes.rewardsTitle}>
                    Create A Synthetic
                    <br />
                    Derivative Out Of Your NFT Collection
                  </div>
                  <div className={classes.rewardsDes}>
                    Lock your NFT, get a synthetic copy, fractionalise it, create a derivative and get
                    interest out of the trading fees.
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={12} lg={6} xl={5} className={classes.buttons}>
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
        </Box>

        <div className={classes.NFTSection}>
          <div className={classes.topNFTWrapper}>
            <Box className={classes.topNFTTitle} justifyContent="space-between">
              <span>Featured NFT Collections</span>
              <Box display="flex" alignItems="center">
                <Box
                  className={classes.carouselNav}
                  onClick={() => {
                    carouselRef.current.slidePrev();
                  }}
                >
                  <svg
                    width="20"
                    height="16"
                    viewBox="0 0 20 16"
                    fill="none"
                    stroke="#431AB7"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.14546 14.6185L1.29284 7.98003M1.29284 7.98003L8.14546 1.34155M1.29284 7.98003H18.707"
                      strokeWidth="1.5122"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Box>
                <Box
                  ml={3}
                  className={classes.carouselNav}
                  onClick={() => {
                    carouselRef.current.slideNext();
                  }}
                >
                  <svg
                    width="20"
                    height="16"
                    viewBox="0 0 20 16"
                    fill="none"
                    stroke="#431AB7"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.8545 14.6185L18.7072 7.98003M18.7072 7.98003L11.8545 1.34155M18.7072 7.98003H1.29297"
                      strokeWidth="1.5122"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Box>
              </Box>
            </Box>
            <div className={classes.topNFTContent}>
              {collections && collections.length ? (
                <Carousel
                  isRTL={false}
                  itemsToShow={itemsToShow}
                  pagination={false}
                  showArrows={false}
                  ref={carouselRef}
                  itemPadding={[0, 12]}
                >
                  {collections.map((item: any) => (
                    <SyntheticCollectionCard item={item} key={item.id} />
                  ))}
                </Carousel>
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
          <div className={classes.allNFTWrapper}>
            <div className={classes.allNFTTitle}>
              <span>View all Synthetic NFTs</span>
            </div>
            <div className={classes.allNFTSection}>
              {collections && collections.length ? (
                <>
                  <MasonryGrid
                    gutter={"24px"}
                    data={collections}
                    renderItem={(item, index) => <SyntheticCollectionCard item={item} />}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                  />
                  {hasMoreCollections && (
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
                </>
              ) : loading ? (
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
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SyntheticFractionalisePage;
