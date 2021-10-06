import React from "react";
import * as LOADERS from "./Loaders";
import PrivateRoute from "./PrivateRoute";
import { useSlug } from "shared/hooks/useSlug";
import { useLogin } from "shared/hooks/useLogin";
import { Redirect, Route, Switch } from "react-router-dom";

const Routes = () => {
  const isLogin = useLogin();
  const [slugSelector, selectedUserId] = useSlug();

  return (
    <Switch>
      <Route exact path="/connect" component={LOADERS.PriviPixConnect} />
      <Route path="/">
        {isLogin ? <LOADERS.PriviDigitalArt /> : <Redirect to="/connect" />}
      </Route>      
    </Switch>
  );
};

export default Routes;
