import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Color, FontSize, Gradient } from "shared/ui-kit";

export const useWithdrawFundModalStyles = makeStyles(theme => ({
  root: {
    width: "508px !important",
    "& h3": {
      color: "#431AB7",
    },
  },
  inputJOTs: {
    margin: "35px 0 14px",
    background: "rgba(144, 155, 255, 0.16)",
    border: `1px solid ${Color.Purple}`,
    width: "100%",
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
  },
  purpleText: {
    cursor: "pointer",
    color: Color.Purple,
    fontSize: "16px",
    minWidth: "55px",
    fontWeight: 700,
  },

  leftBalance: {
    "& h5": {
      fontSize: "14px",
      lineHeight: "150%",
      color: Color.Purple,
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "flex-start"
    },
  },
  rightBalance: {
    fontSize: "16px",
    lineHeight: "150%",
    color: Color.Purple,
  },
  usdWrap: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      paddingTop: "0",
      marginLeft: "0"
    },
  },
  point: {
    background: "#D9F66F",
    width: "13px",
    height: "13px",
    borderRadius: "13px",
  },

  checkBtn: {
    height: 40,
    backgroundColor: "#431AB7",
    color: "white",
    marginTop: 30,
    padding: "11px 32px",
    fontSize: 14,
    fontWeight: 700,
    borderRadius: 4,
  },
  hash: {
    cursor: "pointer",
  },
}));
