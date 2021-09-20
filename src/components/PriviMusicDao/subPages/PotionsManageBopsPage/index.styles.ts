import { makeStyles } from "@material-ui/core";
import { Color } from "shared/ui-kit";

export const potionsManageBopsPageStyle = makeStyles(theme => ({
  container: {
    position: "relative",
    background: "linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8",
  },
  backgroundBox: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "1050px",
    background:
      "linear-gradient(180deg, rgba(243, 254, 247, 0) 49.94%, #EEF2F6 96.61%), linear-gradient(97.63deg, #99CE00 26.36%, #0DCC9E 80%)",
  },
  body: {
    width: "100%",
    position: "relative",
    margin: "auto",
    marginTop: 100,
    display: "flex",
    flexDirection: "column",
    paddingBottom: 40,
    zIndex: 2,

    "& .left-logo": {
      position: "absolute",
      top: -150,
      left: 30,
      [theme.breakpoints.down("sm")]: {
        left: -10,
      },
      [theme.breakpoints.down("xs")]: {
        left: -50,
      },
    },
    "& .right-logo": {
      position: "absolute",
      top: 100,
      right: 50,
      [theme.breakpoints.down("sm")]: {
        top: -210,
      },
      [theme.breakpoints.down("xs")]: {
        top: -250,
      },
    },

    paddingLeft: 160,
    paddingRight: 160,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 28,
      paddingRight: 28,
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 16,
      paddingRight: 16,
    },
  },
  contentBox: {
    [theme.breakpoints.down("sm")]: {
      marginTop: 150,
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: 150,
    },
  },
  tabBarItem: {
    display: "flex",
    alignItems: "center",
    opacity: 0.8,
    padding: `0 ${theme.spacing(15)}px`,
    paddingBottom: theme.spacing(1),
    cursor: "pointer",
    borderBottom: "1px solid #00000022",
  },
  tabBarItemActive: {
    opacity: 1,
    borderBottom: "1px solid #000000",
  },
  header: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    fontSize: 38,
    fontWeight: 800,
    color: "#2D3047",
    lineHeight: "39px",
    fontFamily: 'Agrandir',
  },
  header1: {
    fontSize: 18,
    fontWeight: 800,
    color: '#2D3047',
    lineHeight: "130%",
    fontFamily: 'Agrandir',
  },
  header2: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#404658",
  },
  header4: {
    fontSize: 28,
    fontWeight: 800,
  },
  tableHeader1: {
    fontSize: 21,
    fontWeight: 600,
  },
  tableHeader2: {
    fontSize: 14,
    fontWeight: 600,
  },
  tableHeader3: {
    fontSize: 9,
    fontWeight: 600,
  },
  tableHeader4: {
    fontSize: 14,
    fontWeight: 500,
  },
  filterContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 40,
    [theme.breakpoints.down("xs")]: {
      marginTop: 20,
      marginBottom: 20,
      flexDirection: "column",
      rowGap: 35,
      alignItems: "flex-end",
    },
  },
  rankingStatsCard: {
    borderRadius: 30,
    color: "#fff",
    boxShadow: "0px 34px 33px -14px rgba(77, 186, 193, 0.22)",
    background: "radial-gradient(143.09% 111.42% at 37.31% 22.83%, #5EC9A2 0%, #239DAE 97.88%)",
    height: 322,
    width: 352,
    overflow: "hidden",
    "& > div": {
      padding: '0 39px',
      "&:first-child": {
        paddingTop: 27,
        background: "linear-gradient(180deg, rgba(124, 239, 255, 0.6) 2.96%, rgba(81, 133, 195, 0) 62.13%), #2E9F9B",
      },
      "&:last-child": {
        paddingBottom: 27,
      },
    }
  },
  beatsStatsCard: {
    borderRadius: 30,
    color: '#fff',
    boxShadow: '0px 34px 33px -14px rgba(77, 193, 96, 0.22)',
    background: 'radial-gradient(91.13% 92.55% at 37.92% 21.27%, #A0D800 0%, #0DCC9E 85.27%)',
    height: 322,
    width: 352,
    overflow: "hidden",
    "& > div": {
      padding: '0 39px',
      "&:first-child": {
        paddingTop: 27,
        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.2) 2.96%, rgba(255, 255, 255, 0) 62.13%), #03AB00",
      },
      "&:last-child": {
        paddingBottom: 27,
      },
    }
  },
  revenueStatsCard: {
    borderRadius: 30,
    color: '#fff',
    boxShadow: '0px 34px 33px -14px rgba(77, 165, 193, 0.22)',
    background: 'radial-gradient(104.79% 106.41% at 36.85% 15.84%, #16D2DE 0%, #5A7FFF 94.75%)',
    height: 322,
    width: 352,
    overflow: "hidden",
    "& > div": {
      padding: '0 39px',
      "&:first-child": {
        paddingTop: 27,
        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.2) 2.96%, rgba(255, 255, 255, 0) 62.13%), #087ED0",
      },
      "&:last-child": {
        paddingBottom: 27,
      },
    }
  },
  selectedButtonBox: {
    background: '#65CB63',
    display: "flex",
    alignItems: "center",
    padding: '10px 17px',
    fontSize: 14,
    fontWeight: 500,
    color: '#fff',
    fontFamily: 'Montserrat',
    borderRadius: 29,
    cursor: "pointer",
  },
  buttonBox: {
    display: "flex",
    alignItems: "center",
    padding: '10px 17px',
    fontSize: 14,
    fontWeight: 500,
    color: '#fff',
    fontFamily: 'Montserrat',
    cursor: "pointer",
    [theme.breakpoints.down("xs")]: {
      padding: "8px 14px",
    },
  },
  rankBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: theme.spacing(4),
    transform: "translate(0, -50%)",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    "& > *": {
      marginTop: theme.spacing(2),
    },
    "& > nav > ul > li > button": {
      color: "#2D3047",
      fontSize: 14,
      fontWeight: 600,
      "&.MuiPaginationItem-page.Mui-selected": {
        opacity: 0.38,
      },
    },
    "& > nav > ul > li > div": {
      color: "#2D3047 !important",
      fontSize: 14,
      fontWeight: 600,
    },
  },
  bopImageBox: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  bopBackImage: {
    width: theme.spacing(15),
    height: theme.spacing(8),
    borderRadius: theme.spacing(1),
    overflow: "hidden",
  },
  bopAvatarBox: {
    position: "absolute",
    bottom: -theme.spacing(0.5),
    left: "85%",
    display: "flex",
    alignItems: "center",
  },
  bopAvatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: "100%",
    border: "2px solid #ffffff",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  bopAvatar1: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    borderRadius: "100%",
    border: "2px solid #ffffff",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  graphBox: {
    background: "#2B3161",
    borderRadius: 35,
    padding: "28px 20px 40px 40px",
    width: '100%',
    [theme.breakpoints.down("xs")]: {
      padding: "22px 12px 45px 12px",
    },
  },
  graphTobBox: {
    display: "flex",
    justifyContent: "space-between",
    paddingBottom: 24,
    [theme.breakpoints.down(400)]: {
      flexDirection: "column",
    },
  },
  headerControlBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#181F3D",
    borderRadius: 68,
    padding: 7,
    [theme.breakpoints.down(400)]: {
      marginTop: theme.spacing(2),
    },
  },
  graphFilterBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 24,
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 16,
    },
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  secondButtonBox: {
    padding: '10px 16px',
    borderRadius: theme.spacing(1),
    cursor: "pointer",
    border: "1px solid #7977D1",
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      padding: '6px 12px',
    },
  },
  header2_1: {
    fontSize: 24,
    fontWeight: 600,
    lineHeight: "29px",
    letterSpacing: "0.02em",
    fontFamily: 'Montserrat',
    [theme.breakpoints.down("xs")]: {
      fontSize: 20,
    },
    [theme.breakpoints.down(500)]: {
      fontSize: 18,
    },
    [theme.breakpoints.down(405)]: {
      fontSize: 16,
    },
    [theme.breakpoints.down(400)]: {
      fontSize: 24,
    },
  },
  controlBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#3B4674",
    borderRadius: theme.spacing(1),
  },
  header2_4: {
    fontSize: 24,
    fontWeight: 400,
    color: '#404658',
  },
  combineButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF !important",
    borderRadius: "15px !important",
    color: "#2D3047 !important",
    whiteSpace: "nowrap",
    minWidth: "unset !important",
    "& svg": {
      marginRight: 8,
    }
  },
}));
