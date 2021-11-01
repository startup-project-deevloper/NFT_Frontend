import React, {useEffect, useRef, useState} from "react";
import {_arrayBufferToBase64} from "../../../../../shared/functions/commonFunctions";
import Moment from "react-moment";
import {setSelectedUser} from "../../../../../store/actions/SelectedUser";
import SvgIcon from "@material-ui/core/SvgIcon";
import {ReactComponent as ThumbsUpSolid} from "../../../../../assets/icons/thumbs-up-solid.svg";
import {ReactComponent as ThumbsDownSolid} from "../../../../../assets/icons/thumbs-down-solid.svg";
import {ReactComponent as PlaySolid} from "../../../../../assets/icons/play-solid.svg";
import ReactPlayer from "react-player";
import Waveform from "./DiscordAudioWavesurfer/Waveform";
import {ReactComponent as DownloadSolid} from "../../../../../assets/icons/download-solid.svg";
import {Modal} from "../../../../../shared/ui-kit/Modal";
import DiscordPhotoFullScreen from "./DiscordPhotoFullScreen/DiscordPhotoFullScreen";
import DiscordVideoFullScreen from "./DiscordVideoFullScreen/DiscordVideoFullScreen";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/reducers/Reducer";
import {useHistory} from "react-router-dom";
import {saveAs} from "file-saver";
import URL, {default as ServerURL} from "../../../../../shared/functions/getURL";
import axios from "axios";
import {updateTask} from "../../../../../shared/functions/updateTask";
import {onDownloadNonDecrypt} from "../../../../../shared/ipfs/download";
import useIPFS from "../../../../../shared/utils-IPFS/useIPFS";
import getPhotoIPFS from "../../../../../shared/functions/getPhotoIPFS";

const arePropsEqual = (prevProps, currProps) => {
  return (
    prevProps.message === currProps.message &&
    prevProps.setMessage === currProps.setMessage &&
    prevProps.messages === currProps.messages &&
    prevProps.setMessages === currProps.setMessages &&
    prevProps.podId === currProps.podId &&
    prevProps.chatType === currProps.chatType &&
    prevProps.chatId === currProps.chatId &&
    prevProps.theme === currProps.theme &&
    prevProps.index === currProps.index
  );
};

