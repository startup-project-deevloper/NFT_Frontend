import { makeStyles } from "@material-ui/core";

export const noAuthModalStyles = makeStyles(theme => ({
  container: {
    background:
      "radial-gradient(77.95% 43.77% at 50.18% 56.23%, #8319A0 15.62%, rgba(65, 15, 98, 0.96) 96.87%)",
    boxShadow: "0px 0px 64px #D9F66F",
    borderRadius: 25,
    width: "621px !important",
    maxWidth: "none !important",
  },
  title: {
    fontSize: 30,
    marginTop: 32,
    marginBottom: 0,
    fontFamily: "Agrandir GrandHeavy",
    fontWeight: 800,
    textTransform: "uppercase",
    color: "#D9F66F",
  },
  description: {
    fontSize: 18,
    fontWeight: 400,
    lineHeight: "23px",
    textAlign: "center",
    "& a": {
      color: "#69bf9f",
      textDecoration: "none",
    },
  },
  cryIcon: {
    width: 96,
    height: 96,
    background: "#D9F66F",
    borderRadius: 80,
    fontSize: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 16,
  },
}));
