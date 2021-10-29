import { makeStyles } from "@material-ui/core/styles";
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
    padding: "27px",
    height: "100%",
    justifyContent: "center",
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
    [theme.breakpoints.down("sm")]: {
      padding: 0,
      "& canvas": {
        width: "100%",
      },
    },
  },
  controlParentBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "30px 40px",
    [theme.breakpoints.down("sm")]: {
      alignItems: "flex-start",
    },
    [theme.breakpoints.down("xs")]: {
      padding: 12,
      flexDirection: "column-reverse",
    },
    width: "100%",
  },
  controlBox: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "flex-end",
      width: "100%",
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
      marginBottom: theme.spacing(1),
      marginLeft: "auto",
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

  botRow1: {
    padding: "0 20px 30px 50px",
    borderBottom: "1px solid #9EACF224",

    [theme.breakpoints.down("xs")]: {
      padding: "0 20px 30px 30px",
      border: "none"
    },
  },

  botRow2: {
    padding: "35px 20px 30px 50px",

    [theme.breakpoints.down("xs")]: {
      padding: "0 20px 30px 30px",
    },
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
    lineHeight: "24px",
  },
  h2: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "22px",
    lineHeight: "104.5%",
  },
  sectionTitle: {
    fontFamily: "Agrandir GrandHeavy",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "24px",
    lineHeight: "104.5%",
    padding: "35px 50px",
    [theme.breakpoints.down("sm")]: {
      fontSize: 20,
      padding: "25px 32px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
      padding: "30px 16",
    },
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
  exploreButton: {
    [theme.breakpoints.down("sm")]: {
      minWidth: "76px !important",
    },
    [theme.breakpoints.down("xs")]: {
      minWidth: "48px !important",
    },
  },
  userField: {
    columnGap: 12,
    [theme.breakpoints.down("sm")]: {
      columnGap: 8,
      "& > span": {
        fontSize: "12px !important",
      },
    },
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      rowGap: 4,
      columnGap: 4,
      "& > span": {
        fontSize: "10px !important",
      },
    },
  },
  table: {
    marginTop: 24,
    minHeight: 400,
    "& .MuiTableCell-root": {
      fontFamily: "Agrandir",
      padding: "9px 16px",
      [theme.breakpoints.down("sm")]: {
        padding: "8px 12px",
      },
      [theme.breakpoints.down("xs")]: {
        padding: "8px",
      },
    },
    "& .MuiTableRow-head": {
      background: Color.White,
      color: "#431AB7",
      "& .MuiTableCell-head": {
        border: "none",
        fontSize: 18,
        fontWeight: "bold",
        color: "rgb(67, 26, 183)",
        [theme.breakpoints.down("sm")]: {
          fontSize: 14,
        },
        [theme.breakpoints.down("xs")]: {
          fontSize: 12,
        },
      },
    },
    "& .MuiTableRow-root": {
      "& .MuiTableCell-body": {
        fontSize: 14,
        [theme.breakpoints.down("sm")]: {
          fontSize: 12,
        },
        [theme.breakpoints.down("xs")]: {
          fontSize: 9,
        },
      },
    },
    [theme.breakpoints.down("sm")]: {
      minHeight: 200,
    },
  },
  secondaryButton: {
    color: `${Color.Purple} !important`,
    width: "100% !important",
    height: "60px !important",
    border: "2px solid #9EACF2 !important",
    flex: "0.3",

    [theme.breakpoints.down("xs")]: {
      flex: "0.45",
    },
  },
  primaryButton: {
    background: `${Color.Purple} !important`,
    width: "100% !important",
    height: "60px !important",
    flex: "0.6",

    [theme.breakpoints.down("xs")]: {
      flex: "0.45",
    },
  }
}));
