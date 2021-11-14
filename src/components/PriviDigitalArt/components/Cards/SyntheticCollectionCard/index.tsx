import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { Divider } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { syntheticCollectionCardStyles } from "./index.styles";

export default function SyntheticCollectionCard({ item }) {
  const classes = syntheticCollectionCardStyles();
  const history = useHistory();

  return (
    <div
      className={classes.card}
      onClick={() => {
        history.push(`/fractionalisation/collection/${item.id}`);
      }}
    >
      <img
        src={item.imageUrl || require(`assets/collectionImages/async-art.png`)}
        className={classes.image}
      />
      <div className={classes.info}>
        <Box className={classes.infoWrapper}>
          <Box className={classes.titleContainer}>
            <Box className={classes.title}>{item.collectionName}</Box>
            <Box className={classes.detailLabel} flexDirection="row">
              Locked NFTs
              <Box className={classes.detailInfo} display="inline-flex" ml={1}>
                {item.nfts?.filter(nft => nft.isVerified && !nft.isWithdrawn).length}
              </Box>
            </Box>
          </Box>
          <Divider light />
          <Box className={classes.details}>
            <Box className={classes.detailWrapper}>
              <Box className={classes.detailLabel}>Staking Rewards</Box>
              <Box className={classes.detailInfo}>{item.stakingReward ?? 0} USDT/JOT</Box>
            </Box>
            <Box className={classes.detailWrapper}>
              <Box className={classes.detailLabel}>Fraction Price</Box>
              <Box className={classes.detailInfo}>${item.fractionPrice ?? 0} USDT</Box>
            </Box>
            <Box className={classes.detailWrapper}>
              <Box className={classes.detailLabel}>Implied Valuation</Box>
              <Box className={classes.detailInfo}>${item.impliedValuation}</Box>
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
}
