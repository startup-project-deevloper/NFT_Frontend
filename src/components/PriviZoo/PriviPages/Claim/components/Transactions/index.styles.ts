import { makeStyles } from "@material-ui/core/styles";

export const useTransactionsStyles = makeStyles(theme => ({
  root: {
    marginTop: "64px",
    [theme.breakpoints.down("sm")]: {
      marginTop: "50px",
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: "40px",
    },
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "38px",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "50px",
    },
    [theme.breakpoints.down("xs")]: {
      marginBottom: "28px",
    },
  },
  title2: {
    fontFamily: "Agrandir GrandLight",
    color: "#181818",
    fontSize: "22px",
    lineHeight: "104.5%",
    fontWeight: 800,
  },
  seeAllButton: {
    padding: "11px 18px 11px 48.5px",
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "18px",
    textAlign: "center",
    color: "#2D3047",
    display: "flex",
    alignItems: "center",
    jsutifyContent: "space-between",
    background: "transparent",
    border: "1px solid #4218B5",
    borderRadius: "29px",
    "& svg": {
      marginLeft: "18px",
    },
  },
  value: {
    fontFamily: "Agrandir GrandLight",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "26px",
    lineHeight: "130%",
    color: "#2D3047",

    [theme.breakpoints.down("xs")]: {
      fontSize: "20px",
    },
    "& span": {
      opacity: 0.4,
    },
  },
  label: {
    marginTop: "2px",
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "16px",
    lineHeight: "130%",
    textTransform: "uppercase",
    color: "#4218B5",
    [theme.breakpoints.down("xs")]: {
      fontSize: "14px",
    },
  },
  logoBig: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "6.5px",
  },
  logoSmall: {
    width: "15px",
    height: "15px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  tableContainer: {
    width: "100%",
    marginTop: "38px",
    borderRadius: "12px",
    backgroundColor: "white",
    boxShadow: "0px 6px 13px 0px #5B42791F",

    "& .MuiTableContainer-root": {
      borderRadius: "12px",
      backgroundColor: "white",
      boxShadow: "none",
      "& tr": {
        "& .MuiTableCell-head": {
          color: "#2D3047",
          fontFamily: "Montserrat",
          fontStyle: "normal",
          fontWeight: 600,
          fontSize: "14px",
          lineHeight: "14px",
          borderBottom: "1px solid #4218B5",
        },
        "& th:first-child": {
          borderTopLeftRadius: "12px",
        },

        "& th:last-child": {
          borderTopRightRadius: "12px",
        },

        "& td": {
          color: "#54658F",
          fontFamily: "Montserrat",
          fontStyle: "normal",
          fontWeight: 600,
          fontSize: "12px",
          lineHeight: "13px",
          broderBottom: "1px solid #00000015",
        },
      },

      "& tr:last-child": {
        "& td:first-child": {
          borderBottomLeftRadius: "12px",
        },

        "& td:last-child": {
          borderBottomRightRadius: "12px",
        },
      },
    },
    [theme.breakpoints.down("sm")]: {
      marginTop: "50px",
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: "28px",
    },
  },

  tablePagination: {
    "& .MuiInputBase-root": {
      background: "white",
      padding: "0px 8px",
    },
  },
}));
