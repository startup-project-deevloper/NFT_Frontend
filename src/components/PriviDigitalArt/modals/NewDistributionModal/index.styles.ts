import { makeStyles } from "@material-ui/core/styles";

export const newDistributionModalStyles = makeStyles((theme) => ({
  headerCreatePod: {
    fontFamily: "Agrandir GrandLight",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "22px",
    lineHeight: "130%",
    color: "#2D3047",
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
    marginTop: 50,
    "& img:first-child": {
      marginTop: 20,
    },
    "& h3": {
      marginTop: 37,
      marginBottom: 14,
      fontStyle: "normal",
      fontWeight: 800,
      fontSize: 22,
      textAlign: "center",
      color: "#2D3047",
      fontFamily: "Agrandir",
      lineHeight: "130%"
    },
    "& p": {
      fontStyle: "normal",
      fontFamily: "Montserrat",
      fontSize: 16,
      fontWeight: 500,
      lineHeight: "160%",
      textAlign: "center",
      color: "#54658F",
      marginTop: 0,
      marginBottom: "19px",
    },
    "& b": {
      fontWeight: 600
    },
    "& button": {
      height: 45,
      width: 250,
      marginTop: 39,
      borderRadius: "8px",
      fontFamily: "Montserrat",
      fontSize: 16,
      fontWeight: 600,
      lineHeight: "18px",
      border: "none",
      color: "#ffffff",
      background: "#431AB7",
    },
    "& span": {
      fontSize: 16,
      fontWeight: 600,
      color: "#431AB7",
      textAlign: "center",
      marginTop: 30,
    }
  },
  warningContainer: {
    background: "rgba(231, 218, 175, 0.3)",
    borderRadius: "49px",
    height: "39px",
    width: "39px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "11px",
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
  },
  cardsOptions: {
    height: "48px",
    padding: "16.5px 14px",
    alignSelf: "center",
    display: "flex",
    alignItems: "center",
    marginBottom: 40,
    background: "#EFF2FD",
    borderRadius: "68px",
    [theme.breakpoints.down('xs')]: {
      marginTop: 24,
      marginBottom: 32,
    }
  },

  tabHeaderPodMedia: {
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 14,
    fontFamily: "Montserrat",
    cursor: "pointer",
    marginRight: "25px",
    color: "#181818",
    padding: "10px 17px",
    "&:last-child": {
      marginRight: 0,
    },
    [theme.breakpoints.down('xs')]: {
      padding: 9,
      marginRight: 5,
    }
  },
  tabHeaderPodMediaSelected: {
    color: "#FFFFFF",
    background: "#431AB7",
    borderRadius: "77px",
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
    marginTop: "32px",
    "& button": {
      height: "59px",
      borderRadius: "8px",
      fontFamily: "Montserrat",
      fontWeight: 800,
      lineHeight: "20px",
      border: "none",
      maxWidth: "auto",
      "&:first-child": {
        background: "#FFFFFF",
        color: "#2D3047",
        border: "1px solid #2D3047",
      },
      "&:last-child": {
        color: "#FFFFFF",
        background: "#431AB7",
        width: 295
      },
    },
  },
}));
