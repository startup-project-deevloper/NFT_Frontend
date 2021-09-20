import React, { useState, useRef } from "react";
import axios from "axios";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import URL from "shared/functions/getURL";
import { switchNetwork } from "shared/functions/metamask";

import { Grid } from "@material-ui/core";
import { Modal, PrimaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import TransactionProgressModal from "shared/ui-kit/Modal/Modals/TransactionProgressModal";

import { useTypedSelector } from "store/reducers/Reducer";
import Box from "shared/ui-kit/Box";
import { useBidModalStyles } from "./index.styles";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
// import { buildJsxFromObject } from "shared/functions/commonFunctions";
// import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";

import Web3Config from "shared/connectors/web3/config";
import { toNDecimals, toDecimals } from "shared/functions/web3";

import { LoanBlockchainNet } from "shared/constants/constants";
import { getLoanChainImageUrl } from "shared/functions/chainFucntions";

const BidModal = ({ open, onClose, previousBid, loan, setLoan, refresh = () => {} }) => {
  const classes = useBidModalStyles();
  const user = useTypedSelector(state => state.user);
  const { showAlertMessage } = useAlertMessage();
  const [amount, setAmount] = useState<number>(previousBid);

  const [hash, setHash] = useState<string>("");
  const [network, setNetwork] = useState<string>("");
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);

  const [openTransactionModal, setOpenTransactionModal] = useState<boolean>(false);

  const { account, library, chainId } = useWeb3React();

  // const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  // const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const validate = () => {
    if (!amount) {
      showAlertMessage(`Please type an amount`, { variant: "error" });
      return false;
    }
    if (previousBid && amount <= previousBid) {
      showAlertMessage(`Amount can't be less than previous bid`, { variant: "error" });
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
    transactionSuccess && refresh && refresh();
  };

  const handleOk = async () => {
    if (!validate()) return;
    const targetChain = LoanBlockchainNet.find(net => net.value === loan.media.BlockchainNetwork);
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage(`Got failed while switching over to polygon netowr`, { variant: "error" });
        return;
      }
    }
    const web3APIHandler = targetChain.apiHandler;
    const web3Config = targetChain.config;
    const web3 = new Web3(library.provider);

    // Check if user has enough balance to bid
    let balance = await web3APIHandler.Erc20[loan.FundingToken].balanceOf(web3, { account });
    let decimals = await web3APIHandler.Erc20[loan.FundingToken].decimals(web3);
    balance = Number(toDecimals(balance, decimals));
    if (balance < amount) {
      showAlertMessage(`Insufficient balance to place bid`, { variant: "error" });
      return;
    }

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
        showAlertMessage(`Can't proceed to place bid`, { variant: "error" });
        setTransactionInProgress(false);
        setTransactionSuccess(false);
        return;
      }
    }
    const tokenContractAddress = loan.media.TokenContractAddress || web3Config.CONTRACT_ADDRESSES.PRIVIERC721;
    const tokenId = loan.media.BlockchainId;
    web3APIHandler.Loan.placeBid(web3, account!, {
      tokenContractAddress: tokenContractAddress,
      tokenId: tokenId,
      bidAmount: toNDecimals(amount, decimals),
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
            TransactionHash: tx.Id,
            BidAmount: amount,
            BidderAddress: account!,
            AvailableFunds: availableFunds,
            Date: new Date().getTime(),
            MediaSymbol: loan.media.MediaSymbol,
          },
        };
        setHash(tx.Id);
        setTransactionInProgress(false);
        const response = await axios.post(`${URL()}/nftloan/bidCollateralizedNFT/v2_p`, body);
        if (response.data.success) {
          showAlertMessage(`Successfully placed a bid`, { variant: "success" });
          setLoan && setLoan({
            ...loan,
            Bid: amount,
            BidderAddress: account!,
          });
          setTransactionSuccess(true);
        } else {
          showAlertMessage(`Failed to Place a Bid`, { variant: "error" });
          setTransactionSuccess(false);
        }
      } else {
        setTransactionInProgress(false);
        setTransactionSuccess(false);
      }
    });
  };

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} className={classes.modal} showCloseIcon={true}>
      <h3>Place a bid</h3>
      <Box display="flex" alignItems="center" mb="24px">
        <div
          className={classes.mediaImage}
          style={{
            backgroundImage: `url(${
              loan.media.Type && loan.media.Type !== "DIGITAL_ART_TYPE"
                ? loan.media.UrlMainPhoto
                : loan.media.UrlMainPhoto ?? loan.media.Url ?? loan.media.url
            })`,
          }}
        />
        <Box>
          <div className={classes.mediaTitle}>{loan.media.MediaName ?? loan.media.title}</div>
          <div className={classes.interest}>{`${((loan?.Loan?.Interest ?? 0.1) * 100).toFixed(0)}%`}</div>
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
                minValue={previousBid}
                onInputValueChange={e => setAmount(Number(e.target.value))}
                inputValue={amount}
                labelName={"Amount"}
              />
            </Grid>
            <Grid item xs={3}>
              <Box className={classes.tokenLabel}>{loan.FundingToken}</Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" mt="40px">
        <PrimaryButton className={classes.placeBtn} onClick={handleOk} size="medium">
          Place now
        </PrimaryButton>
      </Box>

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

export default BidModal;
