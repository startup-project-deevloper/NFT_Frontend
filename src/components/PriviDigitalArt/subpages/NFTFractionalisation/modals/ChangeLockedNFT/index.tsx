import React from "react";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { ChangeLockedNFTStyles } from "./index.styles";

export default ({ open, onProceed, onClose }) => {
  const classes = ChangeLockedNFTStyles();

  return (
    <Modal size="small" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <Box display="flex" flexDirection="column" alignItems="center" p="86px 38px 13px">
        <img className={classes.icon} src={require("assets/icons/lock-nft-icon.png")} alt="" />
        <h1 className={classes.title}>Lock NFT on Ethereum</h1>
        <p className={classes.description}>
          Your NFT will be locked in a Vault on Ethereum smart contract. <br />
          Please keep in mind this process can take x time so be patient.
        </p>
        <button className={classes.proceedBtn} onClick={onProceed}>
          Proceed
        </button>
      </Box>
    </Modal>
  );
};
