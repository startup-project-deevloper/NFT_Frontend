import React, { useEffect, useState } from "react";
import axios from "axios";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { useParams } from "react-router-dom";
import SimpleCarousel from "react-simply-carousel";

import Investments from "./subPages/Investments";
import Discussion from "./subPages/Discussion";
import Chat from "./subPages/Chat";
import { Media } from "./subPages/Media";
import Discord from "./Discord";
import { ProposalPodCard } from "components/PriviDigitalArt/components/Cards/ProposalPodCard";
import NewDistributionModal from "components/PriviDigitalArt/modals/NewDistributionModal";
import PodHeader from "./Header";
import PodArtists from "./Artists";
import { useTypedSelector } from "store/reducers/Reducer";

import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs/LoadingWrapper";
import { getPod, priviPodAcceptInvitation } from "shared/services/API/PriviPodAPI";
import { Color, Gradient, SecondaryButton } from "shared/ui-kit";
import { default as ServerURL } from "shared/functions/getURL";
import { BlockchainNets } from "shared/constants/constants";
import { onGetNonDecrypt } from "shared/ipfs/get";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import useIPFS from "shared/utils-IPFS/useIPFS";

import { usePodPageIndividualStyles } from "./index.styles";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { useAuth } from "shared/contexts/AuthContext";
import { getPodStatus } from "shared/functions/utilsPriviPod";
import { switchNetwork } from "shared/functions/metamask";
import Governance from "./subPages/Governance";
import Copyright from "./subPages/Copyright";

const PODSTABOPTIONS = ["Media", "Governance", "Investments", "Discussion", "Chat", "Proposals"];

