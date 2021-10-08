import { makeStyles, Slider, withStyles } from "@material-ui/core";

export const useFractionaliseStyles = makeStyles(theme => ({
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
    margin: "24px 0px",
    [theme.breakpoints.down("md")]: {
      fontSize: 22,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 24,
    },
  },
  text: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "18px",
    lineHeight: "23px",
    color: "#431AB7",
    marginBottom: "24px",
    [theme.breakpoints.down("md")]: {
      fontSize: 14,
    },
  },
  walletRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
    width: "100%",
    "& div": {
      display: "flex",
      alignItems: "center",
      fontSize: "14px",
      fontWeight: 800,
      lineHeight: "18px",
      color: "#431AB7",
      width: "calc(60% - 24px)",
      [theme.breakpoints.down("md")]: {
        width: "100%",
        marginRight: 0,
        paddingBottom: 25,
      },
      marginRight: "24px",
      "& img": {
        marginRight: "24px",
        width: "32px",
        height: "32px",
      },
    },
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 400,
    marginBottom: "24px",
    "& button": {
      background: "#DDFF57",
      borderRadius: "4px",
      color: "#431AB7",
      fontWeight: 800,
      fontSize: "14px",
      lineHeight: "18px",
      textAlign: "center",
      width: "fit-content",
      [theme.breakpoints.down("md")]: {
        width: "80%"
      },
      [theme.breakpoints.down("xs")]: {
        width: "100%"
      },
      padding: "8px 32px",
    },
    [theme.breakpoints.down(1110)]: {
      "& button": {
        padding: "8px 16px",
        fontSize: "13px",
      },
    },
  },
  nftsBox: {
    background: "#FFFFFF",
    boxShadow: "0px 4px 8px #9EACF2",
    borderRadius: "16px",
    width: "100%",
    fontFamily: "Agrandir",
    padding: "42px 16px 56px",

    "& label": {
      color: "#1A1B1C",
      fontSize: "14px",
      lineHeight: "120%",
    },

    "& .MuiInput-root": {
      margin: "8px 0px 0px",
      background: "#F7F9FE",
      borderRadius: "16px",
      border: "none",
      height: "49px",
      fontFamily: "Agrandir",
      "& *": {
        fontFamily: "Agrandir",
      },
    },
    [theme.breakpoints.down(960)]: {
      marginBottom: 16,
    },
  },

  nftsTitle: {
    textAlign: "center",
    justifyContent: "center",
    color: "#431AB7",
    lineHeight: "170%",
    fontSize: "18px",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",

    "& span": {
      marginLeft: "16px",
      background: "#EFF2FD",
      borderRadius: "32px",
      width: "34px",
      height: "34px",
      padding: "8px 12px 6px",
      fontSize: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },

  detailsLabel: {
    color: "#431AB7",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "120%",
    marginBottom: "16px",
  },

  purpleLabel: {
    color: "#431AB7",
    fontSize: "14px",
    lineHeight: "120%",
  },

  nftsButton: {
    background: "#431AB7",
    borderRadius: "4px",
    color: "#FFFFFF",
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "18px",
    textAlign: "center",
    padding: "8px 32px",
    minHeight: 0,
  },
  sliderContainer: { width: "100%" },
  borderBox: {
    border: "1px solid #431AB7",
    padding: `${theme.spacing(1)}px ${theme.spacing(2.5)}px`,
    color: "#431AB7",
    textAlign: "center",
    borderRadius: theme.spacing(1),
    "& span": {
      fontWeight: 800,
      textTransform: "uppercase",
    },
  },
  emptyBox: {
    borderRadius: theme.spacing(1),
    background: "#EFF2FD",
    boxShadow: "0px 4px 8px #9EACF2",
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    textAlign: "center",
  },
}));

export const PurpleSlider = withStyles({
  root: {
    color: "#EFF2FD",
    height: 8,
  },
  thumb: {
    height: 23,
    width: 23,
    backgroundColor: "#431AB7",
    border: "2px solid #FFFFFF",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  valueLabel: {
    left: "calc(-50% + 4px)",
    "& *": {
      background: "#431AB7",
      fontFamily: "Agrandir",
    },
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);
