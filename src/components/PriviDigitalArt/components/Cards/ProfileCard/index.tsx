import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import cls from "classnames";
import { ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper, withStyles } from "@material-ui/core";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import { SocialPrimaryButton } from "components/PriviSocial/index.styles";
import URL from "shared/functions/getURL";
import { Color, StyledDivider } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { useTypedSelector } from "store/reducers/Reducer";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import MediaDetailsModal from "components/PriviDigitalArt/modals/MediaDetailsModal";
import { getBidHistory } from "shared/services/API";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { onGetNonDecrypt } from "shared/ipfs/get";
import { getChainImageUrl } from "shared/functions/chainFucntions";
import { StyledSkeleton } from "shared/ui-kit/Styled-components/StyledComponents";
import { profileCardStyles } from "./index.styles";

enum MediaType {
  Video = "VIDEO_TYPE",
  LiveVideo = "LIVE_VIDEO_TYPE",
  Audio = "AUDIO_TYPE",
  LiveAudio = "LIVE_AUDIO_TYPE",
  Blog = "BLOG_TYPE",
  BlogSnap = "BLOG_SNAP_TYPE",
  DigitalArt = "DIGITAL_ART_TYPE",
}

const getRandomImageUrl = () => {
  return require(`assets/podImages/2.png`);
};

