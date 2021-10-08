import { makeStyles, withWidth } from "@material-ui/core";

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
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  collapseFriendContainer: {
    width: "100%",
    display: "none",
    position: "fixed",
    left: 0,
    bottom: 0,
    maxHeight: 420,
    zIndex: 100,
    [theme.breakpoints.down("xs")]: {
      display: "block",
    },
  },
  friends: {
    padding: "24px 24px 32px",
    background: "#EFF2FD",
    width: "100%",
    borderRadius: 16,
    justifyContent: "space-between",
    [theme.breakpoints.down("xs")]: {
      padding: "24px 16px",
    },
  },
  collapseFriends: {
    padding: "24px 16px",
    background: "#EFF2FD",
    width: "100%",
    borderRadius: "16px 16px 0 0",
    boxShadow: "0px -4px 4px rgba(0, 0, 0, 0.15)",
    justifyContent: "space-between",
  },
  arrowIcon: {
    cursor: "pointer",
  },
  collapseFriendsInputSearch: {
    width: "100%",
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
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
      fontSize: 16,
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
  inputSearch: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
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
  createPostContainer: {
    background: "#DDFF57",
    boxShadow: "0px 4px 8px #9EACF2",
    borderRadius: theme.spacing(2),
    width: "100%",
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px`,
    color: "#431AB7",
    marginBottom: theme.spacing(2),
  },
  contentContainer: {
    background: "#EFF2FD",
    boxShadow: "0px 4px 8px #9EACF2",
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    boxSizing: "content-box",
    [theme.breakpoints.down("xs")]: {
      padding: 24,
      marginBottom: 140,
    },
  },
  send: {
    background: "#abb3c4",
    borderRadius: "0px 8px 8px 0px",
    flex: "none",
    order: 2,
    flexGrow: 0,
    height: 40,
    width: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& img": {
      margin: 0,
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
