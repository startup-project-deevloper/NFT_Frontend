import { makeStyles } from "@material-ui/core";

export const feedStyles = makeStyles(theme => ({
  slider: {
    width: "100%",
  },
  leftFriendContainer: {
    minWidth: 260,
    width: 260,
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  filterContainer: {
    width: '50%',
    [theme.breakpoints.down("xs")]: {
      width: '100%',
    },
  },
  topFriendContainer: {
    width: "100%",
    display: "none",
    [theme.breakpoints.down("md")]: {
      display: "block",
    },
  },
  friends: {
    padding: "24px 24px 32px",
    background: "#1A1A1C",
    width: "100%",
    justifyContent: "space-between",
  },
  inputSearch: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 16px 16px",
    background: "#f7f9fe",
    border: "1px solid #e0e4f3",
    boxSizing: "border-box",
    borderRadius: 10,
    "& input": {
      outline: "none",
      border: "none",
      padding: 0,
      margin: 0,
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: 18,
      lineHeight: "104.5%",
      color: "#abb3c4",
      background: "transparent",
      width: "100%",
    },
    "& img": {
      width: 17,
      height: 17,
    },
  },
  headerTitle: {
    [theme.breakpoints.down("md")]: {
      fontSize: "60px !important",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "40px !important",
    },
  },
  header1: {
    fontSize: 26,
    fontWeight: 800,
  },
  header2: {
    fontSize: 20,
    fontWeight: 400,
  },
}));
