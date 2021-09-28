import React, { useState, useEffect } from "react";
import cls from "classnames";
import { Grid, useTheme } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import MyNFTCard from "components/PriviDigitalArt/components/Cards/MyNFTCard";
import { myNFTStyles } from "./index.styles";
import { getMySyntheticFractionalisedNFT } from "shared/services/API/SyntheticFractionalizeAPI";

const TopNFTList = [
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    lock: true,
  },
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    lock: false,
  },
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    lock: false,
  },
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    lock: true,
  },
];

const MyNFT = () => {
  const classes = myNFTStyles();
  const [myNFTs, setMyNFTs] = useState<any[]>([]);

  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState<"owned" | "synthetic">("synthetic");

  useEffect(() => {
    try {
      getMySyntheticFractionalisedNFT().then(res => {
        if (res.success) {
          setMyNFTs(
            res.nfts.map(nft => {
              return {
                ...nft,
                BlockchainId: nft.NftId,
                tokenAddress: nft.collection_id,
              };
            }) ?? []
          );
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const onMyNFTLocked = index => {
    const newNFTs: any[] = myNFTs.map((nft, i) => {
      if (i !== index) {
        return nft;
      }
      return {
        ...nft,
        isLocked: true,
      };
    });
    setMyNFTs(newNFTs);
  };

  return (
    <>
      <div className={classes.content}>
        <div className={classes.title}>Manage your NFT</div>
        <div className={classes.subTitleSection}>
          <div
            className={cls({ [classes.selectedTabSection]: selectedTab === "owned" }, classes.tabSection)}
            onClick={() => setSelectedTab("owned")}
          >
            <span>Owned NFT</span>
          </div>
          <div
            className={cls({ [classes.selectedTabSection]: selectedTab === "synthetic" }, classes.tabSection)}
            onClick={() => setSelectedTab("synthetic")}
          >
            <span>Synthetic NFT proposal</span>
          </div>
        </div>
        <div className={classes.cardsGroup}>
          {selectedTab === "owned" && (
            <div className={classes.cardsGrid}>
              {TopNFTList.map((item, index) => (
                <MyNFTCard key={index} item={item} />
              ))}
            </div>
          )}
          {selectedTab === "synthetic" && (
            <Box display="flex" flexDirection="column" gridRowGap={50}>
              <Box className={classes.syntheticContent} display="flex" flexDirection="column" gridRowGap={18}>
                <Box className={classes.sectionTitle} color="#431AB7">
                  NFT To Lock
                </Box>
                <Grid container spacing={2}>
                  {myNFTs.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <MyNFTCard item={item} onLockCompleted={() => onMyNFTLocked(index)} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
              <Box className={classes.syntheticContent} display="flex" flexDirection="column" gridRowGap={18}>
                <Box className={classes.sectionTitle} color="#F2604C">
                  NFT To Verify
                </Box>
              </Box>
            </Box>
          )}
        </div>
      </div>
    </>
  );
};

export default MyNFT;
