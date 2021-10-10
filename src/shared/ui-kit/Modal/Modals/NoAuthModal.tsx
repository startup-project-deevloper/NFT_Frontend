import { Box } from "@material-ui/core";
import React, { FC } from "react";
import { Modal } from "../Modal";
import { noAuthModalStyles } from "./NoAuthModal.styles";

interface IProps {
  open: boolean;
  onClose: () => void;
}

export const NoAuthModal: FC<IProps> = props => {
  const classes = noAuthModalStyles();

  const { open, onClose } = props;

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <Modal isOpen={open} onClose={handleClose} showCloseIcon size="small" className={classes.container}>
      <Box display="flex" flexDirection="column" alignItems="center" pt={4} pb={4}>
        <div className={classes.cryIcon}>
          😢
        </div>
        <h1 className={classes.title}>We are sorry</h1>
        <span className={classes.description}>
          You have not been selected to early test Privi Exchange. But we have good news. Privi Exchange will
          be live on Mainnet for everyone really shortly!
        </span>
      </Box>
    </Modal>
  );
};
