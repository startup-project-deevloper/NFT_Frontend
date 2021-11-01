import React, { useState, useEffect } from "react";
import { Fade, Tooltip } from "@material-ui/core";
import { Color, Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { mediaUploadModalStyles } from "./index.styles";
import Box from "shared/ui-kit/Box";
import { InfoIcon } from "shared/ui-kit/Icons";
import FileUpload from "shared/ui-kit/Page-components/FileUpload";
import axios from "axios";
import URL from "../../../../shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import { getUser } from "store/selectors";
import CopyToClipboard from "react-copy-to-clipboard";
import { ReactComponent as CopyIcon } from "assets/icons/copy-icon.svg";
import useIPFS from "../../../../shared/utils-IPFS/useIPFS";
import { onUploadNonEncrypt } from "../../../../shared/ipfs/upload";
import URLTraxMicroservice from "../../../../shared/functions/getURLTraxMicroservice";
import getIPFSURL from "shared/functions/getIPFSURL";
import { getURLfromCID, uploadNFTMetaData } from "shared/functions/ipfs/upload2IPFS";

const multiAddr = getIPFSURL();

const MediaUploadModal = ({ open, handleClose, pod, media, handleRefresh }) => {
  const classes = mediaUploadModalStyles();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const user = useTypedSelector(getUser);

  const [mediaCopy, setMediaCopy] = useState<any>({
    PodAddress: "",
    MediaSymbol: "",
    Type: "",
    PaymentType: "DYNAMIC",
    Copies: 0,
    Royalty: 0,
    FundingToken: "USDT",
    ReleaseDate: Math.floor(Date.now() / 1000),
    PricePerSecond: 0,
    Price: 0,
    IsRecord: false,
    RecordToken: "USDT",
    RecordPaymentType: "DYNAMIC",
    RecordPrice: 0,
    RecordPricePerSecond: 0,
    RecordCopies: 0,
    RecordRoyalty: 0,
    Title: "",
    Description: "",
    ExclusivePermissions: false,
    RewardToken: "USDT",
    RewardPrice: 0,
  });

  const [upload, setUpload] = useState<any>(null);
  const [uploadImg, setUploadImg] = useState<any>(null);
  const [upload1, setUpload1] = useState<any>(null);
  const [uploadImg1, setUploadImg1] = useState<any>(null);

  const {
    ipfs,
    setMultiAddr,
    uploadWithNonEncryption,
    downloadWithNonDecryption,
    upload: upload2IPFS,
  } = useIPFS();

  useEffect(() => {
    setMultiAddr(multiAddr);

    console.log("infooo", pod, media);
  }, []);

  // set pod address and media symbol
  useEffect(() => {
    setMediaCopy(media);
    console.log(media);
  }, [pod.PodAddress, media.MediaSymbol]);

  const saveProgress = async () => {
    setIsSaving(true);

    let infoImage = await onUploadNonEncrypt(upload, file => uploadWithNonEncryption(file));
    let infoSong = await onUploadNonEncrypt(upload1, file => uploadWithNonEncryption(file));

    let body: any = {
      podId: pod.Id,
      mediaId: media.Title,
      podType: "PIX",
      metadataPhoto: infoImage,
      metadataMedia: infoSong,
    };

    console.log({ body });
    axios
      .post(`${URL()}/mediaPod/media/saveMetadataIPFS`, body)
      .then(res => {
        console.log(res);
        if (res.data?.success) {
          handleRefresh();
        }
        setIsSaving(false);
        setIsSaved(true);
      })
      .catch(error => {
        console.log(error);
        setIsSaving(false);
        setIsSaved(true);
      });

    const metaData = {
      name: media.Title,
      description: "",
      external_url: `${window.location.href}`,
      image: `${getURLfromCID(infoImage?.newFileCID)}/${upload.name}`, //FIXME
    };
    const uri = getURLfromCID((await uploadNFTMetaData(metaData)).cid);
    console.log({ uri, metaData, audioIPFSURL: `${getURLfromCID(infoSong?.newFileCID)}/${upload1.name}` }); //FIXME
    // audio ipfs url
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
    }, 4000);
    // axios
    //   .post(`${URL()}/musicDao/media/saveMedia`, {
    //     media: mediaCopy,
    //     podId: pod.Id,
    //   })
    //   .then(response => {
    //     const resp = response.data;
    //     setIsSaving(false);
    //     if (resp.success) {
    //       setIsSaved(true);
    //     }
    //   })
    //   .catch(e => {
    //     setIsSaving(false);
    //   });
  };

  const EditScreen = () => (
    <>
      <Box className={classes.title} textAlign="center" mt={2}>
        Upload Media
      </Box>
      <Box className={classes.header1} textAlign="center" mt={2}>
        Upload song and song image
      </Box>
      <Box mt={2}>
        <Box className={classes.flexBox} justifyContent="space-between">
          <Box className={classes.header1}>Song Image</Box>
          <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
            <InfoIcon style={{ color: "#2D3047", width: "14px" }} />
          </Tooltip>
        </Box>
        <Box width={1} className={uploadImg ? classes.uploadBox : ""} mt={1}>
          <FileUpload
            theme="music dao"
            photo={upload}
            photoImg={uploadImg}
            setterPhoto={setUpload}
            setterPhotoImg={setUploadImg}
            mainSetter={undefined}
            mainElement={undefined}
            type="image"
            canEdit
            isEditable
            extra
          />
        </Box>
      </Box>
      <Box mt={2}>
        <Box className={classes.flexBox} justifyContent="space-between" mb={1}>
          <Box className={classes.header1}>Upload Song</Box>
        </Box>
        <FileUpload
          theme="music dao"
          photo={upload1}
          photoImg={uploadImg1}
          setterPhoto={setUpload1}
          setterPhotoImg={setUploadImg1}
          mainSetter={undefined}
          mainElement={undefined}
          type="audio"
          canEdit
          // isBitrate  //FIXME
        />
      </Box>
    </>
  );

  const ProgressScreen = () => (
    <>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Box className={classes.loadingContainer} mt={3} p={1}>
          <LoadingIcon />
        </Box>
      </Box>
      <Box className={classes.title} textAlign="center" mt={2}>
        Adding Song in Progress
      </Box>
      <Box className={classes.header1} textAlign="center" mt={2}>
        Transaction is proceeding on {media.BlockchainNetwork || media.blockchain || "Polygon"}.
        <br /> This can take a moment, please be patient...
      </Box>
      <CopyToClipboard text={user.address}>
        <Box mt="20px" display="flex" alignItems="center" className={classes.header1} justifyContent="center">
          Hash:
          <Box color={Color.Green} mr={1} ml={1}>
            {user.address.substr(0, 18) + "..." + user.address.substr(user.address.length - 3, 3)}
          </Box>
          <CopyIcon />
        </Box>
      </CopyToClipboard>
      <PrimaryButton size="medium" style={{ background: Color.Green, marginTop: 24 }} isRounded>
        Check on Privi Scan
      </PrimaryButton>
    </>
  );

  const SavedScreen = () => (
    <>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Box className={classes.succededContainer} mt={3} p={1}>
          <SuccededIcon />
        </Box>
      </Box>
      <Box className={classes.title} textAlign="center" mt={2}>
        Song NFT Created and added
      </Box>
      <Box className={classes.header1} textAlign="center" mt={2}>
        Transaction is proceeding on {media.BlockchainNetwork || media.blockchain || "Polygon"}.
        <br /> This can take a moment, please be patient...
      </Box>
      <CopyToClipboard text={user.address}>
        <Box mt="20px" display="flex" alignItems="center" className={classes.header1} justifyContent="center">
          Hash:
          <Box color={Color.Green} mr={1} ml={1}>
            {user.address.substr(0, 18) + "..." + user.address.substr(user.address.length - 3, 3)}
          </Box>
          <CopyIcon />
        </Box>
      </CopyToClipboard>
      <PrimaryButton
        size="medium"
        style={{ background: Color.MusicDAODark, marginTop: 24 }}
        isRounded
        onClick={handleClose}
      >
        Done
      </PrimaryButton>
    </>
  );

  return (
    <>
      <Modal
        size="medium"
        isOpen={open}
        onClose={handleClose}
        showCloseIcon
        style={{ maxWidth: 755, textAlign: "center" }}
      >
        {!isSaving && !isSaved ? EditScreen() : isSaving ? ProgressScreen() : SavedScreen()}
        {!isSaving && !isSaved && (
          <Box className={classes.footer} mt={3}>
            <Box className={classes.footerLeft}>
              <SecondaryButton size="medium" onClick={handleClose} isRounded>
                Cancel
              </SecondaryButton>
            </Box>
            <Box className={classes.footerRight} width="40%">
              <PrimaryButton
                size="medium"
                onClick={() => {
                  if (upload && upload1) saveProgress();
                }}
                isRounded
                style={{ width: "100%", background: Color.MusicDAODark }}
                disabled={!upload || !upload1}
              >
                Upload
              </PrimaryButton>
            </Box>
          </Box>
        )}
      </Modal>
    </>
  );
};

