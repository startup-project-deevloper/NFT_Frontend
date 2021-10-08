import { makeStyles } from "@material-ui/core/styles";

export const likedPageStyles = makeStyles(theme => ({
  headerTitle: {
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 40,
    lineHeight: "104.5%",
    marginBottom: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#181818",
    "& button": {
      marginLeft: 26,
      background: "transparent",
      padding: 0,
      borderRadius: 0,
    },
    "& button img": {
      width: 16,
      height: 18,
    },

    [theme.breakpoints.down("sm")]: {
      fontSize: 30,
      "& button": {
        marginLeft: 8,
      },
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 26,
    },
  },
  paper: {
    minWidth: 163,
    marginLeft: -15,
    borderRadius: 0,
    marginTop: 5,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    [theme.breakpoints.down("sm")]: {
      marginLeft: -100,
    },
  },
}));
