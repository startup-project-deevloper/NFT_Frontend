import { makeStyles } from "@material-ui/core";

export const tokenomicsTabStyles = makeStyles(() => ({
  tokenomicsTab: {
    margin: 0,
    padding: 0,
    width: "100%",
    flexGrow: 1,
  },
  headerBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 36,
    marginBottom: 36,
    borderBottom: "1px solid #35385633",
    "& img": {
      width: 140,
      height: 140,
      borderRadius: "100%",
      marginRight: 28,
    },
    "& span": {
      fontSize: 14,
      color: "#54658F",
      fontWeight: 500,
    },
  },
  headerTitle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
    "& > div:first-child": {
      paddingRight: 60,
      borderRight: "1px solid #35385633",
    },
    "& > div:last-child": {
      paddingLeft: 60,
    },
    "& p:first-child": {
      margin: 0,
      fontSize: 16,
      fontWeight: 600,
      color: "#54658F",
    },
    "& p:last-child": {
      margin: 0,
      marginTop: 8,
      fontSize: 24,
      fontWeight: 800,
      color: "#2D3047",
    }
  },
  valueBox: {
    "& p": {
      margin: 0,
      marginBottom: 8,
      fontWeight: 600,
      fontSize: 16,
      color: "#2D3047"
    },
    "& span": {
      fontWeight: 700,
      fontSize: 20,
      color: "#65CB63"
    },
  },
  footerBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
    paddingTop: 30,
    borderTop: "1px solid #35385633",
    "& span:first-child": {
      fontWeight: 600,
      fontSize: 16,
      color: "#2D3047"
    },
    "& span:last-child": {
      fontWeight: 600,
      fontSize: 18,
      color: "#54658F"
    },
  }
}));
