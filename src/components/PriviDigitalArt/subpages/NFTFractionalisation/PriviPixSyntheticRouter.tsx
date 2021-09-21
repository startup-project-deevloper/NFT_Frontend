import React from "react";
import { Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import SyntheticFractionalisePage from "./components/SyntheticFractionalisePage";

export const useStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      padding: "0px 0px",
    },
  },
}));

export default function PriviPixSyntheticRouter(props) {
  return (
    <Switch>
      <Route exact path="/pix/fractionalise/synthetic-derivative">
        <SyntheticFractionalisePage
          openFractionalize={props.openFractionalize}
          setSelectedTab={props.setSelectedTab}
          selectedTab={props.selectedTab}
          setOpenFractionalize={props.setOpenFractionalize}
        />
      </Route>
    </Switch>
  );
}
