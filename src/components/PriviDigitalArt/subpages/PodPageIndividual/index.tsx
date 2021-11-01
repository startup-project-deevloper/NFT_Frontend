import React, { useEffect, useState } from "react";
import axios from "axios";
import Web3 from "web3";
import { useParams } from "react-router-dom";
import SimpleCarousel from "react-simply-carousel";

import Staking from "./subPages/Staking";
import Investments from "./subPages/Investments";
import Discussion from "./subPages/Discussion";
import Chat from "./subPages/Chat";
import { Media } from "./subPages/Media";
import Discord from "./Discord";
import { Proposals } from "./subPages/Proposals";
import { ProposalPodCard } from "components/PriviDigitalArt/components/Cards/ProposalPodCard";
import NewDistributionModal from "components/PriviDigitalArt/modals/NewDistributionModal";
import PodHeader from "./Header";
import PodArtists from "./Artists";
import { useTypedSelector } from "store/reducers/Reducer";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs/LoadingWrapper";
import { getPod } from "shared/services/API/PriviPodAPI";
import { Color, Gradient, SecondaryButton } from "shared/ui-kit";
import { default as ServerURL } from "shared/functions/getURL";

import { usePodPageIndividualStyles } from "./index.styles";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import { BlockchainNets } from "shared/constants/constants";
import { useWeb3React } from "@web3-react/core";
import { onGetNonDecrypt } from "shared/ipfs/get";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import useIPFS from "shared/utils-IPFS/useIPFS";

const apiType = "pix";
const PODSTABOPTIONS = ["Media", "Reward", "Investments", "Discussion", "Chat", "Proposals"];

const getPodState = pod => {
  if (pod && pod.FundingDate && pod.FundingDate > Math.trunc(Date.now() / 1000)) {
    pod.status = "Funding";
  } else if (
    pod &&
    pod.FundingDate &&
    pod.FundingDate <= Math.trunc(Date.now() / 1000) &&
    (pod.RaisedFunds || 0) < pod.FundingTarget
  ) {
    pod.status = "Funding Failed";
  } else if (
    pod &&
    pod.FundingDate &&
    pod.FundingDate <= Math.trunc(Date.now() / 1000) &&
    (pod.RaisedFunds || 0) >= pod.FundingTarget
  ) {
    pod.status = "Funded";
  }
  return pod;
};

