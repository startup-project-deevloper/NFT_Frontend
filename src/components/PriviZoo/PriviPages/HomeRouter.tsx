import React from "react";
import { Switch, Route } from "react-router-dom";
import AppPage from "./AppPage";
import MyApps from "./MyApps";

export default function HomeRouter(props) {
  return (
    <Switch>
      <Route exact path="/zoo/page/apps/" component={MyApps} />
      <Route exact path="/zoo/page/:appId/" component={AppPage} />
    </Switch>
  );
}
