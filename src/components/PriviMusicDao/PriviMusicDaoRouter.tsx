import React from "react";
import { Switch, Route } from "react-router-dom";
import ClaimableMusicPage from "./subPages/ClaimableMusicPage";
import FullDaoProposal from "./subPages/FullDaoProposal";
import GovernancePage from "./subPages/GovernancePage";
import HighYieldPage from "./subPages/HighYieldPage";
import HomePage from "./subPages/HomePage";
import LiquidityPage from "./subPages/LiquidityPage";
import ProposalPage from "./subPages/ProposalPage";
import StakingPage from "./subPages/StakingPage";
import VotePage from "./subPages/VotePage";
import ClaimMusicPod from "components/PriviPods/subpages/ClaimMusic/ClaimMusicPod";
import FullVote from "./subPages/FullVote";
import SongsPage from "./subPages/HomePage/Songs";
import ArtistsPage from "./subPages/HomePage/Artists";
import TrendingSongsPage from "./subPages/HomePage/TrendingSongs";
import ArtistPage from "./subPages/ArtistPage";
import LiquidityPoolDetailPage from "./subPages/LiquidityPage/LiquidityPoolDetail";
import LiquidityPoolManagementPage from "./subPages/LiquidityPage/LiquidityPoolManagement";
import LiquidityPositionPage from "./subPages/LiquidityPage/LiquidityPosition";
import CalculatorPage from "./subPages/CalculatorPage";
import DiscussionAllPage from "./subPages/GovernancePage/DiscussionAll";
import DiscussionDetailPage from "./subPages/GovernancePage/DiscussionDetail";
import PriviMusicPage from "./subPages/PriviMusic";
import PodsPage from "./subPages/PodsPage";
import { PodDetailsPage } from "./subPages/PodDetailsPage";
import { PodDistributionPage } from "./subPages/PodDistributionPage";
import FullWallPost from "./subPages/FullWallPost";
import TradeTraxPage from "./subPages/TradeTraxPage";
import FreeMusicPage from "./subPages/FreeMusicPage";
import MusicStackPage from "./subPages/MusicStackPage";
import PotionsPage from "./subPages/PotionsPage";
import PotionsBopsPage from "./subPages/PotionsBopsPage";
import ProfilePage from "./subPages/ProfilePage";
import Messenger from "./subPages/Messenger";
import PotionSongDetailPage from "./subPages/PotionSongDetailPage";
import PotionRevenuePage from "./subPages/PotionRevenuePage";
import PotionPreviewPage from "./subPages/PotionPreviewPage";
import PotionsManageBopsPae from "./subPages/PotionsManageBopsPage";
import MusicSubscriptionPage from "./subPages/MusicSubscription";
import MultiArtistDetailPage from "./subPages/MultiArtistDetailPage";
import PotionBopsDetailPage from "./subPages/PotionBopsDetailPage";
import PodsAllPage from "./subPages/PodsAllPage";
import WallPostPage from "./subPages/WallPostPage";

