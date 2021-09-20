import React, { useState } from "react";
import axios from "axios";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import URL from "shared/functions/getURL";
import { switchNetwork } from "shared/functions/metamask";

import { Color, Modal, PrimaryButton, StyledDivider } from "shared/ui-kit";
import { handleSetStatus } from "shared/functions/commonFunctions";

import { useWithdrawFundsModalStyles } from "./index.styles";
import { Box, Grid } from "@material-ui/core";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import TransactionProgressModal from "shared/ui-kit/Modal/Modals/TransactionProgressModal";

import { toNDecimals, toDecimals } from "shared/functions/web3";
import { LoanBlockchainNet } from "shared/constants/constants";
import { getLoanChainImageUrl } from "shared/functions/chainFucntions";

const WithdrawFundsModal = ({ open, onClose, loan, reload }) => {
  const classes = useWithdrawFundsModalStyles();

  const [amount, setAmount] = useState<number>(0);

  const [status, setStatus] = useState<any>(""); // show status of the operation

  const [hash, setHash] = useState<string>("");
  const [network, setNetwork] = useState<string>("");
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);

  const [openTransactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const [disableWithdrawBtn, setDisableWithdrawBtn] = useState<boolean>(false);

  const { account, library, chainId } = useWeb3React();

  React.useEffect(() => {
    setDisableWithdrawBtn(false);
  }, [open]);

  const validate = () => {
    if (!amount) {
      handleSetStatus(`Please type an amount`, "error", setStatus);
      return false;
    } else if (loan.Available && amount > loan.Available) {
      handleSetStatus(`Amount can't be more than available funds to Withdraw`, "error", setStatus);
      return false;
    }
    return true;
  };

  const handleOpenTransactionModal = network => {
    setOpenTransactionModal(true);
    setTransactionInProgress(true);
    setNetwork(network);
  };

  const handleCloseTransactionModal = () => {
    setOpenTransactionModal(false);
    onClose();
  };

  const handleWithdraw = async () => {
    if (validate()) {
      setDisableWithdrawBtn(true);
      //TODO: place bid
      const targetChain = LoanBlockchainNet.find(net => net.value === loan.media.BlockchainNetwork);
      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0);
        if (!isHere) {
          handleSetStatus(`Got failed while switching over to polygon network`, "error", setStatus);
          setDisableWithdrawBtn(false);
          return;
        }
      }

      const web3APIHandler = targetChain.apiHandler;
      const web3Config = targetChain.config;
      const web3 = new Web3(library.provider);
      let decimals = await web3APIHandler.Erc20[loan.FundingToken].decimals(web3);

      handleOpenTransactionModal(targetChain?.value);

      // Check contract approval for principal token
      // if the allowance is not enough, then take approval
      const spender = web3Config.CONTRACT_ADDRESSES.ERC721_COLLATRALISE_AUCTION;
      let allowance = await web3APIHandler.Erc20[loan.FundingToken].allowance(web3, {
        owner: account!,
        spender: spender,
      });
      allowance = Number(toDecimals(allowance, decimals));
      if (allowance < amount) {
        const approved = await web3APIHandler.Erc20[loan.FundingToken].approve(web3, account!, spender);
        if (!approved) {
          handleSetStatus(`Can't proceed to withdraw funds`, "error", setStatus);
          setTransactionInProgress(false);
          setTransactionSuccess(false);
          setDisableWithdrawBtn(false);
          return;
        }
      }
      const tokenContractAddress =
        loan.media.TokenContractAddress || web3Config.CONTRACT_ADDRESSES.PRIVIERC721;
      const tokenId = loan.media.BlockchainId;
      web3APIHandler.Loan.withdrawFunds(web3, account!, {
        tokenContractAddress: tokenContractAddress,
        tokenId: tokenId,
        withdrawAmount: toNDecimals(amount, decimals),
      }).then(async res => {
        if (res) {
          const tx = res.transaction;
          const blockchainRes = { output: { Transactions: {} } };
          blockchainRes.output.Transactions[tx.Id] = [tx];

          let availableFunds = await web3APIHandler.Loan.getAvailableFunds(web3, {
            tokenContractAddress: tokenContractAddress,
            tokenId: tokenId,
          });
          availableFunds = Number(toDecimals(availableFunds, decimals));

          const body = {
            BlockchainRes: blockchainRes,
            AdditionalData: {
              Debt: Number(loan.Debt) + Number(amount),
              Amount: amount,
              AvailableFunds: availableFunds,
              MediaSymbol: loan.media.MediaSymbol,
              Date: new Date().getTime(),
              TransactionHash: tx.Id,
            },
          };
          setHash(tx.Id);
          setTransactionInProgress(false);
          setTransactionSuccess(true);
          const response = await axios.post(`${URL()}/nftloan/withdrawCollaterizedNFTFunds/v2_p`, body);
          if (response.data.success) {
            handleSetStatus(`Withdraw funds succeed`, "success", setStatus);
            reload();
          } else {
            handleSetStatus(`Withdraw funds failed`, "error", setStatus);
          }
        } else {
          setTransactionInProgress(false);
          setTransactionSuccess(false);
        }
        setDisableWithdrawBtn(false);
      }).catch(e => {
        setDisableWithdrawBtn(false);
      });
    }
  };

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} className={classes.modal} showCloseIcon={true}>
      <h3>Withdraw Funds</h3>

      <Box width="100%">
        <StyledDivider color={Color.GrayLight} type="solid" mb={2} />
      </Box>
      <div className={classes.bigTitle}>{`Available: ${
        loan.Available ? parseInt(`${loan.Available * 100000}`) / 100000 : 0
      } ${loan.FundingToken || "ETH"}`}</div>
      <Box width="100%">
        <StyledDivider color={Color.GrayLight} type="solid" mb={2} mt={2} />
      </Box>

      <Box display="flex" alignItems="center" mb="24px">
        <div
          className={classes.mediaImage}
          style={{
            backgroundImage: loan.media
              ? `url(${
                  loan.media?.Type && loan.media?.Type !== "DIGITAL_ART_TYPE"
                    ? loan.media?.UrlMainPhoto
                    : loan.media?.UrlMainPhoto ?? loan.media?.Url ?? loan.media?.url
                })`
              : "none",
          }}
        />
        <Box>
          <div className={classes.mediaTitle}>
            {loan.media?.MediaName ?? loan.media?.title ?? "Media Name"}
          </div>
          <div className={classes.interest}>{`Interest: ${((loan?.Interest ?? 0.1) * 100).toFixed(0)}%`}</div>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <InputWithLabelAndTooltip
            endAdornment={
              <img
                src={getLoanChainImageUrl(loan.Chain, loan.media.BlockchainNetwork)}
                alt={"chain"}
                className={classes.chain}
              />
            }
            inputValue={loan.Chain || "POLYGON"}
            disabled
            type="text"
            labelName={"Chain"}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container spacing={1}>
            <Grid item xs={9}>
              <InputWithLabelAndTooltip
                overriedClasses=""
                type="number"
                maxValue={loan?.Available}
                onInputValueChange={e =>
                  Number(e.target.value) <= loan?.Available && setAmount(Number(e.target.value))
                }
                inputValue={amount}
                labelName={"Amount"}
              />
            </Grid>
            <Grid item xs={3}>
              <Box className={classes.tokenLabel}>{loan.FundingToken || "ETH"}</Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="flex-end" mt="40px">
        <PrimaryButton
          className={classes.primaryBtn}
          onClick={handleWithdraw}
          disabled={disableWithdrawBtn || !loan.Available}
          size="medium"
        >
          Withdraw
        </PrimaryButton>
      </Box>
      {status && (
        <AlertMessage
          key={status.key}
          message={status.msg}
          variant={status.variant}
          onClose={() => setStatus(undefined)}
        />
      )}

      <TransactionProgressModal
        open={openTransactionModal}
        onClose={handleCloseTransactionModal}
        transactionInProgress={transactionInProgress}
        transactionSuccess={transactionSuccess}
        hash={hash}
        network={network}
      />
    </Modal>
  );
};

export default WithdrawFundsModal;
