import React from "react";
import { makeStyles } from "@material-ui/core";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";

const useStyles = makeStyles(() => ({
  root: {
    width: "755px !important",
    padding: "40px 40px 50px !important",
    fontFamily: "Montserrat",
  },
  title: {
    fontFamily: "Agrandir Grand",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "22px",
    lineHeight: "130%",
    textAlign: "center",
    color: "#2D3047",
  },
  desc: {
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "16px",
    lineHeight: "150%",
    textAlign: "center",
    color: "#54658F",
  },
  label: {
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "16px",
    lineHeight: "104.5%",
    color: "#2D3047",
    opacity: 0.9,
    marginBottom: "16px",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "18px",
    lineHeight: "120%",
    color: "#181818",
    background: "rgba(218, 230, 229, 0.4)",
    border: "1px solid #7BCBB7",
    borderRadius: "55px",
    padding: "9px 25px 9px 34px",
    height: 56,

    "& img": {
      height: 38,
      width: 38,
      marginLeft: "-20px",
    },
  },
  greenBox: {
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D",
    borderRadius: "12px",
    padding: "32px 48px",
  },
  greenText: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "18px",
    lineHeight: "104.5%",
    textTransform: "uppercase",
    color: "#65CB63",
  },
  amount: {
    fontFamily: "Agrandir Grand",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "28px",
    lineHeight: "104.5%",
    color: "#2D3047",
    "& span": {
      color: "#707582",
    },
  },
}));

export default function UnstakeRedeemModal({
  open,
  onClose,
  type,
  amount,
  handleRefresh,
}: {
  open: boolean;
  type: "unstake" | "redeem" | boolean;
  onClose: any;
  amount: number;
  handleRefresh: any;
}) {
  const classes = useStyles();

  const handleSubmit = () => {
    if (type === "unstake") {
    } else {
    }
  };

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} className={classes.root} showCloseIcon>
      <Box className={classes.title} mb={2}>
        {type === "unstake" ? "Unstake" : "Redeem"}
      </Box>
      <Box className={classes.desc} mb={6}>
        {type === "unstake"
          ? "In order to unstake your funds input the amount you wuld like to unstake in the input below. "
          : "In order to redeem your funds input the amount you wuld like to unstake in the input below. "}
      </Box>

      <Box className={classes.label}>Amount</Box>
      <div className={classes.inputContainer}>
        {type === "unstake" ? (
          <img src={require("assets/tokenImages/TRAX.png")} alt="TRAX" />
        ) : (
          <Box>{amount} Pod Tokens</Box>
        )}
        {type === "unstake" && <Box color="#707582">{amount} Privi</Box>}
      </div>

      <Box className={classes.greenBox} mt={"20px"} mb={7}>
        <Box mb={1} className={classes.greenText}>
          Amount to be paid out{" "}
        </Box>
        <Box className={classes.amount}>
          {amount} <span>{type === "unstake" ? "USD" : "POD Tokens"}</span>
        </Box>
      </Box>

      <Box display="flex" alignItems="center">
        <SecondaryButton
          onClick={onClose}
          size="small"
          style={{
            mixBlendMode: "normal",
            borderRadius: "48px",
            height: "59px",
            padding: "19.5px",
            fontFamily: "Montserrat",
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: "16px",
            lineHeight: "20px",
            letterSpacing: "-0.04em",
            textAlign: "center",
            width: "100%",
            color: "#2D3047",
            border: "1px solid #2D3047",
          }}
          isRounded
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          onClick={handleSubmit}
          size="small"
          style={{
            mixBlendMode: "normal",
            borderRadius: "48px",
            height: "59px",
            padding: "19.5px",
            fontFamily: "Montserrat",
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: "16px",
            lineHeight: "20px",
            letterSpacing: "-0.04em",
            textAlign: "center",
            width: "100%",
            marginLeft: "18px",
            background: "#2D3047",
          }}
          isRounded
        >
          {type === "unstake" ? "Stake" : "Redeem"}
        </PrimaryButton>
      </Box>
    </Modal>
  );
}
