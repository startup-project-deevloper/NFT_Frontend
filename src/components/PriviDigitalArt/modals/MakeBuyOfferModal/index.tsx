import React, {useState, useEffect} from "react";
import DateFnsUtils from "@date-io/date-fns";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { MakeBuyOfferModalStyles } from "./index.style";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { BlockchainNets } from "shared/constants/constants";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { Grid } from "@material-ui/core";

export default function MakeBuyOfferModal({ open, handleClose = () => {}, onConfirm }) {
  const classes = MakeBuyOfferModalStyles();

  const [collateral, setCollateral] = React.useState<number>(0);
  const [step, setStep] = useState<number>(0);


  const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");
  const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[0]);
  const [tokenList, setTokenList] = useState<string[]>(Object.keys(selectedChain.config.TOKEN_ADDRESSES));
  const [reservePriceToken, setReservePriceToken] = useState<string>("ETH");
  const [date, setDate] = useState<any>();

  useEffect(() => {
    setTokenList(Object.keys(selectedChain.config.TOKEN_ADDRESSES));
    setReservePriceToken(Object.keys(selectedChain.config.TOKEN_ADDRESSES)[0]);
  }, [selectedChain]);

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
          Make Buy Offer
        </Box>
        <Box className={classes.nameField}>
        </Box>
        <Box className={classes.nameField}>
          Suggested price
        </Box>
        <Grid container spacing={2}>
          <Grid item sm={7}>
            <InputWithLabelAndTooltip
              inputValue={collateral}
              onInputValueChange={e => setCollateral(e.target.value)}
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
              value={reservePriceToken}
              onChange={e => {
                setReservePriceToken(e.target.value as string);
              }}
              className={classes.inputJOT}
            />
          </Grid>
        </Grid>
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
