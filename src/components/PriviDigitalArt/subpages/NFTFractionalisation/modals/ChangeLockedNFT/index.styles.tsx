import { makeStyles } from "@material-ui/core";

export const ChangeLockedNFTStyles = makeStyles(theme => ({
  root: {
    maxWidth: "700px !important",
  },
  title: {
    fontSize: 20,
    fontWeight: 800,
    lineHeight: "104.5%",
    color: "#181818",
  },
  description: {
    fontSize: 16,
    lineHeight: "150%",
    color: "rgba(24, 24, 24, 0.7)",
  },
  icon: {
    width: 160,
    height: "100%",
    marginBottom: 30,
  },
  proceedBtn: {
    height: 34,
    backgroundColor: "#431AB7",
    color: "white",
    padding: "8px 58px",
    fontSize: 14,
    fontWeight: 800,
    borderRadius: 4,
    width: "100%",
  },
}));
