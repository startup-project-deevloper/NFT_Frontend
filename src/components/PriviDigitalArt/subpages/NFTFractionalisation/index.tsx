import React, { useState, useEffect } from "react";
import cls from "classnames";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";

import { useMediaQuery, useTheme } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { CircularLoadingIndicator, SecondaryButton } from "shared/ui-kit";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
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
import PriviPixSyntheticRouter from "./PriviPixSyntheticRouter";
import { getMySyntheticFractionalisedNFT } from "shared/services/API/SyntheticFractionalizeAPI";

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  650: 2,
  1200: 3,
  1420: 4,
};

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
  const [portofolioCount, setPortofolioCount] = useState<number>(0);

  const [hasScrollOnSynthetic, setHasScrollOnSynthetic] = useState<boolean>(false);

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (selectedTab === "pure") {
      setLoading(true);
      getMySyntheticFractionalisedNFT().then(res => {
        setPortofolioCount(res?.nfts?.length);
      });
      getFractionalizeVaults("")
        .then(resp => {
          const data = resp.data;
          setMedias(data.data);
          setHasMoreMedias(data.hasMore);
          setLastIdx(data.data && data.data.length ? data.data[data.data.length - 1].MediaSymbol : "");
          setLoading(false);
        })
        .catch(console.log);
    }
  }, [openFractionalize]);

  useEffect(() => {
    if (!location.pathname.includes("synthetic-derivative")) {
      setSelectedTab("pure");
    }
  }, [location]);

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
      if (selectedTab === "synthetic") {
        setHasScrollOnSynthetic(true);
      }
    } else {
      if (selectedTab === "synthetic") {
        setHasScrollOnSynthetic(false);
      }
    }
  };

  const handleSyntheticClick = () => {
    setSelectedTab("synthetic");
    history.push("/fractionalise/synthetic-derivative");
  };

  const handlePureClick = () => {
    setSelectedTab("pure");
    history.push("/fractionalise");
  };

  return (
    <>
      {openFractionalize ? (
        selectedTab !== "pure" && (
          <SyntheticFractionalise goBack={() => setOpenFractionalize(false)} isSynthetic={true} />
        )
      ) : (
        <div className={classes.content} onScroll={handleScroll}>
          <div className={classes.titleBar}>
            <div className={classes.title}>NFT Fractionalisation</div>
            <SecondaryButton
              size="medium"
              className={classes.manageButton}
              onClick={() => {
                history.push("/mynft");
              }}
            >
              <span>Manage Portfolio</span>
              <Box className={classes.countCircle}>{portofolioCount}</Box>
            </SecondaryButton>
          </div>
          <Box width="100%" borderBottom="2px solid rgba(196,196,196,0.4)">
            <div className={classes.subTitleSection}>
              <div
                className={cls({ [classes.selectedTabSection]: selectedTab === "pure" }, classes.tabSection)}
                onClick={handlePureClick}
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
          </Box>
          {selectedTab === "pure" && (
            <Box width="100%" paddingX={isMobile ? "20px" : "35px"}>
              <div className={classes.headerButtonGroup}>
                {/* fractionalize button */}
                {!isMobile && (
                  <div
                    className={classes.fractionalizeBtn}
                    onClick={() => history.push("/fractionalise/fractionalise")}
                  >
                    Fractionalize
                  </div>
                )}
                {/* button group */}
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
                {/* fractionalize button */}
                {isMobile && (
                  <div
                    className={classes.fractionalizeBtn}
                    onClick={() => history.push("/fractionalise/fractionalise")}
                  >
                    Fractionalize
                  </div>
                )}
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
            </Box>
          )}
          <PriviPixSyntheticRouter
            openFractionalize={openFractionalize}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            setOpenFractionalize={setOpenFractionalize}
            hasScrollOnSynthetic={hasScrollOnSynthetic}
          />
        </div>
      )}
    </>
  );
};

export default NFTFractionalisation;
