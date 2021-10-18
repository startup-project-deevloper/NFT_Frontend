import React from "react";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import VerifyNFTLock from "../FractionaliseModal/components/VerifyNFTLock";
import { lockNFTModalStyles } from "./index.styles";

export const VerifyLockNFTModal = ({ open, onClose, nft, onVerifyCompleted }) => {
  const classes = lockNFTModalStyles();

  return (
    <Modal size="small" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <Box display="flex" flexDirection="column">
        <VerifyNFTLock onClose={onClose} onCompleted={onVerifyCompleted} nft={nft} />
      </Box>
    </Modal>
  );
};
