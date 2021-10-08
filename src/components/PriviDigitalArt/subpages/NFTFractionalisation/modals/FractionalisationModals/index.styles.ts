import { makeStyles } from "@material-ui/core/styles";

export const useFractionaliseModalsStyles = makeStyles(theme => ({
  modal: {
    boxShadow: "1px 2px 4px rgba(176, 176, 176, 0.24)",
    borderRadius: 16,
    padding: "64px 16px 40px 16px !important"
  },
  title: {
    fontSize: 18,
    color: "#431AB7",
  },
  description: {
    fontSize: 26,
    fontWeight: 800,
    color: "#431AB7",
  },
  itemTitle: {
    fontSize: 14,
    color: "#1A1B1C",
  },
  inputBox: {
    display: "flex",
    alignItems: "center",
    background: "#F7F9FE",
    borderRadius: 16,
    height: 40,
    paddingLeft: 16,
    paddingRight: 16,
    "& input": {
      flex: 1,
      fontSize: 14,
      color: "#ABB3C3",
      background: "transparent",
      border: "none",
      outline: "none",
    }
  },
  input: {
    background: "#FFFFFF",
    color: "#1A1B1C",
    border: "1px solid #A4A4A4",
    borderRadius: 8,
    outline: "none",
    height: 40,
    paddingLeft: 8,
    paddingRight: 8,
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#431AB7 !important",
    borderRadius: "4px !important",
    height: "34px !important",
    padding: "0 32px !important",
    fontSize: "14px !important",
  }
}));