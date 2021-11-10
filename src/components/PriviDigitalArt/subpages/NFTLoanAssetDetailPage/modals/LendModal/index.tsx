import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { switchNetwork } from "shared/functions/metamask";

import { Typography } from "@material-ui/core";
import { Modal, PrimaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import TransactionProgressModal from "shared/ui-kit/Modal/Modals/TransactionProgressModal";
import Box from "shared/ui-kit/Box";
import { useAlertMessage } from "shared/hooks/useAlertMessage";

import { useLendModalStyles } from "./index.styles";
import PolygonAPI from "shared/services/API/polygon";

const LendModal = ({ open, onClose, onSuccess, market }) => {
  const classes = useLendModalStyles();
  const { showAlertMessage } = useAlertMessage();
  const [amount, setAmount] = useState<number>(0);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const [network, setNetwork] = useState<string>("");
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTransactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const [txnHash, setTxnHash] = useState<string>("");

  const { account, library, chainId } = useWeb3React();

  useEffect(() => {
    if (!open) {
      setAmount(0)
      setIsApproved(false)
      setOpenTransactionModal(false)
    }
  }, [open])

  useEffect(() => {
    handleSetBalance()
  }, [market])

  const handleSetBalance = async () => {
    if (library) {
      const web3 = new Web3(library.provider);
      if (account && web3 && market) {
        let _balance = await PolygonAPI.Erc20[market.token_info.Symbol].balanceOf(web3, { account });
        let _decimals = await PolygonAPI.Erc20[market.token_info.Symbol].decimals(web3, { account });
        _balance = _balance / Math.pow(10, _decimals);
        setBalance(_balance)
      }
    }
  }

  const handleOpenTransactionModal = () => {
    setOpenTransactionModal(true);
    setTransactionInProgress(true);
    setNetwork("polygon");
  };

  const handleCloseTransactionModal = () => {
    setOpenTransactionModal(false);
  };

  const handleApprove = async () => {
    try {
      if (chainId && chainId !== 80001) {
        const isOnPolygon = await switchNetwork(80001);
        if (!isOnPolygon) {
          showAlertMessage(`Got failed while switching over to polygon network`, { variant: "error" });
          return;
        }
      }
      if (library) {
        const web3 = new Web3(library.provider);
        if (account && web3 && market) {
          let balance = await PolygonAPI.Erc20[market.token_info.Symbol].balanceOf(web3, { account });
          let decimals = await PolygonAPI.Erc20[market.token_info.Symbol].decimals(web3, { account });
          balance = balance / Math.pow(10, decimals);
          if (balance < amount) {
            showAlertMessage(`Insufficient balance to approve`, { variant: "error" });
            return;
          }
          handleOpenTransactionModal()
          const approved = await PolygonAPI.Erc20[market.token_info.Symbol].approve(web3, account!, market.CToken, amount * (10 ** decimals), setTxnHash);
          if (!approved) {
            showAlertMessage(`Can't proceed to approve`, { variant: "error" });
            setTransactionInProgress(false);
            setTransactionSuccess(false);
            return;
          }
          setIsApproved(true);
          showAlertMessage(`Successfully approved ${amount} ${market.token_info.Symbol}!`, {
            variant: "success",
          });
          setTransactionSuccess(true);
        }
      }
    } catch (error) {
      console.log(error);
      showAlertMessage("Something went wrong. Please try again!", {
        variant: "error",
      });
    } finally {
      setTransactionInProgress(false);
    }
  };

  const handleLend = async () => {
    setTxnHash('')
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
        await PolygonAPI.FractionalLoan.lend(web3, account, market.CToken, _bn_number,  setTxnHash);
        onSuccess && onSuccess(amount);
        showAlertMessage(`Successfully lent ${amount} ${market?.token_info?.Symbol}!`, {
          variant: "success",
        });
        setTransactionSuccess(true);
        onClose()
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
        <Typography className={classes.title}>Lend {market?.token_info?.Symbol}</Typography>
      </Box>
      <Typography className={classes.content}>Set the deposit amount you want to place as collatarall. Your amount of borrowable funds will depend on it. </Typography>
      <Box marginTop="30px">
        <InputWithLabelAndTooltip
          inputValue={amount !== 0 ? amount.toString() : ""}
          type="number"
          placeHolder="Lend amount"
          onInputValueChange={e => {
            setAmount(Number(e.target.value));
          }}
          startAdornment={<img width="25px" src={market?.token_info?.ImageUrl} style={{ margin: '0px 10px 0px 0px' }} />}
          disabled={isApproved}
        />
      </Box>
      <Box marginTop="8px" display="flex">
        <Typography className={classes.small}>Wallet Balance</Typography>
        <Typography className={classes.smallBold}>{`${balance} ${market?.token_info?.Symbol}`}</Typography>
      </Box>
      <Box className={classes.rateBox} display="flex" justifyContent="space-between">
        <Typography className={classes.small}>Lending Rate</Typography>
        <Typography className={classes.smallBold}>0%</Typography>
      </Box>
      <Box className={classes.buttonContainer} display="flex" justifyContent="space-between">
        <PrimaryButton className={classes.placeBtn} onClick={handleApprove} size="medium" disabled={!market || isApproved || transactionInProgress || amount == 0}>
          {
            isApproved ? 'Approved' : 'Approve'
          }
        </PrimaryButton>
        <PrimaryButton className={classes.placeBtn} onClick={handleLend} size="medium" disabled={!market || !isApproved || transactionInProgress || amount == 0}>
          Lend
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

export default LendModal;
