import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { mediaDetailsModalStyles } from "./index.styles";
import {
  Avatar,
  Text,
  SecondaryButton,
  Color,
  FontSize,
  Header5,
  Modal,
  Gradient,
  PrimaryButton,
  Header3,
} from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { useTypedSelector } from "store/reducers/Reducer";
import { getRandomAvatarForUserIdWithMemoization, getUserAvatar } from "shared/services/user/getUserAvatar";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
// import { ShareMenu } from "components/PriviDigitalArt/components/ShareMenu";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { useHistory } from "react-router-dom";
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
        user.address === media.CreatorId
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
          <Text>Royalty</Text>
          <Text mt={1} color={Color.Black} size={FontSize.XL}>
            {media?.Royalty ?? 1}%
          </Text>
        </Box>
        <Box display="flex" flexDirection="column">
          <Text>Investors Share</Text>
          <Text mt={1} color={Color.Black} size={FontSize.XL}>
            {userBalances[media.MediaSymbol] ? userBalances[media.MediaSymbol].Balance * 100 : 0}%
          </Text>
        </Box>
        <Box display="flex" flexDirection="column">
          <Text>Sharing Share</Text>
          <Text mt={1} color={Color.Black} size={FontSize.XL}>
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
      <Header3 noMargin>{media?.MediaName}</Header3>
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
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
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
                <Text color={Color.Black} className={classes.creatorName} style={{ marginBottom: 4 }}>
                  {creator?.name}
                </Text>
                <Text className={classes.creatorName}>{`@${creator?.urlSlug}`}</Text>
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
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box mr={2} style={{ background: Gradient.Green, borderRadius: "50%" }}>
                <FruitSelect fruitObject={media} onGiveFruit={handleFruit} />
              </Box>
              <Box mr={2}>
                <img
                  src={require(`assets/icons/bookmark.png`)}
                  alt="Bookmark"
                  onClick={() => {}}
                  style={{ cursor: "pointer" }}
                />
              </Box>
              <Box mb={1}>
                <div onClick={handleOpenShareMenu} ref={anchorShareMenuRef} style={{ cursor: "pointer" }}>
                  <img src={require(`assets/icons/more.png`)} alt="like" />
                </div>
              </Box>
            </Box>
          </Box>
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
          <Box display="flex" alignItems="center" my={2}>
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
                <Text color={Color.Green} ml={2}>
                  Ownership History
                </Text>
              </Box>
            )}
            <Text size={FontSize.XL} mr={5}>
              💾 {media?.shareCount || 0}
            </Text>
            <div>
              <Text size={FontSize.XL} mr={5}>
                👀 {(props.mediaViews ? props.mediaViews : media?.TotalViews) || 0}
              </Text>
            </div>
          </Box>
          <hr className={classes.divider} />
          <Header5>Collection</Header5>
          {renderCollection()}
          <hr className={classes.divider} />
          <Box display="flex" alignItems="center" mb={2} justifyContent="flex-end">
            <img src={require("assets/logos/privi.png")} width="32px" />
            <Box ml={2}>Privi Chain</Box>
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-end">
            <Text color={Color.Black} size={FontSize.XL}>
              Price
            </Text>
            <Text color={Color.Green} size={FontSize.XXL} ml={1} mr={1}>
              {`ETH ${media?.ExchangeData ? media?.ExchangeData.Price : media?.NftConditions?.Price ?? 0}`}
            </Text>
            <Text color={Color.Black} size={FontSize.S}>
              {`$(${convertTokenToUSD(
                media?.ExchangeData
                  ? media?.ExchangeData.OfferToken
                  : media?.NftConditions?.FundingToken ?? "ETH",
                media?.ExchangeData ? media?.ExchangeData.Price : media?.NftConditions?.Price ?? 0
              ).toFixed(6)})`}
            </Text>
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-end" mt={2}>
            {!media.Fraction && media.CreatorAddress == user.address && (
              <PrimaryButton
                size="medium"
                onClick={handleOpenFractionalise}
                style={{ background: Gradient.Green, color: "#707582" }}
              >
                Fractionalize
              </PrimaryButton>
            )}
            <PrimaryButton
              size="medium"
              onClick={() => {
                props.handleClose();
                history.push(`/nft/${encodeURIComponent(media?.MediaSymbol ?? media?.id)}`);
              }}
              style={{ background: Gradient.Green, color: "#707582" }}
            >
              Go to Digital Art
            </PrimaryButton>
          </Box>
        </Grid>
      </Grid>
      <FractionaliseModal
        open={openFractionalise}
        handleClose={handleCloseFractionalize}
        handleRefresh={props.handleClose}
        media={media}
      />
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </Modal>
  );
};

export default MediaDetailsModal;
