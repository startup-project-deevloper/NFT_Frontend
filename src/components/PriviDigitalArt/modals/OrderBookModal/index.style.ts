import { makeStyles } from "@material-ui/core/styles";

export const OrderBookModalStyles = makeStyles((theme) => ({
  container: {
    maxWidth: "1000px !important",
    width: "1000px !important",
    padding:'25px !important'
  },
  nameField: {
    margin: '27px 0px 7px 0px',
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '14px',
    color: '#1A1B1C',
    lineHeight: '21px',
    textAlign: 'center'
  },
  outBox: {
    width: "100%",
    background: "#EFF2FD",
    border: "1px solid #9EACF2",
    boxSizing: "border-box",
    borderRadius: "20px",
    marginBottom: "10px",

    [theme.breakpoints.down(1080)]: {
      padding: "36px 23px",
    },
  },
  h2: {
    fontFamily: "Agrandir GrandHeavy",
    display: "flex",
    fontStyle: "normal",
    fontSize: 18,
    lineHeight: "100%",
    color:'#431AB7',
    marginTop:'32px',
    [theme.breakpoints.down(1080)]: {
      fontSize: 18,
    },
  },
  table: {
    marginTop: 24,
    minHeight: 400,
    width: "100%",
    "& .MuiTableCell-root": {
      fontFamily: "Agrandir",
      textAlign: "center !important",
      [theme.breakpoints.down("xs")]: {
        padding: 8,
      },
      [theme.breakpoints.down(350)]: {
        padding: "8px 4px",
      },
    },
    "& .MuiTableRow-head": {
      background: 'white',
      color: "#431AB7",
      "& .MuiTableCell-head": {
        border: "none",
        fontSize: 14,
        fontWeight: "bold",
        color: '#431AB7',
        lineHeight: "104%",
        [theme.breakpoints.down("sm")]: {
          fontSize: 12,
        },
        [theme.breakpoints.down("xs")]: {
          fontSize: 9,
        },
      },
    },
    "& .MuiTableCell-body": {
      fontSize: 14,
      [theme.breakpoints.down("sm")]: {
        fontSize: 12,
      },
      [theme.breakpoints.down("xs")]: {
        fontSize: 9,
      },
      "& img": {
        width: 24,
        [theme.breakpoints.down("sm")]: {
          width: 18,
        },
        [theme.breakpoints.down("xs")]: {
          width: 12,
        },
      },
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
  pagination: {
    "& a": {
      margin: "0 14px",
      cursor: "pointer",

      "&.active": {
        color: "#2D3047",
      },
    },
  },

}));
