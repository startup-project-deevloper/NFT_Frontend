import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Color, FontSize } from "shared/ui-kit";

export const useStyles = makeStyles(theme => ({
  offerList: {
    background: Color.White,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    borderRadius: "24px",
    display: "flex",
    flexDirection: "column",
    padding: "24px 54px 42px 24px",
    marginTop: "11px",
    "& a": {
      margin: "auto",
      FontSize: "16px",
      lineHeight: "21px",
      fontWeight: 800,
      color: Color.Purple,
      marginTop: 17,
    },
    "& > button": {
      padding: "8px 26px",
      width: "100%",
      maxWidth: 522,
      background: Color.Purple,
      backdropFilter: "blur(10px)",
      borderRadius: "6px",
      margin: "38px auto 0",
      lineHeight: "normal",
    },

    [theme.breakpoints.down("sm")]: {
      padding: "27px 10px",
      marginBottom: 40,
    },
  },
  offerTitle: {
    [theme.breakpoints.down("sm")]: {
      fontSize: 18,
      color: '#707582',
    },
  },
  table: {
    marginTop: 24,
    minHeight: 320,
    "& .MuiTableCell-root": {
      fontFamily: "Agrandir",
      padding: "9px 16px",
    },
    "& .MuiTableRow-head": {
      background: Color.GrayInputBackground,
      "& .MuiTableCell-head": {
        border: "none",
        fontSize: FontSize.M,
        color: Color.GrayDark,
      },
    },

    [theme.breakpoints.down("sm")]: {
      minHeight: 200,
      "& .MuiTableContainer-root": {
        boxShadow: "none",
        borderRadius: 0,
      },
      "& .MuiTableCell-body": {
        fontSize: 10,
        "& img": {
          width: 24,
          height: 24,
        },
        "& span": {
          fontSize: 10,
        }
      },
    },

    [theme.breakpoints.down("xs")]: {
      minHeight: 200,
      "& .MuiTableContainer-root": {
        boxShadow: "none",
        borderRadius: 0,
      },
      "& .MuiTableContainer-root .MuiTableRow-head .MuiTableCell-head": {
        fontSize: 8,
      },
      "& .MuiTableCell-body": {
        fontSize: 8,
        "& img": {
          width: 14,
          height: 14,
        },
        "& span": {
          fontSize: 8,
          marginLeft: 10,
        }
      },
      "& .MuiTableCell-root": {
        padding: '9px',
      },
    },
  },
  fromCell: {
    display: "flex",
  },
  explorerImg: {
    width: 24,
    height: 20,
    marginLeft: 20,
  },
}));

export const ExternalLinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M17 0.875012L6.99997 10.875M17 0.875012L17 6.87501M17 0.875012L11 0.875M7 0.875012H1V16.875H17V10.875"
      stroke="#727F9A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
