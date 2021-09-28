import { makeStyles } from "@material-ui/core";
import { Color } from "shared/ui-kit";

export const useOrderBookModalStyles = makeStyles(theme => ({
  root: {
    maxWidth: "1024px !important",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 10px",
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    lineHeight: "104.5%",
    color: "#431AB7",
    margin: '0px 0px 30px 0',
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
    },
  },
  listingContainer: {
    border: "1px solid #9EACF2",
    borderRadius: 20,
    width: '100%',
  },
  listingTable: {
    marginTop: 20,
    marginBottom: 30,
    "& .MuiTableContainer-root": {
      boxShadow: 'none',

      "& .MuiTableCell-head": {
        color: '#707582',
        fontWeight: 600,
        fontSize: 16,
        padding: '8px',
        background: '#FFF',
        borderTop: '1px solid rgba(224, 224, 224, 1)',
      },

      "& .MuiTableCell-body": {
        color: '#1A1B1C',
        fontWeight: 500,
        padding: '8px',
      }
    },
  },
  chartContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    padding: "5px",
    borderRadius: theme.spacing(2),
    boxShadow: "0px 3.40102px 6.80203px #9EACF2",
    background: '#431AB7',
    marginTop: 16,
  },
  controlParentBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "30px 40px",
    [theme.breakpoints.down("sm")]: {
      alignItems: "flex-start",
    },
    [theme.breakpoints.down("xs")]: {
      padding: 12,
    },
    width: "100%",
  },
  graphTitle: {
    fontSize: 22,
    fontWeight: 400,
    color: "#FFF",
    margin: 0,
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
    background: "#181F3D",
    color: "#F0F5F8",
    borderRadius: 28,
    padding: 5,
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
    borderRadius: 28,
    fontSize: 14,
    color: '#FFF',
    padding: "4px 16px",
    height: 35,
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
  chartWrapper: {
    padding: "30px 20px 30px 20px",
    minHeight: "400px",

    [theme.breakpoints.down("sm")]: {
      padding: 0,
      "& canvas": {
        width: "100%"
      }
    },
  },
  saleContainer: {
    border: "1px solid #9EACF2",
    borderRadius: 20,
    background: '#EFF2FD',
    width: '100%',
    marginTop: 20,
    marginBottom: 30,
  },
  saleTable: {
    paddingTop: 10,
    paddingBottom: 10,
    "& .MuiTableContainer-root": {
      boxShadow: 'none',

      "& .MuiTableCell-head": {
        color: '#707582',
        fontWeight: 600,
        fontSize: 16,
        padding: '8px',
        background: '#EFF2FD',
        borderTop: '1px solid rgba(224, 224, 224, 1)',
      },

      "& .MuiTableCell-body": {
        color: '#1A1B1C',
        padding: '8px',
        fontWeight: 500,
      }
    },
  },
  subTitle: {
    fontSize: 24,
    display: 'flex',
    alignItems: 'center',
    fontWeight: 800,
    color: '#431AB7',
    margin: 20,

    "& svg": {
      marginRight: 10,
    }
  },
  listingTabs: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 32,
    borderBottom: '1px solid rgba(158, 172, 242, 0.5)',
  },
  listingTab: {
    fontSize: 18,
    fontWeight: 800,
    margin: '0 40px',
    color: 'rgba(158, 172, 242, 1)',
    paddingBottom: 16,
    textTransform: 'uppercase',
    cursor: 'pointer',

    '&.selected': {
      borderBottom: '3px solid #431AB7',
      color: '#431AB7',
    },
  },
}));
