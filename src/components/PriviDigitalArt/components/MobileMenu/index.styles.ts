import { makeStyles } from "@material-ui/core/styles";

export const useMobileMenuStyles = makeStyles(theme => ({
  container: {
    width: "100vw",
    padding: "16px 38px",
    marginBottom: "-16px",
    height: "fit-content",
    minHeight: theme.spacing(8),
    zIndex: 1,
    [theme.breakpoints.down("sm")]: {
      padding: 16,
      marginBottom: 0,
    },
    [theme.breakpoints.down("xs")]: {
      paddingBottom: 5,
      overflowX: "scroll",
      "&::-webkit-scrollbar-thumb": {
        background: "rgb(193 186 186 / 36%)",
      },
    },
  },
  content: {
    display: "flex",
    alignItems: "center",
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
      paddingTop: 4,
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
