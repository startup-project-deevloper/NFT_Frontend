import React, { useState, useRef } from "react";
import { Box, Grid } from "@material-ui/core";
import { PrimaryButton, Modal, SecondaryButton, Color } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { EditJOTsSupplyModalStyles } from "./index.styles";
import { Dropdown } from "shared/ui-kit/Select/Select";

export default function EditJOTsModal({ open, onClose }) {
  const classes = EditJOTsSupplyModalStyles();
  const maxRef = useRef<string>("1000");
  const [nftSupply, setNFTSupply] = useState<string>("");

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <div className={classes.title}>Edit JOTs Supply</div>
      <div className={classes.subtitle}>Set a new supply of JOTs for your NFT</div>

      <Grid container spacing={1}>
        <Grid item xs={12} md={7}>
          <InputWithLabelAndTooltip
            inputValue={nftSupply}
            onInputValueChange={e => {
              setNFTSupply(e.target.value);
            }}
            placeHolder="0.0"
            minValue={"0"}
            maxValue={maxRef.current}
            required
            type="number"
            theme="light"
            endAdornment={
              <div className={classes.purpleText} onClick={() => setNFTSupply(maxRef.current)}>
                MAX
              </div>
            }
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <div className={classes.select}>
            <Dropdown value={"jots"} menuList={[{ name: "JOTS", value: "jots" }]} onChange={() => {}} />
          </div>
        </Grid>
      </Grid>

      <Box mt={6} display="flex" alignItems="center" justifyContent="space-between">
        <SecondaryButton
          size="medium"
          onClick={onClose}
          style={{
            fontWeight: 800,
            fontSize: "14px",
            padding: "8px 26px",
            lineHeight: "18px",
            width: "fit-content",
          }}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          size="medium"
          onClick={() => {}}
          style={{
            borderColor: Color.Purple,
            background: Color.Purple,
            color: "white",
            fontWeight: 800,
            fontSize: "14px",
            padding: "8px 26px",
            lineHeight: "18px",
            width: "fit-content",
          }}
        >
          Submit
        </PrimaryButton>
      </Box>
    </Modal>
  );
}
