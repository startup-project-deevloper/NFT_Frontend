import { makeStyles } from "@material-ui/core/styles";

export const topNFTCardStyles = makeStyles(theme => ({
  card: {
    background: "linear-gradient(172.76deg, rgba(255, 255, 255, 0.7) 51.5%, rgba(255, 255, 255, 0) 123.53%)",
    borderRadius: 11.3,
    clipPath: "polygon(100% 0%, 100% 80%,  50% 91%, 0% 80%, 0% 0%)",
    padding: 8,
    height: 354,
    width: 243,
    cursor: "pointer",
  },
  innerBox: {
    background: "#431AB7",
    borderRadius: 11.3,
    clipPath: "polygon(100% 0%, 100% 80%,  50% 90%, 0% 80%, 0% 0%)",
    padding: 16,
    height: 338,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#fff",
    "& img": {
      width: 195,
      height: 160,
    },
  },
  starGroup: {
    display: "flex",
    alignItems: "center",
    marginTop: 8,
  },
  ntfName: {
    fontSize: 16,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "21px",
    textTransform: "capitalize",
    marginBottom: 8,
  },
  priceSection: {
    display: "flex",
    alignItems: "center",
    fontSize: 16,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "21px",
    letterSpacing: "0.02em",
  },
  shadow: {
    width: 40,
    height: 5.25,
    background: "#431AB7",
    opacity: 0.2,
    filter: "blur(2.9269px)",
    marginTop: -24,
  },
}));
