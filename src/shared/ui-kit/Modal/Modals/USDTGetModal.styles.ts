import { makeStyles } from "@material-ui/core";

export const usdtGetModalStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: "white",
    borderRadius: 32,
    width: "560px !important",
    maxWidth: "none !important",
  },
  title: {
    fontSize: 22,
    marginTop: 32,
    marginBottom: 32,
    fontFamily: "Agrandir",
    textAlign: "center",
    color: "#431AB7",
    textTransform: "capitalize",
  },
  description: {
    fontSize: 18,
    fontWeight: 400,
    lineHeight: "27px",
    textAlign: "center",
    marginTop: 0,
    marginBottom: 32,
    width: "calc(100% - 16px)",
    "& span": {
      fontFamily: "Agrandir TextBold",
      color: "#431AB7",
    },
    "& strong": {
      fontFamily: "Agrandir TextBold",
    }
  },
  button: {
    padding: "0px 50px !important",
    fontSize: "14px !important",
    color: "white !important",
    backgroundColor: "#431AB7 !important",
    display: "flex",
    alignItems: "center"
  },
}));
