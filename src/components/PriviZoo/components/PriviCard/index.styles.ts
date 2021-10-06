import { makeStyles } from "@material-ui/core/styles";

export const priviCardStyles = makeStyles(theme => ({
  container: {
    position: "relative",
    borderRadius: theme.spacing(2),
    boxShadow: "0px 15.4491px 60.249px -12.3592px rgba(0, 0, 0, 0.36)",
    border: "1px solid #E9E9E9",
    minHeight: "360px",
    overflow: "hidden",
    background: "white",
    height: "100%",
    cursor: "pointer",
    paddingBottom: 20,
  },
  topImg: {
    width: "100%",
    height: "250px",
    objectFit: `cover`,
  },
  header1: {
    fontSize: "20px",
  },
  header2: {
    fontSize: "12px",
    minHeight: "30px"
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomBox: {
    borderTop: "1px solid #18181822",
    width: "100%",
    padding: theme.spacing(2),
  },
  comingSoon: {
    color: "#4218B5",
    fontSize: 12,
    fontWeight: 600,
    padding: "3px 11px",
    background: "rgba(87, 60, 255, 0.2)",
    borderRadius: 4,
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 2,
    width: 106,
  },
  testNet: {
    color: "#18B56A",
    fontSize: 12,
    fontWeight: 600,
    padding: "3px 11px",
    background: "rgba(61, 220, 48, 0.2)",
    borderRadius: 4,
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 2,
    width: 106,
  },
  shadowBox: {
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
    borderRadius: "16px",
    color: "black",
    fontSize: "10px",
    padding: theme.spacing(0.5),
    background: "white",
  },
  rateIcon: {
    marginRight: "4px",
    width: "12px",
    height: "12px",
  },
  emptyRateIcon: {
    marginRight: "4px",
    width: "12px",
    height: "12px",
  },
}));
