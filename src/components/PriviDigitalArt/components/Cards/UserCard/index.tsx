import React, {useEffect, useState} from "react";
import classnames from "classnames";
import Axios from "axios";
import { useHistory } from "react-router-dom";

import { useTypedSelector } from "store/reducers/Reducer";

import { Avatar } from "shared/ui-kit";
import { getRandomAvatarForUserIdWithMemoization, useUserAvatar } from "shared/services/user/getUserAvatar";
import URL from "shared/functions/getURL";

import { userCardStyles } from "./index.styles";
import useIPFS from "../../../../../shared/utils-IPFS/useIPFS";
import getPhotoIPFS from "../../../../../shared/functions/getPhotoIPFS";

const UserCard = props => {
  const classes = userCardStyles();

  const history = useHistory();
  const { userId, className } = props;
  const userSelector = useTypedSelector(state => state.user);

  const [user, setUser] = useState<any>();

  const { ipfs, setMultiAddr, uploadWithNonEncryption, downloadWithNonDecryption } = useIPFS();

  const [imageIPFS, setImageIPFS] = useState<any>(null);

  const avatar = useUserAvatar(userId);

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    getPhotoUser(user);
    console.log('user', user);
  }, [ipfs, user]);

  const getPhotoUser = async (user : any) => {
    if (ipfs && Object.keys(ipfs).length !== 0 &&
      user && user.infoImage && user.infoImage.newFileCID) {
      setImageIPFS(await getPhotoIPFS(user.infoImage.newFileCID, downloadWithNonDecryption));
    }
  }

  useEffect(() => {
    if (userId && userSelector) {
      const getCreatorData = async () => {
        if (userId === userSelector.id) setUser(userSelector);
        else
          Axios.get(`${URL()}/user/getBasicUserInfo/${userId}`)
            .then(response => {
              if (response.data.success) {
                let data = response.data.data;
                setUser({
                  ...data,
                  name: data.name ?? `${data.firstName} ${data.lastName}`,
                });
              } else {
                setUser({
                  url: getRandomAvatarForUserIdWithMemoization(userId),
                  name: "User name",
                  urlSlug: "Username",
                  id: "",
                });
              }
            })
            .catch(error => {
              console.log(error);
            });
      };
      getCreatorData();
    }
  }, [userSelector, userId]);

  const handleArtistHandler = () => {
    history.push(`/trax/artists/${userId}`);
  };

  return (
    <div className={classnames(classes.container, className)}>
      <div>
        <div className={classes.avatar} onClick={handleArtistHandler}>
          <Avatar
            size="large"
            url={
              imageIPFS
                ? imageIPFS
                : avatar
            }
            alt=""
          />
        </div>
        <div className={classes.title}>{user?.name || user?.firstName || "User Name"}</div>
        <div className={classes.userName}>
          @{
            user?.urlSlug
              ? user?.urlSlug.length > 13
                ? user?.urlSlug.substr(0, 13) + '...' + user?.urlSlug.substr(user?.urlSlug.length - 2, 2)
                : user?.urlSlug
              : "Username"
          }</div>
      </div>
      {/* {!props.invited && user?.verified && ( */}
        <div className={classes.iconContainer}>
          <StarIcon />
          <span className={classes.statusVerify}>Verified Artist</span>
        </div>
      {/* )} */}
      {props.invited && (
        <div className={classes.iconContainer}>
          {user?.accepted ? (
            <StarIcon />
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4.19791 7.34302L9.09003 4.5475L6.29451 9.43961C6.19653 9.61138 6.20372 9.82432 6.31345 9.98892L8.49749 13.2652C8.60788 13.4311 8.80382 13.5199 9.00172 13.4931C9.19963 13.467 9.36488 13.3298 9.42823 13.1404L13.5627 0.735717C13.6254 0.548262 13.5765 0.341211 13.4367 0.200791C13.2963 0.0610172 13.0892 0.0120327 12.9018 0.0747333L0.497067 4.20974C0.307656 4.27244 0.171149 4.43834 0.144363 4.6356C0.117583 4.8335 0.206411 5.02945 0.372315 5.13982L3.64855 7.32387C3.81314 7.4336 4.02607 7.44078 4.19786 7.34281L4.19791 7.34302Z"
                fill="#54658F"
              />
            </svg>
          )}
          <span className={classes.statusInvite}>
            {user?.accepted ? "Accepted Invite" : "Invite sentbear "}
          </span>
        </div>
      )}
    </div>
  );
};

export default UserCard;

