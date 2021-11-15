import { makeStyles } from "@material-ui/core/styles";

export const withdrawnNFTPageStyles = makeStyles(theme => ({
  content: {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minHeight: "calc(100vh - 80px)",
    maxHeight: "calc(100vh - 80px)",
    overflowX: "hidden",
    padding: "50px 24px 0px",
    backgroundImage: `url(${require("assets/pixImages/fractionalise_background.png")})`,
    backgroundRepeat: "inherit",
    backgroundSize: "100% 100%",

    [theme.breakpoints.down("xs")]: {
      padding: "50px 12px 0px",
    },
  },
  title: {
    fontSize: 40,
    fontWeight: 800,
    fontFamily: "Agrandir GrandHeavy",
    color: "#431AB7",
    lineHeight: "104.5%",
    textTransform: "uppercase",
    display: "flex",
    width: "100%",
    justifyContent: "center",
    marginTop: 20,
    [theme.breakpoints.down(950)]: {
      fontSize: 35,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 22,
    },
  },
  detailsLabel: {
    color: "#431AB7",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "120%",
    marginBottom: "16px",
  },
  emptyBox: {
    background: "#EFF2FD",
    border: "1px solid rgba(67, 26, 183, 0.24)",
    boxSizing: "border-box",
    borderRadius: "20px",
    paddingTop: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: "calc(100vh - 238px)",
    marginTop: "-32px"
  },
}));
