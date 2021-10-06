import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { Color, Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";

const disconnectModalStyles = makeStyles(theme => ({
  root: {
    width: "565px !important",
    fontSize: "14px",
    lineHeight: "104.5%",
    height: '250px',
    display:'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    "& h3": {
      fontSize: "22px",
      fontWeight: 800,
      lineHeight: "140%",
      margin: 0,
      color: Color.Black,
    },    
},
}));

export default function DisconnectWalletModal({ open, onClose, handleDisconnect }) {
  const classes = disconnectModalStyles();

  return (
    <Modal isOpen={open} onClose={onClose} showCloseIcon size="medium" className={classes.root}>
      <h3>
      Are you sure to remove wallect connection from your account?
      </h3>
      <Box display='flex' alignItems='center' justifyContent='space-between'>
          <SecondaryButton onClick={onClose} size='medium'>
              No
          </SecondaryButton>
          <PrimaryButton onClick={handleDisconnect} size='medium'>
              Yes
          </PrimaryButton>
      </Box>      
    </Modal>
  );
}
