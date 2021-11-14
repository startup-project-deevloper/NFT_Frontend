import React, {useState, useEffect} from "react";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { MakeNewOfferModalStyles } from "./index.style";
import {typeUnitValue} from "shared/helpers/utils";
import { Grid } from "@material-ui/core";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { BlockchainNets } from "shared/constants/constants";

import { injected } from "shared/connectors";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import NFTReservalManagerContract from "shared/connectors/web3/contracts/NFTReservalManagerContract.json";
import Axios from "axios";

export default function MakeNewOfferModal({ open, handleClose = () => {}, onConfirm }) {
  const classes = MakeNewOfferModalStyles();
  const { activate, account, library, chainId } = useWeb3React();
  // let data = ['1'];
  const [usdt, setUsdt] = React.useState<number>(0);
  const [futurePrice, setFuturePrice] = React.useState<number>(0);
  
  const [soldDays, setSoldDays] = React.useState<number>(0);
  const [disappearDays, setDisappearDays] = React.useState<number>(0);
  const [collateral, setCollateral] = useState([0]);
  const [collateralPriceToken, setCollateralPriceTokne] = useState([]);
  const [usdtBalance, setUsdtBalance] = React.useState<number>(0);
  
  const [validateError, setValidateError] = useState(false);

  const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");
  const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[0]);
  const [tokenList, setTokenList] = useState<string[]>(Object.keys(selectedChain.config.TOKEN_ADDRESSES));
  const [reservePriceToken, setReservePriceToken] = useState<string>("ETH");
  const [futurePriceToken, setFuturePriceToken] = useState<string>("ETH");

  const [confirmSuccess, setConfirmSuccess] = useState(false);

  const [collateralList, setCollateralList] = useState([{
    value: 0,
    token : 'ETH'
  }]);
  useEffect(() => {
    setTokenList(Object.keys(selectedChain.config.TOKEN_ADDRESSES));
    setReservePriceToken(Object.keys(selectedChain.config.TOKEN_ADDRESSES)[0]);
  }, [selectedChain]);
  // useEffect(() => {
  //   if(Number(collateral) !== 0) {
  //     setValidateError(false);
  //   } else {
  //     setValidateError(true);
  //   }
  // }, [collateral])

  const handleMetamaskConnect = () => {
	
    activate(injected, undefined, true).catch(error => {
      if (error instanceof UnsupportedChainIdError) {
        activate(injected);
      } else {
        console.info("Connection Error - ", error);
        // setNoMetamask(true);
      }
    });
  };

  const handleAddToken = () => {
    const addItem = {
      value: 0,
      token: 'ETH'
    }
    setCollateralList([...collateralList, addItem]);
    console.log(collateralList);
    // setCollateralPriceTokne
  }
  const handleConfirm = async () => {
    console.log(collateral);
    if(library === undefined) {
      handleMetamaskConnect();
      return;
    }
    const web3 = new Web3(library.provider);
    const web3Obj = new Web3(library.provider);
    
    let chain_id = await web3Obj.eth.getChainId();
    const network = selectedChain.name === "ETHEREUM" ? "Ethereum" : "Polygon";
    const contractAddress = "0x2C556dCc83b8027a6D2379b20c23D797eA28888d";
    
    const contract = await ContractInstance(web3, NFTReservalManagerContract.abi, contractAddress);
    
    console.log(contract);
    let current_price = 1;
    let ct = 0;

    for(let i = 0 ; i < collateralList.length ; i ++) {
      ct += collateralList[i].value * 1000
    }

    const reserval = await contract.methods.updateOffer(
      12,
      "0x9214dd01e5aaab026db23f0bc43f48024ee725c4", 
      1, 
      "0x296A01C48e17891a8Cab6C5942E5c10dE19B2351",
      1,
      15,
      0
    ).send({
      from : account,
      gas : 300000
    })
    .on("receipt", async (receipt) => {
      console.log(">>>success", receipt);

      const body = {
        Owner : "0x9214dd01e5aaab026db23f0bc43f48024ee725c4",
        Buyer : "0x132562434566ab026db23f0bc43f48131135dfec",
        Future_price : futurePrice,
        FuturePriceToken : futurePriceToken,
        Disapper_day : disappearDays,
        Collateral_list : collateralList,
        Token_id : "4151413421351"
      }

      const response = await Axios.post(`http://194.146.57.180:8080/nftOption/createOfferedNFT`, body);
      console.log(">>>---", response.data);
      setConfirmSuccess(true);

    })
    .on("error", (err) => {
      console.log(">>>err", err);
    });
    console.log("reserval ---- ", reserval);
  }
  const handleCloseModal = () => {
    setConfirmSuccess(false);
    handleClose();
  }

  const handleSetCollateral = (key, value) => {
    let new_data = [...collateralList];
    new_data[key].value = Number(value);
    setCollateralList(new_data);
  }

  const handleReservePriceToken = (key, value) => {
    let new_data = [...collateralList];
    new_data[key].token = value;
    setCollateralList(new_data);
  }

  return (
    <Modal size="medium" isOpen={open} onClose={handleCloseModal} showCloseIcon className={classes.container}>
      {!confirmSuccess && (
        <>
          <Box style={{padding:'25px'}}>
            <Box fontSize="24px" color="#431AB7">
              Make new offer
            </Box>
            <Grid container spacing={2}>
              <Grid item sm={7}>
                <Box className={classes.nameField}>
                  Future Price
                </Box>
              </Grid>
              <Grid item sm={5}>
                <Box className={classes.nameField}>
                  Reserve Token
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item sm={7}>
                <InputWithLabelAndTooltip
                  inputValue={futurePrice}
                  onInputValueChange={e => setFuturePrice(e.target.value)}
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
                  value={futurePriceToken}
                  onChange={e => {
                    setFuturePriceToken(e.target.value as string);
                  }}
                  className={classes.inputJOT}
                />
              </Grid>
            </Grid>
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
            {collateralList.map((item, key)=>
              <>
                <Grid container spacing={2}>
                  <Grid item sm={7}>
                    <InputWithLabelAndTooltip
                      inputValue={item.value}
                      // onInputValueChange={e => setCollateral(e.target.value)}
                      onInputValueChange={e=>handleSetCollateral(key, e.target.value)}
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
                      value={item.token}
                      // onChange={e => {
                      //   setReservePriceToken(e.target.value as string);
                      // }}
                      onChange={e=>handleReservePriceToken(key, e.target.value)}
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
              </>
            )}
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
