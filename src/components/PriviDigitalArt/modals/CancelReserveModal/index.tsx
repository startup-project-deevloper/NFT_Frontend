import React, { useState, useEffect } from "react";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { CancelReserveModalStyles } from "./index.style";

export default function CancelReserveModal({ open, handleClose = () => {}, onConfirm }) {
  const classes = CancelReserveModalStyles();
  const [isCancelled, setCancelled] = useState(false);

  const handleConfirm = () => {
    setCancelled(true);
  };

  const handleCloseModal = () => {
    handleClose();
  };

  useEffect(() => {
    if (!open) {
      setCancelled(false);
    }
  }, [open]);

  return (
    <Modal size="medium" isOpen={open} onClose={handleCloseModal} showCloseIcon className={classes.container}>
      {!isCancelled ? (
        <>
          <Box>
            <Box fontSize="24px" color="#431AB7" marginTop="50px">
              Cancel Reserve
            </Box>
            <Box className={classes.nameField}>
              Repay your collaterall to be able to recoverand withdraw your NFT
            </Box>
            <Box className={classes.nameField} style={{ color: "#FF6363" }}>
              By recovering your NFT before end of the auction you’ll have to pay penalty fee of 2%
            </Box>
            <Box className={classes.availableCollateral} display="flex">
              <Box>
                <Box className={classes.collateralText} style={{ marginRight: "40px" }}>
                  Collaterall to Repay
                </Box>
                <Box className={classes.collateralAmount} style={{ marginRight: "40px" }}>
                  2455 USD
                </Box>
              </Box>
              <Box>
                <Box className={classes.collateralText}>Penalty Fee</Box>
                <Box className={classes.collateralAmount}>25 USDT</Box>
              </Box>
            </Box>
          </Box>
          <Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
              <SecondaryButton size="medium" className={classes.cancelButton} onClick={handleCloseModal}>
                Cancel
              </SecondaryButton>
              <PrimaryButton size="medium" className={classes.confirmButton} onClick={handleConfirm}>
                Repay & recover
              </PrimaryButton>
            </Box>
          </Box>
        </>
      ) : (
        <Box className={classes.cancelledPanel}>
          <Box className={classes.removeIcon}>
            <Box className={classes.removeIconBox}>
              <img src={require("assets/icons/remove.svg")} alt="cancel" />
            </Box>
          </Box>
          <span className={classes.cancelTitle}>Reserved Cancelled</span>
          <span className={classes.cancelDesc}>NFT Reserve was succesfully canceled. </span>
          <PrimaryButton size="medium" className={classes.confirmButton} onClick={handleCloseModal}>
            Done
          </PrimaryButton>
        </Box>
      )}
    </Modal>
  );
}
