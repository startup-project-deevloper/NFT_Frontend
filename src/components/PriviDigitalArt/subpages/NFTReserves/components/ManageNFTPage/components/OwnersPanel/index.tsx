import React, { useState, useEffect } from "react";
import { ownersPanelStyles } from "./index.styles";
import Box from "shared/ui-kit/Box";
import { Grid } from "@material-ui/core";
import ExploreCard from "components/PriviDigitalArt/components/Cards/ExploreCard";

const OwnersPanel = () => {
  const classes = ownersPanelStyles();
  const [userNFTs, setUserNFTs] = useState<any[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const mockNfts: any[] = [];
    const types = ["OPTION", "LISTED", "RENTED", "BLOCKED"];
    for (let i = 0; i < 8; i++) {
      const typeIndex = Math.floor(Math.random() * types.length);
      mockNfts.push({
        id: i,
        imageUrl: i + 1,
        name: `test${i + 1}`,
        ownerAddress: "0x7Fa11671e546dB93f558531c1e3bC5D4FFed29a5",
        sellingPrice: 10,
        blockingPrice: 1,
        blockingPeriod: 90,
        rentalPrice: 0.1,
        rentalPriceCycle: "Day",
        type: types[typeIndex],
      });
    }
    setUserNFTs(mockNfts);
  };

  return (
    <div className={classes.content}>
      <Grid container className={classes.infoPanel}>
        <Grid item sm={12} md={6} className={classes.subPanel}>
          <span className={classes.infoTitle}>SALES REVENUE</span>
          <Box className={classes.infoRow}>
            <Box className={classes.infoSubPanel}>
              <span className={classes.infoLabel}>Total</span>
              <span className={classes.infoValue}>2455 USDT</span>
            </Box>
            <Box className={classes.infoSubPanel}>
              <span className={classes.infoLabel}>Recent Month</span>
              <span className={classes.infoValue}>24555 USDT</span>
            </Box>
          </Box>
        </Grid>
        <Grid item sm={12} md={6} className={classes.subPanel}>
          <span className={classes.infoTitle}>RENTING REVENUE</span>
          <Box className={classes.infoRow}>
            <Box className={classes.infoSubPanel}>
              <span className={classes.infoLabel}>Total</span>
              <span className={classes.infoValue}>224.55 USDT</span>
            </Box>
            <Box className={classes.infoSubPanel}>
              <span className={classes.infoLabel}>Recent Month</span>
              <span className={classes.infoValue}>0.55 USDT</span>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {userNFTs.map(nft => (
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <ExploreCard nft={nft} key={nft.id} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default OwnersPanel;
