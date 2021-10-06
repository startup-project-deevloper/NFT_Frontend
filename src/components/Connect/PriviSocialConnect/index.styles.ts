import { makeStyles } from "@material-ui/core/styles";

export const priviSocialConnectPageStyles = makeStyles(theme => ({
  logo: {
    position: 'absolute',
    width: 132,
    top: 41,
    left: 44,
    [theme.breakpoints.down("sm")]: {
      display: 'none',
    },
  },
  container: {
    width: "100%",
    overflowY: "auto",
    overflowX: "clip",
    scrollbarWidth: "none",
    height: "calc(100vh)",
  },
  navigationContainer: {
    background: "radial-gradient(119.68% 156.16% at 50% -70.4%, #5FFF0A 0%, #C7FFA9 54.52%, rgba(255, 254, 253, 0) 100%)",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: `80px ${theme.spacing(6)}px 0 ${theme.spacing(6)}px`,
    minHeight: "90vh",
    [theme.breakpoints.down("sm")]: {
      paddingTop: 100,
    },
    [theme.breakpoints.down("xs")]: {
      minHeight: "auto",
      paddingBottom: 100,
    }
  },
  gradient: {
    marginTop: 100,
    "& > img": {
      width: '90%',
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: 50,
      marginBottom: 30
    },
  },
  header1: {
    fontSize: "12px",
  },
  titleContainer: {
    position: "relative",
  },
  snsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
    marginBottom: 200,
    [theme.breakpoints.down("xs")]: {
      marginBottom: 100,
    },
  },
  snsBox: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    background: "#66FF0A",
    borderRadius: "50%",
    marginRight: theme.spacing(2),
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    "& svg path": {
      fill: "#000000",
    },
    [theme.breakpoints.down("xs")]: {
      marginRight: theme.spacing(1),
    },
    "&:last-child": {
      marginRight: 0,
    }
  },
  titleLogo: {
    [theme.breakpoints.down("xs")]: {
      width: 250,
    },
  },
  titleFollow: {
    fontSize: 24,
    fontWeight: 400,
    color: "#53D700",
    marginTop: 40,
    textAlign: "center",
    paddingTop: 16,
    borderTop: "1px dashed #4218B5",
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
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
      color: "#53D700",
    },
    [theme.breakpoints.down("sm")]: {
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
      color: "#53D700",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 18
    },
  },
  btnConnectContainer: {
    marginTop: 40,
    marginBottom: 40,
    display: "flex",
    justifyContent: "center",
  },
  btnConnect: {
    background: '#66FF0A',
    color: "#181818",
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
    padding: '7px 9px 5px 9px',
    borderRadius: 38,
    fontSize: 10,
    fontWeight: 800,
    position: "absolute",
    top: -32,
    right: -54,
  },
  twitterShareContainer: {
    background: '#F3F8EF',
    border: '1px solid rgba(158, 172, 242, 0.7)',
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
    [theme.breakpoints.down("xs")]: {
      padding: '55px 15px 40px',
      "& > span": {
        fontSize: 16,
      }
    },
  },
  twitterShareButton: {
    height: 48,
    padding: '12px 55px',
    background: '#181818',
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
    },
    [theme.breakpoints.down("xs")]: {
      padding: '12px 30px',
    },
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
  mainContainer: {
    [theme.breakpoints.down("sm")]: {
      marginTop: 20,
    }
  },
  '@media (max-width: 780px)' : {
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
    btnConnectContainer: {
      marginBottom: 0,
    }
  }
}));
