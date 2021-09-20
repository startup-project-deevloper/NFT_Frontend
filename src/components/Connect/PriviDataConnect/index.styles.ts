import { makeStyles } from "@material-ui/core";

export const priviDataConnectPageStyles = makeStyles(theme => ({
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
    width: 363,
    height: 485,
    left: "35%",
    top: -240,
    transform: "rotate(44deg)",
    filter: "blur(120px)",
    background:
      "linear-gradient(156.41deg, #FA18FF 11.7%, rgba(255, 255, 255, 0) 57.03%), radial-gradient(108.54% 138.74% at 86.8% 29.83%, rgba(238, 238, 238, 0) 0%, rgba(167, 54, 255, 0.096) 26.8%, rgba(14, 0, 255, 0.212) 73.32%, rgba(112, 0, 255, 0.384) 100%)",
    [theme.breakpoints.down("sm")]: {
      left: "20%",
    },
    [theme.breakpoints.down("xs")]: {
      width: 200,
      height: 350,
      left: "10%",
      top: 0
    }
    },
  img1: {
    position: "absolute",
    top: theme.spacing(12),
    left: "35%",
    [theme.breakpoints.down("sm")]: {
      position: "absolute",
      top: theme.spacing(8),
      left: "15%",
      opacity: 0.5
    },
    [theme.breakpoints.down("xs")]: {
      position: "absolute",
      top: theme.spacing(8),
      left: "5%",
      opacity: 0.5
    }
  },
  img2: {
    position: "absolute",
    top: theme.spacing(5),
    right: "30%",
    [theme.breakpoints.down("sm")]: {
      position: "absolute",
      top: theme.spacing(3),
      right: "20%",
      opacity: 0.5
    },
    [theme.breakpoints.down("sm")]: {
      position: "absolute",
      top: theme.spacing(3),
      right: "10%",
      opacity: 0.5
    }
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
    overflow: 'hidden',
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
    marginTop: 32,
    marginBottom: 200,
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
    "& svg path": {
      fill: "#000000",
    },
  },
  titleFollow: {
    fontSize: 24,
    fontWeight: 800,
    color: "#BA50FC",
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
    }
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
