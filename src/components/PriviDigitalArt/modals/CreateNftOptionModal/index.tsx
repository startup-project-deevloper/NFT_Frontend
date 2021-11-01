import React, {useState} from "react";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { CreateNftOptionModalStyles } from "./index.style";
import {typeUnitValue} from "shared/helpers/utils";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import { Grid } from "@material-ui/core";

export default function CreateNftOptionModal({ open, handleClose = () => {}, onConfirm }) {
  const classes = CreateNftOptionModalStyles();

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
        <Box style={{padding:'25px'}} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap" flexDirection="column">
            <img src={require('assets/icons/lock-success-icon.png')} width="110px" /> <br />
            <div style={{color:'#2D3047', fontSize:'22px', fontWeight: 800, marginTop:'31px'}}>Your NFT Option is Created</div>
            <div style={{color:'#54658F', fontSize:'16px', marginTop:'20px', textAlign:'center'}}>Your NFT has been locked successfully. You can<br/> see it by clicking Manage Portfolio now.</div>
            <PrimaryButton
              size="medium"
              style={{ background: "#431AB7", color: "#ffffff", minWidth: "56%", fontSize:'14px', marginTop:'35px'}}
              onClick={handleCloseModal}
            >
                Go go Your Options
            </PrimaryButton>
        </Box>
      </>
    </Modal>
  );
}
