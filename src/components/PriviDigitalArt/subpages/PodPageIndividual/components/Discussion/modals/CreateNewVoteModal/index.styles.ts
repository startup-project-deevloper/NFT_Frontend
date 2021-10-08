import { makeStyles } from "@material-ui/core/styles";

export const newVoteModalStyles = makeStyles(theme => ({
  contentBox: {
    padding: theme.spacing(1),
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  title: {
    fontSize: "22px",
    fontWeight: 800,
  },
  header1: {
    fontSize: "16px",
    fontWeight: 600,
  },
  header2: {
    fontSize: "14px",
    color: "#54658F",
    fontWeight: 600,
  },
  controlBox: {
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    border: "1px solid #E0E4F3",
  },
  datepicker: {
    width: "100%",
    "& .MuiOutlinedInput-adornedEnd": {
      paddingRight: 0,
      "& .MuiInputAdornment-positionEnd": {
        marginLeft: 0,
      },
    },
  },
}));
