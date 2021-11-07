import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessageBox } from "store/selectors/user";
import "./PixMessageProfile.css";
import { setSelectedUser } from "store/actions/SelectedUser";
import { useHistory } from "react-router-dom";
import axios from "axios";
import URL from "shared/functions/getURL";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { LatestBadgesGrid } from "components/PriviSocial/subpages/Home/components/InfoPane";
import { pixMessageProfileStyles } from "./PixMessageProfile.styles";
import Box from "shared/ui-kit/Box";
import { Grid, SvgIcon } from "@material-ui/core";
import { ReactComponent as PlaySolid } from "assets/icons/play-solid.svg";
import { ReactComponent as DownloadSolid } from "assets/icons/download-solid.svg";
import ReactPlayer from "react-player";
import Waveform from "shared/ui-kit/Page-components/Discord/DiscordAudioWavesurfer/Waveform";
import { Color, Modal, PrimaryButton } from "shared/ui-kit";
import DiscordPhotoFullScreen from "shared/ui-kit/Page-components/Discord/DiscordPhotoFullScreen/DiscordPhotoFullScreen";
import DiscordVideoFullScreen from "shared/ui-kit/Page-components/Discord/DiscordVideoFullScreen/DiscordVideoFullScreen";
import { RootState } from "store/reducers/Reducer";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { onGetNonDecrypt } from "shared/ipfs/get";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import getPhotoIPFS from "shared/functions/getPhotoIPFS";

const MEDIA_MAX_COUNTS = 120;

