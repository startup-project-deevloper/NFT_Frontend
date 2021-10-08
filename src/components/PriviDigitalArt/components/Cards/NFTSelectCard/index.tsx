import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import cls from "classnames";
import ReactPlayer from "react-player";
import { useHistory } from "react-router-dom";
import Box from "shared/ui-kit/Box";
import { useAuth } from "shared/contexts/AuthContext";
import { getLoanChainImageUrl } from "shared/functions/chainFucntions";
import { onGetDecrypt, onGetNonDecrypt } from "shared/ipfs/get";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import { StyledSkeleton } from "shared/ui-kit/Styled-components/StyledComponents";

const useNFTSelectCardStyles = makeStyles(theme => ({
  card: {
    background: "#ffffff",
    boxShadow: "0px 4px 8px #9EACF2",
    borderRadius: 22,
    cursor: "pointer",
    minWidth: 276,
    widht: "100%",
    height: "fit-content",
    padding: 16,
  },
  black: {
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 14,
    lineHeight: "120%",
    color: "#1a1b1c",
  },
  media: {
    width: "100%",
    marginBottom: "16px",
    borderRadius: 16,
    height: "auto",
    minHeight: 258,
  },
  fixed: {
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor: "#c4c4c4",
    height: 258,
    maxHeight: 258,
  },
  title: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: "18px !important",
    maxWidth: "250px",
  },
  chain: {
    width: 22,
    height: 22,
    objectFit: "contain",
    borderRadius: "50%",
  },
  reactPlayer: {
    width: "100% !important",
    height: "100% !important",
  },
  selectedButton: {
    background: "#431AB7",
    borderRadius: "4px",
    color: "#FFFFFF",
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "18px",
    textAlign: "center",
    padding: "8px 32px",
    minHeight: 0,
    width: "100%",
  },
  button: {
    background: "#DDFF57",
    borderRadius: "4px",
    color: "#431AB7",
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "18px",
    textAlign: "center",
    padding: "8px 32px",
    minHeight: 0,
    width: "100%",
  },
}));

const getRandomImageUrl = () => {
  return require(`assets/backgrounds/digital_art_1.png`);
};

const NFTSelectCard = ({ item, handleSelect }) => {
  const classes = useNFTSelectCardStyles();
  const history = useHistory();
  const { isSignedin } = useAuth();

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  const [media, setMedia] = React.useState<any>(item);
  const [imageIPFS, setImageIPFS] = useState('');

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    const GENERATOR_ARTBLOCK_URL = "https://generator.artblocks.io/";
    const API_ARTBLOCK_URL = "https://api.artblocks.io/image/";
    const newItem = Object.assign({}, item);
    if (newItem?.url && newItem.url.includes(GENERATOR_ARTBLOCK_URL)) {
      newItem.url = newItem.url.replace(GENERATOR_ARTBLOCK_URL, API_ARTBLOCK_URL);
    }
    setMedia(newItem);
  }, [item]);

  useEffect(() => {
    if (media.cid) {
      getImageIPFS(media.cid);
    }
  }, [ipfs, media]);

  const handleOpenDigitalArtModal = () => {
    if (isSignedin && media) {
      let queryParam = "";
      if (media.tag) queryParam += (queryParam ? "&" : "") + `blockchainTag=${media.tag}`;
      if (media.collection) queryParam += (queryParam ? "&" : "") + `collectionTag=${media.collection}`;
      history.push(`/nft/${encodeURIComponent(media.MediaSymbol ?? media.id)}?${queryParam}`);
    }
  };

  const getImageIPFS = async (cid: string) => {
    let files = await onGetNonDecrypt(cid, (fileCID, download) =>
      downloadWithNonDecryption(fileCID, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.content);
      setImageIPFS("data:image/png;base64," + base64String);
    }
  };

  return (
    <div className={classes.card}>
      {!media.UrlMainPhoto && !media.Url && media.url?.endsWith("mp4") ? (
        <div style={{ borderRadius: "16px", position: "relative", overflow: "hidden" }}>
          <Box className={cls(classes.media)}>
            <ReactPlayer
              url={media.url}
              className={classes.reactPlayer}
              muted={true}
              loop={true}
              playing={true}
            />
          </Box>
        </div>
      ) : (
        media?.cid && !imageIPFS ? (
          <Box my={1}>
            <StyledSkeleton width="100%" height={258} variant="rect" />
          </Box>
        ) : (
        <div
          className={cls(classes.media, classes.fixed)}
          style={{
            backgroundImage: `url(${
              media.cid
                ? imageIPFS
                : media.Type && media.Type !== "DIGITAL_ART_TYPE"
                ? media.UrlMainPhoto
                : media.UrlMainPhoto ?? media.Url ?? media.url ?? getRandomImageUrl()
            })`,
          }}
          onClick={handleOpenDigitalArtModal}
        />
      ))}

      <Box display="flex" alignItems="center" justifyContent="space-between" mb="16px">
        <div className={cls(classes.black, classes.title)}>{media.MediaName ?? media.title}</div>
        <img
          src={getLoanChainImageUrl(item?.Chain, media?.BlockchainNetwork)}
          alt={"Chain"}
          className={classes.chain}
        />
      </Box>

      <button
        onClick={() => handleSelect(item.MediaSymbol)}
        className={item.selected ? classes.selectedButton : classes.button}
      >
        {`${item.selected ? "Unselect" : "Select"} NFT`}
      </button>
    </div>
  );
};

export default NFTSelectCard;
