import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import { RootState } from "store/reducers/Reducer";
import { Avatar } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { wallItemStyles } from "./index.styles";
import useIPFS from "../../../../../../../../shared/utils-IPFS/useIPFS";
import { onGetNonDecrypt } from "../../../../../../../../shared/ipfs/get";
import { _arrayBufferToBase64 } from "../../../../../../../../shared/functions/commonFunctions";
import getPhotoIPFS from "../../../../../../../../shared/functions/getPhotoIPFS";
import {getRandomAvatar} from "../../../../../../../../shared/services/user/getUserAvatar";

const ResponseIcon = ({ color = "#727F9A" }) => {
  return (
    <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 1H1V13H4V18L9 13H17V1Z" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const arePropsEqual = (prevProps, currProps) => {
  return prevProps.item === currProps.item && prevProps.type === currProps.type;
};

const WallItem = React.memo((props: any) => {
  const classes = wallItemStyles();
  const history = useHistory();
  const usersList = useSelector((state: RootState) => state.usersInfoList);

  const [imageIPFS, setImageIPFS] = useState<any>(null);
  const [videoIPFS, setVideoIPFS] = useState<any>(null);
  const [creatorImageIPFS, setCreatorImageIPFS] = useState<any>(null);

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    let item = props.item;
    if (ipfs  && item && item.infoImage && item.infoImage.newFileCID) {
      getImageIPFS(item.infoImage?.newFileCID);
    }
    if (ipfs  && item && item.infoVideo && item.infoVideo.newFileCID) {
      getVideoIPFS(item.infoVideo?.newFileCID);
    }
    if (ipfs  && item && item.author) {
      getAuthorImage(item.author)
    }
  }, [props.item, ipfs]);

  let userIndex;
  if (props.Creator.includes("0x")) {
    userIndex = usersList.findIndex(user => user.address === props.Creator);
  } else {
    userIndex = usersList.findIndex(user => user.id === props.Creator);
  }

  const getImageIPFS = async (cid: string) => {
    let files = await onGetNonDecrypt(cid, (fileCID, download) =>
      downloadWithNonDecryption(fileCID, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.content);
      setImageIPFS("data:image/png;base64," + base64String);
    }
  };

  const getVideoIPFS = async (cid: string) => {
    let files = await onGetNonDecrypt(cid, (fileCID, download) =>
      downloadWithNonDecryption(fileCID, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.content);
      setVideoIPFS("data:video/mp4;base64," + base64String);
    }
  };

  const getAuthorImage = async(userId) => {
    let userFound = usersList.find(user => user.id === userId);

    if(userFound && userFound.infoImage && userFound.infoImage.newFileCID) {
      let imageUrl = await getPhotoIPFS(userFound.infoImage.newFileCID, downloadWithNonDecryption);
      console.log(userId, userFound, creatorImageIPFS);

      setCreatorImageIPFS(imageUrl)
    }
  }

  return (
    <Box
      className={classes.item}
      style={{
        background: props.item.pinned ? "#9EACF2" : "white",
        color: props.item.pinned ? "white" : "black",
      }}
      onClick={() => {
        history.push(`/trax/pod-post/${props.item.id}`);
      }}
    >
      {imageIPFS && (
        <Box
          className={classes.image}
          style={{
            backgroundImage: imageIPFS ? `url(${imageIPFS})` : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onClick={() => {}}
        />
      )}
      <div className={classes.userImage}>
        <Avatar
          size="small"
          url={
            creatorImageIPFS ? creatorImageIPFS :
              getRandomAvatar()
          }
        />
      </div>

      <Box display="flex"
           flexDirection="column"
           p={2} flex={1}>
        <Box className={classes.header1}
             style={{ paddingLeft: 0, paddingBottom: "12px" }}>
          {props.item.title ? props.item.title : ""}
        </Box>
        {props.item.shortPreviewText && (
          <Box flex={1}
               className={classes.header2}
               mt={1}>
            {props.item.shortPreviewText}
          </Box>
        )}
        <Box
          display="flex"
          alignItems="center"
          mt={1}
          borderTop={props.item.pinned ? "1px solid white" : "1px solid #707582"}
          pt={1}
        >
          <ResponseIcon color={props.item.pinned ? "white" : "#727F9A"} />
          <Box className={classes.header2} ml={1}>
            {props.item.responses && props.item.responses.length
              ? `${props.item.responses.length} Responses`
              : `0 Responses`}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}, arePropsEqual);

export default WallItem;
