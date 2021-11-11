import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery, useTheme } from "@material-ui/core";
// import axios from "axios";
// import { TwitterShareButton,/* InstapaperShareButton,*/ FacebookShareButton } from "react-share";

import { RootState } from "store/reducers/Reducer";
import WallItemModal from "components/PriviDigitalArt/subpages/ProfilePage/components/MyWall/WallItemModal";

import { Avatar, Color, StyledDivider } from "shared/ui-kit";
// import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
// import URL from "shared/functions/getURL";
import Box from "shared/ui-kit/Box";
import getPhotoIPFS from "shared/functions/getPhotoIPFS";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";

// import { ReactComponent as FacebookIcon } from "assets/snsIcons/facebook.svg";
// import { ReactComponent as TwitterIcon } from "assets/snsIcons/twitter.svg";
// import { ReactComponent as InstagramIcon } from "assets/snsIcons/instagram.svg";

import { wallFeedCardStyles } from "./index.styles";

export default function WallFeedCard({
  item,
  userProfile,
  feedItem,
  type,
}: {
  item: any;
  userProfile: any;
  feedItem?: boolean;
  type?: string;
}) {
  const userSelector = useSelector((state: RootState) => state.user);

  const classes = wallFeedCardStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [feedData, setFeedData] = useState<any>(item);
  const [ownUserWall, setOwnUserWall] = useState<any>(false);
  const [comments, setComments] = useState<any[]>(item.responses || []);

  const [openWallItemModal, setOpenWallItemModal] = useState<any>(false);
  const handleOpenWallItemModal = () => {
    setOpenWallItemModal(true);
  };
  const handleCloseWallItemModal = () => {
    setOpenWallItemModal(false);
  };

  const [imageWallIPFS, setImageWallIPFS] = useState<any>(null);
  const [videoWallIPFS, setVideoWallIPFS] = useState<any>(null);

  const { isIPFSAvailable, downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    if (feedData && isIPFSAvailable) {
      getPhotos(feedData);
    }
  }, [feedData, isIPFSAvailable]);

  useEffect(() => {
    if (userSelector.id === userProfile.id) {
      setOwnUserWall(true);
    } else {
      setOwnUserWall(false);
    }
  }, [feedData]);

  const getPhotos = async feedData => {
    if (feedData?.infoImage?.newFileCID && feedData?.infoImage?.metadata?.properties?.name) {
      let imageUrl = await getPhotoIPFS(
        feedData.infoImage.newFileCID,
        feedData.infoImage.metadata.properties.name,
        downloadWithNonDecryption
      );
      setImageWallIPFS(imageUrl);
    }

    if (feedData?.infoVideo?.newFileCID && feedData?.infoVideo?.metadata?.properties?.name) {
      let videoUrl = await getPhotoIPFS(
        feedData.infoVideo.newFileCID,
        feedData.infoVideo.metadata.properties.name,
        downloadWithNonDecryption,
        feedData.infoVideo.metadata.object_type
      );
      setVideoWallIPFS(videoUrl);
    }
  };

  // const handleFruit = type => {
  //   const body = {
  //     userId: userSelector.id,
  //     fruitId: type,
  //     feedAddress: feedData.id,
  //   };

  //   axios.post(`${URL()}/user/wall/fruit`, body).then(res => {
  //     const resp = res.data;
  //     if (resp.success) {
  //       const itemCopy = { ...feedData };
  //       itemCopy.fruits = [
  //         ...(itemCopy.fruits || []),
  //         { userId: userSelector.id, fruitId: type, date: new Date().getTime() },
  //       ];
  //       setFeedData(itemCopy);
  //     }
  //   });
  // };

  return (
    <>
      <div className={classes.wallItem} onClick={handleOpenWallItemModal}>
        <Box mb={"16px"} display="flex" alignItems="center">
          <Avatar size={"small"} url={feedData.userInfo?.imageUrl ?? getDefaultAvatar()} />
          <Box ml="8px" fontSize="12px">
            {userSelector.id !== feedData.createdBy ? <span>{feedData.userInfo?.name}</span> : "You"}
            {!feedItem
              ? feedData.name === ` ` && feedData.textShort === ` `
                ? userSelector.id !== feedData.createdBy
                  ? ` sent `
                  : ` posted `
                : item.selectedFormat === 2
                ? ` shared on `
                : ` wrote on `
              : ""}
            {!feedItem && ownUserWall
              ? feedData.name === ` ` && feedData.textShort === ` `
                ? userSelector.id !== feedData.createdBy
                  ? "you"
                  : ""
                : "your"
              : ""}
            <span>{!feedItem && !ownUserWall ? `${feedData.userName}` : ""}</span>
            {!feedItem && feedData.name === ` ` && feedData.textShort === ` `
              ? ` an image`
              : !feedItem
              ? `${!ownUserWall ? "'s" : ""} wall`
              : ""}
          </Box>
        </Box>
        <Box mb={"16px"} display="flex" alignItems="flex-start" flexDirection="column" gridColumnGap={16}>
          {imageWallIPFS && (
            <Box display="flex" alignItems="center" justifyContent="center" width={1}>
              <img
                onClick={handleOpenWallItemModal}
                src={imageWallIPFS ? imageWallIPFS : ""}
                className={classes.feedImg}
                alt={"wall"}
                style={{ width: "100%", objectFit: "cover" }}
              />
            </Box>
          )}

          <Box className={classes.feedText}>
            {feedData.name && feedData.name !== ` ` ? <h3>{feedData.name}</h3> : null}
            {feedData.textShort && feedData.textShort !== ` ` && (
              <div className={classes.desc}>{feedData.textShort}</div>
            )}
          </Box>
        </Box>

        {!isMobile && (
          <Box width="100%" onClick={handleOpenWallItemModal}>
            <StyledDivider margin={2} type="solid" color={Color.GrayInputBorderSelected} />
          </Box>
        )}

        {!isMobile && (
          <Box display="flex" alignItems="center" justifyContent="space-between">
            {/* <Box display="flex" alignItems="center">
              <div className={classes.fruitsContainer}>
                <FruitSelect fruitObject={feedData} members={[]} onGiveFruit={handleFruit} />
              </div>
              <TwitterShareButton
                className={classes.shareButton}
                title={feedData.name + "\n" + feedData.textShort + "\n\n"}
                url={window.location.href}
              >
                <TwitterIcon />
              </TwitterShareButton>
              <FacebookShareButton
                className={classes.shareButton}
                title={feedData.name + "\n" + feedData.textShort + "\n\n"}
                url={window.location.href}
              >
                <FacebookIcon />
              </FacebookShareButton>
              <InstapaperShareButton
                className={classes.shareButton}
                title={feedData.name + "\n" + feedData.textShort + "\n\n"}
                url={window.location.href}
              >
                <InstagramIcon />
              </InstapaperShareButton>
            </Box> */}

            {feedData.comments && (
              <Box fontSize="12px" onClick={handleOpenWallItemModal} color="#431AB7">
                {comments && comments.length
                  ? `${comments.length} comment${comments.length > 1 ? "s" : ""}`
                  : `0 comments`}
              </Box>
            )}
          </Box>
        )}
      </div>
      {openWallItemModal && (
        <WallItemModal
          open={openWallItemModal}
          onClose={handleCloseWallItemModal}
          item={feedData}
          comments={comments}
          setComments={setComments}
          creatorImage={feedData.userInfo?.imageUrl ?? getDefaultAvatar()}
          imageWallIPFS={imageWallIPFS}
          videoWallIPFS={videoWallIPFS}
        />
      )}
    </>
  );
}
