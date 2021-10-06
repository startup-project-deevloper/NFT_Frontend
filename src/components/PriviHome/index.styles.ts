import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/constants/const";

export const priviHomePageStyles = makeStyles(theme => ({
  container: {
    height: `calc(100vh)`,
  },
  subContainer: {
    width: "100%",
    overflowY: "auto",
    scrollbarWidth: "none",
    height: "calc(100vh)",
  },
  navigationContainer: {
    background: `url(${require("assets/backgrounds/Gradient_BG_Frame.jpg")})`,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
    backgroundSize: "100% 100%",
    padding: '0 50px'
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
      }
    }
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  header1: {
    fontSize: "12px",
  },
  titleContainer: {
    marginTop: 200,
    position: "relative",
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
    marginBottom: 300,
  },
  snsBox: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    background: "#4218B5",
    borderRadius: "50%",
    marginRight: theme.spacing(2),
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    "& svg path": {
      fill: "#fff",
    }
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
    color: "#4218B5",
    marginTop: 0,
    marginBottom: 40,
    fontWeight: "normal",
    textAlign: "center",
    paddingTop: 16,
    borderTop: "1px dashed #4218B5",
  },
  titleDescription: {
    marginTop: 15,
    fontSize: 24,
    color: '#000000',
    textAlign: 'center',
    "& > span": {
      color: "#4218B5",
    },
    "& h2": {
      fontSize: 33,
      color: "#000000",
      marginTop: 0,
      marginBottom: 40,
      fontWeight: "normal",
      textAlign: "center",
    },
    "& h3": {
      fontSize: 24,
      color: "#4218B5",
      marginTop: 0,
      marginBottom: 40,
      fontWeight: "normal",
      textAlign: "center",
    },
    "& h4": {
      fontSize: 25,
      color: "#000000",
      marginTop: 0,
      marginBottom: 40,
      fontWeight: "normal",
      textAlign: "center",
    }
  },
  btnConnectContainer: {
    marginBottom: 300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnConnect: {
    background: Color.Black,
    color: Color.White,
    height: 60,
    padding: "23px 60px",
    maxWidth: 300,
    fontSize: 18,
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
    fontWeight: 800,
    background: "linear-gradient(0deg, #7B52EB, #7B52EB), linear-gradient(106.63deg, #9067FF 38.5%, #4319B6 160.38%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    padding: 7,
    border: "3px dashed rgba(123, 82, 235, 1)",
    borderRadius: 25,
    fontSize: 10,
    position: "absolute",
    top: 0,
    right: 80,
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
    background: '#F3EFFF',
    border: '1px solid #DDD1FF',
    boxSizing: 'border-box',
    borderRadius: 20,
    padding: '55px 130px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 40,
    marginTop: 40,
    marginBottom: 250,
    "& > span": {
      maxWidth: 480,
      textAlign: 'center',
      fontSize: 18,
      lineHeight: '150%',
      color: '#4218B5',
      letterSpacing: 0.8,
      "& > a": {
        color: '#4218B5 !important',
        fontWeight: 700,
      }
    }
  },
  twitterShareButton: {
    width: 250,
    height: 44,
    background: 'linear-gradient(97.73deg, #9067FF -7.88%, #4319B6 99.43%), #4218B5',
    borderRadius: 86,
    display: 'flex',
    columnGap: 12,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: '150%',
    color: '#FFFFFF',
    "& > svg path": {
      fill: '#FFFFFF'
    }
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
  navIconBox: {
    borderRadius: theme.spacing(3),
    boxShadow: "0px 10px 21px -9px rgba(89, 81, 143, 0.28)",
    background: "white",
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,

    "& div": {
      cursor: "pointer",
    },
  },
  '@media (max-width: 780px)' : {
    titleContainer: {
      marginTop: 20,
    },
    earlyAccess: {
      right: 20,
    },
  }
}));
