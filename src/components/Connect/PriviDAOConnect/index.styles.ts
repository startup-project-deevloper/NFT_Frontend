import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/constants/const";

export const priviHomePageStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    overflowY: "auto",
    overflowX: "clip",
    scrollbarWidth: "none",
    height: "calc(100vh)",
    background: "linear-gradient(0deg, #020102, #020102), linear-gradient(0deg, #F7F8FB, #F7F8FB), #FFFFFF",
  },
  navigationContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: `200px ${theme.spacing(2)}px 0 ${theme.spacing(2)}px`,
    minHeight: "90vh",
    [theme.breakpoints.down("sm")]: {
      paddingTop: 100,
    },
    [theme.breakpoints.down("xs")]: {
      minHeight: "auto",
      paddingBottom: 100,
    }
  },
  contentBox: {
    padding: `0px ${theme.spacing(20)}px`,
    marginTop: theme.spacing(3),
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      padding: `0px ${theme.spacing(10)}px`,
    },
    [theme.breakpoints.down("xs")]: {
      padding: `0px ${theme.spacing(5)}px`,
    },
    "& .rec-carousel-item": {
      height: "100%",

      "& .rec-item-wrapper": {
        height: "100%",
      },
    },
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  header1: {
    fontSize: "12px",
  },
  titleContainer: {
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      marginTop: 0
    },
  },
  title: {
    fontSize: "60px",
    lineHeight: "120%",
    fontWeight: 800,
    background: "linear-gradient(106.63deg, #9067FF 38.5%, #4319B6 160.38%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  snsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 30,
    [theme.breakpoints.down("xs")]: {
      marginBottom: 80,
    },
  },
  snsBox: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    background: "linear-gradient(102.54deg, #00BFFF -9.09%, #8D2EFF 56.17%, #FF00C1 112.56%)",
    borderRadius: "50%",
    marginRight: theme.spacing(2),
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    "& svg path": {
      fill: "#fff",
    },
  },
  priviTitle: {
    fontSize: "35px",
    fontWeight: 800,
    background: "linear-gradient(106.63deg, #9067FF 38.5%, #4319B6 160.38%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  zooTitle: {
    fontSize: "64px",
    lineHeight: "120%",
    marginLeft: 15,
    fontWeight: 800,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    background:
      "radial-gradient(22.09% 70.3% at 21.73% 0%, #C930FF 0%, rgba(197, 33, 255, 0) 100%), linear-gradient(93.82deg, #9067FF 12.26%, #0500FF 38.25%)",
  },
  titleFollow: {
    fontSize: 24,
    marginTop: 0,
    marginBottom: 0,
    fontWeight: "normal",
    textAlign: "center",
    paddingTop: 16,
    borderTop: "1px dashed #4218B5",
    background: "linear-gradient(102.54deg, #00BFFF -9.09%, #8D2EFF 56.17%, #FF00C1 112.56%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
    },
  },
  titleDescription: {
    marginTop: 24,
    fontSize: 33,
    color: "#FFFFFF",
    fontWeight: 800,
    lineHeight: 1.4,
    textAlign: "center",
    maxWidth: 640,
    "& > span": {
      fontWeight: "bold",
      color: "transparent",
      marginLeft: 8,
      cursor: "pointer",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      background: "linear-gradient(102.54deg, #00BFFF -9.09%, #8D2EFF 56.17%, #FF00C1 112.56%)",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 24,
    },
  },
  titleDescription2: {
    marginTop: 24,
    fontSize: 24,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: 400,
    maxWidth: 720,
    "& > span": {
      color: "#4218B5",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
    },
  },
  btnConnectContainer: {
    marginTop: 40,
    display: "flex",
    justifyContent: "center",
  },
  btnConnect: {
    background: "transparent",
    borderRadius: 6,
    border: "1px solid #FF00C1",
    color: Color.White,
    height: 53,
    fontWeight: 700,
    fontSize: 18,
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  musicBox: {
    background: "linear-gradient(97.4deg, #8F66FF 14.43%, #4218B5 79.45%)",
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2.5),
    boxShadow: "0px 11px 14px rgba(91, 66, 121, 0.11)",
    paddingBottom: 0,
    color: "white",
    width: "100%",
    height: "100%",
  },
  earlyAccess: {
    textTransform: "uppercase",
    padding: '7px 9px 5px 9px',
    borderRadius: 38,
    fontSize: 10,
    fontWeight: 800,
    position: "absolute",
    top: 0,
    right: -55,
  },
  shadowBox: {
    borderRadius: theme.spacing(1),
    boxShadow: `2px 2px 12px rgba(0, 0, 0, 0.1)`,
    background: "white",
    overflow: "hidden",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",

    "& img": {
      width: theme.spacing(15),
    },
  },
  twitterShareContainer: {
    background: "rgba(158, 172, 242, 0.2)",
    border: "1px solid rgba(158, 172, 242, 0.7)",
    boxSizing: "border-box",
    borderRadius: 20,
    padding: "55px 130px 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    rowGap: 40,
    marginTop: 40,
    "& > span": {
      maxWidth: 480,
      textAlign: "center",
      fontSize: 18,
      lineHeight: "150%",
      color: "#4218B5",
      letterSpacing: 0.8,
      "& > a": {
        color: "#4218B5 !important",
        fontWeight: 700,
      }
    },
  },
  twitterShareButton: {
    width: 250,
    height: 44,
    background: "#181818",
    borderRadius: 8,
    display: "flex",
    columnGap: 12,
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: "150%",
    color: "#FFFFFF",
    "& > svg path": {
      fill: "#FFFFFF",
    },
  },
  cardTitle: {
    background: "linear-gradient(237.02deg, #906CF1 30.32%, #E27E96 107.17%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: "25px",
    fontWeight: 800,
  },
  cardTitle2: {
    color: "#673FDB",
    fontSize: "25px",
    fontWeight: 800,
  },
  title2: {
    fontSize: "25px",
    fontWeight: 400,
  },
  pixLogo: {
    marginTop: 32,
  },
  navIconBox: {
    borderRadius: theme.spacing(3),
    boxShadow: "0px 10px 21px -9px rgba(89, 81, 143, 0.28)",
    background: "white",
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,

    "& div": {
      cursor: "pointer",
    },
  },
  gradient: {
    pointerEvents: "none",
    height: "66vh",
    width: "100%",
    position: "absolute",
    background:
      "radial-gradient(120.88% 199.83% at -30.8% -93.71%, #FF00C1 0%, #D02BE8 24.27%, rgba(141, 46, 255, 0.7) 51.55%, rgba(0, 0, 0, 0) 85.92%), radial-gradient(97.8% 161.67% at 100% -55.55%, #FF00C1 0%, #D02BE8 24.27%, rgba(141, 46, 255, 0.7) 51.55%, rgba(0, 0, 0, 0) 85.92%)",
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
