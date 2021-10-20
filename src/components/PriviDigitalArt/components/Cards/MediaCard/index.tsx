import React, { useRef, useState, useEffect } from "react";
import { Avatar, Color, PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import URL from "shared/functions/getURL";
import { mediaCardStyles } from "./index.styles";
import MediaTermsModal from "components/PriviDigitalArt/modals/MediaTermsModal";
import { IUploadMedia } from "shared/services/API";
import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { useTypedSelector } from "store/reducers/Reducer";
import Moment from "react-moment";

import useIPFS from "shared/utils-IPFS/useIPFS";
import { getUserIpfsAvatar } from "shared/services/user/getUserAvatar";

const videoPhoto = require("assets/backgrounds/video.png");
const videoLivePhoto = require("assets/backgrounds/live_video.png");
const audioPhoto = require("assets/backgrounds/audio.png");
const audioLivePhoto = require("assets/backgrounds/live_audio_1.png");
const blogPhoto = require("assets/backgrounds/blog.png");
const blogSnapPhoto = require("assets/backgrounds/blog_snap.png");
const digitalArtPhoto = require("assets/backgrounds/digital_art_2.png");

export const MediaCard = ({ media, pod, handleRefresh }) => {
  const classes = mediaCardStyles();
  const { showAlertMessage } = useAlertMessage();
  const user = useTypedSelector(state => state.user);
  const [openMediaTermsModal, setOpenMediaTermsModal] = React.useState<boolean>(false);

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const [creators, setCreators] = useState<any[]>([]);

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();
  const users = useTypedSelector(state => state.usersInfoList);

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    const setAvarts = async () => {
      if (pod.CreatorsData?.length && users.length && ipfs && Object.keys(ipfs).length !== 0) {
        setCreators(
          await Promise.all(
            pod.CreatorsData.map(async (user) => {
              const avatar = await getUserIpfsAvatar(user, users, downloadWithNonDecryption);
              return {
                ...user,
                avatar,
              };
            })
          )
        )
      }
    }
    setAvarts();
  }, [ipfs, pod.CreatorsData, users]);

  const getDefaultImage = type => {
    switch (type) {
      case "VIDEO_TYPE":
        return videoPhoto;
      case "LIVE_VIDEO_TYPE":
        return videoLivePhoto;
      case "AUDIO_TYPE":
        return audioPhoto;
      case "LIVE_AUDIO_TYPE":
        return audioLivePhoto;
      case "BLOG_TYPE":
        return blogPhoto;
      case "BLOG_SNAP_TYPE":
        return blogSnapPhoto;
      case "DIGITAL_ART_TYPE":
        return digitalArtPhoto;
      default:
        return "none";
    }
  };

  const handleOpenSignatureModal = () => {
    let payload: IUploadMedia = {
      MediaSymbol: media.MediaSymbol,
      PodAddress: pod.PodAddress,
    };
    payloadRef.current = payload;
    setSignRequestModalDetail(buildJsxFromObject(payload));
    setOpenSignRequestModal(true);
  };

  const handleConfirm = () => {
    const payload = payloadRef.current;
    if (payload && Object.keys(payload)) {
      // musicDaoUploadMedia(payload, {}).then(resp => {
      //   if (resp?.success) {
      //     showAlertMessage("Media uploaded", { variant: "success" });
      //     handleRefresh();
      //   } else showAlertMessage("Media upload failed", { variant: "error" });
      // });
    }
  };

  return (
    <Box className={classes.container}>
      <SignatureRequestModal
        open={openSignRequestModal}
        address={user.address}
        transactionFee="0.0000"
        detail={signRequestModalDetail}
        handleOk={handleConfirm}
        handleClose={() => setOpenSignRequestModal(false)}
      />
      <Box className={classes.podImageContent}>
        <Box
          className={classes.podImage}
          style={{
            backgroundImage: media.HasPhoto
              ? `url(${URL()}/media/getMediaMainPhoto/${media.MediaSymbol.replace(/\s/g, "")})`
              : `url(${getDefaultImage(media.Type)})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden",
          }}
        />
      </Box>
      <Box className={`${classes.flexBox} ${classes.avatarBox}`}>
        {creators.map((item, index) => (
          <Box ml={item > 1 ? "-16px" : 0} key={index} className={classes.flexBox}>
            <Avatar
              size="small"
              url={item.avatar}
              alt=""
            />
          </Box>
        ))}
        {creators.length > 3 && <Box className={classes.moreBox}>{creators.length - 3}</Box>}
      </Box>
      <Box
        className={classes.fractionBox}
        style={media.IsRegistered ? { background: Color.MusicDAOGreen } : {}}
      >
        <Box className={classes.flexBox}>
          <Box>
            {media.IsRegistered ? "Released" : "Release Date: "}
            {!media.IsRegistered && (
              <span>
                <Moment format="MM.DD.YYYY">{media.ReleaseDate}</Moment>
              </span>
            )}
          </Box>
        </Box>
      </Box>
      <Box className={classes.genreBox}>Pop</Box>
      <Box mt={30} mx={4} zIndex={1}>
        <Box className={classes.title} mt={2}>
          {media.MediaName || "Untitled Media"}
        </Box>
        <Box mt={2} className={classes.header1}>
          {media.Description || "No Description"}
        </Box>
      </Box>
      {media?.IsRegistered && (
        <Box mx={4}>
          <Box
            py={3}
            className={classes.flexBox}
            width={1}
            style={{ borderBottom: "1px dashed #18181820" }}
            justifyContent="space-between"
          >
            <Box className={classes.header2}>Revenue</Box>
            <Box className={classes.header3}>$ 2.11098</Box>
          </Box>
          <Box
            py={3}
            className={classes.flexBox}
            width={1}
            style={{ borderBottom: "1px dashed #18181820" }}
            justifyContent="space-between"
          >
            <Box className={classes.header2}>Number of reproductions</Box>
            <Box className={classes.header3}>245</Box>
          </Box>
          <Box pt={3} className={classes.flexBox} width={1} justifyContent="space-between">
            <Box className={classes.header2}>NFT Address</Box>
            <Box className={classes.header3}>
              {pod.PodAddress.substring(0, 6) +
                "..." +
                pod.PodAddress.substring(pod.PodAddress.length - 4, pod.PodAddress.length)}
            </Box>
          </Box>
        </Box>
      )}
      <Box mt={2} className={classes.flexBox} justifyContent="flex-end" mx={4} mb={4}>
        {!media?.IsRegistered && (
          <PrimaryButton
            size="medium"
            onClick={() => setOpenMediaTermsModal(true)}
            isRounded
            style={{ minWidth: "35%" }}
          >
            Edit Terms
          </PrimaryButton>
        )}
        {!media?.IsUploaded && pod.RaisedFunds >= pod.FundingTarget && (
          <PrimaryButton size="medium" onClick={handleOpenSignatureModal}>
            Upload Media
          </PrimaryButton>
        )}
      </Box>
      {openMediaTermsModal && (
        <MediaTermsModal
          open={openMediaTermsModal}
          handleClose={() => setOpenMediaTermsModal(false)}
          pod={pod}
          media={media}
          handleRefresh={handleRefresh}
        />
      )}
    </Box>
  );
};
