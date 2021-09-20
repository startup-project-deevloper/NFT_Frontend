import React from "react";
import { makeStyles } from "@material-ui/core";
import { Color, FontSize } from "shared/ui-kit";

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
  nftInfoSection: {
    padding: "39px 32px 72px",
    background: "#ffffff",
    width: "100%",
  },
  btnIcon: {
    marginLeft: "7px",
    marginTop: "-2px",
  },
  nftInfoMainContent: {
    background: "linear-gradient(293.66deg, #431AB7 8.36%, #9EACF2 72.12%)",
    boxShadow: "0px 46px 49px -19px rgba(96, 71, 202, 0.17)",
    borderRadius: 20,
    width: "100%",
    height: 320,
    padding: "30px 400px 29px 32px",
    marginTop: 62,
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    position: "relative",

    "& > span": {
      backgroundColor: Color.Green,
      width: "fit-content",
      padding: "5px 10px",
      borderRadius: "5px",
      lineHeight: "18px",
      fontSize: "14px",
    },
  },
  disabledTab: {
    opacity: 0.2,
    cursor: "not-allowed",
  },
  nftCard: {
    position: "absolute",
    top: "-20px",
    right: "38px",
  },
  typo1: {
    fontSize: 14,
    fontWeight: "normal",
    lineHeight: "104.5%",
    fontFamily: "Agrandir",
    color: Color.White,
  },
  typo2: {
    fontSize: 20,
    fontWeight: 800,
    lineHeight: "104.5%",
    fontFamily: "Agrandir",
    color: Color.White,
    marginTop: 6,
  },
  typo3: {
    fontSize: 38,
    fontWeight: 800,
    lineHeight: "104.5%",
    fontFamily: "Agrandir",
    marginBottom: 14,
  },
  typo4: {
    fontSize: 24,
    fontWeight: 400,
    lineHeight: "150%",
    fontFamily: "Agrandir",
  },
  typo5: {
    color:
      "linear-gradient(275.7deg, #418DFF -22.23%, #4541FF 30.2%, #4541FF 46.57%, #EF41CB 94.97%, #EF41CB 102.17%, #EFA941 128.81%), linear-gradient(0deg, #431AB7, #431AB7)",
    fontSize: 34,
    fontWeight: 800,
    lineHeight: "150%",
    fontFamily: "Agrandir",
    letterSpacing: "0.02em",
    marginRight: 14,
  },
  typo6: {
    color: "#431AB7",
    fontSize: 34,
    fontWeight: 800,
    lineHeight: "150%",
    fontFamily: "Agrandir",
    letterSpacing: "0.02em",
    opacity: 0.6,
  },
  typo7: {
    fontSize: 18,
    fontWeight: 800,
    lineHeight: "150%",
    fontFamily: "Agrandir",
    letterSpacing: "0.02em",
    textAlign: "center",
  },
  typo8: {
    fontSize: 24,
    fontWeight: 800,
    lineHeight: "104.5%",
    fontFamily: "Agrandir",
    marginTop: 36,
    marginLeft: 53,
    color: "rgba(67, 26, 183, 1)",
  },
  potentialWinSection: {
    background: "rgba(158, 172, 242, 0.2)",
    borderRadius: 20,
    padding: "32px 21px",
    display: "flex",
    flexDirection: "column",
    marginTop: 42,
  },
  polygonscanBtn: {
    backgroundColor: `${Color.GreenLight} !important`,
    color: `${Color.Purple} !important`,
    fontSize: "14px !important",
    lineHeight: "18px !important",
    padding: "8px 32px !important",
    marginLeft: "87px",
    display: "flex",
    alignItems: "center",
    "& img": {
      width: "22px",
      marginRight: "8px",
    },
  },
  shareSection: {
    cursor: "pointer",
  },
  socialSection: {
    marginLeft: "19px",
  },
  plusSection: {
    display: "flex",
    marginLeft: 26,
    cursor: "pointer",
    "& span": {
      marginLeft: "10px",
      fontWeight: "bold",
      fontSize: "14px",
      lineHeight: "104.5%",
    },
  },
  mainTitleSection: {
    display: "flex",
    marginTop: 16,
    "& span:first-child": {
      color: Color.Purple,
      fontFamily: "Agrandir",
      fontWeight: 800,
      fontSize: 44,
      lineHeight: "104.5%",
      textShadow: "0px 0px 20px rgba(255, 255, 255, 0.3)",
    },
    "& span:last-child": {
      color: Color.GreenLight,
      backgroundColor: Color.Violet,
      borderRadius: 5,
      padding: "5px 10px",
      marginLeft: 16,
      height: "fit-content",
      fontSize: "14px",
      lineHeight: "18px",
    },
  },
  nftDetailSection: {
    background: "#F6F5F8",
    padding: "24px 30px",
    width: "100%",
  },
  nftTabSection: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    fontSize: 22,
    fontWeight: 800,
    fontFamily: "Agrandir",
    color: "#431AB7",
    textTransform: "uppercase",
    lineHeight: "23px",
    cursor: "pointer",
    borderBottom: "1px solid #00000022",
    marginBottom: 30,
  },
  tabSection: {
    minWidth: 240,
    height: 54,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedTabSection: {
    borderBottom: "4px solid #431AB7",
  },
  flipCoinSection: {
    background: "#FFFFFF",
    border: "1px solid #9EACF2",
    boxSizing: "border-box",
    borderRadius: 20,
    backgroundImage: `url(${require("assets/pixImages/flip_coin_background.png")})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 243px",
    padding: "40px 50px 31px",
    height: 537,
    color: "#431AB7",
    display: "flex",
    flexDirection: "column",
  },
  flipCoinButton: {
    background:
      "linear-gradient(275.7deg, #418DFF -22.23%, #4541FF 30.2%, #4541FF 46.57%, #EF41CB 94.97%, #EF41CB 102.17%, #EFA941 128.81%), #DDFF57",
    borderRadius: 8,
    color: "#ffffff",
    fontSize: 18,
    fontWeight: 800,
    lineHeight: "23px",
    textTransform: "uppercase",
    padding: "14px 0px",
    height: 49,
    textAlign: "center",
    cursor: "pointer",
    marginTop: 16,
    marginBottom: 14,
  },
  flippedCoinButton: {
    background: "rgba(158, 172, 242, 1)",
    borderRadius: 8,
    color: "rgba(67, 26, 183, 1);",
    fontSize: 18,
    fontWeight: 800,
    lineHeight: "23px",
    textTransform: "uppercase",
    padding: "14px 0px",
    height: 49,
    textAlign: "center",
    cursor: "pointer",
    marginTop: 16,
    marginBottom: 14,
  },
  coinFlipHistorySection: {
    border: "1px solid #9EACF2",
    background: "#ffffff",
    marginTop: 11,
    borderRadius: 20,
  },
  explorerImg: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "5px 24px",
    border: "1px solid rgba(67, 26, 183, 1)",
    borderRadius: 6,
    width: 120,
    height: 40,
  },
  table: {
    marginTop: 24,
    minHeight: 320,
    "& .MuiTableContainer-root": {
      boxShadow: "unset",
    },
    "& .MuiTableCell-root": {
      fontFamily: "Agrandir",
      padding: "9px 16px",
    },
    "& .MuiTableRow-head": {
      background: Color.GrayInputBackground,
      "& .MuiTableCell-head": {
        background: "#ffffff",
        fontSize: 18,
        fontWeight: 700,
        fontFamily: "Agrandir",
        color: "rgba(67, 26, 183, 1)",
      },
    },

    [theme.breakpoints.down("sm")]: {
      minHeight: 200,
    },
  },
}));

export const ShareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.4415 14.4853L7.06495 11.2971M7.05589 8.70755L13.4385 5.51627M18.9154 15.7778C18.9154 17.3733 17.622 18.6667 16.0265 18.6667C14.431 18.6667 13.1376 17.3733 13.1376 15.7778C13.1376 14.1823 14.431 12.8889 16.0265 12.8889C17.622 12.8889 18.9154 14.1823 18.9154 15.7778ZM18.9154 4.22226C18.9154 5.81775 17.622 7.11115 16.0265 7.11115C14.431 7.11115 13.1376 5.81775 13.1376 4.22226C13.1376 2.62677 14.431 1.33337 16.0265 1.33337C17.622 1.33337 18.9154 2.62677 18.9154 4.22226ZM7.35981 10C7.35981 11.5955 6.06641 12.8889 4.47092 12.8889C2.87543 12.8889 1.58203 11.5955 1.58203 10C1.58203 8.40455 2.87543 7.11115 4.47092 7.11115C6.06641 7.11115 7.35981 8.40455 7.35981 10Z"
      stroke="white"
      stroke-width="1.5"
    />
  </svg>
);

export const PlusIcon = () => (
  <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.5 1V11M1.5 6L11.5 6"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
