import React, {useState} from "react";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { EditOfferModalStyles } from "./index.style";
import {typeUnitValue} from "shared/helpers/utils";
import { DateInput } from "shared/ui-kit/DateTimeInput";

export default function EditOfferModal({ open, handleClose = () => {}, onConfirm }) {
  const classes = EditOfferModalStyles();

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
          <Box fontSize="24px" color="#431AB7">
            Edit Offer
          </Box>
          <Box className={classes.nameField}>
            Fututre time when NFT will be sold 
          </Box>
          <InputWithLabelAndTooltip
            inputValue={usdt}
            onInputValueChange={e => setUsdt(e.target.value)}
            overriedClasses={classes.inputJOT}
            required
            type="number"
            theme="light"
            minValue={0}
            endAdornment={<div className={classes.purpleText}>USDT</div>}
          />
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
          <Box className={classes.nameField}>
            Fututre time when NFT will be sold 
          </Box>
          <DateInput
            className={classes.datePicker}
            id="date-picker-expiration-date"
            minDate={new Date()}
            format="MM.dd.yyyy"
            placeholder="Select date..."
            value={expirationDate}
            onChange={e => {
              handleDateTime(e);
            }}
            style={{border:'1px solid #431AB7'}}
          />
          <Box className={classes.nameField}>
            % of collateral required
          </Box>
          <InputWithLabelAndTooltip
            inputValue={collateral}
            onInputValueChange={e => setCollateral(e.target.value)}
            overriedClasses={classes.inputJOT}
            required
            type="text"
            theme="light"
            minValue={0}
          />
        </Box>
        <Box className={classes.footer} >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box className={classes.totalText}>
              Total
            </Box>
              <Box style={{color:'#431AB7', fontSize:'14px', fontFamily:'Montserrat', fontWeight: 500}}>
                --USDT
              </Box>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
            <SecondaryButton
              size="medium"
              style={{ color: "#431AB7", maxWidth: "50px", border: "2px solid #431AB7" }}
              onClick={handleCloseModal}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              size="medium"
              style={{ background: "#DDFF57", color: "#431AB7", minWidth: "56%" }}
              onClick={handleConfirm}
            >
              Confirm Edits
            </PrimaryButton>
          </Box>
        </Box>
      </>
    </Modal>
  );
}
