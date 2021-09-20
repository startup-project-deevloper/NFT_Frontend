import React, { useState } from "react";
import { Box, Grid } from "@material-ui/core";
import { PrimaryButton, Modal, SecondaryButton, Color } from "shared/ui-kit";
import { Dropdown } from "shared/ui-kit/Select/Select";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { EditNFTPriceModalStyles } from "./index.styles";

export default function EditNFTPriceModal({ open, onClose }) {
  const classes = EditNFTPriceModalStyles();
  const [nftPrice, setNFTPrice] = useState<string>("");

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <div className={classes.title}>Edit NFT Price</div>
      <div className={classes.subtitle}>Set a new price fr your NFT</div>

      <Grid container spacing={1}>
        <Grid item xs={12} md={7}>
          <InputWithLabelAndTooltip
            inputValue={nftPrice}
            onInputValueChange={e => {
              setNFTPrice(e.target.value);
            }}
            placeHolder="0.0"
            minValue={"0"}
            required
            type="number"
            theme="light"
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
