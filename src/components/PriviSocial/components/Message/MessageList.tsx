import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HeaderBold4 } from "shared/ui-kit";
import { SearchInputBox } from "shared/ui-kit/SearchInputBox/SearchInputBox";
import { RootState } from "store/reducers/Reducer";
import axios from "axios";
import URL from "shared/functions/getURL";
import { openChatModal } from "store/actions/MessageActions";
import { ListItem } from "./ListItem";
import "./MessageList.css";
import { closeMessageBox, openNewChatModal } from "store/actions/MessageActions";
import { useHistory } from "react-router-dom";
import { getMessageBox } from "store/selectors/user";

export const MessageList = (props: any) => {
  const location = useLocation();
  const { newChatInList } = useSelector(getMessageBox);

  let pathName = window.location.href;
  let idUrl = pathName.split("/")[5] ? pathName.split("/")[5] : "" + localStorage.getItem("userId");

  const dispatch = useDispatch();
  const history = useHistory();

  const userSelector = useSelector((state: RootState) => state.user);
  const usersInfo = useSelector((state: RootState) => state.usersInfoList);

  const [chats, setChats] = useState<any[]>(props.chats || []);
  const [keyword, setKeyword] = useState<string>("");
  const [currentChat, setCurrentChat] = useState<any>(null);

  useEffect(() => {
    if (usersInfo && usersInfo.length > 0) getChats();
  }, [usersInfo]);

  useEffect(() => {
    if (props.chats) {
      setChats(props.chats);
    }
  }, [props.chats]);

  useEffect(() => {
    let cs = [] as any;
    if (!newChatInList || !newChatInList.users) return;
    if (usersInfo && usersInfo.length > 0) {
      const newChatItem = {
        ...newChatInList,
        lastMessageDate: new Date().getTime(),
        messages: [],
        created: new Date().getTime(),
      };
      if (usersInfo.some(user => user.id === newChatItem.users.userFrom.userId)) {
        newChatItem.users.userFrom.userFoto =
          usersInfo[usersInfo.findIndex(user => user.id === newChatItem.users.userFrom.userId)].imageURL;
      }
      if (usersInfo.some(user => user.id === newChatItem.users.userTo.userId)) {
        newChatItem.users.userTo.userFoto =
          usersInfo[usersInfo.findIndex(user => user.id === newChatItem.users.userTo.userId)].imageURL;
      }
      setCurrentChat(newChatItem);
      const user = usersInfo[usersInfo.findIndex(user => user.id === newChatItem.receipientId)];
      dispatch(openChatModal(user));
      props.createChat(newChatItem);
      if (
        chats.findIndex(
          chat =>
            chat.users.userFrom.userId === newChatItem.users.userFrom.userId &&
            chat.users.userTo.userId === newChatItem.users.userTo.userId
        ) > -1
      )
        return;
      setChats([newChatItem, ...chats]);
      if (props.setChats !== undefined) {
        props.setChats([newChatItem, ...chats]);
      }
    }
  }, [newChatInList]);

  const handleOpenNewChatModal = () => {
    dispatch(openNewChatModal());
  };

  const getChats = () => {
    axios
      .post(`${URL()}/chat/getChats`, {
        userId: userSelector.id,
      })
      .then(response => {
        if (response.data.success) {
          let cs = [] as any;
          if (usersInfo && usersInfo.length > 0) {
            response.data.data.forEach((chat, index) => {
              cs.push(chat);
              if (usersInfo.some(user => user.id === chat.users.userFrom.userId)) {
                cs[index].users.userFrom.userFoto =
                  usersInfo[usersInfo.findIndex(user => user.id === chat.users.userFrom.userId)].imageURL;
                cs[index].users.userFrom.userName =
                  usersInfo[usersInfo.findIndex(user => user.id === chat.users.userFrom.userId)].name;
              }
              if (usersInfo.some(user => user.id === chat.users.userTo.userId)) {
                cs[index].users.userTo.userFoto =
                  usersInfo[usersInfo.findIndex(user => user.id === chat.users.userTo.userId)].imageURL;
                cs[index].users.userTo.userName =
                  usersInfo[usersInfo.findIndex(user => user.id === chat.users.userTo.userId)].name;
              }
            });
          }
          cs.sort((a, b) => (b.lastMessageDate ?? 0) - (a.lastMessageDate ?? 0));
          if (cs && cs.length > 0) {
            setCurrentChat(cs[0]);
            let otherUserId: string = "-1";
            if (cs[0].users && cs[0].users.userFrom && cs[0].users.userFrom.userId === userSelector.id) {
              otherUserId = cs[0].users.userTo.userId;
            } else if (cs[0].users && cs[0].users.userTo && cs[0].users.userTo.userId === userSelector.id) {
              otherUserId = cs[0].users.userFrom.userId;
            }
            if (otherUserId !== "-1") {
              const user = usersInfo[usersInfo.findIndex(user => user.id === otherUserId)];
              dispatch(openChatModal(user));
              props.createChat(cs[0]);
            }
          }
          setChats(cs);
          if (props.setChats !== undefined) {
            props.setChats(cs);
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div className="message-list-items">
      <div className="message-list-header">
        <HeaderBold4>Messages</HeaderBold4>
        <img
          src={require("assets/icons/pix_edit_icon.svg")}
          className="edit-icon"
          onClick={handleOpenNewChatModal}
        />
      </div>
      <SearchInputBox keyword={keyword} setKeyword={setKeyword} placeholder={"Search User"} />
      <div className="item-list">
        {chats &&
          chats
            .filter(chat => {
              if (keyword.length > 0) {
                return chat.users.userTo.userName.toLowerCase().includes(keyword.toLowerCase());
              } else return true;
            })
            .map((chat, i) => (
              <ListItem
                key={i}
                chat={chat}
                setChat={() => props.createChat(chat)}
                currentChat={currentChat}
                setCurrentChat={setCurrentChat}
                type={props.type}
              />
            ))}
      </div>
    </div>
  );
};
