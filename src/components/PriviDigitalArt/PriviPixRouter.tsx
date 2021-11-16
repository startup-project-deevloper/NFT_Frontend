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
import NFTLoanAssetDetailPage from "./subpages/NFTLoanAssetDetailPage";
import NFTManageLoansPage from "./subpages/NFTManageLoansPage";
import WithdrawnNFTPage from "./subpages/WithdrawnNFTPage";
// import PodPage from "./subpages/PodPage";
// import PodPageIndividual from "./subpages/PodPageIndividual";
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
import NFTReserves from "./subpages/NFTReserves";
import CreateNftOption from "./subpages/NFTReserves/components/CreateNftOption";
import ExploreReserveDetailPage from "./subpages/NFTReserves/components/ExploreReserveDetailPage";
import ManageOptionDetailPage from "./subpages/NFTReserves/components/ManageOptionDetailPage";
import NftCreatorAcceptPage from "./subpages/NFTReserves/components/NftCreatorAcceptPage";
import OfferAcceptedPage from "./subpages/NFTReserves/components/OfferAcceptedPage";
import BoughtNftView from "./subpages/NFTReserves/components/BoughtNftView";
import OfferPlacedDetailPage from "./subpages/NFTReserves/components/OfferPlacedDetailPage";
import PaymentPage from "./subpages/NFTReserves/components/PaymentPage";
import ExpirationDayFailedToPay from "./subpages/NFTReserves/components/ExpirationDayFailedToPay";
import ExpirationDayPaid from "./subpages/NFTReserves/components/ExpirationDayPaid";
import AfterOfferAccepted from "./subpages/NFTReserves/components/AfterOfferAccepted";
import TradeOnQuickSwap from "./subpages/NFTFractionalisation/components/SyntheticFractionalisedTradeJotPage/TradeOnQuickSwap";
import MarketplaceDetailPage from "./subpages/MarketplacePage/components/MarketplaceDetailPage";
import Fractionalise from "./subpages/NFTFractionalisation/components/Fractionalise";

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
      <Route exact path="/withdrawn_nfts/:collectionId" component={WithdrawnNFTPage} />
      <Route exact path="/explorer" component={ExplorePage} />
      <Route exact path="/explorer/:collectionName" component={CollectionPage} />
      <Route exact path="/saved-content" component={LikedPage} />
      {/* <Route exact path="/pods" component={PodPage} />
      <Route exact path="/pods/:podId" component={PodPageIndividual} /> */}
      <Route exact path="/marketplace" component={MarketplacePage} />
      <Route exact path="/loan" component={NFTLoansPage} />
      <Route exact path="/loan/positions" component={NFTPositionManagerPage} />
      <Route exact path="/loan/manage_loans" component={NFTManageLoansPage} />
      <Route exact path="/loan/:loanId" component={NFTLoanDetailPage} />
      <Route exact path="/loan/asset/:assetId" component={NFTLoanAssetDetailPage} />
      <Route exact path="/option/create_nft_option" component={CreateNftOption} />
      <Route exact path="/option/explore/:img_id" component={ExploreReserveDetailPage} />
      <Route exact path="/option/managefutures/:img_id" component={ManageOptionDetailPage} />
      <Route exact path="/option/nft_creator" component={NftCreatorAcceptPage} />
      <Route exact path="/option/offer_accepted" component={OfferAcceptedPage} />
      <Route exact path="/option/bought_nft_view" component={BoughtNftView} />
      <Route exact path="/option/offer_placed" component={OfferPlacedDetailPage} />
      <Route exact path="/option/payment" component={PaymentPage} />
      <Route exact path="/option/expiration_day_failed_pay" component={ExpirationDayFailedToPay} />
      <Route exact path="/option/expiration_day_paid" component={ExpirationDayPaid} />
      <Route exact path="/option/after_offer_accepted" component={AfterOfferAccepted} />
      <Route exact path="/option/:id" component={NFTReserves} />
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

      <Route exact path="/fractionalise/fractionalise" component={Fractionalise} />
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
      <Route exact path="/nft/:id" component={MediaPage} />
      <Route exact path="/marketplace/:id" component={MarketplaceDetailPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  );
}
