import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/ui-kit";

export const AuctionDetailStyles = makeStyles(theme => ({
  root: {
    backgroundColor: Color.GreenLight,
    width: "100%",
    padding: "24px 53px 42px 24px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    borderRadius: "24px",

    "& p": {
      fontFamily: "Agrandir",
      fontWeight: "normal",
      fontSize: "22px",
      lineHeight: "104.5%",
      color: Color.Black,
      margin: 0
    },
    [theme.breakpoints.down("sm")]: {
      padding: 24,
    },
  },
  blueCircle: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    backgroundColor: "#627EEA",
    marginRight: '7px'
  },
  typo1: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "120%",
    color: Color.GrayDark
  },
  typo2: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "20px",
    lineHeight: "104.5%",
    color: Color.Purple,
    marginTop: "8px"
  },
  typo3: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "11px",
    lineHeight: "104.5%",
    color: Color.GrayDark,
    marginTop: "8px",
    marginRight: "8px",
    [theme.breakpoints.down("sm")]: {
      color: Color.Purple,
    },
  },
  endingTime: {
    display: "flex"
  },
  boxWithBorder: {
    padding: "24px 0",
    borderBottom: `1px dashed rgba(24, 24, 24, 0.3)`,
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  bidToken: {
    margin: 0,
    fontSize: 18,
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
      color: "#707582",
    },
  },
  boxInfo: {
    [theme.breakpoints.down("sm")]: {
      marginBottom: 20,
    },
  },
  bottom: {
    paddingTop: 44,
    "& svg": {
      marginRight: "7px"
    },
    [theme.breakpoints.down("sm")]: {
      paddingTop: 24,
      flexDirection: "column",

      "& span": {
        fontSize: 14,
        color: "#707582",
      },
      "& > div:nth-child(1)": {
        marginBottom: 20,
      },
    },
  }
}))

export const CalenderIcon = () => (
  <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.25 1.25V4.25M4.75 1.25V4.25M1 7.25H13M13 7.25V13.25C13 14.0784 12.3284 14.75 11.5 14.75H2.5C1.67157 14.75 1 14.0784 1 13.25V4.25C1 3.42157 1.67157 2.75 2.5 2.75H11.5C12.3284 2.75 13 3.42157 13 4.25V7.25Z"
      stroke="#727F9A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 4.25V8L10.25 10.25M14.75 8C14.75 11.7279 11.7279 14.75 8 14.75C4.27208 14.75 1.25 11.7279 1.25 8C1.25 4.27208 4.27208 1.25 8 1.25C11.7279 1.25 14.75 4.27208 14.75 8Z"
      stroke="#727F9A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
