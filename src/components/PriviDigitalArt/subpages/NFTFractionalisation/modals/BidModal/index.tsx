import React, { useState } from "react";
import axios from "axios";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import URL from "shared/functions/getURL";
import { switchNetwork } from "shared/functions/metamask";

import { Grid, makeStyles } from "@material-ui/core";
import { Modal, PrimaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import TransactionProgressModal from "shared/ui-kit/Modal/Modals/TransactionProgressModal";

import { useTypedSelector } from "store/reducers/Reducer";
import Box from "shared/ui-kit/Box";
//import { placeBid } from "shared/services/API";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
// import { buildJsxFromObject } from "shared/functions/commonFunctions";
// import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";

import PolygonAPI from "shared/services/API/polygon";
import PolygonConfig from "shared/connectors/polygon/config";
import { BlockchainNets } from "shared/constants/constants";
import { placeBid } from "shared/services/API/FractionalizeAPI";

const useBidFractionModalStyles = makeStyles(theme => ({
  modal: {
    padding: "27px 16px",
    maxWidth: "350px !important",
    "& h3": {
      marginBottom: "20px",
      color: "#000000",
      fontSIze: "14px",
      lineHegith: "18px",
      fontWeight: 800,
      marginTop: 0,
    },
    "& label": {
      marginBottom: "9px",
      color: "#1A1B1C",
      fontSize: "14px",
      lineHeight: "120%",
    },
    "& .MuiInputBase-root": {
      background: "#F7F9FE",
      border: "none",
      borderRadius: "16px",
      margin: 0,
    },
  },
  mediaImage: {
    borderRadius: "16px",
    height: "64px",
    width: "64px",
    marginRight: "16px",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  mediaTitle: {
    color: "#181818",
    fontSize: "16px",
    lineHeight: "104.5%",
    marginBottom: "4px",
  },
  interest: {
    color: "#707582",
    fontSize: "14px",
    lineHeight: "104.5%",
  },
  chain: {
    width: 22,
    height: 22,
    objectFit: "contain",
    borderRadius: "50%",
  },
  placeBtn: {
    background: "#431AB7 !important",
  },
  tokenLabel: {
    fontSize: 18,
    fontWeight: 800,
    color: "#431AB7",
    lineHeight: "46px",
    height: "100%",
    display: "flex",
    alignItems: "flex-end",
  },
}));

const BidFractionModal = ({ open, onClose, previousBid, media, selectedChain, handleRefresh }) => {
  const classes = useBidFractionModalStyles();
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
    if (previousBid && amount < previousBid) {
      showAlertMessage(`Amount can't be less than previous bid`, { variant: "error" });
      return false;
    }
    return true;
  };

  const handleOpenTransactionModal = () => {
    setOpenTransactionModal(true);
    setTransactionInProgress(true);
    setNetwork("polygon");
  };

  const handleCloseTransactionModal = () => {
    setOpenTransactionModal(false);
    onClose();
  };

  const handleOk = async () => {
    if (!validate()) return;

    if (media?.FractionalizeData?.erc20VaultTokenAddress) {
      const contractAddress = media?.FractionalizeData?.erc20VaultTokenAddress;
      const web3 = new Web3(library.provider);
      const token = media?.FractionalizeData?.listToken;
      let balance = await selectedChain.apiHandler.Erc20[token].balanceOf(web3, { account });
      let decimals = await selectedChain.apiHandler.Erc20[token].decimals(web3, { account });
      balance = balance / Math.pow(10, decimals);
      if (balance < amount) {
        showAlertMessage(`Insufficient balance to place bid`, { variant: "error" });
        return;
      }

      handleOpenTransactionModal();
      const allowance = await selectedChain.apiHandler.Erc20[token].allowance(web3, {
        owner: account!,
        spender: contractAddress,
      });
      if (!allowance || allowance <= 0) {
        const approved = await selectedChain.apiHandler.Erc20[token].approve(web3, account!, contractAddress);
        if (!approved) {
          showAlertMessage(`Can't proceed to place bid`, { variant: "error" });
          setTransactionInProgress(false);
          setTransactionSuccess(false);
          return;
        }
      }
      selectedChain.apiHandler.TokenVault.placeBid(
        web3,
        account!,
        { amount: amount * Math.pow(10, decimals) },
        contractAddress
      ).then(async res => {
        if (res) {
          setHash(res.data.hash);
          setTransactionInProgress(false);
          setTransactionSuccess(true);
          const response = await placeBid({
            mediaSymbol: media?.MediaSymbol,
            amount,
            bidder: account!,
            hash: res.data.hash,
          });
          if (response.success) {
            onClose();
            handleRefresh();
          } else {
            showAlertMessage(`Failed to Place a Bid`, { variant: "error" });
          }
        } else {
          setTransactionInProgress(false);
          setTransactionSuccess(false);
        }
      });
    }
  };

  const bidOnPolygon = async () => {
    if (chainId && chainId !== 80001) {
      const isOnPolygon = await switchNetwork(80001);
      if (!isOnPolygon) {
        showAlertMessage(`Got failed while switching over to polygon network`, { variant: "error" });
        return;
      }
    }
    const web3 = new Web3(library.provider);
    let balance = await PolygonAPI.Erc20[media.FundingToken].balanceOf(web3, { account });
    let decimals = await PolygonAPI.Erc20[media.FundingToken].decimals(web3, { account });
    balance = balance / Math.pow(10, decimals);
    if (balance < amount) {
      showAlertMessage(`Insufficient balance to place bid`, { variant: "error" });
      return;
    }

    handleOpenTransactionModal();
    const spender = PolygonConfig.CONTRACT_ADDRESSES.ERC721_COLLATRALISE_AUCTION;
    const allowance = await PolygonAPI.Erc20[media.FundingToken].allowance(web3, {
      owner: account!,
      spender: spender,
    });
    if (allowance <= 0) {
      const approved = await PolygonAPI.Erc20[media.FundingToken].approve(web3, account!, spender);
      if (!approved) {
        showAlertMessage(`Can't proceed to place bid`, { variant: "error" });
        setTransactionInProgress(false);
        setTransactionSuccess(false);
        return;
      }
    }
    PolygonAPI.Loan.placeBid(web3, account!, {
      tokenId: media.BlockchainId,
      bidAmount: amount,
    }).then(async res => {
      if (res) {
        const tx = res.transaction;
        const blockchainRes = { output: { Transactions: {} } };
        blockchainRes.output.Transactions[tx.Id] = [tx];
        const body = {
          BlockchainRes: blockchainRes,
        };
        setHash(tx.Id);
        setTransactionInProgress(false);
        setTransactionSuccess(true);
        const response = await axios.post(`${URL()}/nftloan/bidCollateralizedNFT/v2_p`, body);
        if (response.data.success) {
          showAlertMessage(`Amount can't be less than previous bid`, { variant: "success" });
        } else {
          showAlertMessage(`Failed to Place a Bid`, { variant: "error" });
        }
      } else {
        setTransactionInProgress(false);
        setTransactionSuccess(false);
      }
    });
  };

  const bidOnEthereum = async () => {
    const web3 = new Web3(library.provider);
  };

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} className={classes.modal} showCloseIcon={true}>
      <h3>Place a bid</h3>
      <Box display="flex" alignItems="center" mb="24px">
        <div
          className={classes.mediaImage}
          style={{
            backgroundImage: `url(${
              media.Type && media.Type !== "DIGITAL_ART_TYPE"
                ? media.UrlMainPhoto
                : media.UrlMainPhoto ?? media.Url ?? media.url
            })`,
          }}
        />
        <Box>
          <div className={classes.mediaTitle}>{media.MediaName ?? media.title}</div>
          <div className={classes.interest}>{`${((media?.Auctions?.Interest ?? 0.1) * 100).toFixed(
            0
          )}%`}</div>
        </Box>
      </Box>

      <Grid container spacing={2}>
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
          <Box className={classes.tokenLabel}>{media.FundingToken}</Box>
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

export default BidFractionModal;
