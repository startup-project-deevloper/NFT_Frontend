import React, { useState } from "react";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";

import { Grid } from "@material-ui/core";

import { mediaDetailsModalStyles } from "./index.styles";
import { Avatar, Text, SecondaryButton, Color, FontSize, Header5, Modal, PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { useTypedSelector } from "store/reducers/Reducer";
import { getRandomAvatarForUserIdWithMemoization, getUserAvatar } from "shared/services/user/getUserAvatar";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import FractionaliseModal from "components/PriviSocial/modals/FractionaliseMediaModal";
import { useUserConnections } from "shared/contexts/UserConnectionsContext";
import { sumTotalViews } from "shared/functions/totalViews";
import { SharePopup } from "shared/ui-kit/SharePopup";

const MediaDetailsModal = (props: any) => {
  const classes = mediaDetailsModalStyles();
  const history = useHistory();
  const { pathname } = useLocation();
  const [media, setMedia] = useState<any>(props.media);
  const usersList = useTypedSelector(state => state.usersInfoList);
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);
  const userConnections = useUserConnections();

  const [creatorsImages, setCreatorsImages] = useState<any[]>([]);
  const [creator, setCreator] = useState<any>();
  const [isFollowing, setIsFollowing] = useState<number>(0);
  const [status, setStatus] = useState<any>("");

  const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);
  const [openShareMenu, setOpenShareMenu] = React.useState(false);
  const [openFractionalise, setOpenFractionalise] = React.useState(false);

  const { convertTokenToUSD } = useTokenConversion();

  const handleOpenFractionalise = () => {
    setOpenFractionalise(true);
  };
  const handleCloseFractionalize = () => {
    setOpenFractionalise(false);
  };

  React.useEffect(() => {
    let cts = [] as any;
    const isFollowing = media ? userConnections.isUserFollowed(media.CreatorId) : 0;
    setIsFollowing(isFollowing);
    const foundUser = usersList.find(
      user =>
        user.id === media.Creator ||
        user.id === media.CreatorId ||
        user.address === media.Creator ||
        user.address === media.CreatorId ||
        user.address === media.CreatorAddress
    );

    if (foundUser) {
      cts.push(foundUser);
      setCreator(foundUser);
    } else {
      setCreator({ name: media.CreatorId, urlSlug: media?.CreatorId });
      cts.push(getRandomAvatarForUserIdWithMemoization(media.Creator ?? media.CreatorId));
    }

    if (media.Members && media.Members.length > 0) {
      media.Members.forEach((member, index) => {
        if (index < 3) {
          const foundUser = usersList.find(u => u.id === member.id);
          if (foundUser) {
            cts.push(foundUser);
          } else {
            cts.push(getRandomAvatarForUserIdWithMemoization(member.id));
          }
        } else {
          cts.push(index);
        }
      });
    }

    if (!media.Members && media.tokenData?.Holders && media.tokenData?.Holders.length > 0) {
      media.tokenData?.Holders.forEach((member, index) => {
        if (index < 3) {
          const foundUser = usersList.find(user => user.id === member.id);
          cts.push(foundUser);
        } else {
          cts.push(index);
        }
      });
    }

    setCreatorsImages(cts);
    if (media) {
      sumTotalViews({
        ...media,
        TotalViews: props.mediaViews ? props.mediaViews - 1 : media.TotalViews,
      });
    }
  }, []);

  const handleOpenShareMenu = () => {
    setOpenShareMenu(!openShareMenu);
  };

  const handleCloseShareMenu = () => {
    setOpenShareMenu(false);
  };

  const renderCollection = () => {
    return (
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Box display="flex" flexDirection="column">
          <Box fontSize={14} fontWeight={400} color="#ffffff" fontFamily="Agrandir">
            Royalty
          </Box>
          <Text mt={1} color={Color.White} size={FontSize.XL}>
            {media?.Royalty ?? 1}%
          </Text>
        </Box>
        <Box display="flex" flexDirection="column">
          <Box fontSize={14} fontWeight={400} color="#ffffff" fontFamily="Agrandir">
            Investors Share
          </Box>
          <Text mt={1} color={Color.White} size={FontSize.XL}>
            {userBalances[media.MediaSymbol] ? userBalances[media.MediaSymbol].Balance * 100 : 0}%
          </Text>
        </Box>
        <Box display="flex" flexDirection="column">
          <Box fontSize={14} fontWeight={400} color="#ffffff" fontFamily="Agrandir">
            Sharing Share
          </Box>
          <Text mt={1} color={Color.White} size={FontSize.XL}>
            {media?.SharingPct || 5}%
          </Text>
        </Box>
      </Box>
    );
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
        mediaType: media.type,
        tag: media.tag,
        subCollection: media.collection,
      };
    }

    axios.post(`${URL()}/media/fruit`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        const itemCopy = { ...media };
        itemCopy.fruits = resp.fruitsArray;
        setMedia(itemCopy);
      }
    });
  };

  const followUser = async (id: any) => {
    try {
      await userConnections.followUser(id);

      setStatus({
        msg: "Follow success",
        key: Math.random(),
        variant: "success",
      });

      setIsFollowing(1);
    } catch (err) {
      setStatus({
        msg: "Follow failed",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  const unfollowUser = async (id: any) => {
    try {
      await userConnections.unfollowUser(id);

      setStatus({
        msg: "Unfollow success",
        key: Math.random(),
        variant: "success",
      });

      setIsFollowing(0);
    } catch (err) {
      setStatus({
        msg: "Unfollow failed",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  const handleFollowing = id => {
    if (isFollowing) {
      unfollowUser(id);
    } else {
      followUser(id);
    }
  };

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
      className={classes.content}
    >
      <div className={classes.title}>{media?.MediaName}</div>
      <Grid container spacing={2} style={{ marginTop: "16px", marginBottom: "16px" }}>
        <Grid item xs={12} sm={6}>
          <object
            data={
              media.imageURL ??
              media.UrlMainPhoto ??
              media.Url ??
              media.url ??
              `https://source.unsplash.com/random/${Math.floor(Math.random() * 1000)}`
            }
            type="image/png"
            className={classes.detailImg}
            style={{ height: "100%" }}
            width="100%"
          ></object>
          {/* <img
            src={
              media.imageURL ??
              media.UrlMainPhoto ??
              media.Url ??
              media.url ??
              `https://source.unsplash.com/random/${Math.floor(Math.random() * 1000)}`
            }
            className={classes.detailImg}
            width="100%"
          /> */}
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          style={{
            marginTop: "8px",
            paddingTop: media?.Auctions ? 0 : 2,
            paddingBottom: media?.Auctions ? 0 : 2,
          }}
        >
          <div className={classes.infoSection}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Avatar
                size="medium"
                url={getUserAvatar({
                  id: creator?.id,
                  anon: creator?.anon,
                  hasPhoto: creator?.hasPhoto,
                  anonAvatar: creator?.anonAvatar,
                  url: creator?.url,
                })}
              />
              <Box display="flex" flexDirection="column" ml={1} mr={1.25}>
                <Box color={Color.White} fontSize={16} className={classes.creatorName} mb={"4px"}>
                  {creator?.name}
                </Box>
                <Box
                  color={"#FF5954"}
                  fontSize={14}
                  className={classes.creatorName}
                >{`@${creator?.urlSlug}`}</Box>
              </Box>
              {user && media?.CreatorId !== user.id && (
                <SecondaryButton
                  size="small"
                  onClick={() => handleFollowing(media?.CreatorId)}
                  className={classes.followBtn}
                >
                  {isFollowing === 2 ? "Unfollow" : isFollowing === 1 ? "Requested" : "Follow"}
                </SecondaryButton>
              )}
            </Box>
            <div className={classes.fruitSection}>
              <Box
                mr={2}
                style={{
                  background: "linear-gradient(225.12deg, #F2A07E -33.5%, #FF5954 71.42%)",
                  borderRadius: "50%",
                }}
              >
                <FruitSelect fruitObject={media} onGiveFruit={handleFruit} />
              </Box>
              <Box mr={2}>
                <img
                  src={require(`assets/icons/bookmark_white.png`)}
                  alt="Bookmark"
                  onClick={() => {}}
                  style={{ cursor: "pointer" }}
                />
              </Box>
              <Box mb={1}>
                <div onClick={handleOpenShareMenu} ref={anchorShareMenuRef} style={{ cursor: "pointer" }}>
                  <img src={require(`assets/icons/more_white.png`)} alt="like" />
                </div>
              </Box>
            </div>
          </div>
          <SharePopup
            item={media}
            openMenu={openShareMenu}
            anchorRef={anchorShareMenuRef}
            handleCloseMenu={handleCloseShareMenu}
          />
          {/* <ShareMenu
                        openMenu={openOptionsMenu}
                        anchorRef={anchorOptionsMenuRef}
                        item={media}
                        handleCloseMenu={() => setOpenOptionsMenu(false)}
                        isLeftAligned={true}
                    /> */}
          <Box display="flex" alignItems="center" justifyContent="space-between" my={2}>
            {creatorsImages.length > 0 && (
              <Box display="flex" alignItems="center" mr={2}>
                {creatorsImages.map((owner: any) => (
                  <Avatar
                    key={`artist-${owner.id}`}
                    className={classes.artist}
                    size="small"
                    url={getUserAvatar({
                      id: owner?.id,
                      anon: owner?.anon,
                      hasPhoto: owner?.hasPhoto,
                      anonAvatar: owner?.anonAvatar,
                      url: owner?.url,
                    })}
                  />
                ))}
                <Box color={"#FF5954"} fontSize={12} fontWeight={400} fontFamily="Agrandir" ml={"2px"}>
                  Ownership History
                </Box>
              </Box>
            )}
            <Text size={FontSize.XL} color={Color.White}>
              💾 {media?.shareCount || 0}
            </Text>
            <div>
              <Text size={FontSize.XL} color={Color.White}>
                👀 {(props.mediaViews ? props.mediaViews : media?.TotalViews) || 0}
              </Text>
            </div>
          </Box>
          <hr className={classes.divider} />
          <Box fontSize={18} fontWeight={500} fontFamily="Montserrat" color={"#FF5954"} mb={1}>
            Collection
          </Box>
          {renderCollection()}
          <hr className={classes.divider} />
          <Box display="flex" alignItems="center" mb={2} justifyContent="flex-end">
            <img src={require("assets/logos/privi.png")} width="32px" />
            <Box ml={2}>Privi Chain</Box>
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-end">
            <Text color={Color.White} size={FontSize.XL}>
              Price
            </Text>
            <Text color={Color.LightRed} size={FontSize.XXL} ml={1} mr={1}>
              {`ETH ${media?.ExchangeData ? media?.ExchangeData.Price : media?.NftConditions?.Price ?? 0}`}
            </Text>
            <Text color={Color.White} size={FontSize.S}>
              {`$(${convertTokenToUSD(
                media?.ExchangeData
                  ? media?.ExchangeData.OfferToken
                  : media?.NftConditions?.FundingToken ?? "ETH",
                media?.ExchangeData ? media?.ExchangeData.Price : media?.NftConditions?.Price ?? 0
              ).toFixed(6)})`}
            </Text>
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-end" mt={2}>
            <PrimaryButton
              size="medium"
              onClick={() => {
                props.handleClose();
                let queryParam = "";
                if (media.tag) queryParam += (queryParam ? "" : "&") + `blockchainTag=${media.tag}`;
                if (media.collection)
                  queryParam += (queryParam ? "" : "&") + `collectionTag=${media.collection}`;
                history.push(`/pix/${encodeURIComponent(media.MediaSymbol ?? media.id)}?${queryParam}`);
              }}
              style={{
                background: "linear-gradient(225.12deg, #F2A07E -33.5%, #FF5954 71.42%)",
                color: Color.White,
                width: "50%",
                marginRight: !media.Fraction && media.CreatorAddress == user.address ? "8px" : 0,
              }}
            >
              See More Details
            </PrimaryButton>
            {!media.Fraction && media.CreatorAddress == user.address && (
              <PrimaryButton
                size="medium"
                onClick={handleOpenFractionalise}
                style={{
                  background: "linear-gradient(225.12deg, #F2A07E -33.5%, #FF5954 71.42%)",
                  color: Color.White,
                  width: "50%",
                  marginLeft: "8px",
                }}
              >
                Fractionalize
              </PrimaryButton>
            )}
          </Box>
        </Grid>
      </Grid>
      {openFractionalise && (
        <FractionaliseModal
          open={openFractionalise}
          handleClose={() => {
            handleCloseFractionalize();
            props.handleClose();
          }}
          handleRefresh={props.handleRefresh}
          media={media}
        />
      )}
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </Modal>
  );
};

export default MediaDetailsModal;
