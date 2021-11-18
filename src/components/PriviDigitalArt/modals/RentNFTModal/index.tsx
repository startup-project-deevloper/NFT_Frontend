import React, {useState, useEffect} from "react";


import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { RentNFTModalStyles } from "./index.style";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import {typeUnitValue} from "shared/helpers";

export default function RentNFTModal({ open, handleClose = () => {}, onConfirm }) {
  const classes = RentNFTModalStyles();

  const [step, setStep] = useState<number>(0);
  const [rentalTime, setRentalTime] = React.useState<number>(0);
  const [usdtBalance, setUsdtBalance] = React.useState<number>(0);

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
          Rent NFT
        </Box>
        <Box mt="12px" mb="15px">Accept the Owner price and rent the NFT.</Box>
        <Box className={classes.nameField}>Rental Time</Box>
        <InputWithLabelAndTooltip
          inputValue={rentalTime}
          onInputValueChange={e => setRentalTime(e.target.value)}
          overriedClasses={classes.inputDays}
          required
          type="number"
          theme="light"
          minValue={0}
          endAdornment={<div className={classes.purpleText}>DAYS</div>}
        />
        <Box className={classes.box}>
          <Box display="flex" flexDirection="column">
            <span className={classes.purpleText}>Amount to pay</span>
            <span
              className={classes.purpleText}
              style={{ fontFamily: "Agrandir GrandHeavy"}}
            >
              2455 USD
            </span>
          </Box>

          <Box display="flex" flexDirection="column">
            <span className={classes.purpleText}>Max rental time</span>
            <span
              className={classes.purpleText}
              style={{ fontFamily: "Agrandir GrandHeavy"}}
            >
              20 days
            </span>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gridColumnGap="10px" fontSize="14px" color="#431AB7" my={2} ml={2}>
          <span>Wallet Balance</span>
          <Box fontWeight="700">{typeUnitValue(usdtBalance, 1)} USDT</Box>
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
            Confirm Offer
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
}
