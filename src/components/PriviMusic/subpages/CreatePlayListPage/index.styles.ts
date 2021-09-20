import { makeStyles } from "@material-ui/core";
import { Gradient } from "shared/ui-kit";

export const createPlayListPageStyles = makeStyles(theme => ({
  flexBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuButton: {
    background: "transparent",
    padding: 0,
    borderRadius: 0,
    marginBottom: theme.spacing(2),
  },
  paper: {
    minWidth: 197,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    "& .MuiListItem-root.MuiMenuItem-root > svg": {
      marginRight: 12,
    },
  },
  header1: {
    fontSize: "24px",
    fontWeight: 400,
    color: "black",
  },
  header2: {
    fontSize: "16px",
    fontWeight: 400,
    color: "black",
  },
  header3: {
    fontSize: "14px",
    fontWeight: 800,
    background: Gradient.Green1,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
}));
