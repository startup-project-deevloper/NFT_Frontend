import React from "react";

import { Grid } from "@material-ui/core";
import { Header3, Header5, Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { Color, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { AddLiquidityModalStyles } from "./index.style";

export default function AddLiquidityModal({ open, handleClose = () => { } }) {
  const classes = AddLiquidityModalStyles();

  const [liquidity, setLiquidity] = React.useState<number>(0);

  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon >
      <Box>
        <Header3>Add Liquidity</Header3>
        <Header5>Add liquidity to the JOT pool and earn on that liquidity.</Header5>
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
              <Header5 style={{ marginBottom: 0 }}>Wallet Balance</Header5>
              <Box className={classes.usdWrap} display="flex" alignItems="center" ml={2}>
                <Box className={classes.point}></Box>
                <Header5 style={{ fontWeight: 800, paddingLeft: "10px", marginBottom: 0 }}>
                  0.00 BUSD
                </Header5>
              </Box>
            </Box>
          </Grid>
          <Grid item md={4} xs={12}>
            <Box className={classes.rightLiquidity} flexGrow={1} display="flex" alignItems="center" justifyContent="flex-end">
              <Box>MAX: 0</Box>
              <Box color="#DDFF57" paddingX="15px">
                Add All
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box display="flex" alignItems="center" mt={2}>
          <SecondaryButton
            size="medium"
            style={{ color: Color.Purple, width: "100%", border: "2px solid #9EACF2" }}
          >
            REMOVE
          </SecondaryButton>
          <PrimaryButton size="medium" style={{ background: Color.Purple, width: "100%" }}>
            ADD MORE
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
}
