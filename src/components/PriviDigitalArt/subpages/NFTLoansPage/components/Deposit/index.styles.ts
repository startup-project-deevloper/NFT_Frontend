import { makeStyles, Slider, withStyles } from "@material-ui/core";

export const useDepositPageStyles = makeStyles(theme => ({
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

    [theme.breakpoints.down("sm")]: {
      padding: "42px 24px 38px",

      "@media (max-width: 768px)": {
        padding: "42px 24px 38px",

        minHeight: "calc(100vh - 80px - 65px)",
        maxHeight: "calc(100vh - 80px - 65px)",
      },
    },

    [theme.breakpoints.down("xs")]: {
      padding: "22px 16px 24px",

      minHeight: "calc(100vh - 80px - 65px - 10px)",
      maxHeight: "calc(100vh - 80px - 65px - 10px)",
    },

    "& button": {
      height: "auto",
    },
  },
  title: {
    fontFamily: "Agrandir Grand",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: 24,
    lineHeight: "31px",
    color: "#431AB7",
    margin: "28px 0px",
    [theme.breakpoints.down("xs")]: {
      fontSize: 22,
    },
  },
  artCards: {
    padding: 10,
    width: '49%',
  },
  depositForm: {
    background: '#FFF',
    boxShadow: '1px 2px 4px rgba(176, 176, 176, 0.24)',
    borderRadius: 16,
    padding: '30px 20px',
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
