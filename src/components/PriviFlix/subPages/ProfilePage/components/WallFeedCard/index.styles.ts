import { makeStyles } from "@material-ui/core/styles";

export const wallFeedCardStyles = makeStyles(theme => ({
  wallItem: {
    display: "flex",
    flexDirection: "column",
    background: "#1E2026",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    borderRadius: 16,
    width: "100%",
    fontSize: 14,
    color: "#ffffff",
    padding: 24,
    cursor: "pointer",
    border: '1px solid #FF5954',
    h3: {
      fontStyle: "normal",
      fontWeight: 800,
      fontSize: 14,
      lineHeight: "21px",
      margin: "0px 0px 8px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: 16,
      background: "#EFF2FD",
      borderRadius: 20,
    },
  },
  desc: {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  shareButton: {
    marginLeft: 16,
    height: "auto",
    padding: 0,
    minHeight: 0,
    width: "auto",
    minWidth: 0,
    borderRadius: 0,
    "& svg path": {
      fill: "#431AB7",
    },
    [theme.breakpoints.down("md")]: {
      "& svg": {
        width: 40,
      }
    },
  },
  shareImg: {
    width: 19,
  },
  fruitsContainer: {
    background: "#FF5954",
    boxShadow: "0px 1.4852px 5.94081px rgba(0, 0, 0, 0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    [theme.breakpoints.down("md")]: {
      "& img": {
        width: 20,
      }
    },
  },
  readMore: {
    fontWeight: 800,
  },
  feedImg: {
    borderRadius: "14px",
    width: "100%",
    height: "auto",
    maxWidth: 460,
    minHeight: 460,
    [theme.breakpoints.down("md")]: {
      maxWidth: 300,
      minHeight: 300,
    },
    [theme.breakpoints.down("sm")]: {
      maxWidth: 200,
      minHeight: 200,
    },
    [theme.breakpoints.down("xs")]: {
      maxWidth: 125,
      minHeight: 125,
    },
  },
  feedText: {
    flex: 1,
    "& > div": {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
    }
  }
}));
