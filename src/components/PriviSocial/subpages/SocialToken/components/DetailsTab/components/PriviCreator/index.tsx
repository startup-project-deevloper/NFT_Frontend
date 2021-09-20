import React from "react";

import { useDispatch, } from "react-redux";
import { useHistory } from "react-router-dom";
import styles from "./elements.module.scss";
import { setSelectedUser } from "store/actions/SelectedUser";

export const PriviCreator = ({ creator, theme }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <div className={styles.creatorInfo}>
      <img
        src={creator.imageURL}
        style={{
          objectFit: "cover",
        }}
        alt="Avatar"
        onError={e => {
          const target = e.target as HTMLImageElement;
          target.src = "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png";
        }}
        onClick={() => {
          history.push(`/profile/${creator.id}`);
          dispatch(setSelectedUser(creator.id));
        }}
      />
      <div className={styles.personalInfo}>
        <div className={`${styles.creatorFullName} ${theme === "green" ? styles.darkGreyColor : ""}`}>
          {creator.name}
        </div>
        <div className={styles.creatorOtherInfo}>
          <div
            className={`${styles.creatorAlias} ${theme === "green" ? styles.greenColor : ""}`}
            onClick={() => {
              history.push(`/profile/${creator.id}`);
              dispatch(setSelectedUser(creator.id));
            }}
          >
            @{creator.urlSlug}
          </div>
          {creator.verified ? (
            <img className={styles.userVerified} src={require("assets/icons/check_gray.png")} alt={`tick`} />
          ) : null}
          <div className={`${styles.userLevel} ${theme === "green" ? styles.darkGreyColor : ""}`}>{`level ${creator.level ?? 1
            }`}</div>
        </div>
      </div>
    </div>
  );
};
