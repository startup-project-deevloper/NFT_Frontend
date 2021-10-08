import React from "react";

import { Box } from "@material-ui/core";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { useFractionaliseModalsStyles } from "./index.styles";

export const AcceptBidModal = ({ open, onClose }) => {
  const classes = useFractionaliseModalsStyles();

  return (
    <Modal size="small" isOpen={open} onClose={onClose} className={classes.modal} showCloseIcon={true}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="#9EACF2"
          boxShadow="0px 4px 8px #9EACF2"
          borderRadius="100%"
          width={72}
          height={72}
          fontSize={40}
          mb={4}
        >
          🤑
        </Box>
        <Box className={classes.title} mb={1} textAlign="center">
          Your real and sythetic NFT will get<br />transferred to the bidder and you will<br />receive
        </Box>
        <Box className={classes.description} mb={4} textAlign="center">
          1.023849 ETH
        </Box>
        <PrimaryButton size="medium" className={classes.button}>
          Accept Bid
        </PrimaryButton>
      </Box>
    </Modal>
  );
};
