import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, makeStyles } from "@material-ui/core";

import { endChat, updateChat } from "store/actions/MessageActions";
import { RootState } from "store/reducers/Reducer";
import { MessageItem } from "./MessageItem";
import { socket } from "components/Login/Auth";
import { MessageFooter } from "./MessageContent";

import URL from "shared/functions/getURL";
import { useMessages } from "shared/contexts/MessagesContext";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

const useStyles = makeStyles({
  container: {
    backgroundColor: "white",
    boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: "14px 14px 0px 0px",
    width: 352,
    padding: "23.5px 23.5px 5px 23.5px",
    margin: "0px 8px",
    marginTop: "auto",
    height: "fitContent",
  },
  header: {
    borderRadius: "14px 14px 0px 0px",
    borderBottom: "1px solid #181818",
    display: "flex",
    justifyContent: "space-between",
    paddingBottom: 10,
    cursor: "pointer",
  },
  chatInfo: {
    display: "flex",
    position: "relative",
    "& > img": {
      width: 32,
      height: 32,
      borderRadius: "50%",
      marginRight: 10,
      objectFit: "cover",
    },
    "& > span": {
      "&.online": {
        background: "linear-gradient(97.4deg, #23d0c6 14.43%, #00cc8f 85.96%)",
      },
      position: "absolute",
      width: "15px",
      height: "15px",
      borderRadius: "50%",
      border: "2px solid #ffffff",
      marginLeft: "28px",
      marginTop: "28px",
    },
  },
  actionBtns: {
    display: "flex",
    alignItems: "center",
    "& img:first-child": {
      marginRight: 24,
      cursor: "pointer",
    },
  },
  user: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    justifyContent: "center",
    marginLeft: 8,
  },
  userName: {
    fontSize: 14,
    lineHeight: "104.5%",
    color: "black",
  },
  userSlug: {
    fontSize: 11,
    lineHeight: "104.5%",
    color: "#707582",
  },
  chatContent: {
    position: "relative",
    height: 379,
  },
  chats: {
    height: "calc(100% - 60px)",
    "& .item-list": {
      height: "100%",
      overflow: "scroll",
      position: "relative",
      "& .right-item": {
        display: "flex",
        justifyContent: "flex-end",
        margin: "4px 0px",
        "& .item-content": {
          border: "1px solid #EFF2F8",
          borderRadius: "10px",
          color: "#707582",
          fontSize: "14px",
          padding: "13px 11px 14px 12px",
          wordWrap: "break-word",
          maxWidth: "80%",
        },
      },
      "& .left-item": {
        display: "flex",
        justifyContent: "flex-start",
        margin: "4px 0px",
        "& .avatar-container": {
          marginRight: "10px",
        },
        "& .item-content": {
          backgroundColor: "#EFF2F8",
          borderRadius: "10px",
          color: "#707582",
          fontSize: "14px",
          padding: "13px 11px 14px 12px",
          wordWrap: "break-word",
          maxWidth: "calc(80% - 10px)",
        },
      },
    },
  },
});

