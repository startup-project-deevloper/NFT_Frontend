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
    "& button": {
      height: "auto",
    },

    [theme.breakpoints.down("xs")]: {
      padding: "40px 30px",
      marginBottom: 50,
    },
  },
  nftWrapper: {
    [theme.breakpoints.down("xs")]: {
      padding: "35px 6px 0",
      background: "#EFF2FD",
      border: "1px solid #9EACF2",
      borderRadius: 20,
      marginLeft: -15,
      marginRight: -15,
    },
  },
  titleContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",

    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "flex-start",
      marginBottom: 30,
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
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
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
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
    },
  },
  shortLabel: {
    "& label": {
      maxWidth: 300,
    },
  },
  walletRow: {
    display: "flex",
    alinftsButtongnItems: "center",
    justifyContent: "center",
    width: "100%",
    "& div": {
      display: "flex",
      alignItems: "center",
      fontSize: "14px",
      fontWeight: 800,
      lineHeight: "18px",
      color: "#431AB7",
      width: "calc(60% - 24px)",
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
      width: "40%",
      padding: "8px 32px",

      [theme.breakpoints.down("xs")]: {
        width: "100%",
        maxWidth: 260,
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
    fontSize: "16px",
    lineHeight: "120%",
    marginBottom: "16px",

    [theme.breakpoints.down("xs")]: {
      fontWeight: 400,
      marginTop: 20,
    },
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
    width: 230,

    "&:disabled": {
      border: "1px solid rgba(67, 26, 183, 0.24)",
      background: "rgb(239, 242, 253)",
      color: "#431AB7",
      cursor: "not-allowed"
    }
  },
  sliderContainer: { width: "100%" },
  borderBox: {
    border: "1px solid #431AB7",
    background: "rgba(67, 26, 183, 0.06)",
    padding: `${theme.spacing(1)}px ${theme.spacing(2.5)}px`,
    color: "#431AB7",
    textAlign: "center",
    borderRadius: theme.spacing(1),
    "& span": {
      fontWeight: 800,
      textTransform: "uppercase",
    },
  },
  emptyIcon: {
    fontSize: 20,

    [theme.breakpoints.down("xs")]: {
      fontSize: 52,
    },
  },
  emptyBox: {
    borderRadius: theme.spacing(1),
    background: "#EFF2FD",
    boxShadow: "0px 4px 8px #9EACF2",
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    textAlign: "center",
    [theme.breakpoints.down("xs")]: {
      border: "1px solid rgba(67, 26, 183, 0.24)",
      width: "100%",
      boxShadow: "none",
      padding: "50px 30px 30px",
    },
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
    borderRadius: 11.3,
    clipPath: "polygon(100% 0%, 100% 80%,  50% 91%, 0% 80%, 0% 0%)",
    padding: 8,
    height: '100%',
    width: "100%",
    cursor: "pointer",
  },
  selected: {
    background: "#DDFF57",
  },
  selectedSmallOuterBox: {
    background: "#431AB7",
    boxShadow: "0px 1.67251px 1.67251px rgba(0, 0, 0, 0.03)",
    borderRadius: 11.3,
    clipPath: "polygon(100% 0%, 100% 81%,  50% 92%, 0% 81%, 0% 0%)",
    height: '100%',
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#fff",
    padding: 2,
    maxWidth: 150,
    "& img": {
      width: "100%",
      height: "100%",
      maxHeight: 250,
    },
  },
  selectedOuterBox: {
    background: "#431AB7",
    boxShadow: "0px 1.67251px 1.67251px rgba(0, 0, 0, 0.03)",
    borderRadius: 11.3,
    clipPath: "polygon(100% 0%, 100% 81%,  50% 92%, 0% 81%, 0% 0%)",
    padding: 4,
    height: '100%',
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#fff",
    "& img": {
      width: "100%",
      height: "100%",
      maxHeight: 250,
    },
  },
  innerBox: {
    background: "#9EACF2",
    boxShadow: "0px 1.67251px 1.67251px rgba(0, 0, 0, 0.03)",
    borderRadius: 11.3,
    clipPath: "polygon(100% 0%, 100% 80%,  50% 90%, 0% 80%, 0% 0%)",
    padding: 16,
    height: '100%',
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#fff",
    "& img": {
      width: "100%",
      height: "100%",
      maxHeight: 250,
    },
    [theme.breakpoints.between(960, 980)]: {
      padding: 12,
    },
    [theme.breakpoints.down("xs")]: {
      padding: "10px 6px",
    },
  },
  nftNameContainer: {
    marignBottom: 8,
    [theme.breakpoints.down("xs")]: {
      marginBottom: 0,
    },
  },
  starGroup: {
    display: "flex",
    alignItems: "center",
    marginBottom: 30,
  },
  ntfName: {
    fontSize: 16,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "21px",
    textTransform: "capitalize",
    marginBottom: 8,
    width: "100%",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    color: "#1A1B1C",
    textAlign: "center",

    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
      color: "#1A1B1C",
      textAlign: "center",
      margin: "auto",
    },
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
