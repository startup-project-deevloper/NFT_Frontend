import { makeStyles } from "@material-ui/core/styles";

export const userCardStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: 158,
    minWidth: 158,
    height: 183,
    background: "#ffffff",
    boxShadow: "0px 4px 8px #9EACF2",
    borderRadius: 18,
    userSelect: "none",
    cursor: "pointer",
    padding: "16px 8px 17px",
    "&:not(:first-child)": {
      marginLeft: "22px",
    },
  },
  avatar: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
    cursor: 'pointer',
    "& img": {
      border: "none",
      height: 58,
      width: 58,
    },
  },
  title: {
    fontSize: 14,
    fontFamily: 'Agrandir',
    fontWeight: 400,
    color: "#181818",
    textAlign: "center",
  },
  userName: {
    fontWeight: 700,
    fontSize: 11,
    fontFamily: 'Agrandir',
    color: "#431AB7",
    textAlign: "center",
    margin: "5px 10px 0",
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
  },
  icon: {
    width: 24,
    height: 24,
  },
  statusVerify: {
    fontSize: 12,
    fontWeight: 500,
    fontFamily: 'Montserrat',
    color: "#707582",
    marginLeft: 7,
  },
  statusInvite: {
    fontSize: 12,
    color: "#707582",
    marginLeft: 7,
  },
}));
