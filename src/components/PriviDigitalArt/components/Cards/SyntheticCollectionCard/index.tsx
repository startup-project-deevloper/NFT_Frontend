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
          backgroundImage: `url(${require(`assets/collectionImages/async-art.png`)})`,
        }}
      />
      <div className={classes.info}>
        <div
          className={classes.avatar}
          style={{
            backgroundImage: `url(${require(`assets/anonAvatars/ToyFaces_Colored_BG_001.jpg`)})`,
          }}
        />
        <Box className={classes.infoWrapper}>
          <Box className={classes.title}>Collection name</Box>
          <Divider light />
          <Box className={classes.details}>
            <Box className={classes.detailWrapper}>
              <Box className={classes.detailLabel}>Locked NFTs</Box>
              <Box className={classes.detailInfo}>10</Box>
            </Box>
            <Box className={classes.detailWrapper}>
              <Box className={classes.detailLabel}>Fraction Price</Box>
              <Box className={classes.detailInfo}>2,44 USDC</Box>
            </Box>
            <Box className={classes.detailWrapper}>
              <Box className={classes.detailLabel}>Impleid Valuation</Box>
              <Box className={classes.detailInfo}>$2,543,437</Box>
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
}
