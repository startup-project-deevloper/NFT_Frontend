import React from "react";
import { makeStyles } from "@material-ui/core/styles";

export const fractionalisedCollectionStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    height: "100%",
    overflowY: "auto",
    minHeight: "calc(100vh - 80px)",
    maxHeight: "calc(100vh - 80px)",
  },
  collectionInfoSection: {
    padding: "39px 31px",
    background: "#ffffff",
    width: "100%",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      padding: "39px 25px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "39px 15px",
    },
  },
  noAuction: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    color: "#431AB7",

    "& img": {
      width: "100%",
      height: "100%",
      maxWidth: 430,
      marginBottom: 35,
    },

    [theme.breakpoints.down("sm")]: {
      fontSize: 18,
    },
  },
  buttonWrapper: {
    display: "flex",
    [theme.breakpoints.between(769, 880)]: {
      flexDirection: "column",

      "& > div": {
        width: "100%",
        height: 47,
        margin: 0,
        marginBottom: 10,
      },

      "& > div:last-child": {
        marginBottom: 0,
      },
    },
    [theme.breakpoints.down(768)]: {
      flexDirection: "column",

      "& > div": {
        width: "100%",
        height: 47,
        margin: 0,
        marginBottom: 10,
      },

      "& > div:last-child": {
        marginBottom: 0,
      },
    },
  },
  backButtonContainer: {
    paddingLeft: 48,
    alignItems: "center",

    [theme.breakpoints.between(769, 880)]: {
      paddingLeft: 0,
      alignItems: "flex-start",
    },
    [theme.breakpoints.down(768)]: {
      paddingLeft: 0,
      alignItems: "flex-start",
    },
  },
  "@keyframes gradientmove": {
    "0%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
  "@-webkit-keyframes gradientmove": {
    "0%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
  "@-moz-keyframes gradientmove": {
    "0%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
  tradeDerivativeButton: {
    cursor: "pointer",
    background: "linear-gradient(270deg, #3d01e2, #32ffff, #3c00e1)",
    backgroundSize: "600% 600%",
    WebkitAnimation: "$gradientmove 1.5s ease infinite",
    animation: "$gradientmove 1.5s ease infinite",
    MozAnimation: "$gradientmove 1.5s ease infinite",

    padding: "2px",
    borderRadius: 10,

    "& > div": {
      padding: "12px 32px",
      borderRadius: 7,
      display: "flex",
      alignItems: "center",
      background: "#ffffff",
      "& span": {
        marginLeft: "10px",
        fontSize: 18,
        fontWeight: 800,
        textTransform: "uppercase",
        lineHeight: "120%",
        fontFamily: "Agrandir",
        background: "#1A1B1C",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },

    [theme.breakpoints.between(769, 880)]: {
      "& > div": {
        padding: 0,
        justifyContent: "center",
        height: "100%",
      },
    },
    [theme.breakpoints.down(768)]: {
      width: "calc(50% - 8px)",
      "& > div": {
        padding: 0,
        justifyContent: "center",
        height: "100%",
      },
    },
  },
  orderBookBtn: {
    background: "#431AB7",
    padding: "12px 28px",
    borderRadius: 8,
    fontSize: 18,
    fontWeight: 800,
    marginRight: 8,
    cursor: "pointer",
    color: "#FFF",
  },
  metaMaskButton: {
    display: "flex",
    alignItems: "center",
    background: "#431AB7",
    padding: "12px 32px",
    borderRadius: 7,
    cursor: "pointer",
    marginLeft: 24,
    "& img": {
      width: 32,
    },
    "& span": {
      marginLeft: "10px",
      fontSize: 18,
      fontWeight: 800,
      textTransform: "uppercase",
      lineHeight: "120%",
      fontFamily: "Agrandir",
      color: "white",
    },
  },
  mobileEthContainer: {
    marginLeft: "auto",
  },
  collectionMainContent: {
    position: "relative",
    background: "linear-gradient(118.22deg, #431AB7 42.55%, #9EACF2 114.51%)",
    boxShadow: "0px 46px 49px -19px rgba(96, 71, 202, 0.17)",
    borderRadius: 20,
    width: "100%",
    height: "auto",
    minHeight: 320,
    padding: "30px 27px 42px 480px",
    marginTop: 44,
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    "& > img": {
      width: 436,
      height: "calc(100% + 14px)",
      borderRadius: 30,
      zIndex: 1,
      position: "absolute",
      top: -7,
      left: 0,
      [theme.breakpoints.down("md")]: {
        width: 300,
      },
      [theme.breakpoints.down("sm")]: {
        width: 237,
      },
      [theme.breakpoints.down(600)]: {
        width: "100%",
        left: 0,
        top: 0,
        height: 320,
        borderRadius: 20,
      },
    },
    [theme.breakpoints.down("md")]: {
      padding: "30px 27px 42px 340px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "30px 15px 42px 260px",
    },
    [theme.breakpoints.down(600)]: {
      padding: "350px 15px 30px",
    },
  },
  collectionInfos: {
    display: "flex",
    justifyContent: "space-between",
    rowGap: 24,
    columnGap: 30,
    marginTop: 37,
    [theme.breakpoints.down("md")]: {
      flexWrap: "wrap",
      justifyContent: "flex-start",
      columnGap: 0,
      "& > div": {
        width: "50%",
      },
    },
    [theme.breakpoints.down("sm")]: {
      marginTop: 24,
      "& > div": {
        width: "50%",
        paddingRight: 8,
      },
    },
  },
  typo1: {
    fontSize: 18,
    fontWeight: 400,
    textTransform: "uppercase",
    lineHeight: "104.5%",
    fontFamily: "Agrandir",
    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
    },
  },
  typo2: {
    fontSize: 16,
    fontWeight: 800,
    lineHeight: "104.5%",
    fontFamily: "Agrandir",
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  typo3: {
    fontSize: 18,
    fontWeight: 800,
    lineHeight: "104.5%",
    fontFamily: "Agrandir",
    textTransform: "uppercase",
    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
    },
  },
  typo4: {
    fontSize: 14,
    fontWeight: 800,
    lineHeight: "104.5%",
    fontFamily: "Agrandir",
    textTransform: "uppercase",
    color: "#ffffff66",
    marginTop: 4,
  },
  typo5: {
    fontSize: 18,
    fontWeight: 800,
    lineHeight: "104.5%",
    fontFamily: "Agrandir",
    textTransform: "uppercase",
    color: "#DDFF57",
    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
    },
  },
  typo6: {
    fontSize: 14,
    fontWeight: 800,
    lineHeight: "104.5%",
    fontFamily: "Agrandir",
    textTransform: "uppercase",
    color: "#DDFF57",
    opacity: 0.6,
    marginTop: 4,
  },
  shareSection: {
    display: "flex",
    paddingLeft: 24,
    paddingRight: 30,
    cursor: "pointer",
    [theme.breakpoints.down(768)]: {
      marginLeft: 15,
      marginRight: 15,
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  plusIcon: {
    marginRight: 9,
  },
  plusSection: {
    display: "flex",
    cursor: "pointer",
  },
  mainTitleSection: {
    display: "flex",
    flexDirection: "column",
    marginTop: 35,
    fontFamily: "Agrandir",
    fontWeight: 800,
    fontSize: 40,
    lineHeight: "104.5%",
    paddingBottom: 31,
    borderBottom: "1px solid #FFFFFF22",
    [theme.breakpoints.down("sm")]: {
      fontSize: 30,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 25,
    },
  },
  nftSection: {
    background: "#F6F5F8",
    padding: "24px 30px 0px",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      padding: "24px 25px 0px",
      marginBottom: 40,
    },
    [theme.breakpoints.down("xs")]: {
      padding: "24px 8px 0px",
    },
  },
  nftTabSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    columnGap: 55,
    width: "100%",
    fontSize: 18,
    fontWeight: 800,
    fontFamily: "Agrandir",
    color: "#431AB7",
    textTransform: "uppercase",
    lineHeight: "23px",
    cursor: "pointer",
    borderBottom: "1px solid #00000022",
    minWidth: "615px",
    [theme.breakpoints.down("sm")]: {
      columnGap: 45,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
      columnGap: 25,
      paddingLeft: 16,
      minWidth: "465px",
    },
  },
  tabSection: {
    fontFamily: "Agrandir GrandHeavy",
    color: "#431AB7",
    opacity: 0.5,
    height: 54,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedTabSection: {
    borderBottom: "4px solid #431AB7",
    opacity: 1,
  },
  allNFTSection: {
    width: "100%",
    marginBottom: 40,
  },
  jotPoolSection: {
    width: "100%",
    marginBottom: 50,
  },
  metaMaskBtn: {
    cursor: "pointer",
    backgroundColor: "#431AB7",
    borderRadius: 8,
    padding: "9px 18px",
    [theme.breakpoints.down("xs")]: {
      padding: "13px 11px",
    },
    color: "white",
    fontWeight: 800,

    '& img': {
      marginRight: "8px !important"
    }
  },
}));