const StarIcon = () => {
  return (
    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.3135 7.41699C14.6562 7.0366 14.6562 6.45888 14.3136 6.07849L13.5919 5.27723C13.4021 5.06655 13.3107 4.78521 13.3404 4.50322L13.4534 3.43087C13.507 2.92147 13.1671 2.45388 12.666 2.34779L11.6119 2.12464C11.334 2.0658 11.0941 1.89147 10.9524 1.64522L10.4153 0.712142C10.1594 0.267678 9.6088 0.0888114 9.14058 0.298062L8.15771 0.737323C7.89807 0.853358 7.60131 0.853359 7.34167 0.737323L6.35879 0.298062C5.89058 0.0888112 5.33996 0.267678 5.08411 0.712142L4.54698 1.64522C4.40523 1.89147 4.16541 2.0658 3.88744 2.12465L2.83338 2.3478C2.33227 2.45388 1.99234 2.92147 2.04599 3.43086L2.15895 4.50323C2.18865 4.78521 2.09725 5.06654 1.90749 5.27723L1.18579 6.0785C0.843175 6.45889 0.843172 7.0366 1.18578 7.41699L1.90746 8.21826C2.09722 8.42894 2.18862 8.71027 2.15892 8.99225L2.04597 10.0646C1.99231 10.574 2.33224 11.0416 2.83335 11.1477L3.88741 11.3708C4.16538 11.4297 4.4052 11.604 4.54695 11.8503L5.08408 12.7833C5.33993 13.2278 5.89055 13.4067 6.35877 13.1974L7.34163 12.7581C7.60127 12.6421 7.89805 12.6421 8.15769 12.7581L9.14055 13.1974C9.60877 13.4067 10.1594 13.2278 10.4152 12.7833L10.9524 11.8503C11.0941 11.604 11.3339 11.4297 11.6119 11.3708L12.666 11.1477C13.1671 11.0416 13.507 10.574 13.4533 10.0646L13.3404 8.99227C13.3107 8.71028 13.4021 8.42894 13.5918 8.21825L14.3135 7.41699Z" fill="black"/>
      <path d="M14.3135 7.41699C14.6562 7.0366 14.6562 6.45888 14.3136 6.07849L13.5919 5.27723C13.4021 5.06655 13.3107 4.78521 13.3404 4.50322L13.4534 3.43087C13.507 2.92147 13.1671 2.45388 12.666 2.34779L11.6119 2.12464C11.334 2.0658 11.0941 1.89147 10.9524 1.64522L10.4153 0.712142C10.1594 0.267678 9.6088 0.0888114 9.14058 0.298062L8.15771 0.737323C7.89807 0.853358 7.60131 0.853359 7.34167 0.737323L6.35879 0.298062C5.89058 0.0888112 5.33996 0.267678 5.08411 0.712142L4.54698 1.64522C4.40523 1.89147 4.16541 2.0658 3.88744 2.12465L2.83338 2.3478C2.33227 2.45388 1.99234 2.92147 2.04599 3.43086L2.15895 4.50323C2.18865 4.78521 2.09725 5.06654 1.90749 5.27723L1.18579 6.0785C0.843175 6.45889 0.843172 7.0366 1.18578 7.41699L1.90746 8.21826C2.09722 8.42894 2.18862 8.71027 2.15892 8.99225L2.04597 10.0646C1.99231 10.574 2.33224 11.0416 2.83335 11.1477L3.88741 11.3708C4.16538 11.4297 4.4052 11.604 4.54695 11.8503L5.08408 12.7833C5.33993 13.2278 5.89055 13.4067 6.35877 13.1974L7.34163 12.7581C7.60127 12.6421 7.89805 12.6421 8.15769 12.7581L9.14055 13.1974C9.60877 13.4067 10.1594 13.2278 10.4152 12.7833L10.9524 11.8503C11.0941 11.604 11.3339 11.4297 11.6119 11.3708L12.666 11.1477C13.1671 11.0416 13.507 10.574 13.4533 10.0646L13.3404 8.99227C13.3107 8.71028 13.4021 8.42894 13.5918 8.21825L14.3135 7.41699Z" fill="url(#paint0_linear)"/>
      <defs>
        <linearGradient id="paint0_linear" x1="16.1829" y1="2.98499" x2="4.80019" y2="15.9647" gradientUnits="userSpaceOnUse">
          <stop stop-color="#418DFF"/>
          <stop offset="0.333302" stop-color="#4541FF"/>
          <stop offset="0.437384" stop-color="#4541FF"/>
          <stop offset="0.745055" stop-color="#EF41CB"/>
          <stop offset="0.790836" stop-color="#EF41CB"/>
          <stop offset="0.998516" stop-color="#EFA941"/>
        </linearGradient>
      </defs>
    </svg>
  )
}