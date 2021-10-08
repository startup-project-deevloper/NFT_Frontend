import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

export const FlipCoinModalStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      maxWidth: "700px !important",
    },
    root: {
      width: "100%",
      padding: 50,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      width: "100%",
      maxWidth: 540,
      textAlign: "center",
      // backgroundImage: "url('assets/icon/coin_flip.gif')"
    },
    title: {
      fontSize: 38,
      fontWeight: 800,
      lineHeight: "104.5%",
      color: "#431AB7",
    },
    description: {
      fontSize: 18,
      lineHeight: "150%",
      color: "#54658F",
    },
    result: {
      color: "#431AB7",
      fontWeight: 800,
    },
    hash: {
      fontSize: 16,
      lineHeight: "150%",
      color: "#54658F",
      cursor: "pointer",
    },
    icon: {
      width: 160,
      height: "100%",
      marginBottom: 30,
    },
    laterBtn: {
      height: 34,
      backgroundColor: "transparent",
      color: "#431AB7",
      border: "1px solid #431AB7",
      padding: "8px 58px",
      fontSize: 14,
      fontWeight: 800,
      borderRadius: 4,
      marginRight: 10,

      [theme.breakpoints.down("sm")]: {
        width: "100%",
        marginBottom: 10,
        marginRight: 0,
      },
    },
    buttonWrapper: {
      marginTop: 30,
      display: "flex",
      justifyContent: "center",

      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
      },
    },
    btn: {
      height: 34,
      backgroundColor: "#431AB7",
      color: "white",
      padding: "8px 58px",
      fontSize: 14,
      fontWeight: 800,
      borderRadius: 4,

      [theme.breakpoints.down("sm")]: {
        width: "100%",
        marginBottom: 10,
        marginTop: 10,
      },
    },
    proceedBtn: {
      height: 34,
      backgroundColor: "#431AB7",
      color: "white",
      padding: "8px 58px",
      fontSize: 14,
      fontWeight: 800,
      borderRadius: 4,
      width: "100%",
    },
    checkBtn: {
      height: 40,
      backgroundColor: "#431AB7",
      color: "white",
      marginTop: 30,
      padding: "11px 32px",
      fontSize: 16,
      fontWeight: 700,
      borderRadius: 4,
    },
    plainBtn: {
      height: 40,
      backgroundColor: "#fff",
      border: "1px solid #431AB7",
      color: "#431AB7",
      marginTop: 30,
      padding: "11px 32px",
      fontSize: 16,
      fontWeight: 700,
      borderRadius: 4,
    },
    main: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    gifCoin: {
      width: "calc(100% + 82px * 2)", 
      height: "360px", 
      backgroundImage: `url(${require("assets/icons/coin_flip.gif")})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      marginTop: "-50px",
    },
    imgWon: {
      position: "absolute",
      top: 0
    },
    imgLost: {
    },
    grad: {
      background: "linear-gradient(91.78deg, #AA26C2 11.04%, #F84B4B 74.92%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }
  })
);
