import React, { useState, useEffect } from "react";
import { useMediaQuery, useTheme } from "@material-ui/core";
import axios from "axios";
import { useSelector } from "react-redux";
import { Avatar, Color, StyledDivider } from "shared/ui-kit";
import URL from "shared/functions/getURL";
import Box from "shared/ui-kit/Box";
import { RootState } from "store/reducers/Reducer";
import { TwitterShareButton, InstapaperShareButton, FacebookShareButton } from "react-share";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import { wallFeedCardStyles } from "./index.styles";
import { getRandomAvatarForUserIdWithMemoization, getUserAvatar } from "shared/services/user/getUserAvatar";
import WallItemModal from "components/PriviDigitalArt/subpages/ProfilePage/components/MyWall/WallItemModal";

import { ReactComponent as FacebookIcon } from "assets/snsIcons/facebook.svg";
import { ReactComponent as TwitterIcon } from "assets/snsIcons/twitter.svg";
import { ReactComponent as InstagramIcon } from "assets/snsIcons/instagram.svg";
import getPhotoIPFS from "../../../../../shared/functions/getPhotoIPFS";
import useIPFS from "../../../../../shared/utils-IPFS/useIPFS";

export default function WallFeedCard({
  item,
  userProfile,
  feedItem,
  type,
} : {
  item: any;
  userProfile: any;
  feedItem?: boolean;
  type?: string;
}) {
  const userSelector = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  const classes = wallFeedCardStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [feedData, setFeedData] = useState<any>(item);
  const [ownUserWall, setOwnUserWall] = useState<any>(false);
  const [comments, setComments] = useState<any[]>([]);

  const [openWallItemModal, setOpenWallItemModal] = useState<any>(false);
  const handleOpenWallItemModal = () => {
    setOpenWallItemModal(true);
  };
  const handleCloseWallItemModal = () => {
    setOpenWallItemModal(false);
  };

  const [imageIPFS, setImageIPFS] = useState<any>(null);
  const [imageWallIPFS, setImageWallIPFS] = useState<any>(null);
  const [videoWallIPFS, setVideoWallIPFS] = useState<any>(null);

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    if (feedData && ipfs ) {
      getPhotos(feedData);

      if (feedData.comments && feedData.responses?.length > 0) {
        let r = [] as any;
        feedData.responses.forEach(async response => {
          let slug = response.userName;
          let image = "";
          let thisUser = users.find(u => u.id === response.userId);
          if (thisUser) {
            slug = thisUser.urlSlug;
            image = await getReturnUserPhoto(thisUser);
          }
          r.push({ ...response, urlSlug: slug, url: image });
        });

        setComments && setComments(r);
      }
    }
  }, [feedData, users, ipfs]);

  useEffect(() => {
    if (userSelector.id === userProfile.id) {
      setOwnUserWall(true);
    } else {
      setOwnUserWall(false);
    }
  }, [feedData]);

  const getPhotos = async (feedData) => {
    const userFound = users.find(usr => usr.id === feedData.userId);

    if (userFound && userFound.infoImage && userFound.infoImage.newFileCID) {
      let imageUrl = await getPhotoIPFS(userFound.infoImage.newFileCID, downloadWithNonDecryption);
      setImageIPFS(imageUrl);
    }

    if (feedData && feedData.infoImage && feedData.infoImage.newFileCID) {
      let imageUrl = await getPhotoIPFS(feedData.infoImage.newFileCID, downloadWithNonDecryption);
      setImageWallIPFS(imageUrl);
    }

    if (feedData && feedData.infoVideo && feedData.infoVideo.newFileCID) {
      let videoUrl = await getPhotoIPFS(feedData.infoVideo.newFileCID, downloadWithNonDecryption);
      setVideoWallIPFS(videoUrl);
    }

  }

  const getReturnUserPhoto = async (userFound: any) => {
    if (userFound && userFound.infoImage && userFound.infoImage.newFileCID) {
      let imageUrl = await getPhotoIPFS(userFound.infoImage.newFileCID, downloadWithNonDecryption);
      return(imageUrl);
    } else {
      return("");
    }
  }

  const handleFruit = type => {
    const body = {
      userId: userSelector.id,
      fruitId: type,
      feedAddress: feedData.id,
    };

    axios.post(`${URL()}/user/wall/fruit`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        const itemCopy = { ...feedData };
        itemCopy.fruits = [
          ...(itemCopy.fruits || []),
          { userId: userSelector.id, fruitId: type, date: new Date().getTime() },
        ];
        setFeedData(itemCopy);
      }
    });
  };

  return (
    <>
      <div className={classes.wallItem}
           onClick={handleOpenWallItemModal}>
        <Box mb={"16px"} display="flex" alignItems="center">
          <Avatar
            size={"small"}
            url={imageIPFS ?
              imageIPFS : ""
            }
          />
          <Box ml="8px" fontSize="12px">
            {userSelector.id !== feedData.createdBy ? <span>{feedData.userName}</span> : "You"}
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
            <Box display="flex" alignItems="center">
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
              {/* <InstapaperShareButton
                className={classes.shareButton}
                title={feedData.name + "\n" + feedData.textShort + "\n\n"}
                url={window.location.href}
              >
                <InstagramIcon />
              </InstapaperShareButton> */}
            </Box>

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
          creatorImage={imageIPFS}
          imageWallIPFS={imageWallIPFS}
          videoWallIPFS={videoWallIPFS}
        />
      )}
    </>
  );
}
