import { makeStyles } from "@material-ui/core";

export const headerStyles = makeStyles(theme => ({
  headerBox: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  title: {
    fontSize: "15px",
    fontWeight: 800,
    color: "#181818",
    textTransform: "uppercase",
    position: "absolute",
    top: theme.spacing(2),
    left: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {
      display: "none",
    }
  },
  card: {
    maxWidth: 856,
    width: "100%",
  },
  backButton: {
    fontSize: "16px",
    color: "#707582",
    fontWeight: 700,
  },
  backBox: {
    top: 55,
    left: theme.spacing(3),
    width: 135,
    position: "absolute",
    display: "flex",
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      top: 40,
    }
  },
}));
