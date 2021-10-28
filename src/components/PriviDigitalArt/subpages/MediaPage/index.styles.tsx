import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/ui-kit";

export const digitalArtModalStyles = makeStyles(theme => ({
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
    marginBottom: theme.spacing(5),
    [theme.breakpoints.down("sm")]: {
      padding: `${theme.spacing(0)}px ${theme.spacing(2)}px ${theme.spacing(5)}px`,
    },
  },
  avatarImg: {
    display: "flex",
    cursor: "pointer",
  },
  artist: {
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
    border: "0.7px solid #CBCBCB !important",
    borderRadius: "4px !important",
  },
  primaryBtn: {
    borderRadius: "4px !important",
    [theme.breakpoints.down("sm")]: {
      padding: "0 14px !important",
    },
  },
  transparentBtn: {
    background: "#FFFFFF",
    border: "1px solid #CBCBCB !important",
    borderRadius: "4px !important",
    [theme.breakpoints.down("sm")]: {
      height: "100%",
      padding: "0 14px !important",
    },
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
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
    "& .MuiTableCell-root": {
      fontFamily: "Agrandir",
      padding: "9px 16px",
      [theme.breakpoints.down("sm")]: {
        padding: "8px 12px",
      },
      [theme.breakpoints.down("xs")]: {
        padding: "8px",
      }
    },
    "& .MuiTableContainer-root": {
      borderRadius: 16,
      "& .MuiTableRow-head": {
        backgroundColor: "#F7F9FE",
        "& .MuiTableCell-head": {
          color: Color.Black,
          opacity: 0.8,
          fontWeight: 400,
          [theme.breakpoints.down("sm")]: {
            fontSize: 14,
          },
          [theme.breakpoints.down("xs")]: {
            fontSize: 12,
          }
        },
      },
    },
    "& .MuiTableRow-root": {
      "& .MuiTableCell-body": {
        fontSize: 14,
        [theme.breakpoints.down("sm")]: {
          fontSize: 12,
        },
        [theme.breakpoints.down("xs")]: {
          fontSize: 9,
        }
      }
    },
  },
  bidBox: {
    borderRadius: theme.spacing(2),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    display: "flex",
    alignItems: "center",
  },
  text1: {
    fontSize: 14,
    fontWeight: 400,
    color: "#431AB7",
  },
  text2: {
    fontSize: 14,
    fontWeight: 400,
    color: "#707582",
  },
  bidderInfoItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    paddingRight: theme.spacing(6),
    [theme.breakpoints.down("sm")]: {
      marginBottom: 34,
      paddingRight: theme.spacing(3),
    },
  },
  reactPlayer: {
    width: "100% !important",
    height: "100% !important",
  },
  detailImg: {
    height: "100%",
    borderRadius: 16,
    cursor: "pointer",
    objectFit: "fill",
    width: "90%",
    maxHeight: 600,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      maxHeight: 500,
      minHeight: 300,
    },
  },
  leftImage: {
    marginTop: "16px",
    marginBottom: "16px",
  },
  commentIcon: {
    width: 16,
    height: 16,
    cursor: "pointer",
  },
  editComment: {
    border: "none",
    "&:focus": {
      outline: "none",
    }
  },
  mediaInfo: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      justifyContent: "space-between",
      width: "100%",
    },
  },
  mediaUserInfo: {
    [theme.breakpoints.down("xs")]: {
      justifyContent: "space-between",
      width: "100%",
    },
  }
}));

export const LinkIcon = () => (
  <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17.5 1.00001L7.49997 11M17.5 1.00001L17.5 7.00001M17.5 1.00001L11.5 1M7.5 1.00001H1.5V17H17.5V11"
      stroke="#431AB7"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
