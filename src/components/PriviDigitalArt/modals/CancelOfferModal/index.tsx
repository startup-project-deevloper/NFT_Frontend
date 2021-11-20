import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import CopyToClipboard from "react-copy-to-clipboard";
import Box from "shared/ui-kit/Box";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { BlockchainNets } from "shared/constants/constants";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import TransactionResultModal, { CopyIcon } from "components/PriviDigitalArt/modals/TransactionResultModal";

import { CancelOfferModalStyles } from "./index.style";

const isProd = process.env.REACT_APP_ENV === "prod";
const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

export default function CancelOfferModal({ open, handleClose = () => {}, onConfirm, collection, offer }) {
  const classes = CancelOfferModalStyles();
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
  }

  const handleConfirm = async () => {
    if (chainId !== BlockchainNets[1].chainId && chainId !== BlockchainNets[2].chainId) {
      showAlertMessage(`network error`, { variant: "error" });
      return;
    }

    try {
      const web3APIHandler = selectedChain.apiHandler;
      const web3 = new Web3(library.provider);
      setIsLoading(true);

      const contractResponse = await web3APIHandler.ReserveMarketplace.cancelSaleReserveProposal(web3, account!, collection, {
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
      <Modal size="medium" isOpen={open} onClose={handleCloseModal} showCloseIcon className={classes.container}>
        <>
          <Box display="flex" alignItems="center" flexDirection="column">
            <img src={require("assets/icons/cancel_icon.png")} width="110px" /> <br />
            <Box fontSize="24px" color="#431AB7" marginTop="20px">
              Cancel Offer
            </Box>
            <Box className={classes.nameField}>
              Canceling will remove your listing from list of <br /> Reserves and you’ll stop receiving offers. 
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" mt={6}>
              <PrimaryButton
                size="medium"
                className={classes.primaryButton}
                style={{ backgroundColor: "#431AB7" }}
                onClick={handleConfirm}
              >
                Cancel Offer
              </PrimaryButton>
            </Box>
          </Box>
        </>
      </Modal>
    </LoadingScreen>
  );
}
