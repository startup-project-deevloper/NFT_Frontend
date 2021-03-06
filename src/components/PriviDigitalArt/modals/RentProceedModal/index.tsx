import React, { useState, useEffect } from "react";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { RentProceedModalStyles } from "./index.style";

export default function RentProceedModal({ open, offer, type, handleClose = () => {}, onConfirm }) {
  const classes = RentProceedModalStyles();

  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    if (!open) {
      setStep(0);
    }
  }, [open]);

  const handleApprove = () => {
    if (step !== 0) return;

    setStep(1);
  };

  const handleConfirm = () => {
    if (step !== 1) return;

    setStep(2);
    onConfirm();
  };

  const handleCloseModal = () => {
    handleClose();
  };

  return (
    <Modal
      size="medium"
      isOpen={open}
      onClose={handleCloseModal}
      showCloseIcon
      className={classes.container}
      style={{
        maxWidth: 508,
      }}
    >
      <Box style={{ padding: "25px" }}>
        <Box fontSize="24px" color={type === "accept" ? "#431AB7" : "#FF253F"}>
          {type === "accept" ? "Accept Rent Offer" : "Decline Offer "}
        </Box>
        <Box className={classes.description}>
          {`${type === "accept" ? "Accept" : "Decline"} the offer from user [account] to rent the [NFT Name]`}
        </Box>
        <Box className={classes.infoPanel} style={{ background: type === "accept" ? "#eceefc" : "#fcecf2" }}>
          <Box className={classes.infoRow}>
            <span className={classes.infoLabel}>Price per second</span>
            <span className={classes.infoValue}>{offer.price}</span>
          </Box>
          <Box className={classes.divider} />
          <Box className={classes.infoRow}>
            <span className={classes.infoLabel}>Rental time</span>
            <span className={classes.infoValue}>{offer.time}</span>
          </Box>
          <Box className={classes.divider} />
          <Box className={classes.infoRow}>
            <span className={classes.infoLabel}>Total cost</span>
            <span className={classes.infoValue}>{offer.estimated}</span>
          </Box>
          <Box className={classes.divider} />
          <Box className={classes.infoRow}>
            <span className={classes.infoLabel}>Etherscan link</span>
            <span className={classes.infoValue}>{offer.etherscan}</span>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="flex-end" mt={3}>
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
            {type === "accept" ? "Accept Offer" : "Decline"}
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
}
