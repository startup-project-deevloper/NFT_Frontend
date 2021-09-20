import { makeStyles } from "@material-ui/core";
import { Color } from "shared/ui-kit";

export const podsPageStyles = makeStyles(theme => ({
  content: {
    background: "#F0F5F8",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "60px 168px 150px 168px",
    overflowY: "auto",
    overflowX: "hidden",
    position: "relative",
    [theme.breakpoints.down("lg")]: {
      padding: "60px 140px 150px",
    },
    [theme.breakpoints.down("md")]: {
      padding: "60px 80px 150px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "60px 40px 150px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "60px 20px 150px",
    },
  },
  gradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
    background:
      "linear-gradient(180deg, rgba(243, 254, 247, 0) 19.46%, #F0F5F8 73.29%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)",
  },
  green1: {
    position: "absolute",
    width: "279px",
    right: "48px",
    top: "-60px",
  },
  green2: {
    position: "absolute",
    width: "132px",
    left: "168px",
    top: "110px",
    [theme.breakpoints.down(1230)]: {
      top: 190,
    },
    [theme.breakpoints.down(900)]: {
      top: 190,
      left: 10,
    },
    [theme.breakpoints.down(600)]: {
      top: 190,
      left: -50,
    },
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 58,
    color: "#ffffff",
    fontFamily: "Agrandir",
    lineHeight: "75px",
    fontWeight: 400,
    "& span": {
      fontWeight: 900,
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "52px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "40px",
    },
  },
  header1: {
    fontSize: 22,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "130%",
  },
  header2: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: 400,
    fontFamily: "Montserrat",
    letterSpacing: "0.02em",
    lineHeight: "150%",
    marginBottom: 26,
    "& span": {
      fontWeight: 600,
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "24px",
    },
    [theme.breakpoints.down(750)]: {
      fontSize: "20px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "14px",
    },
  },
  header3: {
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "Montserrat",
    lineHeight: "18px",
  },
  header4: {
    fontSize: 14,
    fontWeight: 600,
  },
  header5: {
    fontSize: 16,
    fontWeight: 800,
    lineHeight: "130%",
  },
  tabItem: {
    color: Color.MusicDAODark,
    opacity: 0.5,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px ${theme.spacing(1)}px`,
    cursor: "pointer",
  },
  tabItemActive: {
    borderBottom: "1px solid #000000",
    opacity: 1,
  },
  whiteBox: {
    borderRadius: theme.spacing(4),
    background: "white",
    boxShadow: "0px 33px 35px -18px rgba(29, 103, 84, 0.13)",
    padding: theme.spacing(3),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  percentValueBox: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
    borderRadius: theme.spacing(2),
    display: "flex",
    alignItems: "center",
  },
  secondButtonBox: {
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
    borderRadius: theme.spacing(4),
    cursor: "pointer",
    border: "1px solid #2D3047",
    display: "flex",
    alignItems: "center",
  },
  graphBox: {
    background: "white",
    borderRadius: theme.spacing(4),
    padding: theme.spacing(4),
  },
  controlBox: {
    display: "flex",
    alignItems: "center",
    background: "#F0F5F8",
    borderRadius: theme.spacing(4),
  },
  buttonBox: {
    borderRadius: theme.spacing(4),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    color: "#2D3047",
    cursor: "pointer",
  },
  selectedButtonBox: {
    background: "#2D3047",
    color: "white",
  },
  filterContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    zIndex: 1,
    [theme.breakpoints.down("xs")]: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      flexDirection: "column",
      rowGap: 35,
      alignItems: "flex-end",
    },
  },
  optionSection: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      justifyContent: "flex-end",
    },
  },
  selectedFilterButtonBox: {
    background: Color.MusicDAODark,
    display: "flex",
    alignItems: "center",
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(4),
    cursor: "pointer",
    color: "white",
  },  
  filterButtonBox: {
    background: "rgba(240, 245, 248, 0.7)",
    display: "flex",
    alignItems: "center",
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(4),
    cursor: "pointer",
    [theme.breakpoints.down("xs")]: {
      padding: "8px 14px",
    },
    color: Color.MusicDAODark,
  },
}));
