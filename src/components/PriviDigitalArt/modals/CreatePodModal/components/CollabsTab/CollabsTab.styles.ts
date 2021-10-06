import { makeStyles } from "@material-ui/core/styles";

export const collabsTabStyles = makeStyles(theme => ({
  inputContainer: {
    background: "rgba(255, 255, 255, 0.4)",
    border: "1px solid #A4A4A4",
    boxSizing: "border-box",
    borderRadius: "8px",
    height: "40px",
    width: "100%",
    padding: "10px 8px 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& img": {
      width: "17px",
      height: "17px",
    },
    "& .MuiInputBase-root": {
      width: "100%",
    }
  },
  addRound: {
    marginLeft: "12px",
  },
  addButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: "41px",
    color: "#431AB7",
    fontSize: "14px",
    fontWeight: 800,
    cursor: "pointer",
    "& svg": {
      marginRight: "10px",
    },
  },

  userTile: {
    padding: "20px 0px",
    color: "#404658",
    fontFamily: "Montserrat",
    fontSize: "16px",
    borderBottom: "1px solid #00000021",
  },
  autocomplete: {
    width: "100%",
    "& input": {
      fontSize: 12,

    }
  },
  artists: {
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    borderRadius: 16,
    overflow: "hidden",
  },
  itemContainer: {
    padding: 16,
    borderBottom: "1px solid #EBEBEB",
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      padding: 0,
    }
  },
  itemDescription: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    }
  },
  itemUsername: {
    marginLeft: 5,
    fontFamily: "Agrandir",
    color: "#1A1B1C",
    fontSize: 12,
    width: 130,
    display: "inline-block",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    [theme.breakpoints.down("xs")]: {
      width: 100,
    }
  }
}));
