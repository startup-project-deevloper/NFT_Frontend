import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";

import { Grid } from "@material-ui/core";

import useWindowDimensions from "shared/hooks/useWindowDimensions";
import { RootState } from "store/reducers/Reducer";
import { SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import CreateNewTopicModal from "./modals/CreateNewTopicModal";
import CreateNewVoteModal from "./modals/CreateNewVoteModal";
import CreateNewWallPostModal from "./modals/CreateNewWallPostModal";
import DiscussionPage from "./components/DiscussionPage";
import WallItem from "./components/WallItem";
import PollItem from "./components/PollItem";
import { discussionStyles } from "./index.styles";

export default function Discussion({ pod, handleRefresh }) {
  const classes = discussionStyles();
  const userSelector = useSelector((state: RootState) => state.user);

  const pageDiscussionRef = useRef();
  const width = useWindowDimensions().width;

  const [displayPollsSelection, setDisplayPollsSelection] = useState<number>(0);
  const [seeAll, setSeeAll] = useState<boolean>(false);
  const [openNewTopic, setOpenNewTopic] = useState<boolean>(false);
  const [openModalNewPodPost, setOpenModalNewPodPost] = useState<boolean>(false);
  const [createPollModal, setCreatePollModal] = useState<boolean>(false);

  if (pod)
    return (
      <Box>
        <Box mb={5}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.flexBox} style={{ color: "#431AB7" }}>
              <Box className={classes.header3} mr={3}>
                Wall
              </Box>
              <Box className={classes.header4} onClick={() => setSeeAll(!seeAll)}>
                {seeAll ? "View Less" : "View All"}
              </Box>
            </Box>

            {Object.keys(pod.Collabs).includes(userSelector.address) && (
              <SecondaryButton
                size="medium"
                onClick={() => setOpenModalNewPodPost(true)}
                style={{
                  background: "#DDFF57",
                  border: "none",
                  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
                  color: "#431AB7",
                }}
              >
                Create New
              </SecondaryButton>
            )}
          </Box>
          <Grid container className={classes.wallContentBox} spacing={2}>
            {pod.PostsArray && pod.PostsArray.length > 0 ? (
              pod.PostsArray.map((item, index) => {
                if (
                  (!seeAll &&
                    ((width >= 900 && index < 4) ||
                      (width < 900 && width >= 600 && index < 3) ||
                      (width <= 600 && index < 2))) ||
                  seeAll
                )
                  return (
                    <Grid item xs={12} md={3}>
                      <WallItem
                        item={item}
                        Creator={item.createdBy}
                        key={`wall-item-${index}`}
                        type={"MediaPodPost"}
                        itemTypeId={pod.id || pod.PodAddress}
                        admin={pod.Creator === userSelector.id}
                        handleRefresh={() => handleRefresh()}
                        index={index}
                      />
                    </Grid>
                  );
              })
            ) : (
              <Box
                className={"no-content-container"}
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
                width="100%"
              >
                <Box mt={2}>No posts yet</Box>
              </Box>
            )}
          </Grid>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={7} md={8}>
            <Box>
              <Box className={classes.flexBox} justifyContent="space-between">
                <Box className={classes.header3} mr={2} style={{ color: "#431AB7" }}>
                  Threads
                </Box>
                {Object.keys(pod.Collabs).includes(userSelector.address) && (
                  <SecondaryButton
                    size="medium"
                    onClick={() => setOpenNewTopic(true)}
                    style={{
                      background: "#DDFF57",
                      border: "none",
                      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
                      color: "#431AB7",
                    }}
                  >
                    Start Discussion
                  </SecondaryButton>
                )}
              </Box>
              <Box className={classes.contentBox}>
                {pod.TopicsArray && pod.TopicsArray.length > 0 ? (
                  <DiscussionPage
                    discussions={pod.TopicsArray}
                    postType="mediaPod"
                    podId={pod.PodAddress}
                    key={pod.PodAddress}
                    pageDiscussionRef={pageDiscussionRef}
                  />
                ) : (
                  <Box className={classes.flexBox} justifyContent="center" height={1}>
                    <Box mt={2}>No discussions yet</Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={5} md={4}>
            <Box className={classes.flexBox} justifyContent="space-between">
              <Box className={classes.header3} mr={2} style={{ color: "#431AB7" }}>
                Polls
              </Box>
              {Object.keys(pod.Collabs).includes(userSelector.address) && (
                <SecondaryButton
                  size="medium"
                  onClick={() => setCreatePollModal(true)}
                  style={{
                    background: "#DDFF57",
                    border: "none",
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
                    color: "#431AB7",
                  }}
                >
                  Create New
                </SecondaryButton>
              )}
            </Box>
            <Box className={classes.contentBox}>
              {pod.Votings && pod.Votings.length > 0 ? (
                <div>
                  <Box display="flex" alignItems="center" flexWrap="wrap">
                    {["All", "Ended", "Ongoing"].map((option, index) => (
                      <SecondaryButton
                        size="medium"
                        onClick={() => setDisplayPollsSelection(index)}
                        style={{
                          background: index === displayPollsSelection ? "black" : "#DDFF57",
                          border: "none",
                          color: index === displayPollsSelection ? "#ffffff" : "#000000",
                          padding: "0px 17px",
                          minWidth: "unset",
                        }}
                        isRounded
                      >
                        {option}
                      </SecondaryButton>
                    ))}
                  </Box>
                  <Box mt={2}>
                    {pod.Votings.filter(poll =>
                      displayPollsSelection === 0
                        ? poll !== undefined
                        : displayPollsSelection === 2
                        ? new Date().getTime() < new Date(poll.endDate).getTime()
                        : new Date().getTime() >= new Date(poll.endDate).getTime()
                    ).map((item, index) => {
                      return <PollItem item={item} />;
                    })}
                  </Box>
                </div>
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
            pod={pod}
            createdBy={userSelector.id}
            open={openNewTopic}
            handleClose={() => setOpenNewTopic(false)}
            postCreated={() => handleRefresh()}
          />
        )}
        {createPollModal && (
          <CreateNewVoteModal
            pod={pod}
            open={createPollModal}
            handleClose={() => setCreatePollModal(false)}
            postCreated={() => handleRefresh()}
          />
        )}
        {openModalNewPodPost && (
          <CreateNewWallPostModal
            pod={pod}
            open={openModalNewPodPost}
            handleClose={() => setOpenModalNewPodPost(false)}
            postCreated={() => handleRefresh()}
          />
        )}
      </Box>
    );
  else return <p>Error displaying pod data</p>;
}
