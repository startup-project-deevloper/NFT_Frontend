import { makeStyles } from "@material-ui/core";

export const priviGovernanceConnectPageStyles = makeStyles(theme => ({
  logo: {
    position: "absolute",
    width: 132,
    top: 41,
    left: 44,
    [theme.breakpoints.down("sm")]: {
      display: "none",
    }
  },
  gradient: {
    position: "absolute",
    left: "50%",
    top: 0,
    width: "80%",
    transform: "translate(-50%, 0)",
  },
  img1: {
    position: "absolute",
    top: theme.spacing(12),
    left: "35%",
  },
  img2: {
    position: "absolute",
    top: theme.spacing(5),
    right: "30%",
  },
  container: {
    width: "100%",
    overflowY: "auto",
    overflowX: "clip",
    scrollbarWidth: "none",
    height: "calc(100vh)",
    background: "linear-gradient(0deg, #222145, #222145), linear-gradient(0deg, #F7F8FB, #F7F8FB), #FFFFFF",
    position: "relative",
  },
  navigationContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: `200px ${theme.spacing(6)}px 0 ${theme.spacing(6)}px`,
    minHeight: "90vh",
    [theme.breakpoints.down("sm")]: {
      paddingTop: 100,
      paddingLeft: 32,
      paddingRight: 32,
    },
    [theme.breakpoints.down("xs")]: {
      minHeight: "auto",
      paddingBottom: 100,
      paddingLeft: 16,
      paddingRight: 16,
    }
  },
  titleLogo: {
    width: 225,
    height: 62,
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80
  },
  snsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 41,
    marginBottom: 200,
  },
  snsBox: {
    width: 52,
    height: 52,
    background: "linear-gradient(0deg, #BA50FC, #BA50FC), #7977D1",
    borderRadius: "50%",
    marginRight: theme.spacing(2),
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    "& svg path": {
      fill: "#000000",
    },
  },
  titleFollow: {
    fontSize: 24,
    fontWeight: 800,
    color: "#BA50FC",
    marginTop: 40,
    textAlign: "center",
    paddingTop: 16,
    borderTop: "1px dashed #4218B5",
    [theme.breakpoints.down("xs")]: {
      fontSize: 18
    },
  },
  titleDescription: {
    marginTop: 25,
    fontSize: 33,
    fontWeight: 800,
    color: "#ffffff",
    lineHeight: "140%",
    textAlign: "center",
    maxWidth: 810,
    padding: "0px 53px",
    "& > span": {
      color: "#BA50FC",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 24,
    },
  },
  titleDescription2: {
    marginTop: 20,
    fontSize: 24,
    color: "white",
    textAlign: "center",
    fontWeight: 400,
    maxWidth: 720,
    "& > span": {
      color: "#BA50FC",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 18
    },
  },
  btnConnectContainer: {
    marginTop: 32,
    marginBottom: 200,
    display: "flex",
    justifyContent: "center",
  },
  btnConnect: {
    background: "linear-gradient(97.4deg, #EA89F3 14.43%, #A83AFF 79.45%)",
    color: "white",
    height: 48,
    padding: "12px 51px",
    fontSize: 18,
    fontWeight: 700,
    borderRadius: 55,
  },
  earlyAccess: {
    textTransform: "uppercase",
    padding: "7px 8px 5px 8px",
    borderRadius: 38,
    fontSize: 10,
    fontWeight: 800,
    position: "absolute",
    top: -32,
    right: -56,
    [theme.breakpoints.down("sm")]: {
      right: 20
    }
  },
  twitterShareContainer: {
    background: "#343268",
    border: "1px solid rgba(158, 172, 242, 0.7)",
    boxSizing: "border-box",
    borderRadius: 20,
    padding: "56px 115px 43px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    rowGap: 40,
    marginTop: 40,
    marginBottom: 118,
    "& > span": {
      maxWidth: 480,
      textAlign: "center",
      lineHeight: "150%",
      color: "white",
      letterSpacing: 0.8,
      fontSize: 18,
      fontWeight: 500,
      "& > a": {
        color: "white !important",
        fontWeight: 700,
      },
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
      "& > span": {
        wordBreak: "break-word",
      },
    }
  },
  twitterShareButton: {
    height: 48,
    padding: "12px 55px",
    background: "linear-gradient(97.4deg, #EA89F3 14.43%, #A83AFF 79.45%)",
    borderRadius: 41,
    display: "flex",
    columnGap: 12,
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 700,
    fontSize: 16,
    lineHeight: "150%",
    color: "#FFFFFF",
    "& > svg path": {
      fill: "#FFFFFF",
    },
  },
  title2: {
    fontSize: "25px",
    fontWeight: 400,
  },
  backButton: {
    fontSize: "16px",
    color: "#FFF",
    fontWeight: 700,
  },
  backBox: {
    top: 95,
    left: 44,
    width: 135,
    position: "absolute",
    display: "flex",
    cursor: "pointer",
    zIndex: 1,
    [theme.breakpoints.down("sm")]: {
      top: 40,
    }
  },
}));
