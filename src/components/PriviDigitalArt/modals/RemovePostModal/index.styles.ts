import { makeStyles } from "@material-ui/core";

export const modalStyles = makeStyles(() => ({
  content: {
    padding: "16px 0px",
    display: "flex",
    flexDirection: "column",

  },
  typo1: {
    color: "#2D3047",
    fontSize: 22,
    fontWeight: 800,
    fontFamily: "Agrandir",
    textAlign: "center",
  },
  typo2: {
    color: "#2D304790",
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "Montserrat",
    marginTop: 41,
    textAlign: "center",
  },
}));
