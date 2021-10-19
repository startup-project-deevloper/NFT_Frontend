import { makeStyles, Slider, withStyles } from "@material-ui/core";

export const useStyles = makeStyles(theme => ({
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
    textAlign: "center",
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
    width: "100%",
  },
  emptyBox: {
    background: "#EFF2FD",
    border: "1px solid rgba(67, 26, 183, 0.24)",
    boxSizing: "border-box",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  dateHourSelect: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
    "& input": {
      padding: 0,
      height: "auto",
      margin: 0,
    },
    "& .col:first-child": {
      marginRight: 32,
    },
    "& .col": {
      width: "50%",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
}));
