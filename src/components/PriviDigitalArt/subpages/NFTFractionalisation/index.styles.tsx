import React from "react";
import { makeStyles } from "@material-ui/core";

export const nftFractionalisationStyles = makeStyles(theme => ({
  content: {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "calc(100vh - 80px)",
    maxHeight: "calc(100vh - 80px)",
    overflowX: "hidden",
    padding: "50px 16px 0px 16px",
    backgroundImage: `url(${require("assets/pixImages/fractionalise_background.png")})`,
    backgroundRepeat: "inherit",
    backgroundSize: "100% 100%",
    [theme.breakpoints.down("xs")]: {
      padding: "50px 12px 0px",
    },
  },
  title: {
    fontSize: 40,
    fontWeight: 800,
    fontFamily: "Agrandir",
    color: "#431AB7",
    lineHeight: "104.5%",
    textTransform: "uppercase",
    display: "flex",
    width: "100%",
    justifyContent: "center",
    [theme.breakpoints.down(950)]: {
      fontSize: 35,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 22,
    },
  },
  subTitleSection: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: 800,
    fontFamily: "Agrandir",
    color: "#431AB7",
    textTransform: "uppercase",
    lineHeight: "23px",
    marginTop: 32,
    cursor: "pointer",
    [theme.breakpoints.down(1110)]: {
      fontSize: 15,
    },
    [theme.breakpoints.down(950)]: {
      fontSize: 12,
    },
    [theme.breakpoints.down(950)]: {
      fontSize: 11,
    },
  },
  tabSection: {
    minWidth: 482,
    height: 55,
    background: "#EFF2FD",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "0 15px",
    [theme.breakpoints.down(1250)]: {
      minWidth: 420,
    },
    [theme.breakpoints.down(1110)]: {
      minWidth: 350,
    },
    [theme.breakpoints.down(950)]: {
      minWidth: 275,
      fontSize: 18,
    },
    [theme.breakpoints.down(580)]: {
      minWidth: 190,
      fontSize: 16,
    },
  },
  selectedTabSection: {
    borderBottom: "4px solid #431AB7",
  },
  headerButtonGroup: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 50,
    [theme.breakpoints.down(920)]: {
      flexDirection: "column",
    },
  },
  fractionalizeBtn: {
    height: 47,
    padding: "12px 48px",
    color: "#431AB7",
    fontSize: 18,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "23px",
    background: "#DDFF57",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    borderRadius: 4,
    cursor: "pointer",
    [theme.breakpoints.down(920)]: {
      width: 194,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 16,
    },
  },
  filterBtnGroup: {
    display: "flex",
    alignItems: "flex-end",
    columnGap: 10,
    [theme.breakpoints.down(920)]: {
      marginTop: 16,
    },
  },
  liveSaleBtn: {
    display: "flex",
    height: 38,
    padding: "10px 12px 10px 16px",
    color: "#431AB7",
    fontSize: 14,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "18px",
    background: "#DDFF57",
    borderRadius: 10,
    cursor: "pointer",
    "& span": {
      marginLeft: 8,
    },
    [theme.breakpoints.down("xs")]: {
      padding: "10px 8px",
      fontSize: 10,
    },
  },
  liveAuctionBtn: {
    display: "flex",
    height: 38,
    padding: "10px 14px 10px 15.5px",
    color: "#431AB7",
    fontSize: 14,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "18px",
    background: "#EFF2FD",
    borderRadius: 10,
    cursor: "pointer",
    border: "1px solid #431AB7",
    "& span": {
      marginLeft: 6,
    },
    [theme.breakpoints.down("xs")]: {
      padding: "10px 8px",
      fontSize: 10,
    },
  },
  closedBtn: {
    display: "flex",
    alignItems: "baseline",
    height: 38,
    padding: "10px 16px 10px 16.5px",
    color: "#F2604C",
    fontSize: 14,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "18px",
    background: "#EFF2FD",
    borderRadius: 10,
    border: "1px solid #F2604C",
    cursor: "pointer",
    "& span": {
      marginLeft: 7.5,
    },
    [theme.breakpoints.down("xs")]: {
      padding: "10px 8px",
      fontSize: 10,
    },
  },
  sortByBtn: {
    display: "flex",
    alignItems: "baseline",
    height: 38,
    padding: "10px 16px 10px 14px",
    color: "#9EACF2",
    fontSize: 14,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "18px",
    background: "#EFF2FD",
    borderRadius: 10,
    cursor: "pointer",
    "& span": {
      marginRight: 5,
    },
    [theme.breakpoints.down("xs")]: {
      padding: "10px 8px",
      fontSize: 10,
    },
  },
  mediaSection: {
    width: "100%",
    marginTop: 32,
    marginBottom: 40,
    [theme.breakpoints.down(900)]: {
      marginBottom: 90,
    },
    "& > div": {
      width: "100%",
      "& > div > div > div": {
        padding: "0 !important",
      },
    },
  },
  syntheticSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    flexDirection: "column",
  },
  rewardsWrapper: {
    backgroundImage: "linear-gradient(151.11deg, #AA26C2 6.74%, #4BA7F8 90.8%)",
    padding: 2,
    borderRadius: 9,
    marginTop: 64,
    maxWidth: 1200,
    [theme.breakpoints.down(1300)]: {
      marginLeft: 40,
      marginRight: 40
    },
    [theme.breakpoints.down(790)]: {
      marginLeft: 20,
      marginRight: 20,
    },
  },
  rewardsContent: {
    display: "flex",
    flexDirection: "column",
    padding: "45px 45px 64px 64px",
    color: "#DDFF57",
    fontFamily: "Agrandir",
    background: "#FFF",
    borderRadius: 9,
    position: "relative",
    [theme.breakpoints.down(1200)]: {
      padding: "30px 37px 64px",
    },
    [theme.breakpoints.down(790)]: {
      padding: "30px 37px 64px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "32px 24px 32px",
    },
    [theme.breakpoints.down(431)]: {
      padding: "32px 12px 32px",
    },
  },
  rewardsTitle: {
    background: "linear-gradient(274.54deg, #418DFF -30.42%, #4541FF 23.19%, #4541FF 39.93%, #EF41CB 114.31%, #EF41CB 122.04%, #EFA941 130.17%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: 31,
    fontWeight: 800,
    maxWidth: 600,
    lineHeight: "104.5%",
    [theme.breakpoints.down(1200)]: {
      fontSize: 24,
    },
    [theme.breakpoints.down(900)]: {
      fontSize: 20,
      lineHeight: '150%',
    },
  },
  rewardsDes: {
    fontSize: 16,
    fontWeight: 800,
    lineHeight: "24px",
    marginTop: 14,
    color: '#431AB7',
    [theme.breakpoints.down(1200)]: {
      fontWeight: 400,
    },
  },
  tradeNFTBtnWrapper: {
    marginTop: 25,
    background: "linear-gradient(275.7deg, #418DFF -22.23%, #4541FF 30.2%, #4541FF 46.57%, #EF41CB 94.97%, #EF41CB 102.17%, #EFA941 128.81%), linear-gradient(0deg, #DDFF57, #DDFF57)",
    padding: 2,
    borderRadius: 8,
    minWidth: 300,
    [theme.breakpoints.down(1200)]: {
      minWidth: 284,
      width: '100%',
    },
    [theme.breakpoints.down("xs")]: {
      minWidth: 240,
      marginTop: 15,
    },
    [theme.breakpoints.down(960)]: {
      minWidth: "auto",
    },
  },
  tradeNFTBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 49,
    background: "#FFF",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    borderRadius: 8,
    fontSize: 18,
    fontWeight: 800,
    color: "#431AB7",
    fontFamily: "Agrandir",
    lineHeight: "23px",
    cursor: "pointer",
    width: "100%",
    minWidth: 294,
    [theme.breakpoints.down(1200)]: {
      fontSize: 18,
      padding: 0,
      minWidth: 280,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
      padding: 0,
      minWidth: 236,
    },
    [theme.breakpoints.down(960)]: {
      minWidth: "auto",
    },
  },
  syntheticFractionaliseBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 49,
    background: "linear-gradient(275.7deg, #418DFF -22.23%, #4541FF 30.2%, #4541FF 46.57%, #EF41CB 94.97%, #EF41CB 102.17%, #EFA941 128.81%), linear-gradient(0deg, #DDFF57, #DDFF57)",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    borderRadius: 8,
    fontSize: 18,
    fontWeight: 800,
    color: "#FFF",
    fontFamily: "Agrandir",
    lineHeight: "23px",
    cursor: "pointer",
    minWidth: 300,
    [theme.breakpoints.down(1200)]: {
      fontSize: 16,
      padding: 0,
      width: '100%',
      minWidth: 284,
    },
    [theme.breakpoints.down(960)]: {
      minWidth: "auto",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
      padding: 0,
      minWidth: 240,
    },
  },
  walletImg: {
    width: 125,
    height: 100,
    position: "absolute",
    bottom: -44,
    right: -20,
    [theme.breakpoints.down("xs")]: {
      bottom: -20,
    },
  },
  heartEyeImg: {
    width: 198,
    height: 184,
    position: "absolute",
    bottom: -125,
    left: -80,
    transform: "rotate(-12.57deg)",
    [theme.breakpoints.down(1200)]: {
      width: 108,
      height: 99,
      bottom: -40,
      left: -50,
    },
    [theme.breakpoints.down(658)]: {
      width: 89,
      height: 82,
      bottom: -40,
      left: -40,
    },
  },
  buttons: {
    [theme.breakpoints.down(1200)]: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  },
  NFTSection: {
    width: "100%",
    marginTop: 160,
    [theme.breakpoints.down(1200)]: {
      marginTop: 80,
    },
    [theme.breakpoints.down(658)]: {
      marginTop: 50,
    },
  },
  topNFTWrapper: {
    backgroundColor: '#F6F5F8',
    padding: '50px 40px',
    [theme.breakpoints.down(1200)]: {
      padding: '50px 20px',
    },
  },
  allNFTWrapper: {
    backgroundColor: '#FFF',
    padding: '50px 40px',
    [theme.breakpoints.down(658)]: {
      padding: '50px 15px',
    },
  },
  topNFTTitle: {
    display: "flex",
    alignItems: "center",
    fontSize: 32,
    fontWeight: 800,
    marginBottom: 30,
    background: "linear-gradient(274.54deg, #418DFF -30.42%, #4541FF 23.19%, #4541FF 39.93%, #EF41CB 114.31%, #EF41CB 122.04%, #EFA941 130.17%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontFamily: "Agrandir",
    lineHeight: "130%",
    "& span": {
      paddingBottom: 16,
    },
    "& img": {
      width: 80,
      height: 80,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 25,
    },
  },
  allNFTTitle: {
    display: "flex",
    alignItems: "center",
    fontSize: 32,
    fontWeight: 800,
    color: '#431AB7',
    fontFamily: "Agrandir",
    lineHeight: "130%",
    "& span": {
      paddingBottom: 16,
    },
    "& img": {
      width: 80,
      height: 80,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 25,
    },
  },
  topNFTContent: {
    display: "flex",
    background: "transparent",
    marginBottom: 50,
    position: "relative",
    [theme.breakpoints.down(769)]: {
      marginBottom: 0,
    },
    "& button.rec-arrow-left": {
      position: "absolute",
      top: -100,
      right: 200,

      [theme.breakpoints.down(1200)]: {
        right: 60,
      },
      [theme.breakpoints.down(769)]: {
        display: "none",
      },
    },
    "& button.rec-arrow-right": {
      position: "absolute",
      top: -100,
      right: 140,

      [theme.breakpoints.down(1200)]: {
        right: 0,
      },
      [theme.breakpoints.down(769)]: {
        display: "none",
      },
    },
  },
  allNFTSection: {
    width: "100%",
    marginBottom: 40,
  },
}));

