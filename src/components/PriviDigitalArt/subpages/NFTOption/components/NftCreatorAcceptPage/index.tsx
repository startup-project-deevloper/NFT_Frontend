import React, { useState } from "react";

import {  useMediaQuery } from "@material-ui/core";

import { Avatar, Color, FontSize, PrimaryButton, SecondaryButton, Text } from "shared/ui-kit";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import Box from "shared/ui-kit/Box";

import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { CustomTable, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import { MediaPhotoDetailsModal } from "components/PriviDigitalArt/modals/MediaPhotoDetailsModal";
import { nftCreatorAcceptPageStyles } from "./index.styles";

import useIPFS from "shared/utils-IPFS/useIPFS";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import CancelReserveModal from "components/PriviDigitalArt/modals/CancelReserveModal";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import OrderBookModal from "components/PriviDigitalArt/modals/OrderBookModal";

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
    backgroundImage: "linear-gradient(90deg, #418DFF 2.56%, #4541FF 40.45%, #4541FF 52.29%, #EF41CB 87.27%, #EF41CB 92.47%, #EFA941 116.08%)"

  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundImage: "linear-gradient(90deg, #418DFF 2.56%, #4541FF 40.45%, #4541FF 52.29%, #EF41CB 87.27%, #EF41CB 92.47%, #EFA941 116.08%)"
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

const NftCreatorAcceptPage = () => {
  const classes = nftCreatorAcceptPageStyles();

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

  const [openCancelReserveModal, setOpenCancelReserveModal] = useState<boolean>(false);
  const handleConfirmCancelReserve = () => {
      setOpenCancelReserveModal(false);
  }
  return (
    <Box style={{ position: "relative", width: "100%" }}>
      <div className={classes.content}>
        <Box display="flex" justifyContent="space-between" width="100%">
          <BackButton purple/>
          <div style={{display:'flex'}}>
            <div 
                className={classes.primaryButton}
                onClick={() => setOpenCancelReserveModal(true)}
                style={{padding:'11px 28px 7px 28px'}}
            >
                CANCEL RESERVE <img src={require('assets/icons/info-circle.svg')} style={{position: 'absolute', marginLeft: '5px'}}></img>
            </div>
          </div>
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
												className={classes.checkOrderbookBtn}
												onClick={()=>setOpenOrderBookModal(true)} 
											>
												Check Orderbook
											</SecondaryButton>
                    </Box>
                </Box>
                <Box className={classes.priceBox}>
									<Box display="flex" justifyContent="space-between">
										<div className={classes.priceBoxName}>Future price</div>
										<div className={classes.priceBoxPrice}>2545 USDT</div>
									</Box>
									<hr className={classes.priceDivider} />
									<Box className={classes.payingDate}>
										Paying Date
									</Box>
									<Box display="flex" marginTop="12px" justifyContent="space-around">
											<PrimaryButton
												size="small"
												style={{ background: "#4218B5", color: "#ffffff", padding:'2px 15px'}}
											>
												4 Days
											</PrimaryButton>
											<PrimaryButton
												size="small"
												style={{ background: "#4218B5", color: "#ffffff", padding:'2px 15px'}}
											>
												22h
											</PrimaryButton>
											<PrimaryButton
												size="small"
												style={{ background: "#4218B5", color: "#ffffff", padding:'2px 15px'}}
											>
												12min
											</PrimaryButton>
											<PrimaryButton
												size="small"
												style={{ background: "#4218B5", color: "#ffffff", padding:'2px 15px'}}
											>
												10s
											</PrimaryButton>
									</Box>
                </Box>                
              </Box>
            </Box>           
            <CancelReserveModal
							open={openCancelReserveModal}
							handleClose={() => setOpenCancelReserveModal(false)}
							onConfirm={handleConfirmCancelReserve}
            />
            <OrderBookModal
							open={openOrderBookModal}
							handleClose={() => setOpenOrderBookModal(false)}
							onConfirm={handleConfirmOrderBook}
            />
            
						<div className={classes.transactionsSection}>
							<div className={classes.coinFlipHistorySection}>
								<Box sx={{padding:'37px 37px 0px 37px'}}>
									<Box display="flex" justifyContent="space-between">
										<Box>
											<div className={classes.typo8}>Buyer status of reservance </div>
											<div className={classes.subTypo8}>If buyer is collaterall is too small you can claim liquidation and cancel reservation.</div>
										</Box>
										<Box>
											<PrimaryButton
												size="large"
												style={{ background: "#F2604C", color: "#ffffff", padding:'5px 30px', fontSize:'16px', fontWeight:800}}
											>
												CLAIM LIQUIDATION
											</PrimaryButton>	
										</Box>
									</Box>
									<Box display="flex" justifyContent="space-between" marginTop="37px">
										<Box className={classes.collateralText}>Collaterall status <span style={{color:'#431AB7'}}>50%</span></Box>
										<Box className={classes.collateralText}>Collateral  needed <span style={{color:'#D30401'}}>100%</span></Box>
									</Box>
									<CustomSlider
										value={sliderValue}
										onChange={handleChange}
										aria-labelledby="continuous-slider"
										defaultValue={0}
										step={1}
										marks={marks}
										min={0}
										max={100}
										valueLabelDisplay="auto"
									/>
									<div className={classes.typo8}>Ccollateral available </div>
								</Box>
								<div className={classes.table}>
									<CustomTable
									headers={tableHeaders}
									rows={flipHistory.map(item => [
										{
											cell: item.account,
										},
										{
										cell: (
											<div>
											<img src={require("assets/tokenImages/USDT.png")} style={{width:'17%'}}/>
											</div>
										),
										},
										{
											cellAlign: "center",
											cell: item.amount
										},
										{
											cellAlign: "center",
											cell: item.of,
										},
										{
											cellAlign: "center",
											cell: (
												<Box display="flex">
													<SecondaryButton
														size="small"
														style={{ color: "#431AB7", minWidth: "100%", border: "2px solid #431AB7" }}
													>
														Withdraw 
													</SecondaryButton>
												</Box>
											),
										},
									])}
									placeholderText="No history"
									/>
								</div>
							</div>
						</div>

          </LoadingWrapper>
        ) : (
          <LoadingWrapper loading={true} theme={"blue"} height="calc(100vh - 100px)" />
        )}
      </div>
    </Box>
  );
};

export default React.memo(NftCreatorAcceptPage);
