import React, {useState, useEffect} from "react";


import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { InstantBuyModalStyles } from "./index.style";

export default function InstantBuyModal({ open, handleClose = () => {}, onConfirm }) {
  const classes = InstantBuyModalStyles();

  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    if(!open) {
      setStep(0)
    }
  }, [open])

  const handleApprove = () => {
    if (step !== 0) return;

    setStep(1)
  }

  const handleConfirm = () => {
    if (step !== 1) return;

    setStep(2)
    onConfirm()
  }

  const handleCloseModal = () => {
    handleClose();
  }

  return (
    <Modal
      size="medium"
      isOpen={open}
      onClose={handleCloseModal}
      showCloseIcon
      className={classes.container}
      style={{
        maxWidth: 508
      }}
    >
      <Box style={{padding:'25px'}}>
        <Box fontSize="24px" color="#431AB7">
          Instant Buy
        </Box>
        <Box mt="12px" mb="15px">Accept and buy NFT at Owner price.</Box>
        <Box className={classes.box}>
          <span className={classes.purpleText}>Amount to pay</span>
          <span
            className={classes.purpleText}
            style={{ fontFamily: "Agrandir GrandHeavy"}}
          >
            2455 USD
          </span>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="flex-end" mt={3}>
          <SecondaryButton
            size="medium"
            className={classes.primaryButton}
            style={{ backgroundColor: step !== 0 ? "#431AB750" : "#431AB7" }}
            onClick={handleApprove}
          >
            Approve
          </SecondaryButton>
          <PrimaryButton
            size="medium"
            className={classes.primaryButton}
            style={{ backgroundColor: step !== 1 ? "#431AB750" : "#431AB7" }}
            onClick={handleConfirm}
          >
            Confirm Offer
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
}
