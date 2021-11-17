import React from "react";
import { ownersPanelStyles } from "./index.styles";
import Box from "shared/ui-kit/Box";
import { Grid } from "@material-ui/core";
import ExploreCard from "components/PriviDigitalArt/components/Cards/ExploreCard";

const OwnersPanel = () => {
  const classes = ownersPanelStyles();

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
          <ExploreCard
            xs={12}
            sm={6}
            md={4}
            lg={3}
            img_url={1}
            nft_name="test1"
            period="10"
            price="2300"
            pct="10"
          />
          <ExploreCard
            xs={12}
            sm={6}
            md={4}
            lg={3}
            img_url={2}
            nft_name="test2"
            period="20"
            price="1300"
            pct="20"
          />
          <ExploreCard
            xs={12}
            sm={6}
            md={4}
            lg={3}
            img_url={3}
            nft_name="test3"
            period="30"
            price="1000"
            pct="15"
          />
          <ExploreCard
            xs={12}
            sm={6}
            md={4}
            lg={3}
            img_url={4}
            nft_name="test4"
            period="15"
            price="700"
            pct="13"
          />
          <ExploreCard
            xs={12}
            sm={6}
            md={4}
            lg={3}
            img_url={5}
            nft_name="test5"
            period="6"
            price="1700"
            pct="30"
          />
          <ExploreCard
            xs={12}
            sm={6}
            md={4}
            lg={3}
            img_url={6}
            nft_name="test6"
            period="16"
            price="2200"
            pct="20"
          />
          <ExploreCard
            xs={12}
            sm={6}
            md={4}
            lg={3}
            img_url={7}
            nft_name="test7"
            period="10"
            price="2300"
            pct="18"
          />
          <ExploreCard
            xs={12}
            sm={6}
            md={4}
            lg={3}
            img_url={8}
            nft_name="test8"
            period="19"
            price="1000"
            pct="5"
          />
        </Grid>
      </Box>
    </div>
  );
};

export default OwnersPanel;
