import React from "react";

import { Box } from "@material-ui/core";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { useFractionaliseModalsStyles } from "./index.styles";

export const PlaceBidModal = ({ open, onClose }) => {
  const classes = useFractionaliseModalsStyles();

  return (
    <Modal size="small" isOpen={open} onClose={onClose} className={classes.modal} showCloseIcon={true}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box className={classes.title} fontWeight={800} mb={1}>Place a bid</Box>
        <Box className={classes.title} mb={3} textAlign="center">
          The offer will last 4 hours. If it is not<br />accepted, you can do Withdraw.
        </Box>
      </Box>
      <Box className={classes.itemTitle} mb={1}>Amount</Box>
      <Box className={classes.inputBox} mb={5} width={1}>
        <input placeholder="0.80 ETH" />
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        <PrimaryButton size="medium" className={classes.button}>
          Place now
        </PrimaryButton>
      </Box>
    </Modal>
  );
};
