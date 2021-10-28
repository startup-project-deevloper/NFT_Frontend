import React from "react";
import { makeStyles } from "@material-ui/core/styles";

export const myNFTStyles = makeStyles(theme => ({
  content: {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minHeight: "calc(100vh - 80px)",
    maxHeight: "calc(100vh - 80px)",
    overflowX: "hidden",
    padding: "50px 24px 0px",
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
    marginTop: 20,
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
    color: "#431AB799",
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
  },
  cardsGroup: {
    marginTop: 64,
    width: "100%",
    height: "100%",

    "& > div": {
      width: "100%",
    },

    [theme.breakpoints.down("sm")]: {
      marginBottom: 50
    },
  },
  sectionTitle: {
    fontWeight: 800,
    fontSize: 24,
    lineHeight: "130%",
  },
  syntheticContent: {
    minHeight: 200,
  },
  cardsGrid: {
    display: "flex",
    flexWrap: "wrap",
    // justifyContent: "space-between",
    columnGap: 16,
    rowGap: 16,
    [theme.breakpoints.down(768)]: {
      justifyContent: "center",
    },
    "& > div": {
      width: 325,
      [theme.breakpoints.down(950)]: {
        width: 300,
      },
      [theme.breakpoints.down(880)]: {
        width: 230,
      },
      [theme.breakpoints.down(768)]: {
        width: 180,
      },
      [theme.breakpoints.down(700)]: {
        width: 160,
      },
    }
  },
  detailsLabel: {
    color: "#431AB7",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "120%",
    marginBottom: "16px",
  },
  emptyBox: {
    background: "#EFF2FD",
    border: "1px solid rgba(67, 26, 183, 0.24)",
    boxSizing: "border-box",
    borderRadius: "20px",
    paddingTop: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: "calc(100% + 32px)",
    marginTop: "-32px"
  },
}));
