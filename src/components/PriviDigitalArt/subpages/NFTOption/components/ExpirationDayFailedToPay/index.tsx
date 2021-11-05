import React, { useState } from "react";

import {  useMediaQuery } from "@material-ui/core";

import { Avatar, Color, FontSize, PrimaryButton, SecondaryButton, Text } from "shared/ui-kit";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import Box from "shared/ui-kit/Box";

import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { CustomTable, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import { MediaPhotoDetailsModal } from "components/PriviDigitalArt/modals/MediaPhotoDetailsModal";
import { ExpirationDayFailedToPayStyles } from "./index.styles";

import useIPFS from "shared/utils-IPFS/useIPFS";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import OrderBookModal from "components/PriviDigitalArt/modals/OrderBookModal";
import PayRemainingAmountModal from "components/PriviDigitalArt/modals/PayRemainingAmountModal";

const useStyles = makeStyles({
  root: {
    width: 700
  }
});

const marks = [
  {
    value: 0,
    label: '0%',
  },
  {
    value: 10,
    label: '10%',
  },
  {
    value: 20,
    label: '20%',
  },
  {
    value: 30,
    label: '30%',
  },
  {
    value: 40,
    label: '40%',
  },
  {
    value: 50,
    label: '50%',
  },
  {
    value: 60,
    label: '60%',
  },
  {
    value: 70,
    label: '70%',
  },
  {
    value: 80,
    label: '80%',
  },
  {
    value: 90,
    label: '90%',
  },
  {
    value: 100,
    label: '100%',
  },
];

const CustomSlider = withStyles({
  rail: {
    border: '2px solid black',
    height: 8,
    borderRadius: 4,
    backgroundImage: "linear-gradient(90deg, #C70000 0%, #FF0F00 15.64%, #FF6B00 32.88%, #FFE600 42.11%, #FFE600 65.18%, #B5F400 75.74%, #B5F400 100%)"

  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundImage: "linear-gradient(90deg, #C70000 0%, #FF0F00 15.64%, #FF6B00 32.88%, #FFE600 42.11%, #FFE600 65.18%, #B5F400 75.74%, #B5F400 100%)"
  },
  root: {
    color: '#4218B5',
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  mark: {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 2,
    marginTop: 10,
  },
})(Slider);

const ExpirationDayFailedToPay = () => {
  const classes = ExpirationDayFailedToPayStyles();

  const [sliderValue, setSliderValue] = React.useState(30);

  const handleChange = (event, newValue) => {
      setSliderValue(newValue);
  };

  const isMobileScreen = useMediaQuery("(max-width:400px)");
  const isTableScreen = useMediaQuery("(max-width:550px)");


  const [loan, setLoan] = useState<any>(true);
  const [loanMedia, setLoanMedia] = useState<any>(true);
  const [loadingLoan, setLoadingLoan] = useState<boolean>(false);
  const [status, setStatus] = useState<any>(""); // show status of the operation

  const [openBidModal, setOpenBidModal] = useState<boolean>(false);
  const [isShowingMediaPhotoDetailModal, setIsShowingMediaPhotoDetailModal] = useState<boolean>(false);

  const { setMultiAddr } = useIPFS();

  const [imageIPFS, setImageIPFS] = useState({});
  
  const handleOpenMediaPhotoDetailModal = () => {
    setIsShowingMediaPhotoDetailModal(true);
  };

  const handleCloseMediaPhotoDetailModal = () => {
    setIsShowingMediaPhotoDetailModal(false);
  };
  const [openOrderBookModal, setOpenOrderBookModal] = useState<boolean>(false);
  const handleConfirmOrderBook = () => {
      setOpenOrderBookModal(false);
  }
  const [openPayRemainingAmountModal, setOpenPayRemainingAmountModal] = useState<boolean>(false);
  const handleConfirmPayRemainingAmount = () => {
      setOpenPayRemainingAmountModal(false);
  }

  const tableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "ACCOUNT",
    },
    {
      headerName: "SYMBOL",
    },
    {
      headerName: "AMOUNT",
    },
    {
      headerName: "%OF",
      headerAlign: "center",
    },
    {
      headerName: "ACTION",
      headerAlign: "center",
    },
  ];
  const [flipHistory, setFlipHistory] = useState<any>([
    {account:'0xeec9...82f8', symbol:'2450 USDT', amount:'232 USDT', of:'25', action:'s'},
    {account:'0xeec9...82f8', symbol:'2450 USDT', amount:'232 USDT', of:'25', action:'s'},
    {account:'0xeec9...82f8', symbol:'2450 USDT', amount:'232 USDT', of:'25', action:'s'},
    {account:'0xeec9...82f8', symbol:'2450 USDT', amount:'232 USDT', of:'25', action:'s'},
  ]);

  return (
    <Box style={{ position: "relative", width: "100%" }}>
      <div className={classes.content}>
        <Box display="flex" justifyContent="space-between" width="100%">
          <BackButton purple/>
        </Box>
        {loan && loanMedia ? (
          <LoadingWrapper loading={loadingLoan} theme={"blue"} height="calc(100vh - 100px)">

            <Box
              display="flex"
              flexDirection={isMobileScreen || isTableScreen ? "column" : "row"}
              mt={2}
              mb={3}
              width="100%"
            >
              <Box
                width={isMobileScreen || isTableScreen ? 1 : 0.5}
                mr={isMobileScreen || isTableScreen ? 0 : "20px"}
                onClick={handleOpenMediaPhotoDetailModal}
              >
                <img
                  src={
                    loanMedia.cid
                      ? imageIPFS
                      : loanMedia.Type === "VIDEO_TYPE"
                      ? loanMedia.UrlMainPhoto
                      : loanMedia.Url || loanMedia.url || require('assets/backgrounds/nft-card-img.png')
                  }
                  className={classes.detailImg}
                  width="100%"
                />
              </Box>
              <Box
                width={isMobileScreen || isTableScreen ? 1 : 0.5}
                ml={isMobileScreen || isTableScreen ? 0 : "20px"}
                py={2}
              >
                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                  <Box display="flex" flexDirection={isMobileScreen ? "column" : "row"} alignItems="center">
                    <Box display="flex" flexDirection="row" alignItems="center">
                      
                      <Box display="flex" flexDirection="column" ml={0.25} mr={1.25}>
                        <Text color={Color.Black} className={classes.creatorName} style={{ marginBottom: 4 }}>
                          Test
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="row" alignItems="center">
                        <SecondaryButton 
                            size="small" 
                            // onClick={handleFollow} 
                            className={classes.checkOnBtn}
                        >
                          Check on
                          <img
                                src={require("assets/walletImages/contract.svg")}
                                alt=""
                                style={{ position: 'absolute', top: '6px', right: '8px' }}
                            />
                        </SecondaryButton>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start">
                    <Avatar  
                        url={require("assets/anonAvatars/ToyFaces_Colored_BG_066.jpg")}
                        size="small"
                    />
                    <Text style={{margin:'0px 9px'}}>Owned by</Text>
                    <Text>0xeec9...82f8</Text>
                </Box>
                <hr className={classes.divider} />
                <Box display="flex">
                    <Text style={{fontSize: '18px', color:'#1A1B1C', fontWeight: 800}}>Details</Text>
                </Box>
                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                    <Box>
                        <Text className={classes.detailHeaderText}>Option Time</Text>
                        <br />
                        <Text className={classes.detailBodyText}>20 days (15.11.2021)</Text>
                    </Box>
                    <Box style={{ borderRight: '1px solid rgb(158 172 242 / 30%)', height: '45px'}}></Box>
                    <Box>
                        <Text className={classes.detailHeaderText}>Collateral</Text>
                        <br />
                        <Text className={classes.detailBodyText}>20%</Text>
                    </Box>
                    <Box style={{ borderRight: '1px solid rgb(158 172 242 / 30%)', height: '45px'}}></Box>
                    <Box>
                        <SecondaryButton 
                            size="small" 
                            onClick={()=>setOpenOrderBookModal(true)} 
                            className={classes.checkOrderbookBtn}
                        >
                            Check Orderbook
                        </SecondaryButton>
                    </Box>
                </Box>
                <hr className={classes.divider} />
                {/* <Box className={classes.importantNotify}>
                  <Box className={classes.notifyHeader}>
                    Important
                  </Box>
                  <Box className={classes.notifyGeneral}>
                    Your offer was accepted by the owner. You need to 
                    <span className={classes.notifyBold}>pay remaining amount to buy the NFT at Future price before end of countdown</span> otherwise you will loose your collateral.
                  </Box>
                </Box> */}
                <Box className={classes.priceBox}>
                    <Box className={classes.notifyHeader}>
                      Offer Expired
                    </Box>
                    <Box className={classes.notifyGeneral}>
                      You didn’t manage to pay full amount necessary to buy out your NFT. Yu can withdraw your funds and NFT will be returned to it’s owner. 
                    </Box>
                    {/* <Box className={classes.notifyHeader}>Future payment in:</Box> */}
                    <Box display="flex" alignItems="center" mt={3} justifyContent="space-between">
                      <Box>
                        <Box sx={{fontSize:'16px', color:'#181818'}}>Future price </Box>
                        <Box sx={{fontSize:'18px', color:'#431AB7', fontWeight:800}}>2545 USDT</Box>
                      </Box>
                      <Box style={{ borderRight: '1px solid rgba(164, 164, 164, 0.2)', height: '45px'}}></Box>
                      <Box>
                        <Box sx={{fontSize:'16px', color:'#181818'}}>Paid amount to withdraw </Box>
                        <Box sx={{fontSize:'18px', color:'#431AB7', fontWeight:800}}>1200 USDT</Box>
                      </Box>
                    </Box>
                    <Box mt={5}>
                      <PrimaryButton
                        size="medium"
                        style={{ background: "#4218B5", color: "#ffffff", padding:'2px 15px', width:'100%'}}
                      >
                        Withdraw your funds 
                      </PrimaryButton>
                    </Box>
                </Box>                
              </Box>
            </Box>           
            <OrderBookModal
              open={openOrderBookModal}
              handleClose={() => setOpenOrderBookModal(false)}
              onConfirm={handleConfirmOrderBook}
            />

          </LoadingWrapper>
        ) : (
          <LoadingWrapper loading={true} theme={"blue"} height="calc(100vh - 100px)" />
        )}
      </div>
    </Box>
  );
};

export default React.memo(ExpirationDayFailedToPay);
