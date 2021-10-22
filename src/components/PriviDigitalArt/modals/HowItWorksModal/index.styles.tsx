import { makeStyles } from "@material-ui/core/styles";

export const HowItWorksModalStyles = makeStyles(theme => ({
  root: {
    textAlign: "center",
    maxWidth: "755px !important",
    padding: "32px 114px 64px 107px !important",
    [theme.breakpoints.down("xs")]: {
      padding: "32px 32px !important"
    },
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    color: "#431AB7",
  },
  header1: {
    fontFamily: "Agrandir GrandHeavy",
    fontSize: 16,
    fontWeight: 800,
    lineHeight: "150%",
    color: "#431AB7",
  },
  header2: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: "150%",
    color: "#431AB7",
  },
  orderBox: {
    background:
      "linear-gradient(222.67deg, #418DFF 7.42%, #4541FF 36.62%, #4541FF 45.74%, #EF41CB 72.7%, #EF41CB 76.71%, #EFA941 94.91%), #000000",
    width: theme.spacing(4.5),
    height: theme.spacing(4.5),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    color: "white",
  },
  lineBox: {
    width: theme.spacing(0.5),
    height: theme.spacing(3),
    borderRadius: theme.spacing(0.25),
    background: "linear-gradient(180deg, #D9F66F 0%, #431AB7 0.01%, rgba(211, 86, 255, 0) 100%)",
  },
}));
