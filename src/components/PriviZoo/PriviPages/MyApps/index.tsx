import React from "react";
import { useHistory } from "react-router-dom";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import { Grid } from "@material-ui/core";

import { myAppsPageStyles } from "./index.styles";
import PriviCard from "components/PriviZoo/components/PriviCard";
import Box from "shared/ui-kit/Box";
import { ZOO_APPS } from "shared/constants/constants";

const COLUMNS_COUNT_BREAK_POINTS = {
  375: 1,
  900: 3,
  1200: 4,
};

const GUTTER = "16px";

const MyApps = () => {
  const classes = myAppsPageStyles()

  return (
    <Box className={classes.contentBox}>
      <Box className={classes.flexBox} justifyContent="space-between">
        <Box className={classes.title2}>My apps</Box>
      </Box>
      <Box className={classes.flexBox} mt={2} ml={3} mb={4}>
        <Grid className={classes.cardsGrid}>
          <ResponsiveMasonry columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}>
            <Masonry gutter={GUTTER}>
              {ZOO_APPS.map(item => (
                <Box key={item.name} mr={2}>
                  <PriviCard item={item} hideAvatar showMark showEarlyAccess />
                </Box>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </Grid>
      </Box>
    </Box>
  );
};

export default MyApps;
