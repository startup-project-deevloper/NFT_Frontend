import React, { useState, useEffect } from "react";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { PrimaryButton } from "shared/ui-kit";
import { CancelOfferModalStyles } from "./index.style";

export default function CancelOfferModal({ open, handleClose = () => {}, onConfirm }) {
  const classes = CancelOfferModalStyles();
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    if(!open) {
      setStep(0)
    }
  }, [open])

  const handleCloseModal = () => {
    handleClose();
  }

  const handleApprove = () => {
    if (step !== 0) return;

    setStep(1)
  }

  const handleConfirm = () => {
    if (step !== 1) return;

    setStep(2)
    handleClose();
  }

  return (
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
              style={{ backgroundColor: step !== 0 ? "#431AB750" : "#431AB7" }}
              onClick={handleApprove}
            >
              Approve
            </PrimaryButton>
            <PrimaryButton
              size="medium"
              className={classes.primaryButton}
              style={{ backgroundColor: step !== 1 ? "#431AB750" : "#431AB7" }}
              onClick={handleConfirm}
            >
              Cancel Offer
            </PrimaryButton>
          </Box>
        </Box>
      </>
    </Modal>
  );
}
