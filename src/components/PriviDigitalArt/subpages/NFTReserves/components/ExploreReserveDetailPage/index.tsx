import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useMediaQuery } from "@material-ui/core";

import { Avatar, Color, SecondaryButton, Text, PrimaryButton } from "shared/ui-kit";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { exploreOptionDetailPageStyles } from "./index.styles";

import NFTDetailTabSection from "./components/NFTDetailTabSection";
import GeneralDetailSection from "./components/GeneralDetailSection";
import RentedDetailSection from "./components/RentedDetailSection";
import BlockedDetailSection from "./components/BlockedDetailSection";
import BlockedStatusSection from "./components/BlockedStatusSection";
import RegularBlockedDetailSection from "./components/RegularBlockedDetailSection";
import RegularBlockedStatusSection from "./components/RegularBlockedStatusSection";
import ExpiredPayDetailSection from "./components/ExpiredPayDetailSection";

const ExploreReserveDetailPage = () => {
  const classes = exploreOptionDetailPageStyles();
  const { img_id } = useParams();

  // todo: 
  const isOwnership = true;
  const isRentedNFT = true; // nft.owner == current user && nft.isRent == true
  const isBlockedNFT = true; // nft.owner == current user && nft.isBlocked == true
  const isPaidBlocking = false;
  const isUnpaidReserval = false;
  const isExpired = false;
  const isExpiredPaySuccess = true;

  const history = useHistory();
  const isMobileScreen = useMediaQuery("(max-width:400px)");
  const isTableScreen = useMediaQuery("(max-width:550px)");

  const [loan, setLoan] = useState<any>(true);
  const [loanMedia, setLoanMedia] = useState<any>(true);
  const [loadingLoan, setLoadingLoan] = useState<boolean>(false); 

  const [imageIPFS, setImageIPFS] = useState({});

  const goBack = () => {
    history.push("/reserve/explore");
  };

  const handleClaimPayment = () => {

  }

  const handleClaimCollateral = () => {
    
  }

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
                <Box
                  className={classes.badge}
                  style={{ backgroundColor: isRentedNFT ? '#8D65FF' : '#1FC88B'}}
                >
                  {isRentedNFT ? 'RENTED' : 'Listed'}
                </Box>
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
                {
                  isOwnership ? (
                    isRentedNFT ? (
                      <RentedDetailSection />
                    ) : isBlockedNFT ? (
                      <BlockedDetailSection isPaidBlocking={isPaidBlocking} isUnpaidReserval={isUnpaidReserval}/>
                    ) : (
                      <GeneralDetailSection isOwnership={isOwnership} img_id={img_id} />
                    )
                  ) : (
                    isBlockedNFT ? (
                      <RegularBlockedDetailSection />
                    ) : isExpired ? (
                      <ExpiredPayDetailSection isSuccess={isExpiredPaySuccess} />
                    ) : (
                      <GeneralDetailSection isOwnership={isOwnership} img_id={img_id} />
                    )
                  )
                }
                {
                  isPaidBlocking && (
                    <PrimaryButton
                      size="medium"
                      style={{
                        width: '100%',
                        height: 52,
                        backgroundColor: "#431AB7",
                        marginTop: 14
                      }}
                      onClick={handleClaimPayment}
                    >
                      CLAIM PAYMENT
                    </PrimaryButton>
                  )
                }
                {
                  isUnpaidReserval && (
                    <PrimaryButton
                      size="medium"
                      style={{
                        width: '100%',
                        height: 52,
                        backgroundColor: "#431AB7",
                        marginTop: 14,
                        textTransform: 'uppercase'
                      }}
                      onClick={handleClaimCollateral}
                    >
                      claim Collateral & nft back
                    </PrimaryButton>
                  )
                }
              </Box>
            </Box>
            {
              isOwnership ? (
                isRentedNFT || isBlockedNFT && isPaidBlocking || isBlockedNFT && isUnpaidReserval ? (
                  null
                ) : isBlockedNFT ? (
                  <BlockedStatusSection />
                ) : (
                  <NFTDetailTabSection isOwnership={isOwnership} />
                )
              ) : (
                isBlockedNFT ? (
                  <RegularBlockedStatusSection />
                ) :  (
                  <NFTDetailTabSection isOwnership={isOwnership} />
                )
              )
            }
          </LoadingWrapper>
        ) : (
          <LoadingWrapper loading={true} theme={"blue"} height="calc(100vh - 100px)" />
        )}
      </div>
    </Box>
  );
};

export default React.memo(ExploreReserveDetailPage);
