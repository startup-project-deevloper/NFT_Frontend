import React, { useState } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { Modal } from "shared/ui-kit";
import { makeStyles } from "@material-ui/core/styles";
import { useAlertMessage } from "shared/hooks/useAlertMessage";

const useRedeemModalStyles = makeStyles(theme => ({
  root: {
    width: "350px !important",
    display: "flex",
    flexDirection: "column",
    "& label": {
      color: "#1A1B1C",
      fontSize: "14px",
      lineHeight: "120%",
    },
    "& .MuiInput-root": {
      margin: "8px 0px 0px",
      background: "#FFFFFF",
      borderRadius: "8px",
      height: "40px",
      border: "1px solid #A4A4A4",
      fontFamily: "Agrandir",
    },
  },
  title: {
    fontSize: "14px",
    lineHeight: "120%",
    fontWeight: 800,
    color: "#431AB7",
    alignSelf: "center",
    marginBottom: "24px",
    textAlign: "center",
  },
  balance: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "14px",
    lineHeight: "21px",
    color: "#1A1B1C",
    marginTop: "4px",
    marginBottom: "24px",
  },
  button: {
    background: "#431AB7",
    borderRadius: "4px",
    order: 0,
    flexGrow: 1,
    margin: "24px 0px 0px",
    padding: "8px 32px",
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "18px",
    textAlign: "center",
    color: "#FFFFFF",
  },
  purpleText: {
    zIndex: 2,
    textAlign: "center",
    color: "#431AB7",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "21px",
    alignSelf: "center",
    marginTop: "calc(191px / 2 - 20px)",
    marginBottom: "calc(-191px / 2 - 20px)",
    width: "220px",
    maxWidth: "220px",
  },
  image: {
    zIndex: 1,
    height: "191px",
    width: "286px",
    alignSelf: "center",
  },
}));

export const RedeemFractionsModal = (props: any) => {
  const { open, handleClose, selectedChain, media, handleRefresh } = props;
  const classes = useRedeemModalStyles();
  const { showAlertMessage } = useAlertMessage();

  const [fractionsBalance, setFractionsBalance] = useState<number>(0);
  const [receiveAmount, setReceiveAmount] = useState<number>(0);

  const { account, library, chainId } = useWeb3React();

  const token = media?.FundingToken;

  React.useEffect(() => {
    (async () => {
      if (!media?.FractionalizeData?.erc20VaultTokenAddress) {
        return;
      }
      const web3 = new Web3(library.provider);
      const contractAddress = media?.FractionalizeData?.erc20VaultTokenAddress;
      const balance = await selectedChain.apiHandler.TokenVault.balanceOf(web3, account!, contractAddress);
      const decimals = await selectedChain.apiHandler.TokenVault.decimals(web3, account!, contractAddress);
      setFractionsBalance(balance / Math.pow(10, decimals));
      setReceiveAmount((balance / Math.pow(10, decimals)) * media?.FractionalizeData?.listPrice);
    })();
  }, [media]);

  const handleRedeem = async () => {
    if (!media?.FractionalizeData?.erc20VaultTokenAddress) {
      return;
    }

    const web3 = new Web3(library.provider);
    const contractAddress = media?.FractionalizeData?.erc20VaultTokenAddress;

    const contractResponse = await selectedChain.apiHandler.TokenVault.cash(web3, account!, contractAddress);
    if (contractResponse.success) {
      showAlertMessage("Redeemed successfully", { variant: "success" });
      handleRefresh();
      handleClose();
    }
  };

  return (
    <Modal size="small" isOpen={open} onClose={handleClose} showCloseIcon className={classes.root}>
      <div className={classes.title}>Redeem Fractions</div>
      <div className={classes.balance}>{`Redeem Amount: ${fractionsBalance}`}</div>
      <div className={classes.purpleText}>{`You will receive ${receiveAmount} ${token ?? "USDT"}`}</div>
      <img className={classes.image} src={require("assets/icons3d/redeem_table.png")} alt="" />
      <button className={classes.button} onClick={handleRedeem}>
        Redeem
      </button>
    </Modal>
  );
};
