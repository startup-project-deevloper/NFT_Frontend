import React from "react";

import { Box } from "@material-ui/core";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { useFractionaliseModalsStyles } from "./index.styles";

export const WithDrawBidModal = ({ open, onClose }) => {
  const classes = useFractionaliseModalsStyles();

  const [increase, setIncrease] = React.useState<boolean>(false);

  return (
    <Modal size="small" isOpen={open} onClose={onClose} className={classes.modal} showCloseIcon={true}>
      <Box display="flex" flexDirection="column" alignItems="center">
        {!increase ? (
          <>
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
              😢
            </Box>
            <Box className={classes.title} mb={4} textAlign="center">
              We are sorry, your bid expired. Withdraw<br />your funds or place a higher bid!
            </Box>
            <Box display="flex">
              <PrimaryButton size="medium" className={classes.button}>
                Withdraw
              </PrimaryButton>
              <PrimaryButton size="medium" className={classes.button} onClick={() => setIncrease(true)}>
                Increase Bid
              </PrimaryButton>
            </Box>
          </>
        ) : (
          <>
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
              mb={2}
            >
              🤗
            </Box>
            <Box className={classes.title} mb={2} textAlign="center">
              New Bid Amount
            </Box>
            <Box width={1} className={classes.inputBox} ml={2}>
              <input />
              <Box fontSize={12} color="#431AB7">USE MAX</Box>
            </Box>
            <Box display="flex" justifyContent="flex-end" mt={1} mb={4} width={1}>
              <Box fontSize={10} color="#1A1B1C">Available 1.05456</Box>
            </Box>
            <PrimaryButton size="medium" className={classes.button}>
              Place a Bid
            </PrimaryButton>
          </>
        )}
      </Box>
    </Modal>
  );
};
