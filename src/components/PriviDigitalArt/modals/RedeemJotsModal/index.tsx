import React from "react";
import { useWeb3React } from "@web3-react/core";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { RedeemJotsModalStyles } from "./index.style";
import {typeUnitValue} from "shared/helpers/utils";

export default function RedeemJotsModal({ open, handleClose = () => {}, onConfirm }) {
  const classes = RedeemJotsModalStyles();
  const { account, library, chainId } = useWeb3React();

  const [jot, setJot] = React.useState<number>(0);
  const [receive, setReceive] = React.useState<number>(0);
  const [jotsBalance, setJotsBalance] = React.useState<number>(0);
  const [maxJots, setMaxJots] = React.useState<number>(0);

  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.container}>
      <Box>
        <Box fontSize="24px" color="#431AB7">
          Redeem JOTs for USDT
        </Box>
        <InputWithLabelAndTooltip
          inputValue={jot}
          onInputValueChange={e => setJot(e.target.value)}
          overriedClasses={classes.inputJOT}
          required
          type="number"
          theme="light"
          minValue={1}
          endAdornment={<div className={classes.purpleText}>JOTs</div>}
        />
        <Box display="flex" alignItems="center" justifyContent="space-between" color="#431AB7">
          <Box display="flex" alignItems="center" gridColumnGap="10px" fontSize="14px">
            <span>Wallet Balance</span>
            <Box className={classes.usdWrap} display="flex" alignItems="center">
              <Box className={classes.point}></Box>
              <Box fontWeight="700">{typeUnitValue(jotsBalance, 1)} JOTs</Box>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" fontSize="16px">
            <span>
              MAX: <b>{typeUnitValue(maxJots, 1)}</b>
            </span>
          </Box>
        </Box>
        <Box className={classes.receiveContainer}>
          <span>You'll receive</span>
          <Box className={classes.usdt}>{receive} USDT</Box>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" mt={5}>
          <SecondaryButton
            size="medium"
            style={{ color: "#151414", maxWidth: "50px", border: "2px solid #9EACF2" }}
            onClick={handleClose}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            size="medium"
            style={{ background: "#D9F66F", color: "#431AB7", minWidth: "56%" }}
            onClick={() => onConfirm()}
          >
            Confirm
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
}
