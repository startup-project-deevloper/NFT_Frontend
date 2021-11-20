import React, { useState, useEffect } from "react";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { ClaimPaymentModalStyles } from "./index.style";

export default function ClaimPaymentModal({ open, offer, handleClose = () => {}, onConfirm }) {
  const classes = ClaimPaymentModalStyles();

  const handleApprove = () => {};

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
        <Box fontSize="24px" color="#431AB7">
          Claim Payment
        </Box>
        <Box className={classes.description}>
          Repay your collaterall to be able to recoverand withdraw your NFT
        </Box>
        <Box className={classes.infoPanel}>
          <span className={classes.infoLabel}>Payment</span>
          <span className={classes.infoValue}>{offer.price} USDT</span>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="flex-end" mt={3}>
          <PrimaryButton size="medium" className={classes.primaryButton} onClick={handleApprove}>
            CLAIM
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
}
