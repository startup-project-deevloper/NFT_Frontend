import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/ui-kit";

export const createPlayListModalStyles = makeStyles(theme => ({
  content: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    "& button": {
      alignSelf: "flex-end",
    },
    "& h5": {
      fontStyle: "normal",
      fontWeight: 800,
      fontSize: 18,
      color: "#181818",
      margin: "0px 0px 16px",
    },
    "& label": {
      width: "100%",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: 18,
      display: "flex",
      alignItems: "center",
      color: "#181818",
      marginBottom: 8,
      marginTop: 0,
    },
    "& input": {
      display: "flex",
      background: "#f7f9fe",
      boxSizing: "border-box",
      borderRadius: 0,
      width: "100%",
      color: "#707582",
      "&:placeholder": {
        color: "#707582",
      },
    },
    "& textarea": {
      display: "flex",
      background: "#f7f9fe",
      border: "1px solid #e0e4f3",
      boxSizing: "border-box",
      borderRadius: 0,
      marginBottom: 17,
      width: "100%",
      color: "#707582",
      padding: "12.5px 20px 10.5px",
      height: 139,
      "&:placeholder": {
        color: "#707582",
      },
    },
  },
  titleBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2),
    borderTop: "2px solid #7075827f",
    borderBottom: "2px solid #7075827f",
  },
  title: {
    fontSize: "16px",
    fontWeight: 600,
    color: Color.MusicDAODark,
  },
  gridBox: {
    display: "grid",
    gridTemplateColumns: "50% 50%",
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "auto",
    },
  },
  inputBox: {
    marginLeft: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      marginLeft: 0,
      marginTop: theme.spacing(2),
    },
  },
  header1: {
    fontSize: "14px",
    fontWeight: 400,
    color: "#828282",
    textAlign: "center",
  },
}));
