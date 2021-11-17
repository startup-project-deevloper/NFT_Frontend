import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useMediaQuery } from "@material-ui/core";
import cls from "classnames";

import { Avatar, Color, PrimaryButton, SecondaryButton, Text } from "shared/ui-kit";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { exploreOptionDetailPageStyles } from "./index.styles";

import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import BlockNFTModal from "components/PriviDigitalArt/modals/BlockNFTModal";
import MakeNewOfferModal from "components/PriviDigitalArt/modals/MakeNewOfferModal";
import OrderBookModal from "components/PriviDigitalArt/modals/OrderBookModal";
import BlockingTabSection from "./BlockingTabSection";
import RentingTabSection from "./RentingTabSection";
import BuyingTabSection from "./BuyingTabSection";

const ExploreReserveDetailPage = () => {
  const classes = exploreOptionDetailPageStyles();
  const { img_id } = useParams();
  const history = useHistory();
  const isMobileScreen = useMediaQuery("(max-width:400px)");
  const isTableScreen = useMediaQuery("(max-width:550px)");

  const [loan, setLoan] = useState<any>(true);
  const [loanMedia, setLoanMedia] = useState<any>(true);
  const [loadingLoan, setLoadingLoan] = useState<boolean>(false);

  const [isShowingMediaPhotoDetailModal, setIsShowingMediaPhotoDetailModal] = useState<boolean>(false);

  const [imageIPFS, setImageIPFS] = useState({});
  const [selectedTab, setSelectedTab] = useState<"buying" | "renting" | "blocking">("buying");

  const handleOpenMediaPhotoDetailModal = () => {
    setIsShowingMediaPhotoDetailModal(true);
  };

  const handleCloseMediaPhotoDetailModal = () => {
    setIsShowingMediaPhotoDetailModal(false);
  };

  const [blockingOfferData, setBlockingOfferData] = useState<any>([
    {
      user: "0xeec9...82f8",
      price: "2450 USDT",
      collateral: "232 USDT",
      settlement: "3 Days",
      duration: "2 days 20h 21min",
      etherscan: "sss",
    },
    {
      user: "0xeec982f8",
      price: "2450 USDT",
      collateral: "232 USDT",
      settlement: "3 Days",
      duration: "2 days 20h 21min",
      etherscan: "sss",
    },
    {
      user: "0xeec9...82f8",
      price: "2450 USDT",
      collateral: "232 USDT",
      settlement: "3 Days",
      duration: "2 days 20h 21min",
      etherscan: "sss",
    },
    {
      user: "0xeec9...82f8",
      price: "2450 USDT",
      collateral: "232 USDT",
      settlement: "3 Days",
      duration: "2 days 20h 21min",
      etherscan: "sss",
    },
    {
      user: "0xeec9...82f8",
      price: "2450 USDT",
      collateral: "232 USDT",
      settlement: "3 Days",
      duration: "2 days 20h 21min",
      etherscan: "sss",
    },
  ]);

  const [blockingHistoryData, setBlockingHistoryData] = useState<any>([
    { user: "0xeec9...82f8", price: "2450 USDT", period: "20 DAYS", collateral: "3 %", etherscan: "sss" },
    { user: "0xeec9...82f8", price: "2450 USDT", period: "20 DAYS", collateral: "3 %", etherscan: "sss" },
    { user: "0xeec9...82f8", price: "2450 USDT", period: "20 DAYS", collateral: "3 %", etherscan: "sss" },
    { user: "0xeec9...82f8", price: "2450 USDT", period: "20 DAYS", collateral: "3 %", etherscan: "sss" },
    { user: "0xeec9...82f8", price: "2450 USDT", period: "20 DAYS", collateral: "3 %", etherscan: "sss" },
  ]);

  const [rentingOfferData, setRentingOfferData] = useState<any>([
    {
      user: "0xeec9...82f8",
      price: "0.000245 USDT",
      estimated: "232 USDT",
      time: "3 Days",
      etherscan: "sss",
    },
    {
      user: "0xeec9...82f8",
      price: "0.000245 USDT",
      estimated: "232 USDT",
      time: "3 Days",
      etherscan: "sss",
    },
    {
      user: "0xeec9...82f8",
      price: "0.000245 USDT",
      estimated: "232 USDT",
      time: "3 Days",
      etherscan: "sss",
    },
    {
      user: "0xeec9...82f8",
      price: "0.000245 USDT",
      estimated: "232 USDT",
      time: "3 Days",
      etherscan: "sss",
    },
    {
      user: "0xeec9...82f8",
      price: "0.000245 USDT",
      estimated: "232 USDT",
      time: "3 Days",
      etherscan: "sss",
    },
  ]);

  const [rentingHistoryData, setRentingHistoryData] = useState<any>([
    {
      user: "0xeec9...82f8",
      price: "0.000245 USDT",
      estimated: "232 USDT",
      time: "3 Days",
      date: "21.11.2021",
      etherscan: "sss",
    },
    {
      user: "0xeec9...82f8",
      price: "0.000245 USDT",
      estimated: "232 USDT",
      time: "3 Days",
      date: "21.11.2021",
      etherscan: "sss",
    },
    {
      user: "0xeec9...82f8",
      price: "0.000245 USDT",
      estimated: "232 USDT",
      time: "3 Days",
      date: "21.11.2021",
      etherscan: "sss",
    },
    {
      user: "0xeec9...82f8",
      price: "0.000245 USDT",
      estimated: "232 USDT",
      time: "3 Days",
      date: "21.11.2021",
      etherscan: "sss",
    },
    {
      user: "0xeec9...82f8",
      price: "0.000245 USDT",
      estimated: "232 USDT",
      time: "3 Days",
      date: "21.11.2021",
      etherscan: "sss",
    },
  ]);

  const [buyingOfferData, setBuyingOfferData] = useState<any>([
    { user: "0xeec9...82f8", price: "0.000245 USDT", date: "232 USDT", etherscan: "sss" },
    { user: "0xeec9...82f8", price: "0.000245 USDT", date: "232 USDT", etherscan: "sss" },
    { user: "0xeec9...82f8", price: "0.000245 USDT", date: "232 USDT", etherscan: "sss" },
    { user: "0xeec9...82f8", price: "0.000245 USDT", date: "232 USDT", etherscan: "sss" },
    { user: "0xeec9...82f8", price: "0.000245 USDT", date: "232 USDT", etherscan: "sss" },
  ]);

  const [buyingHistoryData, setBuyingHistoryData] = useState<any>([
    {
      user: "0xeec9...82f8",
      price: "0.000245 USDT",
      estimated: "232 USDT",
      time: "3 Days",
      date: "21.11.2021",
      etherscan: "sss",
    },
    {
      user: "0xeec9...82f8",
      price: "0.000245 USDT",
      estimated: "232 USDT",
      time: "3 Days",
      date: "21.11.2021",
      etherscan: "sss",
    },
    {
      user: "0xeec9...82f8",
      price: "0.000245 USDT",
      estimated: "232 USDT",
      time: "3 Days",
      date: "21.11.2021",
      etherscan: "sss",
    },
    {
      user: "0xeec9...82f8",
      price: "0.000245 USDT",
      estimated: "232 USDT",
      time: "3 Days",
      date: "21.11.2021",
      etherscan: "sss",
    },
    {
      user: "0xeec9...82f8",
      price: "0.000245 USDT",
      estimated: "232 USDT",
      time: "3 Days",
      date: "21.11.2021",
      etherscan: "sss",
    },
  ]);

  const [Offershowed, setOfferShowed] = useState<boolean>(false);

  const [openReserveNftModal, setOpenReserveNftModal] = useState<boolean>(false);
  const handleConfirmReserveNft = () => {
    setOpenReserveNftModal(false);
  };
  const [openOrderBookModal, setOpenOrderBookModal] = useState<boolean>(false);
  const handleConfirmOrderBook = () => {
    setOpenOrderBookModal(false);
  };
  const goBack = () => {
    history.push("/reserve/explore");
  };
  return (
    <Box style={{ position: "relative", width: "100%" }}>
      <div className={classes.content}>
        <BackButton purple overrideFunction={goBack} />
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
                      : loanMedia.Url || loanMedia.url || "assets/test/" + img_id + ".png"
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
                <Box className={classes.badge}>Listed</Box>
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
                        style={{ position: "absolute", top: "6px", right: "8px" }}
                      />
                    </SecondaryButton>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start">
                  <Avatar url={require("assets/anonAvatars/ToyFaces_Colored_BG_066.jpg")} size="small" />
                  <Text style={{ margin: "0px 9px" }}>Owned by</Text>
                  <Text style={{ color: "#431AB7" }}>0xeec9...82f8</Text>
                </Box>
                <hr className={classes.divider} />
                <Box display="flex">
                  <Text
                    style={{
                      fontSize: "18px",
                      color: "#1A1B1C",
                      fontWeight: 800,
                      fontFamily: "Agrandir GrandHeavy",
                    }}
                  >
                    Pricing Details
                  </Text>
                </Box>
                <Box display="flex" alignItems="center" my={3.5}>
                  <Text className={classes.pricingText1}>Selling Price:</Text>
                  <Text className={classes.pricingText2}>10ETH</Text>
                  <PrimaryButton size="small" className={classes.pricingButton}>
                    BUY
                  </PrimaryButton>
                </Box>
                <hr className={classes.divider} />
                <Box display="flex" alignItems="center" mb={3.5} mt={2.5}>
                  <Text className={classes.pricingText1}>Blocking Price:</Text>
                  <Text className={classes.pricingText2}>1ETH for 90 Days</Text>
                  <PrimaryButton
                    size="small"
                    className={classes.pricingButton}
                    onClick={() => setOpenReserveNftModal(true)}
                  >
                    BLOCK
                  </PrimaryButton>
                </Box>
                <hr className={classes.divider} />
                <Box display="flex" alignItems="center" my={3.5}>
                  <Text className={classes.pricingText1}>Rental Price:</Text>
                  <Text className={classes.pricingText2}>0.1ETH/day</Text>
                  <PrimaryButton
                    size="small"
                    style={{
                      background: "#fff",
                      color: "#431AB7",
                      padding: "0px 40px",
                      fontSize: "16px",
                      fontWeight: 700,
                      lineHeight: "37px",
                      border: "1px solid #431AB7",
                      height: 37,
                    }}
                  >
                    RENT
                  </PrimaryButton>
                </Box>
                <hr className={classes.divider} />
              </Box>
            </Box>
            <Box width="100%" borderBottom="2px solid rgba(196,196,196,0.4)">
              <div className={classes.subTitleSection}>
                <div
                  className={cls(
                    { [classes.selectedTabSection]: selectedTab === "buying" },
                    classes.tabSection
                  )}
                  onClick={() => setSelectedTab("buying")}
                >
                  <span>BUYING</span>
                </div>
                <div
                  className={cls(
                    { [classes.selectedTabSection]: selectedTab === "renting" },
                    classes.tabSection
                  )}
                  onClick={() => setSelectedTab("renting")}
                >
                  <span>RENTING</span>
                </div>
                <div
                  className={cls(
                    { [classes.selectedTabSection]: selectedTab === "blocking" },
                    classes.tabSection
                  )}
                  onClick={() => setSelectedTab("blocking")}
                >
                  <span>BLOCKING</span>
                </div>
              </div>
              {selectedTab === "buying" && (
                <BuyingTabSection offerData={buyingOfferData} historyData={buyingHistoryData} />
              )}
              {selectedTab === "blocking" && (
                <BlockingTabSection offerData={blockingOfferData} historyData={blockingHistoryData} />
              )}
              {selectedTab === "renting" && (
                <RentingTabSection offerData={rentingOfferData} historyData={rentingHistoryData} />
              )}
            </Box>
            <BlockNFTModal
              open={openReserveNftModal}
              handleClose={() => setOpenReserveNftModal(false)}
              onConfirm={handleConfirmReserveNft}
              img_url={img_id}
            />
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

export default React.memo(ExploreReserveDetailPage);

export const TagIcon = () => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.44909 0.385568C8.89266 0.385568 8.35807 0.607052 7.96568 1.00216L1.45919 7.50446C0.746866 8.21538 0.347656 9.17928 0.347656 10.1855C0.347656 11.1918 0.746866 12.1556 1.45919 12.8666L8.16798 19.5754C8.8789 20.2877 9.8428 20.6869 10.8491 20.6869C11.8553 20.6869 12.8192 20.2877 13.5301 19.5754L20.0324 13.0689C20.4275 12.6765 20.649 12.142 20.649 11.5855V3.1855C20.649 2.44311 20.3537 1.73083 19.8287 1.20583C19.3037 0.680828 18.5914 0.385498 17.849 0.385498L9.44909 0.385568ZM18.5491 3.18557V11.5856L12.0468 18.0879C11.3864 18.7482 10.3159 18.7482 9.65559 18.0879L2.94679 11.3833C2.28645 10.7229 2.28645 9.65241 2.94679 8.99207L9.44909 2.48557H17.8491C18.035 2.48557 18.2128 2.5594 18.344 2.69065C18.4753 2.8219 18.5491 2.99963 18.5491 3.18558L18.5491 3.18557Z"
      fill="#431AB7"
    />
  </svg>
);

export const HistoryIcon = () => (
  <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.2951 3.44995C10.3159 3.44995 6.85257 5.71978 5.18729 9.03659L4.82564 8.38943C4.60675 7.98495 4.17967 7.7387 3.72166 7.75176C3.29099 7.76128 2.89724 7.99683 2.68668 8.37158C2.47611 8.74751 2.47849 9.20552 2.69382 9.57905L4.36883 12.5674C4.68648 13.1408 5.40143 13.3597 5.98675 13.0623L8.96559 11.5396C9.26657 11.4004 9.49855 11.1458 9.60801 10.8329C9.71746 10.5189 9.69366 10.1751 9.54377 9.87885C9.39268 9.58382 9.12858 9.36136 8.81096 9.26619C8.49332 9.16983 8.1507 9.20671 7.86163 9.36969L7.76645 9.41727C9.13455 7.29972 11.5377 5.88634 14.2954 5.88634C18.5889 5.88634 22.0327 9.28997 22.0327 13.5C22.0327 17.6757 18.6434 21.0589 14.4001 21.1138C14.0765 21.1185 13.7684 21.2518 13.5436 21.4837C13.3187 21.7157 13.195 22.0274 13.1998 22.351C13.2057 22.6734 13.339 22.9815 13.571 23.2063C13.8029 23.4312 14.1146 23.5549 14.4382 23.5501C19.97 23.4788 24.4694 18.9999 24.4694 13.5C24.4694 7.95514 19.8881 3.44995 14.2957 3.44995L14.2951 3.44995ZM14.3998 7.3902C14.0762 7.39496 13.7681 7.5282 13.5433 7.76017C13.3184 7.99215 13.1947 8.30385 13.2006 8.62743V13.5002C13.1995 13.8702 13.3684 14.2199 13.6575 14.4519L16.703 16.8883C17.2276 17.3082 17.9949 17.2226 18.416 16.698C18.836 16.1721 18.7503 15.4048 18.2257 14.9849L15.637 12.9101V8.62758C15.6418 8.29806 15.5133 7.97923 15.2801 7.74607C15.047 7.5129 14.7293 7.38442 14.3998 7.39035V7.3902Z"
      fill="#431AB7"
    />
  </svg>
);
