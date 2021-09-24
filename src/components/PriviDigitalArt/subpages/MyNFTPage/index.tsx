import React, { useState, useEffect } from "react";
import cls from "classnames";
import { Grid, useTheme } from "@material-ui/core";

import { useTypedSelector } from "store/reducers/Reducer";
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
  const [myNFTs, setMyNFTs] = useState([]);

  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState<"owned" | "synthetic">("owned");

  const user = useTypedSelector(state => state.user);

  useEffect(() => {
    (async () => {
      const response = await getMySyntheticFractionalisedNFT('priviUser145');
      if (response.success) {
        setMyNFTs(response.data?.nfts ?? []);
      }
    })();
  }, [user]);

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
            <Grid container spacing={2}>
              {TopNFTList.map(item => (
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <MyNFTCard item={item} />
                </Grid>
              ))}
            </Grid>
          )}
          {selectedTab === "synthetic" && (
            <Box display="flex" flexDirection="column" gridRowGap={50}>
              <Box className={classes.syntheticContent} display="flex" flexDirection="column" gridRowGap={18}>
                <Box className={classes.sectionTitle} color="#431AB7">
                  NFT To Lock
                </Box>
                <Grid container spacing={2}>
                  {myNFTs.map(item => (
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <MyNFTCard item={item} />
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
