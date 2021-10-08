import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { BorderRadius, Color } from "shared/ui-kit";

export const usePodPageStyles = makeStyles(theme => ({
  root: {
    overflow: "visible",
  },
  page: {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minHeight: "calc(100vh - 104px)",
    maxHeight: "calc(100vh - 104px)",
    overflowX: "hidden",
    position: "relative",
  },
  content: {
    width: "100%",
    padding: `${theme.spacing(0)}px ${theme.spacing(10)}px ${theme.spacing(5)}px ${theme.spacing(10)}px`,
    [theme.breakpoints.down("sm")]: {
      padding: `${theme.spacing(0)}px ${theme.spacing(2)}px ${theme.spacing(5)}px ${theme.spacing(2)}px`,
    },
  },
  detailImg: {
    maxHeight: 448,
    height: 240,
    borderRadius: 16,
    cursor: "pointer",
    objectFit: "contain",
    [theme.breakpoints.down("sm")]: {
      height: 270,
    },
  },
  artist: {
    cursor: "pointer",
    "& + &": {
      marginLeft: -12,
    },
  },
  rateIcon: {
    marginRight: 4,
    background: Color.Yellow,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  emptyRateIcon: {
    marginRight: 4,
    width: 12,
    height: 12,
    background: Color.GrayLight,
    border: `1px solid ${Color.GrayLight}`,
    borderRadius: 6,
    boxSizing: "border-box",
  },
  message: {
    height: 64,
    borderRadius: 8,
    backgroundColor: Color.GrayInputBackground,
    "& input": {
      flex: 1,
      border: "none",
      background: "transparent",
      marginLeft: 10,
      marginRight: 10,
    },
    paddingLeft: 8,
    paddingRight: 8,
  },
  accordion: {
    boxShadow: "none",
    "&::before": {
      backgroundColor: "transparent",
    },
    "& .MuiAccordionSummary-root": {
      minHeight: "unset",
      padding: 0,
      "& .MuiAccordionSummary-content": {
        margin: 0,
      },
      "& .MuiAccordionSummary-expandIcon": {
        margin: 0,
        padding: 0,
      },
    },
    "& .MuiAccordionDetails-root": {
      marginTop: 20,
      padding: 0,
      display: "block",
    },
  },
  paper: {},
  creatorName: {
    maxWidth: 124,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: 1.2,
  },
  followBtn: {
    border: "none !important",
    background: "transparent !important",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      padding: "12px 8px !important",
      background: "linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8 0!important",
      borderRadius: "49px !important",
    },
  },
  primaryBtn: {
    background: "#1B1B1B",
    borderRadius: "4px !important",
  },
  transparentBtn: {
    background: "#FFFFFF",
    border: "1px solid #CBCBCB !important",
    borderRadius: "4px !important",
  },
  divider: {
    border: "1px solid #EBEBEB",
    margin: "24px 0px",
  },
  link: {
    cursor: "pointer",
    color: "#999999",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  commentUername: {
    fontSize: 14,
    lineHeight: "120%",
    color: "#181818",
  },
  commentDescription: {
    fontSize: 14,
    lineHeight: "120%",
    color: "#707582",
  },
  graphBox: {
    position: "relative",
  },
  whiteBox: {
    background: "white",
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    position: "absolute",
    top: theme.spacing(1),
    left: theme.spacing(3),
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
  },
  header1: {
    fontSize: "25px",
    fontWeight: 600,
    color: "#2D3047",
  },
  header2: {
    fontSize: "14px",
    color: "#2D3047",
  },
  fraction: {
    backgroundColor: Color.GreenLight,
    padding: `${theme.spacing(4)}px ${theme.spacing(8)}px`,
    marginTop: theme.spacing(3),
  },
  fractionTitle: {
    fontSize: 14,
    color: Color.Purple,
    fontWeight: 800,
    marginBottom: theme.spacing(0.5),
  },
  fractionValue: {
    fontSize: 22,
    color: Color.Purple,
    fontWeight: 800,
  },
  fractionBuy: {
    backgroundColor: `${Color.Purple} !important`,
    borderRadius: "4px !important",
    marginBottom: theme.spacing(2),
  },
  fractionSell: {
    border: `1px solid ${Color.Purple} !important`,
    borderRadius: "4px !important",
    marginLeft: "0px !important",
  },
  radialText: {
    fontSize: 11,
    color: Color.Black,
  },
  card: {
    background: "#FFFFFF",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    borderRadius: 16,
    padding: 16,
  },
  table: {
    borderRadius: "16px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    marginTop: theme.spacing(3),
    "& .MuiTableContainer-root": {
      borderRadius: 16,
    },
  },
  greenBox: {
    display: "flex",
    alignItems: "center",
    marginTop: "24px",
    fontWeight: 800,
    padding: "32px 0",
    justifyContent: "space-between",
    borderTop: "1px solid #EBEBEB",
    borderBottom: "1px solid #EBEBEB",
    "& div": {
      marginRight: "8px",
      "& h5": {
        margin: "0px 0px 4px",
        lineHeight: "120%",
        fontSize: "14px",
        color: "#707582",
        [theme.breakpoints.down("sm")]: {
          fontSize: "12px",
        },
      },
      "& h3": {
        margin: "0px",
        lineHeight: "36px",
        fontSize: "20px",
        color: "#2D3047",
        [theme.breakpoints.down("sm")]: {
          fontSize: "16px",
        },
      },
      [theme.breakpoints.down("sm")]: {
        marginRight: "4px",
      },
    },
    [theme.breakpoints.down("sm")]: {
      padding: "48px 16px",
    },
    [theme.breakpoints.down(780)]: {
      flexWrap: "wrap",
      paddingBottom: "48px",
      "& div": {
        marginBottom: "18px",
      },
    },
  },
  tab: {
    cursor: "pointer",
    padding: "8px 32px",
    color: "#1A1B1C",
    fontSize: "18px",
    fontWeight: 800,
  },
  selectedTab: {
    color: "white",
    background: "#9EACF2",
    borderRadius: "16px",
  },
  hashtag: {
    color: "#DDFF57",
    fontWeight: 600,
    background: "#431AB7",
    borderRadius: 5,
    padding: "5px 10px",
    fontSize: 10,
  },
  headerBlur: {
    borderRadius: 16,
    padding: "42px 48px 48px 50px",
    position: "relative",
    overflow: "hidden",
    [theme.breakpoints.down("md")]: {
      padding: "28px 18px 50px",
    },
  },
  gradientImage1: {
    position: "absolute",
    background: "#DDFF57",
    filter: "blur(80px)",
    bottom: "15%",
    right: "45%",
    width: "100%",
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      filter: "blur(50px)",
      right: "10%",
      bottom: "5%",
      width: "200%",
    },
  },
  gradientImage2: {
    position: "absolute",
    background: "#9EACF2",
    filter: "blur(50px)",
    bottom: "-10%",
    left: "55%",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    [theme.breakpoints.down("sm")]: {
      left: "30%",
      bottom: 0,
      width: "150%",
      height: "50%",
    },
  },
  headerContent: {
    zIndex: 1,
    "& > h2": {
      color: "#431AB7",
    },
  },
  headerContentMobileImage: {
    zIndex: 1,
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "block",
      width: "100%",
    },
  },
  headerContentImage: {
    zIndex: 1,
    display: "block",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  description: {
    "& span": {
      wordBreak: "break-word",
      fontSize: 14,
      color: "#431AB7",
      opacity: 0.7,
    },
  },
}));
