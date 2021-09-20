import React from "react";
import Box from "shared/ui-kit/Box";
import URL from "shared/functions/getURL";
import { useMediaSimpleCardStyles } from "./index.styles";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import MediaTermsModal from "components/PriviMusicDao/modals/MediaTermsModal";
import { formatNumber } from "shared/functions/commonFunctions";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import Moment from "react-moment";
import CopyToClipboard from "react-copy-to-clipboard";

const audioPhoto = require("assets/backgrounds/audio.png");

export const MediaSimpleCard = ({ media, pod, handleRefresh }) => {
  const classes = useMediaSimpleCardStyles();
  const { showAlertMessage } = useAlertMessage();

  const { convertTokenToUSD } = useTokenConversion();
  const [openMediaTermsModal, setOpenMediaTermsModal] = React.useState<boolean>(false);

  return (
    <Box className={classes.container}>
      <Box className={classes.podImageContent}>
        <Box
          className={classes.podImage}
          style={{
            backgroundImage: media.HasPhoto
              ? `url(${URL()}/media/getMediaMainPhoto/${media.MediaSymbol.replace(/\s/g, "")})`
              : `url(${audioPhoto})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden",
          }}
        />
      </Box>
      <Box
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
      </Box>

      <Box className={classes.hashtagsBox}>
        {media.Hashtags &&
          media.Hashtags.map((h, i) => (
            <Box className={classes.hashtag} key={`h-${i}`}>
              {h}
            </Box>
          ))}
      </Box>
      <Box mt={26} mx={4} mb={4} zIndex={1}>
        <Box className={classes.title} mt={5}>
          {media.MediaName || "Untitled Media"}
        </Box>
        <Box mt={2} className={classes.header1}>
          {media.Description || "No Description"}
        </Box>
      </Box>

      {!media?.IsRegistered ? (
        <Box display="flex" width="100%" justifyContent="flex-end" pr={4}>
          <button className={classes.button} onClick={() => setOpenMediaTermsModal(true)}>
            Edit Terms
          </button>
        </Box>
      ) : (
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
