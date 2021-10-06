import { makeStyles } from "@material-ui/core/styles";

export const pollItemStyles = makeStyles(theme => ({
  item: {
    borderRadius: theme.spacing(2.5),
    border: "1px solid #9EACF2",
    background: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    position: "relative",
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  endBox: {
    borderRadius: theme.spacing(4),
    background: "#9EACF2",
    color: "white",
    fontSize: 12,
    fontWeight: 800,
    padding: `${theme.spacing(0.5)}px 12px`,
  },
  header1: {
    fontSize: 14,
    fontWeight: 800,
    color: "#9EACF2",
  },
  header2: {
    fontSize: 14,
    fontWeight: 800,
    wordBreak: 'break-all',
    textAlign: 'left'
  },
  header3: {
    fontSize: 14,
    fontWeight: 400,
    wordBreak: 'break-all',
    textAlign: 'left'
  },
  name: {
    fontSize: 14,
    fontWeight: 800,
  },
}));
