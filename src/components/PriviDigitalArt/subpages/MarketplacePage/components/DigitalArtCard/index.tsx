import React, { useEffect, useState, useMemo } from "react";
import cls from "classnames";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import ReactPlayer from "react-player";

import { useTypedSelector } from "store/reducers/Reducer";

import { Avatar, Color } from "shared/ui-kit";
import { useAuth } from "shared/contexts/AuthContext";
import Box from "shared/ui-kit/Box";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import URL from "shared/functions/getURL";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import { SharePopup } from "shared/ui-kit/SharePopup";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import { getChainImageUrl } from "shared/functions/chainFucntions";
import { StyledSkeleton } from "shared/ui-kit/Styled-components/StyledComponents";
import { useAlertMessage } from "shared/hooks/useAlertMessage";

import { useStyles } from "./index.styles";

const getRandomImageUrl = () => {
  return require(`assets/backgrounds/digital_art_1.png`);
};

const AUCTION_TYPE = "auction";
const EXCHANGE_TYPE = "exchange";

export default function DigitalArtCard({ item, heightFixed }) {
  const classes = useStyles();
  const history = useHistory();

  const { isSignedin } = useAuth();

  const fixedUrlItem = useMemo(() => {
    const GENERATOR_ARTBLOCK_URL = "https://generator.artblocks.io/";
    const API_ARTBLOCK_URL = "https://api.artblocks.io/image/";
    if (item?.media.token_uri && item.media.token_uri.includes(GENERATOR_ARTBLOCK_URL)) {
      item.media.token_uri = item.media.token_uri.replace(GENERATOR_ARTBLOCK_URL, API_ARTBLOCK_URL);
    }
    if (item.media.metadata && typeof item.media.metadata === "string") {
      item.media.metadata = JSON.parse(item.media.metadata);
    }
    return item;
  }, [item]);

  const user = useTypedSelector(state => state.user);
  const { showAlertMessage } = useAlertMessage();
  const [media, setMedia] = React.useState<any>(fixedUrlItem);
  const [creator, setCreator] = useState<any>({});
  const [auctionEnded, setAuctionEnded] = React.useState<boolean>(false);
  const [endTime, setEndTime] = useState<any>();
  const [openOptionsMenu, setOpenOptionsMenu] = useState<boolean>(false);
  const anchorShareMenuRef = React.useRef<HTMLButtonElement>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (media) {
      const ownerId = media.owner;
      if (ownerId) {
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
        getCreatorData(ownerId).then(result => {
          if (!result) {
            setCreator({
              imageUrl: getDefaultAvatar(),
              name: ownerId,
              urlSlug: "",
              id: "",
            });
          }
        });
      } else {
        setCreator({
          imageUrl: getDefaultAvatar(),
          name: ownerId,
          urlSlug: ownerId,
          id: ownerId,
        });
      }

      if (media.type === AUCTION_TYPE) {
        const timerId = setInterval(() => {
          const now = new Date();
          let delta = Math.floor(media.endTime - now.getTime() / 1000);
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
  }, [media]);

  const handleOptions = () => {
    setOpenOptionsMenu(!openOptionsMenu);
  };

  const handleCloseOptionsMenu = () => {
    setOpenOptionsMenu(false);
  };

  const handleOpenDigitalArtModal = () => {
    if (isSignedin && media && creator) {
      history.push(`/marketplace/${encodeURIComponent(media.id)}`);
    }
  };

  const handleFruit = type => {
    if (media.fruits?.filter(f => f.fruitId === type)?.find(f => f.userId === user.id)) {
      showAlertMessage("You had already given this fruit.", { variant: "info" });
      return;
    }

    const body = {
      userId: user.id,
      fruitId: type,
      tokenAddress: media.tokenAddress,
      tokenId: media.tokenId,
    };
    Axios.post(`${URL()}/marketplace/fruit`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        const itemCopy = { ...media };
        itemCopy.fruits = resp.fruits;
        setMedia(itemCopy);
      }
    });
  };

  return (
    <div className={classes.card} style={{ marginBottom: heightFixed === "auction" ? 100 : 0 }}>
      <div className={classes.header}>
        <Box display="flex" alignItems="center">
          {creator ? (
            <Avatar
              size="small"
              url={creator.imageUrl ?? getDefaultAvatar()}
              alt={creator.id}
              title={creator.name}
              onClick={() => {
                if (creator.id ?? creator.urlSlug) {
                  history.push(`/${creator.urlSlug}/profile`);
                }
              }}
            />
          ) : (
            <StyledSkeleton width={40} height={40} animation="wave" variant="circle" />
          )}
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
            item={{ ...media, Type: "MARKETPLACE" }}
            openMenu={openOptionsMenu}
            anchorRef={anchorShareMenuRef}
            handleCloseMenu={handleCloseOptionsMenu}
          />
        </Box>
      </div>
      {media.media.content_url && media.media.content_url?.endsWith("mp4") ? (
        <div style={{ borderRadius: "16px", position: "relative", overflow: "hidden" }}>
          <Box className={cls(classes.media)}>
            <ReactPlayer
              url={media.media.content_url}
              className={classes.reactPlayer}
              muted={true}
              loop={true}
              playing={true}
            />
          </Box>
        </div>
      ) : heightFixed ? (
        !media.media.content_url ? (
          <Box my={1}>
            <StyledSkeleton width="100%" height={226} variant="rect" />
          </Box>
        ) : (
          <div
            className={cls(classes.media, classes.fixed)}
            style={{
              backgroundImage: `url(${media.media.content_url ?? getRandomImageUrl()})`,
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
            src={`${media.media.content_url}`}
            onLoad={() => setImageLoaded(true)}
            alt={media.media.symbol ?? media.media.token_id}
            className={classes.media}
            onClick={handleOpenDigitalArtModal}
          />
        </div>
      )}

      <div className={classes.info} onClick={handleOpenDigitalArtModal}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb="8px">
          <div className={cls(classes.black, classes.title)}>
            {media.media.metadata?.name || media?.media.name}
          </div>
          <img src={getChainImageUrl(media.media.chainsFullName)} alt={"chain"} className={classes.chain} />
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          {media.type === AUCTION_TYPE && (
            <div className={classes.gray}>
              {(media.currentBid ?? 0) > (media.reservePrice ?? 0) ? "Current bid" : "Reserve price"}
              <span>{`${Math.max(media.currentBid ?? 0, media.reservePrice ?? 0) || ""} ${
                media.tokenSymbol || "USDT"
              }`}</span>
            </div>
          )}
          {media.type === EXCHANGE_TYPE && (
            <div className={classes.gray}>
              <span style={{ marginLeft: "0px" }}>
                {media.price || 0}
                &nbsp;
                {media.offerToken || "USDT"}
              </span>
            </div>
          )}
          {media.status === "sold" && <div style={{ color: Color.Red }}>Sold</div>}
        </Box>

        {media.type === AUCTION_TYPE && endTime && (
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
