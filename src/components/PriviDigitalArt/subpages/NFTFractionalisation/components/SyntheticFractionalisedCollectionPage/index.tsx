import React, { useState, useEffect } from "react";
import cls from "classnames";
import { useHistory } from "react-router-dom";

import { Grid, useMediaQuery, useTheme } from "@material-ui/core";

import { CircularLoadingIndicator } from "shared/ui-kit";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import Box from "shared/ui-kit/Box";
import { fractionalisedCollectionStyles, EthIcon, ShareIcon, PlusIcon } from "./index.styles";
import CollectionNFTCard from "../../../../components/Cards/CollectionNFTCard";
import AuctionCard from "../../../../components/Cards/AuctionCard";
import SyntheticFractionalisedJotPoolsPage from "../SyntheticFractionalisedJotPoolsPage";
import SyntheticFractionalisedTradeJotPage from "../SyntheticFractionalisedTradeJotPage";

const NFTList = [
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    isVerified: true,
    owner: 80,
    available: 10,
    price: 1,
    isLive: false,
    started_at: null,
  },
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    isVerified: true,
    owner: 80,
    available: 10,
    price: 1,
    isLive: false,
    started_at: null,
  },
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    isVerified: true,
    owner: 80,
    available: 10,
    price: 1,
    isLive: false,
    started_at: null,
  },
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    isVerified: true,
    owner: 80,
    available: 10,
    price: 1,
    isLive: true,
    started_at: 1631747005555,
  },
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    isVerified: true,
    owner: 80,
    available: 10,
    price: 1,
    isLive: true,
    started_at: 1631747005555,
  },
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    isVerified: true,
    owner: 80,
    available: 10,
    price: 1,
    isLive: true,
    started_at: 1631747005555,
  },
];

const SyntheticFractionalisedCollectionPage = ({ goBack, match }) => {
  const classes = fractionalisedCollectionStyles();
  const history = useHistory();

  const [selectedTab, setSelectedTab] = useState<"nft" | "jots_pool" | "trade_jots" | "auctions">("nft");

  return (
    <div className={classes.root}>
      <div className={classes.collectionInfoSection}>
        <Box display="flex" justifyContent="space-between" pl={6}>
          <BackButton purple overrideFunction={goBack} />
          <div className={classes.tradeDerivativeButton} onClick={() => {}}>
            <div>
              <span>TRADE DERIVATIVES</span>
            </div>
          </div>
        </Box>
        <img src={require("assets/backgrounds/digital_art_1.png")} alt="collction image" />
        <div className={classes.collectionMainContent}>
          <Box display="flex" justifyContent="space-between">
            <div className={classes.typo1}>✨ Collection</div>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" mr={"10px"}>
                <EthIcon />
              </Box>
              <div className={classes.typo2}>Ethereum</div>
              <div className={classes.shareSection}>
                <ShareIcon />
              </div>
              <div className={classes.plusSection}>
                <PlusIcon />
              </div>
              <div className={classes.typo2}>Follow</div>
            </Box>
          </Box>
          <div className={classes.mainTitleSection}>
            <span>Cryptopunks</span>
            <span>Megapack</span>
          </div>
          <Box display="flex" justifyContent="space-between" mt={"37px"}>
            <Box display="flex" flexDirection="column">
              <div className={classes.typo3}>1.827 ETH</div>
              <div className={classes.typo4}>fraction Price</div>
            </Box>
            <Box display="flex" flexDirection="column">
              <div className={classes.typo3}>14</div>
              <div className={classes.typo4}>locked NFTs in</div>
            </Box>
            <Box display="flex" flexDirection="column">
              <div className={classes.typo3}>$12 456.54</div>
              <div className={classes.typo4}>ACRRUED REWARD</div>
            </Box>
            <Box display="flex" flexDirection="column">
              <div className={classes.typo3}>$12K</div>
              <div className={classes.typo4}>Circulating Supply</div>
            </Box>
          </Box>
        </div>
      </div>
      <div className={classes.nftSection}>
        <div className={classes.nftTabSection}>
          <div
            className={cls({ [classes.selectedTabSection]: selectedTab === "nft" }, classes.tabSection)}
            onClick={() => setSelectedTab("nft")}
          >
            <span>NFTS IN COLLECTION</span>
          </div>
          <div
            className={cls({ [classes.selectedTabSection]: selectedTab === "jots_pool" }, classes.tabSection)}
            onClick={() => setSelectedTab("jots_pool")}
          >
            <span>JOTS POOL</span>
          </div>
          <div
            className={cls(
              { [classes.selectedTabSection]: selectedTab === "trade_jots" },
              classes.tabSection
            )}
            onClick={() => setSelectedTab("trade_jots")}
          >
            <span>TRADE JOTS</span>
          </div>
          <div
            className={cls({ [classes.selectedTabSection]: selectedTab === "auctions" }, classes.tabSection)}
            onClick={() => setSelectedTab("auctions")}
          >
            <span>AUCTIONS</span>
          </div>
        </div>
        {selectedTab === "nft" ? (
          <div className={classes.allNFTSection}>
            {NFTList && NFTList.length ? (
              <Grid container spacing={2}>
                {NFTList.map((item, idx) => (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <CollectionNFTCard
                      item={item}
                      handleSelect={() => {
                        history.push("/pix/fractionalisation/collection/:collectionId/nft/:nftId/0");
                      }}
                    />
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
        ) : selectedTab === "jots_pool" ? (
          <div className={classes.jotPoolSection}>
            <SyntheticFractionalisedJotPoolsPage />
          </div>
        ) : selectedTab === "auctions" ? (
          <div className={classes.allNFTSection}>
            {NFTList && NFTList.length ? (
              <Grid container spacing={2}>
                {NFTList.map((item, idx) => (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <AuctionCard
                      auction={item}
                      onClick={() => {
                        history.push(`/pix/fractionalisation/collection/${match.params.id}/nft/:nftId/1`);
                      }}
                    />
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
        ) : (
          <div>
            <SyntheticFractionalisedTradeJotPage />
          </div>
        )}
      </div>
    </div>
  );
};

export default SyntheticFractionalisedCollectionPage;
