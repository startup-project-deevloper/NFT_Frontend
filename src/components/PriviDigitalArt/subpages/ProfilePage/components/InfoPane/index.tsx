import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { CircularProgress, useMediaQuery, useTheme, Button } from "@material-ui/core";

import { RootState } from "store/reducers/Reducer";
import Box from "shared/ui-kit/Box";
import { getUsersInfoList } from "store/selectors";
import { useAuth } from "shared/contexts/AuthContext";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import BadgeHexagon from "shared/ui-kit/Badge-hexagon/Badge-hexagon";
import * as UserConnectionsAPI from "shared/services/API/UserConnectionsAPI";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { getDefaultAvatar, getUserAvatar } from "shared/services/user/getUserAvatar";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import URL from "shared/functions/getURL";
import { setUser } from "store/actions/User";

import BadgesProfileModal from "../../modals/BadgesModal";
import ProfileFollowsModal from "../../modals/FollowingsFollowers";
import ChangeProfileBackgroundModal from "../../modals/ChangeProfileBackgroundModal/ChangeProfileBackgroundModal";
import ChangeAnonAvatarModal from "../../modals/ChangeAnonAvatarModal/ChangeAnonAvatarModal";
import { Card, profilePageStyles } from "../../index.styles";
import { useUserConnections } from "shared/contexts/UserConnectionsContext";
import { onUploadNonEncrypt } from "../../../../../../shared/ipfs/upload";
import useIPFS from "../../../../../../shared/utils-IPFS/useIPFS";
import getPhotoIPFS from "../../../../../../shared/functions/getPhotoIPFS";
import SkeletonBox from "shared/ui-kit/SkeletonBox";
import { usePageRefreshContext } from "shared/contexts/PageRefreshContext";

const arePropsEqual = (prevProps, currProps) => {
  return (
    prevProps.userProfile === currProps.userProfile &&
    prevProps.ownUser === currProps.ownUser &&
    prevProps.userId === currProps.userId &&
    prevProps.myBadges === currProps.myBadges
  );
};

