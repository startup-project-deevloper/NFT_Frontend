import { makeStyles } from "@material-ui/core/styles";

export const copyRightFractionTabStyles = makeStyles(() => ({
  generalNftMediaTab: {
    maxHeight: 400,
    overflow: "auto",
  },
  distribBox: {
    background: "rgba(236, 240, 244, 0.4)",
    borderRadius: 12,
    padding: "16px 28px 16px 22px",
    "& + &": {
      marginTop: 8,
    }
  },
  investorBox: {
    background: "linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D",
    borderRadius: 8,
    padding: "24px 28px 24px 22px",
    marginBottom: 8,
    "& div:first-child": {
      fontSize: 18,
      fontWeight: 600,
      color: "#181818",
    },
    "& div:last-child": {
      fontSize: 18,
      fontWeight: 500,
      color: "#65CB63",
    },
  },
  percentageBox: {
    fontSize: 18,
    fontWeight: 500,
    color: "#54658F",
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
    color: "#65CB63",
    lineHeight: "104.5%",
  },
  tabBox: {
    background: "#54658F",
    borderRadius: 30,
    fontSize: 11,
    fontWeight: 500,
    color: "white",
    padding: "5px 9px",
  }
}));