export const EthIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
      fill="#627EEA"
    />
    <path d="M12.375 3V9.6525L17.9978 12.165L12.375 3Z" fill="white" fillOpacity="0.602" />
    <path d="M12.3735 3L6.75 12.165L12.3735 9.6525V3Z" fill="white" />
    <path d="M12.375 16.476V20.9963L18.0015 13.212L12.375 16.476Z" fill="white" fillOpacity="0.602" />
    <path d="M12.3735 20.9963V16.4753L6.75 13.212L12.3735 20.9963Z" fill="white" />
    <path d="M12.375 15.4297L17.9978 12.1649L12.375 9.65393V15.4297Z" fill="white" fillOpacity="0.2" />
    <path d="M6.75 12.1649L12.3735 15.4297V9.65393L6.75 12.1649Z" fill="white" fillOpacity="0.602" />
  </svg>
);

export const ShareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.4415 14.4853L7.06495 11.2971M7.05589 8.70755L13.4385 5.51627M18.9154 15.7778C18.9154 17.3733 17.622 18.6667 16.0265 18.6667C14.431 18.6667 13.1376 17.3733 13.1376 15.7778C13.1376 14.1823 14.431 12.8889 16.0265 12.8889C17.622 12.8889 18.9154 14.1823 18.9154 15.7778ZM18.9154 4.22226C18.9154 5.81775 17.622 7.11115 16.0265 7.11115C14.431 7.11115 13.1376 5.81775 13.1376 4.22226C13.1376 2.62677 14.431 1.33337 16.0265 1.33337C17.622 1.33337 18.9154 2.62677 18.9154 4.22226ZM7.35981 10C7.35981 11.5955 6.06641 12.8889 4.47092 12.8889C2.87543 12.8889 1.58203 11.5955 1.58203 10C1.58203 8.40455 2.87543 7.11115 4.47092 7.11115C6.06641 7.11115 7.35981 8.40455 7.35981 10Z"
      stroke="white"
      strokeWidth="1.5"
    />
  </svg>
);

export const PlusIcon = () => (
  <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.5 1V11M1.5 6L11.5 6"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export const MetamaskPlusIcon = () => (
  <svg width="10" height="11" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.43344 5.41567V0.877441H5.08511V5.41567H0.546875V8.764H5.08511V13.3299H8.43344V8.764H12.9993V5.41567H8.43344Z"
      fill="white"
    />
  </svg>
);
