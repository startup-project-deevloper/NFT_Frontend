import React from "react";
import styled from "styled-components";

import { makeStyles } from "@material-ui/core";
import { Gradient } from "shared/ui-kit";
import { Color } from "shared/constants/const";

export const profilePageStyles = makeStyles(theme => ({
  mainContent: {
    width: "100%",
    padding: "70px 80px",
    background: "#1A1A1C",
    height: "100vh",
    [theme.breakpoints.down("md")]: {
      padding: "32px 24px",
    },
  },
  navigation: {
    marginBottom: 28,
    fontSize: 14,
    display: "flex",
  },
  tabCard: {
    marginRight: 80,
    color: "#707582",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 8,
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      marginRight: 10,
    },
    [theme.breakpoints.down("xs")]: {
      marginRight: 0,
    },
  },
  tabCardSelected: {
    background: "#eff2f8",
    borderRadius: 8,
  },
  subTab: {
    marginRight: 11,
    borderRadius: 26,
    padding: "11px 0px",
    display: "flex",
    justifyContent: "center",
    width: 110,
    fontWeight: 800,
    fontSize: 14,
    lineHeight: "18px",
    backdropFilter: "blur(10px)",
    cursor: "pointer",
    background: "transparent",
    border: "1.5px solid #FF5954",
    color: "#FF5954",
    "&:last-child": {
      marginRight: 0,
    },
  },
  subTabSelected: {
    marginRight: 11,
    borderRadius: 26,
    padding: "11px 0px",
    display: "flex",
    justifyContent: "center",
    width: 110,
    fontWeight: 800,
    fontSize: 14,
    lineHeight: "18px",
    backdropFilter: "blur(10px)",
    cursor: "pointer",
    color: "#1A1A1C",
    background: "#FF5954",
    borderColor: "#ffffff",
  },
  header: {
    height: 256,
    borderRadius: "12px 12px 0px 0px",
    background: "linear-gradient(225.12deg, #F2A07E -33.5%, #FF5954 71.42%);",
    cursor: "pointer",
  },
  avatar: {
    border: "2px solid #FF5954",
    marginLeft: 40,
    marginTop: -80,
    width: 155,
    height: 155,
    borderRadius: "50%",
    [theme.breakpoints.down("xs")]: {
      width: 90,
      height: 90,
      marginLeft: 25,
      marginTop: -45,
    },
  },
  statLine: {
    display: "flex",
    alignItems: "center",
    color: "#ffffff",
    justifyContent: "space-around",
    flexWrap: "wrap",
    columnGap: 30,
    [theme.breakpoints.down("md")]: {
      justifyContent: "space-between",
    },
  },
  infoPaneMain: {
    padding: "0 60px",
    [theme.breakpoints.down("xs")]: {
      padding: "0 15px",
    },
  },
  indexBadge: {
    "& .hex": {
      marginRight: 0,
    },
    width: 40,
    "&:not(:last-child)": {
      marginRight: -25,
    },
  },
  badgeMore: {
    cursor: "pointer",
    marginLeft: 10,
    zIndex: 2,
    background: Gradient.Green,
    color: "white",
    borderRadius: 10,
    padding: "4px 8px",
  },
  chartContainer: {
    "& > div": {
      overflow: "hidden",
      borderRadius: 8,
    },
    "& h3": {
      marginTop: 0,
      fontWeight: 800,
      fontSize: 22,
      marginBottom: 30,
    },
  },
  chartWrapper: {
    position: "relative",
    height: 290,
    backgroundColor: "rgba(158, 172, 242, 0.1)",
    opacity: 0.8,
    borderRadius: 8,
    "& canvas": {
      borderRadius: 8,
    },
  },
  tradeInfoBox: {
    justifyContent: "center",
    "& h2": {
      fontWeight: 800,
      fontSize: 22,
      color: Color.MusicDAOLightBlue,
      marginBottom: 10,
    },
    "& span": {
      fontSize: 14,
      fontWeight: 500,
      color: Color.MusicDAOLightBlue,
    },
  },
  chartInfo: {
    background: "transparent",
    padding: "15px 20px",
    position: "absolute",
    left: 28,
    top: 37,
    backgroundColor: "#1A1A1C",
  },
  tabItem: {
    fontSize: 22,
    fontWeight: 800,
    fontFamily: 'Agrandir',
    lineHeight: "104.5%",
    cursor: "pointer",
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
    },
  },
  tabItemActive: {
    color: "#FF5954",
    borderBottom: "2px solid #FF5954",
  },
  editProfile: {
    background: "#DDFF57 !important",
    borderRadius: "8px !important",
    width: "130px !important",
    color: "#431AB7 !important",
  },
  followButton: {
    background: "linear-gradient(225.12deg, #F2A07E -33.5%, #FF5954 71.42%);",
    borderRadius: 8,
    padding: "8px 26px",
    color: "#ffffff",
    textTransform: "none",
    "&:hover": {
      background: "#FF5954",
    }
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 800,
    lineHeight: '39px',
    color: '#FFFFFF',
    fontFamily: 'Agrandir'
  },
  manageButton: {
    padding: '0 26px !important',
    borderRadius: '10px !important',
    background: 'linear-gradient(225.12deg, #F2A07E -33.5%, #FF5954 71.42%)',
    height: 40,
    fontSize: 16,
    fontWeight: 800,
    lineHeight: '21px',
    color: '#FFFFFF',
    fontFamily: 'Agrandir'
  },
}));

export type CardProps = React.PropsWithChildren<{
  noPadding?: boolean;
}>;

export const Card = styled.div<CardProps>`
  display: flex;
  flex-direction: column;
  color: #ffffff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  padding: ${p => (p.noPadding ? "0px" : "24px 28px")};
  background: #1A1A1C;
  border: 1px solid #FF5954;
`;