const InfoPane = React.memo(
  ({
    userProfile,
    ownUser,
    userId,
    setStatus,
    myBadges,
    getUserStats,
  }: {
    userProfile: any;
    ownUser: boolean;
    userId: string;
    setStatus: any;
    myBadges: any[];
    getUserStats: () => void;
  }) => {
    const classes = profilePageStyles();
    const dispatch = useDispatch();

    const { followUser, unfollowUser, isUserFollowed } = useUserConnections();
    const [isFollowing, setIsFollowing] = React.useState<number>(userId ? isUserFollowed(userId) : 0);

    const user = useSelector((state: RootState) => state.user);
    const users = useSelector(getUsersInfoList);
    const { isSignedin } = useAuth();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingFollows, setIsLoadingFollows] = useState(false);
    const [isLoadingUser, setIsLoadingUser] = useState(false);

    const [openModalFollows, setOpenModalFollows] = useState(false);
    const [openModalChangeBG, setOpenModalChangeBG] = useState(false);
    const [openModalChangeAnonAvatar, setOpenModalChangeAnonAvatar] = useState(false);
    const [selectedListFollows, setSelectedListFollows] = useState<any[]>([]);
    const [selectedHeaderFollows, setSelectedHeaderFollows] = useState<"Followings" | "Followers">(
      "Followers"
    );
    const [profileBG, setProfileBG] = useState<string>("");
    const [anonAvatar, setAnonAvatar] = useState<string>("");

    const inputRef = useRef<any>();

    const { ipfs, setMultiAddr, uploadWithNonEncryption, downloadWithNonDecryption } = useIPFS();

    const [imageIPFS, setImageIPFS] = useState<any>(null);
    const { profileAvatarChanged, setProfileAvatarChanged } = usePageRefreshContext();

    useEffect(() => {
      setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
    }, []);

    useEffect(() => {
      if (userId) {
        setIsFollowing(isUserFollowed(userId));
      }
    }, [userId, isUserFollowed]);

    useEffect(() => {
      if (ipfs && Object.entries(userProfile).length) {
        getPhotoUser();
      } else if (!Object.entries(userProfile).length) {
        setImageIPFS(null);
      }
    }, [ipfs, userProfile, profileAvatarChanged]);

    useEffect(() => {
      if (user.backgroundURL) {
        setProfileBG(user.backgroundURL);
      }

      if (user.anonAvatar) {
        setAnonAvatar(user.anonAvatar);
      }
    }, [user.backgroundURL, user.anonAvatar]);

    useEffect(() => {
      getFollowers();
    }, [userId, ownUser]);

    const getPhotoUser = async () => {
      if (
        ipfs &&
        Object.keys(ipfs).length !== 0 &&
        userProfile &&
        userProfile.infoImage &&
        userProfile.infoImage.newFileCID
      ) {
        setImageIPFS(await getPhotoIPFS(userProfile.infoImage.newFileCID, downloadWithNonDecryption));
      } else {
        setImageIPFS(getDefaultAvatar());
      }
    };

    const handleOpenModalFollows = () => {
      setOpenModalFollows(true);
    };
    const handleCloseModalFollows = () => {
      setOpenModalFollows(false);
    };

    const handleOpenModalChangeBG = () => {
      if (ownUser) {
        setOpenModalChangeBG(true);
      }
    };
    const handleCloseModalChangeBG = () => {
      setOpenModalChangeBG(false);
    };

    const handleOpenModalChangeAnonAvatar = () => {
      setOpenModalChangeAnonAvatar(true);
    };
    const handleCloseModalChangeAnonAvatar = () => {
      setOpenModalChangeAnonAvatar(false);
    };

    const showFollowersList = async () => {
      if (!isSignedin) return;

      setSelectedHeaderFollows("Followers");
      handleOpenModalFollows();

      await getFollowers();
    };

    const showFollowingList = async () => {
      if (!isSignedin) return;

      setSelectedHeaderFollows("Followings");
      handleOpenModalFollows();

      await getFollowing();
    };

    const getFollowing = async () => {
      try {
        setIsLoadingFollows(true);
        const following = (await UserConnectionsAPI.getFollowings(userId, ownUser)) as any[];
        if (users && users.length > 0 && following && following.length) {
          following.forEach((followed, index) => {
            const matchedUser = users.find(u => u.id === followed.id || u.id === followed.id?.user);
            if (matchedUser) {
              following[index].ipfsImage = matchedUser.ipfsImage
                ? matchedUser.ipfsImage
                : matchedUser.ipfsImage
                ? matchedUser.ipfsImage
                : matchedUser.ipfsImage
                ? matchedUser.ipfsImage
                : require(`assets/anonAvatars/${matchedUser.anonAvatar}`);
              following[index].urlSlug = matchedUser.urlSlug;
            }
          });
        } else {
          setStatus({
            msg: "No following",
            key: Math.random(),
            variant: "warning",
          });
        }
        setSelectedListFollows(following || []);
      } catch (error) {
        setStatus({
          msg: "Error getting followers",
          key: Math.random(),
          variant: "error",
        });
      }
      setIsLoadingFollows(false);
    };

    const getFollowers = async () => {
      try {
        setIsLoadingFollows(true);
        const followers = (await UserConnectionsAPI.getFollowers(userId, ownUser)) as any[];
        if (users && users.length > 0 && followers && followers.length) {
          followers.forEach((follower, index) => {
            const matchedUser = users.find(u => u.id === follower.id || u.id === follower.id?.user);
            if (matchedUser) {
              followers[index].ipfsImage = matchedUser.ipfsImage
                ? matchedUser.ipfsImage
                : matchedUser.ipfsImage
                ? matchedUser.ipfsImage
                : matchedUser.ipfsImage
                ? matchedUser.ipfsImage
                : require(`assets/anonAvatars/${matchedUser.anonAvatar}`);
              followers[index].urlSlug = matchedUser.urlSlug;
            }
          });
        } else {
          setStatus({
            msg: "No follower",
            key: Math.random(),
            variant: "warning",
          });
        }

        setSelectedListFollows(followers || []);
      } catch (error) {
        setStatus({
          msg: "Error getting followers",
          key: Math.random(),
          variant: "error",
        });
      }
      setIsLoadingFollows(false);
    };

    const fileInput = e => {
      e.preventDefault();
      const files = e.target.files;
      if (files.length) {
        handleFiles(files);
      }
    };

    const handleFiles = async (files: any) => {
      if (validateFile(files[0])) {
        /*const formData = new FormData();
        formData.append("image", files[0], localStorage.getItem("userId") ?? "");
        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };
        axios
          .post(`${URL()}/user/changeProfilePhoto`, formData, config)
          .then(res => {
            let setterUser: any = { ...user, url: res.data.data + "?" + Date.now() };
            setterUser.hasPhoto = true;
            if (setterUser.id) {
              dispatch(setUser(setterUser));
            }
          })
          .catch(error => {
            setStatus({
              msg: "Error change user profile photo",
              key: Math.random(),
              variant: "error",
            });
          });*/

        let metadataID = await onUploadNonEncrypt(files[0], file => uploadWithNonEncryption(file));

        axios
          .post(`${URL()}/user/changeProfilePhoto/saveMetadata/${user.id}`, metadataID)
          .then(async res => {
            if (res.data.data) {
              let setterUser: any = { ...user, infoImage: res.data.data };
              setterUser.hasPhoto = true;
              if (setterUser.id) {
                if (setterUser && setterUser.infoImage && setterUser.infoImage.newFileCID) {
                  setterUser.ipfsImage = await getPhotoIPFS(
                    setterUser.infoImage.newFileCID,
                    downloadWithNonDecryption
                  );
                }
                dispatch(setUser(setterUser));
              }
              setProfileAvatarChanged(Date.now());
            }
          })
          .catch(error => {
            console.log("Error", error);
            setStatus({
              msg: "Error change user profile photo",
              key: Math.random(),
              variant: "error",
            });
          });
      } else {
        files[0]["invalid"] = true;
      }
    };

    const validateFile = file => {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/x-icon"];
      if (validTypes.indexOf(file.type) === -1) {
        return false;
      }
      return true;
    };

    const userAvatar = useMemo(() => {
      return getUserAvatar({
        id: userProfile.id,
        anon: user.anon,
        hasPhoto: userProfile.hasPhoto,
        anonAvatar: userProfile.anonAvatar,
        url: userProfile.url,
      });
    }, [userProfile]);

    const onFollowUser = e => {
      e.stopPropagation();
      e.preventDefault();
      if (!userId) return;

      setIsLoading(true);
      if (!isFollowing) {
        followUser(userId).then(_ => {
          setIsFollowing(1);
          setIsLoading(false);
        });
      } else {
        unfollowUser(userId).then(_ => {
          setIsFollowing(0);
          setIsLoading(false);
        });
      }
    };

    const userName = useMemo(() => {
      const user = userProfile.urlSlug ?? userProfile.id ?? userId ?? "";
      return user.length > 17 ? user.substr(0, 13) + "..." + user.substr(user.length - 3, 3) : user;
    }, [userProfile]);

    return (
      <Card noPadding>
        <div
          className={classes.header}
          onClick={handleOpenModalChangeBG}
          style={{
            backgroundImage: profileBG ? `url(${require(`assets/backgrounds/profile/${profileBG}`)})` : "",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <SkeletonBox
          className={classes.avatar}
          style={{
            cursor: ownUser ? "pointer" : "auto",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          image={imageIPFS}
          loading={!imageIPFS}
          onClick={() => {
            if (ownUser) {
              if (userProfile.anon) {
                handleOpenModalChangeAnonAvatar();
              } else {
                if (inputRef && inputRef.current) {
                  inputRef.current.click();
                }
              }
            }
          }}
        />
        <InputWithLabelAndTooltip
          hidden
          type="file"
          style={{ display: "none" }}
          accept="image/*"
          onInputValueChange={fileInput}
          reference={inputRef}
        />
        <LoadingWrapper loading={!Object.keys(userProfile).length} theme="blue">
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            mt={"26px"}
            mb={"50px"}
            className={classes.infoPaneMain}
            justifyContent="space-between"
          >
            <Box flex={1} mr={isMobile ? 0 : 9} mb={isMobile ? 3 : 0}>
              <Box display="flex" justifyContent="space-between">
                <Box display="flex" flexDirection="column">
                  <Box fontSize={22} fontWeight={400} color="#181818">
                    {`${userProfile.name ?? `${userProfile.firstName || ""} ${userProfile.lastName || ""}`}`}
                  </Box>
                  <Box fontWeight={800} fontSize={16} color="#9EACF2">{`@${userName}`}</Box>
                </Box>
                {isLoading ? (
                  <CircularProgress style={{ color: "#431AB7" }} />
                ) : (
                  !ownUser && (
                    <Button className={classes.followButton} onClick={onFollowUser}>
                      {isFollowing === 0 ? "Follow" : isFollowing === 1 ? "Cancel request" : "Unfollow"}
                    </Button>
                  )
                )}
              </Box>
              <Box mt={2} fontSize={14} fontWeight={400} color="#181818">
                {userProfile.bio}
              </Box>
            </Box>
            <Box flex={1}>
              <div className={classes.statLine}>
                {isLoadingUser ? (
                  <CircularProgress style={{ color: "#431AB7" }} />
                ) : (
                  <>
                    <div
                      onClick={showFollowersList}
                      style={{ cursor: !localStorage.getItem("userId") ? "auto" : "pointer" }}
                    >
                      <Box fontSize={14} fontWeight={400} mb={1} whiteSpace="nowrap">
                        🌟 Followers
                      </Box>
                      <Box fontSize={35} fontWeight={400}>
                        {userProfile.numFollowers || 0}
                      </Box>
                    </div>
                    <div
                      onClick={showFollowingList}
                      style={{ cursor: !localStorage.getItem("userId") ? "auto" : "pointer" }}
                    >
                      <Box fontSize={14} fontWeight={400} mb={1} whiteSpace="nowrap">
                        💫 Following
                      </Box>
                      <Box fontSize={35} fontWeight={400}>
                        {userProfile.numFollowings || 0}
                      </Box>
                    </div>
                    <div>
                      <Box fontSize={14} fontWeight={400} mb={1}>
                        💎 Badges
                      </Box>
                      {myBadges.length > 0 ? (
                        <LatestBadgesGrid
                          myBadges={myBadges}
                          ownUser={ownUser}
                          userProfile={userProfile}
                          getUserStats={getUserStats}
                        />
                      ) : (
                        <Box fontSize={35} fontWeight={400}>
                          0
                        </Box>
                      )}
                    </div>
                  </>
                )}
              </div>
            </Box>
          </Box>
        </LoadingWrapper>
        {openModalChangeBG && (
          <ChangeProfileBackgroundModal open={openModalChangeBG} onClose={handleCloseModalChangeBG} />
        )}
        {openModalChangeAnonAvatar && (
          <ChangeAnonAvatarModal
            open={openModalChangeAnonAvatar}
            onClose={handleCloseModalChangeAnonAvatar}
          />
        )}
        {openModalFollows && (
          <ProfileFollowsModal
            open={openModalFollows}
            onClose={handleCloseModalFollows}
            header={selectedHeaderFollows}
            list={selectedListFollows}
            refreshFollowers={getFollowers}
            refreshFollowings={getFollowing}
            isLoadingFollows={isLoadingFollows}
            ownUser={ownUser}
          />
        )}
      </Card>
    );
  },
  arePropsEqual
);

const LatestBadgesGrid = ({ myBadges, userProfile, ownUser, getUserStats }) => {
  const classes = profilePageStyles();

  const { width } = useWindowDimensions();
  const { isSignedin } = useAuth();

  const LIMIT_CNT = width < 640 ? 5 : 10;
  const OFFSET_BADGE = width < 640 ? "90px" : "220px";

  const [openAllBadges, setOpenAllBadges] = React.useState(false);

  const handleOpenAllBadges = () => {
    if (isSignedin) setOpenAllBadges(true);
  };

  const handleCloseAllBadges = () => {
    setOpenAllBadges(false);
  };

  return (
    <Box display="flex" alignItems="center" flexWrap="wrap" onClick={handleOpenAllBadges}>
      {myBadges.map((badge, index) => {
        if (index < LIMIT_CNT)
          return (
            <div key={index} className={classes.indexBadge}>
              <BadgeHexagon
                badge={badge}
                key={`latest-badges-${index}`}
                style={{ width: "48px", height: "48px" }}
              />
            </div>
          );
        else return null;
      })}
      {myBadges.length > LIMIT_CNT ? (
        <span className={classes.badgeMore} style={{ left: OFFSET_BADGE }}>
          {`+${myBadges.length - LIMIT_CNT}`}
        </span>
      ) : null}
      {openAllBadges && (
        <BadgesProfileModal
          open={openAllBadges}
          handleClose={() => {
            handleCloseAllBadges();
          }}
          badges={myBadges}
          userProfile={userProfile}
          handleRefresh={() => {
            getUserStats();
          }}
          ownUser={ownUser}
        />
      )}
    </Box>
  );
};

export default InfoPane;