const PodPageIndividual = () => {
  const classes = usePodPageIndividualStyles();
  const { showAlertMessage } = useAlertMessage();

  const params: any = useParams();
  const user = useTypedSelector(state => state.user);
  const { isSignedin } = useAuth();

  const [podMenuSelection, setPodMenuSelection] = useState<string>(PODSTABOPTIONS[0]);
  const [pod, setPod] = useState<any>();
  const [podInfo, setPodInfo] = useState<any>(null);
  const [followed, setFollowed] = useState<boolean>(false);
  const [isCreatorOrCollab, setIsCreatorOrCollab] = useState<boolean>(false);

  const [generalChat, setGeneralChat] = useState<string>("");

  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [discussions, setDiscussions] = useState<any>();
  const [openDistributionTopic, setOpenDistributionTopic] = useState<boolean>(false);

  const [fundingEnded, setFundingEnded] = useState<boolean>(false);
  const [fundingEndTime, setFundingEndTime] = useState<any>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const { library, chainId, account } = useWeb3React();

  const podId = params?.podId;

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  const [imageIPFS, setImageIPFS] = useState({});

  const isFunded = React.useMemo(
    () =>
      pod &&
      pod.FundingDate &&
      pod.FundingDate < Math.trunc(Date.now() / 1000) &&
      (pod.RaisedFunds || 0) >= pod.FundingTarget,
    [pod]
  );

  const isAllVoted = React.useMemo(() => {
    if (!pod) return false;

    return pod.CreatorsData.find(item => item.vote !== true && item.vote !== false) ? true : false;
  }, [pod]);

  const [isExpired, setExpired] = useState<boolean>(true);

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    if (podId && ipfs && Object.keys(ipfs).length !== 0) {
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
        const status = getPodStatus(pod);
        if (pod.status !== status) {
          setPod(prev => ({ ...prev, status: getPodStatus(pod) }));
        }
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [pod?.FundingDate]);

  useEffect(() => {
    if (!pod || !pod.PodAddress) return;

    (async () => {
      if (ipfs && Object.keys(ipfs).length !== 0) {
        const targetChain = BlockchainNets[1];
        if (chainId && chainId !== targetChain?.chainId) {
          const isHere = await switchNetwork(targetChain?.chainId || 0);
          if (!isHere) {
            showAlertMessage("Got failed while switching over to target netowrk", { variant: "error" });
            return;
          }
        }

        const web3APIHandler = targetChain.apiHandler;
        if (library) {
          const web3 = new Web3(library.provider);

          const info = await web3APIHandler?.PodManager.getPodInfo(web3, {
            podAddress: pod.PodAddress,
            fundingToken: pod.FundingToken,
          });
          setPodInfo(info);

          if (info) {
            const stakingGovernance = await web3APIHandler?.DistributionManager.stakingGovernance(web3, {
              contractAddress: info.distributionManagerAddress,
            });
            const stakingERC721 = await web3APIHandler?.DistributionManager.stakingERC721(web3, {
              contractAddress: info.distributionManagerAddress,
            });
            setPodInfo({ ...info, stakingERC721, stakingGovernance });
          }
        }
      }
    })();

    const status = getPodStatus(pod);
    if (pod.status !== status) {
      setPod(prev => ({ ...prev, status: getPodStatus(pod) }));
    }
  }, [pod, pod?.PodAddress]);

  const getImageIPFS = async (cid: string, fileName: string) => {
    let files = await onGetNonDecrypt(cid, fileName, (fileCID, download) =>
      downloadWithNonDecryption(fileCID, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.buffer);
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
        const resp = await getPod(podId, "PIX");
        if (resp?.success) {
          let podData = resp.data;

          // If the invited user didn't accept the proposal and directly go into the pod, then accept it automatically.
          const isInvitedUser = podData.CreatorsData.find(item => item.id === user.id);
          const isAccepted = podData.Collabs.find(item => item.userId === user.id);
          if (isInvitedUser && !isAccepted) {
            const acceptResponse = await priviPodAcceptInvitation({
              podId: podData.Id,
              userId: user.id,
              type: "PIX",
            });
            if (acceptResponse.success) {
              loadData();
              return;
            }
          }

          const cur = new Date().getTime() - podData.Created;
          const deadline = podData.ProposalDeadline._seconds * 1000 - podData.Created;
          if (cur > deadline) {
            setExpired(true);
          } else {
            setExpired(false);
          }

          podData.status = getPodStatus(podData);

          if (!podData.distributionProposalAccepted) {
            let privateChats: any[] = podData.PrivateChats;

            let generalChat: any = privateChats.find(chat => chat.title === "General");
            if (generalChat && generalChat.id) {
              setGeneralChat(generalChat.id);
            }
          }

          let isCollab = podData.Collabs.filter(collab => collab.address === user.address).length > 0;
          if (podData.CreatorId === user.id || isCollab) {
            setIsCreatorOrCollab(true);
          }

          setPod(podData);
          if (podData?.InfoImage?.newFileCID && podData?.InfoImage?.metadata?.properties?.name) {
            getImageIPFS(podData.InfoImage.newFileCID, podData.InfoImage.metadata.properties.name);
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
            <Box className={`${classes.flexBox} ${classes.xscroll}`}>
              {PODSTABOPTIONS.map((item, index) => {
                if (item !== "Chat" || isCreatorOrCollab) {
                  if (item !== "Governance" || (isCreatorOrCollab && isFunded)) {
                    if (item !== "Copyright" || isFunded) {
                      if (
                        !(
                          item === "Governance" ||
                          item === "Discussion" ||
                          item === "Chat" ||
                          item === "Copyright"
                        ) ||
                        isSignedin
                      ) {
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
                <Media medias={pod.Medias} pod={pod} podInfo={podInfo} handleRefresh={loadData} />
              )}
              {podMenuSelection === PODSTABOPTIONS[1] && (
                <Governance pod={pod} handleRefresh={loadData} podInfo={podInfo} />
              )}
              {/* {podMenuSelection === PODSTABOPTIONS[1] && (
                <Staking pod={pod} handleRefresh={loadData} podInfo={podInfo} />
              )} */}
              {podMenuSelection === PODSTABOPTIONS[2] && podInfo && (
                <Investments pod={pod} podInfo={podInfo} handleRefresh={loadData} />
              )}
              {podMenuSelection === PODSTABOPTIONS[3] && (
                <Discussion
                  podId={podId}
                  pod={pod}
                  refreshPod={loadData}
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
              {podMenuSelection === PODSTABOPTIONS[5] && (
                <Copyright podId={podId} pod={pod} podInfo={podInfo} refreshPod={() => loadData()} />
              )}
            </Box>
          )}
          {!pod.distributionProposalAccepted && (
            <Box>
              {/* Proposals title bar */}
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box className={classes.header4}>All Proposals</Box>
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
                    {pod.Proposals.map((proposal, index) => {
                      return (
                        <Box pr={2} key={`proposals-${index}`}>
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
                  disabled={isExpired || isAllVoted}
                  style={{ border: "none", background: Gradient.Green1, color: "white" }}
                >
                  New Pod Proposal
                </SecondaryButton>
              </Box>
              {/* Discussion card */}
              <Box className={classes.discussionContent}>
                <Discord
                  podId={podId}
                  chatType={"PrivateChat"}
                  chatId={generalChat}
                  sidebar={false}
                  theme="dark"
                  imageIPFS={imageIPFS}
                />
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
    <Box height={1} display="flex" alignItems="center">
      <LoadingWrapper loading />
    </Box>
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

export default PodPageIndividual;
