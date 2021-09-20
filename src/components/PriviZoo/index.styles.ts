import { makeStyles } from "@material-ui/core";

export const priviZooPageStyles = makeStyles(theme => ({
  container: {
    height: `calc(100vh)`,
    "&::after": {
      position: "absolute",
      backgroundImage: `url(${require("assets/zooImages/Background.png")})`,
      mixBlendMode: "color-burn",
      opacity: 0.08,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      content: "",
    },
  },
  gradientFrame: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
  },
  subContainer: {
    overflowX: "hidden",
    width: "100%",
    overflowY: "auto",
    scrollbarWidth: "none",
    height: "calc(100vh)",
  },
  navigationContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
    backgroundSize: "cover",
    position: "relative",
  },
  topWrapper: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 60,
    marginTop: 40,
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
  },
  myApps: {
    padding: "22px 27px",
    background: "#181818",
    color: "#FFF",
    fontSize: 18,
    fontWeight: 700,
    height: 59,
    borderRadius: 78,
    minWidth: 200,
  },
  contentBox: {
    padding: `0px ${theme.spacing(20)}px`,
    marginTop: 160,
    width: "100%",
    [theme.breakpoints.down("md")]: {
      padding: `0px ${theme.spacing(5)}px`,
    },
    [theme.breakpoints.down("xs")]: {
      padding: `0px ${theme.spacing(3)}px`,
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
  title: {
    display: "flex",
    justifyContent: "left",
    height: 56,
    width: 468,
    [theme.breakpoints.down("sm")]: {
      width: 350,
    },
    [theme.breakpoints.down("xs")]: {
      width: 278,
    },
  },
  titleDescription: {
    fontSize: 33,
  },
  priviTitle: {
    marginRight: 40,
    width: 305,
    height: 56,
    [theme.breakpoints.down("sm")]: {
      marginRight: 24,
    },
    [theme.breakpoints.down("xs")]: {
      width: 180,
      marginRight: 12,
    },
  },
  zooTitle: {
    height: 87,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      height: 35,
      marginTop: -theme.spacing(3),
      "& > img": {
        height: "100%",
      },
    },
  },
  musicBox: {
    background: "linear-gradient(97.4deg, #8F66FF 14.43%, #4218B5 79.45%)",
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2.5),
    boxShadow: "0px 11px 14px rgba(91, 66, 121, 0.11)",
    paddingBottom: 0,
    color: "white",
    width: "100%",
    height: "99%",
    display: "flex",
    marginBottom: "5px",
    flexDirection: "column",
    alignItems: "center",
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
    marginBottom: 13,
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
  indexDotBox: {
    width: theme.spacing(1.5),
    height: theme.spacing(1.5),
    background: "none",
    border: "1px solid #4218B5",
    borderRadius: "50%",
    cursor: "pointer",

    "&.selected": {
      background: "#4218B5",
    },
  },
  cardGrid: {
    height: "100%",
  },
  cardsGrid: {
    display: "grid",
    gridColumnGap: "20px",
    gridRowGap: "20px",
    width: "100%",
  },
  priviBox: {
    overflow: "hidden",
    borderRadius: 44,
    boxShadow: `0px 41px 55px -16px rgba(124, 103, 255, 0.47)`,
    background:
      "linear-gradient(0deg, #FFFFFF, #FFFFFF), radial-gradient(90.34% 108.16% at 56.68% -11.1%, #613DEE 0%, #FFE6E6 57.41%, #FFFEFC 98.44%);",
    marginTop: 64,
    margin: `0px ${theme.spacing(20)}px 50px ${theme.spacing(20) + 24}px`,
    padding: "60px 24px 100px 24px",
    width: "100%",
    [theme.breakpoints.down("md")]: {
      margin: `0px ${theme.spacing(5)}px`,
    },
    [theme.breakpoints.down("sm")]: {
      margin: `0px 15px`,
    },
    [theme.breakpoints.down("xs")]: {
      margin: `0px 15px`,
      padding: "10px 0",
      marginTop: 30,
    },
  },
  priviBoxTitle: {
    fontSize: 42,
    fontWeight: 900,
    lineHeight: "104.5%",
    color: "#3f3a58",
    display: "flex",
    marginBottom: 48,
    "& span": {
      fontSize: 40,
      fontWeight: 400,
      display: "flex",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 22,
      "& span": {
        fontSize: 20,
      },
    },
  },
  prevText: {
    display: "flex",
    flex: 1.2,
    justifyContent: "flex-end",
    paddingRight: "12px !important",
  },
  appText: {
    flex: 1,
    justifyContent: "left",
    animation: `$fadein 1000ms ${theme.transitions.easing.easeInOut}`
  },
  "@keyframes fadein": {
    "from": {
      opacity: 0,
    },
    "to": {
      opacity: 1,
    },
  },
  carouselBox: {
    maxWidth: "1000px",
    width: "100%",
    height: "425px",

    [theme.breakpoints.down("sm")]: {
      width: "100%",
      margin: `0px ${theme.spacing(10)}px`,
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      margin: `0px ${theme.spacing(5)}px`,
    },
  },
  logo: {
    position: "absolute",
    top: 30,
    left: 48,
    width: 120,
    cursor: "pointer",
  },
  backTopLogo: {
    position: "absolute",
    top: -500,
    left: "45%",
    transform: "rotate(-165deg)",
    width: 790,
    filter: "blur(14px)",
  },
  backLogo: {
    position: "absolute",
    top: 120,
    left: "62%",
    transform: "rotate(-26.36deg)",
    width: 332,
    backgroundBlendMode: "color-dodge, normal",
    [theme.breakpoints.down("sm")]: {
      width: theme.spacing(25),
      top: theme.spacing(6),
    },
    [theme.breakpoints.down("xs")]: {
      width: theme.spacing(16),
      top: theme.spacing(6),
    },
  },
  backMusic: {
    position: "absolute",
    top: -280,
    left: "68%",
    transform: "rotate(-30deg)",
    width: 700,
    [theme.breakpoints.down("sm")]: {
      width: theme.spacing(45),
      top: -theme.spacing(20),
    },
    [theme.breakpoints.down("xs")]: {
      width: theme.spacing(30),
      top: -theme.spacing(15),
    },
  },
  btnConnectContainer: {
    position: "absolute",
    top: 36,
    right: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnConnect: {
    background: "transparent",
    color: "black",
    height: 40,
    border: "1.5px solid #707582",
    borderRadius: 20,
    backdropFilter: "blur(10px)",
    fontSize: 16,
    fontWeight: 800,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: "100%",
    position: "absolute",
    top: 36,
    right: 40,
    border: "2px solid #ffffff",
    boxSizing: "content-box",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
  },

  "@keyframes gradientmove": {
    "0%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
  "@-webkit-keyframes gradientmove": {
    "0%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
  "@-moz-keyframes gradientmove": {
    "0%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },

  claimButton: {
    position: "absolute",
    right: "65px",
    top: "37px",
    cursor: "pointer",
    background: "linear-gradient(270deg, #3d01e2, #32ffff, #3c00e1)",
    backgroundSize: "600% 600%",
    WebkitAnimation: "$gradientmove 1.5s ease infinite",
    animation: "$gradientmove 1.5s ease infinite",
    MozAnimation: "$gradientmove 1.5s ease infinite",

    padding: "2px",
    borderRadius: "33px",

    "& > div": {
      padding: "12.98px 13.98px",
      borderRadius: "33px",
      display: "flex",
      alignItems: "center",
      background: "white",
      "& span": {
        marginLeft: "10px",
        fontSize: "16px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "-0.02em",
        lineHeight: "21px",
        background: "linear-gradient(267.33deg, #AE38FF 5.27%, #875EF7 75.92%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },
  },
}));