export default MediaUploadModal;

const LoadingIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M66.8652 105.745C67.4512 108.558 65.6408 111.336 62.7858 111.652C55.3161 112.481 47.7364 111.826 40.4945 109.706C31.5837 107.097 23.4595 102.351 16.8415 95.8864C10.2236 89.4222 5.31629 81.4401 2.5542 72.6472C-0.207895 63.8543 -0.739476 54.5219 1.00654 45.4767C2.75256 36.4315 6.72228 27.9527 12.5641 20.7913C18.4059 13.63 25.9394 8.00711 34.4974 4.42078C43.0554 0.834452 52.3736 -0.604625 61.6268 0.23102C69.1311 0.908725 76.4046 3.06558 83.0269 6.55585C85.5824 7.90271 86.2438 11.1733 84.6467 13.5803C83.0679 15.9597 79.8765 16.5915 77.3252 15.3088C72.1429 12.7033 66.4951 11.0867 60.6771 10.5613C53.138 9.88043 45.5458 11.0529 38.573 13.975C31.6002 16.897 25.4622 21.4783 20.7025 27.3132C15.9428 33.148 12.7084 40.0562 11.2858 47.426C9.86318 54.7957 10.2963 62.3994 12.5468 69.5636C14.7972 76.7278 18.7956 83.2313 24.1876 88.4981C29.5797 93.7649 36.199 97.6323 43.4593 99.7579C49.0615 101.398 54.912 101.962 60.6982 101.437C63.5448 101.178 66.2822 102.947 66.8652 105.745Z"
      fill="url(#paint_loading_angular)"
    />
    <defs>
      <radialGradient
        id="paint_loading_angular"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(62.4503 65.2474) rotate(-64.8708) scale(84.9933 85.4796)"
      >
        <stop offset="0.0665921" stop-color="#B3FFD1" />
        <stop offset="0.392889" stop-color="#91E5D2" stop-opacity="0" />
        <stop offset="0.817708" stop-color="#A8DC1A" />
        <stop offset="0.984387" stop-color="#18CFA3" />
      </radialGradient>
    </defs>
  </svg>
);

const SuccededIcon = () => (
  <svg width="103" height="103" viewBox="0 0 103 103" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="51.5" cy="51.5" r="51.5" fill="#F2FBF6" />
    <path
      d="M37.7061 51.4688L46.9229 60.6856L65.294 42.3145"
      stroke="url(#paint_succeded_linear)"
      stroke-width="8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <defs>
      <linearGradient
        id="paint_succeded_linear"
        x1="39.7943"
        y1="50.7407"
        x2="63.7368"
        y2="55.5569"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.179206" stop-color="#A0D800" />
        <stop offset="0.852705" stop-color="#0DCC9E" />
      </linearGradient>
    </defs>
  </svg>
);
