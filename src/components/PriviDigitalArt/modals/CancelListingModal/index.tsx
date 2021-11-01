import React, {useState, useEffect} from "react";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { PrimaryButton } from "shared/ui-kit";
import { CancelListingModalStyles } from "./index.style";

export default function CancelListingModal({ open, handleClose = () => {}, onConfirm }) {
  const classes = CancelListingModalStyles();

  const handleConfirm = () => {
    handleClose();
  }

  const handleCloseModal = () => {
    handleClose();
  }

  return (
    <Modal size="medium" isOpen={open} onClose={handleCloseModal} showCloseIcon className={classes.container}>
      <>
        <Box display="flex" alignItems="center" flexDirection="column">
          <Box fontSize="24px" color="#431AB7" marginTop="84px">
            Cancel listing
          </Box>
          <Box className={classes.nameField}>
            If none of the offers were accepted your are free to cancel your listing and remve NFT Future 
          </Box>
          <PrimaryButton
            size="medium"
            style={{ background: "#431AB7", color: "#ffffff", minWidth: "56%", marginTop:'50px'}}
            onClick={handleConfirm}
          >
            confirm cancelation
          </PrimaryButton>
        </Box>
      </>
    </Modal>
  );
}
