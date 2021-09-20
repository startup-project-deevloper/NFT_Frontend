import Messenger from "components/PriviSocial/subpages/Messenger";
import React from "react";
import { Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import HomePage from "./subpages/HomePage";
import LikedPage from "./subpages/LikedPage";
import MarketplacePage from "./subpages/MarketplacePage";
import MediaPage from "./subpages/MediaPage";
import NFTLoansPage from "./subpages/NFTLoansPage";
import NFTLoanDetailPage from "./subpages/NFTLoanDetailPage";
import PodPage from "./subpages/PodPage";
import PodPageIndividual from "./subpages/PodPageIndividual";
import WallPostPage from "./subpages/PodPageIndividual/components/Discussion/components/WallPostPage";
import ProfilePage from "./subpages/ProfilePage";
import ExplorePage from "./subpages/ExplorePage";
import CollectionPage from "./subpages/CollectionPage";
import NFTFractionalisation from "./subpages/NFTFractionalisation";
import FractionPage from "./subpages/NFTFractionalisation/components/FractionPage";
import SyntheticFractionPage from "./subpages/NFTFractionalisation/components/SyntheticFractionPage";
import SyntheticFractionalisedCollectionPage from "./subpages/NFTFractionalisation/components/SyntheticFractionalisedCollectionPage";
import SyntheticFractionalisedCollectionNFTPage from "./subpages/NFTFractionalisation/components/SyntheticFractionalisedCollectionNFTPage";
import NFTPositionManagerPage from "./subpages/NFTPositionManagerPage";
import MyNFTPage from "./subpages/MyNFTPage";

export const useStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      padding: "0px 0px",
    },
  },
}));

export default function PriviPixRouter(props) {
  const { container } = useStyles();
  return (
    <Switch>
      <Route exact path="/pix/" component={HomePage} />
      <Route exact path="/pix/mynft" component={MyNFTPage} />
      <Route exact path="/pix/explorer" component={ExplorePage} />
      <Route exact path="/pix/explorer/:collectionName" component={CollectionPage} />
      <Route exact path="/pix/like" component={LikedPage} />
      <Route exact path="/pix/pods" component={PodPage} />
      <Route exact path="/pix/marketplace" component={MarketplacePage} />
      <Route exact path="/pix/loan" component={NFTLoansPage} />
      <Route exact path="/pix/loan/positions" component={NFTPositionManagerPage} />
      <Route exact path="/pix/loan/:id" component={NFTLoanDetailPage} />
      <Route exact path="/pix/fractionalisation" component={NFTFractionalisation} />
      <Route exact path="/pix/fractionalisation/:id" component={FractionPage} />
      <Route exact path="/pix/fractionalisation/synthetic/:id" component={SyntheticFractionPage} />
      <Route
        exact
        path="/pix/fractionalisation/collection/:id"
        component={SyntheticFractionalisedCollectionPage}
      />
      <Route
        exact
        path="/pix/fractionalisation/collection/:collectionId/nft/:nftId/:auction"
        component={SyntheticFractionalisedCollectionNFTPage}
      />

      <Route exact path="/pix/pod_post/:id" component={WallPostPage} />
      <Route exact path="/pix/:id/profile" component={ProfilePage} />
      <Route
        exact
        path="/pix/:userId/messages"
        render={() => (
          <div className={container}>
            <Messenger type="pix" />
          </div>
        )}
      />
      <Route exact path="/pix/pods/:id" component={PodPageIndividual} />
      <Route exact path="/pix/:id" component={MediaPage} />
    </Switch>
  );
}
