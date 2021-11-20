import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import CopyToClipboard from "react-copy-to-clipboard";

import { Modal } from "shared/ui-kit";
import { BlockchainNets } from "shared/constants/constants";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import TransactionResultModal, { CopyIcon } from "components/PriviDigitalArt/modals/TransactionResultModal";
import Box from "shared/ui-kit/Box";
import { PrimaryButton } from "shared/ui-kit";
import { BlockProceedModalStyles } from "./index.style";

const isProd = process.env.REACT_APP_ENV === "prod";
const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

export default function BlockProceedModal({ open, offer, type, handleClose = () => {}, onConfirm }) {
  const classes = BlockProceedModalStyles();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [selectedChain, setSelectedChain] = React.useState<any>(filteredBlockchainNets[0]);
  const [result, setResult] = useState<number>(0);

  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();
  
  useEffect(() => {
    if (!open) return;

    if (selectedChain && chainId && selectedChain.chainId !== chainId) {
      setSelectedChain(filteredBlockchainNets.find(b => b.chainId === chainId));
    }
  }, [chainId, selectedChain, open]);

  const handleCloseModal = () => {
    handleClose();
  };

  const handleConfirm = async () => {
    if (chainId !== BlockchainNets[1].chainId && chainId !== BlockchainNets[2].chainId) {
      showAlertMessage(`network error`, { variant: "error" });
      return;
    }

    try {
      const web3APIHandler = selectedChain.apiHandler;
      const web3 = new Web3(library.provider);
      setIsLoading(true);

      const contractResponse = await web3APIHandler.ReserveMarketplace.cancelSaleReserveProposal(web3, account!, {
        ...offer,
        setHash,
      });
      
      if (!contractResponse.success) {
        setIsLoading(false);
        setResult(-1);
        showAlertMessage("Failed to add Jots. Please try again", { variant: "error" });
        return;
      }

      setResult(1);
      setIsLoading(false);
      showAlertMessage("You added JOTs successuflly", { variant: "success" });
      onConfirm();
    } catch (err) {
      setIsLoading(false);
      setResult(-1);
      showAlertMessage("You added JOTs successuflly", { variant: "success" });
    }
  }

  const handleCheck = () => {
    if (selectedChain.name === 'POLYGON') {
      window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${hash}`, "_blank");
    } else if (selectedChain.name === 'POLYGON') {
      window.open(`https://${!isProd ? "rinkeby." : ""}etherscan.io/tx/${hash}`, "_blank");
    }
  };

  if (result !== 0) {
    return (
      <TransactionResultModal open={true} onClose={() => setResult(0)} isSuccess={result === 1} hash={hash} />
    );
  }

  return (
    <LoadingScreen
      loading={isLoading}
      title={`Transaction \nin progress`}
      SubTitleRender={() => (
        <>
          <span>Transaction is proceeding on {selectedChain.value}.</span>
          <br />
          <span>This can take a moment, please be patient...</span>
          {hash && (
            <CopyToClipboard text={hash}>
              <Box
                mt="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                className={classes.hash}
              >
                Hash:
                <Box color="#4218B5" mr={1} ml={1}>
                  {hash.substr(0, 18) + "..." + hash.substr(hash.length - 3, 3)}
                </Box>
                <CopyIcon />
              </Box>
            </CopyToClipboard>
          )}

          {hash && (
            <button className={classes.buttonCheck} onClick={handleCheck}>
              Check on {selectedChain.value.replace(' Chain', '')} Scan
            </button>
          )}
        </>
      )}
      handleClose={handleClose}
    >
      <Modal
        size="medium"
        isOpen={open}
        onClose={handleCloseModal}
        showCloseIcon
        className={classes.container}
        style={{
          maxWidth: 508,
        }}
      >
        <Box style={{ padding: "25px" }}>
          <Box fontSize="24px" color={type === "accept" ? "#431AB7" : "#FF253F"}>
            {type === "accept" ? "Accept Block Offer" : "Decline Offer "}
          </Box>
          <Box className={classes.description}>
            {`${
              type === "accept" ? "Accept" : "Decline"
            } the offer from user [account] to block the [NFT Name]`}
          </Box>
          <Box className={classes.infoPanel} style={{ background: type === "accept" ? "#eceefc" : "#fcecf2" }}>
            <Box className={classes.infoRow}>
              <span className={classes.infoLabel}>Price</span>
              <span className={classes.infoValue}>{offer.price}</span>
            </Box>
            <Box className={classes.divider} />
            <Box className={classes.infoRow}>
              <span className={classes.infoLabel}>Period</span>
              <span className={classes.infoValue}>{offer.period}</span>
            </Box>
            <Box className={classes.divider} />
            <Box className={classes.infoRow}>
              <span className={classes.infoLabel}>Collateral %</span>
              <span className={classes.infoValue}>{offer.collateral}</span>
            </Box>
            <Box className={classes.divider} />
            <Box className={classes.infoRow}>
              <span className={classes.infoLabel}>Expiration</span>
              <span className={classes.infoValue}>{offer.expiration}</span>
            </Box>
            <Box className={classes.divider} />
            <Box className={classes.infoRow}>
              <span className={classes.infoLabel}>Etherscan link</span>
              <span className={classes.infoValue}>{offer.etherscan}</span>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="flex-end" mt={3}>
            <PrimaryButton
              size="medium"
              className={classes.primaryButton}
              style={{ backgroundColor: "#431AB7" }}
              onClick={handleConfirm}
            >
              {type === "accept" ? "Accept Offer" : "Decline"}
            </PrimaryButton>
          </Box>
        </Box>
      </Modal>
    </LoadingScreen>
  );
}
