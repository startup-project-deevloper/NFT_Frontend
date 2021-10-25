import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import { Grid, useMediaQuery } from "@material-ui/core";

import { mediaDetailsModalStyles } from "./index.styles";
import {
  Avatar,
  Text,
  SecondaryButton,
  Color,
  FontSize,
  Header5,
  Modal,
  PrimaryButton,
  Header3,
} from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import {
  getDefaultAvatar,
  getRandomAvatarForUserIdWithMemoization,
} from "shared/services/user/getUserAvatar";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import FractionaliseModal from "components/PriviSocial/modals/FractionaliseMediaModal";
import { useUserConnections } from "shared/contexts/UserConnectionsContext";
import { sumTotalViews } from "shared/functions/totalViews";
import { SharePopup } from "shared/ui-kit/SharePopup";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { getChainImageUrl } from "shared/functions/chainFucntions";

const MediaDetailsModal = (props: any) => {
  const classes = mediaDetailsModalStyles();
  const mobileMatches = useMediaQuery("(max-width:375px)");
  const { showAlertMessage } = useAlertMessage();
  const history = useHistory();
  const [media, setMedia] = useState<any>(props.media);
  const usersList = useTypedSelector(state => state.usersInfoList);
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);
  const userConnections = useUserConnections();

  const [creatorsImages, setCreatorsImages] = useState<any[]>([]);
  const [creator, setCreator] = useState<any>();
  const [isFollowing, setIsFollowing] = useState<number>(0);

  const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);
  const [openShareMenu, setOpenShareMenu] = useState(false);
  const [openFractionalise, setOpenFractionalise] = useState(false);
  const [showDetailsBtn, setShowDetailsBtn] = useState<boolean>(false);

  const { convertTokenToUSD } = useTokenConversion();

  const handleOpenFractionalise = () => {
    setOpenFractionalise(true);
  };
  const handleCloseFractionalize = () => {
    setOpenFractionalise(false);
  };

  useEffect(() => {
    let cts = [] as any;
    const foundUser = usersList.find(
      user =>
        user.id === media.Creator ||
        user.id === media.CreatorId ||
        user.address?.toLowerCase() === media.Creator?.toLowerCase() ||
        user.address?.toLowerCase() === media.CreatorId?.toLowerCase() ||
        user.address?.toLowerCase() === media.CreatorAddress?.toLowerCase() ||
        user.id === media.owner_of ||
        user.address?.toLowerCase() === media.owner_of?.toLowerCase()
    );

    const isFollowing =
      media.CreatorId ?? foundUser?.id ? userConnections.isUserFollowed(media.CreatorId ?? foundUser?.id) : 0;
    setIsFollowing(isFollowing);

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
  }, [usersList]);

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

      setIsFollowing(1);
    } catch (err) {
      showAlertMessage("Follow failed", { variant: "error" });
    }
  };

  const unfollowUser = async (id: any) => {
    try {
      await userConnections.unfollowUser(id);

      setIsFollowing(0);
    } catch (err) {
      showAlertMessage("Unfollow failed", { variant: "error" });
    }
  };

  const handleFollowing = id => {
    if (isFollowing) {
      unfollowUser(id);
    } else {
      followUser(id);
    }
  };

  const getChainImage = () => {
    if (media?.metadata) {
      if (media?.chainsFullName === "Mumbai" || media?.chainsFullName === "Polygon")
        return require("assets/tokenImages/POLYGON-SYMBOL.png");
      else return require("assets/tokenImages/ETH.png");
    } else {
      return getChainImageUrl(media?.BlockchainNetwork);
    }
  };

  useEffect(() => {
    if (media) {
      if (media.metadata) {
        if (media.metadata?.external_url || media.metadata?.external_link) {
          setShowDetailsBtn(true);
        } else {
          setShowDetailsBtn(false);
        }
      } else {
        setShowDetailsBtn(true);
      }
    }
  }, [media]);

  const handleDetails = () => {
    props.handleClose();
    if (media.metadata) {
      if (media.metadata?.external_url || media.metadata?.external_link) {
        window.open(media.metadata?.external_url || media.metadata?.external_link, "_blank");
      }
    } else {
      let queryParam = "";
      if (media.tag) queryParam = `blockchainTag=${media.tag}`;
      if (media.collection) queryParam += (queryParam ? "&" : "") + `collectionTag=${media.collection}`;
      history.push(`/nft/${encodeURIComponent(media.MediaSymbol ?? media.id)}?${queryParam}`);
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
      <Header3 noMargin fontWeight={800}>
        {media?.MediaName || media?.title || media?.metadata?.name}
      </Header3>
      <Grid container spacing={2} style={{ marginTop: "16px", marginBottom: "16px" }}>
        <Grid item xs={12} sm={6} style={{ textAlign: "center" }}>
          {media.metadata?.image ? (
            <img src={media.metadata?.image} alt={media.metadata?.name || ""} className={classes.detailImg} />
          ) : (
            <object
              data={
                props.cidUrl ??
                media.imageURL ??
                media.UrlMainPhoto ??
                media.Url ??
                media.url ??
                media.metadata?.image ??
                `https://source.unsplash.com/random/${Math.floor(Math.random() * 1000)}`
              }
              type="image/png"
              className={classes.detailImg}
              style={{ height: "100%" }}
              width="100%"
            />
          )}
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
                url={creator && creator.ipfsImage ? creator.ipfsImage : getDefaultAvatar()}
              />
              <Box display="flex" flexDirection="column" ml={1} mr={1.25}>
                <Text color={Color.Black} className={classes.creatorName} style={{ marginBottom: 4 }}>
                  {creator?.name || media?.CreatorName || media?.creator}
                </Text>
                {creator?.urlSlug && <Text className={classes.creatorName}>{`@${creator?.urlSlug}`}</Text>}
              </Box>
              {user &&
                !media?.tag &&
                media?.CreatorId !== user.id &&
                media?.CreatorAddress?.toLowerCase() !== user.address?.toLowerCase() &&
                media.owner_of?.toLowerCase() !== user.address?.toLowerCase() && (
                  <SecondaryButton
                    size="small"
                    onClick={() => handleFollowing(media?.CreatorId)}
                    className={classes.followBtn}
                    style={{ background: "transparent" }}
                  >
                    {isFollowing === 2 ? "Unfollow" : isFollowing === 1 ? "Requested" : "Follow"}
                  </SecondaryButton>
                )}
            </Box>
            <div className={classes.fruitSection}>
              <Box mr={2} style={{ background: "#9EACF2", borderRadius: "50%" }}>
                <FruitSelect fruitObject={media} onGiveFruit={handleFruit} />
              </Box>
              <Box mr={2} display="flex">
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
                    url={owner.ipfsImage ? owner.ipfsImage : getDefaultAvatar()}
                  />
                ))}
                <Text color={Color.Purple} ml={2}>
                  Ownership History
                </Text>
              </Box>
            )}
            <Text size={FontSize.XL} color={Color.Black}>
              💾 {media?.shareCount || 0}
            </Text>
            <div>
              <Text size={FontSize.XL} color={Color.Black}>
                👀 {(props.mediaViews ? props.mediaViews : media?.TotalViews) || 0}
              </Text>
            </div>
          </Box>
          {!media.metadata && (
            <>
              <hr className={classes.divider} />
              <Header5>Collection</Header5>
              {renderCollection()}
            </>
          )}
          {!!media.metadata?.description && (
            <>
              <hr className={classes.divider} />
              <Header5>Description</Header5>
              <Box>{media.metadata?.description}</Box>
            </>
          )}
          <hr className={classes.divider} />
          {(media.BlockchainNetwork || media.chainsFullName) && (
            <Box display="flex" alignItems="center" mb={2} justifyContent="flex-end">
              <img src={getChainImage()} width="32px" />
              <Box ml={2}>
                {media.chainsFullName
                  ? media.chainsFullName === "Mumbai" || media.chainsFullName === "Polygon"
                    ? "Polygon"
                    : "Ethereum"
                  : media.BlockchainNetwork}
              </Box>
            </Box>
          )}
          {!media.metadata && (
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-end">
              <Text color={Color.Black} size={FontSize.XL}>
                Price
              </Text>
              <Text color={Color.Purple} size={FontSize.XXL} ml={1} mr={1}>
                {media.tag
                  ? `${media?.price || 0}`
                  : `ETH ${
                      media?.ExchangeData ? media?.ExchangeData.Price : media?.NftConditions?.Price ?? 0
                    }`}
              </Text>
              {!media.tag && (
                <Text color={Color.Black} size={FontSize.S}>
                  {`$(${convertTokenToUSD(
                    media?.ExchangeData
                      ? media?.ExchangeData.OfferToken
                      : media?.NftConditions?.FundingToken ?? "ETH",
                    media?.ExchangeData ? media?.ExchangeData.Price : media?.NftConditions?.Price ?? 0
                  ).toFixed(6)})`}
                </Text>
              )}
            </Box>
          )}
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-end" mt={2}>
            {showDetailsBtn && (
              <PrimaryButton
                size={mobileMatches ? "small" : "medium"}
                onClick={handleDetails}
                style={{
                  background: "#DDFF57",
                  color: Color.Purple,
                  width: "50%",
                  marginRight: !media.Fraction && media.CreatorAddress == user.address ? "8px" : 0,
                }}
              >
                See More Details
              </PrimaryButton>
            )}

            {!media.Fraction && media.CreatorAddress == user.address && (
              <PrimaryButton
                size={mobileMatches ? "small" : "medium"}
                onClick={handleOpenFractionalise}
                style={{ background: "#DDFF57", color: Color.Purple, width: "50%", marginLeft: "8px" }}
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
    </Modal>
  );
};

export default MediaDetailsModal;
