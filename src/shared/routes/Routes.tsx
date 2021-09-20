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
      {/*PUBLIC INITIAL ROUTE*/}
      {/* <Route exact path="/" component={LOADERS.PriviHome}>
        {isLogin === true ? <Redirect to="/privi-home" /> : <Redirect to="/zoo" />}
      </Route> */}
      <Route exact path="/" component={LOADERS.PriviZoo}>
        <Redirect to="/zoo" />
      </Route>
      <Route exact path="/pix">
        {isLogin ? <LOADERS.PriviDigitalArt /> : <Redirect to="/pix-connect" />}
      </Route>
      <Route exact path="/metaverse">
        {isLogin ? <LOADERS.PriviMetaverse /> : <Redirect to="/metaverse-connect" />}
      </Route>
      <Route exact path="/pay">
        {isLogin ? <LOADERS.PriviPay /> : <Redirect to="/pay-connect" />}
      </Route>
      <Route exact path="/social">
        {isLogin ? <Redirect to={`/social/${slugSelector}`} /> : <Redirect to="/social-connect" />}
      </Route>
      <Route path="/wallet">{isLogin ? <LOADERS.PriviWallet /> : <Redirect to="/wallet-connect" />}</Route>
      <Route path="/flix">{isLogin ? <LOADERS.PriviFlix /> : <Redirect to="/flix-connect" />}</Route>
      <Route exact path="/exchange">
        {isLogin ? <LOADERS.PriviExchange /> : <Redirect to="/exchange-connect" />}
      </Route>
      <Route exact path="/collabs">
        {isLogin ? <LOADERS.PriviCollab /> : <Redirect to="/collabs-connect" />}
      </Route>
      <Route exact path="/daos">
        {isLogin ? <LOADERS.PriviDAO /> : <Redirect to="/daos-connect" />}
      </Route>
      <Route path="/pods">{isLogin ? <LOADERS.PriviPods /> : <Redirect to="/pods-connect" />}</Route>
      <Route path="/data">{isLogin ? <LOADERS.NewPriviData /> : <Redirect to="/data-connect" />}</Route>
      <Route path="/trax">{isLogin ? <LOADERS.PriviMusicDao /> : <Redirect to="/trax-connect" />}</Route>
      <Route exact path="/governance">
        {isLogin ? <Redirect to="/zoo" /> : <Redirect to="/governance-connect" />}
      </Route>

      {/*PUBLIC ROUTES*/}
      <Route path="/signin" component={LOADERS.SignIn} />
      <Route path="/signup" component={LOADERS.SignUp} />
      <Route path="/forgot" component={LOADERS.ForgotPassword} />
      <Route path="/resend-email" component={LOADERS.ResendEmailValidation} />
      <Route path="/zoo" exact component={LOADERS.PriviZoo} />
      <Route path="/pix-connect" exact component={LOADERS.PriviPixConnect} />
      <Route path="/social-connect" exact component={LOADERS.PriviSocialConnect} />
      <Route path="/metaverse-connect" exact component={LOADERS.PriviMetaverseConnect} />
      <Route path="/pay-connect" exact component={LOADERS.PriviPayConnect} />
      <Route path="/wallet-connect" exact component={LOADERS.PriviWalletConnect} />
      <Route path="/flix-connect" exact component={LOADERS.PriviFlixConnect} />
      <Route path="/exchange-connect" exact component={LOADERS.PriviExchangeConnect} />
      <Route path="/collabs-connect" exact component={LOADERS.PriviCollabConnect} />
      <Route path="/daos-connect" exact component={LOADERS.PriviDAOConnect} />
      <Route path="/pods-connect" exact component={LOADERS.PriviPodsConnect} />
      <Route path="/data-connect" exact component={LOADERS.PriviDataConnect} />
      <Route path="/governance-connect" exact component={LOADERS.PriviGovernanceConnect} />
      <Route path="/zoo/page/" component={LOADERS.PriviZooPages} />
      <Route path="/trax-connect" exact component={LOADERS.PriviMusicDaoConnect} />
      <Route path="/privi-music" exact component={LOADERS.PriviMusic} />
      <Route path="/pix" component={LOADERS.PriviDigitalArt} />
      <Route path="/privi-land" exact component={LOADERS.PriviLandPage} />
      <Route path="/zoo/claim/" component={LOADERS.PriviZooClaim} />

      <PrivateRoute
        path={"/social/:id/social-token"}
        exact
        render={props =>
          window.location.href.includes(slugSelector) ? (
            <LOADERS.PriviSocial {...props} id={selectedUserId} />
          ) : (
            <Redirect to={`/social/${slugSelector}/social-token`} />
          )
        }
      />
      <PrivateRoute
        path={"/social/:id"}
        render={props =>
          window.location.href.includes(slugSelector) ? (
            <LOADERS.PriviSocial {...props} id={selectedUserId} />
          ) : (
            <Redirect to={`/social/${slugSelector}`} />
          )
        }
      />
      {/*PRIVATE ROUTES*/}
      <PrivateRoute path="/bridge" component={LOADERS.Bridge} />
      {/*PRIVATE REDIRECT ROUTES*/}
      <PrivateRoute
        path="/daos/:idCommunity"
        render={props => (
          <>
            {slugSelector !== "" && <Redirect to={"/daos/" + slugSelector} />}
            <LOADERS.PriviDAOPage {...props} />
          </>
        )}
      />
      {/* DEFAULT ROUTE */}
      {/* <Route component={LOADERS.PriviHome} /> */}
      <Route component={LOADERS.PriviZoo} />
    </Switch>
  );
};

export default Routes;
