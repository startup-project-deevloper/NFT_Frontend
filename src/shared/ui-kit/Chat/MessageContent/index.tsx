import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { RootState } from "store/reducers/Reducer";
import { setChat, setMessage } from "store/actions/MessageActions";
import { MessageItem } from "../MessageItem";
import { socket } from "components/Login/Auth";

import { default as ServerURL } from "shared/functions/getURL";
import { RecordingBox } from "shared/ui-kit/RecordingBox";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import EmojiPane from "shared/ui-kit/EmojiPane";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import useIPFS from "../../../utils-IPFS/useIPFS";
import { onUploadNonEncrypt } from "../../../ipfs/upload";

import "./MessageBox.css";

export const MessageFooter = ({ chat, messages, setMessages, specialWidthInput }) => {
  const dispatch = useDispatch();
  const userSelector = useSelector((state: RootState) => state.user);
  const { showAlertMessage } = useAlertMessage();

  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [audioMessage, setAudioMessage] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [mediaBlobUrl, setMediaBlobUrl] = React.useState<any>();
  const emojiRef = useRef<any>();

  const { setMultiAddr, uploadWithNonEncryption } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  const validateFile = file => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/x-icon"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const validateFileVideo = file => {
    const validTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const validateFileAudio = file => {
    const validTypes = ["audio/mp3", "audio/ogg", "audio/wav", "audio/x-m4a", "audio/mpeg"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const handleFiles = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        onChangeMessagePhoto(files[i]);
      } else {
        files[i]["invalid"] = true;
        console.log("No valid file");
        // Alert invalid image
      }
    }
  };

  const handleFilesOthers = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].size / 1024 <= 51200) {
        onChangeMessageOther(files[i]);
      } else {
        showAlertMessage("File too big (< 50Mb)", {
          variant: "error",
        });
      }
    }
  };

  const handleFilesVideo = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].size / 1024 <= 51200) {
        if (validateFileVideo(files[i])) {
          onChangeMessageVideo(files[i]);
          // TODO: have to upload image file here, check Discord.tsx Line 872
        } else {
          files[i]["invalid"] = true;
          // Alert invalid image
          showAlertMessage("Not valid format", {
            variant: "error",
          });
        }
      } else {
        showAlertMessage("File too big (< 50Mb)", {
          variant: "error",
        });
      }
    }
  };

  const handleFilesAudio = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].size / 1024 <= 4096) {
        if (validateFileAudio(files[i])) {
          onChangeMessageAudio(files[i]);
          // TODO: have to upload image file here, check Discord.tsx Line 897
        } else {
          files[i]["invalid"] = true;
          showAlertMessage("Not valid format", {
            variant: "error",
          });
        }
      } else {
        showAlertMessage("File too big (< 50Mb)", {
          variant: "error",
        });
      }
    }
  };

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

            dispatch(setChat(chatObj));
            dispatch(setMessage(msg));

            showAlertMessage("Photo uploaded successfully", {
              variant: "success",
            });
          } else {
            showAlertMessage(response.data.error, {
              variant: "error",
            });
          }
        })
        .catch(error => {
          showAlertMessage("Error uploading photo", {
            variant: "error",
          });
        });
    } catch (error) {
      showAlertMessage("Error uploading photo", {
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

            dispatch(setChat(chatObj));
            dispatch(setMessage(msg));
            showAlertMessage("Audio uploaded successfully", {
              variant: "success",
            });
          } else {
            showAlertMessage(response.data.error, {
              variant: "error",
            });
          }
        })
        .catch(error => {
          showAlertMessage("Error uploading audio", {
            variant: "error",
          });
        });
    } catch (error) {
      showAlertMessage("Error uploading audio", {
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

            dispatch(setChat(chatObj));
            dispatch(setMessage(msg));

            showAlertMessage("File uploaded successfully", {
              variant: "success",
            });
          } else {
            showAlertMessage(response.data, {
              variant: "error",
            });
          }
        })
        .catch(error => {
          showAlertMessage("Error uploading audio", {
            variant: "error",
          });
        });
    } catch (error) {
      showAlertMessage("Error uploading audio", {
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

            dispatch(setChat(chatObj));
            dispatch(setMessage(msg));

            showAlertMessage("Video uploaded successfully", {
              variant: "success",
            });
          } else {
            showAlertMessage(response.data.error, {
              variant: "error",
            });
          }
        })
        .catch(error => {
          showAlertMessage("Error uploading video", {
            variant: "error",
          });
        });
    } catch (error) {
      showAlertMessage("Error uploading video", {
        variant: "error",
      });
    }
  };

  const handleFilesAttachment = files => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith("image")) handleFiles({ 0: files[i], length: 1 });
      else if (files[i].type.startsWith("audio")) handleFilesAudio({ 0: files[i], length: 1 });
      else if (files[i].type.startsWith("video")) handleFilesVideo({ 0: files[i], length: 1 });
      else handleFilesOthers({ 0: files[i], length: 1 });
    }
  };

  const fileInputMessageAttachment = e => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length) {
      handleFilesAttachment(files);
    }
  };

  const uploadAttachment = () => {
    const inputElement = document.createElement("input");
    inputElement.type = "file";
    // inputElement.accept = "audio/*,video/*,image/*";
    inputElement.accept = "*";
    inputElement.multiple = true;

    // set onchange event to call callback when user has selected file
    inputElement.addEventListener("change", fileInputMessageAttachment);

    // dispatch a click event to open the file dialog
    inputElement.dispatchEvent(new MouseEvent("click"));
  };

  const startAudioRecording = () => {
    setAudioMessage(true);
  };

  const deleteVoiceMessage = () => {
    setAudioMessage(false);
  };

  function b64toBlob(dataURI) {
    var byteString = atob(dataURI.split(",")[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
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

      if (socket) {
        socket.emit("add-message", messageObj);
      }
      let messagesCopy = [...messages];
      messagesCopy.push(messageObj);
      setMessages(messagesCopy);

      const chatObj = {
        ...chat,
        lastMessage: messageObj.message,
        lastMessageDate: messageObj.created,
        messages: messagesCopy,
      };

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
      style={specialWidthInput ? { width: "calc(100% - 30px)" } : { width: "100%" }}
    >
      {!audioMessage && (
        <>
          {/*<img
            src={require("assets/mediaIcons/old/audio_live.png")}
            alt={"Record your voice"}
            onClick={startAudioRecording}
            className="audio-icon"
          />*/}
          <img
            className="attachment-icon"
            src={require("assets/icons/attachment_icon.svg")}
            alt="Attachment"
            onClick={uploadAttachment}
          />
          <img
            src={require("assets/icons/emoji_icon.svg")}
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
        />
      )}

      {!audioMessage && (
        <div className="send-icon" onClick={() => sendMessage()}>
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
  chatsUsers,
  messages,
  setMessages,
  specialWidthInput,
  getMessages,
  loadingMessages,
}) => {
  const userSelector = useSelector((state: RootState) => state.user);
  const usersInfo = useSelector((state: RootState) => state.usersInfoList);
  const [newChat, setNewChat] = React.useState(null);
  const [paginationLoading, setPaginationLoading] = React.useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(messages.length > 0);

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
    });
  }, [chat, usersInfo]);

  const handleScroll = React.useCallback(
    async e => {
      if (e.target.scrollTop === 0 && hasMore) {
        const lastMsgID = messages.length > 0 ? messages[0].id : null;
        setPaginationLoading(true);
        const count = await getMessages();
        setHasMore(count > 0);
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
                key={item.id ?? `message-${index}`}
                user={
                  chat.users.userFrom.userId === userSelector.id ? chat.users.userTo : chat.users.userFrom
                }
                message={item}
                mediaOnCommunity={false}
              />
            ))}
        </div>
        <MessageFooter
          chat={chat}
          messages={messages}
          specialWidthInput={specialWidthInput}
          setMessages={msgs => setMessages(msgs)}
        />
      </div>
    );
  else return <div className="message-empty">Select a contact to chat</div>;
};
