import { makeStyles } from "@material-ui/core";

export const priviSocialConnectPageStyles = makeStyles(theme => ({
  logo: {
    position: 'absolute',
    width: 132,
    top: 41,
    left: 44,
    [theme.breakpoints.down("sm")]: {
      display: "none",
    }
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    left: 0,
    top: 0,
    zIndex: -1,
  },
  backgroundLogo: {
    position: 'absolute',
    transform: 'translate(-50%, 0)',
    left: 'calc(50% - 30px)',
    top: 0,
    zIndex: -1,
  },
  container: {
    width: "100%",
    overflowY: "auto",
    overflowX: "clip",
    scrollbarWidth: "none",
    height: "calc(100vh)",
  },
  navigationContainer: {
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
    position: "relative",
    "& > img": {
      width: 220,
      height: 56,
    }
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
    marginTop: 0,
    marginBottom: 200,
    [theme.breakpoints.down("xs")]: {
      marginBottom: 100
    },
  },
  snsBox: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    background: "#FF8E3C",
    borderRadius: "50%",
    marginRight: theme.spacing(2),
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    "& svg path": {
      fill: "#FFFFFF",
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
    fontWeight: 400,
    color: "#FF8E3C",
    marginTop: 0,
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
    fontWeight: 400,
    color: '#000000',
    lineHeight: '140%',
    textAlign: 'center',
    maxWidth: 810,
    padding: '0px 53px',
    "& > span": {
      color: "#FF8E3C",
    },
    [theme.breakpoints.down("xs")]: {
      padding: '0px 24px',
      fontSize: 24,
    },
  },
  titleDescription2: {
    marginTop: 20,
    fontSize: 24,
    color: '#222145',
    textAlign: 'center',
    fontWeight: 400,
    maxWidth: 720,
    "& > span": {
      color: "#FF8E3C",
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
    background: 'linear-gradient(0deg, #FF8E3C, #FF8E3C), linear-gradient(45.49deg, #8F66FF -18.05%, #4218B5 113.67%), #54658F',
    color: '#FFFFFF',
    height: 48,
    fontSize: 18,
    fontWeight: 700,
    borderRadius: 55,
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
    top: -32,
    right: -54,
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
    background: '#FFF0DA',
    border: '1px solid rgba(242, 188, 158, 0.7)',
    boxSizing: 'border-box',
    borderRadius: 20,
    padding: '56px 115px 43px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: 40,
    marginTop: 40,
    "& > span": {
      maxWidth: 480,
      textAlign: 'center',
      lineHeight: '150%',
      color: '#181818',
      letterSpacing: 0.8,
      fontSize: 18,
      fontWeight: 500,
      "& > a": {
        color: '#181818 !important',
        fontWeight: 700,
      }
    },
  },
  twitterShareButton: {
    height: 48,
    padding: '12px 55px',
    background: '#FF8E3C',
    borderRadius: 41,
    display: 'flex',
    columnGap: 12,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 700,
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
  backButton: {
    fontSize: "16px",
    color: "#707582",
    fontWeight: 700,
  },
  backBox: {
    top: 105,
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
  '@media (max-width: 780px)': {
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
  }
}));
