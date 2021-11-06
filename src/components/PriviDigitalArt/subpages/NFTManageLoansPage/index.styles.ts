import { makeStyles } from "@material-ui/core";

export const useManageLoansPageStyles = makeStyles(theme => ({
  root: {
    padding: "40px 48px 48px 80px",
    backgroundImage: `url(${require("assets/pixImages/fractionalise_background.png")})`,
    backgroundRepeat: "inherit",
    backgroundSize: "100% 100%",

    width: "100%",
    height: "100%",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minHeight: "calc(100vh - 80px)",
    maxHeight: "calc(100vh - 80px)",
    overflowX: "hidden",
    position: "relative",
    color: "#431AB7",
    [theme.breakpoints.down("sm")]: {
      padding: "42px 24px 38px",
    },

    [theme.breakpoints.down("xs")]: {
      padding: "22px 16px 24px",
    },

    "& button": {
      height: "auto",
    },
  },
  headerSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    fontSize: 24,
    fontWeight: 800,
    lineHeight: "104.5%",
    fontFamily: "Agrandir",
    [theme.breakpoints.down("xs")]: {},
  },
  balanceSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 44,
    padding: "0px 90px",
  },
  typo1: {
    fontSize: 24,
    fontWeight: 800,
    lineHeight: "104.5%",
    fontFamily: "Agrandir",
  },
}));
