import { makeStyles } from "@material-ui/core/styles";

export const priviFlixConnectPageStyles = makeStyles(theme => ({
  logo: {
    position: "absolute",
    width: 147,
    top: 41,
    left: 44,
    [theme.breakpoints.down("sm")]: {
      display: "none",
    }
  },
  container: {
    width: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    scrollbarWidth: "none",
    height: "calc(100vh)",
    background: "linear-gradient(0deg, #020102, #020102), linear-gradient(0deg, #F7F8FB, #F7F8FB), #FFFFFF;",
    position: "relative",
  },
  navigationContainer: {
    background:
      "radial-gradient(120.88% 199.83% at -30.8% -93.71%, #FC6F62 0%, #E84D2B 24.27%, rgba(255, 89, 85, 0.47) 51.55%, rgba(0, 0, 0, 0) 85.92%), radial-gradient(97.8% 161.67% at 100% -55.55%, #FF5955 0%, rgba(255, 89, 85, 0.75) 24.27%, rgba(255, 134, 46, 0.33) 51.55%, rgba(0, 0, 0, 0) 85.92%);",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: `200px ${theme.spacing(6)}px 0 ${theme.spacing(6)}px`,
    minHeight: "90vh",
    [theme.breakpoints.down("sm")]: {
      paddingTop: 100,
    },
    [theme.breakpoints.down("xs")]: {
      minHeight: "auto",
      paddingBottom: 100,
    }
  },
  titleContainer: {
    position: "relative",
  },
  snsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    marginBottom: 355,
  },
  snsBox: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    background: "#FF5954",
    borderRadius: "50%",
    marginRight: theme.spacing(2),
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    "& svg path": {
      fill: "#ffffff",
    },
  },
  titleFollow: {
    fontSize: 24,
    fontWeight: 800,
    color: "#FF5954",
    marginTop: 32,
    textAlign: "center",
    paddingTop: 32,
    lineHeight: "39.36px",
    borderTop: "1px dashed #707582",
    [theme.breakpoints.down("xs")]: {
      fontSize: 18
    },
  },
  titleDescription: {
    marginTop: 38,
    fontSize: 33,
    fontWeight: 800,
    color: "#ffffff",
    lineHeight: "140%",
    textAlign: "center",
    maxWidth: 810,
    padding: "0px 53px",
    "& > span": {
      color: "#FF5954",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 24,
    }
  },
  titleDescription2: {
    marginTop: 16,
    fontSize: 24,
    color: "#ffffff",
    textAlign: "center",
    fontWeight: 800,
    maxWidth: 720,
    lineHeight: "36px",
    "& > span": {
      color: "#FF5954",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 18
    },
  },
  titleDescription3: {
    marginTop: 38,
    fontSize: 24,
    color: "#ffffff",
    textAlign: "center",
    fontWeight: 800,
    maxWidth: 720,
    lineHeight: "39.36px",
    "& > span": {
      color: "#FF5954",
    },
  },
  btnConnectContainer: {
    marginTop: 40,
    display: "flex",
    justifyContent: "center",
  },
  btnConnect: {
    background: "#ffffff",
    color: "#FF5954",
    height: 53,
    fontSize: 18,
    fontWeight: 700,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  earlyAccess: {
    textTransform: "uppercase",
    padding: "7px 9px 5px 9px",
    borderRadius: 38,
    fontSize: 10,
    fontWeight: 800,
    position: "absolute",
    top: -20,
    right: -48,
  },
  twitterShareContainer: {
    background: "#202020",
    boxSizing: "border-box",
    padding: "56px 108px 37px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    rowGap: 40,
    marginTop: 40,
    "& > span": {
      maxWidth: 480,
      textAlign: "center",
      lineHeight: "150%",
      color: "#ffffff",
      letterSpacing: 0.8,
      fontSize: 18,
      fontWeight: 500,
      "& > a": {
        color: "#ffffff !important",
        fontWeight: 700,
      },
    },
  },
  twitterShareButton: {
    height: 48,
    padding: "12px 55px",
    background: "linear-gradient(225.12deg, #F2A07E -33.5%, #FF5954 71.42%);",
    borderRadius: 8,
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
  mainContainer: {
    [theme.breakpoints.down("sm")]: {
      marginTop: 20,
    }
  },
  "@media (max-width: 780px)": {
    titleContainer: {
      marginTop: 20,
    },
    earlyAccess: {
      right: 20,
    },
    twitterShareContainer: {
      padding: theme.spacing(2),
      "& > span": {
        wordBreak: "break-word",
      },
    },
  },
}));