const PodPageIndividual = () => {
  const classes = usePodPageIndividualStyles();
  const params: any = useParams();
  const user = useTypedSelector(state => state.user);

  const [podMenuSelection, setPodMenuSelection] = useState<string>(PODSTABOPTIONS[0]);
  const [pod, setPod] = useState<any>();
  const [podInfo, setPodInfo] = useState<any>(null);
  const [followed, setFollowed] = useState<boolean>(false);
  const [isCreatorOrCollab, setIsCreatorOrCollab] = useState<boolean>(false);

  const [generalChat, setGeneralChat] = useState<string>("");

  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [discussions, setDiscussions] = useState<any>();
  const [openDistributionTopic, setOpenDistributionTopic] = useState<boolean>(false);

  const [fundingEnded, setFundingEnded] = useState<boolean>(false);
  const [fundingEndTime, setFundingEndTime] = useState<any>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const { library } = useWeb3React();

  const podId = params?.podId;

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  const [imageIPFS, setImageIPFS] = useState({});

  const isFunded = React.useMemo(
    () =>
      pod &&
      pod.FundingDate &&
      pod.FundingDate < Math.trunc(Date.now() / 1000) &&
      (+pod.RaisedFunds || 0) >= +pod.FundingTarget,
    [pod]
  );

  const [isExpired, setExpired] = useState<boolean>(true);

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    if (podId && ipfs ) {
      loadData();
    }
  }, [podId, ipfs]);

  useEffect(() => {
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

        const podRef = pod;
        setPod(getPodState(podRef));
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [pod?.FundingDate]);

  useEffect(() => {
    if (!pod || !pod.PodAddress) return;

    (async () => {
      if (ipfs ) {
        const web3APIHandler = BlockchainNets[1].apiHandler;
        const web3 = new Web3(library.provider);

        const podInfo = await web3APIHandler?.PodManager.getPodInfo(web3, {
          podAddress: pod.PodAddress,
          fundingToken: pod.FundingToken,
        });
        setPodInfo(podInfo);
      }
    })();

    const podRef = pod;
    setPod(getPodState(podRef));
  }, [pod, pod?.PodAddress]);

  const getImageIPFS = async (cid: string) => {
    let files = await onGetNonDecrypt(cid, (fileCID, download) =>
      downloadWithNonDecryption(fileCID, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.content);
      setImageIPFS("data:image/png;base64," + base64String);
    }
  };

  const createNewTopic = (title, description) => {
    axios
      .post(`${ServerURL()}/podDiscussion/new/newChat`, {
        title,
        description,
        podId,
        createdBy: user.id,
        podType: "PIX",
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
        const resp = await getPod(podId, apiType);
        if (resp?.success) {
          let podData = resp.data;

          const cur = new Date().getTime() - podData.Created;
          const deadline = podData.ProposalDeadline._seconds*1000 - podData.Created;
          if(cur > deadline) {
            setExpired(true)
          } else {
            setExpired(false)
          }

          podData = getPodState(podData);

          if (!podData.distributionProposalAccepted) {
            let privateChats: any[] = podData.PrivateChats;

            let generalChat: any = privateChats.find(chat => chat.title === "General");
            if (generalChat && generalChat.id) {
              setGeneralChat(generalChat.id);
            }
          }

          let isCollab = podData.Collabs.findIndex(collab => collab.userId === user.id);
          if (podData.CreatorId === user.id || isCollab !== -1) {
            setIsCreatorOrCollab(true);
          }

          setPod(podData);
          if (podData && podData.InfoImage && podData.InfoImage.newFileCID) {
            getImageIPFS(podData.InfoImage.newFileCID);
          }
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

  return (pod && !pod.PodAddress) || (pod && pod.PodAddress && podInfo) ? (
    <Box className={classes.container}>
      <Box className={classes.subContainer}>
        <PodHeader
          pod={pod}
          podInfo={podInfo}
          followed={followed}
          setFollowed={setFollowed}
          fundingEnded={fundingEnded}
          fundingEndTime={fundingEndTime}
          isFunded={isFunded}
          imageIPFS={imageIPFS}
        />
        <PodArtists pod={pod} />
        {pod.distributionProposalAccepted && (
          <div className={classes.podSubPageHeader}>
            <Box className={classes.flexBox} justifyContent="center">
              {PODSTABOPTIONS.map((item, index) => {
                if (item !== "Proposals" || (isCreatorOrCollab && isFunded)) {
                  if (item !== "Reward" || isFunded) {
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
              {podMenuSelection === PODSTABOPTIONS[1] && (
                <Staking pod={pod} handleRefresh={loadData} podInfo={podInfo} />
              )}
              {podMenuSelection === PODSTABOPTIONS[2] && podInfo && (
                <Investments pod={pod} podInfo={podInfo} handleRefresh={loadData} />
              )}
              {podMenuSelection === PODSTABOPTIONS[3] && (
                <Discussion
                  podId={podId}
                  pod={pod}
                  refreshPod={() => loadData()}
                  isCreatorOrCollab={isCreatorOrCollab}
                />
              )}
              {podMenuSelection === PODSTABOPTIONS[4] && (
                /*isCreatorOrCollab && isFunded &&*/ <Chat
                  podId={podId}
                  pod={pod}
                  podInfo={podInfo}
                  refreshPod={() => loadData()}
                  openProposal={() => setPodMenuSelection("Proposals")}
                />
              )}
              {podMenuSelection === "Proposals" && isCreatorOrCollab && isFunded && (
                <Proposals pod={pod} podId={podId} podInfo={podInfo} handleRefresh={loadData} />
              )}
            </Box>
          )}
          {!pod.distributionProposalAccepted && (
            <Box>
              {/* Proposals title bar */}
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box className={classes.header4}>Proposals</Box>
                {pod.Proposals && pod.Proposals.length !== 0 ? (
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
                ) : null}
              </Box>
              {/* Proposals cards */}
              <Box width={1} overflow="hidden">
                {!pod.Proposals || pod.Proposals.length === 0 ? (
                  <p
                    style={{
                      width: "100%",
                      marginTop: "30px",
                      textAlign: "center",
                      color: "grey",
                    }}
                  >
                    No proposals yet
                  </p>
                ) : (
                  <SimpleCarousel
                    containerProps={{
                      style: {
                        width: "100%",
                        justifyContent: "flex-start"
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
                        <Box width={"600px"} pr={2} key={i} className={classes.ProposalPodCardContainer}>
                          <ProposalPodCard
                            podId={podId}
                            pod={pod}
                            proposal={proposal}
                            handleRefresh={handleRefresh}
                            handleNewProposalModal={() => setOpenDistributionTopic(true)}
                          />
                        </Box>
                      );
                    })}
                  </SimpleCarousel>
                )}
              </Box>
              {/* Discussion title bar */}
              <Box className={classes.flexBox} justifyContent="space-between" my={3}>
                <div className={classes.header4}>Discussion</div>
                <SecondaryButton
                  size="medium"
                  onClick={() => setOpenDistributionTopic(true)}
                  isRounded
                  disabled = {isExpired}
                  style={{
                    border: "none",
                    background: "#DDFF57",
                    borderRadius: "8px",
                    padding: "0 66px",
                    color: Color.Purple,
                    fontSize: "18px",
                    lineHeight: "104.5%"
                  }}
                >
                  New Pod Proposal
                </SecondaryButton>
              </Box>
              {/* Discussion card */}
              <Box className={classes.discussionContent}>
                <LoadingWrapper loading={isDataLoading}>
                  <Discord
                    podId={podId}
                    chatType={"PrivateChat"}
                    chatId={generalChat}
                    sidebar={false}
                    theme="dark"
                  />
                </LoadingWrapper>
              </Box>
            </Box>
          )}
        </div>
      </Box>
      {openDistributionTopic && (
        <NewDistributionModal
          pod={pod}
          podId={podId}
          open={openDistributionTopic}
          handleRefresh={handleRefresh}
          onClose={() => setOpenDistributionTopic(false)}
          createNewTopic={createNewTopic}
        />
      )}
    </Box>
  ) : (
    <LoadingWrapper loading />
  );
};

export default PodPageIndividual;

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

const MessageIcon = () => (
  <svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.4827 1H0.896484V13H3.8189V18L8.68959 13H16.4827V1Z" stroke="#431AB7" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
)
