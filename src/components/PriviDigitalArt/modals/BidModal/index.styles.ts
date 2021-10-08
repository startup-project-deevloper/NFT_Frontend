import { makeStyles } from "@material-ui/core/styles";

export const useBidModalStyles = makeStyles(theme => ({
  modal: {
    padding: "27px 16px",
    maxWidth: "500px !important",
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
    "& .MuiInputBase-root": {
      background: "#F7F9FE",
      border: "none",
      borderRadius: "16px",
      margin: 0,
    },
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
  chain: {
    width: 22,
    height: 22,
    objectFit: "contain",
    borderRadius: "50%",
  },
  placeBtn: {
    background: "#431AB7 !important",
  },
  tokenLabel: {
    fontSize: 18,
    fontWeight: 800,
    color: '#431AB7',
    lineHeight: '46px',
    height: '100%',
    display: 'flex',
    alignItems: 'flex-end'
  }
}));
