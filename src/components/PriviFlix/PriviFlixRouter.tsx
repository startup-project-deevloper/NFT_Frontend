import React from "react";
import { Switch, Route } from "react-router-dom";

import HomePage from "./subPages/HomePage";
import ProfilePage from "./subPages/ProfilePage";

export default function PriviFlixRouter(props) {
  return (
    <Switch>
      <Route exact path="/flix" component={HomePage} />
      <Route exact path="/flix/profile/:userSlug" component={ProfilePage} />
    </Switch>
  );
}
