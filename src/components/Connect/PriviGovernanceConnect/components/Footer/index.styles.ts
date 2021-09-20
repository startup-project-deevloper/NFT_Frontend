import { makeStyles } from "@material-ui/core";

export const footerStyles = makeStyles(theme => ({
  contentBox: {
    borderTop: "1px solid #707582",
    padding: `0px ${theme.spacing(20)}px`,
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      padding: `0px ${theme.spacing(10)}px`,
    },
    [theme.breakpoints.down("xs")]: {
      padding: `0px ${theme.spacing(5)}px`,
    },
    fontFamily: "Agrandir",
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  header1: {
    fontSize: "22px",
    fontWeight: "normal",
    color: "white",
    textDecoration: "underline",
    cursor: "pointer",
  },
  title: {
    fontSize: "35px",
    fontWeight: 800,
    background: "white",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  title2: {
    fontSize: "30px",
    fontWeight: 400,
    color: "white",
  },
  title3: {
    color: "white",
    fontSize: 30,
    fontWeight: 400,
  },
  findUs: {},
  footerBox: {
    maxWidth: "1000px",
    margin: "auto",
    display: "flex",
    justifyContent: "space-between",
    paddingTop: 100,
    paddingBottom: 120,
  },
  snsBox: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    background: "linear-gradient(0deg, #BA50FC, #BA50FC), #7977D1",
    borderRadius: "50%",
    marginRight: theme.spacing(2),
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  footerTextWrapper: {
    marginTop: 0,
    marginLeft: 0,
  },
  "@media (max-width: 780px)": {
    findUs: {
      marginTop: 10,
    },
    footerBox: {
      flexDirection: "column",
      paddingTop: 40,
    },
    footerTextWrapper: {
      marginTop: 30,
      marginLeft: 16,
    },
    contentBox: {
      padding: "0 20px",
    },
    flexBox: {
      justifyContent: "space-between",
    },
  },
}));
