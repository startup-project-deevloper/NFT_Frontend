import React, { useState } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import { switchNetwork } from "shared/functions/metamask";

import { Grid, makeStyles } from "@material-ui/core";
import { Modal, PrimaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import TransactionProgressModal from "shared/ui-kit/Modal/Modals/TransactionProgressModal";

import { useTypedSelector } from "store/reducers/Reducer";
import Box from "shared/ui-kit/Box";
import { useAlertMessage } from "shared/hooks/useAlertMessage";

import { BlockchainNets } from "shared/constants/constants";
import { toDecimals, toNDecimals } from "shared/functions/web3";
import { bidSyntheticNFTAuction } from "shared/services/API/SyntheticFractionalizeAPI";

const useBidFractionModalStyles = makeStyles(theme => ({
  modal: {
    padding: "27px 16px",
    maxWidth: "487px !important",
    "& h3": {
      marginBottom: "20px",
      color: "#000000",
      fontSize: "18px",
      lineHegith: "27px",
      fontWeight: 800,
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
    padding: "8px 32px",
    borderRadius: "4px",
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

const SyntheticAuctionBidModal = ({ open, onClose, previousBid, nft, handleRefresh }) => {
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

    if (nft?.auctionData?.auctionAddress) {
      handleOpenTransactionModal();
      const contractAddress = nft?.auctionData?.auctionAddress;
      const web3 = new Web3(library.provider);
      const targetChain = BlockchainNets[1];
      const web3APIHandler = targetChain.apiHandler;

      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0);
        if (!isHere) {
          showAlertMessage(`Got failed while switching over to polygon network`, { variant: "error" });
          return;
        }
      }

      let balance = await web3APIHandler.Erc20["JOT"].balanceOf(web3, nft?.JotAddress, { account });
      let decimals = await web3APIHandler.Erc20["JOT"].decimals(web3, nft?.JotAddress);
      if (+toDecimals(balance, decimals) < amount) {
        showAlertMessage(`Insufficient balance to place bid`, { variant: "error" });
        return;
      }

      const approved = await web3APIHandler.Erc20["JOT"].approve(
        web3,
        account!,
        nft?.JotAddress,
        contractAddress,
        toNDecimals(amount, decimals)
      );
      if (!approved) {
        showAlertMessage(`Can't proceed to place bid`, { variant: "error" });
        setTransactionInProgress(false);
        setTransactionSuccess(false);
        return;
      }
      web3APIHandler.SyntheticNFTAuction.bid(web3, account!, nft, {
        amount: toNDecimals(amount, decimals),
        setHash,
      }).then(async res => {
        if (res.success) {
          setHash(res.data.hash);
          setTransactionInProgress(false);
          setTransactionSuccess(true);
          const response = await bidSyntheticNFTAuction({
            collectionId: nft.collection_id,
            syntheticId: nft.SyntheticID,
            bidAmount: amount,
            bidderAddress: account!,
            bidderInfo: {
              id: user.id,
              avatar: user.anonAvatar,
              username: `${user.firstName} ${user.lastName}`,
            },
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

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} className={classes.modal} showCloseIcon={true}>
      <Grid container spacing={2} direction="column" alignItems="center">
        <Grid item>
          <h3>New Buying Offer</h3>
        </Grid>
        <Grid item container spacing={2}>
          <Grid item xs={9}>
            <InputWithLabelAndTooltip
              overriedClasses=""
              type="number"
              minValue={previousBid}
              onInputValueChange={e => setAmount(Number(e.target.value))}
              inputValue={amount}
            />
          </Grid>
          <Grid item xs={3}>
            <Box className={classes.tokenLabel}>{nft.JotSymbol}</Box>
          </Grid>
        </Grid>

        <Grid item>
          <Box display="flex" justifyContent="center">
            <PrimaryButton className={classes.placeBtn} onClick={handleOk} size="medium">
              Place Offer
            </PrimaryButton>
          </Box>
        </Grid>
      </Grid>

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

export default SyntheticAuctionBidModal;
