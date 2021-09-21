import { makeStyles } from "@material-ui/core";
import { Color, FontSize } from "shared/ui-kit";

export const SyntheticFractionalisedJotPoolsPageStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    // padding: "30px",
    // [theme.breakpoints.down("sm")]: {
    //   padding: "0",
    // },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#431AB7",
  },
  addButtonWrapper: {
    width: "100%",
    marginTop: "25px",
    borderRadius: "20px",
  },
  outBox: {
    width: "100%",
    background: "#FFFFFF",
    border: "1px solid #9EACF2",
    boxSizing: "border-box",
    borderRadius: "20px",
    marginBottom: "10px",
    "& .MuiTableContainer-root": {
      boxShadow: "none",
    },
    "& .MuiTableCell-head": {
      fontSize: 18,
    },
    "& .MuiTableCell-root": {
      borderBottom: "none",
      borderTop: "1px solid rgba(224, 224, 224, 1)",
    },
  },
  boxBody: {
    margin: "50px 50px",
    [theme.breakpoints.down("sm")]: {
      margin: "20px",
    },
  },
  infoWrap: {
    // paddingBottom: "20px",
  },
  leftJots: {
    display: "flex",
    flexDirection: "column",
    background: "#DDFF57",
    boxShadow: "0px 25px 36px -11px rgba(0, 0, 0, 0.02)",
    borderRadius: 20,
    padding: "27px 27px 0 27px",
  },
  editWrap: {
    padding: "20px 0",
    display: "flex",
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      paddingBottom: "40px",
    },
  },

  hWrap1: {
    paddingBottom: 30,
  },
  hWrap2: {
    padding: "20px 0",
  },

  rightChart: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    padding: "5px",
    borderRadius: theme.spacing(2),
    boxShadow: "0px 3.40102px 6.80203px #9EACF2",
    background: Color.Purple,
  },
  chartWrapper: {
    padding: "30px 20px 30px 20px",
  },
  controlParentBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "30px 40px",
    [theme.breakpoints.down("sm")]: {
      alignItems: "flex-start",
    },
    width: "100%",
  },
  controlBox: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "flex-end",
    },
  },
  liquidityBox: {
    display: "flex",
    alignItems: "center",
    background: "rgba(157, 141, 203, 0.33)",
    color: "#F0F5F8",
    borderRadius: 8,
    marginLeft: theme.spacing(1),
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

  botRow: {
    padding: "20px 0",
  },
  infoItem: {
    [theme.breakpoints.down("sm")]: {
      padding: "10px 0",
    },
  },

  h1: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "18px",
    lineHeight: "104.5%",
  },
  h2: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "22px",
    lineHeight: "104.5%",
  },
  sectionTitle: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "24px",
    lineHeight: "104.5%",
  },
  h3: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "24px",
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
    fontSize: "14px",
    lineHeight: "120%",
  },
  h6: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "120%",
  },

  table: {
    marginTop: 24,
    minHeight: 400,
    "& .MuiTableCell-root": {
      fontFamily: "Agrandir",
    },
    "& .MuiTableRow-head": {
      background: Color.White,
      color: "#431AB7",
      "& .MuiTableCell-head": {
        border: "none",
        fontSize: 18,
        fontWeight: "bold",
        color: "rgb(67, 26, 183)",
      },
    },

    [theme.breakpoints.down("sm")]: {
      minHeight: 200,
    },
  },
}));