export const LiveSaleIcon = () => (
  <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.16667 1.66602H3.5L1.5 7.66602H4.16667L2.83333 12.9993L10.1667 5.66602H6.56667L8.16667 1.66602Z"
      stroke="#431AB7"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LiveAuctionIcon = () => (
  <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4.75 12C3.88982 12 3.09435 11.7832 2.36358 11.3496C1.63281 10.916 1.05619 10.3242 0.633714 9.57422C0.211238 8.82422 0 8.00781 0 7.125C0 6.78125 0.0494792 6.4707 0.148438 6.19336C0.247396 5.91602 0.369191 5.66797 0.513822 5.44922C0.658453 5.23047 0.803085 4.99219 0.947716 4.73438C1.09235 4.47656 1.21414 4.13672 1.3131 3.71484C1.41206 3.29297 1.46154 2.80469 1.46154 2.25C1.46154 2.32812 1.5015 2.4043 1.58143 2.47852C1.66136 2.55273 1.75651 2.62695 1.86689 2.70117C1.97726 2.77539 2.09906 2.90625 2.23227 3.09375C2.36548 3.28125 2.47396 3.5 2.55769 3.75C2.67949 4.13281 2.8774 4.47852 3.15144 4.78711C3.42548 5.0957 3.71474 5.25 4.01923 5.25C4.41506 5.25 4.7519 5.01953 5.02975 4.55859C5.30759 4.09766 5.51312 3.47656 5.64633 2.69531C5.77955 1.91406 5.84615 1.01562 5.84615 0C5.96034 0.34375 6.13542 0.703125 6.37139 1.07812C6.60737 1.45312 6.85667 1.79297 7.11929 2.09766C7.38191 2.40234 7.65785 2.75 7.94712 3.14062C8.23638 3.53125 8.49329 3.91211 8.71785 4.2832C8.94241 4.6543 9.12891 5.08789 9.27734 5.58398C9.42578 6.08008 9.5 6.59375 9.5 7.125C9.5 8.00781 9.28876 8.82422 8.86629 9.57422C8.44381 10.3242 7.86719 10.916 7.13642 11.3496C6.40565 11.7832 5.61018 12 4.75 12ZM6.21154 4.5C5.82332 5.5625 5.45793 6.3125 5.11538 6.75C4.97075 6.9375 4.78996 7.10547 4.57302 7.25391C4.35607 7.40234 4.15815 7.52148 3.97927 7.61133C3.80038 7.70117 3.6272 7.80273 3.45974 7.91602C3.29227 8.0293 3.16096 8.17383 3.06581 8.34961C2.97065 8.52539 2.92308 8.74219 2.92308 9C2.92308 9.47656 3.10387 9.8457 3.46544 10.1074C3.82702 10.3691 4.25521 10.5 4.75 10.5C5.48077 10.5 6.08974 10.3027 6.57692 9.9082C7.0641 9.51367 7.30769 8.97656 7.30769 8.29688C7.30769 7.77344 7.26583 7.32227 7.18209 6.94336C7.09836 6.56445 7.00321 6.2832 6.89663 6.09961C6.79006 5.91602 6.66827 5.68164 6.53125 5.39648C6.39423 5.11133 6.28766 4.8125 6.21154 4.5Z"
      fill="#431AB7"
    />
  </svg>
);

export const ClosedIcon = () => (
  <svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.00001 1.5L1 8.50001M1.00001 1.5L8.00001 8.50001"
      stroke="#F2604C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SortByIcon = () => (
  <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.36914 5.77539C5.45508 5.77539 5.53613 5.75977 5.6123 5.72852C5.68848 5.69727 5.75586 5.64648 5.81445 5.57617L10.0684 1.22852C10.1855 1.11523 10.2441 0.978516 10.2441 0.818359C10.2441 0.708984 10.2178 0.609375 10.165 0.519531C10.1123 0.429688 10.042 0.358398 9.9541 0.305664C9.86621 0.25293 9.76562 0.226563 9.65234 0.226563C9.49219 0.226563 9.35156 0.285156 9.23047 0.402344L5.37162 4.35434L1.50781 0.402344C1.39062 0.285156 1.25195 0.226563 1.0918 0.226563C0.978516 0.226563 0.87793 0.25293 0.790039 0.305664C0.702148 0.358398 0.631836 0.429688 0.579102 0.519531C0.526367 0.609375 0.5 0.708984 0.5 0.818359C0.5 0.900391 0.515625 0.975586 0.546875 1.04395C0.578125 1.1123 0.621094 1.17383 0.675781 1.22852L4.92383 5.58203C5.05664 5.71094 5.20508 5.77539 5.36914 5.77539Z"
      fill="#9EACF2"
    />
  </svg>
);
