import React, { useState, useEffect } from "react";
import cls from "classnames";
import { Grid, useTheme } from "@material-ui/core";

import MyNFTCard from "components/PriviDigitalArt/components/Cards/MyNFTCard";
import { myNFTStyles } from "./index.styles";

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
  }
];

const MyNFT = () => {
  const classes = myNFTStyles();

  const theme = useTheme();
  const [selectedTab, setSeelectedTab] = useState<"owned" | "synthetic">("owned");



  return (
    <>
      <div className={classes.content}>
        <div className={classes.title}>Manage your NFT</div>
        <div className={classes.subTitleSection}>
          <div
            className={cls({ [classes.selectedTabSection]: selectedTab === "owned" }, classes.tabSection)}
            onClick={() => setSeelectedTab("owned")}
          >
            <span>Owned NFT</span>
          </div>
          <div
            className={cls(
              { [classes.selectedTabSection]: selectedTab === "synthetic" },
              classes.tabSection
            )}
            onClick={() => setSeelectedTab("synthetic")}
          >
            <span>Synthetic NFT proposal</span>
          </div>
        </div>
        <div className={classes.cardsGroup}>
          <Grid container spacing={2}>
            {TopNFTList.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <MyNFTCard item={item} />
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </>
  );
};

export default MyNFT  ;
