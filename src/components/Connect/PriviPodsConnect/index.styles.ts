import { makeStyles } from "@material-ui/core";

export const priviPodConnectPageStyles = makeStyles(theme => ({
  logo: {
    position: "absolute",
    width: 132,
    top: 41,
    left: 44,
    [theme.breakpoints.down("sm")]: {
      display: "none",
    }
  },
  container: {
    width: "100%",
    overflowX: "clip",
    overflowY: "auto",
    scrollbarWidth: "none",
    height: "calc(100vh)",
    position: "relative",
  },
  navigationContainer: {
    background:
      "radial-gradient(119.68% 156.16% at 50% -70.4%, #EAE8FA 33.85%, #F6F9FE 68.75%, rgba(255, 255, 255, 0) 100%)",
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
  titleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 130
  },
  snsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 41,
    marginBottom: 200,
  },
  snsBox: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    background: "#7F6FFF",
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
    color: "#7F6FFF",
    marginTop: 32,
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
    color: "#000000",
    lineHeight: "140%",
    textAlign: "center",
    maxWidth: 810,
    padding: "0px 53px",
    "& > span": {
      color: "#7F6FFF",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 24,
    },
  },
  titleDescription2: {
    marginTop: 20,
    fontSize: 24,
    color: "#222145",
    textAlign: "center",
    fontWeight: 400,
    maxWidth: 720,
    "& > span": {
      color: "#7F6FFF",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
    },
  },
  btnConnectContainer: {
    marginTop: 32,
    marginBottom: 200,
    display: "flex",
    justifyContent: "center",
  },
  btnConnect: {
    background:
      "linear-gradient(0deg, #7F6FFF, #7F6FFF), linear-gradient(45.49deg, #8F66FF -18.05%, #4218B5 113.67%), #54658F",
    color: "#181818",
    height: 48,
    padding: "12px 51px",
    fontSize: 18,
    fontWeight: 700,
    borderRadius: 55,
  },
  earlyAccess: {
    textTransform: "uppercase",
    padding: "7px 9px 5px 9px",
    borderRadius: 38,
    fontSize: 10,
    fontWeight: 800,
    position: "absolute",
    top: -32,
    right: -55,
    [theme.breakpoints.down("sm")]: {
      right: 20
    }
  },
  twitterShareContainer: {
    background: "#EAE8FA",
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
      color: "#181818",
      letterSpacing: 0.8,
      fontSize: 18,
      fontWeight: 500,
      "& > a": {
        color: "#181818 !important",
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
    background: "#7F6FFF",
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
    color: "#707582",
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
