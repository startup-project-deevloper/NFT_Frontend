import { makeStyles } from "@material-ui/core";

export const myNFTCardStyles = makeStyles(theme => ({
  card: {
    background: "#431AB7",
    backdropFilter: "blur(4.82073px)",
    borderRadius: 11.3,
    clipPath: "polygon(100% 0%, 100% 80%,  50% 91%, 0% 80%, 0% 0%)",
    padding: 16,
    height: 516,
    width: "100%",
    cursor: "pointer",
  },
  innerBox: {
    background: "#9EACF2",
    boxShadow: "0px 1.67251px 1.67251px rgba(0, 0, 0, 0.03)",
    borderRadius: 11.3,
    clipPath: "polygon(100% 0%, 100% 80%,  50% 90%, 0% 80%, 0% 0%)",
    padding: 16,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#fff",
    "& img": {
      width: "100%",
      height: 250,
    },
    [theme.breakpoints.between(960, 980)]: {
      padding: 12,
    },
  },
  ntfName: {
    fontSize: 16,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "21px",
    textTransform: "capitalize",
    marginBottom: 8,
  },
  shadow: {
    width: 40,
    height: 5.25,
    background: "#431AB7",
    opacity: 0.2,
    filter: "blur(2.9269px)",
    marginTop: -24,
  },
  unLockLabel: {
    width: 86,
    padding: "7px 0 5px",
    color: "#DDFF57",
    fontSize: 11,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "14px",
    borderRadius: 8,
    border: "1px solid #DDFF57",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& span": {
      textAlign: "center"
    },
  },
  lockLabel: {
    width: 86,
    padding: "7px 11px 5px",
    color: "#431AB7",
    fontSize: 11,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "14px",
    borderRadius: 8,
    border: "1px solid #431AB7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& span": {
      textAlign: "center"
    },
  },
  nftModalButton: {
    cursor: "pointer",
    background: "#DDFF57",
    borderRadius: 4,
    textTransform: "uppercase",
    color: "#431AB7",
    fontWeight: "bold",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 46,
    marginTop: 12,
  }
}));
