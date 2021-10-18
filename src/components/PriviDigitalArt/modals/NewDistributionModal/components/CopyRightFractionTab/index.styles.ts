import { makeStyles } from "@material-ui/core/styles";

export const copyRightFractionTabStyles = makeStyles(() => ({
  generalNftMediaTab: {},
  flexRowInputs: {
    display: "flex",
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
  tooltipHeaderInfo: {
    verticalAlign: "top",
    marginLeft: 2,
    width: 14,
    height: 14,
    transform: "translateY(-5px)",
  },
  infoHeaderCreatePod: {
    fontSize: 18,
    fontWeight: 400,
    color: "black",
  },
  distribBox: {
    background: "#EFF2FD",
    borderRadius: 8,
    padding: "12px 12px 12px 20px",
    "& + &": {
      marginTop: 8,
    },
  },
  percentageBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 140,
    minWidth: 85,
    height: 45,
    background: "rgba(218, 230, 229, 0.4)",
    border: "1px solid #DADADB",
    borderRadius: 8,
    "& > input": {
      textAlign: "center",
    },
  },
  nameTypo: {
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "Montserrat",
    color: "#181818",
    lineHeight: "104.5%",
  },
  slugTypo: {
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "Montserrat",
    color: "#431AB7",
    lineHeight: "104.5%",
  },
}));
