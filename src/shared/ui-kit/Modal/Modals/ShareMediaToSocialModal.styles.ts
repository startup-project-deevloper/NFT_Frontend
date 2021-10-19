import { makeStyles } from "@material-ui/core/styles";

export const shareMediaToSocialModalStyles = makeStyles((theme) => ({
  root: {
    width: "600px !important",
  },
  modalContent: {
    padding: "20px 30px",
    height: 632,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    "& img": {
      width: 50,
      heigth: 50,
    },
    "& h5": {
      marginBottom: 0,
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: 18,
      lineHeight: "104.5%",
      textAlign: "center",
      color: "#181818",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "0px 0px"
    }
  },
  shareSocialMedia: {
    fontSize: 30,
    lineHeight: "104.5%",
    textAlign: "center",
    color: "#181818",
    marginBottom: 40,
  },
  link: {
    background: "#f7f9fe",
    border: "1px solid #949bab",
    boxSizing: "border-box",
    width: "calc(100% - 18px * 2)",
    height: 56,
    marginTop: 10,
    padding: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    "& img": {
      width: 18,
      height: 18,
      cursor: "pointer",
    },
  },
  pageLink: {
    width: "100%",
    outline: "none",
    border: "none",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 18,
    lineHeight: "120%",
    color: "#abb3c4",
    background: "#f7f9fe",
    textOverflow: "ellipsis",
  },
  socialMedia: {
    display: "flex",
    textAlign: "center",
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 18,
    marginRight: 18,
    marginBottom: 22,
    alignItems: "center",
    "& p": {
      marginBlockStart: 19,
      marginBlockEnd: 0,
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: 14,
      textAlign: "center",
      color: "#000000",
    },
  },
  bubble: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 62,
    height: 62,
    borderRadius: "50%",
    cursor: "pointer",
    "& img": {
      width: 25,
    },
  },
}));
