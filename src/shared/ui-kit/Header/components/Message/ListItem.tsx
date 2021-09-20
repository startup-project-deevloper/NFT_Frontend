import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Moment from "react-moment";

import { startChat } from "store/actions/MessageActions";
import { RootState } from "store/reducers/Reducer";
import { Color } from "shared/ui-kit";

type ListItemProps = {
  chat: any;
  handleClosePopper?: () => void;
};

export const ListItem: React.FunctionComponent<ListItemProps> = ({ chat, handleClosePopper }) => {
  const dispatch = useDispatch();

  const userSelector = useSelector((state: RootState) => state.user);
  const usersInfo = useSelector((state: RootState) => state.usersInfoList);
  const pathName = window.location.href;
  const isPix = pathName.includes("/pix");
  const isTrax = pathName.includes("/trax");
  const handleClick = () => {
    let user = usersInfo.find(user => user.id === otherUser.userId);
    if (!user) return;
    dispatch(
      startChat({
        chat: {
          ...chat,
          receipientId: user.id,
          userInfo: user,
        },
      })
    );
    if (handleClosePopper) handleClosePopper();
  };

  const [otherUser, setOtherUser] = useState<any>({});
  const [otherUserPhoto, setOtherUserPhoto] = useState<string>("");

  useEffect(() => {
    //console.log(chat);

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
      //console.log(chat.users.userTo);
      setOtherUser(chat.users.userTo);
      let user: any = usersInfo.find(usr => chat?.users?.userTo?.userId === usr.id);
      if (user?.url) {
        setOtherUserPhoto(user.url);
      }
    } else if (chat.users && chat.users.userTo && chat.users.userTo.userId === userSelector.id) {
      //console.log(chat.users.userFrom);
      setOtherUser(chat.users.userFrom);
      let user: any = usersInfo.find(usr => chat?.users?.userFrom?.userId === usr.id);
      if (user?.url) {
        setOtherUserPhoto(user.url);
      }
    }
  }, [chat]);

  if (!chat.lastMessageDate) return null;
  return (
    <div className="item" onClick={handleClick}>
      <div className="avatar-container">
        <img
          src={
            otherUser.url
              ? otherUserPhoto + "?" + Date.now()
              : otherUser.userFoto
              ? otherUser.userFoto
              : require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")
          }
          className="avatar"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="item-content">
        <div className="name">{otherUser.userName}</div>
        {typeof chat.lastMessage === "string" && (
          <div className="message" style={{ color: isPix ? "#181818" : "#949BAB" }}>
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
        {chat.lastMessageDate && (
          <div className="date" style={{ color: isPix ? "#181818" : "#949BAB" }}>
            Last message:{" "}
            <Moment fromNow style={{ color: isPix ? "#431AB7" : isTrax ? Color.MusicDAOGreen : "inherit" }}>
              {chat.lastMessageDate}
            </Moment>
          </div>
        )}
      </div>
    </div>
  );
};
