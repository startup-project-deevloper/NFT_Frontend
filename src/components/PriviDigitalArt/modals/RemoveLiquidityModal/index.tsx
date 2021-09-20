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
    <Modal size="medium" isOpen={open} onClose={onClose} showCloseIcon>
      <Box>
        <Header3>Remove Liquidity</Header3>
        <Header5></Header5>
        <InputWithLabelAndTooltip
          inputValue={liquidity}
          onInputValueChange={e => setLiquidity(e.target.value)}
          overriedClasses={classes.inputLiquidity}
          required
          type="number"
          theme="light"
          endAdornment={<div className={classes.purpleText}>JOTS</div>}
        />
        <Grid container>
          <Grid item md={8} xs={12}>
            <Box className={classes.leftBalance} display="flex" alignItems="center">
              <Header5 style={{ marginBottom: 0 }}>Liquidity</Header5>
              <Box className={classes.usdWrap} display="flex" alignItems="center" ml={2}>
                <Box className={classes.point}></Box>
                <Header5 style={{ fontWeight: 800, paddingLeft: "10px", marginBottom: 0 }}>
                  200.00 JOTS
                </Header5>
              </Box>
            </Box>
          </Grid>
          <Grid item md={4} xs={12}>
            <Box
              className={classes.rightLiquidity}
              flexGrow={1}
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Box color="rgba(67, 26, 183, 0.3)" paddingX="15px">
                Max
              </Box>
            </Box>
          </Grid>
        </Grid>
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
