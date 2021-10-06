import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Color, FontSize, Gradient } from "shared/ui-kit";

export const WithdrawJotsModalStyles = makeStyles(theme => ({
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
      paddingTop: "40px",
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
    },
  },
  point: {
    background: "#D9F66F",
    width: "24px",
    height: "24px",
    borderRadius: "12px",
  },
}));
