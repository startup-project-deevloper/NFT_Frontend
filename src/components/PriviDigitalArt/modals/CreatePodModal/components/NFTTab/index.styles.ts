import { makeStyles } from "@material-ui/core";
import { Color } from "shared/ui-kit";

export const nftTabStyles = makeStyles(() => ({
  button: {
    width: "100% !important",
    background: "rgba(67, 26, 183, 1) !important",
    color: "#FFF !important",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "16px 0px",
  },
  title: {
    fontFamily: "Agrandir GrandLight",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "18px",
    lineHeight: "130%",
    color: "#2D3047",
    marginBottom: "36px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#2D3047",
    opacity: 0.9,
    fontFamily: "Montserrat",
    fontSize: "16px",
    fontWeight: 600,
    marginBottom: "8px",
  },
  input: {
    background: "transparent",
    border: "1px solid #DADADB",
    borderRadius: 8,
    height: 45,
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
  },
  textarea: {
    border: "1px solid #DADADB",
    borderRadius: 8,
    width: "100%",
    padding: "10px 20px",
  },
  card: {
    background: "transparent",
    border: "1px solid rgba(84, 101, 143, 0.2)",
    borderRadius: 0,
    padding: 0,
  },
  editButton: {
    color: "rgba(67, 26, 183, 1) !important",
    border: "none !important",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    "& svg": {
      marginRight: 8,
      width: 15,
      height: 15,
    },
  },
}));
