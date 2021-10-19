import React, { useState, useEffect } from "react";
import { MessageList } from "./MessageList";
import { MessageContent } from "./MessageContent";
import axios from "axios";
import io from "socket.io-client";
import URL from "shared/functions/getURL";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { openMessageBox, sentMessage } from "store/actions/MessageActions";
import { getMessageBox } from "store/selectors/user";
import "./MessageBox.css";
import { socket, setSocket } from "components/Login/Auth";
import { PixMessageProfile } from "./PixMessageProfile";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import { Box } from "@material-ui/core";

export const MessageBox = ({ type = "social" }) => {
  const dispatch = useDispatch();

  const userSelector = useSelector((state: RootState) => state.user);
  const usersInfo = useSelector((state: RootState) => state.usersInfoList);
  const messageBoxInfo = useSelector(getMessageBox);
  const { isOpenMessageBox, userInfo, isSendMessage, message, chat: messageBoxChat } = messageBoxInfo;

  const [chats, setChats] = useState<any[]>([]);
  const [chatsUsers, setChatsUsers] = useState<any>({});
  const [chat, setChat] = useState<any>({});
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const width = useWindowDimensions().width;
  const [mobileShowRoom, setMobileShowRoom] = useState<boolean>(false);

  useEffect(() => {
    if (!socket && localStorage.getItem("userId")) {
      const sock = io(URL(), {
        query: { token: localStorage.getItem("token")?.toString() || "" },
        transports: ["websocket"],
      });
      sock.connect();
      setSocket(sock);
      sock.emit("add user", localStorage.getItem("userId")?.toString() || "");
    }
  }, []);

  useEffect(() => {
    if (chat && chat.room && socket) {
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
      if (!message && userInfo) {
        let user = usersInfo[usersInfo.findIndex(user => user.id === userInfo.id)];
        dispatch(openMessageBox(user));
      }
    }
  }, [usersInfo]);

  useEffect(() => {
    //this loads the chat when opening the messagebox through the header menu
    if (Object.keys(chat).length <= 0 || messages.length <= 0) {
      if (chats && chats.length > 0 && userInfo) {
        let openedChat = chats.find(chat => chat.users.userTo.userId === userInfo.id);
        beforeCreateChat(openedChat);
      }
    }
  }, [chats]);

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
    let differentUser: string = "";
    if (
      chat &&
      chat.users &&
      chat.users.userFrom &&
      chat.users.userFrom.userId &&
      chat.users.userFrom.userId !== userSelector.id
    ) {
      differentUser = chat.users.userFrom.userId;
    } else if (
      chat &&
      chat.users &&
      chat.users.userTo &&
      chat.users.userTo.userId &&
      chat.users.userTo.userId !== userSelector.id
    ) {
      differentUser = chat.users.userTo.userId;
    }
    let differentUserInfo = usersInfo.find(user => user.id === differentUser);
    if (differentUserInfo) {
      createChat(differentUserInfo);
    }
  };

  const createChat = (user: any) => {
    let users: any = {
      userFrom: {
        userId: userSelector.id,
        userName: userSelector.firstName,
        userFoto: userSelector.anon
          ? userSelector.anonAvatar && userSelector.anonAvatar.length > 0
            ? `${require(`assets/anonAvatars/${userSelector.anonAvatar}`)}`
            : `${require(`assets/anonAvatars/ToyFaces_Colored_BG_111.jpg`)}`
          : userSelector.hasPhoto
          ? `${URL()}/user/getPhoto/${userSelector.id}`
          : "",
        userConnected: true,
        lastView: new Date(),
      },
      userTo: {
        userId: user.id,
        userName: user.name,
        userFoto: user.anon
          ? user.anonAvatar && user.anonAvatar.length > 0
            ? `${require(`assets/anonAvatars/${user.anonAvatar}`)}`
            : `${require(`assets/anonAvatars/ToyFaces_Colored_BG_111.jpg`)}`
          : user.hasPhoto
          ? `${URL()}/user/getPhoto/${user.id}`
          : "",
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
    <div className={`message-box pix`}>
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
              <img
                src={
                  userInfo && userInfo.url
                    ? userInfo.url
                    : require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")
                }
                className="message-profile-avatar"
              />
              <Box display="flex" flexDirection="column" ml={2}>
                <div className="name">{userInfo && userInfo.name}</div>
                <div className="slug-container">
                  {userInfo && userInfo.urlSlug ? (
                    <div className="slug-name">@{userInfo && userInfo.urlSlug ? userInfo.urlSlug : ""}</div>
                  ) : null}
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
          <PixMessageProfile chat={chat} type={type} />
        </div>
      )}
    </div>
  );
};
