import { makeStyles } from "@material-ui/core";
import { Color, FontSize } from "shared/ui-kit";

export const SyntheticFractionalisedTradeFractionsPageStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#431AB7",
  },
  outBox: {
    width: "100%",
    background: "#FFFFFF",
    border: "1px solid #9EACF2",
    boxSizing: "border-box",
    borderRadius: "20px",
    marginBottom: "10px",
    padding: "36px 53px",

    [theme.breakpoints.down(1080)]: {
      padding: "36px 23px",
    },
  },
  boxBody: {
    display: "flex",
    alignItems: "center",

    [theme.breakpoints.down(1080)]: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  col_half: {
    height: "100%",
    flex: 1,
    position: "relative",

    [theme.breakpoints.down(1080)]: {
      width: '100%',
      borderRight: 'none',
    },
  },
  ownerInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    [theme.breakpoints.down(1080)]: {
      alignItems: "flex-start",

      '& .MuiIconButton-root': {
        paddingBottom: '0 !important',
        paddingTop: '0 !important',
        height: 'auto',
      },
    },
  },
  ownerPrice: {
    padding: 20,

    [theme.breakpoints.down(1080)]: {
      padding: 0,
    },
  },
  crystal: {
    position: "absolute",
    width: 64,
    height: 64,
    left: 0,
    top: 0,
    transform: "rotate(22.65deg)",

    [theme.breakpoints.down(1080)]: {
      left: -20,
      top: -20,
    },
  },
  ownerTitle: {
    marginBottom: "29px",
    [theme.breakpoints.down(1080)]: {
      marginBottom: "10px",

      "& $h4": {
        paddingBottom: 0,
      },
    },
  },
  tableContainer: {
    padding: "36px 20px",
    [theme.breakpoints.down(1080)]: {
      padding: "0px",
    },
  },
  ownerPriceBtn: {
    [theme.breakpoints.down(1080)]: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      margin: 0,
      marginLeft: "0 !important",
      marginTop: 15,
      borderRadius: "2px !important",
      boxShadow: "0px 4.93997px 12.3499px -7.40995px rgba(79, 95, 17, 0.54)",
    }
  },
  h1: {
    display: "flex",
    fontStyle: "normal",
    fontSize: 24,
    lineHeight: "100%",

    [theme.breakpoints.down(1080)]: {
      fontSize: 18,
    },
  },
  h2: {
    display: "flex",
    fontStyle: "normal",
    fontSize: 22,
    lineHeight: "100%",

    [theme.breakpoints.down(1080)]: {
      fontSize: 18,
    },
  },
  h3: {
    display: "flex",
    fontStyle: "normal",
    fontSize: 18,
    lineHeight: "100%",

    [theme.breakpoints.down(1080)]: {
      fontSize: 16,
    },
  },
  h4: {
    display: "flex",
    fontStyle: "normal",
    fontSize: 14,
    lineHeight: "100%",
    "& img": {
      margin: '0px 8px'
    }
  },
  h5: {
    display: "flex",
    fontStyle: "normal",
    fontSize: 13,
    lineHeight: "100%",
  },

  chart: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    padding: "20px",
    borderRadius: theme.spacing(2),
    boxShadow: "0px 3.40102px 6.80203px #9EACF2",
    background: Color.Purple,
    overflow: "hidden",
    position: 'relative',
    "& .no-data": {
      position: 'absolute',
      left: '50%',
      top: '55%',
      transform: 'translate(-50%, 0)',
      fontSize: 16,
      color: '#ffffff'
    }
  },
  controlParentBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 35,
    paddingBottom: 0,
    [theme.breakpoints.down("sm")]: {
      alignItems: "flex-start",
    },
    width: "100%",
  },
  ownershipTitle: {
    fontWeight: 800,
    fontSize: 18,
    lineHeight: '120%',
    color: '#FFFFFF',
  },
  controlBox: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "flex-end",
    },
  },
  liquidityBox: {
    display: "flex",
    alignItems: "center",
    background: "rgba(157, 141, 203, 0.33)",
    color: "#F0F5F8",
    borderRadius: 8,
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      marginTop: theme.spacing(1),
    },
    "& button": {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  groupButton: {
    background: "transparent",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    color: Color.GrayDark,
    padding: "8px 16px",
    "& + &": {
      marginLeft: 4,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
    },
  },
  selectedGroupButton: {
    background: "rgba(221, 255, 87, 1)",
    color: "#181818",
  },
  graphTitle: {
    fontSize: 22,
    fontWeight: 400,
    color: "#FFF",
    margin: 0,
  },
  graphDesc: {
    fontSize: 12,
    fontWeight: 400,
    color: "#FFF",
    margin: 0,
  },
  priceContent: {
    borderRadius: 16,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    background: "rgba(67, 26, 183, 0.1)",
    padding: "30px 16px",
    rowGap: 20,
    [theme.breakpoints.down("sm")]: {
      rowGap: 45,
      paddingTop: 65,
      borderRadius: 10,
    },
  },
  priceSecondaryContent: {
    background: "rgba(133, 183, 26, 0.1)",
    [theme.breakpoints.down("sm")]: {
      background: "rgba(67, 26, 183, 0.1)",
    },
  },
  priceButton: {
    maxWidth: 380,
    fontSize: "14px !important",
    marginLeft: "0 !important",
    [theme.breakpoints.down(1400)]: {
      padding: "0 8px !important",
    },
    [theme.breakpoints.down(1200)]: {
      padding: "0 8px !important",
    },
    [theme.breakpoints.down("xs")]: {
      width: '100% !important',
      borderRadius: '2px !important',
      boxShadow: "0px 4.93997px 12.3499px -7.40995px rgba(79, 95, 17, 0.54)",
    },
  },
  tableTitle: {
    fontWeight: 800,
    fontSize: 24,
    color: "#431AB7",
    marginTop: 12,
    [theme.breakpoints.down('sm')]: {
      fontSize: 20,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
    },
  },
  table: {
    marginTop: 24,
    minHeight: 400,
    width: '100%',
    "& .MuiTableCell-root": {
      fontFamily: "Agrandir",
      textAlign: 'center !important',
      [theme.breakpoints.down('xs')]: {
        padding: 8,
      },
      [theme.breakpoints.down(350)]: {
        padding: "8px 4px",
      },
    },
    "& .MuiTableRow-head": {
      background: Color.White,
      color: "#431AB7",
      "& .MuiTableCell-head": {
        border: "none",
        fontSize: 14,
        fontWeight: "bold",
        color: Color.Purple,
        lineHeight: "104%",
        [theme.breakpoints.down('sm')]: {
          fontSize: 12,
        },
        [theme.breakpoints.down('xs')]: {
          fontSize: 9,
        },
      },
    },
    "& .MuiTableCell-body": {
      fontSize: 14,
      [theme.breakpoints.down('sm')]: {
        fontSize: 12,
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: 9,
      },
      "& img": {
        width: 24,
        [theme.breakpoints.down('sm')]: {
          width: 18,
        },
        [theme.breakpoints.down('xs')]: {
          width: 12,
        },
      }
    },

    [theme.breakpoints.down("sm")]: {
      minHeight: 200,
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: -16,
      marginRight: -16,
      width: "calc(100% + 32px)",
    },
  },
  progressBar: {
    width: "100%",
    height: 6.5,
    background: "#9EACF233",
    borderRadius: 35,
    position: "relative",
  },
  progressed: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    background: "linear-gradient(91.54deg, #431AB7 11.26%, #AA26C2 119.42%, #F84B4B 203.57%)",
    borderRadius: 35,
  },
  progressTitle: {
    color: "#431AB7",
    fontSize: 20,
    lineHeight: "104.5%",
    marginTop: 16,
  },
  progressContainer: {
    padding: "10px 0 30px",
    borderBottom: "1px solid #E6E6E8"
  }
}));
