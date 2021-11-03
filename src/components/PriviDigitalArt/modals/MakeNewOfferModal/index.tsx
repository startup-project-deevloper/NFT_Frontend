import React, {useState, useEffect} from "react";
import { useWeb3React } from "@web3-react/core";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { MakeNewOfferModalStyles } from "./index.style";
import {typeUnitValue} from "shared/helpers/utils";
import { Grid } from "@material-ui/core";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { BlockchainNets } from "shared/constants/constants";

export default function MakeNewOfferModal({ open, handleClose = () => {}, onConfirm }) {
  const classes = MakeNewOfferModalStyles();
  const { account, library, chainId } = useWeb3React();

  const [usdt, setUsdt] = React.useState<number>(0);
  const [soldDays, setSoldDays] = React.useState<number>(0);
  const [disappearDays, setDisappearDays] = React.useState<number>(0);
  const [collateral, setCollateral] = React.useState<number>(0);
  const [usdtBalance, setUsdtBalance] = React.useState<number>(0);
  
  const [validateError, setValidateError] = useState(false);

  const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");
  const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[0]);
  const [tokenList, setTokenList] = useState<string[]>(Object.keys(selectedChain.config.TOKEN_ADDRESSES));
  const [reservePriceToken, setReservePriceToken] = useState<string>("ETH");

  const [confirmSuccess, setConfirmSuccess] = useState(false);

  useEffect(() => {
    setTokenList(Object.keys(selectedChain.config.TOKEN_ADDRESSES));
    setReservePriceToken(Object.keys(selectedChain.config.TOKEN_ADDRESSES)[0]);
  }, [selectedChain]);
  useEffect(() => {
    if(Number(collateral) !== 0) {
      setValidateError(false);
    } else {
      setValidateError(true);
    }
  }, [collateral])

  const handleAddToken = () => {

  }
  const handleConfirm = () => {
    console.log(collateral);
    if(Number(collateral) === 0) setValidateError(true);
    else {
      setConfirmSuccess(true);
    }
  }
  const handleCloseModal = () => {
    setConfirmSuccess(false);
    handleClose();
  }

  return (
    <Modal size="medium" isOpen={open} onClose={handleCloseModal} showCloseIcon className={classes.container}>
      {!confirmSuccess && (
        <>
          <Box style={{padding:'25px'}}>
            <Box fontSize="24px" color="#431AB7">
              Make new offer
            </Box>
            <Box className={classes.nameField}>
              Future Price
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
            <Box className={classes.nameField}>
              Fututre time when NFT will be sold 
            </Box>
            <InputWithLabelAndTooltip
              inputValue={soldDays}
              onInputValueChange={e => setSoldDays(e.target.value)}
              overriedClasses={classes.inputJOT}
              required
              type="number"
              theme="light"
              minValue={0}
              endAdornment={<div className={classes.purpleText}>DAYS</div>}
            />
            <Box className={classes.nameField}>
              Collaterall  token
            </Box>
            <Grid container spacing={2}>
              <Grid item sm={7}>
                <InputWithLabelAndTooltip
                  inputValue={collateral}
                  onInputValueChange={e => setCollateral(e.target.value)}
                  overriedClasses={classes.inputJOT}
                  required
                  type="number"
                  theme="light"
                  minValue={0}
                />
              </Grid>
              <Grid item sm={5}>
                <TokenSelect
                  tokens={tokenList}
                  value={reservePriceToken}
                  onChange={e => {
                    setReservePriceToken(e.target.value as string);
                  }}
                  className={classes.inputJOT}
                />
              </Grid>
            </Grid>
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
            <Box display="flex" alignItems="center" justifyContent="start">
              <SecondaryButton
                  size="medium"
                  style={{ color: "#431AB7", maxWidth: "100px", border: "2px solid #431AB7", padding:'0px', marginTop:'27px'}}
                  onClick={handleAddToken}
                >
                  + Add Token
              </SecondaryButton>
            </Box>
            <Box className={classes.nameField}>
              Offer will disapppear if not accepted within
            </Box>
            <InputWithLabelAndTooltip
              inputValue={disappearDays}
              onInputValueChange={e => setDisappearDays(e.target.value)}
              overriedClasses={classes.inputJOT}
              required
              type="number"
              theme="light"
              minValue={0}
              endAdornment={<div className={classes.purpleText}>DAYS</div>}
            />
          </Box>
          <Box className={classes.footer} >
            <Box className={classes.totalText}>
              Total
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box style={{color:'#431AB7', fontSize:'14px', fontFamily:'Montserrat', fontWeight: 500}}>
                  Collateral at <span style={{color: validateError ? 'red' : '#431AB7'}}>40%</span> / 50%
                  {validateError && (
                    <Box style={{color:'red'}}>
                      You need to add more collaterall
                    </Box>
                  )}
                </Box>
                <Box style={{color:'#431AB7', fontSize:'14px', fontFamily:'Montserrat', fontWeight: 500}}>
                  22 225 USDT
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
                style={{ background: "#431AB7", color: "#ffffff", minWidth: "56%", opacity:validateError?'0.3':'1'}}
                onClick={handleConfirm}
              >
                Confirm Offer
              </PrimaryButton>
            </Box>
          </Box>
        </>
      )}
      {confirmSuccess && (
        <Box style={{padding:'25px'}} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap" flexDirection="column">
            <img src={require('assets/icons/lock-success-icon.png')} width="110px" /> <br />
            <div style={{color:'#2D3047', fontSize:'22px', fontWeight: 800, marginTop:'31px'}}>Your offer  was sent</div>
            <div style={{color:'#54658F', fontSize:'16px', marginTop:'20px', textAlign:'center'}}>Your NFT has been locked successfully. You can see it by clicking Manage Portfolio now.</div>
            <PrimaryButton
              size="medium"
              style={{ background: "#431AB7", color: "#ffffff", minWidth: "56%", fontSize:'14px', marginTop:'35px'}}
              onClick={handleCloseModal}
            >
                Done
            </PrimaryButton>
        </Box>
      )}
    </Modal>
  );
}
