import React from "react";
import cls from "classnames";

import { Tab, Tabs } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { useMobileMenuStyles } from "./index.styles";
import { useHistory, useLocation } from "react-router-dom";

const TABS = [
  "HOME",
  "EXPLORE",
  "MARKETPLACE",
  // "PODS",
  "NFT LOANS",
  "LIKED CONTENT",
  "NFT FRACTIONALISATION",
];

export default function MobileMenu() {
  const classes = useMobileMenuStyles();
  const location = useLocation();
  const history = useHistory();

  const getCurrentActiveTab = () => {
    if (location.pathname.includes("explorer")) {
      return TABS[1];
    } else if (location.pathname.includes("marketplace")) {
      return TABS[2];
    // } else if (location.pathname.includes("pods")) {
    //   return TABS[4];
    } else if (location.pathname.includes("loan")) {
      return TABS[3];
    } else if (location.pathname.includes("like")) {
      return TABS[4];
    } else if (location.pathname.includes("fractionalisation") || location.pathname.includes("fractionalise")) {
      return TABS[5];
    }

    return TABS[0];
  };

  const goToPage = value => {
    if (value === TABS[0]) {
      history.push("/pix/");
    } else if (value === TABS[1]) {
      history.push("/pix/explorer");
    } else if (value === TABS[2]) {
      history.push("/pix/marketplace");
    // } else if (value === TABS[4]) {
    //   history.push("/pix/pods");
    } else if (value === TABS[3]) {
      history.push("/pix/loan");
    } else if (value === TABS[4]) {
      history.push("/pix/like");
    } else if (value === TABS[5]) {
      history.push("/pix/fractionalise");
    }
  };

  return (
    <Box className={classes.container}>
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={getCurrentActiveTab()}
        className={classes.content}
        onChange={(e, value) => {
          goToPage(value);
        }}
      >
        {TABS.map((key, index) => (
          <Tab
            value={key}
            label={key}
            key={`option-${index}`}
            className={cls({ [classes.selected]: key === getCurrentActiveTab() }, classes.tab)}
          />
        ))}
      </Tabs>
    </Box>
  );
}
