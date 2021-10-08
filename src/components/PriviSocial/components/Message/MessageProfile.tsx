import React, { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getMessageBox } from "store/selectors/user";
import { setSelectedUser } from "store/actions/SelectedUser";
import "./MessageProfile.css";

const TopStatesItem = props => {
  const { title, value } = props;
  return (
    <div className="state">
      <div className="state-title">
        <img />
        <div>{title}</div>
      </div>
      <div className="state-value">{value}</div>
    </div>
  );
};

export const MessageProfile = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const messageBoxInfo = useSelector(getMessageBox);

  const pathName = window.location.href; // If routing changes, change to pathname

  const handleViewProfile = () => {
    history.push(`/${userInfo.id}/profile`);
    dispatch(setSelectedUser(userInfo.id));
  };

  
  const { userInfo } = messageBoxInfo;
  const user = userInfo.urlSlug ? userInfo.urlSlug : "";
  const userName = user.length > 17 ? user.substr(0, 13) + "..." + user.substr(user.length - 3, 3) : user;

  if (userInfo !== undefined && (userInfo.name || userInfo.urlSlug))
    return (
      <div>
        <img
          src={
            userInfo && userInfo.url
              ? userInfo.url
              : require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")
          }
          className="message-profile-avatar"
        />
        <div className="name">{userInfo && userInfo.name}</div>
        <div className="slug-container">
          {userName ? (
            <div className="slug-name">@{userName}</div>
          ) : null}
          <img className="verified-label" src={require("assets/icons/profileVerified.svg")} alt={"check"} />
          <span className="profile-level">level 1</span>
        </div>
        {userInfo ? (
          <div className="top-stats">
            <div className="title">Top States</div>
            <div className="stats">
              <TopStatesItem title="🌟 Followers" value={userInfo.numFollowers || 0} />
              <TopStatesItem title="💫 Following" value={userInfo.numFollowings || 0} />
            </div>
            <div className="stats">
              <TopStatesItem title="📹 Media" value={0} />
              <TopStatesItem title="🥇 Awards" value={userInfo.awards || ""} />
            </div>
          </div>
        ) : null}
        <div className="badges">
          <div className="title">💎 Badges</div>
        </div>
        <div className="button-container">
          <button onClick={handleViewProfile}>View Full Profile</button>
        </div>
      </div>
    );
  else return null;
};
