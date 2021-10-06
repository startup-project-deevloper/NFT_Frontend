import { makeStyles } from "@material-ui/core/styles";

export const RemoveLiquidityModalStyles = makeStyles(theme => ({
  container: {
    maxWidth: "508px !important",
  },
  inputLiquidity: {
    margin: "20px 0",
    background: "rgba(144, 155, 255, 0.16)",
    border: "1px solid #431AB7",
    width: "100%",
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
  },
  purpleText: {
    cursor: "pointer",
    color: "#431AB7",
    fontSize: "16px",
    minWidth: "55px",
    fontWeight: "bold",
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
