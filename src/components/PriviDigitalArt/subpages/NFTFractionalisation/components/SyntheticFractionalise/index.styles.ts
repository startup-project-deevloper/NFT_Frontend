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

    [theme.breakpoints.down("md")]: {
      padding: "42px 24px 38px",
    },

    [theme.breakpoints.down("sm")]: {
      padding: "42px 24px 38px",

      "@media (max-width: 768px)": {
        padding: "42px 20px 38px",

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
    fontFamily: "Agrandir GrandHeavy",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: 24,
    lineHeight: "31px",
    color: "#431AB7",
    margin: "24px 0px",
    [theme.breakpoints.down("xs")]: {
      fontSize: 22,
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
    [theme.breakpoints.down(768)]: {
      fontSize: 16,
    },
  },
  shortLabel: {
    "& label": {
      maxWidth: 300,
    },
  },
  walletRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    "& .MuiGrid-item": {
      "& div": {
        display: "flex",
        alignItems: "center",
        fontSize: "14px",
        fontWeight: 800,
        lineHeight: "18px",
        color: "#431AB7",
        // width: "calc(60% - 24px)",
        // marginRight: "24px",
        "& img": {
          marginRight: "24px",
          width: "32px",
          height: "32px",
        },
      },
      "&:last-child": {
        display: "flex",
        justifyContent: "flex-end",
        [theme.breakpoints.down("md")]: {
          justifyContent: "center",
          paddingTop: 35,
        },
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
      // width: "40%",
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
      // marginBottom: 16,
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
    padding: "8px 84px",
    minHeight: 0,
  },
  sliderContainer: { width: "100%" },
  borderBox: {
    border: "1px solid #431AB7",
    background: "rgba(67, 26, 183, 0.06)",
    padding: `${theme.spacing(1)}px ${theme.spacing(2.5)}px`,
    color: "#431AB7",
    textAlign: "center",
    borderRadius: theme.spacing(1),
    fontSize: "14px",
    lineHeight: "150%",
    "& span": {
      fontWeight: 800,
      textTransform: "uppercase",
    },
  },
  emptyBox: {
    background: "#EFF2FD",
    border: "1px solid rgba(67, 26, 183, 0.24)",
    boxSizing: "border-box",
    borderRadius: "20px",
    // padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    // textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    // height: "100%",
    // height: "calc(100% - 24px - 20px)",
  },
  label: {
    marginBottom: "9px",
    color: "#1A1B1C",
    fontSize: "14px",
    lineHeight: "120%",
  },
  description: {
    padding: "8px",
    fontSize: "12px",
    color: "#707582",
    lineHeight: 1.2,
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

export const normalNFTCardStyles = makeStyles(theme => ({
  card: {
    background: "#431AB7",
    backdropFilter: "blur(4.82073px)",
    borderRadius: 11.3,
    height: 340,
    width: "100%",
    maxWidth: "230px",
    minWidth: "150px",
    cursor: "pointer",
  },
  selectedCard: {
    background: "#DDFF57",
    borderRadius: 11.3,
    padding: 8,
    clipPath: "polygon(100% 0%, 100% 79%,  50% 91%, 0% 79%, 0% 0%)",
  },
  innerBox: {
    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.4) 3.83%, rgba(255, 255, 255, 0) 31.54%), #9EACF2;",
    boxShadow: "0px 1.67251px 1.67251px rgba(0, 0, 0, 0.03)",
    borderRadius: 11.3,
    clipPath: "polygon(100% 0%, 100% 79%,  50% 90%, 0% 79%, 0% 0%)",
    padding: "20px 8px",
    height: 325,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#1A1B1C",
    "& img": {
      width: "100%",
      height: 170,
      border: "0.550168px solid rgba(0, 0, 0, 0.09)",
      boxShadow: "0px 19.806px 15.4047px -14.8545px rgba(63, 83, 183, 0.22)",
      borderRadius: 11,
    },
    [theme.breakpoints.between(960, 980)]: {
      padding: 12,
    },
  },
  starGroup: {
    display: "flex",
    alignItems: "center",
    marginTop: 25,
  },
  ntfName: {
    fontSize: 12,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "13px",
    textTransform: "capitalize",
    letterSpacing: "0.02em",
    margin: "0 20px 4px",
    textAlign: "center",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap"
  },
  priceSection: {
    display: "flex",
    alignItems: "center",
    fontSize: 16,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "21px",
    letterSpacing: "0.02em",
    marginTop: 16,
  },
  volumnSection: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "18px",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    marginTop: 8,
  },
}));
