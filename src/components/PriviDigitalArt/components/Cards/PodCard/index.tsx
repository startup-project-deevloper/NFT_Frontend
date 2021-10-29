import React, { useEffect, useState } from "react";
import cls from "classnames";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import { useTypedSelector } from "store/reducers/Reducer";
import Box from "shared/ui-kit/Box";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import URL from "shared/functions/getURL";
import { getDefaultAvatar, getUserAvatar } from "shared/services/user/getUserAvatar";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import { SharePopup } from "shared/ui-kit/SharePopup";
import { podCardStyles } from "./index.styles";
import { getChainImageUrl } from "shared/functions/chainFucntions";
import { StyledSkeleton } from "shared/ui-kit/Styled-components/StyledComponents";
import { useAlertMessage } from "shared/hooks/useAlertMessage";

const getRandomImageUrl = () => {
  return require(`assets/podImages/3.png`);
};

export default function PodCard({ item, heightFixed, index = 0 }) {
  const classes = podCardStyles();
  const user = useTypedSelector(state => state.user);
  const { showAlertMessage } = useAlertMessage();
  const history = useHistory();
  const [media, setMedia] = React.useState<any>(item);
  const [creator, setCreator] = React.useState<any>({
    imageUrl: "",
    name: "",
    urlSlug: "",
  });
  const [openDigitalArtModal, setOpenDigitalArtModal] = useState<boolean>(false);
  const [openOptionsMenu, setOpenOptionsMenu] = useState<boolean>(false);
  const anchorShareMenuRef = React.useRef<HTMLButtonElement>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (media && user) {
      if (media.Creator || media.CreatorAddress) {
        const allUsers = useTypedSelector(state => state.usersInfoList);
        if (media.Creator === user?.id) {
          setCreator({
            ...user,
            name: `${user.firstName} ${user.lastName}`,
          });
        } else {
          const u = allUsers.find(user => user.address === media.CreatorAddress)
          setCreator({
            ...u,
            // name: `${u.firstName} ${u.lastName}`,
          });
          // const getCreatorData = async () => {
          //   await Axios.get(`${URL()}/user/getBasicUserInfo/${media.Creator ?? media.CreatorAddress}`)
          //     .then(response => {
          //       if (response.data.success) {
          //         let data = response.data.data;
          //         setCreator({
          //           ...data,
          //           name: data.name ?? `${data.firstName} ${data.lastName}`,
          //         });
          //       } else {
          //         setCreator({
          //           ipfsImage: getDefaultAvatar(),
          //           imageUrl: getRandomAvatarForUserIdWithMemoization(media.creator),
          //           name: "User name",
          //           urlSlug: "",
          //         });
          //       }
          //     })
          //     .catch(error => {
          //       console.log(error);
          //     });
          // };

          // getCreatorData();
        }
      } else {
        setCreator({
          ipfsImage: getDefaultAvatar(),
          imageUrl: getRandomAvatarForUserIdWithMemoization(media.creator),
          name: media.creator,
          urlSlug: media.creator,
        });
      }
    }
  }, [media, user]);

  const handleOpenDigitalArtModal = () => {
    if (media && creator) {
      history.push(`/pods/${media.PodAddress ?? media.id}`);
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
    if (media.fruits?.filter(f => f.fruitId === type)?.find(f => f.userId === user.id)) {
      showAlertMessage("You had already given this fruit.", { variant: "info" });
      return;
    }

    const body = {
      userId: user.id,
      fruitId: type,
      podAddress: media.PodAddress ?? media.id,
    };

    Axios.post(`${URL()}/mediaPod/fruit`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        const itemCopy = { ...media };
        itemCopy.fruits = [
          ...(itemCopy.fruits || []),
          { userId: user.id, fruitId: type, date: new Date().getTime() },
        ];
        setMedia(itemCopy);
      }
    });
  };

  return (
    <div className={classes.card} style={{ marginBottom: heightFixed === "auction" ? 100 : 0 }}>
      <div className={classes.header}>
        <Box display="flex" alignItems="center">
          {creator ? (
            <div
              className={classes.avatar}
              style={{
                backgroundImage: creator.ipfsImage
                // backgroundImage: creator
                //   ? `url(${getUserAvatar({
                //       id: creator.id,
                //       anon: creator.anon,
                //       hasPhoto: creator.hasPhoto,
                //       anonAvatar: creator.anonAvatar,
                //       url: creator.url,
                //     })})`
                //   : "none",
              }}
              onClick={() => creator.urlSlug && history.push(`/${creator.urlSlug}/profile`)}
            />
          ) : (
            <StyledSkeleton width={40} height={40} animation="wave" variant="circle" />
          )}
          <Box display="flex" flexDirection="column">
            <div className={cls(classes.black, classes.creatorName)} style={{ marginBottom: 4 }}>
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
            item={media}
            openMenu={openOptionsMenu}
            anchorRef={anchorShareMenuRef}
            handleCloseMenu={handleCloseOptionsMenu}
          />
        </Box>
      </div>
      {heightFixed ? (
        <div
          className={cls(classes.media, classes.fixed)}
          style={{
            backgroundImage: `url(${
              media.Type && media.Type !== "DIGITAL_ART_TYPE"
                ? media.UrlMainPhoto
                : media.UrlMainPhoto ?? media.Url ?? media.url ?? getRandomImageUrl()
            })`,
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={handleOpenDigitalArtModal}
        />
      ) : (
        <div
          style={{ borderRadius: "16px", position: "relative", cursor: "pointer" }}
          onClick={handleOpenDigitalArtModal}
        >
          {!imageLoaded && (
            <Box my={1} position="absolute" top="0" left="0" width={1}>
              <StyledSkeleton width="100%" height={226} variant="rect" />
            </Box>
          )}
          <img
            src={`${
              media.Type && media.Type !== "DIGITAL_ART_TYPE"
                ? media.UrlMainPhoto
                : media.UrlMainPhoto ?? media.Url ?? media.url
            }`}
            alt={media.MediaSymbol ?? media.id}
            className={classes.media}
          />
        </div>
      )}
      <div className={classes.info} onClick={handleOpenDigitalArtModal}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb="8px">
          <div className={cls(classes.black, classes.title)}>
            {media.Name ?? media.MediaName ?? media.TokenName}
          </div>
          {item?.BlockchainNetwork && (
            <img
              src={getChainImageUrl(item?.BlockchainNetwork)}
              alt={"chain"}
              className={classes.chain}
              width="24px"
            />
          )}
        </Box>
      </div>
      <Box className={classes.viewsBox} onClick={handleOpenDigitalArtModal}></Box>
      <Box className={classes.podMainInfoContent} onClick={handleOpenDigitalArtModal}>
        <Box>
          <span>Price</span>
          <p>{`${media.FundingToken} ${media.Price ?? 0}`}</p>
        </Box>
        <Box>
          <span>Investors share</span>
          <p>{media.SharingPercent ? `${parseFloat(media.SharingPercent)}%` : "0%"}</p>
        </Box>
      </Box>
      {/* {isSignedin && media && creator && (
        <DigitalArtModal
          open={openDigitalArtModal}
          handleClose={handleCloseDigitalArtModal}
          selectedMedia={media}
          creator={creator}
        />
      )} */}
    </div>
  );
}