export default function PriviMusicDaoRouter(props) {
  return (
    <Switch>
      <Route exact path="/trax/" component={HomePage} />
      <Route exact path="/trax/:userId/messages" component={Messenger} />
      <Route exact path="/trax/songs" component={SongsPage} />
      <Route exact path="/trax/artists" component={ArtistsPage} />
      <Route exact path="/trax/trending_songs" component={TrendingSongsPage} />
      <Route exact path="/trax/staking/" component={StakingPage} />
      <Route exact path="/trax/liquidity/" component={LiquidityPage} />
      <Route exact path="/trax/liquidity/pool_detail/:id" component={LiquidityPoolDetailPage} />
      <Route exact path="/trax/liquidity/pool_management/:id" component={LiquidityPoolManagementPage} />
      <Route exact path="/trax/liquidity/position/:id" component={LiquidityPositionPage} />
      <Route exact path="/trax/governance/" component={GovernancePage} />
      <Route exact path="/trax/governance/all_discussions" component={DiscussionAllPage} />
      <Route exact path="/trax/governance/discussion_detail/:id" component={DiscussionDetailPage} />
      <Route exact path="/trax/high-yield/" component={HighYieldPage} />
      <Route exact path="/trax/governance/votes/" component={VotePage} />
      <Route exact path="/trax/governance/votes/:id" component={FullVote} />
      <Route exact path="/trax/governance/proposals/" component={ProposalPage} />
      <Route exact path="/trax/governance/proposals/:id" component={FullDaoProposal} />
      <Route exact path="/trax/claimable-music/" component={ClaimableMusicPage} />
      <Route exact path="/trax/claimable-music/:podAddress" component={ClaimMusicPod} />
      <Route exact path="/trax/artists/:id" component={ArtistPage} />
      <Route exact path="/trax/mutli-artist/:id" component={MultiArtistDetailPage} />
      <Route exact path="/trax/free-music" component={FreeMusicPage} />
      <Route exact path="/trax/staking/calculator" component={CalculatorPage} />      
      <Route exact path="/trax/pods" component={PodsPage} />
      <Route exact path="/trax/pod_post/:id" component={WallPostPage} />
      <Route exact path="/trax/pods/all" component={PodsAllPage} />
      <Route exact path="/trax/pods/distribution/:podAddress" component={PodDistributionPage} />
      <Route exact path="/trax/pods/:podId" component={PodDetailsPage} />
      <Route exact path="/trax/pods/:podAddress/:wallPostId" component={FullWallPost} />
      <Route exact path="/trax/trade-trax/" component={TradeTraxPage} />
      <Route exact path="/trax/potions/" component={PotionsPage} />
      <Route exact path="/trax/potions/revenue" component={PotionRevenuePage} />
      <Route exact path="/trax/potions/preview" component={PotionPreviewPage} />
      <Route exact path="/trax/potions/manageBops" component={PotionsManageBopsPae} />
      <Route exact path="/trax/potions/manageBops/:id" component={PotionBopsDetailPage} />
      <Route exact path="/trax/profile/:userSlug" component={ProfilePage} />
      <Route exact path="/trax/potions/:id" component={PotionSongDetailPage} />
      <Route exact path="/trax/potions/:songId/bops" component={PotionsBopsPage} />
      <Route exact path="/trax/music-subscription" component={MusicSubscriptionPage} />
      <Route exact path="/trax/music/stack/:id" component={MusicStackPage} />
      <Route exact path="/trax/music" component={PriviMusicPage} />
      <Route exact path="/trax/music/home" component={PriviMusicPage} />
      <Route exact path="/trax/music/home/new-albums" component={PriviMusicPage} />
      <Route exact path="/trax/music/home/featured-artists" component={PriviMusicPage} />
      <Route exact path="/trax/music/home/world-ranking" component={PriviMusicPage} />
      <Route exact path="/trax/music/home/weekly-discover" component={PriviMusicPage} />
      <Route exact path="/trax/music/playlists" component={PriviMusicPage} />
      <Route exact path="/trax/music/my-fruits" component={PriviMusicPage} />
      <Route exact path="/trax/music/search" component={PriviMusicPage} />
      <Route exact path="/trax/music/search/recent-searches" component={PriviMusicPage} />
      <Route exact path="/trax/music/search/genres" component={PriviMusicPage} />
      <Route exact path="/trax/music/search/explore-all" component={PriviMusicPage} />
      <Route exact path="/trax/music/artist/:artistName" component={PriviMusicPage} />
      <Route exact path="/trax/music/album/:albumName" component={PriviMusicPage} />
      <Route exact path="/trax/music/album/:albumName/:songName" component={PriviMusicPage} />
      <Route exact path="/trax/music/playlist/:playlist" component={PriviMusicPage} />
      <Route exact path="/trax/music/genre/:genreName" component={PriviMusicPage} />
      <Route exact path="/trax/music/queued" component={PriviMusicPage} />
    </Switch>
  );
}
