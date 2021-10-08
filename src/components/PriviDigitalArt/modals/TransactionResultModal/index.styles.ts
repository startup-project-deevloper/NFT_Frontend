import { makeStyles } from "@material-ui/core/styles";

export const useTransactionResultModalStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "681px !important",
    fontSize: "18px",
    lineHeight: "23px",
    textAlign: "center",
    color: "#181818",
    padding: "103px 65.5px 140px !important",
  },
  title: {
    fontWeight: 800,
    fontSize: "22px",
    lineHeight: "130%",
    textAlign: "center",
    letterSpacing: "0.04em",
    color: "#2D3047",
    margin: "20px 0px",
  },

  text: {
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "24px",
    textAlign: "center",
    color: "#2D3047",
  },

  iconContainer: {
    width: "166.5px",
    height: "166.5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  },

  buttonCheck: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "16px",
    lineHeight: "21px",
    textAlign: "center",
    letterSpacing: "-0.04em",
    color: "white",
    flex: "none",
    order: 0,
    flexGrow: 0,
    margin: "0px 4px",
    mixBlendMode: "normal",
    border: "1px solid #4218B5",
    boxSizing: "border-box",
    borderRadius: "4px",
    background: "white",
    marginTop: "28px",
    backgroundColor: "#431AB7",
  },
  hash: {
    cursor: "pointer",
  },
}));
