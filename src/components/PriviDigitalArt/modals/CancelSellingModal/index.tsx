import React, { useEffect } from "react";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { useMediaQuery, useTheme } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { Modal, PrimaryButton } from "shared/ui-kit";
import URL from "shared/functions/getURL";
import { modalStyles } from "./index.styles";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";
import { toDecimals, toNDecimals } from "shared/functions/web3";
import TransactionProgressModal from "../TransactionProgressModal";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
// import { deleteSalesSongOffer } from "shared/services/API/PodAPI";

const CancelSellingModal = ({open, handleClose, nftDetailData, onConfirm}) => {
  const classes = modalStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));

  const { account, library, chainId } = useWeb3React();
  const [openTranactionModal, setOpenTransactionModal] = React.useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = React.useState<boolean | null>(null);
  const [hash, setHash] = React.useState<string>('');
  const { showAlertMessage } = useAlertMessage();

  const handleConfirm = async () => {
    setOpenTransactionModal(true);
    const targetChain = BlockchainNets.find(net => net.value === "Polygon Chain");
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Got failed while switching over to target network", { variant: "error" });
        return;
      }
    }
    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);
    const tokenId = nftDetailData.tokenId ? nftDetailData.tokenId : 1;

    const response = await web3APIHandler.openSalesManager.cancelSaleProposal(
      web3,
      account!,
      {
        collection: nftDetailData.nftAddress,
        tokenId,
        paymentToken: nftDetailData.sellingOffer.PaymentToken,
        price: Number(nftDetailData.sellingOffer.Price),
        owner: account,
      },
      setHash
    );

    if (response.success) {
      setTransactionSuccess(true);
      // await deleteSalesSongOffer({
      //   songId: nftDetailData.Id,
      //   offerId: nftDetailData.offerId
      // });
      onClose();
      onConfirm();
      //   handleRefresh();
    } else {
      setTransactionSuccess(false);
      showAlertMessage("Failed to edit price of offer", { variant: "error" });
    }
  };

  return (
    <Modal size="daoMedium" isOpen={open} onClose={onClose} showCloseIcon>
      <div className={classes.content}>
        <div className={classes.typo1}>Cancel Selling the NFT</div>
        <div className={classes.typo2}>THis action will remove NFT as available for sale. Users will still be able to make an offer but they NFT wont be available to get through Buy Now button.</div>
        <Box width={1} display="flex" justifyContent="center" marginTop="31px">
          <PrimaryButton
            size="medium"
            isRounded
            style={{ width: 250, height: 53, background: "#54658F", marginTop: 52 }}
            onClick={() => {onClose()}}
          >
            Cancel
          </PrimaryButton>
          <PrimaryButton
            size="medium"
            isRounded
            style={{ width: 250, height: 53, background: "#F43E5F", marginTop: 52 }}
            onClick={handleConfirm}
          >
            Yes, remove
          </PrimaryButton>
        </Box>
      </div>
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
    </Modal>
  );
};

export default CancelSellingModal;
