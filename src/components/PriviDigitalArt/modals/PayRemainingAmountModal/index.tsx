import React, {useState} from "react";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { PayRemainingAmountModalStyles } from "./index.style";
import {typeUnitValue} from "shared/helpers/utils";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import { Grid } from "@material-ui/core";

export default function PayRemainingAmountModal({ open, handleClose = () => {}, onConfirm }) {
  const classes = PayRemainingAmountModalStyles();

  const [usdt, setUsdt] = React.useState<number>(0);
  const [collateral, setCollateral] = React.useState<string>('0');
  const [usdtBalance, setUsdtBalance] = React.useState<number>(0);

  const handleConfirm = () => {
  }

  const handleCloseModal = () => {
    handleClose();
  }

  const currentTime = new Date();
  currentTime.setHours(new Date().getHours() + 1);
  const [expirationDate, setExpirationDate] = useState<Date>(currentTime);
  const [inputDate, setInputDate] = useState(expirationDate.getTime());

  const handleDateTime = (date: Date | null, isDate = true) => {
    if (date) {
      const existingDate = new Date(inputDate);
      let newDateStr;
      if (isDate) {
        newDateStr = `${date?.toLocaleDateString()} ${existingDate?.getHours()}:${existingDate?.getMinutes()}`;
        if (!isNaN(new Date(newDateStr).getTime())) {
          setInputDate(new Date(newDateStr).getTime());
        }
      } else {
        newDateStr = `${existingDate?.toLocaleDateString()} ${date?.getHours()}:${date?.getMinutes()}`;
        if (!isNaN(new Date(newDateStr).getTime())) {
          setInputDate(new Date(newDateStr).getTime());
        }
      }
      setExpirationDate(new Date(newDateStr));
    }
  };

  return (
    <Modal size="medium" isOpen={open} onClose={handleCloseModal} showCloseIcon className={classes.container}>
      <>
        <Box>
          <Box fontSize="24px" color="#431AB7" marginTop="50px">
            Payment
          </Box>
          <Box className={classes.nameField}>
            Pay reserved price for your  NFT in one payment or few installment.
          </Box>
          <Box className={classes.availableCollateral} display="flex">
            <Box>
              <Box className={classes.collateralText} style={{marginRight:'40px'}}>
                Amount to pay
              </Box>
              <Box className={classes.collateralAmount} style={{marginRight:'40px'}}>
                2455 USD
              </Box>
            </Box>
          </Box>
          <Grid container style={{marginTop:"12px"}} spacing={2}>
            <Grid item xs={7}>
              <InputWithLabelAndTooltip
                inputValue={usdt}
                onInputValueChange={e => setUsdt(e.target.value)}
                overriedClasses={classes.inputJOT}
                required
                type="number"
                theme="light"
                minValue={0}
                endAdornment={<div className={classes.purpleText}>Max</div>}
              />
            </Grid>
            <Grid item xs={5}>
              <select className={classes.inputTag}>
                <option>JOTS</option>
                <option>USDT</option>
              </select>
            </Grid>
          </Grid>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" color="#431AB7" marginTop="14px">
          <Box display="flex" alignItems="center" gridColumnGap="10px" fontSize="14px">
            <span>Wallet Balance</span>
            <Box className={classes.usdWrap} display="flex" alignItems="center">
              <Box className={classes.point}></Box>
              <Box fontWeight="700">{typeUnitValue(usdtBalance, 1)} USDT</Box>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" fontSize="16px">
            <span>
              MAX
            </span>
          </Box>
        </Box>
        <Box >
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
            <SecondaryButton
              size="medium"
              style={{ color: "#431AB7", maxWidth: "50px", border: "2px solid #431AB7" }}
              onClick={handleCloseModal}
            >
              CANCEL
            </SecondaryButton>
            <PrimaryButton
              size="medium"
              style={{ background: "#431AB7", color: "#ffffff", minWidth: "56%" }}
              onClick={handleConfirm}
            >
              CONFIRM WITHDRAW
            </PrimaryButton>
          </Box>
        </Box>
      </>
    </Modal>
  );
}
