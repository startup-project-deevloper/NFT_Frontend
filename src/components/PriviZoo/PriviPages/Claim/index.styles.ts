import { makeStyles } from "@material-ui/core";

export const useClaimStyles = makeStyles(theme => ({
  container: {
    overflowX: "hidden",
    width: "100%",
    overflowY: "auto",
    scrollbarWidth: "none",
    height: "calc(100vh)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background: "linear-gradient(0deg, #F7F8FB, #F7F8FB)",
  },
  gradientFrame: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  navigationContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
    backgroundSize: "cover",
    position: "relative",
  },
  logo: {
    position: "absolute",
    top: 30,
    left: 48,
    width: 56,
    cursor: "pointer",
  },
  backLogo: {
    width: "170px",
    height: "170px",
    right: "5%",
    top: "95.32px",
    position: "absolute",
    backgroundBlendMode: "color-dodge, normal",
    [theme.breakpoints.down("sm")]: {
      width: "170px",
      height: "170px",
      top: theme.spacing(6),
      right: "-50px",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100px",
      height: "100px",
      top: theme.spacing(6),
      right: "-40px",
    },
  },
  backLogo2: {
    width: "154.04px",
    height: "154.04px",
    left: "5%",
    top: "255.92px",
    position: "absolute",
    backgroundBlendMode: "color-dodge, normal",
    [theme.breakpoints.down("sm")]: {
      width: "100px",
      height: "100px",
      left: "-40px",
      top: "200px",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100px",
      height: "100px",
      left: "-40px",
      top: "280px",
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

  title: {
    color: "#181818",
    fontSize: "32px",
    lineHeight: "104.5%",
    fontWeight: 800,
    fontFamily: "Agrandir GrandHeavy",
  },
  title2: {
    color: "#181818",
    fontSize: "22px",
    lineHeight: "104.5%",
    fontWeight: "bold",
    fontFamily: "Agrandir GrandHeavy",
  },
  contentContainer: {
    zIndex: 1,
    marginTop: "107px",
    padding: "34px 18% 106px",
    width: "100%",
    [theme.breakpoints.down(1150)]: {
      padding: "32px 80px 130px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "32px 40px 130px",
    },
    [theme.breakpoints.down(770)]: {
      padding: "24px 13px 50px",
    },
    [theme.breakpoints.down('xs')]: {
      padding: "24px 8px 50px",
    },
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    padding: "50px 38px 64px",
    background: "#FFFFFF",
    border: "1px solid #CFCFCF",
    boxSizing: "border-box",
    boxShadow: "0px 11px 14px rgba(91, 66, 121, 0.11)",
    borderRadius: "20px",
    [theme.breakpoints.down(770)]: {
      padding: "40px 20px 32px",
    },
    [theme.breakpoints.down('xs')]: {
      padding: "20px 12px 28px",
    },
  },

  topImageContainer: {
    background: "#f48b3e33",
    width: "77px",
    height: "77px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",

    "& > img": {
      "&:last-child:not(:first-child)": {
        position: "absolute",
        width: "23px",
        top: 0,
        right: 0,
      },

      "&:first-child": {
        height: "39.28px",
        width: "43.98px",
      },
    },

    "& svg": {
      height: "36.85px",
      width: "36.85px",
    },
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
    position: "relative",

    "& .MuiInput-root": {
      paddingRight: 40,
    },

    "& .file-attachment": {
      position: "absolute",
      right: 0,
    },
  },
  grayBox: {
    padding: "36px 36px 40px 16px",
    background: "#F6F7FA",
    display: "flex",
    flexDirection: "row",
    width: "100%",
    borderRadius: "20px",
    fontSize: "18px",
    color: "#181818",
    [theme.breakpoints.down(770)]: {
      flexDirection: "column",
      marginTop: 16,
      padding: "30px 30px 30px 16px",
    },
    [theme.breakpoints.down(500)]: {
      flexDirection: "column",
      marginTop: 16,
      padding: "30px 30px 30px 0px",
    },
  },
  description: {
    color: "#222145",
    fontSize: "20px",
    lineHeight: "164%",
    textAlign: "center",
  },
  button: {
    display: "flex",
    maxWidth: "80%",
    minWidth: "fit-content",
    justifyContent: "center",
    alignItems: "center",
    padding: "8px 26px",
    width: "289px",
    background: "#181818",
    borderRadius: "10px",
    color: "white",
    fontFamily: "Agrandir",
    fontWeight: "bold",
    fontSize: "16px",
    lineHeight: "21px",
    "&:disabled": {
      background: "#D7D7D7",
    },
  },
  status: {
    marginTop: "14.5px",
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
  },
  scanAddress: {
    color: "#4218B5",
    marginLeft: 4,
    textDecoration: "none",
    [theme.breakpoints.down(560)]: {
      fontSize: 16
    },
    [theme.breakpoints.down(500)]: {
      fontSize: 14
    },
    [theme.breakpoints.down(440)]: {
      fontSize: 12
    },
  },
}));
