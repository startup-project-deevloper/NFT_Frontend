import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import SimpleCarousel from "react-simply-carousel";

import Staking from "./SubPages/Staking";
import Investments from "./SubPages/Investments";
import Discussion from "./SubPages/Discussion";
import Chat from "./SubPages/Chat";
import { Media } from "./SubPages/Media";
import DiscussionPage from "./SubPages/Discussion/components/DiscussionPage";
import { Proposals } from "./SubPages/Proposals";
import { FundCard } from "components/PriviMusicDao/components/Cards/FundCard";
import NewDistributionModal from "components/PriviMusicDao/modals/NewDistributionModal";
import PodHeader from "./Header";
import PodArtists from "./Artists";
import { useTypedSelector } from "store/reducers/Reducer";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs/LoadingWrapper";
import { musicDaoGetPod } from "shared/services/API";
import { Gradient, SecondaryButton } from "shared/ui-kit";
import { default as ServerURL } from "shared/functions/getURL";
import URL from "shared/functions/getURL";

import { usePodDetailStyles } from "./index.styles";

const PODSTABOPTIONS = ["Media", "Reward", "Investments", "Discussion", "Chat", "Proposals"];

export const PodDetailsPage = () => {
  const classes = usePodDetailStyles();
  const params: any = useParams();
  const users = useTypedSelector(state => state.usersInfoList);
  const userSelector = useTypedSelector(state => state.user);

  const user = useTypedSelector(state => state.user);

  const [podMenuSelection, setPodMenuSelection] = React.useState<string>(PODSTABOPTIONS[0]);
  const [pod, setPod] = React.useState<any>();
  const [followed, setFollowed] = React.useState<boolean>(false);

  const [activeSlide, setActiveSlide] = React.useState<number>(0);
  const [isDataLoading, setIsDataLoading] = React.useState<boolean>(false);
  const [discussions, setDiscussions] = React.useState<any>();
  const [openDistributionTopic, setOpenDistributionTopic] = React.useState<boolean>(false);

  const [fundingEnded, setFundingEnded] = React.useState<boolean>(false);
  const [fundingEndTime, setFundingEndTime] = React.useState<any>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const podId = params?.podId;

  React.useEffect(() => {
    if (podId) {
      loadData();

      setIsDataLoading(true);
      axios
        .get(`${URL()}/podDiscussion/new/getDiscussions/${podId}/TRAX`)
        .then(res => {
          const discussionData = [...res.data.topics];
          let len = discussionData.length;
          for (let i = 0; i < len; i++) {
            let curData = discussionData[i];
            if (users && users.length > 0) {
              curData["createdByImage"] =
                users[users.findIndex(user => user.id === curData.createdBy)].imageURL;
              curData["createdByName"] = users[users.findIndex(user => user.id === curData.createdBy)].name;
            }
          }
          setDiscussions(discussionData);
          setIsDataLoading(false);
        })
        .catch(error => {
          setIsDataLoading(false);
        });
    }
  }, [podId]);

  React.useEffect(() => {
    if (pod?.FundingDate) {
      const timerId = setInterval(() => {
        const now = new Date();
        let delta = Math.floor(pod.FundingDate - now.getTime() / 1000);
        if (delta < 0) {
          setFundingEnded(true);
          setFundingEndTime({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          });
          clearInterval(timerId);
        } else {
          let days = Math.floor(delta / 86400);
          delta -= days * 86400;

          // calculate (and subtract) whole hours
          let hours = Math.floor(delta / 3600) % 24;
          delta -= hours * 3600;

          // calculate (and subtract) whole minutes
          let minutes = Math.floor(delta / 60) % 60;
          delta -= minutes * 60;

          // what's left is seconds
          let seconds = delta % 60;
          setFundingEnded(false);
          setFundingEndTime({
            days,
            hours,
            minutes,
            seconds,
          });
        }
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [pod?.FundingDate]);

  const createNewTopic = (title, description) => {
    axios
      .post(`${ServerURL()}/podDiscussion/new/newChat`, {
        title,
        description,
        podId,
        createdBy: userSelector.id,
        podType: "TRAX",
      })
      .then(response => {
        const resp = response.data.data;
        const newDiscussionData = [{ id: resp.topicId, ...resp.topicData }, ...discussions];
        setDiscussions(newDiscussionData);
      });
  };

  const loadData = async () => {
    if (podId) {
      try {
        const resp = await musicDaoGetPod(podId);
        if (resp?.success) {
          const podData = resp.data;
          // podData.PostsArray = [];
          // podData.PostsArray.push({
          //   id: "Pxb9dbbc3e-2bd3-4301-a6d8-2600d9220148",
          //   Url: require("assets/backgrounds/audio.png"),
          //   hasPhoto: true,
          //   name: "Rallying market when providing stablecoins drop",
          //   shortText: "this is test.",
          //   createdBy: "priviUser146",
          //   responses: [1, 2, 3],
          // });
          podData.Votings = [];
          podData.Votings.push({
            question: "Do you think that having Cardano as collateral could benefit this pool?",
            description: "this is test.",
            endDate: Date.now(),
            possibleAnswers: ["yes", "no"],
            OpenVotation: true,
          });
          setPod(podData);
          const followers: any[] = podData.Followers ?? [];
          setFollowed(followers.find(followerData => followerData.id == user.id) != undefined);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  return pod ? (
    <Box className={classes.container}>
      <Box className={classes.subContainer}>
        <PodHeader
          pod={pod}
          followed={followed}
          setFollowed={setFollowed}
          fundingEnded={fundingEnded}
          fundingEndTime={fundingEndTime}
        />
        <PodArtists pod={pod} />
        {pod.distributionProposalAccepted && (
          <div className={classes.podSubPageHeader}>
            <Box className={classes.flexBox} justifyContent="center">
              {PODSTABOPTIONS.map((item, index) => {
                if ((item !== "Reward" && !fundingEnded) || fundingEnded) {
                  return (
                    <Box
                      key={`pod-detail-tab-${index}`}
                      className={`${classes.tabBox} ${
                        podMenuSelection === item ? classes.selectedTabBox : ""
                      }`}
                      onClick={() => setPodMenuSelection(item)}
                    >
                      {item}
                    </Box>
                  );
                }
              })}
            </Box>
          </div>
        )}
        <div className={classes.podSubPageContent}>
          {pod.distributionProposalAccepted && (
            <Box pt={1}>
              {podMenuSelection === PODSTABOPTIONS[0] && (
                <Media medias={pod.Medias} pod={pod} handleRefresh={loadData} />
              )}
              {podMenuSelection === PODSTABOPTIONS[1] && <Staking pod={pod} handleRefresh={loadData} />}
              {podMenuSelection === PODSTABOPTIONS[2] && <Investments pod={pod} handleRefresh={loadData} />}
              {podMenuSelection === PODSTABOPTIONS[3] && (
                <Discussion podId={podId} pod={pod} refreshPod={() => loadData()} />
              )}
              {podMenuSelection === PODSTABOPTIONS[4] && (
                <Chat
                  podId={podId}
                  pod={pod}
                  refreshPod={() => loadData()}
                  openProposal={() => setPodMenuSelection("Proposals")}
                />
              )}
              {podMenuSelection === "Proposals" && <Proposals />}
            </Box>
          )}
          {!pod.distributionProposalAccepted && (
            <Box>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box className={classes.header4}>All Proposals</Box>
                <Box display="flex" alignItems="center">
                  <Box
                    className={classes.arrowBox}
                    onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))}
                  >
                    <LeftArrowIcon />
                  </Box>
                  <Box
                    style={{ transform: `rotate(180deg)` }}
                    className={classes.arrowBox}
                    ml={3}
                    onClick={() => setActiveSlide(prev => Math.min(5, prev + 1))}
                  >
                    <LeftArrowIcon />
                  </Box>
                </Box>
              </Box>
              <Box width={1} overflow="hidden">
                {!pod.Proposals || pod.Proposals.length === 0 ? (
                  <>No proposals yet</>
                ) : (
                  <SimpleCarousel
                    containerProps={{
                      style: {
                        width: "100%",
                        justifyContent: "flex-start",
                      },
                    }}
                    activeSlideIndex={activeSlide}
                    onAfterChange={setActiveSlide}
                    forwardBtnProps={{
                      style: {
                        display: "none",
                      },
                    }}
                    backwardBtnProps={{
                      style: {
                        display: "none",
                      },
                    }}
                    speed={400}
                    infinite={false}
                  >
                    {pod.Proposals.map((proposal, i) => {
                      return (
                        <Box width={"600px"} pr={2} key={i}>
                          <FundCard
                            podId={podId}
                            pod={pod}
                            proposal={proposal}
                            handleRefresh={handleRefresh}
                          />
                        </Box>
                      );
                    })}
                  </SimpleCarousel>
                )}
              </Box>
              <Box className={classes.flexBox} justifyContent="space-between" my={3}>
                <div className={classes.header4}>Discussion</div>
                <SecondaryButton
                  size="medium"
                  onClick={() => setOpenDistributionTopic(true)}
                  isRounded
                  style={{ border: "none", background: Gradient.Green1, color: "white" }}
                >
                  New Distribution Proposal
                </SecondaryButton>
              </Box>
              <Box className={classes.discussionContent}>
                <LoadingWrapper loading={isDataLoading}>
                  <DiscussionPage
                    discussions={discussions}
                    postType="mediaPod"
                    podId={pod.podId}
                    key={pod.podId}
                    createNewTopic={createNewTopic}
                  />
                </LoadingWrapper>
              </Box>
            </Box>
          )}
        </div>
      </Box>
      <NewDistributionModal
        pod={pod}
        podId={podId}
        open={openDistributionTopic}
        handleRefresh={handleRefresh}
        onClose={() => setOpenDistributionTopic(false)}
        createNewTopic={createNewTopic}
      />
    </Box>
  ) : (
    <LoadingWrapper loading />
  );
};

const LeftArrowIcon = () => (
  <svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.13229 11.3846L1.0744 6.48479M1.0744 6.48479L6.13229 1.58496M1.0744 6.48479H13.9277"
      stroke="#181818"
      stroke-width="1.5122"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
