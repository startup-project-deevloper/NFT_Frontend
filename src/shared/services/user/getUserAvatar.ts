import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { getUserPhoto } from "./getUserPhoto";

import useIPFS from "shared/utils-IPFS/useIPFS";
import getPhotoIPFS from "shared/functions/getPhotoIPFS";
import { useTypedSelector } from "store/reducers/Reducer";
import { UserInfo } from "store/actions/UsersInfo";

export type UserAvatarMetadata = {
  id: string;
  anon?: boolean;
  hasPhoto?: boolean;
  anonAvatar?: string;
  url?: string;
};

export const getUserAvatar = (user?: UserAvatarMetadata) => {
  if (user && user.anon === false && user.hasPhoto) {
    return getUserPhoto(user.id, user.url);
  }

  if (user && user.anonAvatar) {
    return require(`assets/anonAvatars/${user.anonAvatar}`);
  }

  return getRandomAvatar();
};

export const getRandomAvatar = (): string => {
  const randomNumber = Math.floor(Math.random() * 118 + 1);
  return require(`assets/anonAvatars/ToyFaces_Colored_BG_${randomNumber.toString().padStart(3, "0")}.jpg`);
};

const AvatarHashTable = {};

export const getRandomAvatarForUserIdWithMemoization = (userId: string) => {
  if (!AvatarHashTable[userId]) {
    AvatarHashTable[userId] = getRandomAvatar();
  }

  return AvatarHashTable[userId];
};

export const useUserAvatar = (userId: string | undefined) => {
  const users = useSelector((state: RootState) => state.usersInfoList);
  const [avatar, setAvatar] = React.useState<string>();

  React.useEffect(() => {
    if (userId) {
      const user = users.find(item => item.id === userId);
      if (user) {
        setAvatar(getUserAvatar(user));
      } else {
        setAvatar(require("assets/anonAvatars/ToyFaces_Colored_BG_111.jpg"));
      }
    }
  }, [userId, users]);

  return avatar;
};

export const getUserIpfsAvatar = async (user: any, users: UserInfo[], downloadWithNonDecryption: () => void) => {
  if (user && user.infoImage && user.infoImage.newFileCID) {
    let imageUrl = await getPhotoIPFS(user.infoImage.newFileCID, downloadWithNonDecryption);
    return imageUrl;
  } else if (user && user.id) {
    const userFound = users.find(usr => usr.id === user.id);

    if (userFound && userFound.infoImage && userFound.infoImage.newFileCID) {
      let imageUrl = await getPhotoIPFS(userFound.infoImage.newFileCID, downloadWithNonDecryption);
      return imageUrl;
    } else {
      return getDefaultAvatar();
    }
  } else {
    return getDefaultAvatar();
  }
};

export const getDefaultAvatar = () => (require("assets/anonAvatars/ToyFaces_Colored_BG_111.jpg"));

export const getDefaultBGImage = () => (require("assets/backgrounds/digital_art_1.png"))