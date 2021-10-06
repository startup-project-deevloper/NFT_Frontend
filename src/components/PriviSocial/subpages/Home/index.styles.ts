import { makeStyles } from "@material-ui/core/styles";
import { Gradient } from "shared/ui-kit";
import { Color } from "shared/constants/const";

export const homeStyles = makeStyles(theme => ({
  home: {
    minHeight: "calc(100vh - 96px)",
    maxWidth: 1200,
    margin: "auto",
    width: "100%",
    color: "#707582",
    marginTop: 24,
    "& h2": {
      color: "#707582 !important",
      [theme.breakpoints.down("xs")]: {
        fontSize: 36
      },
    },
  },
  navigation: {
    marginBottom: 28,
    fontSize: 14,
    display: "flex",
  },
  tabCard: {
    marginRight: 80,
    color: "#707582",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 8,
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      marginRight: 10,
    },
    [theme.breakpoints.down("xs")]: {
      marginRight: 0,
    },
  },
  tabCardSelected: {
    background: "#eff2f8",
    borderRadius: 8,
  },
  subTab: {
    marginRight: 11,
    borderRadius: 24,
    padding: "11px 0px",
    display: "flex",
    justifyContent: "center",
    width: 110,
    fontWeight: 800,
    fontSize: 14,
    lineHeight: "18px",
    backdropFilter: "blur(10px)",
    cursor: "pointer",
    background: "transparent",
    border: "1.5px solid #707582",
    color: "#707582",
    "&:last-child": {
      marginRight: 0,
    },
  },
  subTabSelected: {
    marginRight: 11,
    borderRadius: 24,
    padding: "11px 0px",
    display: "flex",
    justifyContent: "center",
    width: 110,
    fontWeight: 800,
    fontSize: 14,
    lineHeight: "18px",
    backdropFilter: "blur(10px)",
    cursor: "pointer",
    color: "#ffffff",
    background: "#707582",
  },
  header: {
    height: 215,
    borderRadius: "16px 16px 0px 0px",
    background:
      "conic-gradient( from 111.31deg at 50% 51.67%, #b1ff00 -118.12deg, #00ff15 110.62deg, #b1ff00 241.88deg, #00ff15 470.63deg)",
    cursor: 'pointer'
  },
  avatar: {
    border: "4px solid #ffffff",
    marginLeft: 40,
    marginTop: -80,
    width: 160,
    height: 160,
    borderRadius: "50%",
  },
  statLine: {
    display: "flex",
    alignItems: "center",
    color: "#707582",
    justifyContent: "space-around",
  },
  indexBadge: {
    "& .hex": {
      marginRight: 0,
    },
    width: 40,
    "&:not(:last-child)": {
      marginRight: -25,
    },
  },
  badgeMore: {
    cursor: "pointer",
    marginLeft: 10,
    zIndex: 2,
    background: Gradient.Green,
    color: "white",
    borderRadius: 10,
    padding: "4px 8px",
  },
  chartContainer: {
    "& > div": {
      overflow: "hidden",
      background: "rgba(239, 242, 248, 1)",
      boxShadow: "0px 25px 36px -11px rgba(0, 0, 0, 0.02)",
      borderRadius: 20
    },
    "& h3": {
      marginTop: 0,
      fontWeight: 800,
      fontSize: 22,
      marginBottom: 30,
    },
  },
  chartWrapper: {
    position: "relative",
    height: 290,
    backgroundColor: "#FFF",
    borderRadius: 16,
    "& canvas": {
      borderRadius: 16,
    }
  },
  tradeInfoBox: {
    justifyContent: "center",
    "& h2": {
      fontWeight: 800,
      fontSize: 22,
      color: Color.MusicDAOLightBlue,
      marginBottom: 10,
    },
    "& span": {
      fontSize: 14,
      fontWeight: 500,
      color: Color.MusicDAOLightBlue,
    }
  },
  chartInfo: {
    background: "transparent",
    padding: "12px 14px",
    position: "absolute",
    left: 15,
    top: 15,
    "& span": {
      color: "rgba(112, 117, 130, 1)",
      fontSize: 16,
      fontWeight: 800,
    },
    "& p": {
      color: "#FFF",
      background: "rgba(126, 218, 94, 1)",
      padding: "8px 16px",
      marginTop: 8,
      marginBottom: 0,
      fontSize: 14,
      display: "flex",
      alignItems: "center",
      boxShadow: "0px 1.47425px 5.89702px rgba(0, 0, 0, 0.2)",

      "& h4": {
        margin: 0,
        fontSize: 18,
        fontWeight: 800,
        marginRight: 10,
      },
    }
  },
}));
