import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { Grid } from "@material-ui/core";

import { RootState } from "store/reducers/Reducer";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import { default as ServerURL } from "shared/functions/getURL";
import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import CreateNewVoteModal from "components/PriviDigitalArt/modals/CreateNewVoteModal";
import CreateNewTopicModal from "components/PriviDigitalArt/modals/CreateNewTopicModal";
import CreateNewWallPostModal from "components/PriviDigitalArt/modals/CreateNewWallPostModal";
import WallItem from "./components/WallItem";
import PollItem from "./components/PollItem";
import ListChats from "../Chat/ListChats";
import Discord from "../../Discord";
import { socket } from "../../../../../Login/Auth";
import { usePodPageIndividualStyles } from "../../index.styles";

const COLUMNS_COUNT_BREAK_POINTS = {
  767: 2,
  900: 3,
  1200: 4,
  1510: 5,
};

export default function Discussion(props) {
  const classes = usePodPageIndividualStyles();

  const users = useTypedSelector(state => state.usersInfoList);
  const userSelector = useSelector((state: RootState) => state.user);

  const [pod, setPod] = useState<any>({});

  const width = useWindowDimensions().width;

  const [displayPollsSelection, setDisplayPollsSelection] = useState<number>(0);

  const [seeAll, setSeeAll] = useState<boolean>(false);

  //modal controller
  const [openNewTopic, setOpenNewTopic] = useState<boolean>(false);
  const [discussions, setDiscussions] = useState<any>();
  const [posts, setPosts] = useState<any>();
  const [polls, setPolls] = useState<any[]>([]);

  const [isPostLoading, setIsPostLoading] = useState<boolean>(false);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [openModalNewPodPost, setOpenModalNewPodPost] = useState<boolean>(false);

  const [createPollModal, setCreatePollModal] = useState<boolean>(false);
  const [showAllPost, setShowAllPost] = useState<boolean>(false);

  const [selectedChat, setSelectedChat] = useState<any>({});
  const [selectedChatId, setSelectedChatId] = useState<string>("");

  useEffect(() => {
    console.log("Pod", props.pod, props.pod.CreatorId, userSelector.id);
    if (props.podId) {
      // setIsDataLoading(true);
      if (props.pod && props.pod.Discussions) {
        setPod(props.pod);
        setDiscussions(props.pod.Discussions);
      }

      setPolls(props.pod.Polls || []);

      getWallPosts();
    }
  }, [props.podId, users]);

  const getWallPosts = () => {
    setIsPostLoading(true);
    axios
      .get(`${URL()}/pod/discussion/wall/getPodPosts/${props.podId}/TRAX`)
      .then(res => {
        setPosts(res.data.data);
        setIsPostLoading(false);
      })
      .catch(error => {
        setIsPostLoading(false);
      });
  };

  const onTopicSelected = val => {
    socket?.emit("subscribe-podDiscussion", {
      podId: props.podId,
      topicId: val.id,
      userId: userSelector.id,
      podType: "PIX",
    });
    setSelectedChatId(val.id);
    setSelectedChat(val);
  };

  const createNewTopic = (title, description) => {
    axios
      .post(`${ServerURL()}/podDiscussion/new/newChat`, {
        title,
        description,
        podId: props.podId,
        createdBy: userSelector.id,
        podType: "PIX",
      })
      .then(response => {
        const resp = response.data.data;
        if (response.data.success) {
          const newDiscussionData = [{ id: resp.topicId, ...resp.topicData }, ...discussions];
          setDiscussions(newDiscussionData);
        }
      });
  };

  if (props.pod && (props.pod.Id || props.pod.PodAddress))
    return (
      <div>
        <Box className={classes.flexBox} justifyContent="space-between">
          <Box className={classes.title2}>Wall</Box>
          <Box className={classes.flexBox}>
            {props.isCreatorOrCollab ? (
              <PrimaryButton
                size="medium"
                className={`${classes.commonBtn} ${classes.createWallBtn}`}
                onClick={() => setOpenModalNewPodPost(true)}
              >
                Create New
              </PrimaryButton>
            ) : null}
            {posts && posts.length > 0 && (
              <>
                {showAllPost ? (
                  <SecondaryButton
                    size="medium"
                    onClick={() => setShowAllPost(false)}
                    className={`${classes.commonBtn} ${classes.showAllBtn}`}
                  >
                    Hide
                    <Box position="absolute" flexDirection="row" top={0} right={0} pr={2}>
                      <ArrowLeftIcon />
                    </Box>
                  </SecondaryButton>
                ) : (
                  <SecondaryButton
                    size="medium"
                    onClick={() => setShowAllPost(true)}
                    className={`${classes.commonBtn} ${classes.showAllBtn}`}
                  >
                    Show All
                    <Box position="absolute" flexDirection="row" top={0} right={0} pr={2}>
                      <ArrowLeftIcon />
                    </Box>
                  </SecondaryButton>
                )}
              </>
            )}
          </Box>
        </Box>
        <Box mt={3} mb={8} width={1}>
          <LoadingWrapper loading={isPostLoading}>
            {posts && posts.length > 0 ? (
              <MasonryGrid
                data={
                  showAllPost
                    ? posts
                    : posts.filter(
                        (_, index) =>
                          seeAll ||
                          (!seeAll &&
                            ((width >= 1440 && index < 5) ||
                              (width < 1440 && width >= 1200 && index < 4) ||
                              (width < 1200 && width >= 900 && index < 3) ||
                              (width < 900 && width >= 600 && index < 2) ||
                              (width <= 600 && index < 1)))
                      )
                }
                renderItem={(item, index) => (
                  <Box mx={1} width={1}>
                    <WallItem
                      item={item}
                      Creator={(item as any).author}
                      key={`wall-item-${index}`}
                      type={"MediaPodPost"}
                      itemTypeId={props.pod.Id || props.pod.PodAddress}
                      admin={props.pod.Creator === userSelector.id}
                      handleRefresh={() => props.refreshPod()}
                      index={index}
                    />
                  </Box>
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
                gutter={"36px"}
              />
            ) : (
              <Box className={"no-content-container"} style={{ textAlign: "center" }}>
                <Box mt={2}>No posts yet</Box>
              </Box>
            )}
          </LoadingWrapper>
        </Box>
        <Box mb={"28px"} width={1} height="1px" bgcolor="#00000022" />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={8}>
            <Box mb={3} className={classes.flexBox} style={{ height: "40px" }} justifyContent="space-between">
              <Box className={classes.title2}>Threads</Box>
              {props.isCreatorOrCollab ? (
                <PrimaryButton
                  size="medium"
                  className={`${classes.commonBtn} ${classes.discussionBtn}`}
                  onClick={() => setOpenNewTopic(true)}
                >
                  Start Discussion
                </PrimaryButton>
              ) : null}
            </Box>
            <Box className={classes.contentBox} style={{ paddingRight: 0 }}>
              <LoadingWrapper loading={isDataLoading}>
                {discussions && discussions.length > 0 ? (
                  <Grid container style={{ height: "100%" }}>
                    <Grid item sm={12} md={4} style={{ height: "100%" }}>
                      <ListChats
                        discussions={discussions}
                        selectedChat={selectedChatId}
                        onTopicSelected={val => onTopicSelected(val)}
                      />
                    </Grid>
                    <Grid item sm={12} md={8} style={{ height: "100%" }}>
                      <Discord
                        podId={props.podId}
                        chatType={"PodDiscussions"}
                        chatId={selectedChatId}
                        sidebar={false}
                        theme="dark"
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <div
                    className={classes.flexBox}
                    style={{
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    Create a Chat Room
                  </div>
                )}
              </LoadingWrapper>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Box mb={3} className={classes.flexBox} style={{ height: "40px" }} justifyContent="space-between">
              <Box className={classes.title2}>Polls</Box>
              {props.isCreatorOrCollab ? (
                <PrimaryButton
                  size="medium"
                  onClick={() => setCreatePollModal(true)}
                  className={`${classes.commonBtn} ${classes.createPollBtn}`}
                >
                  Create New
                </PrimaryButton>
              ) : null}
            </Box>
            <Box className={classes.contentBox}>
              {polls && polls.length > 0 ? (
                <>
                  <Box display="flex" mb={2.5}>
                    {["All", "Ended", "Ongoing"].map((option, index) => (
                      <PrimaryButton
                        size="medium"
                        className={`${classes.pollBtn} ${
                          index === displayPollsSelection && classes.selectedPollBtn
                        }`}
                        onClick={() => setDisplayPollsSelection(index)}
                      >
                        {option}
                      </PrimaryButton>
                    ))}
                  </Box>
                  <Box className={classes.pollBox}>
                    {polls
                      .filter(poll =>
                        displayPollsSelection === 1
                          ? new Date().getTime() < new Date(poll.endDate).getTime()
                          : displayPollsSelection === 2
                          ? new Date().getTime() >= new Date(poll.endDate).getTime()
                          : poll !== undefined
                      )
                      .map((item, index) => {
                        return <PollItem key={`poll-detail-${index}`} item={item} pod={props.pod} />;
                      })}
                  </Box>
                </>
              ) : (
                <Box className={classes.flexBox} justifyContent="center" height={1}>
                  <Box mt={2}>No polls yet</Box>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
        {openNewTopic && (
          <CreateNewTopicModal
            open={openNewTopic}
            onClose={() => setOpenNewTopic(false)}
            createNewTopic={createNewTopic}
          />
        )}
        {createPollModal && (
          <CreateNewVoteModal
            handleClose={() => setCreatePollModal(false)}
            handleRefresh={() => props.refreshPod()}
            open={createPollModal}
            pod={props.pod}
            isVotation
          />
        )}
        {openModalNewPodPost && (
          <CreateNewWallPostModal
            handleClose={() => setOpenModalNewPodPost(false)}
            open={openModalNewPodPost}
            pod={props.pod}
            postCreated={getWallPosts}
          />
        )}
      </div>
    );
  else return <p>Error displaying pod data</p>;
}

const ArrowLeftIcon = () => (
  <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
    <path
      d="M8.40262 10.9386C8.59347 10.9386 8.76423 10.8658 8.9149 10.7201L13.6384 6.00419C13.7941 5.85854 13.8719 5.68025 13.8719 5.46931C13.8719 5.26339 13.7941 5.0851 13.6384 4.93443L8.9375 0.241071C8.85212 0.155692 8.76549 0.0941685 8.6776 0.0565011C8.5897 0.0188337 8.49805 0 8.40262 0C8.20173 0 8.03348 0.0652902 7.89788 0.195871C7.76228 0.326451 7.69448 0.492188 7.69448 0.69308C7.69448 0.793527 7.71205 0.887695 7.74721 0.975586C7.78237 1.06348 7.83259 1.14007 7.89788 1.20536L9.50251 2.83259L11.7139 4.8545L10.0374 4.75363L1.22321 4.75363C1.01228 4.75363 0.839007 4.82017 0.703404 4.95326C0.567801 5.08636 0.5 5.25837 0.5 5.46931C0.5 5.68527 0.567801 5.85979 0.703404 5.99289C0.839007 6.12598 1.01228 6.19252 1.22321 6.19252L10.0374 6.19252L11.7203 6.09264L9.50251 8.11356L7.89788 9.74079C7.83259 9.80608 7.78237 9.88267 7.74721 9.97056C7.71205 10.0585 7.69448 10.1526 7.69448 10.2531C7.69448 10.4489 7.76228 10.6122 7.89788 10.7427C8.03348 10.8733 8.20173 10.9386 8.40262 10.9386Z"
      fill="#2D3047"
    />
  </svg>
);
