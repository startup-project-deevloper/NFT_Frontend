import { makeStyles } from "@material-ui/core/styles";

export const useDepositNFTStyles = makeStyles(theme => ({
  modal: {
    padding: "27px 16px",
    width: "500px !important",
    "& .MuiInputBase-root": {
      background: "#F7F9FE",
      border: "none !important",
      borderRadius: "16px",
      margin: 0,
      fontSize: "14px",
      color: "#181818",
      fontFamily: "Agrandir",
      padding: "8px 16px",
      height: "40px",
      outline: "none",
    },
    "& h3": {
      marginBottom: "20px",
      color: "#000000",
      fontSIze: "14px",
      lineHegith: "18px",
      fontWeight: 800,
      marginTop: 0,
    },
    "& label": {
      marginBottom: "9px",
      color: "#1A1B1C",
      fontSize: "14px",
      lineHeight: "120%",
    },
  },
  primaryBtn: {
    background: "#431AB7 !important",
  },
  mediaImage: {
    borderRadius: "16px",
    height: "64px",
    width: "64px",
    marginRight: "16px",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  mediaTitle: {
    color: "#181818",
    fontSize: "16px",
    lineHeight: "104.5%",
    marginBottom: "4px",
  },
  interest: {
    color: "#707582",
    fontSize: "14px",
    lineHeight: "104.5%",
  },
  label: {
    marginBottom: "9px",
    color: "#1A1B1C",
    fontSize: "14px",
    lineHeight: "120%",
  },
  mediaDisplay: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0px",
    borderTop: "1px solid #eff2f8",
    borderBottom: "1px solid #eff2f8",
    marginTop: 30,
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
  },
  avatarSection: {
    width: 40,
    height: 40,
    backgroundColor: "#f2f2f2",
    marginRight: 20,
    borderRadius: 6,
  },
}));

export const useAutoCompleteStyles = makeStyles({
  root: {
    width: "100%",
  },
  listbox: {
    maxHeight: 168,
  },
  option: {
    height: 52,
  },
});