const MessageDiscordChat = React.memo((props: any) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const userSelector = useSelector((state: RootState) => state.user);
  const usersList = useSelector((state: RootState) => state.usersInfoList);

  let playerVideo: any = useRef();

  const [typeMessage, setTypeMessage] = useState<any>("");
  const [base64File, setBase64File] = useState<any>(null);

  const [showActions, setShowActions] = useState<boolean>(false);

  const [selectedPhoto, setSelectedPhoto] = useState<string>("");
  const [selectedVideo, setSelectedVideo] = useState<string>("");

  const [openGiveTipModal, setOpenGiveTipModal] = useState<boolean>(false);
  const [openModalDiscordPhotoFullScreen, setOpenModalDiscordPhotoFullScreen] = useState<boolean>(false);
  const [openModalDiscordVideoFullScreen, setOpenModalDiscordVideoFullScreen] = useState<boolean>(false);

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  const [imageIPFS, setImageIPFS] = useState<any>(null);

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  const handleOpenGiveTipModal = () => {
    setOpenGiveTipModal(true);
  };
  const handleCloseGiveTipModal = () => {
    setOpenGiveTipModal(false);
  };

  const handleOpenModalDiscordPhotoFullScreen = () => {
    setOpenModalDiscordPhotoFullScreen(true);
  };

  const handleCloseModalDiscordPhotoFullScreen = () => {
    setOpenModalDiscordPhotoFullScreen(false);
  };

  const handleOpenModalDiscordVideoFullScreen = () => {
    setOpenModalDiscordVideoFullScreen(true);
  };

  const handleCloseModalDiscordVideoFullScreen = () => {
    setOpenModalDiscordVideoFullScreen(false);
  };

  const downloadFile = async message => {
    saveAs(base64File, props.message.file.fileName);
  };

  const likeMessage = (message: any) => {
    axios
      .post(`${ServerURL()}/podDiscussion/new/likeMessage`, {
        messageId: message.id,
        userId: userSelector.id,
        podId: props.podId,
        podType: "PIX",
        chatType: props.chatType,
        chatId: props.chatId
      })
      .then(response => {
        if (response.data.success) {
          updateTask(userSelector.id, "Give 1st cred");
          let data = response.data.data;

          let msgs = [...props.messages];
          let msgIndex = msgs.findIndex(msg => msg.id === data.id);
          msgs[msgIndex].likes = data.likes;
          msgs[msgIndex].dislikes = data.dislikes;
          msgs[msgIndex].numLikes = data.numLikes;
          msgs[msgIndex].numDislikes = data.numDislikes;
          props.setMessages(msgs);
          props.setMessage(msgs[msgIndex]);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const dislikeMessage = (message: any) => {
    axios
      .post(`${ServerURL()}/podDiscussion/new/dislikeMessage`, {
        messageId: message.id,
        userId: userSelector.id,
        podId: props.podId,
        podType: "PIX",
        chatType: props.chatType,
        chatId: props.chatId
      })
      .then(response => {
        if (response.data.success) {
          let data = response.data.data;

          let msgs = [...props.messages];
          let msgIndex = msgs.findIndex(msg => msg.id === data.id);
          msgs[msgIndex].likes = data.likes;
          msgs[msgIndex].dislikes = data.dislikes;
          msgs[msgIndex].numLikes = data.numLikes;
          msgs[msgIndex].numDislikes = data.numDislikes;
          props.setMessages(msgs);
          props.setMessage(msgs[msgIndex]);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    if(props.message.from && ipfs  &&
      usersList && usersList.length > 0) {
      getImage(props.message.from);
    }
  }, [props.message.from, usersList, ipfs]);

  useEffect(() => {
    setTypeMessage(props.message.type || 'text');

    let file : any = props.message.file;
    let format : string = "text";
    let type : string = "";
    if(props.message && props.message.type === "photo") {
      type = "image";
      format = "png"
    } else if(props.message && props.message.type === "audio") {
      type = "audio";
      format = "mp3"
    } else if(props.message && props.message.type === "video") {
      type = "video";
      format = "mp4"
    }

    if (props.message && file) {
      let base64String = _arrayBufferToBase64(file.content);
      let imageBase64 : any = "data:" + type + "/" + format + ";base64," + base64String;
      setBase64File(imageBase64);
    }
  }, [props.message.file]);

  const getImage = async (userId: string) => {
    let userFound = usersList.find(user => user.id === userId);

    if(userFound && userFound.infoImage && userFound.infoImage.newFileCID) {
      let imageUrl = await getPhotoIPFS(userFound.infoImage.newFileCID, downloadWithNonDecryption);
      setImageIPFS(imageUrl)
    }
  }

  const Created = ({ message, typeMessage }) => {
    if (props.message.created)
      return (
        <span className="created"
              style={{
                marginTop: typeMessage === "text" ? 0 : "auto",
                margin: typeMessage === "audio" ? "4px 10px 4px 20px" :
                  typeMessage === "text" ? "0px" :
                  typeMessage !== "text" ? "4px 20px" :
                   "auto",
                color: "grey"
              }}>
          {`${new Date(props.message.created).getHours() < 10 ? "0" : ""}${new Date(
          props.message.created
        ).getHours()}:${new Date(props.message.created).getMinutes() < 10 ? "0" : ""}${new Date(
          props.message.created
        ).getMinutes()}
                    `}
          </span>
      );
    else return null;
  };

  return (
    <div className={"podMessageDiscordChatContainer"}>
      {/*props && props.message && props.messages && props.message?.created &&
          props.messages[props.index + 1]?.created &&
          props.message.created - 86400000 <
          props.messages[props.index + 1].created && (
        <div className="messageDate">
          <Moment calendar>{props.message.created}</Moment>
        </div>
      )*/}
      <div
        className={`podMessageDiscordChat ${userSelector.id === props.message.from ? "mine" : "notmine"
        }`}
      >
        <div className={`podMessageRowDiscordChat`}>
          {/* {(props.message.from !== userSelector.id &&
              props.messages[props.index + 1] &&
              props.messages[props.index + 1].from !== props.message.from) ||
              (props.message.from !== userSelector.id && props.index + 1 >= props.messages.length) ? ( */}
          <div
            onClick={() => {
              history.push(`/profile/${props.message.from}`);
              dispatch(setSelectedUser(props.message.from));
            }}
            className="userPhoto"
            style={{
              backgroundImage:
                imageIPFS
                  ? `url(${imageIPFS})`
                  : "none",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          >
            {!props.theme && (
              <span
                className={
                  props.message.user &&
                  props.message.user.connected &&
                  (props.message.user.connected === true ||
                  props.message.user.id === userSelector.id)
                    ? "online"
                    : "offline"
                }
              >
                  ●
                </span>
            )}
          </div>
          <div className="podMessageColumnInfoDiscordChat">
            {(showActions && userSelector.id === props.message.from && props.message.id) ? (
              <div className="actionsRow">
                {props.message.likes &&
                props.message.likes.findIndex(user => user === userSelector.id) !== -1 ? (
                  <div className="podIconCenterFlex">
                    <SvgIcon htmlColor={"green"}>
                      <ThumbsUpSolid />
                    </SvgIcon>
                    &nbsp;{props.message.numLikes || 0}
                  </div>
                ) : (
                  <div className="podIconCenterFlex" onClick={() => likeMessage(props.message)}>
                    <SvgIcon>
                      <ThumbsUpSolid />
                    </SvgIcon>
                    &nbsp;{props.message.numLikes || 0}
                  </div>
                )}
                &nbsp;&nbsp;&nbsp;
                {props.message.dislikes &&
                props.message.dislikes.findIndex(user => user === userSelector.id) !== -1 ? (
                  <div className="podIconCenterFlex">
                    <SvgIcon htmlColor={"red"}>
                      <ThumbsDownSolid />
                    </SvgIcon>
                    &nbsp;{props.message.numDislikes || 0}
                  </div>
                ) : (
                  <div className="podIconCenterFlex" onClick={() => dislikeMessage(props.message)}>
                    <SvgIcon>
                      <ThumbsDownSolid />
                    </SvgIcon>
                    &nbsp;{props.message.numDislikes || 0}
                  </div>
                )}
                {/* &nbsp;&nbsp;&nbsp;
                  <EmojiIcon />
                  &nbsp;&nbsp;&nbsp;
                  {!props.theme && (
                    <div
                      className="podIconCenterFlex"
                      onClick={() => {
                        setSelectedMessage(props.message);
                        handleOpenModalDiscordReply();
                      }}
                    >
                      <MessageIcon />
                      &nbsp;{props.message.numReplies || 0}
                    </div>
                  )}
                  &nbsp;&nbsp;&nbsp;
                  {props.message.from !== userSelector.id ? (
                    <div className="podIconCenterFlex" onClick={handleOpenGiveTipModal}>
                      <img
                        src={require("assets/icons/hand-holding-water-solid.svg")}
                        alt={"hand-holding-water-solid"}
                      />
                    </div>
                  ) : null}
                  {!props.theme && props.message.from !== userSelector.id ? (
                    <GiveTipModal
                      open={openGiveTipModal}
                      handleClose={handleCloseGiveTipModal}
                      recipient={props.message.from}
                      props.theme={props.theme}
                    />
                  ) : null} */}
              </div>
            ) : null}
            <div className={`podMessageInfoDiscordChat`}
              onMouseLeave={() => {
                setShowActions(false);
              }}
              onMouseEnter={() => {
                setShowActions(true);
              }}
            >
              {!typeMessage || typeMessage === "text" ? (
                typeof props.message.message === "string" && (
                  <div className="podMessageInfo bubble">
                    {props.message.message.includes("data:audio/wav;") ? (
                      <audio controls src={JSON.parse(props.message.message)}>
                        The “audio” tag is not supported by your browser. Click [here] to download the sound
                        file.
                      </audio>
                    ) : (
                      props.message.message
                    )}
                    <Created message={props.message}
                             typeMessage={typeMessage} />
                  </div>
                )
              ) : typeMessage === "photo" ? (
                <div className="bubble"
                     style={{padding: 0}}>
                  <div
                    className="messageInfoPhoto"
                    onClick={() => {
                      if(base64File) {
                        setSelectedPhoto(base64File);
                        handleOpenModalDiscordPhotoFullScreen();
                      }
                    }}
                    style={{
                      backgroundImage: props.podId && props.chatId
                        ? `url(${base64File})`
                        : "none",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover"
                    }}
                  ></div>
                  <Created message={props.message}
                           typeMessage={typeMessage} />
                </div>
              ) : typeMessage === "video" ? (
                <div className="bubble"
                     style={{padding: 0}}>
                  <div className="messageInfoVideo">
                    <div className="iconVideoWrapperJarr">
                      <div className="playIconVideoJarr">
                        <SvgIcon>
                          <PlaySolid />
                        </SvgIcon>
                      </div>
                    </div>
                    <ReactPlayer
                      onClick={() => {
                        setSelectedVideo(base64File);
                        handleOpenModalDiscordVideoFullScreen();
                      }}
                      url={base64File}
                      className="react-player"
                      ref={playerVideo}
                      progressInterval={200}
                    />
                  </div>
                  <Created message={props.message}
                           typeMessage={typeMessage} />
                </div>
              ) : typeMessage === "audio" ? (
                <div className="bubble"
                     style={{padding: "4px 10px 0px 10px"}}>
                  <div className="messageInfoAudio">
                    {
                      props.message.file ?
                        <Waveform
                          theme={props.theme}
                          url={base64File}
                          mine={userSelector.id === props.message.from}
                          showTime={false}
                          onPauseFunction={null}
                          onPlayFunction={null}
                          onReadyFunction={null}
                        /> :
                        <p className="noMessagesLabelChat">
                          Loading audio...
                        </p>
                    }
                  </div>
                  <Created message={props.message}
                           typeMessage={typeMessage} />
                </div>
              ) : typeMessage === "file" ? (
                <div className="podMessageInfo bubble"
                     style={{padding: "10px 20px"}}>
                  <div className="item-file">
                    <div className="item-file-name"
                         style={{
                           color: props.message && props.message.file ? "black" : "grey"
                         }}>
                      {
                        props.message && props.message.file &&
                        props.message.file.fileName ?
                          props.message.file.fileName :
                          props.message && props.message.file ? "File" : "Loading File..."
                      }
                    </div>
                    <div onClick={() => {
                            if(props.message && props.message.file) {
                              downloadFile(props.message)
                            }
                          }}
                         className="item-file-icon">
                      <SvgIcon style={{
                        width: 20,
                        height: 20,
                        color: props.message && props.message.file ? "black" : "grey"
                      }}>
                        <DownloadSolid />
                      </SvgIcon>
                    </div>
                  </div>
                  {!props.theme && <Created message={props.message}
                                            typeMessage={typeMessage} />}
                </div>
              ) : null}
            </div>
            {(showActions && userSelector.id !== props.message.from) ? (
              <div className="actionsRow">
                {props.message.likes &&
                props.message.likes.findIndex(user => user === userSelector.id) !== -1 ? (
                  <div className="podIconCenterFlex">
                    <SvgIcon htmlColor={"green"}>
                      <ThumbsUpSolid />
                    </SvgIcon>
                    &nbsp;{props.message.numLikes || 0}
                  </div>
                ) : (
                  <div className="podIconCenterFlex" onClick={() => likeMessage(props.message)}>
                    <SvgIcon>
                      <ThumbsUpSolid />
                    </SvgIcon>
                    &nbsp;{props.message.numLikes || 0}
                  </div>
                )}
                &nbsp;&nbsp;&nbsp;
                {props.message.dislikes &&
                props.message.dislikes.findIndex(user => user === userSelector.id) !== -1 ? (
                  <div className="podIconCenterFlex">
                    <SvgIcon htmlColor={"red"}>
                      <ThumbsDownSolid />
                    </SvgIcon>
                    &nbsp;{props.message.numDislikes || 0}
                  </div>
                ) : (
                  <div className="podIconCenterFlex" onClick={() => dislikeMessage(props.message)}>
                    <SvgIcon>
                      <ThumbsDownSolid />
                    </SvgIcon>
                    &nbsp;{props.message.numDislikes || 0}
                  </div>
                )}
                {/* &nbsp;&nbsp;&nbsp;
                  <EmojiIcon />
                  &nbsp;&nbsp;&nbsp;
                  {!props.theme && (
                    <div
                      className="podIconCenterFlex"
                      onClick={() => {
                        setSelectedMessage(props.message);
                        handleOpenModalDiscordReply();
                      }}
                    >
                      <MessageIcon />
                      &nbsp;{props.message.numReplies || 0}
                    </div>
                  )}
                  &nbsp;&nbsp;&nbsp;
                  {props.message.from !== userSelector.id ? (
                    <div className="podIconCenterFlex" onClick={handleOpenGiveTipModal}>
                      <img
                        src={require("assets/icons/hand-holding-water-solid.svg")}
                        alt={"hand-holding-water-solid"}
                      />
                    </div>
                  ) : null}
                  {!props.theme && props.message.from !== userSelector.id ? (
                    <GiveTipModal
                      open={openGiveTipModal}
                      handleClose={handleCloseGiveTipModal}
                      recipient={props.message.from}
                      props.theme={props.theme}
                    />
                  ) : null} */}
              </div>
            ) : null}
          </div>
        </div>
        <Modal
          showCloseIcon
          size="medium"
          theme={props.theme}
          isOpen={
            openModalDiscordPhotoFullScreen &&
            !!selectedPhoto
          }
          onClose={handleCloseModalDiscordPhotoFullScreen}
        >
          <DiscordPhotoFullScreen
            theme={props.theme}
            onCloseModal={handleCloseModalDiscordPhotoFullScreen}
            url={selectedPhoto}
          />
        </Modal>
        <Modal
          showCloseIcon
          size={"medium"}
          theme={props.theme}
          isOpen={
            openModalDiscordVideoFullScreen &&
            !!selectedVideo
          }
          onClose={handleCloseModalDiscordVideoFullScreen}
        >
          <DiscordVideoFullScreen
            theme={props.theme}
            onCloseModal={handleCloseModalDiscordVideoFullScreen}
            url={selectedVideo}
          />
        </Modal>
      </div>
    </div>
  );
}, arePropsEqual);

export default MessageDiscordChat;
