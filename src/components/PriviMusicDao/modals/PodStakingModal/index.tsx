import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { PrimaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const useStyles = makeStyles(() => ({
  root: {
    width: "755px !important",
    padding: "40px 40px 50px !important",
    fontFamily: "Montserrat",

    "& label": {
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "16px",
      lineHeight: "104.5%",
      color: "#2D3047",
      opacity: 0.9,
      marginBottom: "16px",
      display: "flex",
    },
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
    padding: "9px 20px",
    background: "rgba(218, 230, 229, 0.4)",
    border: "1px solid #7BCBB7",
    borderRadius: "55px",
    height: 50,
    "& input": {
      padding: 0,
    },
  },
  greenBox: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-between",
    background: "linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D",
    borderRadius: "12px",
    padding: "32px 48px",
  },
  greenText: {
    fontFamily: "Agrandir Grand",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "28px",
    lineHeight: "104.5%",
    textTransform: "uppercase",
    color: "#65CB63",
  },
  amount: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "22px",
    lineHeight: "104.5%",
    color: "#54658F",
  },
  inputContainerWhite: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "Agrandir Grand",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "28ox",
    lineHeight: "120%",
    color: "#2D3047",
    padding: "9px 20px",
    border: "1px solid #F0F5F8",
    textAlign: "right",
    borderRadius: "55px",
    height: 50,
  },
  fees: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontSize: "14px",
    lineHeight: "120%",
    color: "#707582",
  },
}));

export default function PodStakingModal({ open, onClose, available, handleRefresh }) {
  const classes = useStyles();

  const [amount, setAmount] = useState<number>(0);
  const [valueUSD, setValueUSD] = useState<number>(0);
  const [fees, setFees] = useState<number>(0);

  const handleSubmit = () => {};

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} className={classes.root} showCloseIcon>
      <Box className={classes.title} mb={1}>
        POD Staking
      </Box>
      <Box className={classes.desc} mb={4}>
        To stake your POD Tokens input the amount you want to stake in field below and anjoy the APR
      </Box>

      <Box className={classes.greenBox} mb={5}>
        <Box mb={1} className={classes.amount}>
          Available POD Tokens
        </Box>
        <Box className={classes.greenText}>{available} PT</Box>
      </Box>

      <Box display="flex">
        <Box flex={1.2} mr={"26px"}>
          <InputWithLabelAndTooltip
            labelName="Amount to stake"
            inputValue={amount.toString()}
            endAdornment={<Box style={{ opacity: 0.5, whiteSpace: "nowrap" }}>POD Tokens</Box>}
            onInputValueChange={e => setAmount(Number(e.target.value))}
            type="number"
            overriedClasses={classes.inputContainer}
          />
        </Box>
        <Box flex={1} textAlign="right">
          <Box className={classes.label} color="#65CB63 !important">
            USD Value
          </Box>
          <div className={classes.inputContainerWhite}>{valueUSD}</div>
          <Box className={classes.fees} mt={"12px"}>
            Fees: <b>{fees} USDp</b>
          </Box>
        </Box>
      </Box>

      <Box display="flex" justifyContent="center" mt={11}>
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
            background: "#2D3047",
            width: "352px",
          }}
          isRounded
        >
          Confirm Purchase
        </PrimaryButton>
      </Box>
    </Modal>
  );
}
