import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { switchNetwork } from "shared/functions/metamask";

import { Typography } from "@material-ui/core";
import { Divider, Modal, PrimaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import TransactionProgressModal from "shared/ui-kit/Modal/Modals/TransactionProgressModal";
import Box from "shared/ui-kit/Box";
import { useAlertMessage } from "shared/hooks/useAlertMessage";

import { useWithdrawModalStyles } from "./index.styles";
import PolygonAPI from "shared/services/API/polygon";
import { getCorrectNumber } from "shared/helpers/number";

const WithdrawModal = ({ open, onClose, onSuccess, market }) => {
  const classes = useWithdrawModalStyles ();
  const { showAlertMessage } = useAlertMessage();
  const [amount, setAmount] = useState<number>(0);
  const [network, setNetwork] = useState<string>("");
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTransactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const [txnHash, setTxnHash] = useState<string>("");

  const { account, library, chainId } = useWeb3React();

  useEffect(() => {
    if (!open) {
      setAmount(0)
      setOpenTransactionModal(false)
    } else {
    }
  }, [open])

  const handleOpenTransactionModal = () => {
    setOpenTransactionModal(true);
    setTransactionInProgress(true);
    setNetwork("polygon");
  };

  const handleCloseTransactionModal = () => {
    setOpenTransactionModal(false);
  };

  const handleWithdraw = async () => {
    if (chainId && chainId !== 80001) {
      const isOnPolygon = await switchNetwork(80001);
      if (!isOnPolygon) {
        showAlertMessage(`Got failed while switching over to polygon network`, { variant: "error" });
        return;
      }
    }
    try {
      const web3 = new Web3(library.provider);
      if (account && web3 && market) {
        let decimals = await PolygonAPI.Erc20[market.token_info.Symbol].decimals(web3, { account });
        let _bn_number = amount * (10 ** decimals)
        handleOpenTransactionModal()
        await PolygonAPI.FractionalLoan.withdraw(web3, account, market.CToken, _bn_number, setTxnHash);
        onSuccess && onSuccess(amount);
        showAlertMessage(`Successfully withdrew ${amount} ${market?.token_info?.Symbol}!`, {
          variant: "success",
        });
        setTransactionSuccess(true);
      }
    } catch (e) {
      console.log("handleSubmit error", e);
      showAlertMessage("Something went wrong. Please try again!", {
        variant: "error",
      });
      setTransactionSuccess(false);
    } finally {
      setTransactionInProgress(false);
      setTxnHash('');
    }
  };

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} className={classes.modal} showCloseIcon={true}>
      <Box display="flex" alignItems="center">
        <img src={market?.token_info?.ImageUrl} alt={`${market?.token_info?.Name} asset`} width="40px" />
        <Typography className={classes.title}>Withdraw {market?.token_info?.Symbol}</Typography>
      </Box>
      <Typography className={classes.content}>Set the amount to withdraw. You can withdraw the input amount of token. </Typography>
      <Typography className={classes.inputTitle}>Amount to withdraw</Typography>
      <Box>
        <InputWithLabelAndTooltip
          inputValue={amount !== 0 ? amount.toString() : ""}
          type="number"
          placeHolder="Withdraw amount"
          onInputValueChange={e => {
            setAmount(Number(e.target.value));
          }}
          startAdornment={<img width="25px" src={market?.token_info?.ImageUrl} style={{ margin: '0px 10px 0px 0px' }} />}
        />
      </Box>
      <Box marginTop="8px" display="flex">
        <Typography className={classes.small}>Lending Balance</Typography>
        <Typography className={classes.smallBold}>{`${getCorrectNumber((market?.lending_balance || 0) / (10 ** (market?.token_info?.Decimals || 0)), 4)} ${market?.token_info?.Symbol}`}</Typography>
      </Box>
      <Box className={classes.buttonContainer} display="flex" justifyContent="center">
        <PrimaryButton className={classes.placeBtn} onClick={handleWithdraw} size="medium" disabled={!market || transactionInProgress || amount == 0}>
          Withdraw
        </PrimaryButton>
      </Box>
      <TransactionProgressModal
        open={openTransactionModal}
        onClose={handleCloseTransactionModal}
        transactionInProgress={transactionInProgress}
        transactionSuccess={transactionSuccess}
        hash={txnHash}
        network={network}
      />
    </Modal>
  );
};

export default WithdrawModal;
