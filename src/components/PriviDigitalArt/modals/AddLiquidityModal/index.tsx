import React from "react";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { AddLiquidityModalStyles } from "./index.style";

export default function AddLiquidityModal({ open, handleClose = () => {}, onConfirm }) {
  const classes = AddLiquidityModalStyles();

  const [liquidity, setLiquidity] = React.useState<number>(0);

  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.container}>
      <Box>
        <Box fontSize="24px" color="#431AB7">
          Add Liquidity
        </Box>
        <Box fontSize="14px" fontWeight="400" mt={1}>
          Add liquidity to the JOT pool and earn on that liquidity.
        </Box>
        <InputWithLabelAndTooltip
          inputValue={liquidity}
          onInputValueChange={e => setLiquidity(e.target.value)}
          overriedClasses={classes.inputLiquidity}
          required
          type="number"
          theme="light"
          minValue={1}
          endAdornment={<div className={classes.purpleText}>JOTS</div>}
        />
        <Box display="flex" alignItems="center" justifyContent="space-between" color="#431AB7">
          <Box display="flex" alignItems="center" gridColumnGap="10px" fontSize="14px">
            <span>Wallet Balance</span>
            <Box className={classes.usdWrap} display="flex" alignItems="center">
              <Box className={classes.point}></Box>
              <Box fontWeight="700">0.00 BUSD</Box>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" fontSize="16px">
            <span>
              MAX: <b>0</b>
            </span>
            <Box paddingLeft="12px">Add All</Box>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" mt={5}>
          <SecondaryButton
            size="medium"
            style={{ color: "#151414", maxWidth: "50px", border: "2px solid #9EACF2" }}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            size="medium"
            style={{ background: "#D9F66F", color: "#431AB7", minWidth: "56%" }}
            onClick={() => onConfirm(liquidity)}
          >
            Confirm
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
}
