import React, { useEffect, useState, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";

import { useMediaQuery } from "@material-ui/core";

import { Avatar, Color, PrimaryButton, SecondaryButton, Text } from "shared/ui-kit";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import { useTypedSelector } from "store/reducers/Reducer";
import Box from "shared/ui-kit/Box";
import { useUserConnections } from "shared/contexts/UserConnectionsContext";

import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import { MediaPhotoDetailsModal } from "components/PriviDigitalArt/modals/MediaPhotoDetailsModal";
import { manageOptionDetailPageStyles } from "./index.styles";

import useIPFS from "shared/utils-IPFS/useIPFS";

import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import CancelListingModal from "components/PriviDigitalArt/modals/CancelListingModal";
import EditOfferModal from "components/PriviDigitalArt/modals/EditOfferModal";
import WithdrawCollateralModal from "components/PriviDigitalArt/modals/WithdrawCollateralModal";
import OrderBookModal from "components/PriviDigitalArt/modals/OrderBookModal";

const ManageOptionDetailPage = () => {
  const classes = manageOptionDetailPageStyles();
  const { img_id } = useParams();
  const history = useHistory();

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

  const tableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "USER",
    },
    {
      headerName: "PRICE",
    },
    {
      headerName: "COLLATERAL",
    },
    {
      headerName: "EXPIRATION",
      headerAlign: "center",
    },
    {
      headerName: "ETHERSCAN",
      headerAlign: "center",
    },
    {
      headerName: "ACTION",
      headerAlign: "center",
    },
  ];
  const [flipHistory, setFlipHistory] = useState<any>([
    {user:'0xeec9...82f8', price:'2450 USDT', collateral:'232 USDT', expiration:'3 Days', etherscan:'sss', action:'s'},
    {user:'0xeec9...82f8', price:'2450 USDT', collateral:'232 USDT', expiration:'3 Days', etherscan:'sss', action:'s'},
    {user:'0xeec9...82f8', price:'2450 USDT', collateral:'232 USDT', expiration:'3 Days', etherscan:'sss', action:'s'},
    {user:'0xeec9...82f8', price:'2450 USDT', collateral:'232 USDT', expiration:'3 Days', etherscan:'sss', action:'s'},
    {user:'0xeec9...82f8', price:'2450 USDT', collateral:'232 USDT', expiration:'3 Days', etherscan:'sss', action:'s'},
  ]);

  const [openEditOfferModal, setOpenEditOfferModal] = useState<boolean>(false);
  const handleConfirmEditOffer = () => {
    setOpenEditOfferModal(false);
  };
  const [openCancelListingModal, setOpenCancelListingModal] = useState<boolean>(false);
  const handleConfirmCancelListing = () => {
      setOpenCancelListingModal(false);
  }
  const [openWithdrawCollateralModal, setOpenWithdrawCollateralModal] = useState<boolean>(false);
  const handleConfirmWithdrawCollateral = () => {
      setOpenWithdrawCollateralModal(false);
  }
  const [openOrderBookModal, setOpenOrderBookModal] = useState<boolean>(false);
  const handleConfirmOrderBook = () => {
      setOpenOrderBookModal(false);
  }

  const goBack = () => {
    history.push('/option/manage');
  }
  return (
    <Box style={{ position: "relative", width: "100%" }}>
      <div className={classes.content}>
        <Box display="flex" justifyContent="space-between" width="100%">
          <BackButton purple overrideFunction={goBack}/>
          <div style={{display:'flex'}}>
            <div 
                className={classes.secondaryButton}
                onClick={() => setOpenEditOfferModal(true)}
                style={{padding:'11px 40px 7px 40px', marginRight:'10px'}}
            >
                Edit offer
            </div>
            <div 
                className={classes.primaryButton}
                onClick={() => setOpenCancelListingModal(true)}
                style={{padding:'11px 28px 7px 28px'}}
            >
                cancel listing <img src={require('assets/icons/info-circle.svg')} style={{position: 'absolute', marginLeft: '5px'}}></img>
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
                      : loanMedia.Url || loanMedia.url || 'assets/test/' + img_id + '.png'
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
                <Box className={classes.priceBox} display="flex" justifyContent="space-between">
                    <div className={classes.priceBoxName}>Future price</div>
                    <div className={classes.priceBoxPrice}>2545 USDT</div>
                </Box>
                <Box display="flex" style={{marginTop:'11px'}}>
                    <div 
                        className={classes.secondaryButton}
                        onClick={() => setOpenWithdrawCollateralModal(true)}
                        style={{width:'100%'}}
                    >
                        Withdraw collaterall
                    </div>
                </Box>
              </Box>
            </Box>
            <EditOfferModal
                open={openEditOfferModal}
                handleClose={() => setOpenEditOfferModal(false)}
                onConfirm={handleConfirmEditOffer}
            />
            <CancelListingModal
                open={openCancelListingModal}
                handleClose={() => setOpenCancelListingModal(false)}
                onConfirm={handleConfirmCancelListing}
            />            
            <WithdrawCollateralModal
                open={openWithdrawCollateralModal}
                handleClose={() => setOpenWithdrawCollateralModal(false)}
                onConfirm={handleConfirmWithdrawCollateral}
            />
            <OrderBookModal
                open={openOrderBookModal}
                handleClose={() => setOpenOrderBookModal(false)}
                onConfirm={handleConfirmOrderBook}
            />

            
                <div className={classes.transactionsSection}>
                    <div className={classes.coinFlipHistorySection}>
                        <div className={classes.typo8}>Buying offers</div>
                        <div className={classes.table}>
                            <CustomTable
                            headers={tableHeaders}
                            rows={flipHistory.map(item => [
                                {
                                cell: item.user,
                                },
                                {
                                cell: item.price,
                                },
                                {
                                cell: item.collateral
                                },
                                {
                                cellAlign: "center",
                                cell: item.expiration,
                                },
                                {
                                cellAlign: "center",
                                cell: (
                                    <div>
                                    <img src={require("assets/icons/icon_ethscan.png")} />
                                    </div>
                                ),
                                },
                                {
                                  cellAlign: "center",
                                  cell: (
                                      <Box display="flex">
                                        <SecondaryButton
                                          size="small"
                                          style={{ color: "#431AB7", minWidth: "50%", border: "2px solid #431AB7" }}
                                        >
                                          DECLINE
                                        </SecondaryButton>
                                        <PrimaryButton
                                          size="small"
                                          style={{ background: "#431AB7", color: "#ffffff", minWidth: "50%" }}
                                        >
                                          ACCEPT
                                        </PrimaryButton>
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

export default React.memo(ManageOptionDetailPage);
