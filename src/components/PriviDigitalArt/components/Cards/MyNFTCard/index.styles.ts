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
    minWidth: 250
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
  nftName: {
    fontSize: 14,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "16px",
    textTransform: "capitalize",
    color: '#1A1B1C',
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
    height: 20,
    padding: "6px 8.5px",
    color: "#431AB7",
    fontSize: 9,
    fontWeight: 700,
    fontFamily: "Agrandir",
    lineHeight: "100%",
    borderRadius: 6,
    background: '#DDFF57',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: 'uppercase',
    "& span": {
      textAlign: "center"
    },
  },
  lockLabel: {
    height: 20,
    padding: "6px 8.5px",
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: 700,
    fontFamily: "Agrandir",
    lineHeight: "100%",
    borderRadius: 6,
    background: '#F2604C',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: 'uppercase',
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
