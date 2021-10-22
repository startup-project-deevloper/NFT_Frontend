import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CircularProgress, useMediaQuery, useTheme } from "@material-ui/core";

import { RootState } from "store/reducers/Reducer";
import { Card, GreenText, SocialPrimaryButton } from "components/PriviSocial/index.styles";
import Box from "shared/ui-kit/Box";
import { getUsersInfoList } from "store/selectors";
import { useAuth } from "shared/contexts/AuthContext";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import BadgeHexagon from "shared/ui-kit/Badge-hexagon/Badge-hexagon";
import { homeStyles } from "../../index.styles";
import * as UserConnectionsAPI from "shared/services/API/UserConnectionsAPI";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import BadgesProfileModal from "../../modals/BadgesModal";
import ProfileFollowsModal from "../../modals/FollowingsFollowers";
import ChangeProfileBackgroundModal from "../../modals/ChangeProfileBackgroundModal/ChangeProfileBackgroundModal";
import ChangeAnonAvatarModal from "../../modals/ChangeAnonAvatarModal/ChangeAnonAvatarModal";
import { getDefaultAvatar, getUserAvatar } from "shared/services/user/getUserAvatar";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import axios from "axios";

import URL from "shared/functions/getURL";
import { setUser } from "store/actions/User";
import { onUploadNonEncrypt } from "../../../../../../shared/ipfs/upload";
import useIPFS from "../../../../../../shared/utils-IPFS/useIPFS";
import getPhotoIPFS from "../../../../../../shared/functions/getPhotoIPFS";

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
    setDisplayWall,
  }: {
    userProfile: any;
    ownUser: boolean;
    userId: string;
    setStatus: any;
    myBadges: any[];
    getUserStats: () => void;
    setDisplayWall: (flag: boolean) => void;
  }) => {
    const classes = homeStyles();

    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const users = useSelector(getUsersInfoList);
    const { isSignedin } = useAuth();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));

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

    const [changeImageTimestamp, setChangeImageTimestamp] = useState<number>(0);
    const [imageIPFS, setImageIPFS] = useState({});

    const { ipfs, setMultiAddr, uploadWithNonEncryption, downloadWithNonDecryption } = useIPFS();

    useEffect(() => {
      setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
    }, []);

    useEffect(() => {
      if (user.backgroundURL) {
        setProfileBG(user.backgroundURL);
      }

      if (user.anonAvatar) {
        setAnonAvatar(user.anonAvatar);
      }
    }, [user.backgroundURL, user.anonAvatar]);

    useEffect(() => {
      getPhotoUser();
    }, [ipfs, user, changeImageTimestamp]);

    const getPhotoUser = async () => {
      if (ipfs && userProfile && userProfile.infoImage && userProfile.infoImage.newFileCID) {
        setImageIPFS(await getPhotoIPFS(userProfile.infoImage.newFileCID, downloadWithNonDecryption));
      }
    };

    const handleOpenModalFollows = () => {
      setOpenModalFollows(true);
    };
    const handleCloseModalFollows = () => {
      setOpenModalFollows(false);
    };

    const handleOpenModalChangeBG = () => {
      setOpenModalChangeBG(true);
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

      setIsLoadingFollows(true);
      const followers = (await getFollowers()) as any[];
      if (users && users.length > 0 && followers && followers.length) {
        followers.forEach((following, index) => {
          followers[index].userImageURL =
            users.find(u => u.id === following.id || u.id === following.id?.user)?.imageURL ??
            users.find(u => u.id === following.id || u.id === following.id?.user)?.url;
          followers[index].urlSlug = users
            .find(u => u.id === following.id || u.id === following.id?.user)
            ?.urlSlug?.startsWith("Px")
            ? users.find(u => u.id === following.id || u.id === following.id?.user)?.name
            : users.find(u => u.id === following.id || u.id === following.id?.user)?.urlSlug;
        });
      } else {
        setStatus({
          msg: "No follower",
          key: Math.random(),
          variant: "warning",
        });
      }
      setSelectedListFollows(followers || []);
      setIsLoadingFollows(false);
    };

    const showFollowingList = async () => {
      if (!isSignedin) return;

      setSelectedHeaderFollows("Followings");
      handleOpenModalFollows();
      setIsLoadingFollows(true);
      let following = (await getFollowing()) as any[];

      if (users && users.length > 0 && following && following.length) {
        following.forEach((followed, index) => {
          following[index].userImageURL =
            users.find(u => u.id === followed.id || u.id === followed.id?.user)?.imageURL ??
            users.find(u => u.id === followed.id || u.id === followed.id?.user)?.url;
          following[index].urlSlug = users
            .find(u => u.id === followed.id || u.id === followed.id?.user)
            ?.urlSlug?.startsWith("Px")
            ? users.find(u => u.id === followed.id || u.id === followed.id?.user)?.name
            : users.find(u => u.id === followed.id || u.id === followed.id?.user)?.urlSlug;
        });
      } else {
        setStatus({
          msg: "No following",
          key: Math.random(),
          variant: "warning",
        });
      }

      setSelectedListFollows(following);
      setIsLoadingFollows(false);
    };

    const getFollowing = async () => {
      try {
        const followings = await UserConnectionsAPI.getFollowings(userId, ownUser);
        setSelectedListFollows(followings);
        return followings;
      } catch (error) {
        setStatus({
          msg: "Error getting followers",
          key: Math.random(),
          variant: "error",
        });
      }
    };

    const getFollowers = async () => {
      try {
        const followers = await UserConnectionsAPI.getFollowers(userId, ownUser);
        setSelectedListFollows(followers);
        return followers;
      } catch (error) {
        setStatus({
          msg: "Error getting followers",
          key: Math.random(),
          variant: "error",
        });
      }
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
          .then(res => {
            if (res.data.data) {
              let setterUser: any = { ...user, infoImage: res.data.data };
              setterUser.hasPhoto = true;
              if (setterUser.id) {
                dispatch(setUser(setterUser));
              }
              setChangeImageTimestamp(Date.now());
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
        <div
          className={classes.avatar}
          style={{
            backgroundImage: imageIPFS ? `url(${imageIPFS})` : `url(${getDefaultAvatar()})`,
            cursor: ownUser ? "pointer" : "auto",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onClick={() => {
            if (userProfile.anon) {
              handleOpenModalChangeAnonAvatar();
            } else {
              if (inputRef && inputRef.current) {
                inputRef.current.click();
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
        <LoadingWrapper loading={!userProfile} theme="green">
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            mt={"26px"}
            mb={"50px"}
            pr={5}
            pl={5}
            justifyContent="space-between"
          >
            <Box flex={1} mr={isMobile ? 0 : 9} mb={isMobile ? 3 : 0}>
              <Box fontSize={22} fontWeight={800} color="#707582">
                {`${userProfile.name ?? `${userProfile.firstName || ""} ${userProfile.lastName || ""}`}`}
              </Box>
              <GreenText bold fontSize="14px">{`@${
                userProfile.urlSlug ?? userProfile.id ?? userId ?? ""
              }`}</GreenText>
              <Box mt={2} fontSize="14px" fontWeight={400} color="#707582">
                {userProfile.bio}
              </Box>
            </Box>
            <Box flex={1}>
              <div className={classes.statLine}>
                {isLoadingUser ? (
                  <CircularProgress style={{ color: "#B1FF00" }} />
                ) : (
                  <>
                    <div
                      onClick={showFollowersList}
                      style={{ cursor: !localStorage.getItem("userId") ? "auto" : "pointer" }}
                    >
                      <Box fontSize={14} fontWeight={400} mb={1} whiteSpace="nowrap">
                        🌟 Followers
                      </Box>
                      <Box fontSize={32} fontWeight={800} color="#707582">
                        {userProfile.numFollowers}
                      </Box>
                    </div>
                    <div
                      onClick={showFollowingList}
                      style={{ cursor: !localStorage.getItem("userId") ? "auto" : "pointer" }}
                    >
                      <Box fontSize={14} fontWeight={400} mb={1} whiteSpace="nowrap">
                        💫 Following
                      </Box>
                      <Box fontSize={32} fontWeight={800} color="#707582">
                        {userProfile.numFollowings}
                      </Box>
                    </div>
                    <div>
                      <Box>
                        <Box fontSize="14px" mb={1}>
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
                          <Box fontSize={32} fontWeight={800} color="#707582">
                            0
                          </Box>
                        )}
                      </Box>
                    </div>
                  </>
                )}
              </div>
              {ownUser && (
                <Box display="flex" alignItems="center" justifyContent="flex-end" mt={2}>
                  <SocialPrimaryButton onClick={() => setDisplayWall(true)} style={{ width: 190 }}>
                    Go to Wall
                  </SocialPrimaryButton>
                </Box>
              )}
            </Box>
          </Box>
          {openModalFollows && (
            <ProfileFollowsModal
              open={openModalFollows}
              onClose={handleCloseModalFollows}
              header={selectedHeaderFollows}
              list={selectedListFollows}
              refreshFollowers={getFollowers}
              refreshFollowings={getFollowing}
              isLoadingFollows={isLoadingFollows}
              number={
                selectedHeaderFollows === "Followers" ? userProfile.numFollowers : userProfile.numFollowings
              }
            />
          )}
          <ChangeProfileBackgroundModal open={openModalChangeBG} onClose={handleCloseModalChangeBG} />
          <ChangeAnonAvatarModal
            open={openModalChangeAnonAvatar}
            onClose={handleCloseModalChangeAnonAvatar}
          />
        </LoadingWrapper>
      </Card>
    );
  },
  arePropsEqual
);

export const LatestBadgesGrid = ({ myBadges, userProfile, ownUser, getUserStats }) => {
  const classes = homeStyles();

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