export default function ProfileCard({
  item,
  type,
  heightFixed,
  noMargin,
  handleRefresh,
}: {
  item: any;
  type: "Social" | "Media" | "Crew" | "Media Pod";
  heightFixed?: boolean;
  noMargin?: boolean;
  handleRefresh?: any;
}) {
  const { convertTokenToUSD } = useTokenConversion();
  const classes = profileCardStyles();
  const usersList = useTypedSelector(state => state.usersInfoList);
  const user = useTypedSelector(state => state.user);

  const [onHover, setOnHover] = useState<boolean>(false);
  const [endTime, setEndTime] = useState<any>();
  const [auctionEnded, setAuctionEnded] = React.useState<boolean>(false);
  const [openShareMenu, setOpenShareMenu] = useState(false);
  const anchorShareMenuRef = useRef<HTMLButtonElement>(null);
  const { shareMediaToSocial, shareMediaWithQrCode } = useShareMedia();

  const [totalView, setTotalView] = useState<number>(0);
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [change24h, setChange24h] = useState<number>(0);
  const [creatorsData, setCreatorsData] = useState<any[]>([]);

  const [openMediaDetailsModal, setOpenMediaDetailsModal] = useState<boolean>(false);

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageIPFS, setImageIPFS] = useState("");

  // get 24h change for auction
  useEffect(() => {
    if (item?.Auctions) {
      getBidHistory(item.MediaSymbol, item.Type).then(resp => {
        if (resp?.success) {
          let startPrice;
          let found = false;
          const startTime = Date.now() - 1000 * 3600 * 24;
          const data = resp.data;
          for (let i = 0; i < data.length && !found; i++) {
            if (data[i]?.date >= startTime) {
              startPrice = data[i].price;
              found = true;
            }
          }
          if (startPrice && data[data.length - 1].price)
            setChange24h((data[data.length - 1].price - startPrice) / startPrice);
        }
      });
    }
  }, [item?.Auctions]);

  useEffect(() => {
    if (item) {
      setBookmarked(true);
      setTotalView(item.TotalView);

      if (item.CreatorAddress) {
        axios.get(`${URL()}/user/getBasicUserInfo/${item.CreatorAddress}`).then(res => {
          const resp = res.data;
          if (resp?.success) {
            const data = resp.data;
            setCreatorsData([
              {
                ...data,
                name: data.name ?? `${data.firstName} ${data.lastName}`,
              },
            ]);
          }
        });
      }

      if (item.cid) {
        getImageIPFS(item.cid);
      }
    }
  }, [item, usersList]);

  useEffect(() => {
    if (item?.cid) {
      getImageIPFS(item.cid);
    }
  }, [ipfs]);

  useEffect(() => {
    if (item.Auctions) {
      const timerId = setInterval(() => {
        const now = new Date();
        let delta = Math.floor(item.Auctions.EndTime - now.getTime() / 1000);
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
  }, [item]);

  const getImageIPFS = async (cid: string) => {
    setIsLoading(true);
    let files = await onGetNonDecrypt(cid, (fileCID, download) =>
      downloadWithNonDecryption(fileCID, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.content);
      setImageIPFS("data:image/png;base64," + base64String);
    }
    setIsLoading(false);
  };

  const isBookmarked = () => {
    if (item.Bookmarks) {
      if (item.Bookmarks.some(bookmark => bookmark.userId === user.id)) {
        return true;
      }
    }

    return false;
  };

  const handleSave = e => {
    e.stopPropagation();
    e.preventDefault();

    const itemCopy = { ...item };
    itemCopy.userAddress = user.id;
    itemCopy.bookmarked = !isBookmarked();

    let path = `/community/bookmark`;
    axios
      .post(`${URL()}` + path, itemCopy)
      .then(response => {
        if (response.data.success) {
          if (itemCopy.bookmarked) {
            if (itemCopy.Bookmarks) {
              if (!itemCopy.Bookmarks.some(bookmark => bookmark.userId === user.id)) {
                itemCopy.Bookmarks.push({ userId: user.id, date: new Date() });
              }
            } else itemCopy.Bookmarks = [{ userId: user.id, date: new Date() }];
          } else {
            if (itemCopy.Bookmarks) {
              itemCopy.Bookmarks = itemCopy.Bookmarks.filter(item => item.userId !== user.id);
            }
          }

          setBookmarked(itemCopy.Bookmarks.some(b => b.userId === user.id));
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleOpenShareModal = e => {
    e.stopPropagation();
    e.preventDefault();

    shareMediaToSocial(item.id, "Community");
  };

  const handleOpenQRCodeModal = e => {
    e.stopPropagation();
    e.preventDefault();
    shareMediaWithQrCode(item?.Name, `communities/${item?.Name.replace(/\s/g, "")}`);
  };

  const handleToggleShareMenu = e => {
    e.stopPropagation();
    e.preventDefault();

    setOpenShareMenu(prevShareMenuOpen => !prevShareMenuOpen);
  };

  const handleCloseShareMenu = (event: React.MouseEvent<EventTarget>) => {
    event.stopPropagation();
    if (anchorShareMenuRef.current && anchorShareMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenShareMenu(false);
  };

  function handleListKeyDownShareMenu(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenShareMenu(false);
    }
  }

  const handleClickCard = () => {
    setOpenMediaDetailsModal(true);
    setTotalView(value => value + 1);
  };

  return (
    <>
      <div
        className={classes.card}
        style={
          noMargin
            ? { margin: 0, width: "100%" }
            : {
                marginRight: "42px",
                marginBottom: "42px",
                width: "calc(100% - 42px)",
              }
        }
        onClick={handleClickCard}
      >
        <div className={classes.topActions}>
          <Box display="flex" alignItems="center">
            {type !== "Social" && (
              <span onClick={handleSave}>
                <img
                  src={require(`assets/priviIcons/${bookmarked ? "bookmark-filled" : "bookmark"}.svg`)}
                  alt={"list"}
                />
              </span>
            )}
            {type !== "Social" && (
              <span onClick={handleToggleShareMenu} ref={anchorShareMenuRef}>
                <img src={require("assets/priviIcons/share.svg")} alt={"share"} />
              </span>
            )}
            {openShareMenu && (
              <Popper
                open={openShareMenu}
                anchorEl={anchorShareMenuRef.current}
                transition
                disablePortal={false}
                style={{ position: "inherit" }}
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                      position: "inherit",
                    }}
                  >
                    <Paper className="popoverPaper">
                      <ClickAwayListener onClickAway={handleCloseShareMenu}>
                        <MenuList
                          autoFocusItem={openShareMenu}
                          id="menu-list-grow"
                          onKeyDown={handleListKeyDownShareMenu}
                        >
                          <CustomMenuItem onClick={handleOpenShareModal}>
                            <img
                              src={require("assets/icons/butterfly.png")}
                              alt={"spaceship"}
                              style={{ width: 20, height: 20, marginRight: 5 }}
                            />
                            Share on social media
                          </CustomMenuItem>

                          <CustomMenuItem onClick={handleOpenQRCodeModal}>
                            <img
                              src={require("assets/icons/qrcode_small.png")}
                              alt={"spaceship"}
                              style={{ width: 20, height: 20, marginRight: 5 }}
                            />
                            Share With QR Code
                          </CustomMenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            )}
          </Box>
          {(item?.BlockchainNetwork || item.chainsFullName) && (
            <img
              src={getChainImageUrl(
                item.BlockchainNetwork ??
                  (item.chainsFullName === "Mumbai" || item.chainsFullName === "Polygon"
                    ? "Polygon"
                    : "Ethereum")
              )}
              alt={"chain"}
            />
          )}
        </div>
        <div
          className={classes.header}
          onMouseEnter={() => setOnHover(true)}
          onMouseLeave={() => setOnHover(false)}
          style={!heightFixed && creatorsData.length > 0 ? { minHeight: "330px" } : { minHeight: "270px" }}
        >
          <div
            className={classes.cardCover}
            style={
              item.dimensions && !heightFixed
                ? {
                    height: 0,
                    paddingBottom: `${
                      (item.dimensions.height / item.dimensions.width) * 100 >= 120
                        ? (item.dimensions.height / item.dimensions.width) * 100
                        : 120
                    }%`,
                  }
                : {
                    height: !heightFixed && creatorsData.length > 0 ? "330px" : "272px",
                  }
            }
          >
            <div className={classes.aspectRatioWrapper}>
              {!item.cid || type === "Social" ? (
                <div
                  className={classes.image}
                  style={
                    type === "Social"
                      ? {
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }
                      : {
                          backgroundImage: `url(${item?.metadata?.image ?? getRandomImageUrl()})`,
                          backgroundSize: "cover",
                        }
                  }
                >
                  {type === "Social" && (
                    <img className={classes.socialTokenImg} src={item.imageURL} alt={"card"} />
                  )}
                </div>
              ) : isLoading ? (
                <StyledSkeleton width="100%" height="100%" variant="rect" />
              ) : (
                <object
                  data={item.cid ? imageIPFS : ""}
                  type="image/png"
                  className={cls(classes.image, classes.img)}
                >
                  <div className={classes.image} />
                </object>
              )}
            </div>
            <div className={cls({ [classes.hidden]: !onHover }, classes.aspectRatioWrapper)}>
              <div className={classes.content}>
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                  <Box>
                    <Box fontSize="14px" alignItems="center" display="flex">
                      <img
                        src={require("assets/emojiIcons/fruits.png")}
                        alt="fruits"
                        width="22px"
                        height="21px"
                        style={{ marginRight: "8px" }}
                      />
                      Fruits
                    </Box>
                    <Box>{(item?.fruits ?? []).length}</Box>
                  </Box>
                  <Box>
                    <Box fontSize="14px" alignItems="center" display="flex">
                      <img
                        src={require("assets/emojiIcons/spaceship.png")}
                        alt="spaceship"
                        width="22px"
                        height="21px"
                        style={{ marginRight: "8px" }}
                      />
                      Shares
                    </Box>
                    <Box>0</Box>
                  </Box>
                  <Box>
                    <Box fontSize="14px" alignItems="center" display="flex">
                      <img
                        src={require("assets/emojiIcons/glasses.png")}
                        alt="glasses"
                        width="22px"
                        height="21px"
                        style={{ marginRight: "8px" }}
                      />
                      Views
                    </Box>
                    <Box>{item.TotalViews ?? 0}</Box>
                  </Box>
                </Box>

                <Box width="100%">
                  <StyledDivider color={Color.White} type="solid" margin={3} />
                </Box>

                <Box display="flex" alignItems="flex-start" justifyContent="space-between" width="100%">
                  {/* <Box>
                    <Box fontSize="14px">Price</Box>
                    <Box>
                      {`${
                        item && item.NftConditions && item.NftConditions.Price
                          ? item.NftConditions.Price
                          : "Free"
                      } ${
                        item && item.NftConditions && item.NftConditions.Price > 0
                          ? (item.NftConditions.FundingToken ||
                              item.NftConditions.NftToken ||
                              item.ViewConditions.ViewingToken) ??
                            ""
                          : ""
                      }`}
                    </Box>
                  </Box> */}
                  <Box>
                    <Box fontSize="14px">Bid</Box>
                    {item.Auctions ? (
                      <Box>
                        {`${Math.max(item.Auctions.Gathered, item.Auctions.ReservePrice) || 0} ${
                          item.Auctions.TokenSymbol
                        }`}
                      </Box>
                    ) : (
                      0
                    )}
                  </Box>
                  <Box>
                    <Box fontSize="14px">24h Change</Box>
                    <Box>
                      {change24h > 0 ? "+" : ""}
                      {(change24h * 100).toFixed(2)}%
                    </Box>
                  </Box>
                </Box>
                {item.ExchangeData > 0 && (
                  <Box width="100%">
                    <StyledDivider color={Color.White} type="solid" margin={3} />
                  </Box>
                )}
                {item.ExchangeData > 0 && (
                  <Box className={classes.marketPrice}>
                    Market Price
                    <span>{`${item.ExchangeData?.Price} ${item.ExchangeData?.OfferToken ?? "USDT"}`}</span>
                  </Box>
                )}
                {creatorsData && creatorsData.length > 0 && (
                  <Box width="100%">
                    <StyledDivider color={Color.White} type="solid" margin={3} />
                  </Box>
                )}
                {creatorsData && creatorsData.length > 0 && (
                  <Box display="flex" alignItems="center" justifyContent="flex-start" alignSelf="flex-start">
                    {creatorsData.map((creator, index) =>
                      index < 3 ? (
                        <div
                          key={`creator-${index}`}
                          className={classes.avatar}
                          style={{
                            backgroundImage: `url(${
                              creator?.url
                                ? creator.url
                                : creator?.anonAvatar
                                ? `${require(`assets/anonAvatars/${user.anonAvatar}`)}`
                                : getRandomAvatarForUserIdWithMemoization(creator.id)
                            })`,
                          }}
                        />
                      ) : null
                    )}
                    {creatorsData.length > 3 && (
                      <div className={classes.creatorsCounter}>+{creatorsData.length - 1}</div>
                    )}
                  </Box>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={classes.bottomContent}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" maxWidth="80%">
              {type === "Media" && (
                <img
                  width={36}
                  style={{ marginRight: "8px" }}
                  src={require(`assets/mediaIcons/small/digital_art.png`)}
                />
              )}
              <Box style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item?.MediaName || item?.metadata?.name}
              </Box>
            </Box>

            <FruitSelect fruitObject={item} members={type === "Crew" ? item.Members : []} />
          </Box>
          {item && item.Fraction && (
            <Box className={classes.fraction}>Fractionalized {Math.round(item.Fraction.Fraction * 100)}%</Box>
          )}
          {type.includes("Pod") && (
            <Box mt="4px">
              <SocialPrimaryButton style={{ background: "#431AB7", borderColor: "#431AB7" }}>
                Fractionalise
              </SocialPrimaryButton>
            </Box>
          )}
        </div>
        {item.Auctions && endTime && (
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
      {openMediaDetailsModal && (
        <MediaDetailsModal
          open={openMediaDetailsModal}
          handleClose={() => setOpenMediaDetailsModal(false)}
          handleRefresh={handleRefresh}
          media={item}
          mediaViews={totalView}
          cidUrl={item?.cid ? imageIPFS : ""}
        />
      )}
    </>
  );
}

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
  },
})(MenuItem);
