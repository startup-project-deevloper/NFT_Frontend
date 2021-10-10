import React, { useEffect, useState } from "react";
import Box from "shared/ui-kit/Box";
import { useSelector } from "react-redux";
import CopyToClipboard from "react-copy-to-clipboard";

import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import MediaTermsModal from "components/PriviDigitalArt/modals/MediaTermsModal";
import MediaUploadModal from "components/PriviDigitalArt/modals/MediaUploadModal";
import { _arrayBufferToBase64, formatNumber } from "shared/functions/commonFunctions";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import useIPFS from "../../../../../shared/utils-IPFS/useIPFS";
import { onGetNonDecrypt } from "../../../../../shared/ipfs/get";
import { RootState } from "store/reducers/Reducer";
import { useMediaSimpleCardStyles } from "./index.styles";
import MusicPlayer from "components/PriviDigitalArt/subpages/PodPageIndividual/subPages/Media/MusicPlayer";

const audioPhoto = require("assets/backgrounds/audio.png");

export const MediaSimpleCard = ({ media, pod, handleRefresh }) => {
  const classes = useMediaSimpleCardStyles();
  const { showAlertMessage } = useAlertMessage();
  const user = useSelector((state: RootState) => state.user);

  const { convertTokenToUSD } = useTokenConversion();
  const [openMediaTermsModal, setOpenMediaTermsModal] = React.useState<boolean>(false);
  const [openMediaUploadModal, setOpenMediaUploadModal] = React.useState<boolean>(false);

  const [isCollab, setIsCollab] = useState<boolean>(false);
  const [isFunding, setIsFunding] = useState<boolean>(false);
  const [isFunded, setIsFunded] = useState<boolean>(false);
  const [isFundingFailed, setIsFundingFailed] = useState<boolean>(false);

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  const [imageIPFS, setImageIPFS] = useState<any>(null);

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    if (media.metadataPhoto && media.metadataPhoto.newFileCID && ipfs) {
      downloadMediaPhotoIPFS(media.metadataPhoto.newFileCID);
    }
  }, [media, ipfs]);

  useEffect(() => {
    if (pod && pod.Collabs) {
      if (pod.Collabs.filter(collab => collab.address === user.address).length > 0) {
        setIsCollab(true);
      } else {
        setIsCollab(false);
      }
    }

    if (pod && pod.FundingDate && pod.distributionProposalAccepted) {
      if (pod.FundingDate - new Date().getTime() / 1000 > 0) {
        setIsFunding(true);
      }

      if (pod.RaisedFunds && pod.FundingTarget) {
        if (pod.FundingDate - new Date().getTime() / 1000 <= 0 && pod.RaisedFunds >= pod.FundingTarget) {
          setIsFunded(true);
        }
        if (pod.FundingDate - new Date().getTime() / 1000 <= 0 && pod.RaisedFunds < pod.FundingTarget) {
          setIsFundingFailed(true);
        }
      }
    }
  }, [pod]);

  const downloadMediaPhotoIPFS = async (newFileCID: any) => {
    let files = await onGetNonDecrypt(newFileCID, (fileCID, download) =>
      downloadWithNonDecryption(fileCID, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.content);
      setImageIPFS("data:image/png;base64," + base64String);
    }
  };

  return (
    <Box className={classes.container}>
      <Box className={classes.podImageContent}>
        <Box
          className={classes.podImage}
          style={{
            backgroundImage: imageIPFS ? `url(${imageIPFS})` : `url(${audioPhoto})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden",
          }}
        />
      </Box>
      {/* <Box
        className={classes.releaseBox}
        style={{
          background:
            media?.ReleaseDate && new Date().getTime() < new Date(media?.ReleaseDate).getTime()
              ? "#7F6FFF"
              : "#65CB63",
        }}
      >
        <Box className={classes.flexBox}>
          {media?.ReleaseDate && new Date().getTime() < new Date(media?.ReleaseDate).getTime() ? (
            <>
              <Box mr={1}>Release date:</Box> <Moment format="DD.MM.YY">{media?.ReleaseDate}</Moment>
            </>
          ) : (
            "Released"
          )}
        </Box>
      </Box> */}

      {media.metadataMedia &&
        <Box
          className={classes.releaseBox}
          style={{
            background: "#65CB63",
          }}
        >
          Track Uploaded
        </Box>
      }

      <Box className={classes.hashtagsBox}>
        {media.Hashtags &&
          media.Hashtags.map((tag, i) => (
            <Box className={classes.hashtag} key={`h-${i}`}>
              {tag}
            </Box>
          ))}
      </Box>
      <Box mt={26} mx={4} mb={4} zIndex={1}>
        <Box className={classes.title} style={{ display: "inline-flex", marginTop: 0 }} mt={5}>
          {media.Title || "Untitled Media"}
          {media.Genre ? (
            <p style={{ color: "grey", margin: 0, paddingLeft: 10 }}>({media.Genre || ""})</p>
          ) : null}
        </Box>
        {media.Description ? (
          <Box mt={2} className={classes.header1}>
            {media.Description || ""}
          </Box>
        ) : null}
      </Box>

      {media.metadataMedia ? (
        <Box mx={4}>
          <MusicPlayer
            media={media.metadataMedia}
          />
        </Box>
      ) : media?.IsRegistered ? (
        <Box mx={4}>
          <Box className={classes.contentBox}>
            <Box className={classes.header2}>Revenue</Box>
            <Box className={classes.header3}>
              {formatNumber(convertTokenToUSD(pod.FundingToken, pod.Price), "USD", 2).toLocaleString()}
            </Box>
          </Box>
          <Box className={classes.contentBox}>
            <Box className={classes.header2}>Number of reproductions</Box>
            <Box className={classes.header3}>{pod.Reproductions ?? 0}</Box>
          </Box>
          <Box display="flex" width="100%" justifyContent="space-between">
            <Box className={classes.header2}>NFT Address</Box>
            <CopyToClipboard
              text={
                pod.PodAddress
                  ? `${pod.PodAddress.slice(0, 6)}...${pod.PodAddress.slice(
                    pod.PodAddress.length - 7,
                    pod.PodAddress.length - 1
                  )}`
                  : "N/A"
              }
              onCopy={() => {
                showAlertMessage("Copied to clipboard", { variant: "success" });
              }}
            >
              <Box className={classes.address}>
                <Box>
                  {pod.PodAddress
                    ? `${pod.PodAddress.slice(0, 6)}...${pod.PodAddress.slice(
                      pod.PodAddress.length - 7,
                      pod.PodAddress.length - 1
                    )}`
                    : "N/A"}
                </Box>

                <CopyIcon />
              </Box>
            </CopyToClipboard>
          </Box>
        </Box>
      ) : isCollab ? (
        <Box display="flex" width="100%" justifyContent="flex-end" pr={4}>
          {isFunding && (
            <button className={classes.button} onClick={() => setOpenMediaTermsModal(true)}>
              Edit Terms
            </button>
          )}
          {isFunded && (
            <button
              className={classes.button}
              style={{
                color: "black",
                backgroundColor: "transparent",
                border: "1px solid black",
                marginLeft: 10,
              }}
              onClick={() => setOpenMediaUploadModal(true)}
            >
              Upload media
            </button>
          )}
        </Box>
      ) : (
        <></>
      )}
      {openMediaTermsModal && (
        <MediaTermsModal
          open={openMediaTermsModal}
          handleClose={() => setOpenMediaTermsModal(false)}
          pod={pod}
          media={media}
          handleRefresh={handleRefresh}
        />
      )}
      {openMediaUploadModal && (
        <MediaUploadModal
          open={openMediaUploadModal}
          handleClose={() => setOpenMediaUploadModal(false)}
          pod={pod}
          media={media}
          handleRefresh={handleRefresh}
        />
      )}
    </Box>
  );
};

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
    <path
      d="M14.4424 1.16676L6.22155 9.08343M14.4424 1.16676L14.4425 5.91675M14.4424 1.16676L9.50994 1.16675M6.22158 1.16676H1.28906V13.8334H14.4424V9.08342"
      stroke="#2D3047"
      stroke-width="1.1875"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
