import { makeStyles } from "@material-ui/core/styles";

export const discussionStyles = makeStyles(theme => ({
  fractionBox: {
    color: "white",
    borderRadius: theme.spacing(2),
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    fontSize: "12px",
    background: "#7F6FFF",
  },
  title: {
    fontSize: "26px",
    fontWeight: 800,
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  header1: {
    fontSize: "12px",
    color: "grey",
  },
  header2: {
    fontSize: "16px",
    fontWeight: 400,
  },
  header3: {
    fontSize: "34px",
    fontWeight: 400,
  },
  header4: {
    fontSize: "14px",
    fontWeight: 800,
    cursor: 'pointer'
  },
  wallContentBox: {
    borderRadius: theme.spacing(1),
    background: "white",
    height: theme.spacing(70),
    textAlign: "center",
    marginTop: theme.spacing(2),
    overflowY: "auto",
    display: "flex",
    "& .MuiGrid-root.MuiGrid-item": {
      "& > div": {
        height: "100%",
      }
    }
  },
  contentBox: {
    borderRadius: theme.spacing(1),
    background: "white",
    height: theme.spacing(70),
    textAlign: "center",
    padding: '32px 16px 16px',
    boxShadow: "0px 4px 8px #9EACF2",
    marginTop: theme.spacing(2),
    overflowY: "auto",
  },
}));
