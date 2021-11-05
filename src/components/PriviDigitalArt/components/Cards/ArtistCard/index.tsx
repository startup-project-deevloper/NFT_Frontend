import React from "react";
import { useHistory } from "react-router-dom";

import { useTypedSelector } from "store/reducers/Reducer";

import { useAuth } from "shared/contexts/AuthContext";
import { useUserConnections } from "shared/contexts/UserConnectionsContext";
import Box from "shared/ui-kit/Box";

import { artistCardStyles } from "./index.styles";
import { CircularLoadingIndicator } from "shared/ui-kit";

import { getDefaultAvatar } from "shared/services/user/getUserAvatar";

export default function ArtistCard({ item }) {
  const classes = artistCardStyles();
  const user = useTypedSelector(state => state.user);
  const history = useHistory();
  const { isSignedin } = useAuth();
  const { followUser, unfollowUser, isUserFollowed } = useUserConnections();
  const [isFollowInProgress, setIsFollowInProgress] = React.useState<boolean>(false);
  const isFollowing = item ? isUserFollowed(item.id) : 0;

  const handleFollow = e => {
    e.stopPropagation();
    e.preventDefault();
    if (!item) return;

    setIsFollowInProgress(true);
    if (!isFollowing) {
      followUser(item.id);
    } else {
      unfollowUser(item.id);
    }
  };

  React.useEffect(() => {
    setIsFollowInProgress(false);
  }, [isFollowing]);

  return (
    <div
      className={classes.card}
      onClick={() => {
        history.push(`/${item.urlSlug}/profile`);
      }}
    >
      <img src={item.imageUrl || getDefaultAvatar()} />
      <div className={classes.filter}>
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="16px">
          {<b>{`${item.name || ""}`}</b>}
          {user && item.id !== user.id && isSignedin && (
            <button className={isFollowing ? classes.unfollow : classes.follow} onClick={handleFollow}>
              {isFollowInProgress ? (
                <div className={classes.loading}>
                  <CircularLoadingIndicator theme="blue" />
                </div>
              ) : isFollowing === 2 ? (
                "Unfollow"
              ) : isFollowing === 1 ? (
                "Requested"
              ) : (
                "Follow"
              )}
            </button>
          )}
        </Box>
        <Box display="flex" width="100%" justifyContent="space-between">
          <Box display="flex" flexDirection="column">
            <b>🌟 Collections</b>
            <Box marginTop="8px">
              {item.myMediasCount
                ? `${
                    item.myMediasCount > 1000000
                      ? (item.myMediasCount / 1000000).toFixed(1)
                      : item.myMediasCount > 1000
                      ? (item.myMediasCount / 1000).toFixed(1)
                      : item.myMediasCount
                  }${item.myMediasCount > 1000000 ? "M" : item.myMediasCount > 1000 ? "K" : ""}`
                : 0}
            </Box>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <b>🌟 Followers</b>
            <Box marginTop="8px">
              {item.numFollowers && item.numFollowers > 0
                ? `${
                    item.numFollowers > 1000000
                      ? (item.numFollowers / 1000000).toFixed(1)
                      : item.numFollowers > 1000
                      ? (item.numFollowers / 1000).toFixed(1)
                      : item.numFollowers
                  }${item.numFollowers > 1000000 ? "M" : item.numFollowers > 1000 ? "K" : ""}`
                : 0}
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
}
