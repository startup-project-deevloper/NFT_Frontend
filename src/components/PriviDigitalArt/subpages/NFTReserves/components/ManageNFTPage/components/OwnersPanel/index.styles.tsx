import { makeStyles } from "@material-ui/core/styles";

export const ownersPanelStyles = makeStyles(theme => ({
  content: {
    width: "100%",
    height: "100%",
    padding: 35,
    position: "relative",
    display: "flex",
    maxHeight: "calc(100vh - 200px)",
    minHeight: "calc(100vh - 200px)",
    overflowX: "hidden",
    overflowY: "auto",
    alignItems: "flex-start",
    flexDirection: "column",
  },
  infoPanel: {
    border: "1px solid #E8E3F6",
    borderRadius: "12px",
    marginBottom: 50,
  },
  subPanel: {
    borderRight: "1px solid #E8E3F6",
    padding: "20px 30px",
    display: "flex",
    flexDirection: "column",
  },
  infoTitle: {
    fontFamily: "Montserrat",
    fontSize: "14px",
    color: "#431AB7",
    marginBottom: 16,
    fontWeight: "bold",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
  },
  infoSubPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  infoLabel: {
    color: "#431AB7",
    opacity: 0.6,
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "Montserrat",
    marginBottom: 8,
  },
  infoValue: {
    color: "#431AB7",
    fontSize: "22px",
    fontWeight: 800,
  },
}));
