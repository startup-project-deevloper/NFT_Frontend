import React from "react";
import { Switch, Route } from "react-router-dom";

import HomePage from "./subpages/HomePage";
import AdvertisePage from "./subpages/AdvertisePage";
import AdvertiseDetailPage from "./subpages/AdvertiseDetailPage";
import BuyDatapPage from "./subpages/BuyDATApPage";
import GovernancePage from "./subpages/GovernancePage";
import DiscussionsPage from "./subpages/DiscussionsPage";
import VotePage from "./subpages/VotePage";
import ProposalPage from './subpages/ProposalPage';
import VoteDetailPage from './subpages/VoteDetailPage';
import FullDiscussionPage from "./subpages/FullDiscussionPage";
import ProposalDetailPage from "./subpages/ProposalDetailPage";

export default function PriviDataRouter(props) {
  return (
    <Switch>
      <Route exact path="/data/" component={HomePage} />
      <Route exact path="/data/advertise/" component={AdvertisePage} />
      <Route exact path="/data/advertise/:id" component={AdvertiseDetailPage} />
      <Route exact path="/data/buydatap/" component={BuyDatapPage} />
      <Route exact path="/data/governance/" component={GovernancePage} />
      <Route exact path="/data/governance/discussions/" component={DiscussionsPage} />
      <Route exact path="/data/governance/discussions/:id" component={FullDiscussionPage} />
      <Route exact path="/data/governance/votes/" component={VotePage} />
      <Route exact path="/data/governance/proposals/" component={ProposalPage} />
      <Route exact path="/data/governance/votes/:id/" component={VoteDetailPage} />
      <Route exact path="/data/governance/proposals/:id/" component={ProposalDetailPage} />
    </Switch>
  );
}
