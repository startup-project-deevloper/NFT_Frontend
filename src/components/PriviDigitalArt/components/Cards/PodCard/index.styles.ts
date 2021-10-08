import { makeStyles } from "@material-ui/core/styles";

export const podCardStyles = makeStyles(theme => ({
  card: {
    background: "#ffffff",
    boxShadow: "0px 4px 8px #9EACF2",
    borderRadius: 16,
    minWidth: 276,
    height: "fit-content",
    padding: 16,
  },
  header: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    "& button": {
      background: "transparent",
      padding: 0,
      borderRadius: 0,
      marginLeft: 12,
    },
    "& button img": {
      width: 18,
    },
  },
  avatar: {
    backgroundColor: "#c4c4c4",
    width: 40,
    minWidth: 40,
    height: 40,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "50%",
    marginRight: 8,
  },
  black: {
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 14,
    lineHeight: "120%",
    color: "#1a1b1c",
  },
  creatorName: {
    maxWidth: 124,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: 1.2,
  },
  gray: {
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 14,
    lineHeight: "120%",
    color: "#a4a4a4",
    overflow: "hidden",
    "& span": {
      fontStyle: "normal",
      fontWeight: 800,
      fontSize: 18,
      lineHeight: "104.5%",
      color: "#431ab7",
      marginLeft: 8,
    },
  },
  optionsBtn: {
    width: 18,
    "& img": {
      transform: "rotate(90deg)",
      width: "3px !important",
    },
  },
  media: {
    width: "100%",
    margin: "8px 0px",
    borderRadius: 16,
    height: "auto",
    minHeight: 226,
  },
  fixed: {
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor: "#c4c4c4",
    height: 226,
    maxHeight: 226,
  },
  info: {
    display: "flex",
    flexDirection: "column",
    "& > div": {
      marginBottom: 8,
      width: "100%",
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
    },
    "& > div:last-child": {
      marginBottom: 8,
    },
    cursor: "pointer",
  },
  title: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: "18px !important",
    maxWidth: "250px",
  },
  auction: {
    display: "flex",
    flexDirection: "column",
    padding: "8px 16px",
    position: "static",
    width: "100%",
    background: "#ddff57",
    borderRadius: 8,
    margin: "0px 0px 16px",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 14,
    lineHeight: "120%",
    color: "#431ab7",
    "& h5": {
      fontStyle: "normal",
      fontWeight: 800,
      fontSize: 18,
      lineHeight: "104.5%",
      color: "#431ab7",
      margin: "8px 0px 0px",
    },
  },
  fruitsContainer: {
    "& > div > div": {
      background: "#9EACF2",
      width: 30,
      height: 30,
      borderRadius: 15,
      padding: 5,
      filter: "drop-shadow(0px 1.5px 6px rgba(0, 0, 0, 0.2))",
      "& img": {
        width: 21,
      },
    },
  },
  chain: {
    width: 22,
    height: 22,
    objectFit: "contain",
    borderRadius: "50%",
  },
  fraction: {
    background: "#431AB7",
    borderRadius: 24,
    color: "#DDFF57",
    fontSize: 12,
    fontWeight: 800,
    padding: 8,
  },
  podMainInfoContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#431AB7",
    cursor: "pointer",
    "& div": {
      display: "flex",
      flexDirection: "column",
      "& p": {
        fontWeight: 800,
      },
    },
  },
  viewsBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderTop: "1px solid #00000022",
    borderBottom: "1px solid #00000022",
    // padding: `${theme.spacing(2)}px 0`,
    margin: `${theme.spacing(1)}px 0`,
    cursor: "pointer"
  },
}));
