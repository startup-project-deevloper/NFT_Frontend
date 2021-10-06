import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/ui-kit";

export const useFractionPageStyles = makeStyles(theme => ({
  root: {
    padding: "40px 48px 48px 80px",
    width: "100%",
    height: "100%",
    overflowY: "auto",
    minHeight: "calc(100vh - 80px)",
    maxHeight: "calc(100vh - 80px)",
    overflowX: "hidden",
    position: "relative",

    [theme.breakpoints.down("sm")]: {
      padding: "42px 24px 38px",

      "@media (max-width: 768px)": {
        padding: "42px 24px 38px",

        minHeight: "calc(100vh - 80px - 45px)",
        maxHeight: "calc(100vh - 80px - 45px)",
      },
    },

    // [theme.breakpoints.down("xs")]: {
    //   padding: "22px 16px 24px",

    //   minHeight: "calc(100vh - 80px - 65px - 10px)",
    //   maxHeight: "calc(100vh - 80px - 65px - 10px)",
    // },
  },
  title: {
    fontWeight: 800,
    fontSize: "44px",
    lineHeight: "39px",
    color: "#431AB7",
    [theme.breakpoints.down("md")]: {
      fontSize: "32px"
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "20px"
    },
  },

  button: {
    background: "#DDFF57",
    borderRadius: "4px",
    color: "#431AB7",
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "18px",
    textAlign: "center",
    padding: "8px 32px",
  },

  leftImage: {
    marginTop: "16px",
    marginBottom: "16px",
    "& .MuiGrid-root.MuiGrid-item:first-child": {
      position: "relatvie",
    },
  },
  reactPlayer: {
    width: "100% !important",
    height: "100% !important",
  },
  detailImg: {
    // maxHeight: 448,
    // position: "absolute",
    height: "100%",
    borderRadius: 16,
    cursor: "pointer",
    objectFit: "cover",
    width: "100%",
    maxHeight: 550,
    [theme.breakpoints.down("sm")]: {
      height: "100%",
    },
  },
  avatarImg: {
    display: "flex",
    cursor: "pointer",
  },
  creatorName: {
    maxWidth: 124,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: 1.2,
  },
  divider: {
    background: "#EBEBEB",
    opacity: 0.6,
    margin: "24px 0px",
  },
  fractionTitle: {
    fontSize: 14,
    color: "#1A1B1C",
    fontWeight: 800,
    marginBottom: theme.spacing(0.5),
  },
  fractionValue: {
    fontSize: 22,
    color: Color.Purple,
    fontWeight: 800,
    fontFamily: "Agrandir Grand",
  },
  followBtn: {
    border: "0.7px solid #CBCBCB !important",
    borderRadius: "4px !important",
  },
  addressBox: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "21px",
    textAlign: "center",
    letterSpacing: "-0.04em",
    textTransform: "capitalize",
    padding: "9.5px 16px",
    color: "#181818",
    border: "1px solid #707582",
    boxSizing: "border-box",
    borderRadius: "6px",
    marginLeft: "8px",
    "& svg": {
      marginRight: "10px",
    },
  },
  tableContainer: {
    marginTop: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    boxShadow: "0px 4px 8px #9EACF2",
    borderRadius: "16px",
    "& .MuiTableCell-head": {
      backgroundColor: "#9EACF2",
      color: "#DDFF57",
      fontSize: "17px",
      fontWeight: 800,
      lineHeight: "22px",
    },

    "& .MuiTableCell-body": {
      color: "#1A1B1C",
      fontSize: "14px",
      lineHeight: "120%",
    },
  },
  viewAll: {
    marginTop: "40px",
    cursor: "pointer",
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "17px",
    lineHeight: "22px",
    textAlign: "center",
    color: "#431AB7",
  },

  liveAuctionBtn: {
    display: "flex",
    height: 27,
    padding: "5px 11px",
    color: "#431AB7",
    fontSize: 10,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "18px",
    background: "#EFF2FD",
    borderRadius: 6.8,
    cursor: "pointer",
    border: "1px solid #431AB7",
    width: 96,
    top: 8,
    right: 7,
    "& span": {
      marginLeft: 5.7,
    },
  },
  closedBtn: {
    display: "flex",
    alignItems: "center",
    height: 27,
    padding: "7px 11px",
    color: "#F2604C",
    fontSize: 10,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "18px",
    background: "#EFF2FD",
    borderRadius: 6.8,
    border: "1px solid #F2604C",
    cursor: "pointer",
    width: 72,
    top: 8,
    right: 7,
    "& span": {
      marginLeft: 5.7,
    },
  },
  headerBox: {
    backgroundSize: "cover",
    backgroundRepeat: "unset",
    width: "100%",
    marginTop: 16,
    marginBottom: 64,
  },
  backgroundBox: {
    padding: 32,
    backgroundSize: "cover",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(60px)",
    [theme.breakpoints.down("sm")]: {
      padding: 24,
    },
    [theme.breakpoints.down("xs")]: {
      padding: "24px 16px",
    },
  },
  badgeBox: {
    color: "white",
    borderRadius: theme.spacing(1),
    padding: "5px 10px",
    fontSize: "14px",
    background: "#65CB63",
    fontWeight: 800,
  },
  badgeBox1: {
    color: "white",
    borderRadius: theme.spacing(1),
    padding: "5px 10px",
    fontSize: "14px",
    background: "#FFD43E",
    fontWeight: 800,
  },
  badgeBox2: {
    color: "#DDFF57",
    borderRadius: theme.spacing(1),
    padding: "5px 10px",
    fontSize: "14px",
    background: "#9EACF2",
  },
  svgBox: {
    width: theme.spacing(2),
    cursor: "pointer",
    display: "flex",
    "& svg": {
      width: "100%",
      height: "100%",
    },
    "& path": {
      stroke: "white",
    },
  },
  paper: {
    width: 267,
    marginRight: -267,
    marginLeft: -90,
    borderRadius: 10,
    boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)",
    position: "inherit",
  },
  ownerInfo: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  },
  ownerWrapper: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    flex: 1,
    [theme.breakpoints.down(1110)]: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
  },
  ownerButtons: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    justifyContent: "flex-end",
    flex: 2,
    [theme.breakpoints.down(1300)]: {
      flexDirection: "column",
      alignItems: "flex-start",
      width: "100%",
      "& button": {
        margin: "12px 0 0 0 !important",
        width: "100%",
        justifyContent: "center",
      },
    },
  },
  ownerBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& > div:first-child": {
      display: "flex",
      flexDirection: "column",
      "& > span": {
        fontSize: 14,
        fontWeight: 800,
        color: "#431AB7",
      },
      "& > div": {
        "& span": {
          fontSize: 20,
          color: "white",
          marginLeft: 8,
        }
      }
    }
  },
  headerBtn: {
    display: "flex",
    alignItems: "center",
    background: "#DDFF57",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    borderRadius: 4,
    color: "#431AB7",
    marginTop: 12,
    marginBottom: 12,
    "& img": {
      marginRight: 8,
    },
    "& + &": {
      marginLeft: 16,
    }
  },
  valueBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    background: "#9EACF2",
    boxShadow: "0px 4px 8px #9EACF2",
    borderRadius: 16,
    padding: 32,
    marginBottom: 64,
    "& > div": {
      marginRight: 10,
      "& span:first-child": {
        color: "#431AB7",
        fontSize: 14,
        fontWeight: 800,
        textTransform: "uppercase",
      },
      "& span:last-child": {
        color: "#DDFF57",
        fontSize: 22,
        fontWeight: 800,
      },
    }
  },
  bidBtn: {
    backgroundColor: "#431AB7 !important",
    borderRadius: "4px !important",
    fontSize: "14px !important",
    fontWeight: 800,
    height: "34px !important",
    lineHeight: "unset !important",
    paddingLeft: "32px !important",
    paddingRight: "32px !important",
  },
  bidBox: {
    background: "#DDFF57",
    boxShadow: "0px 4px 8px #9EACF2",
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    height: 390,
    paddingTop: 40,
    paddingBottom: 40,
    "& > div": {
      display: "flex",
      flexDirection: "column",
      fontSize: 28,
      color: "#431AB7",
      fontWeight: 800,
      "& > span:first-child": {
        textAlign: "center",
        fontSize: 14,
        color: "#431AB7",
        textTransform: "uppercase",
      },
      "& > span:last-child": {
        textAlign: "center",
        fontSize: 18,
        fontWeight: 800,
        color: "#9EACF2",
        textTransform: "uppercase",
        marginTop: 8,
      },
    }
  },
  etherBtn: {
    marginLeft: 40,
    border: "0.7px solid #431AB7",
    filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.12))",
    borderRadius: 4,
    background: "transparent",
    paddingTop: 0,
    paddingBottom: 0,
  },
  unlockingBox: {
    "& > span": {
      fontSize: 16,
      fontWeight: 800,
      color: "#431AB7",
      textShadow: "0px 0px 20px rgba(255, 255, 255, 0.3)",
    },
    "& > div": {
      marginLeft: 10,
      color: "white",
      borderRadius: theme.spacing(1),
      padding: "5px 16px",
      fontSize: "14px",
      background: "#431AB7",
      fontWeight: 800,
    }
  },
  subTitleSection: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    fontSize: 32,
    fontWeight: 800,
    fontFamily: "Agrandir",
    color: "#9EACF2",
    textTransform: "uppercase",
    lineHeight: "41px",
    marginTop: 120,
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down(1250)]: {
      minWidth: 420,
    },
    [theme.breakpoints.down(1110)]: {
      minWidth: 350,
    },
    [theme.breakpoints.down(950)]: {
      minWidth: 275,
    },
    [theme.breakpoints.down(580)]: {
      minWidth: 190,
    },
  },
  selectedTabSection: {
    color: "#431AB7",
    borderBottom: "4px solid #431AB7",
  },
  tokenBox: {
    border: "1px solid #431AB7",
    boxShadow: "0px 4px 8px #9EACF2",
    borderRadius: 16,
  },
  tokenSubBox: {
    background: "#EFF2FD",
    border: "1px solid #431AB7",
    borderRadius: 12,
  },
  tokenRound: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    borderRadius: "100%",
    backgroundColor: "#444444",
    "& img": {
      height: "60%",
    }
  },
  inputBox: {
    display: "flex",
    alignItems: "center",
    background: "white",
    border: "1px solid #431AB7",
    borderRadius: 16,
    height: 50,
    paddingLeft: 16,
    paddingRight: 16,
    "& img": {
      marginRight: 8,
    },
    "& input": {
      flex: 1,
      fontSize: 14,
      color: "#A4A4A4",
      background: "transparent",
      border: "none",
      outline: "none",
    }
  },
  buttons: {
    "& > button": {
      fontSize: "16px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      height: 50,
    },
    "& > button:first-child": {
      color: "#431AB7",
      border: "1px solid #431AB7",
    },
    "& > button:last-child": {
      backgroundColor: "#431AB7"
    },
  }
}));
