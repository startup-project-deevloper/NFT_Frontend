import React from "react";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import UnLockNFT from "../WithdrawNFTModal/components/UnlockNFT";
import { unlockNFTModalStyles } from "./index.styles";

export const UnlockNFTModal = ({ open, onClose, nft, onUnLockCompleted }) => {
  const classes = unlockNFTModalStyles();

  return (
    <Modal size="small" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <Box display="flex" flexDirection="column">
        <UnLockNFT
          onClose={onClose}
          onCompleted={onUnLockCompleted}
          needLockLaterBtn={false}
          nft={nft}
        />
      </Box>
    </Modal>
  );
};
