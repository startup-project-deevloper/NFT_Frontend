import { makeStyles } from "@material-ui/core";
import { Color } from "shared/ui-kit";

export const appPageStyles = makeStyles(theme => ({
  navigationContainer: {
    background: `url(${require("assets/backgrounds/Gradient_BG_Empty.jpg")})`,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
    backgroundSize: "cover",
  },
  contentBox: {
    padding: `0px ${theme.spacing(20)}px`,
    marginTop: theme.spacing(3),
    width: "100%",
    flexWrap: 'wrap',
    [theme.breakpoints.down("sm")]: {
      padding: `0px ${theme.spacing(10)}px`,
    },
    [theme.breakpoints.down("xs")]: {
      padding: `0px ${theme.spacing(5)}px`,
    },
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
    position: "relative",

    "& .MuiInput-root": {
      paddingRight: 40,
    },

    "& .file-attachment": {
      position: "absolute",
      right: 0,
    }
  },
  imageContainer: {
    width: 200,
    height: 200,
    margin: "auto",
    cursor: "pointer",
  },
  discordPhotoFullModal: {
  },
  dialogContainer: {
    "& .MuiDialog-paperFullWidth": {
      paddingTop: theme.spacing(2),
      borderRadius: theme.spacing(2.5)
    }
  },
  videoContainer: {
    cursor: "pointer",
    height: "200px",
    width: "200px !important",
    maxWidth: "200px",
    color: "white",
    borderRadius: 20,
    backgroundColor: "rgba(219, 223, 224, 0.4)",
    position: "relative",
    margin: "auto",
  },
  iconVideoWrapper: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    backgroundColor: "rgb(128 128 128 / 40%)",
    cursor: "pointer",
    width: "100%",
    height: "100%",
    borderRadius: "20px",
  },
  playIconVideo: {
    width: "32px",
    height: "32px",
  },
  audioContainer: {
    position: "relative",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  videoPlayer: {
    cursor: "pointer",
    width: "200px !important",
    height: "200px !important",
    borderRadius: 20,
    transform: "none",
    "& > video": {
      width: "200px !important",
      borderRadius: 20,
      objectFit: "cover",
    },
  },
  header1: {
    fontSize: "12px",
  },
  header2: {
    fontSize: "16px",
    color: "#707582",
  },
  header3: {
    fontSize: 14,
    fontWeight: 400,
    color: "#707582",
    marginTop: 24,
    paddingRight: 120,
    whiteSpace: "pre-line",
  },
  comingSoon: {
    color: "#4218B5",
    fontSize: 12,
    fontWeight: 600,
    background: "rgba(87, 60, 255, 0.2)",
    borderRadius: 4,
    width: 106,
    height: 20,
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 2,
  },
  testNet: {
    color: "#18B56A",
    fontSize: 12,
    fontWeight: 600,
    background: "rgba(61, 220, 48, 0.2)",
    borderRadius: 4,
    width: 106,
    height: 20,
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 2,
  },
  followBtn: {
    background: "#4218B5",
    padding: "10px 36px",
    color: "#FFF",
    fontSize: 16,
    fontWeight: 700,
    borderRadius: 10,
    marginRight: 15,
  },
  earlyAccessBtn: {
    padding: "10px 36px",
    backgroundColor: "#4218B5",
    fontSize: 16,
    fontWeight: 700,
    borderRadius: 10,
    border: "1px solid rgba(66, 24, 181, 0.4)",
    whiteSpace: 'nowrap',
    marginLeft: 30,
  },
  comingSoonContainer: {
    display: "flex",
    alignItems: "center",
    flexWrap: 'wrap',
    justifyContent: 'flex-end'
  },
  comingSoonDescription: {
    display: "flex",
    flexDirection: "column",    
    alignItems: "flex-end",
    marginBottom: 8,
    "& h3": {
      margin: 0,
      fontWeight: 700,
      fontSize: 16,
      whiteSpace: 'nowrap'
    },
    "& h4": {
      margin: 0,
      fontWeight: 400,
      fontSize: 14,
      whiteSpace: 'nowrap'
    },
  },
  title: {
    fontSize: "35px",
    fontWeight: 800,
    background: "radial-gradient(427.58% 951.54% at 39.31% -84.13%, #000000 0%, #DBDDF0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    whiteSpace: 'nowrap'
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 16,
  },
  title2: {
    fontSize: "25px",
    fontWeight: 400,
  },
  title3: {
    fontSize: 26,
    fontWeight: 700,
    color: '#181818',
  },
  musicBox: {
    borderRadius: theme.spacing(2.5),
    boxShadow: "0px 11px 14px rgba(91, 66, 121, 0.11)",
    paddingBottom: 0,
    color: "white",
    width: "100%",
  },
  shadowBox: {
    borderRadius: theme.spacing(1),
    boxShadow: `2px 2px 12px rgba(0, 0, 0, 0.1)`,
    background: "white",
    overflow: "hidden",
    padding: theme.spacing(2),
  },
  navIconBox: {
    borderRadius: theme.spacing(3),
    boxShadow: "0px 10px 21px -9px rgba(89, 81, 143, 0.28)",
    background: "white",
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    border: "1px solid #18181844",

    "& div": {
      cursor: "pointer",
    },
  },
  indexDotBox: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    borderRadius: theme.spacing(0.5),
    cursor: "pointer",
    overflow: "hidden",
    opacity: 0.5,
    border: "1px solid #18181822",

    "&.selected": {
      opacity: 1,
    },
  },
  cardsGrid: {
    display: "grid",
    gridColumnGap: "20px",
    gridRowGap: "20px",
    width: "100%",
  },
  starBox: {
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    background: "#EFF2F8",
  },
  descriptionBox: {
    borderTop: "1px solid #18181822",
    borderBottom: "1px solid #18181822",
    padding: `${theme.spacing(6)}px 0px`,
  },
  snsBox: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    background: "#707582",
    borderRadius: "50%",
    marginRight: theme.spacing(2),
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",

    "& path": {
      fill: "white",
    },
  },
  popupPaper: {
    background: "radial-gradient(146.46% 50% at 50% 50%, #5234C2 15.62%, #D7D2FC 96.87%)",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    backdropFilter: "blur(132px)",
    borderRadius: 24,
    padding: "24px 16px",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#EBEBEB",
    margin: "16px 0",
  },
  menu: {
    fontSize: 14,
    fontWeight: 700,
    color: Color.White,
    textAlign: "center",
    cursor: "pointer",
    "& button.react-share__ShareButton": {
      height: "auto"
    }
  }
}));