const MediaItemFC = ({ item }) => {
  const classes = pixMessageProfileStyles();
  const playerVideo = React.useRef(null);
  const [selectedPhoto, setSelectedPhoto] = React.useState<string>("");
  const [selectedVideo, setSelectedVideo] = React.useState<string>("");
  const [openModalPhotoFullScreen, setOpenModalPhotoFullScreen] = React.useState<boolean>(false);
  const [openModalVideoFullScreen, setOpenModalVideoFullScreen] = React.useState<boolean>(false);

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  const [fileIPFS, setFileIPFS] = useState<any>(null);
  const [fileBlobIPFS, setFileBlobIPFS] = useState<any>(null);

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  const handleOpenModalPhotoFullScreen = () => {
    setOpenModalPhotoFullScreen(true);
  };

  const handleCloseModalPhotoFullScreen = () => {
    setOpenModalPhotoFullScreen(false);
  };
  const handleOpenModalVideoFullScreen = () => {
    setOpenModalVideoFullScreen(true);
  };

  const handleCloseModalVideoFullScreen = () => {
    setOpenModalVideoFullScreen(false);
  };

  const downloadFile = () => {
    if (fileBlobIPFS) {
      saveAs(
        fileBlobIPFS,
        item.message &&
          item.message.metadata &&
          item.message.metadata.properties &&
          item.message.metadata.properties.name
          ? item.message.metadata.properties.name
          : "File"
      );
    }
  };

  useEffect(() => {
    if (
      ipfs &&
      Object.keys(ipfs).length !== 0 &&
      item &&
      item.type &&
      item.type !== "text" &&
      item.message &&
      item.message.newFileCID
    ) {
      getUserFileIpfs(item.message.newFileCID, item.type);
    }
  }, [item, ipfs]);

  const getUserFileIpfs = async (cid: any, type: string) => {
    let fileUrl: string = "";
    let files = await onGetNonDecrypt(cid, (fileCID, download) =>
      downloadWithNonDecryption(fileCID, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.content);
      if (type === "photo") {
        fileUrl = "data:image/png;base64," + base64String;
      } else if (type === "video") {
        fileUrl = "data:video/mp4;base64," + base64String;
      } else if (type === "audio") {
        fileUrl = "data:audio/mp3;base64," + base64String;
      } else {
        fileUrl = base64String;
        setFileBlobIPFS(files.blob);
      }
    }
    setFileIPFS(fileUrl);
  };

  return (
    <Box style={{ height: "100%" }}>
      <Box className={classes.starBox}>
        {item.type ? (
          item.type === "photo" ? (
            <div
              className={classes.imageContainer}
              onClick={() => {
                setSelectedPhoto(fileIPFS);
                handleOpenModalPhotoFullScreen();
              }}
              style={{
                backgroundImage: `url(${fileIPFS})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            />
          ) : item.type === "video" ? (
            <div className={classes.videoContainer}>
              <div className={classes.iconVideoWrapper}>
                <SvgIcon className={classes.playIconVideo}>
                  <PlaySolid />
                </SvgIcon>
              </div>
              <ReactPlayer
                onClick={() => {
                  if (fileIPFS) {
                    setSelectedVideo(fileIPFS);
                    handleOpenModalVideoFullScreen();
                  }
                }}
                url={fileIPFS}
                ref={playerVideo}
                className={classes.videoPlayer}
                progressInterval={200}
              />
            </div>
          ) : item.type === "audio" ? (
            <div className={classes.audioContainer}>
              {fileIPFS ? (
                <Waveform
                  url={fileIPFS ? fileIPFS : null}
                  mine={false}
                  showTime={false}
                  onPauseFunction={null}
                  onPlayFunction={null}
                  onReadyFunction={null}
                />
              ) : (
                <p className={classes.noMessagesLabelChat}>Loading audio...</p>
              )}
            </div>
          ) : (
            <div className="item-file">
              <div className={classes.itemSubtitle}>
                {item.message &&
                item.message.metadata &&
                item.message.metadata.properties &&
                item.message.metadata.properties.name
                  ? item.message.metadata.properties.name
                  : "File"}
              </div>
              <div
                onClick={() => {
                  downloadFile();
                }}
                className="item-file-icon"
                style={{ textAlign: "center" }}
              >
                <SvgIcon>
                  <DownloadSolid />
                </SvgIcon>
              </div>
            </div>
          )
        ) : (
          <>{item.comment}</>
        )}
      </Box>
      {selectedPhoto && openModalPhotoFullScreen && (
        <Modal
          size="medium"
          className={classes.discordPhotoFullModal}
          isOpen={openModalPhotoFullScreen}
          onClose={handleCloseModalPhotoFullScreen}
          theme="dark"
          showCloseIcon
        >
          <DiscordPhotoFullScreen onCloseModal={handleCloseModalPhotoFullScreen} url={selectedPhoto} />
        </Modal>
      )}
      {selectedVideo && openModalVideoFullScreen && (
        <Modal
          size="medium"
          className={`modal ${classes.dialogContainer}`}
          isOpen={openModalVideoFullScreen}
          onClose={handleCloseModalVideoFullScreen}
          theme="dark"
          showCloseIcon
        >
          <DiscordVideoFullScreen onCloseModal={handleCloseModalVideoFullScreen} url={selectedVideo} />
        </Modal>
      )}
    </Box>
  );
};
const MediaItem = React.memo(MediaItemFC);

export const PixMessageProfile = ({ chat, type = "pix" }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const userSelector = useSelector((state: RootState) => state.user);
  const [myBadges, setMyBadges] = useState<any[]>([]);
  const [lastId, setLastId] = useState<string>("");
  const [medias, setMedias] = useState<any[]>([]);

  const messageBoxInfo = useSelector(getMessageBox);
  const { userInfo } = messageBoxInfo;
  const { showAlertMessage } = useAlertMessage();
  
  const { isIPFSAvailable, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);
  
  const getmyStats = () => {
    axios
      .get(`${URL()}/user/getUserCounters/${userInfo.id}`)
      .then(response => {
        const resp = response.data;
        if (resp.success) {
          const { badges, ...others } = resp.data;
          setMyBadges(badges);
        } else {
          setMyBadges([]);
        }
      })
      .catch(_ => {
        showAlertMessage(`Error getting user stats`, { variant: "error" });
      });
  };

  useEffect(() => {
    if (isIPFSAvailable && userInfo && userInfo.id) {
      getIPFSImage(userInfo);
      getmyStats();
    }
  }, [userInfo, isIPFSAvailable]);

  const getIPFSImage = async userInfo => {
    if (
      userInfo &&
      userInfo.infoImage &&
      userInfo.infoImage.newFileCID &&
      (!userInfo.ipfsImage || userInfo.ipfsImage === "")
    ) {
      userInfo.ipfsImage = await getPhotoIPFS(userInfo.infoImage.newFileCID, downloadWithNonDecryption);
    }
  };

  useEffect(() => {
    if (chat && userInfo) {
      axios
        .post(`${URL()}/chat/getChatUploadedMedias/`, {
          room: chat.room,
          userIds: [userInfo.id, userSelector.id],
          lastId,
        })
        .then(response => {
          const resp = response.data;
          if (resp.success) {
            const data: any[] = [];
            resp.data.forEach((item, index) => {
              if (index < MEDIA_MAX_COUNTS) {
                data.push(item);
              }
            });
            setMedias(data);
          } else {
            setMedias([]);
          }
        })
        .catch(_ => {
          showAlertMessage(`Error getting user media stats`, { variant: "error" });
        });
    }
  }, [chat]);

  const userName = useMemo(() => {
    const user = userInfo?.urlSlug ? userInfo?.urlSlug : "";
    return user.length > 17 ? user.substr(0, 13) + "..." + user.substr(user.length - 3, 3) : user;
  }, [userInfo]);

  if (userInfo !== undefined)
    return (
      <div>
        <img
          src={
            userInfo.ipfsImage
              ? userInfo.ipfsImage
              : require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")
          }
          className="message-profile-avatar"
        />
        <div className="name">{userInfo && userInfo.name}</div>
        <div className="slug-container">
          {userName ? (
            <div className="slug-name" style={type === "trax" ? { color: Color.MusicDAOGreen } : {}}>
              @{userName}
            </div>
          ) : null}
          <img className="verified-label" src={require("assets/icons/profileVerified.svg")} alt={"check"} />
          <span className="profile-level">level 1</span>
        </div>
        <div className="badges">
          {myBadges && myBadges.length ? (
            <>
              <div className="title">💎 Badges</div>
              <LatestBadgesGrid
                myBadges={myBadges}
                ownUser={false}
                userProfile={userInfo}
                getUserStats={getmyStats}
              />
            </>
          ) : null}
        </div>
        {medias && medias.length ? (
          <div className="media-container">
            <div className="title">Media</div>
            <Grid container spacing={1}>
              {medias.map((item, index) => (
                <Grid item xs={6} sm={4} md={3}>
                  <MediaItem item={item} key={index} />
                </Grid>
              ))}
            </Grid>
          </div>
        ) : null}
        <div className="button-container">
          <PrimaryButton
            size="medium"
            onClick={() => {
              history.push(`/${userInfo.id}/profile`);
              dispatch(setSelectedUser(userInfo.id));
            }}
            style={type === "trax" ? { background: Color.MusicDAOGreen } : {}}
            isRounded={type === "trax"}
          >
            View Full Profile
          </PrimaryButton>
        </div>
      </div>
    );
  else return null;
};
