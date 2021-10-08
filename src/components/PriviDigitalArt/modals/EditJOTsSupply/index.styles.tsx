import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/ui-kit";

export const EditJOTsSupplyModalStyles = makeStyles(theme => ({
  root: {
    width: "508px !important",
    display: "flex",
    flexDirection: "column",
    paddingTop: "44px !important",
    color: "#707582",
    "& label": {
      color: "#1A1B1C",
      fontSize: "14px",
      lineHeight: "120%",
    },

    "& .MuiInput-root": {
      width: "100%",
      margin: "8px 0px",
      background: "#F7F9FE",
      borderRadius: "16px",
      border: "none",
      height: "49px",
      fontFamily: "Agrandir",
      "& *": {
        fontFamily: "Agrandir",
      },
    },

    "& button": {
      width: "fit-content",
    },
  },
  title: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "22px",
    lineHeight: "104.5%",
    color: "#1A1B1C",
    marginBottom: "12px",
  },
  subtitle: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "14px",
    lineHeight: "21px",
    color: "#1A1B1C",
    marginBottom: "24px",
  },
  buttonPurple: {
    alignSelf: "flex-end",
    marginTop: "60px",
    background: Color.Purple,
    borderRadius: "4px",
    color: "white",
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "18px",
    textAlign: "center",
    padding: "8px 32px",
  },
  select: {
    display: "flex",
    alignItems: "center",
    margin: "8px 0px",
    background: "#F7F9FE",
    borderRadius: "16px",
    border: "none",
    height: "49px",
    fontFamily: "Agrandir",
    width: "100%",

    "& img": {
      marginRight: "15px",
      borderRadius: "50%",
      objectFit: "cover",
      width: "24px",
      height: "24px",
    },
  },
  purpleText: {
    cursor: "pointer",
    color: Color.Purple,
    fontSize: "12px",
    minWidth: "55px",
  },
  smallText: {
    color: "#ABB3C3",
    fontSize: "12px",
  },
  switch: {
    background: "#EFF2FD",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    height: "46px",
    padding: "3px",
    cursor: "pointer",
    transition: "all 0.25s",
    width: "fit-content",
    "& button": {
      borderRadius: "20px",
      height: "100%",
      transition: "all 0.25s",
      padding: "0",
      margin: "0",
    },
  },
  checkBtn: {
    height: 40,
    backgroundColor: "#431AB7",
    color: "white",
    marginTop: 30,
    padding: "11px 32px",
    fontSize: 14,
    fontWeight: 700,
    borderRadius: 4,
  },
  hash: {
    cursor: "pointer",
  },
}));
