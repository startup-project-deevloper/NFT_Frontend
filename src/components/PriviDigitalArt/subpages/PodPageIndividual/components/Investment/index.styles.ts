import { makeStyles } from "@material-ui/core/styles";

export const investmentStyles = makeStyles(theme => ({
  button: {
    backgroundColor: "#DDFF57 !important",
    color: "#431AB7 !important",
    fontSize: "18px !important",
  },
  progress: {
    width: "100%",
    height: "8px",
    background: "#9EACF2",
    borderRadius: 28,
    overflow: "hidden",
  },
  progressBar: {
    height: "8px",
    background: "#431AB7",
    borderRadius: 28,
  },
  highcolor: {
    color: "#431AB7",
  },
  table: {
    "& *": {
      fontFamily: "Agrandir",
    },
    "& .MuiTableContainer-root": {
      borderRadius: 16,
      "& .MuiTableRow-root.MuiTableRow-head": {
        backgroundColor: "#9EACF2",
        "& .MuiTableCell-root.MuiTableCell-head": {
          color: "white",
          textTransform: "none",
        },
      },
    },
  },
  timer: {
    backgroundColor: "#9EACF2",
    fontSize: 18,
    color: "#431AB7",
    fontWeight: 800,
    padding: "8px 12px",
    marginLeft: 4,
    borderRadius: 6,
  },
}));
