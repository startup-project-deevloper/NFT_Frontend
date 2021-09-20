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
import PriviPixSyntheticRouter from "./PriviPixSyntheticRouter";
import { useHistory } from "react-router";

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

  const [selectedTab, setSelectedTab] = useState<"pure" | "synthetic">("pure");
  const [hasMoreMedias, setHasMoreMedias] = useState<boolean>(true);
  const [lastIdx, setLastIdx] = useState<string>("");
  const [medias, setMedias] = useState<any[]>([]);

  const [openFractionalize, setOpenFractionalize] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const history = useHistory();

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

  console.log('===selectedTab===', selectedTab);

  const handleSyntheticClick = () => {
    setSelectedTab("synthetic");
    history.push('/pix/fractionalisation/synthetic-derivative');
  }
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
              onClick={() => setSelectedTab("pure")}
            >
              <span>Pure Fractionalisation</span>
            </div>
            <div
              className={cls(
                { [classes.selectedTabSection]: selectedTab === "synthetic" },
                classes.tabSection
              )}
              onClick={handleSyntheticClick}
            >
              <span>
                {isMobile ? "Synthetic Fractionalisation" : "Synthetic Derivative Fractionalisation"}
              </span>
            </div>
          </div>
          {selectedTab === "pure" && (
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
          )}
          <PriviPixSyntheticRouter
            openFractionalize={openFractionalize}
            selectedTab={selectedTab}
            setOpenFractionalize={setOpenFractionalize}
          />
        </div>
      )}
    </>
  );
};

export default NFTFractionalisation;
