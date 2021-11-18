import { makeStyles } from "@material-ui/core/styles";
import { after } from "lodash";

export const cardStyles = makeStyles(theme => ({
  outerCard: {
    background: "#431AB7",
    boxShadow: "0px 3px 1.50913px rgba(0, 0, 0, 0.3)",
    borderRadius: 12,
    cursor: "pointer",
    height: "fit-content",
    padding: 9,
    backdropFilter: "blur(3.59442px)",
  },
  innerCardGradient: {
    padding: "2px",
    boxShadow: "0px 3px 1.50913px rgba(0, 0, 0, 0.3)",
    borderRadius: "12px",
    backgroundImage: "linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 108.25%)",
  },
  innerCard: {
    padding: "7px",
    borderRadius: "10px",
    color: "white",
    background: "#5F2AF4",
  },
  cardTitle: {
    marginBottom: "9px",
  },
  cardNftName: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "12px",
    lineHeight: "16px",
    letterSpacing: "0.02em",
    textTransform: "capitalize",
  },
  cardOptionButton: {
    float: "right",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "6px 8px",
    background: "rgba(190, 167, 255, 0.6)",
    borderRadius: "5.90529px",
    flex: "none",
    order: 1,
    flexGrow: 0,
    margin: "0px 5.96494px",
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "8.26741px",
    position: "absolute",
    right: 4,
    top: 8,
  },
  cardImg: {
    marginBottom: "-20px",
    position: "relative",
  },
  cardContent: {
    padding: "0px 8px",
  },
  cardContentDiv: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "6px",
  },
  cardContentText: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "12px",
    lineHeight: "17px",
    textAlign: "center",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    color: "#FFFFFF",
    opacity: 0.8,
  },
  cardContentAmount: {
    float: "right",
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "12.3951px",
    lineHeight: "16px",
    textAlign: "center",
    letterSpacing: "0.02em",
    textTransform: "capitalize",
    color: "#FFFFFF",
  },
  divider: {
    height: 1,
    width: "calc(100% + 14px)",
    background: "#6C3BF5",
    marginLeft: -7,
    marginBottom: 13,
  },
  userName: {
    display: "flex",
    alignItems: "center",
    "& span": {
      marginLeft: 10,
      color: "#FFFFFF",
      opacity: 0.7,
      fontFamily: "Montserrat",
      fontWeight: 600,
      fontSize: 12,
    },
  },
}));
