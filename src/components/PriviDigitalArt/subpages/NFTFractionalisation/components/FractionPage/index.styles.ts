import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/ui-kit";

export const useFractionPageStyles = makeStyles(theme => ({
  root: {
    padding: "40px 48px 48px 80px",
    width: "100%",
    height: "100%",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minHeight: "calc(100vh - 80px)",
    maxHeight: "calc(100vh - 80px)",
    overflowX: "hidden",
    position: "relative",

    [theme.breakpoints.down("sm")]: {
      padding: "42px 24px 38px",

      "@media (max-width: 768px)": {
        padding: "42px 24px 38px",

        minHeight: "calc(100vh - 80px - 65px)",
        maxHeight: "calc(100vh - 80px - 65px)",
      },
    },

    [theme.breakpoints.down("xs")]: {
      padding: "22px 16px 24px",

      minHeight: "calc(100vh - 80px - 65px - 10px)",
      maxHeight: "calc(100vh - 80px - 65px - 10px)",
    },
    "& button": {
      height: "auto",
    },
  },
  title: {
    fontFamily: "Agrandir Grand",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "30px",
    lineHeight: "39px",
    textTransform: "uppercase",
    color: "#431AB7",
    margin: "24px 0px",
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
    [theme.breakpoints.down("sm")]: {
      padding: "8px 25px"
    },
    [theme.breakpoints.up("md")]: {
      flex: 1,
    },
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
    position: "relative",
    marginTop: "40px",
    [theme.breakpoints.down("xs")]: {
      marginTop: "20px"
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    boxShadow: "0px 4px 8px #9EACF2",
    borderRadius: "16px",
    "& .MuiTableCell-head": {
      backgroundColor: "#9EACF2",
      color: "#DDFF57 !important",
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
}));
