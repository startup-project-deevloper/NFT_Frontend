import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/ui-kit";

export const syntheticFractionalisedTradeJotPageStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    padding: "30px",
    [theme.breakpoints.down("sm")]: {
      padding: "0",
      paddingBottom: "30px",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#431AB7",
  },
  outBox: {
    width: "100%",
    background: "#FFFFFF",
    border: "1px solid #9EACF2",
    boxSizing: "border-box",
    borderRadius: "20px",
    marginBottom: "10px",
  },
  boxBody: {
    margin: "50px 50px",
    [theme.breakpoints.down("sm")]: {
      margin: "20px",
    },
  },
  infoWrap: {
    paddingBottom: "20px",
    width: "100%",
  },
  leftJots: {
    display: "flex",
    flexDirection: "column",
    background: "#DDFF57",
    boxShadow: "0px 25px 36px -11px rgba(0, 0, 0, 0.02)",
    borderRadius: 20,
    padding: "114px 44px",
    maxWidth: 368,
  },
  jotWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  jotLabel: {
    color: "#9EACF2",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  jotDivider: {
    margin: "20px 0",
  },
  jotTitle: {
    color: "#431AB7",
    fontFamily: "Agrandir GrandHeavy",
    fontSize: 19,
    marginBottom: 5,
    fontWeight: 800,
  },
  jotPercent: {
    background: "rgba(0, 209, 59, 0.09)",
    borderRadius: 15,
    padding: "4px 10px",
    color: "#00D13B",
    fontSize: 16,
    width: "fit-content",
    marginBottom: 5,
  },
  editWrap: {
    padding: "20px 0",
    display: "flex",
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      paddingBottom: "40px",
    },
  },
  leftLiquidity: {
    // paddingRight: "20px",
  },
  inputLiquidity: {
    margin: "20px 0",
    background: "rgba(144, 155, 255, 0.16)",
    border: "1px solid #431AB7",
    width: "100%",
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
  },
  vertLine: {
    width: "0px",
    border: "1px solid #D6D9F7",
    margin: "0 20px",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  rightBalance: {
    // paddingLeft: "20px",
    // paddingRight: theme.spacing(20),
    [theme.breakpoints.down("sm")]: {
      paddingTop: "40px",
    },
  },
  usdWrap: {
    display: "flex",
    alignItems: "center",
    paddingTop: "10px",
    [theme.breakpoints.down("sm")]: {
      paddingTop: "0",
    },
  },
  point: {
    background: "#D9F66F",
    width: "24px",
    height: "24px",
    borderRadius: "12px",
  },

  rightChart: {
    width: "100%",
    height: "100%",
    padding: "30px 45px",
    [theme.breakpoints.down("sm")]: {
      padding: "20px 15px",
    },
    borderRadius: theme.spacing(2),
    boxShadow: "0px 3.40102px 6.80203px #9EACF2",
    background: Color.Purple,
  },

  purpleText: {
    cursor: "pointer",
    color: "#431AB7",
    fontSize: "12px",
    minWidth: "55px",
  },

  botRow: {
    padding: "20px 0",
  },
  infoItem: {
    [theme.breakpoints.down("sm")]: {
      padding: "10px 0",
    },
  },
  swapIcon: {
    marginLeft: 25,
    marginRight: 25,
  },

  h1: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "38px",
    lineHeight: "104.5%",
  },
  h2: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "24px",
    lineHeight: "104.5%",
  },
  h3: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "29px",
    lineHeight: "104.5%",
  },
  h4: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "24px",
    lineHeight: "150%",
  },
  h5: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "18px",
    lineHeight: "120%",
  },
  h6: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "120%",
  },

  graphBox: {
    overflow: "hidden",
    background: Color.White,
    boxShadow: "0px 25px 36px -11px rgba(0, 0, 0, 0.02)",
    borderRadius: 20,
    padding: `${theme.spacing(3.5)}px ${theme.spacing(5)}px`,
    margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
  },
  controlParentBox: {
    [theme.breakpoints.down("sm")]: {
      alignItems: "flex-start",
    },
    width: "100%",
  },
  unitsBox: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "flex-end",
    },
  },
  unitButton: {
    display: "flex",
    alignItems: "center",
    background: "#181F3D",
    color: "#fff",
    borderRadius: "100vh",
    padding: "5px 8px",
    [theme.breakpoints.down("xs")]: {
      marginTop: theme.spacing(1),
    },
    "& button": {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  switchButton: {
    background: "transparent",
    border: "none",
    borderRadius: "100vh",
    fontSize: 14,
    color: Color.White,
    padding: "8px 16px",
    "& + &": {
      marginLeft: 4,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
    },
  },
  activeSwitchButton: {
    background: "rgba(221, 255, 87, 1)",
    color: "#181818",
  },

  periodBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "flex-end",
    },
  },
  periodButton: {
    display: "flex",
    alignItems: "center",
    background: "rgba(157, 141, 203, 0.33)",
    color: "#F0F5F8",
    borderRadius: 8,
    // marginLeft: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      marginTop: theme.spacing(1),
    },
    "& button": {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  groupButton: {
    background: "transparent",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    color: Color.GrayDark,
    padding: "8px 16px",
    "& + &": {
      marginLeft: 4,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
    },
  },
  selectedGroupButton: {
    background: "rgba(221, 255, 87, 1)",
    color: "#181818",
  },
  graphTitle: {
    fontSize: 22,
    fontWeight: 400,
    color: "#FFF",
    margin: 0,
  },
  graphDesc: {
    fontSize: 12,
    fontWeight: 400,
    color: "#FFF",
    margin: 0,
  },
  noData: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    color: "#431AB7",
    margin: "auto",

    "& img": {
      width: "100%",
      height: "100%",
      maxWidth: 430,
      marginBottom: 35,
    },

    [theme.breakpoints.down("sm")]: {
      fontSize: 18,
    },
  }
}));
