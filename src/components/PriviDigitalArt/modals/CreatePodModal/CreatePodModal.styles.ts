import { makeStyles } from "@material-ui/core";

export const createPodModalStyles = makeStyles(theme => ({
  root: {},
  headerCreatePod: {
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "130%",
    color: "#181818",
    marginBottom: "35px",
    textAlign: "center",
    "& span": {
      color: "#7F6FFF",
      marginLeft: "10px",
    },
  },
  warningScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: '0px 32px',
    "& img:first-child": {
      marginTop: 20,
    },
    "& h3": {
      marginTop: 24,
      marginBottom: 24,
      fontStyle: "normal",
      fontWeight: 800,
      fontSize: 14,
      textAlign: "center",
      color: "#181818",
    },
    "& p": {
      fontStyle: "normal",
      fontSize: 14,
      fontWeight: 400,
      lineHeight: "120%",
      textAlign: "center",
      color: "rgba(24, 24, 24, 70%)",
      marginTop: 0,
      marginBottom: "24px",
      width: "80%",
    },
    "& path:first-child": {
      fill: "#FF8E3C",
    },
    "& path:nth-child(2)": {
      stroke: "#FF8E3C",
    },
    "& button": {
      width: "80%"
    },
  },
  warningContainer: {
    background: "rgba(231, 218, 175, 0.3)",
    borderRadius: "49px",
    height: "39px",
    width: "39px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
  },
  cardsOptions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "48px",
    padding: "0 16px",
    alignSelf: "center",
    marginBottom: 40,
    border: "2px solid #EBEBEB",
    borderRadius: "24px",
    width: "80%",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginTop: 20,
    }
  },

  tabHeaderPodMedia: {
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 13,
    fontFamily: "Montserrat",
    cursor: "pointer",
    color: "#A4A4A4",
    "&:last-child": {
      marginRight: 0,
    },
  },
  tabHeaderPodMediaSelected: {
    color: "#431AB7",
  },
  tooltipHeaderInfo: {
    width: 14,
    height: 14,
    margin: 0,
    marginLeft: 3,
    transform: "translateY(-1px)",
  },
  flexCenterCenterRow: {
    display: "flex",
    justifyContent: "flex-end",
  },
  popper: {
    maxWidth: 131,
    fontFamily: "Agrandir",
    fontSize: 11,
  },
  popperArrow: {
    "&::before": {
      borderColor: "#EFF2F8",
      backgroundColor: "#EFF2F8",
    },
  },
  tooltip: {
    padding: "22px 9px",
    borderColor: "#EFF2F8",
    backgroundColor: "#EFF2F8",
    color: "#707582",
    fontFamily: "Agrandir",
    fontSize: 11,
    textAlign: "center",
  },
  buttons: {
    justifyContent: "space-between",
    width: "100%",
    marginTop: "24px",
    "& button": {
      width: "100%",
      "&:first-child": {
        background: "#FFFFFF !important",
        color: "#000000",
        border: "1px solid #CBCBCB",
      }
    },
  },
  modalButton: {
    background: "#431AB7 !important",
    height: "38px !important",
    borderRadius: "4px !important",
    fontSize: "14px !important"
  }
}));
