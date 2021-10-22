import React from "react";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { HowItWorksModalStyles } from "./index.styles";

export default function HowItWorksModal({ open, handleClose = () => {} }) {
  const classes = HowItWorksModalStyles();

  return (
    <Modal size="small" isOpen={open} onClose={handleClose} showCloseIcon className={classes.root}>
      <img src={require("assets/musicDAOImages/howitworks.png")} />
      <Box className={classes.title}>How it works?</Box>
      <Box display="flex" textAlign="start" mt={2}>
        <Box className={classes.orderBox}>1</Box>
        <Box ml={1} flex={1} mt={1}>
          <Box className={classes.header1}>Deposit your NFT</Box>
          <Box className={classes.header2}>Deposit your NFT as collateral to get a loan.</Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" my={2}>
        <Box className={classes.lineBox} />
      </Box>
      <Box display="flex" textAlign="start">
        <Box className={classes.orderBox}>2</Box>
        <Box ml={1} flex={1} mt={1}>
          <Box className={classes.header1}>NFT will be set for auction</Box>
          <Box className={classes.header2}>Users can bid for your NFT, the higher bid the more funds!</Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" my={2}>
        <Box className={classes.lineBox} />
      </Box>
      <Box display="flex" textAlign="start">
        <Box className={classes.orderBox}>3</Box>
        <Box ml={1} flex={1} mt={1}>
          <Box className={classes.header1}>Recover NFT</Box>
          <Box className={classes.header2}>
            Once the term has ended, you can recover your NFT by returning the loan and the interest
          </Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" my={2}>
        <Box className={classes.lineBox} />
      </Box>
      <Box display="flex" textAlign="start">
        <Box className={classes.orderBox}>4</Box>
        <Box ml={1} flex={1} mt={1}>
          <Box className={classes.header1}>Manage portfolio</Box>
          <Box className={classes.header2}>
            Manage your portfolio, track your margin and keep positive margin to avoid being liquidated on
            unfavourable price movements.
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
