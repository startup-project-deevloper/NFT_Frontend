import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/ui-kit";

export const usePodPageIndividualStyles = makeStyles(theme => ({
  container: {
    background: "#fff",
    height: `calc(100vh - 80px)`,
    padding: "40px 60px 60px",
    width: "100%",
    overflow: "auto",
    [theme.breakpoints.down("xs")]: {
      padding: "16px 16px"
    },
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
    fontFamily: "Agrandir GrandHeavy",
    color: "#431AB7",
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
  addPodTokenBtn: {
    background: "#181818 !important", 
    color: "#fff !important", 
    border: "none !important",
    [theme.breakpoints.down("xs")]: {
      width: "100% !important",
      marginLeft: "0 !important",
      marginTop: "15px !important",
      height: "38px !important",
      padding: "0px 45px !important",
    },
  },
  addCopyRightBtn: {
    [theme.breakpoints.down("xs")]: {
      height: "38px !important",
    }
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
    color: Color.Purple,
  },
  headerBox: {
    backgroundSize: "cover",
    backgroundRepeat: "none",
  },
  backgroundBox: {
    padding: 32,
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
    color: "#fff",
    padding: "5px 10px",
    borderRadius: 5,
    fontSize: 10,
    fontWeight: 600,
    lineHeight: "12px",
    background: "#431AB7",
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
      padding: "2px 3px",
      "& + &": {
        marginLeft: 8,
      },
    },
  },
  selectedTabBox: {
    background: "#9EACF2",
    color: "#ffffff",
  },
  timeBox: {
    background: "#431AB7",
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
    fontSize: 34,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "130%",
    color: Color.Purple,
  },
  title3: {
    fontSize: 18,
    color: "#1A1B1C",
    fontWeight: 800,
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
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
    borderBottom: "1px solid #00000022",
    borderTop: "1px solid #00000022",
  },
  artistsBox: {
    borderTop: "1px solid #00000022",
    display: "flex",
    alignItems: "center",
    color: Color.Purple,
  },
  artistsMainContent: {
    display: "flex",
    alignItems: "center",
    marginBottom: 48,
    paddingLeft: 5,
  },
  whiteBox: {
    display: "flex",
    alignItems: "center",
    background: "white",
    opacity: "0.8",
    justifyContent: "space-between",
    padding: "16px 0",
    borderTop: "1px solid #00000022",
    marginTop: "24px",
    [theme.breakpoints.down("xs")]:{
      flexDirection: "column",
    },
  },
  podSubPageContent: {
    padding: "32px 0",
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
    height: 610,
    textAlign: "center",
    position: "relative",
    background: "rgba(158, 172, 242, 0.16)",
    boxShadow: "0px 4px 8px #9EACF2",
    borderRadius: "32px",
    margin: "0 8px",

    "& .podDiscordFullPage": {
      height: "calc(100% - 40px)",
    },

    "& .podDiscordChatGrid": {
      background: "transparent",
    },
    "& .podInputDiscordChat": {
      border: "1px solid #431AB7",
      background: "white",
      "& input": {
        color: "#181818",
      },
    },
  },
  comment: {
    display: "flex",
    alignItems: "center",
    textAlign: "left",
    paddingLeft: "33px",

    "& span": {
      fontWeight: "normal",
      fontSize: "14px",
      lineHeight: "18px",
      color: "#431AB7",
      marginLeft: "8px",
    },
  },
  ProposalPodCardContainer: {
    background: "#FFFFFF",
    boxShadow: "0px 4px 8px #9EACF2",
    borderRadius: "18px",
    width: 674,
    height: 229,
    margin: "0 24px 10px 5px !important",
  },
}));
