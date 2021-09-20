import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";

import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { RootState } from "store/reducers/Reducer";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { CircularLoadingIndicator, PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import CustomSwitch from "shared/ui-kit/CustomSwitch";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import WallFeedCard from "components/PriviDigitalArt/components/Cards/WallFeedCard";
import CreatePostContainer from "./CreatePostContainer";
import CreateWallPostModal from "./CreateWallPostModal";
import { wallStyles } from "./index.styles";

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 50px;
`;

const COLUMNS_COUNT_BREAK_POINTS = {
  675: 1,
  900: 2,
  1400: 3,
};

const GUTTER = "40px";

const arePropsEqual = (prevProps, currProps) => {
  return prevProps.userId === currProps.userId && prevProps.userProfile === currProps.userProfile;
};

const MyWall = React.memo(({ userId, userProfile }: { userId: string; userProfile: any }) => {
  const classes = wallStyles();
  const user = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [posts, setPosts] = useState<any[]>([]);
  const [status, setStatus] = useState<any>("");
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const [superFollowersAllowed, setSuperFollowersAllowed] = useState<boolean>(false);

  // pagination
  const [lastId, setLastId] = useState<any>(null);
  const [hasMore, setHasMore] = useState<any>(true);
  const [openCreateWallPostModal, setOpenCreateWallPostModal] = useState<boolean>(false);

  const handleOpenCreateWallPostModal = () => {
    setOpenCreateWallPostModal(true);
  };
  const handleCloseCreateWallPostModal = () => {
    setOpenCreateWallPostModal(false);
  };

  useEffect(() => {
    if (userId) {
      getPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, userId]);

  useEffect(() => {
    //TODO: update on backend and set who can post on user's wall
  }, [superFollowersAllowed]);

  const getPosts = () => {
    if (isDataLoading) return;
    setIsDataLoading(true);
    const config = {
      params: {
        userId: userId,
        lastId: lastId,
      },
    };
    axios
      .get(`${URL()}/user/wall/getUserPosts`, config)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          let data = [...resp.data];

          data.forEach(async (post, index) => {
            if (post?.hasPhoto) {
              let mediaUrl = post.url;

              try {
                run(mediaUrl).then(dim => {
                  data[index].dimensions = dim;
                });
              } catch (e) {
                console.log(e);
              }
            }

            if (userId === post?.createdBy) {
              data[index].userImageURL = userProfile.anon
                ? require(`assets/anonAvatars/${userProfile.anonAvatar}`)
                : userProfile.hasPhoto
                ? userProfile.url
                : require(`assets/anonAvatars/${userProfile.anonAvatar}`);
              data[index].userName = userProfile.firstName ?? userProfile.name ?? "User name";
              data[index].urlSlug =
                userProfile.urlSlug ?? userProfile.firstName ?? userProfile.name ?? "User name";
              data[index].level = userProfile.level ?? 1;
              data[index].verified = userProfile.verified ?? false;
            } else {
              const thisUser = users.find(user => user.id === post?.createdBy);
              if (thisUser) {
                data[index].userImageURL = thisUser.url ?? thisUser.imageURL;
                data[index].userName = thisUser.name;
                data[index].urlSlug = thisUser.urlSlug ?? thisUser.name ?? "User name";
                data[index].level = thisUser.level ?? 1;
                data[index].verified = thisUser.verified ?? false;
              } else {
                data[index].userImageURL = getRandomAvatarForUserIdWithMemoization(post?.createdBy);
                data[index].userName = "User name";
                data[index].urlSlug = "Username";
                data[index].level = 1;
                data[index].verified = false;
              }
            }
          });

          data.sort((a, b) => b.schedulePost - a.schedulePost);
          data.sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : b.pinned));

          let newPosts = data.filter(wall => wall.selectedFormat === 1 || wall.selectedFormat === 2);

          let oldPosts;
          if (lastId === null) {
            oldPosts = [];
          } else {
            oldPosts = [...posts];
          }

          setHasMore(resp.hasMore);
          setLastId(resp.lastId);
          setPosts([...oldPosts, ...newPosts]);
        } else {
          setStatus({
            msg: resp.error,
            key: Math.random(),
            variant: "error",
          });
        }
        setIsDataLoading(false);
      })
      .catch(err => {
        setStatus({
          msg: "Error making get posts request",
          key: Math.random(),
          variant: "success",
        });
        setIsDataLoading(false);
      });

    async function run(url) {
      let img: any = await getMeta(url);

      let w = img.width;
      let h = img.height;

      return { height: h, width: w };
    }
  };

  function getMeta(url) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject();
      img.src = url;
    });
  }

  if (userId)
    return (
      <>
        {user.id === userId && (
          <div className={classes.wallPostOption}>
            {/* <Box display="flex" flexDirection="row" mb={2} mr={1}>
              <Box fontSize="14px" mr={1} alignItems="center" display="flex">
                <img
                  src={require("assets/icons/star_blue.svg")}
                  alt="star"
                  width="24px"
                  style={{ marginRight: "8px" }}
                />
                {superFollowersAllowed
                  ? "Only your superfollowers can post to your Wall"
                  : "Everyone can post to your wall"}
              </Box>
              <CustomSwitch
                checked={superFollowersAllowed}
                onChange={() => setSuperFollowersAllowed(!superFollowersAllowed)}
                theme="privi-pix"
              />
            </Box> */}
            <PrimaryButton
              size="small"
              onClick={handleOpenCreateWallPostModal}
              style={{ marginLeft: "16px", fontSize: 16, background: "#DDFF57", border: "none", color: "#431AB7", height: 40 }}
            >
              Create New
            </PrimaryButton>
          </div>
        )}

        {/* <Box mb={user.id === userId ? 0 : 3}>
          {user.id === userId && (
            <CreatePostContainer handleOpenCreatePostModal={handleOpenCreateWallPostModal} />
          )}
        </Box> */}

        <InfiniteScroll
          hasChildren={posts.length > 0}
          dataLength={posts.length}
          scrollableTarget="profile-infite-scroll"
          next={getPosts}
          hasMore={hasMore}
          loader={
            <LoadingIndicatorWrapper>
              <CircularLoadingIndicator theme={"blue"} />
            </LoadingIndicatorWrapper>
          }
        >
          <>
            <MasonryGrid
              data={posts}
              renderItem={(item, index) => (
                <WallFeedCard userProfile={userProfile} item={item} key={`feed-item-${index}`} />
              )}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
              gutter={GUTTER}
            />
          </>
        </InfiniteScroll>
        {posts && posts.length === 0 && !isDataLoading && <Box mt={3}>No Posts available</Box>}
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
        <CreateWallPostModal
          open={openCreateWallPostModal}
          handleClose={handleCloseCreateWallPostModal}
          userId={userId}
          type={"UserPost"}
          handleRefresh={getPosts}
        />
      </>
    );
  else return null;
}, arePropsEqual);

export default MyWall;
