import { makeStyles } from "@material-ui/core/styles";

export const AddLiquidityModalStyles = makeStyles((theme) => ({
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
    lineHeight: "24px",
    fontFamily: "Agrandir GrandHeavy"
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
    width: "13px",
    height: "13px",
    borderRadius: "100%",
    marginRight: 4,
  }
}));
