import { makeStyles } from "@material-ui/core/styles";

export const priviHomePageStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    overflowY: "auto",
    overflowX: "clip",
    scrollbarWidth: "none",
    height: "calc(100vh)",
    background: "radial-gradient(144.89% 144.89% at 50% -68.53%, #AD00FF 0%, #1F2128 100%), linear-gradient(0deg, #1F2128, #1F2128), linear-gradient(0deg, #F7F8FB, #F7F8FB), #FFFFFF"
  },
  navigationContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: `200px ${theme.spacing(2)}px 0 ${theme.spacing(2)}px`,
    minHeight: "90vh",
    [theme.breakpoints.down("sm")]: {
      paddingTop: "100px !important",
    },
    [theme.breakpoints.down("xs")]: {
      minHeight: "auto",
      paddingBottom: 100,
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
    [theme.breakpoints.down("xs")]: {
      marginTop: 140
    },
  },
  snsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 30,
  },
  snsBox: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    background: "#D9F66F",
    borderRadius: "50%",
    marginRight: theme.spacing(2),
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    "& svg path": {
      fill: "#2D163C",
    }
  },
  titleFollow: {
    fontSize: 24,
    color: "#D9F66F",
    marginTop: 0,
    marginBottom: 0,
    fontWeight: "normal",
    textAlign: "center",
    paddingTop: 16,
    borderTop: "1px dashed #707582",
    [theme.breakpoints.down("xs")]: {
      fontSize: 18
    },
  },
  titleDescription: {
    marginTop: 24,
    fontSize: 33,
    color: '#000000',
    lineHeight: 1.4,
    textAlign: 'center',
    maxWidth: 640,
    "& > span": {
      color: "#D9F66F",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 24,
    },
  },
  titleDescription2: {
    marginTop: 24,
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 400,
    maxWidth: 720,
    "& > span": {
      color: "#D9F66F",
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
    background: "#D9F66F",
    color: "#2D163C",
    height: 53,
    fontWeight: 700,
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  earlyAccess: {
    textTransform: "uppercase",
    padding: '7px 9px 5px 9px',
    borderRadius: 38,
    fontSize: 10,
    fontWeight: 800,
    position: "absolute",
    top: 4,
    right: -12,
  },
  twitterShareContainer: {
    background: 'linear-gradient(180deg, #7074C9 -207.56%, #27292E 53.49%), #202020',
    boxSizing: 'border-box',
    borderRadius: 14,
    padding: '55px 130px 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: 40,
    marginTop: 40,
    "& > span": {
      maxWidth: 480,
      textAlign: 'center',
      fontSize: 18,
      lineHeight: '150%',
      color: '#FFFFFF',
      letterSpacing: 0.8,
      "& > a": {
        color: '#FFFFFF !important',
        fontWeight: 700,
      }
    },
  },
  twitterShareButton: {
    width: 250,
    height: 44,
    background: '#D9F66F',
    borderRadius: 8,
    display: 'flex',
    columnGap: 12,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: '150%',
    color: '#2D163C',
    "& > svg path": {
      fill: '#2D163C'
    }
  },
  title2: {
    fontSize: "25px",
    fontWeight: 400,
  },
  pixLogo: {
    marginTop: 32,
    [theme.breakpoints.down("xs")]: {
      width: 320
    },
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
