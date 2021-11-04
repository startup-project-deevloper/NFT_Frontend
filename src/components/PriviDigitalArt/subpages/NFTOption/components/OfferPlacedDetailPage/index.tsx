import React, { useState } from "react";
import { useParams, useHistory} from 'react-router-dom'
import {  useMediaQuery } from "@material-ui/core";

import { Avatar, Color, SecondaryButton, Text } from "shared/ui-kit";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import Box from "shared/ui-kit/Box";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { OfferPlacedDetailPageStyles } from "./index.styles";

import useIPFS from "shared/utils-IPFS/useIPFS";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import ReserveNftModal from "components/PriviDigitalArt/modals/ReserveNftModal";
import MakeNewOfferModal from "components/PriviDigitalArt/modals/MakeNewOfferModal";
import OrderBookModal from "components/PriviDigitalArt/modals/OrderBookModal";


const OfferPlacedDetailPage = () => {
  const classes = OfferPlacedDetailPageStyles();
  // const { img_id } = useParams();
  const img_id = 1;
  const history = useHistory();
  const isMobileScreen = useMediaQuery("(max-width:400px)");
  const isTableScreen = useMediaQuery("(max-width:550px)");


  const [loan, setLoan] = useState<any>(true);
  const [loanMedia, setLoanMedia] = useState<any>(true);
  const [loadingLoan, setLoadingLoan] = useState<boolean>(false);

  const [openBidModal, setOpenBidModal] = useState<boolean>(false);
  const [isShowingMediaPhotoDetailModal, setIsShowingMediaPhotoDetailModal] = useState<boolean>(false);

  const { setMultiAddr} = useIPFS();

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
  ];
  const [flipHistory, setFlipHistory] = useState<any>([
    {user:'0xeec9...82f8', price:'2450 USDT', collateral:'232 USDT', expiration:'3 Days', etherscan:'sss'},
    {user:'0xeec9...82f8', price:'2450 USDT', collateral:'232 USDT', expiration:'3 Days', etherscan:'sss'},
    {user:'0xeec9...82f8', price:'2450 USDT', collateral:'232 USDT', expiration:'3 Days', etherscan:'sss'},
    {user:'0xeec9...82f8', price:'2450 USDT', collateral:'232 USDT', expiration:'3 Days', etherscan:'sss'},
    {user:'0xeec9...82f8', price:'2450 USDT', collateral:'232 USDT', expiration:'3 Days', etherscan:'sss'},
  ]);

  const [Offershowed, setOfferShowed] = useState<boolean>(false);

  const [openReserveNftModal, setOpenReserveNftModal] = useState<boolean>(false);
  const handleConfirmReserveNft = () => {
    setOpenReserveNftModal(false);
  };
  const [openMakeNewOfferModal, setOpenMakeNewOfferModal] = useState<boolean>(false);
  const handleConfirmMakeNewOffer = () => {
      setOpenMakeNewOfferModal(false);
  }
  const [openOrderBookModal, setOpenOrderBookModal] = useState<boolean>(false);
  const handleConfirmOrderBook = () => {
      setOpenOrderBookModal(false);
  }
  const goBack = () => {
    history.push('/option/explore');
  }
  return (
    <Box style={{ position: "relative", width: "100%" }}>
      <div className={classes.content}>
        <BackButton purple overrideFunction={goBack}/>
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
                            onClick={()=>setOpenOrderBookModal(true)} 
                            className={classes.checkOrderbookBtn}
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
                        className={classes.primaryButton} 
                        onClick={() => setOpenReserveNftModal(true)}
                    >
                        <span>Reserve NFT</span>
                    </div>
                    <div 
                        className={classes.secondaryButton}
                        onClick={() => setOpenMakeNewOfferModal(true)}
                    >
                        MAKE OFFER
                    </div>
                </Box>
                <hr className={classes.divider} />
                <Box className={classes.offersCountBox} display="flex" onClick={()=>setOfferShowed(!Offershowed)} style={{cursor:'pointer'}}>
                    <img src={require('assets/icons/Vector.png')} />
                    <div className={classes.offersText}>SEE BUYING OFFERS</div>
                    <div className={classes.offersCount}>12</div>
                    {!Offershowed ? (
                        <img src={require('assets/icons/option_arrow_down.png')} style={{color:'#431AB7', position:'absolute', right:'0px', cursor:'pointer'}}/>
                    ) : (
                        <img src={require('assets/icons/option_arrow_up.png')} style={{color:'#431AB7', position:'absolute', right:'0px', cursor:'pointer'}}/>
                    )}
                </Box>
              </Box>
            </Box>
            <ReserveNftModal
                open={openReserveNftModal}
                handleClose={() => setOpenReserveNftModal(false)}
                onConfirm={handleConfirmReserveNft}
                img_url={img_id}
            />
            <MakeNewOfferModal
                open={openMakeNewOfferModal}
                handleClose={() => setOpenMakeNewOfferModal(false)}
                onConfirm={handleConfirmMakeNewOffer}
            />
            <OrderBookModal
                open={openOrderBookModal}
                handleClose={() => setOpenOrderBookModal(false)}
                onConfirm={handleConfirmOrderBook}
            />

            {Offershowed && (
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
                            ])}
                            placeholderText="No history"
                            />
                        </div>
                    </div>
                </div>
            )}
          </LoadingWrapper>
        ) : (
          <LoadingWrapper loading={true} theme={"blue"} height="calc(100vh - 100px)" />
        )}
      </div>
    </Box>
  );
};

export default React.memo(OfferPlacedDetailPage);
