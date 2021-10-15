import React from "react";

import { Grid } from "@material-ui/core";
import { Header3, Header5, Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { Color, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { RemoveLiquidityModalStyles } from "./index.style";

export default function RemoveLiquidityModal({ open, onClose, onConfirm }) {
  const classes = RemoveLiquidityModalStyles();

  const [liquidity, setLiquidity] = React.useState<number>(0);

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} showCloseIcon className={classes.container}>
      <Box>
        <Box fontSize="24px" color="#431AB7">
          Remove Liquidity
        </Box>
        <Header5></Header5>
        <InputWithLabelAndTooltip
          inputValue={liquidity}
          onInputValueChange={e => setLiquidity(e.target.value)}
          overriedClasses={classes.inputLiquidity}
          minValue={1}
          required
          type="number"
          theme="light"
          endAdornment={<div className={classes.purpleText}>JOTs</div>}
        />
        <Box display="flex" alignItems="center" justifyContent="space-between" color="#431AB7">
          <Box display="flex" alignItems="center" gridColumnGap="10px" fontSize="14px">
            <span>Liquidity</span>
            <Box className={classes.usdWrap} display="flex" alignItems="center">
              <Box className={classes.point}></Box>
              <Box fontWeight="700" marginLeft={1}>
                200.00 JOTs
              </Box>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" fontSize="16px">
            <Box color="rgba(67, 26, 183, 0.3)">Max</Box>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mt={6} justifyContent="space-between">
          <SecondaryButton
            size="medium"
            style={{ color: Color.Purple, width: "25%", border: `2px solid ${Color.Black}` }}
            onClick={onClose}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            size="medium"
            style={{ background: Color.GreenLight, width: "50%", color: Color.Purple }}
            onClick={onConfirm}
          >
            Confirm
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
}