const ChatModal = ({ chat }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const userSelector = useSelector((state: RootState) => state.user);
  const { setNumberMessages } = useMessages();
  const [chatUsers, setChatUsers] = React.useState([]);

  const [minimize, setMinimize] = useState<boolean>(true);

  const [messages, setMessages] = useState<any[]>([]);
  const [messagesCharged, setMessagesCharged] = useState<boolean>(true);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [paginationLoading, setPaginationLoading] = React.useState<boolean>(false);

  const differentUser = React.useMemo(
    () => (chat.users.userFrom.userId === userSelector.id ? chat.users.userTo : chat.users.userFrom),
    [chat, userSelector]
  );

  const itemListRef = useRef<HTMLDivElement>(null);
  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMinimize(!minimize);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(
      endChat({
        receipientId: chat.receipientId,
      })
    );
  };

  useEffect(() => {
    setPageIndex(messages.length);
    if (itemListRef && itemListRef.current && !paginationLoading)
      itemListRef.current.scrollTop = itemListRef.current.scrollHeight;
    setPaginationLoading(false);
  }, [messages]);

  useEffect(() => {
    const updateMessageLastView = () => {
      const chatObj = {
        room: chat.room,
        userId: userSelector.id,
        lastView: Date.now(),
      };

      axios
        .post(`${URL()}/chat/lastView`, chatObj)
        .then(response => {
          if (response.data.success && response.data.numberMessages) {
            setNumberMessages(response.data.numberMessages);
          }
        })
        .catch(error => {
          console.log(error);
        });
    };

    if (chat && chat.room) {
      socket.on("message", message => {
        setMessages(msgs => {
          let msgsArray = [...msgs];
          msgsArray.push(message);
          return msgsArray;
        });

        if (chatUsers["userTo"] && chatUsers["userTo"].userId === message.from) {
          updateMessageLastView();
        }
      });
      updateMessageLastView();
    }
  }, [chat]);

  useEffect(() => {
    if (chat) {
      createChat();
    }
  }, []);

  const createChat = () => {
    let users: any = {
      userFrom: {
        userId: userSelector.id,
        userName: userSelector.firstName,
        userConnected: true,
        lastView: new Date(),
      },
      userTo: {
        userId: differentUser.userId,
        userName: differentUser.userName,
        userConnected: false,
        lastView: null,
      },
    };
    setChatUsers(users);

    axios
      .post(`${URL()}/chat/newChat`, { users: users })
      .then(async response => {
        if (response.data.success) {
          dispatch(
            updateChat({
              chat: {
                ...response.data.data,
                receipientId: chat.receipientId,
              },
            })
          );

          //setShowHomeChat(1);
          await getMessages(response.data.data);
          socket.emit("subscribe", users);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getMessages = (chatInfo?: any): Promise<number> => {
    return new Promise((resolve, reject) => {
      if (!hasMore || !messagesCharged) {
        resolve(0);
        return;
      }
      setMessagesCharged(false);
      axios
        .post(`${URL()}/chat/getMessages`, { room: chatInfo ? chatInfo.room : chat.room, pageIndex })
        .then(response => {
          if (response.data.success) {
            setMessages([...response.data.data, ...messages]);
            setHasMore(response.data.hasMore);
            resolve(response.data.data.length);
          }
        })
        .catch(error => {
          reject(error);
          console.log(error);
        })
        .finally(() => {
          setMessagesCharged(true);
        });
    });
  };

  const handleScroll = React.useCallback(
    async e => {
      if (e.target.scrollTop === 0 && hasMore) {
        const lastMsgID = messages.length > 0 ? messages[0].id : null;
        setPaginationLoading(true);
        const count = await getMessages();
        if (count === 0) {
          setPaginationLoading(false);
        }
        if (lastMsgID) {
          const el = document.getElementById(lastMsgID);
          const itemList = document.getElementById("chatItemList");
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

  return (
    <div className={classes.container} style={{ display: chat.hidden ? "none" : "inline-block" }}>
      <div className={classes.header} onClick={handleMinimize}>
        <div className={classes.chatInfo}>
          <Avatar src={differentUser.ipfsImage ? differentUser.ipfsImage : ""} alt={differentUser.name} />
          {differentUser.connected && <span className="online" />}
          <div className={classes.user}>
            <div className={classes.userName}>{differentUser.name ?? differentUser.userName ?? ""}</div>
            <div className={classes.userSlug}>{differentUser.urlSlug}</div>
          </div>
        </div>
        <div className={classes.actionBtns}>
          {minimize === true ? (
            <img src={require("assets/icons/minimize.svg")} onClick={handleMinimize} />
          ) : null}
          <img src={require("assets/icons/cross_gray.png")} onClick={handleClose} />
        </div>
      </div>
      {minimize === true ? (
        <div className={classes.chatContent}>
          <div className={classes.chats}>
            <div className="item-list" id="chatItemList" ref={itemListRef} onScroll={handleScroll}>
              <LoadingWrapper loading={!messagesCharged} />
              {messages &&
                messages.map((item, index) => {
                  if (
                    index === 0 ||
                    messages[index].id !== messages[index - 1].id ||
                    messages[index].id === undefined
                  ) {
                    return (
                      <MessageItem
                        key={item.id ?? `message-${index}`}
                        user={differentUser}
                        message={item}
                        mediaOnCommunity={false}
                      />
                    );
                  }
                })}
            </div>
          </div>
          <MessageFooter
            chat={chat}
            messages={messages}
            specialWidthInput={false}
            setMessages={msgs => setMessages(msgs)}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ChatModal;
