import { makeStyles } from "@material-ui/core/styles";

export const RedeemJotsModalStyles = makeStyles((theme) => ({
  container: {
    maxWidth: "508px !important",
  },
  inputJOT: {
    margin: "20px 0",
    background: "rgba(144, 155, 255, 0.16)",
    border: "1px solid #431AB7",
    width: "100%",
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
  },
  purpleText: {
    fontFamily: "Agrandir Variable !important",
    cursor: "pointer",
    color: "#431AB7",
    fontSize: "16px",
    minWidth: "55px",
    fontWeight: 700
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
  },
  receiveContainer: {
    background: "rgba(158, 172, 242, 0.2)",
    borderRadius: "12px",
    padding: "20px 26px",
    display: "flex",
    justifyContent: "space-between",
    marginTop: "22px",
    "& span": {
      color: "#431AB7",
      fontSize: "16px"
    }
  },
  usdt: {
    fontFamily: "Agrandir GrandHeavy !important",
    color: "#431AB7",
    fontWeight: 800,
    fontSize: "16px"
  }
}));
