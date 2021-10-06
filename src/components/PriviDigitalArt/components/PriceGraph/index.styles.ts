import { makeStyles } from "@material-ui/core/styles";
import { Color, FontSize } from "shared/ui-kit";

export const PriceGraphStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    padding: "5px",
    position: "relative",

    "& .tv-lightweight-charts": {
        borderRadius: theme.spacing(2),
        boxShadow: "0px 3.40102px 6.80203px #9EACF2",
    },

    "& .switcher": {
        position: "absolute",
        background: "rgba(157, 141, 203, 0.33)",
        borderRadius: "8px",
        zIndex: 5,
        top: "30px",
        right: "64px"
    },

    "& .switcher-item": {
        cursor: "pointer",
        textDecoration: "none",
        display: "inline-block",
        padding: "8px 16px",
        fontSize: "14px",
        color: "white",
        backgroundColor: "transparent",
        marginRight: "8px",
        border: "none",
        borderRadius: "4px",
        outline: "none",

        '&:last-child': {
            marginRight: 0
        }
    },
    
    "& .switcher-active-item": {
        textDecoration: "none",
        cursor: "default",
        color: "#2D3047",
        backgroundColor: "#DDFF57"
    }
  },
  titleBox: {
    position: "absolute",
    zIndex: 3,
    top: "30px",
    left: "43px"
  },
  title: {
    fontSize: "22px",
    lineHeight: "120%",
    color: "white",
  },
  date: {
    fontSize: "12px",
    lineHeight: "120%",
    color: "white",
    opacity: 0.8
  }
}));
