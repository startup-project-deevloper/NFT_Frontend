import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/ui-kit";

export const useProcessingPaymentModalStyles = makeStyles(theme => ({
  root: {
    textAlign: "center",
    maxWidth: "681px !important",
    height: "625px !important",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  title: {
    fontFamily: "Agrandir GrandHeavy",
    fontSize: 22,
    fontWeight: 800,
    marginTop: 28,
    marginBottom: 4,
    "& span": {
      fontWeight: 400,
    },
  },
  header1: {
    fontSize: 16,
    fontWeight: 500,
    color: "#54658F",
    opacity: 0.9,
    width: "60%",
  },
  header2: {
    fontFamily: "Montserrat",
    fontSize: 16,
    fontWeight: 500,
    color: "#431AB7",
  },
  scanButton: {
    background: "#431AB7 !important",
    marginTop: "24px",
    borderRadius: "4px !important",
    fontFamily: "Agrandir",
    fontWeight: "bold",
    fontSize: "14px !important",
  },
}));
