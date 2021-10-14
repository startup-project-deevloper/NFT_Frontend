import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import { switchNetwork } from "shared/functions/metamask";

import { Grid, makeStyles } from "@material-ui/core";
import { Modal, PrimaryButton } from "shared/ui-kit";

import Box from "shared/ui-kit/Box";
import { useAlertMessage } from "shared/hooks/useAlertMessage";

import { BlockchainNets } from "shared/constants/constants";
import { endSyntheticNFTAuction, getSyntheticNFT } from "shared/services/API/SyntheticFractionalizeAPI";
import TransactionResultModal from "components/PriviDigitalArt/modals/TransactionResultModal";
import CollectionNFTCard from "components/PriviDigitalArt/components/Cards/CollectionNFTCard";
import TransactionProgressModal from "shared/ui-kit/Modal/Modals/TransactionProgressModal";

const useStyles = makeStyles(theme => ({
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

const SyntheticAuctionClaimModal = ({ open, onClose, data }) => {
  const classes = useStyles();

  const { showAlertMessage } = useAlertMessage();
  const { account, library, chainId } = useWeb3React();

  const [hash, setHash] = useState<string>("");
  const [network, setNetwork] = useState<string>("");
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);

  const [openTransactionModal, setOpenTransactionModal] = useState<boolean>(false);

  const [nft, setNft] = React.useState<any>();
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    if (!open) return;

    (async () => {
      setLoading(true);
      const response = await getSyntheticNFT(data.collectionId, data.syntheticId);
      if (response?.success) {
        setNft(response.data);
        setLoading(false);
      }
    })();
  }, [open]);

  const handleOpenTransactionModal = () => {
    setOpenTransactionModal(true);
    setTransactionInProgress(true);
    setNetwork("polygon");
  };

  const handleCloseTransactionModal = () => {
    setOpenTransactionModal(false);
    onClose();
  };

  const handleClaim = async () => {
    if (!nft) return;

    handleOpenTransactionModal();
    try {
      const targetChain = BlockchainNets[1];

      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0);
        if (!isHere) {
          showAlertMessage(`Got failed while switching over to polygon network`, { variant: "error" });
          return;
        }
      }

      const web3APIHandler = targetChain.apiHandler;
      const web3 = new Web3(library.provider);

      const contractResponse = await web3APIHandler.SyntheticNFTAuction.endAuction(
        web3,
        account!,
        nft.auctionData.auctionAddress,
        {
          setHash: setHash,
        }
      );

      if (contractResponse.success) {
        setHash(contractResponse.data.hash);
        setTransactionInProgress(false);
        setTransactionSuccess(true);

        await endSyntheticNFTAuction({
          collectionId: data.collectionId,
          syntheticId: data.syntheticId,
        });
        showAlertMessage("Successfully claimed the nft.", { variant: "success" });
      } else {
        setTransactionInProgress(false);
        setTransactionSuccess(false);
        showAlertMessage("Failed to claim the nft", { variant: "error" });
      }
    } catch (e) {
      console.log(e);
      showAlertMessage(`Failed to claim the nft`, { variant: "error" });
    }
  };

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} className={classes.modal} showCloseIcon={true}>
      <Grid container spacing={2} direction="column" alignItems="center">
        <Grid item>{nft && <CollectionNFTCard item={nft} handleSelect={() => {}} />}</Grid>
        <Grid item>
          Congrats, your buying offer was accepted. You can claim your Synthetic NFT now, manage it, sell or
          withdraw the real NFT.
        </Grid>
        <Grid item>
          <Box display="flex" justifyContent="center">
            <PrimaryButton className={classes.placeBtn} onClick={handleClaim} size="medium">
              Claim
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

export default SyntheticAuctionClaimModal;
