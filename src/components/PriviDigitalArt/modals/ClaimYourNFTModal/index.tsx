import React, {useState, useEffect} from "react";
import { useWeb3React } from "@web3-react/core";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { ClaimYourNFTModalStyles } from "./index.style";
import {typeUnitValue} from "shared/helpers/utils";
import { Grid } from "@material-ui/core";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { BlockchainNets } from "shared/constants/constants";

import ExploreOptionCard from 'components/PriviDigitalArt/components/Cards/ExploreOptionCard';

export default function ClaimYourNFTModal({ open, handleClose = () => {}, onConfirm, img_url }) {
  const classes = ClaimYourNFTModalStyles();
  const { account, library, chainId } = useWeb3React();

  const [usdt, setUsdt] = React.useState<number>(0);
  const [soldDays, setSoldDays] = React.useState<number>(0);
  const [disappearDays, setDisappearDays] = React.useState<number>(0);
  const [collateral, setCollateral] = React.useState<number>(0);
  const [usdtBalance, setUsdtBalance] = React.useState<number>(0);


  const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");
  const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[0]);
  const [tokenList, setTokenList] = useState<string[]>(Object.keys(selectedChain.config.TOKEN_ADDRESSES));
  const [reservePriceToken, setReservePriceToken] = useState<string>("ETH");
  const [confirmSuccess, setConfirmSuccess] = useState(false);

  useEffect(() => {
    setTokenList(Object.keys(selectedChain.config.TOKEN_ADDRESSES));
    setReservePriceToken(Object.keys(selectedChain.config.TOKEN_ADDRESSES)[0]);
  }, [selectedChain]);

  const handleAddToken = () => {

  }

  const handleConfirm = () => {
    setConfirmSuccess(true);
  }

  const handleCloseModal = () => {
    onConfirm();
  }

  return (
    <Modal size="medium" isOpen={open} onClose={handleCloseModal} showCloseIcon className={classes.container}>
      <Box style={{padding:'25px'}} display="flex" justifyContent="center" alignItems = "center" flexWrap="wrap" flexDirection="column">
          <ExploreOptionCard xs={6} sm={6} md={6} lg={6}  img_url={img_url}/>
          <div style={{color:'#2D3047', fontSize:'22px', fontWeight: 800, marginTop:'31px'}}>Claim your NFT</div>
          <div style={{color:'#54658F', fontSize:'16px', marginTop:'20px', textAlign:'center'}}>Congrat,s you’ve succesfullycan claim your<br/> resrved NFT  [ NFT name]  at [Price]</div>
          <PrimaryButton
            size="medium"
            style={{ background: "#431AB7", color: "#ffffff", minWidth: "56%", fontSize:'14px', marginTop:'35px'}}
            onClick={handleCloseModal}
          >
            Confirm Claim
          </PrimaryButton>
      </Box>
    </Modal>
  );
}
