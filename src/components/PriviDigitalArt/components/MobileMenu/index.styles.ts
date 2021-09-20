import { makeStyles } from "@material-ui/core";

export const useMobileMenuStyles = makeStyles(theme => ({
  container: {
    width: "100vw",
    padding: "16px 38px",
    marginBottom: "-16px",
    height: "fit-content",
    minHeight: theme.spacing(8),
    zIndex: 1,
    [theme.breakpoints.down("xs")]: {
      padding: 16,
      paddingRight: 0,
      paddingBottom: 5,
      overflowX: "scroll",
      "&::-webkit-scrollbar-thumb": {
        background: "rgb(193 186 186 / 36%)",
      },
    },
    [theme.breakpoints.down("sm")]: {
      padding: "16px 16px",
    },
  },
  content: {
    height: "fit-content",
    minHeight: 0,

    "& *": {
      height: "fit-content",
      minHeight: 0,
      minWidth: 0,
    },
  },
  tab: {
    padding: "8px 16px",
    minHeight: theme.spacing(4),
    height: "auto",
    "& *": {
      fontFamily: "Agrandir",
      padding: 0,
      margin: 0,
      color: "#9EACF2",
      fontSize: "14px",
      lineHeight: "16px",
    },
  },
  selected: {
    borderRadius: "16px",
    background: "#9EACF2",
    "& *": {
      color: "#DDFF57",
    },
  },
}));
