import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Box } from "@material-ui/core";

import { socket } from "components/Login/Auth";
import { PixMessageProfile } from "./PixMessageProfile";
import { MessageList } from "./MessageList";
import { MessageContent } from "./MessageContent";
import { MessageProfile } from "./MessageProfile";

import { RootState } from "store/reducers/Reducer";
import { openMessageBox, sentMessage } from "store/actions/MessageActions";
import { getMessageBox } from "store/selectors/user";

import URL from "shared/functions/getURL";
import useWindowDimensions from "shared/hooks/useWindowDimensions";

import "./MessageBox.css";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";

export const MessageBox = ({ type = "social" }) => {
  const dispatch = useDispatch();

  const userSelector = useSelector((state: RootState) => state.user);
  const messageBoxInfo = useSelector(getMessageBox);
  const { isOpenMessageBox, isSendMessage, message, chat: messageBoxChat } = messageBoxInfo;

  const [chats, setChats] = useState<any[]>([]);
  const [chatsUsers, setChatsUsers] = useState<any>({});
  const [chat, setChat] = useState<any>({});
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const width = useWindowDimensions().width;
  const [mobileShowRoom, setMobileShowRoom] = useState<boolean>(false);

  const userInfo = React.useMemo(() => {
    if (chat && userSelector) {
      if (chat.users?.userFrom?.userId === userSelector.id) {
        return chat.users?.userTo;
      }
      return chat.users?.userFrom;
    }

    return null;
  }, [chat, useSelector]);

  useEffect(() => {
    if (chat && chat.room && socket) {
      socket.off("message");
      socket.on("message", message => {
        setMessages(msgs => {
          let msgsArray = [...msgs];
          msgsArray.push(message);
          return msgsArray;
        });

        /*if (endMessage && endMessage.current) {
          endMessage.current.scrollIntoView();
        }*/

        let chatObj = {
          room: chat.room,
          userId: userSelector.id,
          lastView: Date.now(),
        };

        axios
          .post(`${URL()}/chat/lastView`, chatObj)
          .then(response => {
            if (response.data.success) {
              let id;
              if (chatsUsers["userTo"].userId === userSelector.id) {
                id = chatsUsers["userTo"].userId;
              } else if (chatsUsers["userFrom"].userId === userSelector.id) {
                id = chatsUsers["userFrom"].userId;
              }

              socket.emit("numberMessages", id);
            }
          })
          .catch(error => {
            console.log(error);
          });
      });
    }
  }, [chat, socket]);

  useEffect(() => {
    //this opens message box when navigating to /social/:id/messages
    if (!isOpenMessageBox) {
      if (!message) {
        dispatch(openMessageBox(true));
      }
    }
  }, []);

  useEffect(() => {
    setPageIndex(messages.length);
  }, [messages]);

  useEffect(() => {
    if (isSendMessage === true) {
      const newChats = chats.map(item => {
        if (
          item.room === messageBoxChat.room ||
          (item.users?.userFrom?.userId === messageBoxChat.users?.userFrom?.userId &&
            item.users?.userTo?.userId === messageBoxChat.users?.userTo?.userId)
        ) {
          return messageBoxChat;
        }
        return item;
      });
      setChats(newChats);

      // If currently selected chat in the profile message is same as the chatmodal
      if (
        chat.room === messageBoxChat.room ||
        (chat.users?.userFrom?.userId === messageBoxChat.users?.userFrom?.userId &&
          chat.users?.userTo?.userId === messageBoxChat.users?.userTo?.userId)
      ) {
        setChat(messageBoxChat);
        setMessages(messageBoxChat.messages);
      }
      dispatch(sentMessage());
    }
  }, [isSendMessage]);

  const beforeCreateChat = (chat: any) => {
    let differentUser;
    if (
      chat &&
      chat.users &&
      chat.users.userFrom &&
      chat.users.userFrom.userId &&
      chat.users.userFrom.userId !== userSelector.id
    ) {
      differentUser = chat.users.userFrom;
    } else if (
      chat &&
      chat.users &&
      chat.users.userTo &&
      chat.users.userTo.userId &&
      chat.users.userTo.userId !== userSelector.id
    ) {
      differentUser = chat.users.userTo;
    }

    if (differentUser) {
      createChat(differentUser);
    }
  };

  const createChat = (user: any) => {
    let users: any = {
      userFrom: {
        userId: userSelector.id,
        userName: userSelector.firstName,
        userConnected: true,
        lastView: new Date(),
      },
      userTo: {
        userId: user.userId,
        userName: user.userName,
        userConnected: false,
        lastView: null,
      },
    };

    setChatsUsers(users);
    axios
      .post(`${URL()}/chat/newChat`, { users: users })
      .then(async response => {
        if (response.data.success) {
          setChat(response.data.data);
          setMessages([]);
          await getMessages(response.data.data, true);
          socket.emit("subscribe", users);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getMessages = (chatInfo?: any, isNew?: boolean): Promise<number> => {
    return new Promise((resolve, reject) => {
      if (!isNew && (loadingMessages || !hasMore)) {
        resolve(0);
        return;
      }
      setLoadingMessages(true);
      axios
        .post(`${URL()}/chat/getMessages`, {
          room: chatInfo ? chatInfo.room : chat.room,
          pageIndex: isNew ? 0 : pageIndex,
        })
        .then(response => {
          if (response.data.success) {
            let newMessages = response.data.data;
            if (!isNew) {
              newMessages = [...response.data.data, ...messages];
            }
            setMessages(newMessages);
            setHasMore(response.data.hasMore);
            setLoadingMessages(false);
            resolve(response.data.data.length);
          }
        })
        .catch(error => {
          setLoadingMessages(false);
          reject(error);
          console.log(error);
        });
    });
  };

  const handleSetChat = newChat => {
    setChat(newChat);
    setMessages(newChat.messages);
    const newChats = chats.map(item => {
      if (
        item.room === newChat.room ||
        (item.users?.userFrom?.userId === newChat.users?.userFrom?.userId &&
          item.users?.userTo?.userId === newChat.users?.userTo?.userId)
      ) {
        return newChat;
      }
      return item;
    });
    setChats(newChats);
  };

  return (
    <div className={`message-box ${type !== "social" ? "pix" : ""}`}>
      <div className={"message-list"}>
        <MessageList
          chats={chats}
          createChat={cht => {
            beforeCreateChat(cht);
            setMobileShowRoom(true);
          }}
          setChats={setChats}
          type={type}
        />
      </div>
      <div className={"message-content" + (width < 766 ? " mobile" : "") + (mobileShowRoom ? "" : " none")}>
        {width < 766 && setMobileShowRoom && (
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            borderBottom="1px solid rgb(112, 117, 130, 0.1)"
            pb={3}
          >
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box
                onClick={() => {
                  setMobileShowRoom(false);
                }}
                mr={2}
              >
                <img src={require("assets/icons/back.png")} alt="back" />
              </Box>
              <img src={userInfo?.userFoto ?? getDefaultAvatar} className="message-profile-avatar" />
              <Box display="flex" flexDirection="column" ml={2}>
                <div className="name">{userInfo?.name}</div>
                <div className="slug-container">
                  {userInfo?.urlSlug ? <div className="slug-name">@{userInfo.urlSlug}</div> : null}
                </div>
              </Box>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center" className={"profile-actions"}>
              {/* <img src={require("assets/icons/minimize.svg")} alt="minimize" /> */}
              <img
                src={require("assets/icons/close.svg")}
                alt="close"
                onClick={() => {
                  setMobileShowRoom(false);
                }}
              />
            </Box>
          </Box>
        )}
        <MessageContent
          chat={chat}
          setChat={handleSetChat}
          specialWidthInput={true}
          messages={messages}
          setMessages={msgs => setMessages(msgs)}
          getMessages={getMessages}
          loadingMessages={loadingMessages}
          type={type}
        />
      </div>
      {width >= 1300 && (
        <div className="message-profile">
          {type === "pix" || type === "trax" ? (
            <PixMessageProfile chat={chat} type={type} />
          ) : (
            <MessageProfile chat={chat}/>
          )}
        </div>
      )}
    </div>
  );
};
