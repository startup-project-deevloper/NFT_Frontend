import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import PriviExchange from "./PriviExchange";
import UniswapPool from "./UniswapPool";

const useExchangeBoxStyles = makeStyles(theme => ({
  exchangeBox: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    background: "#FFFFFF",
    boxShadow: "0px 4px 8px #9EACF2",
    borderRadius: "16px",
    width: "100%",
    fontFamily: "Agrandir",
    padding: "16px",

    "& label": {
      color: "#1A1B1C",
      fontSize: "14px",
      lineHeight: "120%",
    },

    "& .MuiInput-root": {
      margin: "8px 0px 0px",
      background: "#F7F9FE",
      borderRadius: "16px",
      border: "none",
      height: "49px",
      fontFamily: "Agrandir",
      "& *": {
        fontFamily: "Agrandir",
      },
    },

    "& button": {
      width: "fit-content",
    },
  },
  optionButtons: {
    display: "flex",
    alignItems: "center",
    padding: "4px",
    background: "#EFF2FD",
    borderRadius: "77px",
    marginBottom: "38px",
    width: "fit-content",

    "& button": {
      borderRadius: "77px",
      color: "#431AB7",
      background: "transparent",
      padding: "8px 20px",
      fontWeight: "normal",
      fontSize: "14px",
      lineHeight: "114.5%",
      width: "fit-content",
    },
  },
  selectedButton: {
    color: "#FFFFFF !important",
    background: "#431AB7 !important",
  },
}));

export default function ExchangeBox({ media, handleRefresh }) {
  const classes = useExchangeBoxStyles();

  const [option, setOption] = useState<number>(0);

  return (
    <div className={classes.exchangeBox}>
      <div className={classes.optionButtons}>
        <button className={option === 0 ? classes.selectedButton : ""} onClick={() => setOption(0)}>
          Privi Exchange
        </button>
        <button className={option === 1 ? classes.selectedButton : ""} onClick={() => setOption(1)}>
          Uniswap Pool
        </button>
      </div>

      {option === 0 ? <PriviExchange media={media} handleRefresh={handleRefresh}/> : <UniswapPool />}
    </div>
  );
}
