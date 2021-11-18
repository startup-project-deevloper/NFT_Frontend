import React from "react";

import { cardStyles } from "./index.style";
import { CardActions, CardContent, Typography, CardMedia, Card } from "@material-ui/core";
import { Button, Grid } from "@material-ui/core";
import { useHistory } from "react-router";

const ExploreCard = ({ xs, sm, md, lg, img_url, nft_name, period, price, pct }) => {
  const history = useHistory();
  const classes = cardStyles();
  const handleOpenExplore = () => {
    history.push(`/reserve/explore/${img_url}/true`);
  };
  return (
    <>
      <Grid item xs={xs} sm={sm} md={md} lg={lg}>
        <div className={classes.outerCard} style={{ marginBottom: 0 }} onClick={handleOpenExplore}>
          <div className={classes.innerCardGradient}>
            <div className={classes.innerCard}>
              <div className={classes.cardTitle}>
                <span className={classes.cardNftName}>{nft_name}</span>
                <button className={classes.cardOptionButton}>OPTION</button>
              </div>
              <div className={classes.cardImg}>
                <img src={"assets/test/" + img_url + ".png"} style={{ width: "100%" }} />
              </div>
              <div className={classes.cardContent}>
                <div className={classes.cardContentDiv}>
                  <span className={classes.cardContentText}>Time</span>
                  <span className={classes.cardContentAmount}>{period} Days</span>
                </div>
                <div className={classes.cardContentDiv}>
                  <span className={classes.cardContentText}>FUTURE PRICE</span>
                  <span className={classes.cardContentAmount}>{price} USDT</span>
                </div>
                <div className={classes.cardContentDiv}>
                  <span className={classes.cardContentText}>COLLATERAL PCT.</span>
                  <span className={classes.cardContentAmount}>{pct}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Grid>
    </>
  );
};

export default ExploreCard;
