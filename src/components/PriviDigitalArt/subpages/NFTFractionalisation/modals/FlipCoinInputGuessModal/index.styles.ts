import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

export const FlipCoinInputGuessModalStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      maxWidth: "700px !important",
    },
    img: {
      width: 200,
      height: 200,
      marginTop: 32,
    },
    title: {
      fontSize: 38,
      fontWeight: 800,
      lineHeight: "104.5%",
      color: "#431AB7",
      margin: "70px 0 0",
    },
    subTitle: {
      fontSize: 24,
      fontWeight: "normal",
      lineHeight: "150%",
      color: "#431AB7",
      margin: "7px 0 0",
      width: "100%",
      textAlign: "center",
      paddingBottom: 32,
      borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
    },
    guessZeroBtn: {
      height: "auto",
      background: "linear-gradient(90deg, #1E54BE 0%, #7D4FE0 100%)",
      color: "white",
      padding: "17px 32px",
      fontSize: 20,
      fontWeight: 700,
      [theme.breakpoints.down("xs")]: {
        padding: "10px 20px",
        fontSize: 16,
      },
    },
    guessOneBtn: {
      height: "auto",
      backgroundColor: "#9EACF2",
      color: "white",
      padding: "17px 32px",
      fontSize: 20,
      fontWeight: 700,
      [theme.breakpoints.down("xs")]: {
        padding: "10px 20px",
        fontSize: 16,
      },
    },
    closeBtn: {
      padding: "10px 32px",
      border: "1px solid #431AB7",
      fontWeight: "bold",
      fontSize: "16px",
      lineHeight: "21px",
      color: "#431AB7",
      background: "white",
      marginTop: "80px",
    },
  })
);
