import React from "react";

import { Box } from "@material-ui/core";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { useFractionaliseModalsStyles } from "./index.styles";

export const BuyFractionModal = ({ open, onClose }) => {
  const classes = useFractionaliseModalsStyles();

  return (
    <Modal size="small" isOpen={open} onClose={onClose} showCloseIcon={true}>
      <Box display="flex" flexDirection="column">
        <Box className={classes.title} fontWeight={800} mb={3} textAlign="center">Buy NFT Fractions</Box>
        <Box className={classes.itemTitle} mb={1}>How many of NFT Fractions do you want to buy?</Box>
        <input className={classes.input} />
        <Box fontSize={10} color="#1A1B1C" mt={1}>Available 1.05456</Box>
        <Box display="flex" alignItems="center" justifyContent="center" my={3}>
          <img src={require("assets/pixImages/fraction.png")} alt="fraction" />
          <Box className={classes.title} position="absolute" textAlign="center" fontWeight={800}>
            You will pay<br/>
            100 USDT
          </Box>
        </Box>
        <PrimaryButton size="medium" className={classes.button}>
          Buy
        </PrimaryButton>
      </Box>
    </Modal>
  );
};
