import { makeStyles } from "@material-ui/core";

export const switchNetworkModalStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: "#9EACF2 !important",
    borderRadius: 32,
    padding: 40,
    width: "608px !important",
    maxWidth: "none !important",
  },
  warning: {
    fontSize: 65,
    [theme.breakpoints.down('sm')]: {
      fontSize: 51,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 40,
    }
  },
  title: {
    fontSize: 31,
    fontWeight: 800,
    marginTop: 32,
    marginBottom: 32,
    fontFamily: "Agrandir",
    color: 'white',
    [theme.breakpoints.down('sm')]: {
      fontSize: 26,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 24,
    }
  },
  description: {
    fontSize: 18,
    fontWeight: 400,
    lineHeight: "23px",
    textAlign: "center",
    marginTop: 0,
    marginBottom: 32,
    color: 'white',
    "& span": {
      fontWeight: 800,
      fontFamily: "Agrandir",
    },
  },
  button: {
    padding: "0px 70px !important",
    fontSize: "14px !important",
    fontWeight: 700,
    color: "white !important",
    backgroundColor: "#431AB7 !important"
  },
}));
