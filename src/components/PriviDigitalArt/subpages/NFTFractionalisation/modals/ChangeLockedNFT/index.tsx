import React from "react";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { ChangeLockedNFTStyles } from "./index.styles";

export default ({ open, onProceed, onClose }) => {
  const classes = ChangeLockedNFTStyles();

  return (
    <Modal size="small" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <Box className={classes.container}>
        <img className={classes.icon} src={require("assets/icons/nft_synthetic.png")} alt="" />
        <h1 className={classes.title}>Change NFT to Synthetic</h1>
        <p className={classes.description}>
          You can change your NFT to another NFT from the same collection
        </p>
        <button className={classes.proceedBtn} onClick={onProceed}>
          Proceed
        </button>
      </Box>
    </Modal>
  );
};
