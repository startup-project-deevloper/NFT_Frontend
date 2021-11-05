import React, { useEffect, useState, useMemo } from "react";
import cls from "classnames";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import { Avatar } from "shared/ui-kit";
import { useTypedSelector } from "store/reducers/Reducer";
import { useAuth } from "shared/contexts/AuthContext";
import Box from "shared/ui-kit/Box";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import URL from "shared/functions/getURL";
import {
  getDefaultAvatar,
  getRandomAvatarForUserIdWithMemoization,
} from "shared/services/user/getUserAvatar";
import { SharePopup } from "shared/ui-kit/SharePopup";
import { digitalArtCardStyles } from "./index.styles";
import ReactPlayer from "react-player";
import { onGetNonDecrypt } from "shared/ipfs/get";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import { getChainImageUrl } from "shared/functions/chainFucntions";
import { StyledSkeleton } from "shared/ui-kit/Styled-components/StyledComponents";
import getPhotoIPFS from "../../../../../shared/functions/getPhotoIPFS";

const getRandomImageUrl = () => {
  return require(`assets/backgrounds/digital_art_1.png`);
};

export default function DigitalArtCard({ item, heightFixed, index = 0 }) {
  const classes = digitalArtCardStyles();
  const user = useTypedSelector(state => state.user);
  const history = useHistory();

  const { isSignedin } = useAuth();

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  const [imageIPFS, setImageIPFS] = useState("");

  const fixedUrlItem = useMemo(() => {
    const GENERATOR_ARTBLOCK_URL = "https://generator.artblocks.io/";
    const API_ARTBLOCK_URL = "https://api.artblocks.io/image/";
    if (item?.url && item.url.includes(GENERATOR_ARTBLOCK_URL)) {
      item.url = item.url.replace(GENERATOR_ARTBLOCK_URL, API_ARTBLOCK_URL);
    }
    return item;
  }, [item]);

  const [media, setMedia] = React.useState<any>(fixedUrlItem);
  const [creator, setCreator] = useState<any>({});
  const [auctionEnded, setAuctionEnded] = React.useState<boolean>(false);
  const [endTime, setEndTime] = useState<any>();
  const [openDigitalArtModal, setOpenDigitalArtModal] = useState<boolean>(false);
  const [openOptionsMenu, setOpenOptionsMenu] = useState<boolean>(false);
  const anchorShareMenuRef = React.useRef<HTMLButtonElement>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (media && user) {
      if (media.CreatorId || media.CreatorAddress) {
        const getCreatorData = async creatorId => {
          try {
            const response = await Axios.get(`${URL()}/user/getBasicUserInfo/${creatorId}`);
            if (response.data.success) {
              let data = response.data.data;
              setCreator({
                ...data,
                name: data.name ?? ``,
              });
            }
            return response.data.success;
          } catch (error) {
            console.log(error);
            return false;
          }
        };
        // Try to get creator data with address
        getCreatorData(media.CreatorAddress || media.CreatorId).then(result => {
          if (!result) {
            // Try to get creator data with id
            getCreatorData(media.CreatorId).then(tryWithId => {
              // If all not working, set default one
              if (!tryWithId) {
                setCreator({
                  imageUrl: getDefaultAvatar(),
                  name: media.blockchain,
                  urlSlug: "",
                  id: "",
                });
              }
            });
          }
        });
      } else {
        setCreator({
          imageUrl: getDefaultAvatar(),
          name: media.creator || media.blockchain,
          urlSlug: media.creator,
          id: media.creator,
        });
      }

      if (media.cid) {
        getImageIPFS(media.cid);
      }

      if (media.Auctions) {
        const timerId = setInterval(() => {
          const now = new Date();
          let delta = Math.floor(media.Auctions.EndTime - now.getTime() / 1000);
          if (delta < 0) {
            setAuctionEnded(true);
            setEndTime({
              days: 0,
              hours: 0,
              minutes: 0,
              seconds: 0,
            });
            clearInterval(timerId);
          } else {
            let days = Math.floor(delta / 86400);
            delta -= days * 86400;

            // calculate (and subtract) whole hours
            let hours = Math.floor(delta / 3600) % 24;
            delta -= hours * 3600;

            // calculate (and subtract) whole minutes
            let minutes = Math.floor(delta / 60) % 60;
            delta -= minutes * 60;

            // what's left is seconds
            let seconds = delta % 60;
            setAuctionEnded(false);
            setEndTime({
              days,
              hours,
              minutes,
              seconds,
            });
          }
        }, 1000);

        return () => clearInterval(timerId);
      } else return;
    }
  }, [media, user, ipfs]);

  useEffect(() => {
    if (media.cid) {
      getImageIPFS(media.cid);
    }
  }, [ipfs]);

  const getImageIPFS = async (cid: string) => {
    let files = await onGetNonDecrypt(cid, (fileCID, download) =>
      downloadWithNonDecryption(fileCID, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.content);
      setImageIPFS("data:image/png;base64," + base64String);
    }
  };

  const handleOpenDigitalArtModal = () => {
    if (isSignedin && media && creator) {
      let queryParam = "";
      if (media.tag) queryParam += (queryParam ? "&" : "") + `blockchainTag=${media.tag}`;
      if (media.collection) queryParam += (queryParam ? "&" : "") + `collectionTag=${media.collection}`;
      history.push(`/nft/${encodeURIComponent(media.MediaSymbol ?? media.id)}?${queryParam}`);
    }
  };

  const handleCloseDigitalArtModal = () => {
    setOpenDigitalArtModal(false);
  };

  const handleOptions = () => {
    setOpenOptionsMenu(!openOptionsMenu);
  };

  const handleCloseOptionsMenu = () => {
    setOpenOptionsMenu(false);
  };

  const handleFruit = type => {
    let body = {};
    if (
      (media.BlockchainNetwork && media.BlockchainNetwork.toLowerCase().includes("privi")) ||
      (media.blockchain && media.blockchain.toLowerCase().includes("privi"))
    ) {
      body = {
        userId: user.id,
        fruitId: type,
        mediaAddress: media.id,
        mediaType: media.Type,
        tag: "privi",
      };
    } else {
      body = {
        userId: user.id,
        fruitId: type,
        mediaAddress: media.id,
        mediaType: media.Type || media.type,
        tag: media.tag,
        subCollection: media.collection,
      };
    }

    Axios.post(`${URL()}/media/fruit`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        const itemCopy = { ...media };
        itemCopy.fruits = resp.fruitsArray;

        setMedia(itemCopy);
      }
    });
  };

  return (
    <div className={classes.card} style={{ marginBottom: heightFixed === "auction" ? 100 : 0 }}>
      <div className={classes.header}>
        <Box display="flex" alignItems="center">
          <Avatar
            size="small"
            url={creator.imageUrl ?? getDefaultAvatar()}
            alt={creator.name}
            title={`${creator.name}`}
            onClick={() => {
              if (creator.id ?? creator.urlSlug) {
                history.push(`/${creator.urlSlug}/profile`);
              }
            }}
          />
          <Box display="flex" flexDirection="column" ml={1}>
            <div
              className={cls(classes.black, classes.creatorName)}
              onClick={() => {
                if (creator.id ?? creator.urlSlug) {
                  history.push(`/${creator.urlSlug}/profile`);
                }
              }}
            >
              {creator?.name ?? <StyledSkeleton width={120} animation="wave" />}
            </div>
            {creator?.urlSlug ? (
              <div className={cls(classes.gray, classes.creatorName)}>@{creator.urlSlug}</div>
            ) : (
              <StyledSkeleton width={80} animation="wave" />
            )}
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <div className={classes.fruitsContainer}>
            <FruitSelect fruitObject={media} onGiveFruit={handleFruit} />
          </div>
          <button onClick={handleOptions} className={classes.optionsBtn} ref={anchorShareMenuRef}>
            <img src={require(`assets/icons/menu_dots.png`)} alt="like" />
          </button>
          <SharePopup
            item={{ ...media, Type: "DIGITAL_ART_TYPE" }}
            openMenu={openOptionsMenu}
            anchorRef={anchorShareMenuRef}
            handleCloseMenu={handleCloseOptionsMenu}
          />
        </Box>
      </div>
      {!media.UrlMainPhoto && !media.Url && media.url?.endsWith("mp4") ? (
        <div style={{ borderRadius: "16px", position: "relative", overflow: "hidden" }}>
          <Box className={cls(classes.media)}>
            <ReactPlayer
              url={media.cid ? imageIPFS : media.url}
              className={classes.reactPlayer}
              muted={true}
              loop={true}
              playing={true}
            />
          </Box>
        </div>
      ) : heightFixed ? (
        media?.cid && !imageIPFS ? (
          <Box my={1}>
            <StyledSkeleton width="100%" height={226} variant="rect" />
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
        )
      ) : (
        <div style={{ borderRadius: "16px", position: "relative", overflow: "hidden" }}>
          {!imageLoaded && (
            <Box my={1} position="absolute" top="0" left="0" width={1}>
              <StyledSkeleton width="100%" height={226} variant="rect" />
            </Box>
          )}
          <img
            src={`${
              media.cid
                ? imageIPFS
                : media.Type && media.Type !== "DIGITAL_ART_TYPE"
                ? media.UrlMainPhoto
                : media.UrlMainPhoto ?? media.Url ?? media.url ?? getRandomImageUrl()
            }`}
            onLoad={() => setImageLoaded(true)}
            alt={media.MediaSymbol ?? media.id}
            onClick={handleOpenDigitalArtModal}
            className={classes.media}
          />
        </div>
      )}

      <div className={classes.info} onClick={handleOpenDigitalArtModal}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb="8px">
          <div className={cls(classes.black, classes.title)}>{media.MediaName ?? media.title}</div>
          {item?.BlockchainNetwork && (
            <img src={getChainImageUrl(item?.BlockchainNetwork)} alt={"chain"} className={classes.chain} />
          )}
          {media.Fraction ? (
            <Box className={classes.fraction}>
              Fractionalized {Math.round(media.Fraction.Fraction * 100)}%
            </Box>
          ) : null}
        </Box>

        {!media.tag || media.blockchain?.toLowerCase().includes("privi") ? (
          media.Auctions ? (
            <div className={classes.gray}>
              {(media.Auctions.Gathered ?? 0) > (media.Auctions.ReservePrice ?? 0)
                ? "Current bid"
                : "Reserve price"}
              <span>{`${Math.max(media.Auctions.Gathered ?? 0, media.Auctions.ReservePrice ?? 0) || ""} ${
                media.Auctions.TokenSymbol
              }`}</span>
            </div>
          ) : media.ExchangeData ? (
            <div className={classes.gray}>
              Market Price
              <span>{`${media.ExchangeData?.Price} ${media.ExchangeData?.OfferToken ?? "USDT"}`}</span>
            </div>
          ) : null
        ) : (
          <div className={classes.gray}>
            <span style={{ marginLeft: "0px" }}>
              {media.price && media.price !== "Error" && media.price !== "error" && media.price !== undefined
                ? media.price
                : ""}
            </span>
          </div>
        )}

        {media.Auctions && endTime && (
          <div className={classes.auction}>
            <div>{!auctionEnded ? "Auction Ending In" : "Auction Ended"}</div>
            {!auctionEnded && (
              <h5>
                {`${endTime.days ? `${String(endTime.days).padStart(2, "0")}d` : ""} ${String(
                  endTime.hours
                ).padStart(2, "0")}h ${String(endTime.minutes).padStart(2, "0")}m ${String(
                  endTime.seconds
                ).padStart(2, "0")}s`}
              </h5>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
