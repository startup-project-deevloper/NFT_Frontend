import { makeStyles } from "@material-ui/core/styles";

export const modifyRulesModalStyles = makeStyles(theme => ({
  root: {
    width: "640px !important",
  },
  maxWidth: {
    width: "100%",
    "& *": {
      width: "100% !important",
    },
  },
  alertMessage: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));
