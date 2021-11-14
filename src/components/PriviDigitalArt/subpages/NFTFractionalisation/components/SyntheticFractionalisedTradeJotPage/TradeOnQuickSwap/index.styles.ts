import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/ui-kit";

export const TradeOnQuickSwapStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
    overflowY: "auto",
    minHeight: "calc(100vh - 80px)",
    maxHeight: "calc(100vh - 80px)",
    background: "#F5F7FA",
  },
  backButtonContainer: {
    width: "100%",
    margin: "50px 0 30px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      margin: "50px 0 70px 0",
    },
    [theme.breakpoints.down("sm")]: {
      margin: "50px 0 50px 0",
    },
  },
  tabContainer: {
    marginBottom : "80px",
    width : '320px',
    height: "40px",
    background: '#FFFFFF',
    border: '1px solid #9EACF2',
    boxSizing: 'border-box',
    borderRadius: '77px',
    color: '#431AB7',
    fontFamily: 'Agrandir',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '14px',
    lineHeight: '23px',
    cursor:'pointer'
  },
  selectedTabSection: {
    background: '#431AB7',
    borderRadius: '77px',
    color: '#FFFFFF',
    
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    height: '40px'
  },
  liquidityBox: {
    textAlign: 'center',
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '20px',
    lineHeight: '120%',
    color: '#1A1B1C',
    mixBlendMode: 'normal',
    marginBottom: '24px',
  },
  backBtn: {
    position: "absolute",
    top: 10,
    left: 80,
    [theme.breakpoints.down("sm")]: {
      top: -20,
      left: 40,
    },
    [theme.breakpoints.down("xs")]: {
      top: -35,
      left: 25,
      fontSize: 14,
    },
  },
  title: {
    fontWeight: 800,
    fontSize: 21,
    display: "flex",
    alignItems: "center",
    color: "#1A1B1C",
    "& span": {
      color: "#431AB7",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
    },
  },
  swapIcon: {
    marginLeft: 25,
    marginRight: 25,
  },

  swapBox: {
    width: 530,
    background: "#fff",
    boxShadow: "0px 15px 27px rgba(99, 99, 99, 0.13)",
    borderRadius: "45px",
    padding: "30px",
    fontSize: 14,
    color: "#1A1B1C",
    [theme.breakpoints.down("xs")]: {
      width: 343,
      padding: "20px"
    },
  },
  nameRow: {
    fontSize: 14,
    lineHeight: "120%",
    color: "#575A68",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  valueRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 24,
    lineHeight: "120%",
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
    },
  },
  priceRow: {
    fontSize: 14,
    lineHeight: "120%",
    color: "#1A1B1C",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },

  swapBtn: {
    width: "100%",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#4991F1",
    borderRadius: "14px",
    marginTop: "30px",
    color: "#fff",
    fontSize: 18,
    cursor: "pointer",
    "&:hover": {
      background: "#431AB7",
    },
    [theme.breakpoints.down("xs")]: {
      height: 43,
    },
  },

  disable: {
    width: "100%",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#4991F1CC",
    borderRadius: "14px",
    marginTop: "30px",
    color: "#fff",
    fontSize: 18,
    cursor: "pointer",
    [theme.breakpoints.down("xs")]: {
      height: 43,
    },
  },

  token: {
    background: "transparent !important",
    border: "none !important",
    padding: "8px 16px 8px 16px !important",
    color: "#1A1B1C !important"
  },
  inputBox: {
    display: "flex",
    alignItems: "center",
    background: "white",
    // border: "none",
    // borderRadius: 16,
    // height: 50,
    // paddingLeft: 16,
    // paddingRight: 16,
    "& img": {
      marginRight: 8,
    },
    "& input": {
      flex: 1,
      fontSize: 14,
      color: "#A4A4A4",
      background: "transparent",
      border: "none",
      outline: "none",
    }
  },
  jotLogo: {
    width: 40,
    height: 40,
    borderRadius: "50%",
  }
}));
