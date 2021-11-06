import React, { useEffect, useState } from "react";

import { useMediaQuery, useTheme } from "@material-ui/core";

import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import Box from "shared/ui-kit/Box";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { useManageLoansPageStyles } from "./index.styles";

const NFTManageLoansPage = () => {
  const classes = useManageLoansPageStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <div className={classes.root}>
      <BackButton purple />
      <div className={classes.headerSection}>Manage Your Loans</div>
      <div className={classes.balanceSection}>
        <Box display="flex" flexDirection="column" alignItems="center"></Box>
      </div>
    </div>
  );
};

export default NFTManageLoansPage;
