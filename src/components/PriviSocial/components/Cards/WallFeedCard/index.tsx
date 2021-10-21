import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Avatar, Color, StyledDivider } from "shared/ui-kit";
import URL from "shared/functions/getURL";
import Box from "shared/ui-kit/Box";
import { RootState } from "store/reducers/Reducer";
import { TwitterShareButton, InstapaperShareButton, FacebookShareButton } from "react-share";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import WallItemModal from "../../../subpages/Home/components/MyWall/WallItemModal";
import { wallFeedCardStyles } from "./index.styles";
import { getRandomAvatar, getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import getPhotoIPFS from "../../../../../shared/functions/getPhotoIPFS";
import useIPFS from "../../../../../shared/utils-IPFS/useIPFS";

const twitterIcon = require("assets/snsIcons/twitter_gray.png");
const instagramIcon = require("assets/snsIcons/instagram_gray.png");
const facebookIcon = require("assets/snsIcons/facebook_gray.png");

export default function WallFeedCard({
  item,
  userProfile,
  feedItem,
}: {
  item: any;
  userProfile: any;
  feedItem?: boolean;
}) {
  const userSelector = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  const classes = wallFeedCardStyles();

  const [feedData, setFeedData] = useState<any>(item);
  const [ownUserWall, setOwnUserWall] = useState<any>(false);
  const [onlyTitle, setOnlyTitle] = useState<any>(false);
  const [readMore, setReadMore] = useState<any>(false);
  const descRef = useRef<HTMLHeadingElement>(null);
  const [descHeight, setDescHeight] = useState<number>(0);
  const [comments, setComments] = useState<any[]>([]);

  const [openWallItemModal, setOpenWallItemModal] = useState<any>(false);
  const handleOpenWallItemModal = () => {
    setOpenWallItemModal(true);
  };
  const handleCloseWallItemModal = () => {
    setOpenWallItemModal(false);
  };
  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  const [imageAuthorIPFS, setImageAuthorIPFS] = useState<any>(null);

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    if (feedData && feedData.createdBy && ipfs ) {
      getUserPhotoIpfs(feedData.createdBy);
    }
  }, [feedData, ipfs]);

  const getUserPhotoIpfs = async (userId: any) => {
    const author = users.find(user => user.id == userId);

    if (author && author.infoImage && author.infoImage.newFileCID) {
      let imageUrl = await getPhotoIPFS(author.infoImage.newFileCID, downloadWithNonDecryption);
      setImageAuthorIPFS(imageUrl);
    }
  };

  useEffect(() => {
    if (feedData.comments && feedData.responses?.length > 0) {
      let r = [] as any;
      feedData.responses.forEach(response => {
        let slug = response.userName;
        let image = "";
        let thisUser = users.find(u => u.id === response.userId);
        if (thisUser) {
          slug = thisUser.urlSlug;
        }

        r.push({
          ...response,
          urlSlug: slug,
          url: thisUser?.ipfsImage ?? `url(${require(`assets/anonAvatars/ToyFaces_Colored_BG_111.jpg`)})`,
        });
      });

      setComments && setComments(r);
    }
  }, [feedData, users]);


  useEffect(() => {
    if (userSelector.id === userProfile.id) {
      setOwnUserWall(true);
    } else {
      setOwnUserWall(false);
    }

    if (
      feedData &&
      feedData.name &&
      feedData.name !== "" &&
      feedData.name !== ` ` &&
      (!feedData.descriptionArray ||
        (feedData.descriptionArray &&
          (feedData.descriptionArray[0] === "" || feedData.descriptionArray[0] === undefined))) &&
      (feedData.textShort === "" || feedData.textShort === ` ` || !feedData.textShort) &&
      feedData.hasPhoto === false &&
      ((feedData.descriptionImages && feedData.descriptionImages.length === 0) || !feedData.descriptionImages)
    ) {
      setOnlyTitle(true);
    }
    if (descRef.current && feedData) {
      setDescHeight(descRef.current.offsetHeight);
    }
  }, [feedData]);

  //resize desc
  useEffect(() => {
    const handleResize = () => {
      if (descRef.current && feedData) {
        setDescHeight(descRef.current.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
    //eslint-disable react-hooks/exhaustive-deps
  }, [descRef, feedData]);

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
    <div className={classes.wallItem}>
      <Box mb={"16px"} display="flex" alignItems="center">
        <Avatar size={"small"} url={imageAuthorIPFS ? imageAuthorIPFS : getRandomAvatar()} />

        <Box ml="8px" fontSize="12px">
          {userSelector.id !== feedData.createdBy ? <span>{feedData.userName}</span> : "You"}
          {!feedItem
            ? feedData.name === ` ` && feedData.textShort === ` `
              ? userSelector.id !== feedData.createdBy
                ? ` sent `
                : ` posted `
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

      {feedData.hasPhoto && (feedData?.url || feedData?.imageURL) ? (
        <img
          onClick={handleOpenWallItemModal}
          src={feedData?.url ?? feedData?.imageURL}
          className={classes.postImage}
          alt={"wall"}
          style={feedData.dimensions ? { height: "auto" } : { height: "200px", objectFit: "cover" }}
        />
      ) : null}

      {!feedData.hasPhoto ? (
        <Box onClick={handleOpenWallItemModal}>
          {feedData.name && feedData.name !== ` ` ? <h3>{feedData.name}</h3> : null}
          {feedData.textShort && feedData.textShort !== ` ` ? (
            <div className={classes.desc}>
              <p style={{ maxHeight: readMore ? "none" : "140px" }} ref={descRef}>
                {feedData.textShort}
              </p>
              {descHeight >= 140 && !readMore ? (
                <span
                  className={classes.readMore}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setReadMore(true);
                  }}
                >
                  ... Read More
                </span>
              ) : null}
            </div>
          ) : null}
        </Box>
      ) : (
        <>
          <h3 onClick={handleOpenWallItemModal}>{feedData.name}</h3>
        </>
      )}

      <Box width="100%" onClick={handleOpenWallItemModal}>
        <StyledDivider margin={2} type="solid" color={Color.GrayInputBorderSelected} />
      </Box>

      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <div className={classes.fruitsContainer}>
            <FruitSelect
              fruitObject={feedData}
              members={[]}
              onGiveFruit={handleFruit}
            />
          </div>
          <TwitterShareButton
            className={classes.shareButton}
            title={feedData.name + "\n" + feedData.textShort + "\n\n"}
            url={window.location.href}
          >
            <img className={classes.shareImg} src={twitterIcon} alt="twitter" />
          </TwitterShareButton>
          <InstapaperShareButton
            className={classes.shareButton}
            title={feedData.name + "\n" + feedData.textShort + "\n\n"}
            url={window.location.href}
          >
            <img className={classes.shareImg} src={instagramIcon} alt="twitter" />
          </InstapaperShareButton>
          <FacebookShareButton
            className={classes.shareButton}
            title={feedData.name + "\n" + feedData.textShort + "\n\n"}
            url={window.location.href}
          >
            <img className={classes.shareImg} src={facebookIcon} alt="twitter" />
          </FacebookShareButton>
        </Box>

        {feedData.comments ? (
          <Box fontSize="12px" onClick={handleOpenWallItemModal}>
            {comments && comments.length
              ? `${comments.length} comment${comments.length > 1 ? "s" : ""}`
              : `0 comments`}
          </Box>
        ) : null}
      </Box>
      <WallItemModal
        open={openWallItemModal}
        onClose={handleCloseWallItemModal}
        item={feedData}
        comments={comments}
        setComments={setComments}
      />
    </div>
  );
}
