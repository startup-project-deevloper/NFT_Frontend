import React, { useState, useEffect } from "react";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { MakeRentalOfferModalStyles } from "./index.style";
import { Grid } from "@material-ui/core";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { BlockchainNets } from "shared/constants/constants";

export default function MakeRentalOfferModal({ open, handleClose = () => {}, onConfirm }) {
  const classes = MakeRentalOfferModalStyles();
  // let data = ['1'];
  const [blockingPrice, setBlockingPrice] = React.useState<number>(0);
  const [token, setToken] = useState<string>("ETH");
  const [period, setPeriod] = React.useState<number>(0);
  const [collateral, setCollateral] = useState(0);

  const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");
  const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[0]);
  const [tokenList, setTokenList] = useState<string[]>(Object.keys(selectedChain.config.TOKEN_ADDRESSES));
  const [reservePriceToken, setReservePriceToken] = useState<string>("ETH");

  useEffect(() => {
    setTokenList(Object.keys(selectedChain.config.TOKEN_ADDRESSES));
    setReservePriceToken(Object.keys(selectedChain.config.TOKEN_ADDRESSES)[0]);
  }, [selectedChain]);

  const handleConfirm = () => {
    onConfirm();
  };
  const handleCloseModal = () => {
    handleClose();
  };

  return (
    <Modal size="medium" isOpen={open} onClose={handleCloseModal} showCloseIcon className={classes.container}>
      <Box style={{ padding: "25px" }}>
        <Box fontSize="24px" color="#431AB7">
          Edit Blocking Price
        </Box>
        <Grid container spacing={2}>
          <Grid item sm={7}>
            <Box className={classes.nameField}>Blocking Price</Box>
          </Grid>
          <Grid item sm={5}>
            <Box className={classes.nameField}>Token</Box>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item sm={7}>
            <InputWithLabelAndTooltip
              inputValue={blockingPrice}
              onInputValueChange={e => setBlockingPrice(e.target.value)}
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
              value={token}
              onChange={e => {
                setToken(e.target.value as string);
              }}
              className={classes.inputJOT}
            />
          </Grid>
        </Grid>
        <Box className={classes.nameField}>Blocking Period</Box>
        <InputWithLabelAndTooltip
          inputValue={period}
          onInputValueChange={e => setPeriod(e.target.value)}
          overriedClasses={classes.inputJOT}
          required
          type="number"
          theme="light"
          minValue={0}
          endAdornment={<div className={classes.purpleText}>DAYS</div>}
        />
        <Box className={classes.nameField}>Collateral Required</Box>
        <InputWithLabelAndTooltip
          inputValue={collateral}
          onInputValueChange={e => setCollateral(e.target.value)}
          overriedClasses={classes.inputJOT}
          required
          type="number"
          theme="light"
          minValue={0}
        />
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
