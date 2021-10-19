import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { Color, PrimaryButton, SecondaryButton } from "shared/ui-kit";

import { BlockchainNets } from "shared/constants/constants";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { priviPodClaimReward, priviPodUnstakeTokens } from "shared/services/API";
import TransactionProgressModal from "../TransactionProgressModal";

const useStyles = makeStyles(theme => ({
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
    color: Color.Black,
  },
  desc: {
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "16px",
    lineHeight: "150%",
    textAlign: "center",
    color: Color.GrayDark,
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
    border: "1px solid #A4A4A4",
    borderRadius: "8px",
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
    background: Color.Violet,
    borderRadius: "12px",
    padding: theme.spacing(4),
  },
  greenText: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "18px",
    lineHeight: "104.5%",
    textTransform: "uppercase",
    color: Color.White,
  },
  amount: {
    fontFamily: "Agrandir Grand",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "28px",
    lineHeight: "104.5%",
    color: Color.GreenLight,
  },
}));

export default function UnstakeRedeemModal({
  open,
  onClose,
  type,
  staking,
  pod,
  podInfo,
  handleRefresh,
}: {
  open: boolean;
  type: "unstake" | "redeem" | boolean;
  onClose: any;
  staking: any;
  pod: any;
  podInfo: any;
  handleRefresh: any;
}) {
  const classes = useStyles();
  const { showAlertMessage } = useAlertMessage();

  const [amount, setAmount] = React.useState<number>(0);

  const { account, library, chainId } = useWeb3React();

  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);

  const handleSubmit = async () => {
    setOpenTransactionModal(true);

    const targetChain = BlockchainNets.find(net => net.value === "Polygon Chain");
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Got failed while switching over to target netowrk", { variant: "error" });
        return;
      }
    }
    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);

    if (staking.type === "pod" && type === "unstake") {
      const response = await web3APIHandler.DistributionManager.unstakePodTokens(
        web3,
        account!,
        {
          amount,
          contractAddress: podInfo.distributionManagerAddress,
          token: podInfo.podAddress,
          id: staking.id,
        },
        setHash
      );
      if (response.success) {
        setTransactionSuccess(true);
        const resp = await priviPodUnstakeTokens({
          podId: pod.Id,
          tokenId: response.data.tokenId,
          amount: response.data.amount,
          type: "PIX",
        });
        afterSuccess(resp);
      } else {
        setTransactionSuccess(false);
        showAlertMessage("Failed to unstake tokens", { variant: "error" });
      }
    } else if (staking.type === "pod" && type === "redeem") {
      const response = await web3APIHandler.DistributionManager.claimPodTokenRewards(
        web3,
        account!,
        {
          contractAddress: podInfo.distributionManagerAddress,
          id: staking.id,
        },
        setHash
      );
      if (response.success) {
        setTransactionSuccess(true);
        const resp = await priviPodClaimReward({
          podId: pod.Id,
          tokenId: response.data.tokenId,
          amount: response.data.reward,
          type: "PIX",
        });
        afterSuccess(resp);
      } else {
        setTransactionSuccess(false);
        showAlertMessage("Failed to claim reward.", { variant: "error" });
      }
    } else if (staking.type === "copyright" && type === "unstake") {
      const response = await web3APIHandler.DistributionManager.unstakeCopyrightFractions(
        web3,
        account!,
        {
          amount,
          contractAddress: podInfo.distributionManagerAddress,
          token: podInfo.copyrightToken,
          id: staking.id,
        },
        setHash
      );
      if (response.success) {
        setTransactionSuccess(true);
        const resp = await priviPodUnstakeTokens({
          podId: pod.Id,
          tokenId: response.data.tokenId,
          amount: response.data.amount,
          type: "PIX",
        });
        afterSuccess(resp);
      } else {
        setTransactionSuccess(false);
        showAlertMessage("Failed to unstake tokens", { variant: "error" });
      }
    } else if (staking.type === "copyright" && type === "redeem") {
      const response = await web3APIHandler.DistributionManager.claimCopyrightFractionRewards(
        web3,
        account!,
        {
          contractAddress: podInfo.distributionManagerAddress,
          id: staking.id,
        },
        setHash
      );
      if (response.success) {
        setTransactionSuccess(true);
        const resp = await priviPodClaimReward({
          podId: pod.Id,
          tokenId: response.data.tokenId,
          amount: response.data.reward,
          type: "PIX",
        });
        afterSuccess(resp);
      } else {
        setTransactionSuccess(false);
        showAlertMessage("Failed to claim reward.", { variant: "error" });
      }
    }
  };

  const afterSuccess = response => {
    if (response.success) {
      onClose();
      handleRefresh();
    }
  };

  return (
    <>
      {openTranactionModal ? (
        <TransactionProgressModal
          open={openTranactionModal}
          onClose={() => {
            setHash("");
            setTransactionSuccess(null);
            setOpenTransactionModal(false);
          }}
          txSuccess={transactionSuccess}
          hash={hash}
        />
      ) : (
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
          <InputWithLabelAndTooltip
            inputValue={amount.toString()}
            endAdornment={<Box style={{ opacity: 0.7, whiteSpace: "nowrap" }}>{pod.TokenSymbol}</Box>}
            onInputValueChange={e => setAmount(Number(e.target.value))}
            type="number"
            disabled={type === "redeem"}
            overriedClasses={classes.inputContainer}
          />

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
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              onClick={handleSubmit}
              size="small"
              style={{
                mixBlendMode: "normal",
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
                background: Color.Purple,
              }}
            >
              {type === "unstake" ? "Unstake" : "Redeem"}
            </PrimaryButton>
          </Box>
        </Modal>
      )}
    </>
  );
}
