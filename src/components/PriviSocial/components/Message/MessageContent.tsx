import React, { useEffect, useState, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { MessageItem } from "./MessageItem";
import "./MessageBox.css";
import { setChat, setMessage } from "store/actions/MessageActions";
import axios from "axios";
import { default as ServerURL } from "shared/functions/getURL";
import { RecordingBox } from "shared/ui-kit/RecordingBox";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import EmojiPane from "shared/ui-kit/EmojiPane";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { socket } from "components/Login/Auth";
import FileAttachment, { FileType } from "shared/ui-kit/FileAttachment";
import { Gradient } from "shared/ui-kit";
import useIPFS from "../../../../shared/utils-IPFS/useIPFS";
import {onUploadNonEncrypt} from "../../../../shared/ipfs/upload";

export const MessageFooter = props => {
  const { chat, messages, setMessages, specialWidthInput, type = "social" } = props;
  const dispatch = useDispatch();
  const userSelector = useSelector((state: RootState) => state.user);
  const [showEmoji, setShowEmoji] = useState<boolean>(false);

  const [audioMessage, setAudioMessage] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [mediaBlobUrl, setMediaBlobUrl] = React.useState<any>();
  const [status, setStatus] = useState<any>("");
  const emojiRef = useRef<any>();

  const { ipfs, setMultiAddr, uploadWithNonEncryption } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  const onChangeMessagePhoto = async (file: any) => {
    try {
      let from: string = "";
      let to: string = "";
      if (userSelector.id === chat.users.userFrom.userId) {
        from = chat.users.userFrom.userId;
        to = chat.users.userTo.userId;
      } else {
        from = chat.users.userTo.userId;
        to = chat.users.userFrom.userId;
      }

      let infoImage = await onUploadNonEncrypt(file, file => uploadWithNonEncryption(file));

      axios
        .post(`${ServerURL()}/chat/addMessagePhoto/${chat.room}/${from}/${to}`, infoImage)
        .then(response => {
          if (response.data && response.data.success) {
            let msg: any = response.data.data;

            msg.noAddMessage = true;
            socket.emit("add-message", msg);

            let messagesCopy = [...messages];
            messagesCopy.push(msg);
            setMessages(messagesCopy);

            const chatObj = {
              ...chat,
              lastMessage: msg.type,
              lastMessageDate: msg.created,
              messages: messagesCopy,
            };
            if (props.setChat) {
              props.setChat(chatObj);
            }

            dispatch(setChat(chatObj));
            dispatch(setMessage(msg));

            setStatus({
              msg: "Photo uploaded successfully",
              key: Math.random(),
              variant: "success",
            });
          } else {
            console.log(response.data);
            setStatus({
              msg: response.data.error,
              key: Math.random(),
              variant: "error",
            });
          }
        })
        .catch(error => {
          console.log(error);
          setStatus({
            msg: "Error uploading photo",
            key: Math.random(),
            variant: "error",
          });
        });
    } catch (error) {
      console.log(error);
      setStatus({
        msg: "Error uploading photo",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  const onChangeMessageAudio = async (file: any) => {
    try {
      let from: string = "";
      let to: string = "";
      if (userSelector.id === chat.users.userFrom.userId) {
        from = chat.users.userFrom.userId;
        to = chat.users.userTo.userId;
      } else {
        from = chat.users.userTo.userId;
        to = chat.users.userFrom.userId;
      }

      let infoImage = await onUploadNonEncrypt(file, file => uploadWithNonEncryption(file));

      axios
        .post(`${ServerURL()}/chat/addMessageAudio/${chat.room}/${from}/${to}`, infoImage)
        .then(response => {
          if (response.data && response.data.success) {
            let msg: any = response.data.data;

            msg.noAddMessage = true;
            socket.emit("add-message", msg);

            let messagesCopy = [...messages];
            messagesCopy.push(msg);
            setMessages(messagesCopy);

            const chatObj = {
              ...chat,
              lastMessage: msg.type,
              lastMessageDate: msg.created,
              messages: messagesCopy,
            };
            if (props.setChat) {
              props.setChat(chatObj);
            }

            dispatch(setChat(chatObj));
            dispatch(setMessage(msg));

            setStatus({
              msg: "Audio uploaded successfully",
              key: Math.random(),
              variant: "success",
            });
          } else {
            console.log(response.data);
            setStatus({
              msg: response.data.error,
              key: Math.random(),
              variant: "error",
            });
          }
        })
        .catch(error => {
          console.log(error);
          setStatus({
            msg: "Error uploading audio",
            key: Math.random(),
            variant: "error",
          });
        });
    } catch (error) {
      console.log(error);
      setStatus({
        msg: "Error uploading audio",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  const onChangeMessageOther = async (file: any) => {
    try {
      let from: string = "";
      let to: string = "";
      if (userSelector.id === chat.users.userFrom.userId) {
        from = chat.users.userFrom.userId;
        to = chat.users.userTo.userId;
      } else {
        from = chat.users.userTo.userId;
        to = chat.users.userFrom.userId;
      }

      let infoImage = await onUploadNonEncrypt(file, file => uploadWithNonEncryption(file));

      axios
        .post(`${ServerURL()}/chat/addMessageFile/${chat.room}/${from}/${to}`, infoImage)
        .then(response => {
          if (response.data && response.data.success) {
            let msg: any = response.data.data;

            msg.noAddMessage = true;
            socket.emit("add-message", msg);

            let messagesCopy = [...messages];
            messagesCopy.push(msg);
            setMessages(messagesCopy);

            const chatObj = {
              ...chat,
              lastMessage: msg.type,
              lastMessageDate: msg.created,
              messages: messagesCopy,
            };
            if (props.setChat) {
              props.setChat(chatObj);
            }

            dispatch(setChat(chatObj));
            dispatch(setMessage(msg));

            setStatus({
              msg: "File uploaded successfully",
              key: Math.random(),
              variant: "success",
            });
          } else {
            console.log(response.data);
            setStatus({
              msg: response.data.error,
              key: Math.random(),
              variant: "error",
            });
          }
        })
        .catch(error => {
          console.log(error);
          setStatus({
            msg: "Error uploading file",
            key: Math.random(),
            variant: "error",
          });
        });
    } catch (error) {
      console.log(error);
      setStatus({
        msg: "Error uploading file",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  const onChangeMessageVideo = async (file: any) => {
    try {
      let from: string = "";
      let to: string = "";
      if (userSelector.id === chat.users.userFrom.userId) {
        from = chat.users.userFrom.userId;
        to = chat.users.userTo.userId;
      } else {
        from = chat.users.userTo.userId;
        to = chat.users.userFrom.userId;
      }

      let infoImage = await onUploadNonEncrypt(file, file => uploadWithNonEncryption(file));

      axios
        .post(`${ServerURL()}/chat/addMessageVideo/${chat.room}/${from}/${to}`, infoImage)
        .then(response => {
          if (response.data && response.data.success) {
            let msg: any = response.data.data;

            msg.noAddMessage = true;
            socket.emit("add-message", msg);

            let messagesCopy = [...messages];
            messagesCopy.push(msg);
            setMessages(messagesCopy);

            const chatObj = {
              ...chat,
              lastMessage: msg.type,
              lastMessageDate: msg.created,
              messages: messagesCopy,
            };
            if (props.setChat) {
              props.setChat(chatObj);
            }

            dispatch(setChat(chatObj));
            dispatch(setMessage(msg));

            setStatus({
              msg: "Video uploaded successfully",
              key: Math.random(),
              variant: "success",
            });
          } else {
            console.log(response.data);
            setStatus({
              msg: response.data.error,
              key: Math.random(),
              variant: "error",
            });
          }
        })
        .catch(error => {
          console.log(error);
          setStatus({
            msg: "Error uploading video",
            key: Math.random(),
            variant: "error",
          });
        });
    } catch (error) {
      console.log(error);
      setStatus({
        msg: "Error uploading video",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  const onFileChange = (file: any, type: FileType) => {
    switch (type) {
      case FileType.AUDIO:
        onChangeMessageAudio(file);
        break;
      case FileType.IMAGE:
        onChangeMessagePhoto(file);
        break;
      case FileType.VIDEO:
        onChangeMessageVideo(file);
        break;

      default:
        onChangeMessageOther(file);
        break;
    }
  };

  const startAudioRecording = () => {
    setAudioMessage(true);
  };

  const deleteVoiceMessage = () => {
    setAudioMessage(false);
  };

  function b64toBlob(dataURI) {
    let byteString = atob(dataURI.split(",")[1]);
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/jpeg" });
  }

  const sendVoiceMessage = async () => {
    if (mediaBlobUrl) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = "blob";

      xhr.onload = function () {
        var recoveredBlob = xhr.response;

        var reader = new FileReader();

        reader.onload = async function () {
          const blobAsDefaultURL = reader.result;
          if (blobAsDefaultURL) {
            onChangeMessageAudio(b64toBlob(blobAsDefaultURL));
            setAudioMessage(false);
          }
        };

        reader.readAsDataURL(recoveredBlob);
      };

      xhr.open("GET", mediaBlobUrl);
      xhr.send();
    }
  };

  const sendMessage = (audioMsg?: string) => {
    if (msg || audioMsg) {
      setAudioMessage(false);
      let messageObj: any = {};
      if (userSelector.id === chat.users.userFrom.userId) {
        messageObj = {
          room: chat.room,
          message: msg || audioMsg,
          from: chat.users.userFrom.userId,
          to: chat.users.userTo.userId,
          created: Date.now(),
          seen: false,
        };
      } else {
        messageObj = {
          room: chat.room,
          message: msg || audioMsg,
          from: chat.users.userTo.userId,
          to: chat.users.userFrom.userId,
          created: Date.now(),
          seen: false,
        };
      }

      socket.emit("add-message", messageObj);
      let messagesCopy = [...messages];
      messagesCopy.push(messageObj);
      setMessages(messagesCopy);

      const chatObj = {
        ...chat,
        lastMessage: messageObj.message,
        lastMessageDate: messageObj.created,
        messages: messagesCopy,
      };
      if (props.setChat) {
        props.setChat(chatObj);
      }

      dispatch(setChat(chatObj));
      dispatch(setMessage(msg));
      setMsg("");
    }
  };

  const toggleEmojiPicker = () => {
    setShowEmoji(!showEmoji);
  };

  const addEmoji = (e, emojiObject) => {
    let emoji = emojiObject.emoji;
    setMsg(msg + emoji);
    setShowEmoji(false);
  };

  return (
    <div
      className="message-footer"
      style={specialWidthInput ? { width: "calc(100% - 40px)" } : { width: "100%" }}
    >
      {!audioMessage && (
        <>
          <FileAttachment setStatus={setStatus}
                          onFileChange={onFileChange} />
          <img
            src={require("assets/icons/pix_emoji_icon.svg")}
            className="emoji-icon"
            onClick={toggleEmojiPicker}
            ref={emojiRef}
          />
          {showEmoji && (
            <EmojiPane
              open={showEmoji}
              anchorEl={emojiRef.current}
              handleClose={() => setShowEmoji(false)}
              addEmoji={addEmoji}
            />
          )}
        </>
      )}
      {!audioMessage && (
        <InputWithLabelAndTooltip
          overriedClasses="input"
          inputValue={msg}
          placeHolder="Message"
          type="text"
          onInputValueChange={e => setMsg(e.target.value)}
          onKeyDown={e => {
            e.key === "Enter" && sendMessage();
          }}
          style={{ border: "1px solid #181818" }}
        />
      )}

      {!audioMessage && (
        <div className="send-icon"
             onClick={() => sendMessage()}>
          <img src={require("assets/icons/send_icon.svg")} />
        </div>
      )}
      {audioMessage && (
        <RecordingBox
          specialWidthInput={specialWidthInput}
          deleteVoiceMessage={deleteVoiceMessage}
          sendVoiceMessage={sendVoiceMessage}
          setMediaBlobUrl={setMediaBlobUrl}
        />
      )}
    </div>
  );
};

export const MessageContent = ({
  chat,
  messages,
  setMessages,
  specialWidthInput,
  getMessages,
  loadingMessages,
  type = "social",
  setChat,
}) => {
  const userSelector = useSelector((state: RootState) => state.user);
  const usersInfo = useSelector((state: RootState) => state.usersInfoList);
  const [newChat, setNewChat] = React.useState(null);
  const [paginationLoading, setPaginationLoading] = React.useState<boolean>(false);

  const itemListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (itemListRef && itemListRef.current && !paginationLoading)
      itemListRef.current.scrollTop = itemListRef.current.scrollHeight;
    setPaginationLoading(false);
  }, [messages]);

  useEffect(() => {
    let otherUserId = null;
    if (chat.users && chat.users.userFrom && chat.users.userFrom.userId === userSelector.id) {
      otherUserId = chat.users.userTo.userId;
    } else if (chat.users && chat.users.userTo && chat.users.userTo.userId === userSelector.id) {
      otherUserId = chat.users.userFrom.userId;
    }
    let fIndex = usersInfo.findIndex(user => user.id === otherUserId);
    if (fIndex < 0) return;
    setNewChat({
      ...chat,
      userInfo: usersInfo[fIndex],
    });
  }, [chat, usersInfo]);

  const handleScroll = React.useCallback(
    async e => {
      if (e.target.scrollTop === 0 && messages.length > 0) {
        const lastMsgID = messages.length > 0 ? messages[0].id : null;
        setPaginationLoading(true);
        const count = await getMessages();
        if (count === 0) {
          setPaginationLoading(false);
        }
        if (lastMsgID) {
          const el = document.getElementById(lastMsgID);
          const itemList = document.getElementById("messageContainer");
          if (itemListRef && itemListRef.current && el && itemList) {
            itemListRef.current.scrollTop = Math.max(
              0,
              el.getBoundingClientRect().y - itemList.getBoundingClientRect().y - 90
            );
          }
        }
      }
    },
    [getMessages]
  );

  if (chat.room)
    return (
      <div className="item-list-container" id="messageContainer" ref={itemListRef} onScroll={handleScroll}>
        <LoadingWrapper loading={loadingMessages} />
        <div className="item-list">
          {messages &&
            messages.map((item, index) => (
              <MessageItem
                key={index}
                user={
                  item.users && item.users.userFrom && item.users.userFrom.userId
                    ? item.users.userFrom.userId === userSelector.id
                      ? item.users.userTo
                      : item.users.userFrom
                    : null
                }
                message={item}
                chat={newChat}
                mediaOnCommunity={false}
                type={type}
              />
            ))}
        </div>
        <MessageFooter
          chat={chat}
          setChat={setChat}
          messages={messages}
          specialWidthInput={specialWidthInput}
          setMessages={msgs => setMessages(msgs)}
          type={type}
        />
      </div>
    );
  else return <div className="message-empty">Select a contact to chat</div>;
};
