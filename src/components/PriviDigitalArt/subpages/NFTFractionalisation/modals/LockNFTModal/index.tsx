import React from "react";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import LockNFT from "../FractionaliseModal/components/LockNFT";
import { lockNFTModalStyles } from "./index.styles";

export const LockNFTModal = ({ open, onClose, nft, onLockCompleted }) => {
  const classes = lockNFTModalStyles();

  return (
    <Modal size="small" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <Box display="flex" flexDirection="column">
        <LockNFT
          onClose={onClose}
          onCompleted={onLockCompleted}
          needLockLaterBtn={false}
          selectedNFT={nft}
          syntheticID={nft.SyntheticID}
        />
      </Box>
    </Modal>
  );
};
