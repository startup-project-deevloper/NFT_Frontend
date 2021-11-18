import { makeStyles } from "@material-ui/core/styles";

export const useManageNFTPageStyles = makeStyles(theme => ({
  subTitleSection: {
    display: "flex",
    width: "100%",
    fontSize: 18,
    fontWeight: 800,
    fontFamily: "Agrandir",
    color: "#431AB7",
    lineHeight: "23px",
    marginTop: 32,
    padding: "0 20px",
    cursor: "pointer",
    [theme.breakpoints.down(1110)]: {
      fontSize: 15,
    },
    [theme.breakpoints.down(950)]: {
      fontSize: 12,
    },
    [theme.breakpoints.down("xs")]: {
      padding: "0 0",
    },
  },
  tabSection: {
    height: 55,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    margin: "0 40px",
    fontSize: 18,
    fontFamily: "Agrandir GrandHeavy",
    opacity: 0.45,
    [theme.breakpoints.down(1250)]: {
      minWidth: 420,
    },
    [theme.breakpoints.down(1110)]: {
      minWidth: 350,
    },
    [theme.breakpoints.down(950)]: {
      minWidth: 275,
      fontSize: 14,
    },
    [theme.breakpoints.down(580)]: {
      minWidth: 165,
      fontSize: 16,
      margin: "0 0",
      padding: "0 24px",
      height: "84px",
      width: "50%",
    },
    borderBottom: "4px solid transparent",
  },
  selectedTabSection: {
    opacity: 1,
    borderBottom: "4px solid #431AB7",
  },

  backButtonContainer: {
    width: "100%",
    margin: "10px 0 30px 0",
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
  backBtn: {
    position: "absolute",
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
    fontSize: 20,
    fontFamily: "Agrandir GrandHeavy",
    display: "flex",
    alignItems: "center",
    color: "#431AB7",
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
    },
  },
}));
