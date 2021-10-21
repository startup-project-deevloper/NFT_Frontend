import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { useTypedSelector } from "store/reducers/Reducer";

import { useAuth } from "shared/contexts/AuthContext";
import { useUserConnections } from "shared/contexts/UserConnectionsContext";
import Box from "shared/ui-kit/Box";

import { artistCardStyles } from "./index.styles";
import { CircularLoadingIndicator } from "shared/ui-kit";

import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import useIPFS from "../../../../../shared/utils-IPFS/useIPFS";
import { onGetNonDecrypt } from "../../../../../shared/ipfs/get";
import getPhotoIPFS from "../../../../../shared/functions/getPhotoIPFS";
import { StyledSkeleton } from "shared/ui-kit/Styled-components/StyledComponents";

export default function ArtistCard({ item, currentIndex }) {
  const classes = artistCardStyles();
  const users = useTypedSelector(state => state.usersInfoList);
  const user = useTypedSelector(state => state.user);
  const history = useHistory();
  const { isSignedin } = useAuth();
  const { followUser, unfollowUser, isUserFollowed } = useUserConnections();
  const [isFollowInProgress, setIsFollowInProgress] = React.useState<boolean>(false);
  const isFollowing = item ? isUserFollowed(item.id) : 0;

  const [artist, setArtist] = useState<any>(item);
  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  const [imageIPFS, setImageIPFS] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    if (ipfs && item) {
      getUserPhoto(item);
    }
  }, [item, ipfs]);

  const getUserPhoto = async (user: any) => {
    setLoading(true);
    if (user && user.infoImage && user.infoImage.newFileCID) {
      let imageUrl = await getPhotoIPFS(user.infoImage.newFileCID, downloadWithNonDecryption);
      setImageIPFS(imageUrl);
    } else if (user && user.id) {
      const userFound = users.find(usr => usr.id === user.id);

      if (userFound && userFound.infoImage && userFound.infoImage.newFileCID) {
        let imageUrl = await getPhotoIPFS(userFound.infoImage.newFileCID, downloadWithNonDecryption);
        setImageIPFS(imageUrl);
      }
    } else {
      setImageIPFS(require(`assets/anonAvatars/${artist.anonAvatar ?? "ToyFaces_Colored_BG_001.jpg"}`));
    }
    setLoading(false);
  };

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
      {loading ? (
        <StyledSkeleton width="100%" height="100%" variant="rect" />
      ) : (
        <img src={imageIPFS ? imageIPFS : getDefaultAvatar()} />
      )}
      <div className={classes.filter}>
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="16px">
          {<b>{`${item.firstName || ""} ${item.lastName || ""}`}</b>}
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
