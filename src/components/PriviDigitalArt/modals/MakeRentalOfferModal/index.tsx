import React, { useState, useEffect } from "react";
import DateFnsUtils from "@date-io/date-fns";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { MakeRentalOfferModalStyles } from "./index.style";
import { Grid } from "@material-ui/core";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { BlockchainNets } from "shared/constants/constants";

export default function MakeRentalOfferModal({ open, handleClose = () => {}, onConfirm }) {
  const classes = MakeRentalOfferModalStyles();
  // let data = ['1'];
  const [pricePerSec, setPricePerSec] = React.useState<number>(0);
  const [pricePerSecToken, setPricePerSecToken] = useState<string>("ETH");
  const [step, setStep] = useState<number>(0);
  const [date, setDate] = useState<any>();

  const [rentalTime, setRentalTime] = React.useState<number>(0);

  const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");
  const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[0]);
  const [tokenList, setTokenList] = useState<string[]>(Object.keys(selectedChain.config.TOKEN_ADDRESSES));
  const [reservePriceToken, setReservePriceToken] = useState<string>("ETH");

  useEffect(() => {
    setTokenList(Object.keys(selectedChain.config.TOKEN_ADDRESSES));
    setReservePriceToken(Object.keys(selectedChain.config.TOKEN_ADDRESSES)[0]);
  }, [selectedChain]);

  const handleApprove = () => {
    if (step !== 0) return;

    setStep(1);
  };

  const handleConfirm = async () => {
    if (step !== 1) return;

    setStep(2);
    onConfirm();
  };
  const handleCloseModal = () => {
    handleClose();
  };

  return (
    <Modal size="medium" isOpen={open} onClose={handleCloseModal} showCloseIcon className={classes.container}>
      <Box style={{ padding: "25px" }}>
        <Box fontSize="24px" color="#431AB7">
          Make Rental Offer
        </Box>
        <Grid container spacing={2}>
          <Grid item sm={7}>
            <Box className={classes.nameField}>Price per second</Box>
          </Grid>
          <Grid item sm={5}>
            <Box className={classes.nameField}>Rental Token</Box>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item sm={7}>
            <InputWithLabelAndTooltip
              inputValue={pricePerSec}
              onInputValueChange={e => setPricePerSec(e.target.value)}
              overriedClasses={classes.inputJOT}
              required
              type="number"
              theme="light"
              minValue={0}
            />
          </Grid>
          <Grid item sm={5}>
            <TokenSelect
              tokens={tokenList}
              value={pricePerSecToken}
              onChange={e => {
                setPricePerSecToken(e.target.value as string);
              }}
              className={classes.inputJOT}
            />
          </Grid>
        </Grid>
        <Box className={classes.nameField}>Rental Time</Box>
        <InputWithLabelAndTooltip
          inputValue={rentalTime}
          onInputValueChange={e => setRentalTime(e.target.value)}
          overriedClasses={classes.inputJOT}
          required
          type="number"
          theme="light"
          minValue={0}
          endAdornment={<div className={classes.purpleText}>DAYS</div>}
        />
        <Box className={classes.nameField}>
          Offer will disapppear if not accepted before
        </Box>
        <Box width="100%">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="dense"
              id="date-picker-inline"
              value={date}
              onChange={() => {}}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              size="small"
              inputVariant="outlined"
              className={classes.datePicker}
            />
          </MuiPickersUtilsProvider>
        </Box>
      </Box>
      <Box className={classes.footer}>
        <Box display="flex" justifyContent="space-between">
          <Box className={classes.totalText}>Total</Box>
          <Box style={{ color: "#431AB7", fontSize: "14px", fontFamily: "Montserrat", fontWeight: 500 }}>
            22 225 USDT
          </Box>
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
