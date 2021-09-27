import React from "react";
import Box from "shared/ui-kit/Box";
import { FlipCoinInputGuessModalStyles } from "./index.styles";
import { Modal } from "shared/ui-kit";

declare let window: any;

// true - flipping dialog, false - result dialog (finished flipping)
// true - won, false - lost
export default function FlipCoinInputGuessModal({ open, onClose, setResult }) {
  const classes = FlipCoinInputGuessModalStyles();

  const handleLater = () => {
    onClose();
  };

  return (
    <Modal size="small" isOpen={open} onClose={onClose} showCloseIcon className={classes.modal}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <img src={require("assets/pixImages/flip_coin_guess.PNG")} className={classes.img} />
        <h1 className={classes.title}>Guess the result</h1>
        <p className={classes.subTitle}>Pick your side of the coin</p>
        <Box display="flex" marginTop={6} justifyContent="space-evenly" width="100%">
          <button className={classes.guessZeroBtn} onClick={() => setResult(0)}>
            Result will be 0
          </button>
          <button className={classes.guessOneBtn} onClick={() => setResult(1)}>
            Result will be 1
          </button>
        </Box>
        <button className={classes.closeBtn} onClick={() => onClose()}>
          Close
        </button>
      </Box>
    </Modal>
  );
}
