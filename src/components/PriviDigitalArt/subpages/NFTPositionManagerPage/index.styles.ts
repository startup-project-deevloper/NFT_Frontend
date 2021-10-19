import { makeStyles } from "@material-ui/core/styles";

export const useNFTPositionManagerPageStyles = makeStyles(theme => ({
  main: {
    position: 'relative',
    width: 'calc(100% - 208px)',
    "@media (max-width: 768px)": {
      width: '100%',
    },
  },
  content: {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minHeight: "calc(100vh - 80px)",
    maxHeight: "calc(100vh - 80px)",
    overflowX: "hidden",
    position: "relative",
    padding: "45px 0",
    "& > div > h2": {
      paddingTop: 30,
      fontFamily: "Agrandir GrandHeavy",
      fontWeight: "800",
      fontSize: "40px",
      lineHeight: "104.5%",
      margin: 0,
      color: "#431AB7",
      [theme.breakpoints.down("xs")]: {
        fontSize: "20px",
      },
      "& span": {
        fontSize: "18px",
        lineHeight: "23px",
      },
    },
    "& > h3": {
      marginTop: "64px",
      fontSize: "30px",
      lineHeight: "104.5%",
      marginBottom: "16px",
    },
    [theme.breakpoints.down('md')]: {
      padding: '63px 30px',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '63px 20px',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '15px 0px',
    },
  },
  absoluteImage: {
    top: "-10px",
    left: "85%",
    position: "absolute",
    height: "187.96px",
    transform: "rotate(3.22deg)",

    "@media (max-width: 1200px)": {
      display: 'none',
    },
  },
  tab: {
    fontFamily: "Agrandir GrandHeavy",
    marginRight: 135,
    fontStyle: "normal",
    fontSize: 16,
    lineHeight: "104.5%",
    color: "#431AB760",
    cursor: "pointer",
    border: "none",
    padding: "0 12px 12px",
    [theme.breakpoints.down("sm")]: {
      marginRight: 50,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 10,
      padding: "0 0 10px",
      "&:first-child": {
        marginRight: "30px"
      },
      "&:last-child": {
        marginRight: "0px"
      }
    },
  },
  selectedTab: {
    color: "#431AB7",
    borderBottom: "4px solid #431AB7",
    opacity: 1,
  },
}));
