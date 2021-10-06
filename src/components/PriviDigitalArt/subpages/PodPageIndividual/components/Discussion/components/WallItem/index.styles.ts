import { makeStyles } from "@material-ui/core/styles";

export const wallItemStyles = makeStyles(theme => ({
  item: {
    borderRadius: theme.spacing(2.5),
    boxShadow: "0px 4px 8px #9EACF2",
    background: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    cursor: "pointer",
    position: "relative",
  },
  image: {
    borderTopLeftRadius: theme.spacing(2.5),
    borderTopRightRadius: theme.spacing(2.5),
    width: "100%",
    height: "auto",
    minHeight: "200px",
  },
  userImage: {
    marginLeft: theme.spacing(2),
    marginTop: -16
  },
  header1: {
    fontSize: 14,
    fontWeight: 800,
  },
  header2: {
    fontSize: 14,
    fontWeight: 400,
  },
}));
