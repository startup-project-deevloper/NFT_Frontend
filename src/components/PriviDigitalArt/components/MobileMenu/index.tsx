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
  "PODS",
  "NFT LOANS",
  "SAVED CONTENT",
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
    } else if (location.pathname.includes("pods")) {
      return TABS[3];
    } else if (location.pathname.includes("loan")) {
      return TABS[4];
    } else if (location.pathname.includes("like")) {
      return TABS[5];
    } else if (location.pathname.includes("fractionalisation") || location.pathname.includes("fractionalise")) {
      return TABS[6];
    }

    return TABS[0];
  };

  const goToPage = value => {
    if (value === TABS[0]) {
      history.push("/");
    } else if (value === TABS[1]) {
      history.push("/explorer");
    } else if (value === TABS[2]) {
      history.push("/marketplace");
    } else if (value === TABS[3]) {
      history.push("/pods");
    } else if (value === TABS[4]) {
      history.push("/loan");
    } else if (value === TABS[5]) {
      history.push("/like");
    } else if (value === TABS[6]) {
      history.push("/fractionalise");
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
