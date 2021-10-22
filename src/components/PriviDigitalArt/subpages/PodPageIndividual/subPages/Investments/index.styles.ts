import { makeStyles } from "@material-ui/core";
import { Color, Gradient } from "shared/ui-kit";

export const investmentStyles = makeStyles(theme => ({
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  shadowBox: {
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    background: Gradient.Green1,
    boxShadow: `0px 2px 14px rgba(0, 0, 0, 0.08)`,
    margin: theme.spacing(1),
    "& *": {
      color: "white !important",
    },
  },
  topHeaderLabel: {
    background: `linear-gradient(270.47deg, #D66DB2 -3.25%, #BB34D1 93.45%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  whiteBox: {
    borderRadius: 16,
    background: "rgba(158, 172, 242, 0.16)",
    padding: "40px 34px 25px",
    [theme.breakpoints.down(680)]: {
      padding: "40px 12px 25px",
    },
  },
  whiteBoxPriceItem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderRight: "1px solid #18181822",
  },
  whiteBoxFundsItem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRight: "1px solid #18181822",
    [theme.breakpoints.down("xs")]: {
      borderRight: "unset",
    },
  },
  whiteBoxPaddingItem: {
    padding: "0px 24px 0px 64px",
    [theme.breakpoints.down(780)]: {
      padding: "0px 24px",
    },
    [theme.breakpoints.down(680)]: {
      padding: "0px 12px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "0px 12px",
      marginTop: 12,
      paddingTop: 19,
      borderTop: "1px solid #18181822",
      paddingBottom: 21,
      borderBottom: "1px solid #18181822",
    },
  },
  title: {
    fontSize: "22px",
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "130%",
    color: Color.Purple,
  },
  header1: {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "18px",
    color: "#081831",
  },
  header2: {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "120%",
    color: "#707582",
    textShadow: "2px 2px 12px rgba(0, 0, 0, 0.1)",
    [theme.breakpoints.down("xs")]: {
      fontSize: '14px',
      fontWeight: 400
    },
  },
  header3: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "18px",
    lineHeight: "120%",
    color: "#081831",
    textShadow: "2px 2px 12px rgba(0, 0, 0, 0.1)",
  },
  flexBoxHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
  },
  amountPaid: {
    marginLeft: 80,
    
    [theme.breakpoints.down("sm")]: {
      marginLeft: 24,
    },
  },
  greenBox: {
    display: "flex",
    alignItems: "center",
    background: Color.Violet,
    padding: "19px 16px",
    borderRadius: "12px",
    marginTop: 25,
    color: Color.White,
    [theme.breakpoints.down("sm")]: {
      flexDirection: 'column'
    },
    [theme.breakpoints.down("xs")]: {
      flexDirection: 'column'
    },
  },
  greenboxButton: {
    background: `${Color.GreenLight} !important`,
    color: `${Color.Purple} !important` ,
    border: "none !important",
    marginTop: 0,
    borderRadius: "4px !important",
    fontSize: "14px !important",
    lineHeight: "18px !important",
    padding: "0 48px !important",

    [theme.breakpoints.down("md")]: {
      padding: "0 21px !important",
    },

    [theme.breakpoints.down("xs")]: {
      marginTop: 13
    },
  },
  timeBox: {
    display: "flex",
    alignItems: "center",
    background: Color.Violet,
    padding: theme.spacing(1),
    borderRadius: "12px",
    color: Color.White,
    [theme.breakpoints.down("xs")]: {
      fontSize: 12
    },
  },
  graphBox: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2.5),
    border: `1px solid #E0E4F3`,
    borderRadius: "12px",
    margin: theme.spacing(1),
    position: "relative",
    background: "white",
  },
  valueBox: {
    position: "absolute",
    left: "60px",
    top: "70px",
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    boxShadow: `2px 2px 12px rgba(0, 0, 0, 0.1)`,
    background: "white",
  },
  graphHeader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  select: {
    "& > div": {
      paddingBottom: "11px",
      minWidth: "120px",
    },
  },
  colorBox: {
    width: theme.spacing(0.5),
    height: theme.spacing(4.5),
    borderRadius: "2px",
  },
  circle: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    marginRight: "8px",
  },
  externalLink: {
    verticalAlign: "middle",
  },

  tableContainer: {
    "& > div": {
      borderRadius: "16px",
      boxShadow: "none",
    },

    "& *": {
      fontFamily: "Montserrat !important",
    },

    "& tr": {
      "& th:first-child": {
        borderTopLeftRadius: "16px",
      },

      "& th:last-child": {
        borderTopRightRadius: "16px",
      },
    },

    "& tr:last-child": {
      "& td:first-child": {
        borderBottomLeftRadius: "16px",
      },

      "& td:last-child": {
        borderBottomRightRadius: "16px",
      },
    },
  },

  barContainer: {
    background: Color.Violet,
    height: 3,
    borderRadius: "20px",
    width: "100%",
    "& > div": {
      background: Color.Purple,
      height: 3,
      borderRadius: "20px",
    },
  },

  divider: {
    height: 40,
    opacity: 0.1,
    background: "#181818",
    width: "1px",
  },
}));
