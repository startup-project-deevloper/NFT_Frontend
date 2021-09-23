import React from "react";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import LockNFT from "../FractionaliseModal/components/LockNFT";
import { lockNFTModalStyles } from "./index.styles";

export const LockNFTModal = ({ open, onClose }) => {
  const classes = lockNFTModalStyles();

  return (
    <Modal size="small" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <Box display="flex" flexDirection="column">
        <LockNFT
          onClose={onClose}
          onCompleted={() => {}}
          needLockLaterBtn={false}
          selectedNFT={{}}
          syntheticID=""
        />
      </Box>
    </Modal>
  );
};
