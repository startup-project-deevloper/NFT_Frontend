import React from "react";
import styled from "styled-components";

import { makeStyles } from "@material-ui/core/styles";
import { Gradient } from "shared/ui-kit";
import { Color } from "shared/constants/const";

export const profilePageStyles = makeStyles(theme => ({
  mainContent: {
    maxHeight: "calc(100vh - 80px)",
    width: "100%",
    padding: "32px 80px",
    overflowY: "scroll",
    [theme.breakpoints.down("md")]: {
      padding: "32px 24px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "16px",
    },
  },
  navigation: {
    marginBottom: 28,
    fontSize: 14,
    display: "flex",
  },
  tabs: {
    display: "flex",
    alignItems: "center",
    columnGap: 32,
    [theme.breakpoints.down("xs")]: {
      justifyContent: "space-between",
      columnGap: 12,
    },
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
    border: "1.5px solid #181818",
    color: "#181818",
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
    color: "#ffffff",
    background: "#9EACF2",
    borderColor: "#9EACF2",
  },
  header: {
    height: 256,
    borderRadius: "16px 16px 0px 0px",
    background:
      "conic-gradient( from 111.31deg at 50% 51.67%, #b1ff00 -118.12deg, #00ff15 110.62deg, #b1ff00 241.88deg, #00ff15 470.63deg)",
    cursor: "pointer",
  },
  avatar: {
    border: "4px solid #ffffff",
    marginLeft: 40,
    marginTop: -80,
    width: 160,
    height: 160,
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
    color: "#181818",
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
    backgroundColor: "#ffffff",
  },
  tabItem: {
    fontSize: 22,
    fontWeight: 400,
    cursor: "pointer",
    whiteSpace: "nowrap",
    [theme.breakpoints.down("xs")]: {
      fontSize: 16,
    },
  },
  tabItemActive: {
    color: "#431AB7",
    borderBottom: "2px solid #431AB7",
  },
  editProfile: {
    background: "#DDFF57 !important",
    borderRadius: "8px !important",
    width: "130px !important",
    color: "#431AB7 !important",
  },
  followButton: {
    background: "#431AB7",
    borderRadius: 8,
    padding: "8px 26px",
    color: "#DDFF57",
    textTransform: "none",
    "&:hover": {
      background: "#431AB7",
    },
  },
}));

export type CardProps = React.PropsWithChildren<{
  noPadding?: boolean;
}>;

export const Card = styled.div<CardProps>`
  display: flex;
  flex-direction: column;
  color: #707582;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
  border-radius: 16px;
  padding: ${p => (p.noPadding ? "0px" : "24px 28px")};
`;
