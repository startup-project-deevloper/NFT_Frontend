import Messenger from "components/PriviSocial/subpages/Messenger";
import React from "react";
import { Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
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

import TradeOnQuickSwap from "./subpages/NFTFractionalisation/components/SyntheticFractionalisedTradeJotPage/TradeOnQuickSwap";
import MarketplaceDetailPage from "./subpages/MarketplacePage/components/MarketplaceDetailPage";

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
      <Route exact path="/mynft" component={MyNFTPage} />
      <Route exact path="/explorer" component={ExplorePage} />
      <Route exact path="/explorer/:collectionName" component={CollectionPage} />
      <Route exact path="/like" component={LikedPage} />
      <Route exact path="/pods" component={PodPage} />
      <Route exact path="/pods/:podId" component={PodPageIndividual} />
      <Route exact path="/marketplace" component={MarketplacePage} />
      <Route exact path="/loan" component={NFTLoansPage} />
      <Route exact path="/loan/positions" component={NFTPositionManagerPage} />
      <Route exact path="/loan/:id" component={NFTLoanDetailPage} />
      <Route exact path="/fractionalisation/:id" component={FractionPage} />
      <Route exact path="/fractionalisation/synthetic/:id" component={SyntheticFractionPage} />
      <Route
        exact
        path="/fractionalisation/collection/:id"
        component={SyntheticFractionalisedCollectionPage}
      />
      <Route
        exact
        path="/fractionalisation/collection/:collectionId/nft/:nftId"
        component={SyntheticFractionalisedCollectionNFTPage}
      />
      <Route exact path="/fractionalisation/collection/quick_swap/:id" component={TradeOnQuickSwap} />

      <Route path="/fractionalise" component={NFTFractionalisation} />

      <Route exact path="/pod_post/:id" component={WallPostPage} />
      <Route exact path="/:id/profile" component={ProfilePage} />
      <Route
        exact
        path="/:userId/messages"
        render={() => (
          <div className={container}>
            <Messenger type="pix" />
          </div>
        )}
      />
      <Route exact path="/pods/:id" component={PodPageIndividual} />
      <Route exact path="/nft/:id" component={MediaPage} />
      <Route exact path="/marketplace/:tokenAddress/:tokenId" component={MarketplaceDetailPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  );
}
