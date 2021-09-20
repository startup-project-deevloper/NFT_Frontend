import React, { useState, useEffect } from "react";

import {
  ClickAwayListener,
  Grid,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  withStyles,
  Hidden,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";

import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import { formatNumber } from "shared/functions/commonFunctions";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { musicDaoFollowPod, musicDaoUnfollowPod, musicDaoFruitPod } from "shared/services/API";
import { useTypedSelector } from "store/reducers/Reducer";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import Box from "shared/ui-kit/Box";
import { usePodDetailStyles } from "../index.styles";

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
  },
})(MenuItem);

const randomImageNumber = Math.floor(Math.random() * 15 + 1);

export default function PodHeader({
  pod,
  followed,
  setFollowed,
  fundingEnded,
  fundingEndTime,
}: {
  pod: any;
  followed: boolean;
  setFollowed: any;
  fundingEnded: boolean;
  fundingEndTime: any;
}) {
  const user = useTypedSelector(state => state.user);
  const classes = usePodDetailStyles();

  const theme = useTheme();
  const isLgTablet = useMediaQuery(theme.breakpoints.down(1080));
  const isTablet = useMediaQuery(theme.breakpoints.down(780));

  const [podData, setPodData] = useState<any>(pod);
  const { convertTokenToUSD } = useTokenConversion();
  const { shareMediaToSocial, shareMediaWithQrCode } = useShareMedia();
  const { showAlertMessage } = useAlertMessage();

  const [openShareMenu, setOpenShareMenu] = React.useState<boolean>(false);
  const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);

  const [randomImage, setRandomImage] = useState<string>("");

  useEffect(() => {
    setRandomImage(podData?.url ?? require(`assets/podImages/${randomImageNumber}.png`));
  }, [podData]);

  const handleFollow = async () => {
    if (!followed) {
      musicDaoFollowPod(user.id, podData.PodAddress).then(resp => {
        if (resp.success) {
          showAlertMessage(`followed`, { variant: "success" });
          setFollowed(true);
        } else {
          showAlertMessage(`follow failed`, { variant: "error" });
        }
      });
    } else {
      musicDaoUnfollowPod(user.id, podData.PodAddress).then(resp => {
        if (resp.success) {
          showAlertMessage(`unfollowed`, { variant: "success" });
          setFollowed(false);
        } else {
          showAlertMessage(`unfollow failed`, { variant: "error" });
        }
      });
    }
  };

  const handleFruit = type => {
    musicDaoFruitPod(user.id, podData.PodAddress, type).then(res => {
      if (res.success) {
        const itemCopy = { ...podData };
        itemCopy.fruits = [
          ...(itemCopy.fruits || []),
          { userId: user.id, fruitId: type, date: new Date().getTime() },
        ];
        setPodData(itemCopy);
      }
    });
  };

  const showShareMenu = () => {
    setOpenShareMenu(true);
  };

  const handleCloseShareMenu = (event: React.MouseEvent<EventTarget>) => {
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

  const handleOpenQRCodeModal = () => {
    const link = window.location.href.includes("NFT")
      ? `pods/MediaNFT/${podData.PodAddress}`
      : `pods/FT/${podData.PodAddress}`;
    shareMediaWithQrCode(podData.urlSlug, link);
  };

  const handleOpenShareModal = () => {
    const link = window.location.href.includes("NFT")
      ? `pods/MediaNFT/${podData.PodAddress}`
      : `pods/FT/${podData.PodAddress}`;
    shareMediaToSocial(podData.urlSlug, "Pod", "NEW-PRIVI-PODS", link);
  };

  return (
    <>
      <Box className={classes.headerBox} style={{ backgroundImage: `url(${podData?.url ?? randomImage})` }}>
        <Box py={4} className={classes.backgroundBox}>
          <Grid container>
            <Hidden smUp>
              <Grid item xs={12}>
                <img
                  src={podData?.url ?? randomImage}
                  style={{
                    objectFit: "fill",
                    borderRadius: "10px",
                  }}
                  height={400}
                  width="100%"
                />
              </Grid>
            </Hidden>
            <Grid item md={8} sm={6} xs={12} style={{ paddingRight: isLgTablet ? 0 : "64px" }}>
              {!fundingEnded && (
                <Box className={classes.flexBox}>
                  <Box className={classes.fractionBox}>Funding</Box>
                </Box>
              )}
              <div className={classes.title}>{podData.Name || "Untitled Pod"}</div>
              <Box className={classes.flexBox} mt={1}>
                <div className={classes.tagBox}>pop</div>
                <div className={classes.tagBox}>electro</div>
              </Box>
              <Box mt={2} className={classes.header1} color="#081831 !important">
                {podData.Description}
              </Box>
              <Box
                className={classes.flexBox}
                justifyContent="space-between"
                mt={2}
                flexWrap="wrap"
                flexDirection={!pod.distributionProposalAccepted && !isLgTablet ? "row-reverse" : "row"}
              >
                <Box className={classes.flexBox} mb={isLgTablet ? 2 : 0}>
                  <div
                    ref={anchorShareMenuRef}
                    className={classes.svgBox}
                    onClick={showShareMenu}
                    style={{ height: "fit-content" }}
                  >
                    <ShareIcon />
                  </div>
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
                          <Paper className={classes.paper}>
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
                  <Box ml={"18px"}>
                    <FruitSelect fruitObject={podData} members={[]} onGiveFruit={handleFruit} />
                  </Box>
                  <Box ml={3} className={classes.flexBox} style={{ cursor: "pointer" }}>
                    {!followed ? <PlusIcon /> : <MinusIcon />}
                    <Box
                      mt={"4px"}
                      ml={1}
                      onClick={handleFollow}
                      fontSize="14px"
                      color="#081831"
                      fontWeight={700}
                      fontFamily="Agrandir"
                    >
                      {followed ? "Unfollow" : "Follow"}
                    </Box>
                  </Box>
                </Box>
                <Box
                  mb={1}
                  display="flex"
                  alignItems={isTablet ? "flex-start" : "center"}
                  flexDirection={isTablet ? "column" : "row"}
                >
                  <Box
                    className={classes.header3}
                    fontWeight={"bold"}
                    color="#2D3047"
                    fontFamily="Montserrat"
                    mb={isTablet ? "4px" : 0}
                  >
                    Time to finish funding
                  </Box>
                  <Box className={classes.flexBox} ml={1}>
                    <Box className={classes.timeBox} fontWeight={800}>
                      {fundingEndTime.days} Days
                    </Box>
                    <Box className={classes.timeBox}>{fundingEndTime.hours}h</Box>
                    <Box className={classes.timeBox}>{fundingEndTime.minutes}min</Box>
                    <Box className={classes.timeBox}>{fundingEndTime.seconds}s</Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Hidden xsDown>
              <Grid item md={4} sm={6}>
                <Box height={240} p={2} overflow={"hidden"}>
                  <img
                    src={podData?.url ?? randomImage}
                    style={{
                      objectFit: "fill",
                      borderRadius: "10px",
                    }}
                    height="100%"
                    width="100%"
                  />
                </Box>
              </Grid>
            </Hidden>
          </Grid>
        </Box>
      </Box>
      {pod.distributionProposalAccepted && (
        <Box py={2} className={classes.whiteBox}>
          <Box>
            <Box className={classes.header1}>Price</Box>
            <Box className={classes.header2} mt={1}>
              {formatNumber(convertTokenToUSD(podData.FundingToken, podData?.Price ?? 0), "USD", 4)}
            </Box>
          </Box>
          <Box>
            <Box className={classes.header1}>Interest Rate</Box>
            <Box className={classes.header2} mt={1}>
              {(podData?.InvestorDividend ?? 0) * 100}%
            </Box>
          </Box>
          <Box>
            <Box className={classes.header1}>Raised Funds</Box>
            <Box className={classes.header2} mt={1}>
              {formatNumber(convertTokenToUSD(podData.FundingToken, podData?.RaisedFunds ?? 0), "USD", 4)}
            </Box>
          </Box>
          <Box>
            <Box className={classes.header1}>Market Cap</Box>
            <Box className={classes.header2} mt={1}>
              {formatNumber(
                (podData?.SupplyReleased ?? 0) * convertTokenToUSD(podData.FundingToken, podData?.Price ?? 0),
                "USD",
                4
              )}
            </Box>
            <Box className={classes.header1} mt={1}></Box>
          </Box>
          <Box>
            <Box className={classes.header1}>Supply Released</Box>
            <Box className={classes.header2} mt={1}>
              {formatNumber(podData?.SupplyReleased ?? 0, podData.TokenSymbol, 4)}
            </Box>
            <Box className={classes.header1} mt={1}></Box>
          </Box>
          <Box>
            <Box className={classes.header1}>{"Share & Earn"}</Box>
            <Box className={classes.header2} mt={1}>
              {podData?.SharingPercent ?? 0}%
            </Box>
            <Box className={classes.header1} mt={1}></Box>
          </Box>
          <Box>
            <Box className={classes.header1}>Revenue</Box>
            <Box className={classes.header2} mt={1}>
              --
            </Box>
            <Box className={classes.header1} mt={1}></Box>
          </Box>
        </Box>
      )}
    </>
  );
}

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path
      d="M5.97949 1.10547V11.1055M0.979492 6.10547L10.9795 6.10547"
      stroke="#081831"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 11.5 1.5" fill="none">
    <path
      stroke="#081831"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M1,6.11H11"
      transform="translate(-0.23 -5.36)"
    />
    <path
      stroke="#081831"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M-10.52,1.93"
      transform="translate(-0.23 -5.36)"
    />
  </svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
    <path
      d="M12.839 14.0074L6.46241 10.8192M6.45335 8.22965L12.8359 5.03836M18.3128 15.2999C18.3128 16.8954 17.0194 18.1888 15.4239 18.1888C13.8284 18.1888 12.535 16.8954 12.535 15.2999C12.535 13.7044 13.8284 12.411 15.4239 12.411C17.0194 12.411 18.3128 13.7044 18.3128 15.2999ZM18.3128 3.74436C18.3128 5.33985 17.0194 6.63325 15.4239 6.63325C13.8284 6.63325 12.535 5.33985 12.535 3.74436C12.535 2.14887 13.8284 0.855469 15.4239 0.855469C17.0194 0.855469 18.3128 2.14887 18.3128 3.74436ZM6.75727 9.52214C6.75727 11.1176 5.46387 12.411 3.86838 12.411C2.27289 12.411 0.979492 11.1176 0.979492 9.52214C0.979492 7.92665 2.27289 6.63325 3.86838 6.63325C5.46387 6.63325 6.75727 7.92665 6.75727 9.52214Z"
      stroke="#081831"
      stroke-width="1.5"
    />
  </svg>
);
