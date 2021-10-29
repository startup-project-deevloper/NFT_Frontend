import React, { useState, useEffect } from "react";
import Web3 from "web3";

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
import { useHistory } from "react-router-dom";

import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import { formatNumber } from "shared/functions/commonFunctions";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { musicDaoFollowPod, musicDaoUnfollowPod, musicDaoFruitPod } from "shared/services/API";
import { useTypedSelector } from "store/reducers/Reducer";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import Box from "shared/ui-kit/Box";
import { podCardStyles } from "../../../components/Cards/PodCard/index.styles";
import { usePodPageIndividualStyles } from "../index.styles";
import { ArrowIcon } from "components/PriviDigitalArt/components/Icons/SvgIcons";
import { Color, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { useWeb3React } from "@web3-react/core";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";

const checkValidate = value => {
  if (value && value >= 0) {
    return value;
  }
  return 0;
};

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
  },
})(MenuItem);

const randomImageNumber = Math.floor(Math.random() * 15 + 1);

declare let window: any;

export default function PodHeader({
  pod,
  podInfo,
  followed,
  setFollowed,
  fundingEnded,
  fundingEndTime,
  imageIPFS,
  isFunded,
}: {
  pod: any;
  podInfo: any;
  followed: boolean;
  setFollowed: any;
  fundingEnded: boolean;
  fundingEndTime: any;
  imageIPFS: any;
  isFunded: boolean;
}) {
  const user = useTypedSelector(state => state.user);
  const classes = usePodPageIndividualStyles();
  const styles = podCardStyles();

  const history = useHistory();

  const theme = useTheme();
  const isLgTablet = useMediaQuery(theme.breakpoints.down(1080));
  const isTablet = useMediaQuery(theme.breakpoints.down(780));
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [podData, setPodData] = useState<any>(pod);
  const { shareMediaToSocial, shareMediaWithQrCode } = useShareMedia();
  const { showAlertMessage } = useAlertMessage();

  const [openShareMenu, setOpenShareMenu] = React.useState<boolean>(false);
  const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);

  const [randomImage, setRandomImage] = useState<string>("");

  const [proposalEnded, setProposalEnded] = useState<boolean>(false);
  const [proposalEndTime, setProposalEndTime] = useState<any>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const { library, chainId } = useWeb3React();

  useEffect(() => {
    if (!podData.distributionProposalAccepted) {
      const timerId = setInterval(() => {
        let delta;
        const now = new Date();
        if (podData?.ProposalDeadline) {
          delta = Math.floor(podData.ProposalDeadline._seconds - now.getTime() / 1000);
        } else {
          const created = new Date(podData.Created * 1000);
          created.setDate(created.getDate() + 7);
          delta = Math.floor((created.getTime() - now.getTime()) / 1000);
        }
        if (delta < 0) {
          setProposalEnded(true);
          setProposalEndTime({
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
          setProposalEnded(false);
          setProposalEndTime({
            days,
            hours,
            minutes,
            seconds,
          });
        }
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [podData?.ProposalDeadline]);

  useEffect(() => {
    setRandomImage(podData?.url ?? require(`assets/podImages/${randomImageNumber}.png`));
  }, [podData]);

  const handleFollow = async () => {
    if (!followed) {
      musicDaoFollowPod(user.id, podData.Id).then(resp => {
        if (resp.success) {
          showAlertMessage(`Followed`, { variant: "success" });
          setFollowed(true);
        } else {
          showAlertMessage(`Follow failed`, { variant: "error" });
        }
      });
    } else {
      musicDaoUnfollowPod(user.id, podData.Id).then(resp => {
        if (resp.success) {
          showAlertMessage(`Unfollowed`, { variant: "success" });
          setFollowed(false);
        } else {
          showAlertMessage(`Unfollow failed`, { variant: "error" });
        }
      });
    }
  };

  const handleFruit = type => {
    if (podData.fruits?.filter(f => f.fruitId === type)?.find(f => f.userId === user.id)) {
      showAlertMessage("You had already given this fruit.", { variant: "info" });
      return;
    }
    musicDaoFruitPod(user.id, podData.Id, type).then(res => {
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
    const link = `pods/${podData.Id}`;
    shareMediaWithQrCode(podData.Id, link);
  };

  const handleOpenShareModal = () => {
    const link = `pods/${podData.Id}`;
    shareMediaToSocial(podData.Id, "Pod", "NEW-PRIVI-PODS", link);
  };

  const handleAddCopyright = async () => {
    if (!pod || !podInfo) return;

    const targetChain = BlockchainNets.find(net => net.value === pod.blockchainNetwork);
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Got failed while switching over to target netowrk", { variant: "error" });
        return;
      }
    }

    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);

    const decimals = await web3APIHandler?.Erc20["COPYRIGHT"].decimals(web3, podInfo.copyrightToken);
    window.ethereum
      .request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: podInfo.copyrightToken,
            symbol: pod.CopyRightSymbol,
            decimals,
          },
        },
      })
      .then(() => {
        showAlertMessage("Successfully added the token to your metamask", { variant: "success" });
      })
      .catch(e => {
        showAlertMessage(e.message, { variant: "error" });
      });
  };

  const handleAddPodToken = async () => {
    if (!pod || !podInfo) return;

    const targetChain = BlockchainNets.find(net => net.value === pod.blockchainNetwork);
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Got failed while switching over to target netowrk", { variant: "error" });
        return;
      }
    }

    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);

    const decimals = await web3APIHandler?.Erc20["POD"].decimals(web3, podInfo.podAddress);
    window.ethereum
      .request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: podInfo.podAddress,
            symbol: pod.TokenSymbol,
            decimals,
          },
        },
      })
      .then(() => {
        showAlertMessage("Successfully added the token to your metamask", { variant: "success" });
      })
      .catch(e => {
        showAlertMessage(e.message, { variant: "error" });
      });
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        style={{ cursor: "pointer" }}
        onClick={() => history.goBack()}
        mb={isMobile ? 2 : 4}
      >
        <Box>
          <ArrowIcon color={"#181818"} />
        </Box>
        <Box color="#181818" fontSize={14} fontWeight={700} fontFamily="Agrandir" ml="5px" mb="4px">
          BACK
        </Box>
      </Box>
      <Box
        className={classes.headerBox}
        style={{ backgroundImage: "linear-gradient(to right, #DDFF57 , #9EACF2)" }}
      >
        <Box py={4} className={classes.backgroundBox}>
          <Grid container justifyContent="space-between">
            <Hidden smUp>
              <Grid item xs={12}>
                <img
                  src={imageIPFS ? imageIPFS : getDefaultAvatar()}
                  style={{
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                  height={400}
                  width="100%"
                />
              </Grid>
            </Hidden>
            <div style={{ paddingRight: isLgTablet ? 0 : "64px", flex: 1, }}>
              <Box display="flex">
                <Box
                  className={
                    podData.status === "Funding"
                      ? styles.orangeBox
                      : podData.status === "Funding Failed"
                      ? styles.redBox
                      : podData.status === "Funded"
                      ? styles.blueBox
                      : styles.blueBox
                  }
                  style={{ fontWeight: "bold" }}
                  px={1}
                  pt={0.5}
                >
                  {podData.status === "Funding"
                    ? "Funding"
                    : podData.status === "Funding Failed"
                    ? "Funding Failed"
                    : podData.status === "Funded"
                    ? "Funded"
                    : "Under formation"}
                </Box>
              </Box>
              <div className={classes.title}>{podData.Name || "Untitled Pod"}</div>
              <Box
                mt={2}
                className={classes.header1}
                color="#081831 !important"
                style={{ wordBreak: "break-word" }}
              >
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
                      mx={1}
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
                {isFunded ? (
                  <Box
                    mb={1}
                    mt={1}
                    display="flex"
                    alignItems={isTablet ? "flex-start" : "center"}
                    flexDirection={isTablet ? "column" : "row"}
                  >
                    <PrimaryButton
                      size="small"
                      isRounded
                      onClick={handleAddCopyright}
                      className={classes.addCopyRightBtn}
                      style={{ background: Color.MusicDAOGreen }}
                    >
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        Add Copyright Fractions&nbsp; +
                        <img src={require("assets/walletImages/metamask.svg")} width={16} height={16} />
                      </Box>
                    </PrimaryButton>
                    <SecondaryButton
                      size="small"
                      isRounded
                      onClick={handleAddPodToken}
                      className={classes.addPodTokenBtn}
                      style={{ background: Color.Black, color: Color.White, border: "none" }}
                    >
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        Add POD Token&nbsp; +
                        <img src={require("assets/walletImages/metamask.svg")} width={16} height={16} />
                      </Box>
                    </SecondaryButton>
                  </Box>
                ) : (
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
                      {pod.distributionProposalAccepted ? "Time to finish funding" : "Pod Creation Deadline"}
                    </Box>
                    <Box className={classes.flexBox} ml={1}>
                      <Box className={classes.timeBox} fontWeight={800}>
                        {pod.distributionProposalAccepted ? fundingEndTime.days : proposalEndTime.days} Days
                      </Box>
                      <Box className={classes.timeBox}>
                        {pod.distributionProposalAccepted ? fundingEndTime.hours : proposalEndTime.hours}h
                      </Box>
                      <Box className={classes.timeBox}>
                        {pod.distributionProposalAccepted ? fundingEndTime.minutes : proposalEndTime.minutes}
                        min
                      </Box>
                      <Box className={classes.timeBox}>
                        {pod.distributionProposalAccepted ? fundingEndTime.seconds : proposalEndTime.seconds}s
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </div>
            <Hidden xsDown>
              <div>
                <Box height={240} overflow={"hidden"}>
                  <img
                    src={imageIPFS ? imageIPFS : getDefaultAvatar()}
                    style={{
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                    height="100%"
                    width="208px"
                  />
                </Box>
              </div>
            </Hidden>
          </Grid>
        </Box>
      </Box>
      {pod.distributionProposalAccepted && (
        <Box py={2} className={classes.whiteBox}>
          {!isMobile ? (
            <>
              <Box>
                <Box className={classes.header1}>Price</Box>
                <Box className={classes.header2} mt={1}>
                  {formatNumber(checkValidate(podData?.FundingPrice), "USD", 4)}
                </Box>
              </Box>
              <Box>
                <Box className={classes.header1}>Interest Share</Box>
                <Box className={classes.header2} mt={1}>
                  {podData?.InvestorShare ?? 0}%
                </Box>
              </Box>
              <Box>
                <Box className={classes.header1}>Raised Funds</Box>
                <Box className={classes.header2} mt={1}>
                  {formatNumber(checkValidate(podData?.RaisedFunds), "USD", 4)}
                </Box>
              </Box>
              <Box>
                <Box className={classes.header1}>Market Cap</Box>
                <Box className={classes.header2} mt={1}>
                  {formatNumber(checkValidate(podData?.RaisedFunds), "USD", 4)}
                </Box>
                {/* <Box className={classes.header1} mt={1}></Box> */}
              </Box>
              <Box>
                <Box className={classes.header1}>Supply Released</Box>
                <Box className={classes.header2} mt={1}>
                  {podData?.RaisedFunds && podData?.FundingPrice
                    ? (+podData?.RaisedFunds / +podData?.FundingPrice).toFixed(2)
                    : 0}
                </Box>
                {/* <Box className={classes.header1} mt={1}></Box> */}
              </Box>
              <Box>
                <Box className={classes.header1}>{"Share & Earn"}</Box>
                <Box className={classes.header2} mt={1}>
                  {podData?.SharingPercentage ?? 0}%
                </Box>
                {/* <Box className={classes.header1} mt={1}></Box> */}
              </Box>
              <Box>
                <Box className={classes.header1}>Revenue</Box>
                <Box className={classes.header2} mt={1}>
                  --
                </Box>
                {/* <Box className={classes.header1} mt={1}></Box> */}
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Box className={classes.header1}>Price</Box>
                  <Box className={classes.header2} mt={1}>
                    {formatNumber(checkValidate(podData?.FundingPrice), "USD", 4)}
                  </Box>
                </Box>
                <Box>
                  <Box className={classes.header1}>Interest Share</Box>
                  <Box className={classes.header2} mt={1}>
                    {podData?.InvestorShare ?? 0}%
                  </Box>
                </Box>
                <Box>
                  <Box className={classes.header1}>Raised Funds</Box>
                  <Box className={classes.header2} mt={1}>
                    {formatNumber(checkValidate(podData?.RaisedFunds), "USD", 4)}
                  </Box>
                </Box>
                <Box>
                  <Box className={classes.header1}>Market Cap</Box>
                  <Box className={classes.header2} mt={1}>
                    {formatNumber(checkValidate(podData?.RaisedFunds), "USD", 4)}
                  </Box>
                  {/* <Box className={classes.header1} mt={1}></Box> */}
                </Box>
              </Box>
              <Box my={2} sx={{ width: "100%", height: "1px", bgcolor: "#ccc" }} />
              <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Box className={classes.header1}>Supply Released</Box>
                  <Box className={classes.header2} mt={1}>
                    {podData?.RaisedFunds && podData?.FundingPrice
                      ? (+podData?.RaisedFunds / +podData?.FundingPrice).toFixed(2)
                      : 0}
                  </Box>
                  {/* <Box className={classes.header1} mt={1}></Box> */}
                </Box>
                <Box>
                  <Box className={classes.header1}>{"Share & Earn"}</Box>
                  <Box className={classes.header2} mt={1}>
                    {podData?.SharingPercentage ?? 0}%
                  </Box>
                  {/* <Box className={classes.header1} mt={1}></Box> */}
                </Box>
                <Box>
                  <Box className={classes.header1}>Revenue</Box>
                  <Box className={classes.header2} mt={1}>
                    --
                  </Box>
                  {/* <Box className={classes.header1} mt={1}></Box> */}
                </Box>
              </Box>
            </>
          )}
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
