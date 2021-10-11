import React, {useEffect, useState} from "react";
import classnames from "classnames";
import Axios from "axios";
import { useHistory } from "react-router-dom";

import { useTypedSelector } from "store/reducers/Reducer";

import { Avatar } from "shared/ui-kit";
import { getRandomAvatar, getRandomAvatarForUserIdWithMemoization, useUserAvatar } from "shared/services/user/getUserAvatar";
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
        <div className={classes.userName}>@{user?.urlSlug || "Username"}</div>
      </div>
      {!props.invited && user?.verified && (
        <div className={classes.iconContainer}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14.1627 8.43652C14.5053 8.05613 14.5053 7.47842 14.1627 7.09802L13.441 6.29676C13.2512 6.08608 13.1598 5.80474 13.1895 5.52275L13.3025 4.4504C13.3562 3.941 13.0162 3.47341 12.5151 3.36733L11.4611 3.14418C11.1831 3.08533 10.9433 2.911 10.8015 2.66475L10.2644 1.73167C10.0085 1.28721 9.45792 1.10834 8.98971 1.31759L8.00683 1.75685C7.74719 1.87289 7.45043 1.87289 7.19079 1.75685L6.20791 1.31759C5.7397 1.10834 5.18909 1.28721 4.93323 1.73167L4.3961 2.66475C4.25435 2.911 4.01453 3.08533 3.73656 3.14418L2.6825 3.36733C2.18139 3.47342 1.84146 3.941 1.89512 4.45039L2.00807 5.52276C2.03777 5.80474 1.94637 6.08608 1.75661 6.29676L1.03491 7.09803C0.692296 7.47842 0.692293 8.05613 1.0349 8.43652L1.75659 9.23779C1.94634 9.44847 2.03774 9.7298 2.00804 10.0118L1.89509 11.0842C1.84143 11.5936 2.18136 12.0611 2.68247 12.1672L3.73653 12.3904C4.0145 12.4492 4.25432 12.6235 4.39608 12.8698L4.9332 13.8029C5.18906 14.2473 5.73968 14.4262 6.20789 14.2169L7.19075 13.7777C7.4504 13.6616 7.74717 13.6616 8.00681 13.7777L8.98967 14.2169C9.45789 14.4262 10.0085 14.2473 10.2644 13.8029L10.8015 12.8698C10.9432 12.6235 11.1831 12.4492 11.461 12.3904L12.5151 12.1672C13.0162 12.0611 13.3561 11.5935 13.3025 11.0841L13.1895 10.0118C13.1598 9.72981 13.2512 9.44847 13.441 9.23779L14.1627 8.43652Z"
              fill="url(#paint0_linear_user_card)"
            />
            <path
              d="M5.09912 8.35742L6.59912 9.85742L10.0991 6.35742"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="paint0_linear_user_card"
                x1="1.51708"
                y1="7.20367"
                x2="14.2082"
                y2="8.9906"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.179206" stopColor="#A0D800" />
                <stop offset="0.852705" stopColor="#0DCC9E" />
              </linearGradient>
            </defs>
          </svg>
          <span className={classes.statusVerify}>Verified Artist</span>
        </div>
      )}
      {props.invited && (
        <div className={classes.iconContainer}>
          {user?.accepted ? (
            <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.76727 2.4092C4.244 1.74324 4.89903 1.23887 5.66832 0.957184C7.1982 0.393128 9.00909 0.885857 10.0426 2.14717C10.5725 2.79129 10.8869 3.56788 10.9509 4.40205C11.0128 5.20993 10.8112 6.04111 10.3891 6.73258C9.98149 7.40071 9.37011 7.95677 8.6554 8.27555C7.88536 8.6191 7.03962 8.71952 6.2114 8.55577C4.6393 8.24425 3.35246 6.9167 3.10726 5.33145C3.07451 5.11675 3.05267 4.90203 3.05267 4.68368V4.68004C3.05049 3.87216 3.29795 3.06572 3.76739 2.40914L3.76727 2.4092Z"
                fill="url(#paint0_linear_accept)"
              />
              <path
                d="M0.175854 11.9854C0.174398 11.9745 0.174398 11.9621 0.174398 11.949C0.178038 10.5916 0.763944 9.26482 1.78652 8.36805C2.04707 8.14096 2.32876 7.93863 2.62933 7.76759C2.75889 7.69481 2.96777 7.70063 3.06967 7.82436C3.26035 8.05726 3.46997 8.27561 3.69706 8.47431C3.75164 8.52162 3.80769 8.56892 3.86446 8.61623C3.87028 8.62206 3.88484 8.63225 3.89939 8.64389C3.90085 8.64389 3.90085 8.64535 3.90303 8.64535C3.9336 8.67082 3.96708 8.69266 3.9991 8.71667C4.12138 8.8062 4.24656 8.8899 4.37611 8.96996C4.5013 9.04638 4.63085 9.11698 4.76185 9.18466C4.82736 9.21741 4.89432 9.25016 4.962 9.27928C4.98529 9.29019 5.00931 9.30111 5.03333 9.30984C5.03187 9.30984 5.02751 9.30839 5.02605 9.30839C5.02969 9.30984 5.04061 9.31421 5.0588 9.32149C5.05152 9.31785 5.04425 9.31567 5.03842 9.31276C5.04424 9.31421 5.05152 9.31858 5.05443 9.32003C5.07991 9.33095 5.10538 9.34041 5.13304 9.3506C5.41688 9.46123 5.70949 9.54712 6.00788 9.60898C6.08212 9.62353 6.15709 9.63809 6.23205 9.64901C6.25024 9.65264 6.26989 9.65483 6.28882 9.65774H6.29464C6.28882 9.65774 6.291 9.65774 6.31284 9.6592C6.31647 9.6592 6.32011 9.66065 6.32375 9.66065C6.3223 9.66065 6.32011 9.66065 6.31793 9.6592C6.32521 9.6592 6.33249 9.66065 6.33613 9.66065C6.35942 9.66429 6.38344 9.66647 6.40745 9.66938C6.56757 9.6854 6.7277 9.69704 6.88781 9.69995C7.04939 9.70359 7.20952 9.6985 7.37182 9.68685C7.44824 9.68103 7.52612 9.67375 7.60327 9.66502C7.61201 9.66502 7.64694 9.65919 7.66732 9.65774C7.6615 9.65774 7.65422 9.65919 7.65276 9.65919C7.6564 9.65919 7.6615 9.65774 7.67096 9.65774C7.67678 9.65774 7.67969 9.65628 7.68188 9.65628C7.68552 9.65628 7.69061 9.65483 7.69279 9.65483C7.71608 9.65119 7.7401 9.64755 7.76412 9.64391C8.0698 9.59442 8.37185 9.51872 8.66516 9.41682C8.7343 9.39353 8.8049 9.36587 8.87477 9.33821C8.89661 9.32948 8.9199 9.3222 8.94173 9.31056C8.94537 9.3091 8.95047 9.30473 8.96721 9.29964C8.98904 9.2909 9.00869 9.28144 9.03126 9.27198C9.16954 9.21012 9.30638 9.14097 9.43738 9.06673C9.58149 8.98667 9.72123 8.89933 9.85806 8.80617C9.92939 8.75668 9.99781 8.70573 10.0677 8.65479C10.0662 8.65624 10.0619 8.65843 10.0604 8.66061C10.0531 8.66643 10.0517 8.66789 10.0495 8.66934C10.0531 8.66789 10.0728 8.65115 10.0786 8.64751C10.0771 8.64896 10.0728 8.65115 10.0699 8.65479C10.0844 8.64169 10.1004 8.6315 10.115 8.61839C10.1514 8.58928 10.1863 8.56017 10.2205 8.53106C10.4789 8.3127 10.714 8.07106 10.9265 7.80833C11.027 7.6846 11.238 7.67586 11.3669 7.75156C12.011 8.12638 12.5605 8.60674 12.9914 9.21812C13.4535 9.87461 13.7279 10.6446 13.8196 11.4395C13.8575 11.7779 13.8487 12.12 13.8487 12.4599V13.8806V14.8777C13.8473 15.5473 13.4739 16.1987 12.8531 16.4804C12.5656 16.6099 12.2708 16.65 11.9615 16.65H1.97941C1.47867 16.65 0.98812 16.4644 0.647504 16.0896C0.370926 15.7839 0.212273 15.4032 0.18751 14.992C0.181688 14.8996 0.186055 14.8064 0.186055 14.714L0.18096 11.9853L0.175854 11.9854ZM5.61481 13.8159H6.45326V14.647C6.45326 14.9527 6.70436 15.1798 6.99913 15.1929C7.29389 15.206 7.545 14.9323 7.545 14.647V13.8159H8.38345C8.68913 13.8159 8.91622 13.5647 8.92932 13.27C8.94242 12.9752 8.66877 12.7241 8.38345 12.7241H7.545V11.8762C7.545 11.5705 7.29389 11.3434 6.99913 11.3303C6.70436 11.3172 6.45326 11.5909 6.45326 11.8762V12.7241H5.61481C5.30912 12.7241 5.08203 12.9752 5.06894 13.27C5.05584 13.5647 5.32876 13.8159 5.61481 13.8159Z"
                fill="url(#paint1_linear_accept)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_accept"
                  x1="10.3632"
                  y1="4.35225"
                  x2="3.34729"
                  y2="5.29233"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.179206" stopColor="#A0D800" />
                  <stop offset="0.852705" stopColor="#0DCC9E" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_accept"
                  x1="12.8145"
                  y1="11.8068"
                  x2="0.962863"
                  y2="14.2333"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.179206" stopColor="#A0D800" />
                  <stop offset="0.852705" stopColor="#0DCC9E" />
                </linearGradient>
              </defs>
            </svg>
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
