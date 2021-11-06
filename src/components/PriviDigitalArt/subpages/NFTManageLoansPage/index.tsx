import React, { useEffect, useState } from "react";

import { useMediaQuery, useTheme } from "@material-ui/core";

import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import Box from "shared/ui-kit/Box";
import { PrimaryButton, SecondaryButton, GradientSlider } from "shared/ui-kit";
import { useManageLoansPageStyles } from "./index.styles";

const SlideMarks = [
  {
    value: 0,
    label: "Borrow limit 0",
  },
  {
    value: 100,
    label: "$00.000",
  },
];

const NFTManageLoansPage = () => {
  const classes = useManageLoansPageStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <div className={classes.root}>
      <BackButton purple />
      <div className={classes.headerSection}>Manage Your Loans</div>
      <div className={classes.balanceSection}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box className={classes.typo2} color="#EF41CB" mb={0.5}>
            Lending Balance
          </Box>
          <div className={classes.typo1}>100 USDTs</div>
        </Box>
        <div className={classes.netAPYSection}>
          <div className={classes.gradientSection}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <div className={classes.typo2}>Net APY</div>
              <Box className={classes.typo3} mt={1}>
                0 %
              </Box>
            </Box>
          </div>
        </div>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box className={classes.typo2} color="#4541FF" mb={0.5}>
            Borrow Balance
          </Box>
          <div className={classes.typo1}>10240 USDTs</div>
        </Box>
      </div>
      <div
        className={classes.slideSection}
        style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 18 }}
      >
        <GradientSlider
          marks={SlideMarks}
          step={1}
          value={56}
          disabled
          // onChange={(event: any, newValue: number | number[]) => {
          //   setClosenessDegree(newValue as number[]);
          // }}
          className={classes.slider}
          valueLabelDisplay="on"
          style={{ width: "90%" }}
        />
      </div>
    </div>
  );
};

export default NFTManageLoansPage;
