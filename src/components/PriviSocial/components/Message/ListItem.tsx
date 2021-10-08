import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { openChatModal } from "store/actions/MessageActions";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import Moment from "react-moment";
import { useHistory } from "react-router-dom";
import { Color } from "shared/ui-kit";

export const ListItem: React.FunctionComponent<any> = ({
  chat,
  setChat,
  currentChat,
  setCurrentChat,
  type = "social",
}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const userSelector = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  let pathName = window.location.href; // If routing changes, change to
  let idUrl =
    userSelector && userSelector.urlSlug && userSelector.urlSlug.length > 0
      ? userSelector.urlSlug
      : localStorage.getItem("userSlug");

  const usersInfo = useSelector((state: RootState) => state.usersInfoList);

  const handleClick = () => {
    // if (currentChat && chat.room === currentChat.room) return;
    setCurrentChat(chat);
    let user = usersInfo[usersInfo.findIndex(user => user.id === otherUser.userId)];
    dispatch(openChatModal(user));
    setChat();
    if (!pathName.includes("messages")) history.push(`/social/${idUrl}/messages`);
  };

  const [otherUser, setOtherUser] = useState<any>({});
  const [otherUserPhoto, setOtherUserPhoto] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    if (usersInfo.some(user => user.id === chat.users.userFrom.userId)) {
      chat.users.userFrom.userFoto =
        usersInfo[usersInfo.findIndex(user => user.id === chat.users.userFrom.userId)].imageURL;
      chat.users.userFrom.userName =
        usersInfo[usersInfo.findIndex(user => user.id === chat.users.userFrom.userId)].name;
    }
    if (usersInfo.some(user => user.id === chat.users.userTo.userId)) {
      chat.users.userTo.userFoto =
        usersInfo[usersInfo.findIndex(user => user.id === chat.users.userTo.userId)].imageURL;
      chat.users.userTo.userName =
        usersInfo[usersInfo.findIndex(user => user.id === chat.users.userTo.userId)].name;
    }

    if (chat.users && chat.users.userFrom && chat.users.userFrom.userId === userSelector.id) {
      setOtherUser(chat.users.userTo);
      let user: any = users.find(usr => chat?.users?.userTo?.userId === usr.id);

      if (user?.url) {
        setOtherUserPhoto(user.url);
      }
      if (user?.connected) setConnected(true);
      else setConnected(false);
    } else if (chat.users && chat.users.userTo && chat.users.userTo.userId === userSelector.id) {
      setOtherUser(chat.users.userFrom);
      let user: any = users.find(usr => chat?.users?.userFrom?.userId === usr.id);

      if (user?.url) {
        setOtherUserPhoto(user.url);
      }
      if (user?.connected) setConnected(true);
      else setConnected(false);
    }
  }, [chat]);

  if (!chat.lastMessageDate) return null;

  return (
    <div
      className={`item ${currentChat && currentChat.room === chat.room ? "selected" : ""}`}
      onClick={handleClick}
    >
      <div className="avatar-container">
        <div
          className="message-list-avatar"
          style={{
            backgroundImage: otherUserPhoto
              ? `url(${otherUserPhoto})`
              : otherUser.userFoto
              ? `url(${otherUser.userFoto})`
              : `url(${require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>
      <div className="item-content">
        <div className="name">{otherUser.userName}</div>
        {/* <div className="message">{chat.lastMessage}</div> */}
        {typeof chat.lastMessage === "string" && (
          <div className="message" style={{ color: type === "pix" ? "#181818" : "#949BAB" }}>
            {chat.lastMessage.includes("data:audio/wav;") ? (
              <div style={{ display: "flex" }}>
                <img src={require("assets/icons/music-solid.svg")} alt={"music-solid"} />
                &nbsp;Audio
              </div>
            ) : (
              chat.lastMessage
            )}
          </div>
        )}
        {chat.lastMessage && (
          <div
            className="date"
            style={{ color: type === "pix" ? "#431AB7" : type === "trax" ? Color.MusicDAOGreen : "#949BAB" }}
          >
            Last message: <Moment fromNow>{chat.lastMessageDate}</Moment>
          </div>
        )}
      </div>
      {connected && <div className="connect-status" />}
    </div>
  );
};
