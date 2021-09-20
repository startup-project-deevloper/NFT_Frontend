import React, { useState, useEffect } from "react";
import cls from "classnames";
import Carousel from "react-elastic-carousel";

import { Grid, useMediaQuery, useTheme } from "@material-ui/core";

import { CircularLoadingIndicator } from "shared/ui-kit";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { COLUMNS_COUNT_BREAK_POINTS_FOUR } from "components/PriviDigitalArt/subpages/ExplorePage";
import FractionalizedNFTCard from "components/PriviDigitalArt/components/Cards/FractionalizedNFTCard";
import {
  nftFractionalisationStyles,
  LiveSaleIcon,
  LiveAuctionIcon,
  ClosedIcon,
  SortByIcon,
} from "./index.styles";
import Fractionalize from "./components/Fractionalise";
import SyntheticFractionalise from "./components/SyntheticFractionalise";
import { getFractionalizeVaults } from "shared/services/API/FractionalizeAPI";
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

const NFTFractionalisation = () => {
  const classes = nftFractionalisationStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [selectedTab, setSeelectedTab] = useState<"pure" | "synthetic">("pure");
  const [hasMoreMedias, setHasMoreMedias] = useState<boolean>(true);
  const [lastIdx, setLastIdx] = useState<string>("");
  const [medias, setMedias] = useState<any[]>([]);

  const [openFractionalize, setOpenFractionalize] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedTab === "pure") {
      setLoading(true);
      getFractionalizeVaults("").then(resp => {
        const data = resp.data;
        setMedias(data.data);
        setHasMoreMedias(data.hasMore);
        setLastIdx(data.data && data.data.length ? data.data[data.data.length - 1].MediaSymbol : "");
        setLoading(false);
      });
    }
  }, [openFractionalize]);

  const handleScroll = async e => {
    if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 42) {
      if (hasMoreMedias && selectedTab === "pure") {
        setLoading(true);
        getFractionalizeVaults(lastIdx).then(resp => {
          const data = resp.data;
          setMedias([...medias, ...(data.data ?? [])]);
          setHasMoreMedias(data.hasMore);
          setLastIdx(data.data && data.data.length ? data.data[data.data.length - 1].MediaSymbol : "");
          setLoading(false);
        });
      }
    }
  };

  return (
    <>
      {openFractionalize ? (
        selectedTab !== "pure" ? (
          <SyntheticFractionalise goBack={() => setOpenFractionalize(false)} isSynthetic={true} />
        ) : (
          <Fractionalize goBack={() => setOpenFractionalize(false)} isSynthetic={false} />
        )
      ) : (
        <div className={classes.content} onScroll={handleScroll}>
          <div className={classes.title}>✨ NFT Fractionalisation ✨</div>
          <div className={classes.subTitleSection}>
            <div
              className={cls({ [classes.selectedTabSection]: selectedTab === "pure" }, classes.tabSection)}
              onClick={() => setSeelectedTab("pure")}
            >
              <span>Pure Fractionalisation</span>
            </div>
            <div
              className={cls(
                { [classes.selectedTabSection]: selectedTab === "synthetic" },
                classes.tabSection
              )}
              onClick={() => setSeelectedTab("synthetic")}
            >
              <span>
                {isMobile ? "Synthetic Fractionalisation" : "Synthetic Derivative Fractionalisation"}
              </span>
            </div>
          </div>
          {selectedTab === "pure" ? (
            <>
              <div className={classes.headerButtonGroup}>
                <div className={classes.fractionalizeBtn} onClick={() => setOpenFractionalize(true)}>
                  Fractionalize
                </div>
                <div className={classes.filterBtnGroup}>
                  <div className={classes.liveSaleBtn}>
                    <LiveSaleIcon />
                    <span>Live Sale</span>
                  </div>
                  <div className={classes.liveAuctionBtn}>
                    <LiveAuctionIcon />
                    <span>Live Auction</span>
                  </div>
                  <div className={classes.closedBtn}>
                    <ClosedIcon />
                    <span>Closed</span>
                  </div>
                  <div className={classes.sortByBtn}>
                    <span>Sort By</span>
                    <SortByIcon />
                  </div>
                </div>
              </div>
              <div className={classes.mediaSection}>
                {medias && medias.length ? (
                  <>
                    <MasonryGrid
                      gutter={"24px"}
                      data={medias}
                      renderItem={(item, index) => (
                        <FractionalizedNFTCard heightFixed item={item} key={`item-${index}`} index={index} />
                      )}
                      columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                    />
                    {hasMoreMedias && (
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
                          height: "calc(100vh - 400px)",
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
            </>
          ) : (
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
          )}
        </div>
      )}
    </>
  );
};

export default NFTFractionalisation;
