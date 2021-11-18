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
  const [limitDays, setLimitDays] = useState<number>(0);
  const [limitHour, setLimitHour] = useState<number>(0);
  const [limitMin, setLimitMin] = useState<number>(0);
  const [limitSec, setLimitSec] = useState<number>(0);

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
          Edit Rental Price
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
        <Box className={classes.nameField}>
          Max Rental Time Until
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
        <Box className={classes.nameField}>Limit rental time</Box>
        <Box display="flex" alignItems="center">
          <InputWithLabelAndTooltip
            inputValue={limitDays}
            onInputValueChange={e => setLimitDays(e.target.value)}
            overriedClasses={classes.inputJOT}
            required
            type="number"
            theme="light"
            minValue={0}
            endAdornment={<div className={classes.purpleText}>DAYS</div>}
          />
          <InputWithLabelAndTooltip
            inputValue={limitHour}
            onInputValueChange={e => setLimitHour(e.target.value)}
            overriedClasses={classes.inputJOT}
            required
            type="number"
            theme="light"
            minValue={0}
            endAdornment={<div className={classes.purpleText}>h</div>}
          />
          <InputWithLabelAndTooltip
            inputValue={limitMin}
            onInputValueChange={e => setLimitMin(e.target.value)}
            overriedClasses={classes.inputJOT}
            required
            type="number"
            theme="light"
            minValue={0}
            endAdornment={<div className={classes.purpleText}>min</div>}
          />
          <InputWithLabelAndTooltip
            inputValue={limitSec}
            onInputValueChange={e => setLimitSec(e.target.value)}
            overriedClasses={classes.inputJOT}
            required
            type="number"
            theme="light"
            minValue={0}
            endAdornment={<div className={classes.purpleText}>sec</div>}
          />
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
          <SecondaryButton
            size="medium"
            className={classes.secondaryButton}
            onClick={handleCloseModal}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            size="medium"
            className={classes.primaryButton}
            onClick={handleConfirm}
          >
            Confirm Edits
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
}
