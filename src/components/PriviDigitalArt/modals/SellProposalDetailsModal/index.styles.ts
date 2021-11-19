import { makeStyles } from "@material-ui/core";

export const modalStyles = makeStyles(theme => ({
  content: {
    padding: "16px 0px",
    display: "flex",
    flexDirection: "column",
  },
  artistImage: {
    objectFit: "cover",
    height: 250,
    width: 300,
    borderRadius: 20,
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  typo1: {
    color: "#2D3047",
    fontSize: 22,
    fontWeight: 800,
    fontFamily: "Agrandir",
    textAlign: "center",
  },
  typo2: {
    color: "#2D3047",
    fontSize: 18,
    fontWeight: 600,
    fontFamily: "Montserrat",
  },
  typo3: {
    color: "#2D3047",
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "Montserrat",
  },
  typo4: {
    color: "#2D3047",
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "Montserrat",
  },
  typo5: {
    color: "#2D3047",
    fontSize: 20,
    fontWeight: 600,
    fontFamily: "Montserrat",
  },
  typo6: {
    color: "#65CB63",
    fontSize: 20,
    fontWeight: 700,
    fontFamily: "Montserrat",
  },
}));
