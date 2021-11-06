import { makeStyles } from "@material-ui/core";

export const useManageLoansPageStyles = makeStyles(theme => ({
  root: {
    padding: "40px 48px 48px 80px",
    backgroundImage: `url(${require("assets/pixImages/fractionalise_background.png")})`,
    backgroundRepeat: "inherit",
    backgroundSize: "100% 100%",

    width: "100%",
    height: "100%",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minHeight: "calc(100vh - 80px)",
    maxHeight: "calc(100vh - 80px)",
    overflowX: "hidden",
    position: "relative",
    color: "#431AB7",
    [theme.breakpoints.down("sm")]: {
      padding: "42px 24px 38px",
    },

    [theme.breakpoints.down("xs")]: {
      padding: "22px 16px 24px",
    },

    "& button": {
      height: "auto",
    },
  },
  headerSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    fontSize: 24,
    fontWeight: 800,
    lineHeight: "104.5%",
    fontFamily: "Agrandir",
    [theme.breakpoints.down("xs")]: {},
  },
  balanceSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 44,
    padding: "0px 90px",
  },
  netAPYSection: {
    width: 133,
    height: 133,
    borderRadius: "75px",
    border: "1px solid #9EACF2",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  gradientSection: {
    width: 121,
    height: 121,
    borderRadius: "75px",
    background:
      "conic-gradient(from 204.01deg at 51.24% 49.59%, #EFA941 -0.53deg, #418DFF 54.53deg, #4541FF 119.99deg, #4541FF 157.46deg, #EF41CB 228.75deg, #EF41CB 284.7deg, #EFA941 359.47deg, #418DFF 414.53deg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& > div": {
      width: 111,
      height: 111,
      background: "#fff",
      opacity: 0.8,
      borderRadius: "75px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  slideSection: {
    marginTop: 27,
    marginLeft: 10,
  },
  slider: {
    width: "70%",
  },
  typo1: {
    fontSize: 24,
    fontWeight: 800,
    lineHeight: "104.5%",
    fontFamily: "Agrandir",
  },
  typo2: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: "104.5%",
    fontFamily: "Agrandir",
  },
  typo3: {
    fontSize: 18,
    fontWeight: 800,
    lineHeight: "104.5%",
    fontFamily: "Agrandir",
  },
}));
