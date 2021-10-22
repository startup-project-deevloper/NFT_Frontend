import React, { useEffect, useState } from "react";
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
    console.log("user", user);
  }, [ipfs, user]);

  const getPhotoUser = async (user: any) => {
    if (ipfs  && user && user.infoImage && user.infoImage.newFileCID) {
      setImageIPFS(await getPhotoIPFS(user.infoImage.newFileCID, downloadWithNonDecryption));
    }
  };

  useEffect(() => {
    if (userId && userSelector) {
      const getCreatorData = async () => {
        if (userId === userSelector.id) setUser(userSelector);
        else {
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
          }
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
          <Avatar size="large" url={imageIPFS ? imageIPFS : avatar} alt="" />
        </div>
        <div className={classes.title}>{user?.name || user?.firstName || "User Name"}</div>
        <div className={classes.userName}>
          @
          {user?.urlSlug
            ? user?.urlSlug.length > 13
              ? user?.urlSlug.substr(0, 13) + "..." + user?.urlSlug.substr(user?.urlSlug.length - 2, 2)
              : user?.urlSlug
            : "Username"}
        </div>
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
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.8135 8.41699C14.1562 8.0366 14.1562 7.45888 13.8136 7.07849L13.0919 6.27723C12.9021 6.06655 12.8107 5.78521 12.8404 5.50322L12.9534 4.43087C13.007 3.92147 12.6671 3.45388 12.166 3.34779L11.1119 3.12464C10.834 3.0658 10.5941 2.89147 10.4524 2.64522L9.91527 1.71214C9.65941 1.26768 9.1088 1.08881 8.64058 1.29806L7.65771 1.73732C7.39807 1.85336 7.10131 1.85336 6.84167 1.73732L5.85879 1.29806C5.39058 1.08881 4.83996 1.26768 4.58411 1.71214L4.04698 2.64522C3.90523 2.89147 3.66541 3.0658 3.38744 3.12465L2.33338 3.3478C1.83227 3.45388 1.49234 3.92147 1.54599 4.43086L1.65895 5.50323C1.68865 5.78521 1.59725 6.06654 1.40749 6.27723L0.685787 7.0785C0.343175 7.45889 0.343172 8.0366 0.685781 8.41699L1.40746 9.21826C1.59722 9.42894 1.68862 9.71027 1.65892 9.99225L1.54597 11.0646C1.49231 11.574 1.83224 12.0416 2.33335 12.1477L3.38741 12.3708C3.66538 12.4297 3.9052 12.604 4.04695 12.8503L4.58408 13.7833C4.83993 14.2278 5.39055 14.4067 5.85877 14.1974L6.84163 13.7581C7.10127 13.6421 7.39805 13.6421 7.65769 13.7581L8.64055 14.1974C9.10877 14.4067 9.65939 14.2278 9.91524 13.7833L10.4524 12.8503C10.5941 12.604 10.8339 12.4297 11.1119 12.3708L12.166 12.1477C12.6671 12.0416 13.007 11.574 12.9533 11.0646L12.8404 9.99227C12.8107 9.71028 12.9021 9.42894 13.0918 9.21825L13.8135 8.41699Z"
        fill="black"
      />
      <path
        d="M13.8135 8.41699C14.1562 8.0366 14.1562 7.45888 13.8136 7.07849L13.0919 6.27723C12.9021 6.06655 12.8107 5.78521 12.8404 5.50322L12.9534 4.43087C13.007 3.92147 12.6671 3.45388 12.166 3.34779L11.1119 3.12464C10.834 3.0658 10.5941 2.89147 10.4524 2.64522L9.91527 1.71214C9.65941 1.26768 9.1088 1.08881 8.64058 1.29806L7.65771 1.73732C7.39807 1.85336 7.10131 1.85336 6.84167 1.73732L5.85879 1.29806C5.39058 1.08881 4.83996 1.26768 4.58411 1.71214L4.04698 2.64522C3.90523 2.89147 3.66541 3.0658 3.38744 3.12465L2.33338 3.3478C1.83227 3.45388 1.49234 3.92147 1.54599 4.43086L1.65895 5.50323C1.68865 5.78521 1.59725 6.06654 1.40749 6.27723L0.685787 7.0785C0.343175 7.45889 0.343172 8.0366 0.685781 8.41699L1.40746 9.21826C1.59722 9.42894 1.68862 9.71027 1.65892 9.99225L1.54597 11.0646C1.49231 11.574 1.83224 12.0416 2.33335 12.1477L3.38741 12.3708C3.66538 12.4297 3.9052 12.604 4.04695 12.8503L4.58408 13.7833C4.83993 14.2278 5.39055 14.4067 5.85877 14.1974L6.84163 13.7581C7.10127 13.6421 7.39805 13.6421 7.65769 13.7581L8.64055 14.1974C9.10877 14.4067 9.65939 14.2278 9.91524 13.7833L10.4524 12.8503C10.5941 12.604 10.8339 12.4297 11.1119 12.3708L12.166 12.1477C12.6671 12.0416 13.007 11.574 12.9533 11.0646L12.8404 9.99227C12.8107 9.71028 12.9021 9.42894 13.0918 9.21825L13.8135 8.41699Z"
        fill="url(#paint0_linear_3700:52098)"
      />
      <path
        d="M4.75 8.33594L6.25 9.83594L9.75 6.33594"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_3700:52098"
          x1="15.6829"
          y1="3.98499"
          x2="4.30019"
          y2="16.9647"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#418DFF" />
          <stop offset="0.333302" stop-color="#4541FF" />
          <stop offset="0.437384" stop-color="#4541FF" />
          <stop offset="0.745055" stop-color="#EF41CB" />
          <stop offset="0.790836" stop-color="#EF41CB" />
          <stop offset="0.998516" stop-color="#EFA941" />
        </linearGradient>
      </defs>
    </svg>
  );
};
