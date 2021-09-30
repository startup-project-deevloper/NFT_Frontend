import React from "react";
import cls from "classnames";
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
        history.push(`/pix/fractionalisation/collection/${item.id}`);
      }}
    >
      <div
        className={cls(classes.image, classes.fixed)}
        style={{
          backgroundImage: `url(${item.imageUrl ?? require(`assets/collectionImages/async-art.png`)})`,
        }}
      />
      <div className={classes.info}>
        <Box className={classes.infoWrapper}>
          <Box className={classes.titleContainer}>
            <Box className={classes.title}>{item.collectionName}</Box>
            <Box className={classes.detailLabel} flexDirection="row">
              Locked NFTs
              <Box className={classes.detailInfo} display="inline-flex" ml={1}>
                {item.nfts?.filter(nft => nft.isLocked).length}
              </Box>
            </Box>
          </Box>
          <Divider light />
          <Box className={classes.details}>
            <Box className={classes.detailWrapper}>
              <Box className={classes.detailLabel}>Staking Rewards</Box>
              <Box className={classes.detailInfo}>{item.stakingReward ?? 0} USDT/JOT APR</Box>
            </Box>
            <Box className={classes.detailWrapper}>
              <Box className={classes.detailLabel}>Fraction Price</Box>
              <Box className={classes.detailInfo}>XXXX USDC</Box>
            </Box>
            <Box className={classes.detailWrapper}>
              <Box className={classes.detailLabel}>Implied Valuation</Box>
              <Box className={classes.detailInfo}>${item.impliedValuation ?? 0}</Box>
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
}
