import React, { useState } from "react";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { ChangeToSyntheticStyles } from "./index.styles";

export default ({ open, onClose, selectedNFT }) => {
  const classes = ChangeToSyntheticStyles();
  const [isProceeding, setIsProceeding] = useState<boolean>(false);

  const handleProceed = () => {
    setIsProceeding(true);
  };

  return (
    <Modal size="small" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <Box display="flex" flexDirection="column" alignItems="center">
        {isProceeding ? (
          <>
            <img className={classes.icon} src={require("assets/icons/exchange_polygon.png")} alt="" />
            <h1 className={classes.title}>Exchanging your NFT </h1>
            <p className={classes.description}>
              Request to exchange your NFT was sent to Polygon chain. Please be patiet as this process could
              take a while. You’ll receive a notification when it’s finished.
            </p>
            <button className={classes.proceedBtn} onClick={onClose}>
              Close
            </button>
          </>
        ) : (
          <>
            <img className={classes.icon} src={require("assets/icons/lock-nft-icon.png")} alt="" />
            <h1 className={classes.title}>Lock NFT on Ethereum</h1>
            <p className={classes.description}>
              Your NFT will be locked in a Vault on Ethereum smart contract. Please keep in mind this process
              can take x time so be patient.
            </p>
            <button className={classes.proceedBtn} onClick={handleProceed}>
              Proceed
            </button>
          </>
        )}
      </Box>
    </Modal>
  );
};
