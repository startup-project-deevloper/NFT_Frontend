import { makeStyles } from "@material-ui/core/styles";

export const ClaimYourNFTModalStyles = makeStyles(theme => ({
  container: {
    maxWidth: "681px !important",
    padding: "50px 70px !important",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  infoPanel: {
    marginTop: 17,
    marginBottom: 34,
    borderRadius: "16px",
    padding: 19,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#eceefc",
    color: "#431AB7",
  },
  divider: {
    background: "#431AB7",
    opacity: 0.2,
    margin: "0 36px",
    width: 1,
    height: 28,
  },
  infoLabel: {
    fontSize: 16,
    marginBottom: 12,
  },
  infoValueRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoValue: {
    fontSize: 16,
    fontFamily: "Agrandir GrandHeavy",
  },
  confirmButton: {
    background: "#431AB7 !important",
    color: "#ffffff",
    width: "100% !important",
    fontSize: "14px",
  },
  title: {
    fontFamily: "Agrandir GrandHeavy",
    color: "#2D3047",
    fontSize: "22px",
    fontWeight: 800,
  },
  description: {
    color: "#54658F",
    fontSize: "16x",
    fontWeight: 500,
    marginTop: "20px",
    opacity: 0.9,
    width: "70%",
    textAlign: "center",
  },
  card: {
    transform: "scale(0.8)",
    position: "relative",
  },
  checkMark: {
    width: "103px",
    height: "103px",
    background: "linear-gradient(0deg, #F4F2FB, #F4F2FB), #17172D",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: -22,
    left: "calc(50% - 52px)",
  },
}));
