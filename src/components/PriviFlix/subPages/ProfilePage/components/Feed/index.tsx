import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { Slider, withStyles } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import FriendLabel from "./components/FriendLabel";
import { feedStyles } from "./index.styles";
import * as UserConnectionsAPI from "shared/services/API/UserConnectionsAPI";
import { UserInfo } from "store/actions/UsersInfo";
import { removeUndef } from "shared/helpers";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import WallFeedCard from "components/PriviMusicDao/components/Cards/WallFeedCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import ShareVoiceMessage from "shared/ui-kit/Chat/ShareVoiceMessage";
import { SharedVoiceItem } from "./components/SharedVoiceItem";

const COLUMNS_COUNT_BREAK_POINTS = {
  675: 1,
  900: 2,
};

const GUTTER = "40px";

type UserInfoWithCloseDegree = UserInfo & { closenessDegree: number };

const Feed = ({ userId, userProfile, scrollRef, ownUser = true }) => {
  const classes = feedStyles();
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [closenessDegree, setClosenessDegree] = useState<number[]>([1.6, 2.6]);

  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredFriends, setFilteredFriends] = useState<UserInfoWithCloseDegree[]>([]);
  const [friends, setFriends] = useState<UserInfoWithCloseDegree[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [sharedVoices, setSharedVoices] = useState<any[]>([]);
  const [isSharedVoicesLoading, setIsSharedVoicesLoading] = useState(false);

  const [status, setStatus] = useState<any>("");

  // pagination
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (userId && users && users.length > 0) {
      getFriends(userId, users);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, userId]);

  useEffect(() => {
    if (userId) {
      getPosts();
      getSharedVoices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    let fends = [] as any;
    friends.forEach(f => {
      if (
        !searchValue ||
        (searchValue && f.name && f.name.toUpperCase().includes(searchValue.toUpperCase())) ||
        (f.urlSlug && f.urlSlug.toUpperCase().includes(searchValue.toUpperCase()))
        // &&
        // f.closenessDegree >= closenessDegree[0] &&
        // f.closenessDegree <= closenessDegree[1]
      ) {
        fends.push(f);
      }
    });

    setFilteredFriends(fends);
  }, [friends, searchValue, closenessDegree]);

  const getPosts = (filterChanged = false) => {
    if (isDataLoading) return;
    setIsDataLoading(true);
    const config = {
      params: {
        userId: userId,
        offset: filterChanged ? 0 : posts.length,
        limit: 20,
        closenessDegree: JSON.stringify(closenessDegree),
      },
    };
    axios
      .get(`${URL()}/user/feed/getPosts`, config)
      .then(res => {
        const resp = res.data;

        if (resp.success) {
          let data = [...resp.data];

          data.forEach((post, index) => {
            if (userId === post?.createdBy) {
              data[index].userImageURL = userProfile.anon
                ? require(`assets/anonAvatars/${userProfile.anonAvatar}`)
                : userProfile.hasPhoto
                ? userProfile.url
                : "";
              data[index].userName = userProfile.firstName ?? userProfile.name ?? "User name";
              data[index].urlSlug =
                userProfile.urlSlug ?? userProfile.firstName ?? userProfile.name ?? "User name";
              data[index].level = userProfile.level ?? 1;
              data[index].verified = userProfile.verified ?? false;
            } else {
              const thisUser = users.find(user => user.id === post?.createdBy);
              if (thisUser) {
                data[index].userImageURL = thisUser.imageURL;
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

            if (post.hasPhoto && !post.url) {
              data[index].url = `${URL()}/user/wall/getPostPhoto/${post.id}`;
            }
          });

          setHasMore(resp.hasMore);
          setPosts(oldPosts => (filterChanged ? data : [...oldPosts, ...data]));
        } else {
          setStatus({
            msg: resp.error?.message || "Unknown error in fetching data.",
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
  };

  const getSharedVoices = () => {
    if (isSharedVoicesLoading) return;
    setIsSharedVoicesLoading(true);
    axios
      .get(`${URL()}/chat/getSharedAudios/${userId}`)
      .then(res => {
        const resp = res.data;

        if (resp.success) {
          setSharedVoices([...resp.data]);
        } else {
          setStatus({
            msg: resp.error?.message || "Unknown error in fetching shared voices.",
            key: Math.random(),
            variant: "error",
          });
        }
        setIsSharedVoicesLoading(false);
      })
      .catch(err => {
        setStatus({
          msg: "Error making get shared voices request",
          key: Math.random(),
          variant: "success",
        });
        setIsSharedVoicesLoading(false);
      });
  };

  const getFriends = async (userId: string, allUsers: UserInfo[]) => {
    const friendList = await UserConnectionsAPI.getFriends(userId);
    const friends: UserInfoWithCloseDegree[] = friendList
      .map(fr => {
        const user: UserInfo | undefined = allUsers.find(u => u.id === fr.user);
        if (user) {
          return { ...user, closenessDegree: fr.closenessDegree || 0 };
        } else {
          return undefined;
        }
      })
      .filter(removeUndef);

    setFriends(friends);
  };

  const handleClosenessDegreeChange = (event: any, newValue: number | number[]) => {
    setClosenessDegree(newValue as number[]);
  };

  const handleClosenessDegreeChanged = () => {
    getPosts(true);
  };

  const getFriendsBox = () => {
    return (
      <div className={classes.friends}>
        {/* <div className={classes.inputSearch}>
          <input
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            type="text"
            placeholder="Search friends"
          />
          <img src={require("assets/icons/search_gray.png")} />
        </div> */}
        <Box fontSize={18} fontWeight={400} fontFamily="Agrandir" mb="32px">
          Friends ({friends.length})
        </Box>
        <Box overflow="auto">
          {filteredFriends.map((friend, index) => (
            <FriendLabel friend={friend} key={`friend-${index}`} />
          ))}
        </Box>
      </div>
    );
  };

  return (
    <>
      <Box mt={3} display="flex" width={1} justifyContent="flex-end" mb={2}>
        <Box className={classes.filterContainer}>
          <Box fontSize={16} fontWeight={400} fontFamily="Agrandir" mr="12px" flexShrink={0}>
            💫&nbsp;&nbsp;Filter by Closeness Degree
          </Box>
          <RedSlider
            min={0}
            marks
            step={0.1}
            max={3}
            value={closenessDegree}
            onChange={handleClosenessDegreeChange}
            onChangeCommitted={handleClosenessDegreeChanged}
            className={classes.slider}
            valueLabelDisplay="auto"
          />
        </Box>
      </Box>
      <Box className={classes.topFriendContainer} mb={5}>
        {getFriendsBox()}
      </Box>
      <Box display="flex" width="100%" justifyContent="space-between">
        <Box className={classes.leftFriendContainer} mr={10}>
          {getFriendsBox()}
        </Box>
        <Box width={1}>
          {ownUser && (
            <Box display="flex" width={1} justifyContent="flex-end">
              <ShareVoiceMessage
                theme="flix"
                handleShare={audio => {
                  setSharedVoices([...sharedVoices, audio]);
                }}
              />
            </Box>
          )}
          <Box display="flex" width={1} justifyContent="flex-end">
            {sharedVoices.map((voice, index) => (
              <SharedVoiceItem voice={voice} key={`shared-voices-${index}`} />
            ))}
          </Box>
          <div>
            <InfiniteScroll
              style={{ overflowX: "hidden" }}
              hasChildren={posts.length > 0}
              dataLength={posts.length}
              scrollableTarget={scrollRef.current}
              next={getPosts}
              hasMore={hasMore}
              loader={<LoadingWrapper loading theme="light dark" />}
            >
              <MasonryGrid
                data={posts}
                renderItem={(item, index) => (
                  <WallFeedCard feedItem userProfile={userProfile} item={item} key={`feed-item-${index}`} />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
                gutter={GUTTER}
              />
            </InfiniteScroll>
          </div>
        </Box>
      </Box>
      {status && <AlertMessage key={status.key} message={status.msg} variant={status.variant} />}
    </>
  );
};

export const RedSlider = withStyles({
  root: {
    height: 8,
    borderRadius: 4,
  },
  thumb: {
    height: 24,
    width: 24,
    background: "linear-gradient(225.12deg, #F2A07E -33.5%, #FF5954 71.42%);",
    border: "none",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    marginTop: -7,
  },
  mark: {
    marginTop: 3,
    backgroundColor: "#FF5954",
  },
  track: {
    background: "linear-gradient(225.12deg, #F2A07E -33.5%, #FF5954 71.42%);",
    height: 8,
    borderRadius: 4,
  },
  rail: {
    background: "linear-gradient(225.12deg, #F2A07E -33.5%, #FF5954 71.42%);",
    height: 8,
    borderRadius: 4,
  },
  valueLabel: {
    marginLeft: "12px",
    "& span": {
      background: "#EFF2F8",
      color: "#707582",
      fontFamily: "Agrandir",
      fontSize: "14px",
    },
  },
})(Slider);

export default Feed;
