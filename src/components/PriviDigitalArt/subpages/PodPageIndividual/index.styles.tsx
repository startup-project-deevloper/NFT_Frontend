import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/ui-kit";

export const usePodPageIndividualStyles = makeStyles(theme => ({
  container: {
    background: "#fff",
    height: `calc(100vh - 80px)`,
    padding: "60px",
    width: "100%"
  },
  subContainer: {
    width: "100%",
    overflowY: "auto",
    scrollbarWidth: "none",
    height: "calc(100vh - 80px)",
    paddingBottom: "80px",
  },
  fractionBox: {
    color: "white",
    borderRadius: 8,
    padding: "4px 11px",
    fontSize: "14px",
    background: "#65CB63",
    fontWeight: 600,
    fontFamily: "Montserrat",
  },
  title: {
    fontSize: 44,
    fontWeight: 800,
    lineHeight: "104.5%",
    fontFamily: "Agrandir",
    color: "#081831",
    textShadow: "0px 0px 20px rgba(255, 255, 255, 0.3)",
    marginTop: 16,
    [theme.breakpoints.down("xs")]: {
      fontSize: 20,
    },
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  header1: {
    fontSize: 14,
    fontWeight: 400,
    fontFamily: "Agrandir",
    color: "#707582",
    lineHeight: "140%",
  },
  header2: {
    fontSize: "20px",
    fontWeight: 400,
    color: "#2D3047",
  },
  header3: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#2D3047",
    fontFamily: "Montserrat",
  },
  header4: {
    fontSize: 22,
    fontWeight: 800,
    color: Color.MusicDAODark,
  },
  headerBox: {
    backgroundSize: "cover",
    backgroundRepeat: "none",
  },
  backgroundBox: {
    padding: "32px 168px",
    backgroundSize: "cover",
    backdropFilter: "blur(60px)",
    [theme.breakpoints.down("md")]: {
      padding: "32px 84px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "32px 16px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "32px 16px",
    },
  },
  divider: {
    border: "1px dashed #181818 !important",
  },
  paper: {
    width: 267,
    marginLeft: -90,
    marginTop: 16,
    borderRadius: 10,
    boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)",
    position: "inherit",
    [theme.breakpoints.down(1280)]: {
      marginLeft: -40,
    },
    [theme.breakpoints.down(960)]: {
      marginLeft: -16,
    },
  },
  svgBox: {
    width: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    "& svg": {
      width: "100%",
      height: "100%",
    },
    "& path": {
      stroke: "black",
    },
  },
  followButton: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
    "& svg": {
      width: 10,
      height: 10,
    },
    "& path": {
      stroke: "black",
    },
  },
  tagBox: {
    background: "rgba(175, 172, 215, 0.3)",
    padding: "5px 10px",
    borderRadius: 5,
    fontSize: 10,
    fontWeight: 600,
    lineHeight: "12px",
    color: "#2D3047",
    fontFamily: "Montserrat",
    marginRight: 4,
  },
  tabBox: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    borderRadius: theme.spacing(4),
    color: "#181818",
    fontWeight: 500,
    fontSize: 14,
    cursor: "pointer",
    "& + &": {
      marginLeft: 36,
    },
    [theme.breakpoints.down("sm")]: {
      padding: "8px",
      "& + &": {
        marginLeft: 18,
      },
    },
    [theme.breakpoints.down("xs")]: {
      padding: "6px 2px",
      "& + &": {
        marginLeft: 8,
      },
    },
  },
  selectedTabBox: {
    background: "#2D3047",
    color: "#ffffff",
  },
  timeBox: {
    background: "linear-gradient(87.82deg, #A0D800 20.18%, #0DCC9E 78.08%)",
    borderRadius: 6,
    fontSize: 16,
    fontWeight: 700,
    color: "#ffffff",
    fontFamily: "Montserrat",
    padding: "7px 11px",
    "& + &": {
      marginLeft: 4,
    },
    [theme.breakpoints.down("md")]: {
      fontSize: 12,
    },
  },
  title2: {
    fontSize: 22,
    color: "#2D3047",
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "130%",
  },
  title3: {
    fontSize: 14,
    color: "#707582",
    fontWeight: 500,
    fontFamily: "Montserrat",
    lineHeight: "104.5%",
    cursor: "pointer",
    "& span": {
      marginRight: 8,
    },
  },
  podSubPageHeader: {
    display: "flex",
    alignItems: "center",
    padding: "8px 168px",
    borderBottom: "1px solid #00000022",
    borderTop: "1px solid #00000022",
    [theme.breakpoints.down("md")]: {
      padding: "8px 84px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "8px 32px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "8px 16px",
    },
  },
  artistsBox: {
    display: "flex",
    alignItems: "center",
    padding: "0px 168px",

    [theme.breakpoints.down("md")]: {
      padding: "0px 84px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "0px 32px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "0px 16px",
    },
  },
  artistsMainContent: {
    display: "flex",
    alignItems: "center",
    padding: "0px 168px",
    marginBottom: 32,
    overflowX: "auto",

    [theme.breakpoints.down("md")]: {
      padding: "0px 84px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "0px 32px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "0px 16px",
    },
  },
  whiteBox: {
    display: "flex",
    alignItems: "center",
    background: "white",
    opacity: "0.8",
    justifyContent: "space-between",
    padding: "16px 168px",

    [theme.breakpoints.down("md")]: {
      padding: "16px 84px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "16px 32px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "16px 0px",
      flexDirection: "column",
      justifyContent: "center",
    },
  },
  podSubPageContent: {
    padding: "32px 168px",
    [theme.breakpoints.down("md")]: {
      padding: "32px 84px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "32px 32px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "16px",
    },
  },
  valueBox: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    background: "white",
    opacity: 0.8,
    justifyContent: "space-between",
    padding: `${theme.spacing() * 3}px ${theme.spacing() * 20}px`,
    "& > div": {
      padding: 8,
    },
    [theme.breakpoints.down(1200)]: {
      padding: `${theme.spacing() * 3}px ${theme.spacing() * 1}px`,
    },
  },
  contentBody: {
    padding: `${theme.spacing() * 4}px ${theme.spacing() * 21}px`,
    [theme.breakpoints.down(1200)]: {
      padding: `${theme.spacing() * 4}px ${theme.spacing() * 2}px`,
    },
  },
  artistBox: {
    display: "flex",
    flexWrap: "wrap",
    "& > div": {
      margin: 8,
    },
  },
  accordion: {
    background: "transparent",
    boxShadow: "none",
    marginTop: "0 !important",
    "&:before": {
      display: "none",
    },
    "& .MuiAccordionSummary-root": {
      padding: 0,
      "& .MuiAccordionSummary-content": {
        margin: 0,
      },
    },
    "& .MuiAccordionDetails-root": {
      padding: 0,
    },
  },
  contentBox: {
    display: "flex",
    flexDirection: "column",
    borderRadius: theme.spacing(1),
    background: "white",
    height: theme.spacing(70),
    textAlign: "center",
    padding: theme.spacing(2),
  },
  commonBtn: {
    fontSize: "14px !important",
    borderRadius: "46px !important",
  },
  showAllBtn: {
    width: "150px !important",
    border: `1px solid #65CB63 !important`,
    backgroundColor: "transparent !important",
    color: `${Color.MusicDAODark} !important`,
    position: "relative",
  },
  createWallBtn: {
    width: "150px !important",
    backgroundColor: "#65CB63 !important",
  },
  discussionBtn: {
    backgroundColor: "#2D3047 !important",
  },
  createPollBtn: {
    backgroundColor: "#7F6FFF !important",
  },
  pollBtn: {
    border: "none !important",
    padding: "10px 17px !important",
    fontSize: "12px !important",
    color: "#181818 !important",
    background: "linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8",
    borderRadius: "26px !important",
    minWidth: "unset !important",
    height: "auto !important",
    lineHeight: "unset !important",
    "& + &": {
      marginLeft: 8,
    },
  },
  selectedPollBtn: {
    color: "white !important",
    background: "#54658F !important",
  },
  pollBox: {
    flex: 1,
    overflow: "scroll",
    "& > div + div": {
      marginTop: 11,
    },
    width: "calc(100% + 15px)",
    paddingRight: "10px",
    paddingBottom: "20px",
  },
  arrowBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: theme.spacing(2),
    background: "white",
    cursor: "pointer",
  },
  discussionContent: {
    borderRadius: 12,
    background: "#ffffff",
    height: 610,
    textAlign: "center",
    padding: theme.spacing(2),
    position: "relative",
  },
}));
