import axios from "axios";
import { Box, makeStyles } from "@material-ui/core";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import AuctionDetailsModal from "components/PriviDigitalArt/subpages/NFTFractionalisation/modals/AuctionDetailsModal";
import BidFractionModal from "components/PriviDigitalArt/subpages/NFTFractionalisation/modals/BidModal";
import { RedeemFractionsModal } from "components/PriviDigitalArt/subpages/NFTFractionalisation/modals/RedeemFractionsModal";
import React, { useState, useEffect } from "react";
import { getRandomAvatar, getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import { Avatar, Color, FontSize, PrimaryButton, SecondaryButton, Text } from "shared/ui-kit";
import URL from "shared/functions/getURL";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { switchNetwork } from "shared/functions/metamask";
import { BlockchainNets } from "shared/constants/constants";

const AUCTION_STATES = {
  INACTIVE: 0,
  LIVE: 1,
  ENDED: 2,
  REDEEMED: 3,
};

const useAuctionDetailsStyles = makeStyles(theme => ({
  bidBox: {
    borderRadius: theme.spacing(2),
    padding: `${theme.spacing(1)}px ${theme.spacing(4)}px`,
    [theme.breakpoints.down("sm")]: {
      padding: "3px 5px"
    },
    display: "flex",
    alignItems: "center",
    width: "fit-content",
  },
  header2: {
    fontSize: "14px",
    color: "#2D3047",
  },
}));

const buttonStyle = {
  borderColor: "#DDFF57",
  background: "#DDFF57",
  color: "#431AB7",
  fontWeight: 800,
  fontSize: "14px",
  padding: "8px 24px",
  lineHeight: "18px",
};

const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

export default function AuctionDetails({ media }) {
  const classes = useAuctionDetailsStyles();
  const { showAlertMessage } = useAlertMessage();
  const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[0]);

  const [auctionState, setAuctionState] = React.useState<number>(0);
  const [auctionEnded, setAuctionEnded] = React.useState<boolean>(false);
  const [endTime, setEndTime] = useState<any>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [openDetailModal, setOpenDetailModal] = React.useState<boolean>(false);
  const [openPlaceBidModal, setOpenPlaceBidModal] = React.useState<boolean>(false);
  const [openRedeemModal, setOpenRedeemModal] = React.useState<boolean>(false);

  const [topBidder, setTopBidder] = React.useState<any>({});

  const { account, library, chainId } = useWeb3React();

  useEffect(() => {
    if (selectedChain.chainId !== chainId) {
      (async () => {
        const changed = await switchNetwork(selectedChain.chainId);
        if (!changed) {
          setSelectedChain(filteredBlockchainNets.find(b => b.chainId === chainId));
        }
      })();
    }
  }, [chainId, selectedChain]);

  useEffect(() => {
    handleRefresh();
  }, [media, library, selectedChain]);

  useEffect(() => {
    if (media && media?.FractionalizeData?.auctionData) {
      const timerId = setInterval(() => {
        const now = new Date();
        let delta = Math.floor(
          (media?.FractionalizeData?.auctionData?.createdAt - now.getTime()) / 1000 +
            media?.FractionalizeData?.auctionData?.auctionLength
        );
        if (delta < 0) {
          setAuctionEnded(true);
          setEndTime({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          });
          clearInterval(timerId);
        } else {
          let days = Math.floor(delta / 86400);
          delta -= days * 86400;

          // calculate (and subtract) whole hours
          let hours = Math.floor(delta / 3600) % 24;
          delta -= hours * 3600;

          // calculate (and subtract) whole minutes
          let minutes = Math.floor(delta / 60) % 60;
          delta -= minutes * 60;

          // what's left is seconds
          let seconds = delta % 60;
          setAuctionEnded(false);
          setEndTime({
            days,
            hours,
            minutes,
            seconds,
          });
        }
      }, 1000);

      return () => clearInterval(timerId);
    } else return;
  }, [media]);

  const handleOpenDetailModal = React.useCallback(() => {
    setOpenDetailModal(true);
  }, [setOpenDetailModal]);

  const handleCloseDetailModal = React.useCallback(() => {
    setOpenDetailModal(false);
  }, [setOpenDetailModal]);

  const handleOpenPlaceBidModal = React.useCallback(() => {
    setOpenPlaceBidModal(true);
  }, [setOpenPlaceBidModal]);

  const handleClosePlaceBidModal = React.useCallback(() => {
    setOpenPlaceBidModal(false);
  }, [setOpenPlaceBidModal]);

  const handleOpenRedeemModal = React.useCallback(() => {
    setOpenRedeemModal(true);
  }, [setOpenRedeemModal]);

  const handleCloseRedeemModal = React.useCallback(() => {
    setOpenRedeemModal(false);
  }, [setOpenRedeemModal]);

  const handleWithdraw = async () => {
    if (!media?.FractionalizeData?.erc20VaultTokenAddress) {
      return;
    }

    const web3 = new Web3(library.provider);
    const contractAddress = media?.FractionalizeData?.erc20VaultTokenAddress;

    const contractResponse = await selectedChain.apiHandler.TokenVault.redeem(
      web3,
      account!,
      contractAddress
    );
    if (contractResponse.success) {
      showAlertMessage("Withdraw successfully", { variant: "success" });
      handleRefresh();
    }
  };

  const handleEnd = async () => {
    if (!media?.FractionalizeData?.erc20VaultTokenAddress) {
      return;
    }

    const web3 = new Web3(library.provider);
    const contractAddress = media?.FractionalizeData?.erc20VaultTokenAddress;

    const contractResponse = await selectedChain.apiHandler.TokenVault.endAuction(
      web3,
      account!,
      contractAddress
    );
    if (contractResponse.success) {
      showAlertMessage("Auction ended successfully", { variant: "success" });
      handleRefresh();
    }
  };

  const handleRefresh = async () => {
    const web3 = new Web3(library.provider);
    const contractAddress = media?.FractionalizeData?.erc20VaultTokenAddress;

    const state = await selectedChain.apiHandler.TokenVault.auctionState(web3, account!, contractAddress);
    console.log(state);
    setAuctionState(parseInt(state));
  };

  const auctionData = React.useMemo(() => {
    return media?.FractionalizeData?.auctionData;
  }, [media]);

  // top bidder data
  useEffect(() => {
    if (auctionData.topBidInfo.bidderAddress) {
      axios
        .get(`${URL()}/user/getBasicUserInfo/${auctionData.topBidInfo.bidderAddress}`)
        .then(response => {
          const resp = response.data;
          if (resp?.success) {
            const data = resp.data;
            setTopBidder({
              ...data,
              name: data.name ?? `${data.firstName} ${data.lastName}`,
            });
          } else {
            setTopBidder({
              imageUrl: getRandomAvatarForUserIdWithMemoization(auctionData.topBidInfo.bidderAddress),
              name: "User name",
              urlSlug: "",
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [auctionData.topBidInfo?.bidderAddress]);
  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flex-end"
        bgcolor={!auctionEnded ? Color.GreenLight : Color.White}
        border={!auctionEnded ? "none" : "1px solid #431AB7"}
        borderRadius={8}
        px={2}
        py={1}
      >
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <Text color={Color.Purple} mb={0.5}>
            {!auctionEnded ? "Auction Ending In" : "Auction Ended"}
          </Text>
          {!auctionEnded ? (
            <Text color={Color.Purple} size={FontSize.XL} bold>
              {`${endTime.days ? `${String(endTime.days).padStart(2, "0")}d` : ""} ${String(
                endTime.hours
              ).padStart(2, "0")}h ${String(endTime.minutes).padStart(2, "0")}m ${String(
                endTime.seconds
              ).padStart(2, "0")}s`}
            </Text>
          ) : (
            <>
              {auctionState === AUCTION_STATES.LIVE &&
                (account === media?.FractionalizeData?.ownerAddress ? (
                  <PrimaryButton size="medium" style={buttonStyle} onClick={handleEnd}>
                    End
                  </PrimaryButton>
                ) : (
                  <Text color={Color.Purple}>Please wait until the creator ends the auction.</Text>
                ))}
              {auctionState === AUCTION_STATES.INACTIVE && (
                <PrimaryButton size="medium" style={buttonStyle} onClick={handleWithdraw}>
                  Withdraw NFT
                </PrimaryButton>
              )}
            </>
          )}
        </Box>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mt={2} mb={2}>
        <Box className={classes.bidBox} style={{ background: "#9EACF2" }} width={1} mr={1}>
          <Avatar
            size="medium"
            url={
              topBidder?.imageUrl || topBidder?.anonAvatar
                ? require(`assets/anonAvatars/${topBidder?.anonAvatar}`)
                : getRandomAvatar()
            }
          />
          <Box ml={2}>
            <Box className={classes.header2} style={{ color: "#431AB7" }}>
              Top Bid Placed By
            </Box>
            <Box className={classes.header2} style={{ color: "white" }} mt={0.5}>
              {topBidder?.name ?? "User name"}
            </Box>
          </Box>
        </Box>
        {!auctionData.ReplacedBidInfo && (
          <Box className={classes.bidBox} style={{ border: "1px solid #9EACF2" }} width={1} ml={1}>
            <Avatar
              size="medium"
              url={
                auctionData.ReplacedBidInfo?.imageUrl || auctionData.ReplacedBidInfo?.anonAvatar
                  ? require(`assets/anonAvatars/${auctionData.ReplacedBidInfo?.anonAvatar}`)
                  : getRandomAvatar()
              }
            />
            <Box ml={2}>
              <Box className={classes.header2} style={{ color: "#431AB7" }}>
                Displaced Bidder
              </Box>
              <Box className={classes.header2} style={{ color: "#9EACF2" }} mt={0.5}>
                {auctionData.ReplacedBidInfo?.name ?? "User name"}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <SecondaryButton
          size="medium"
          onClick={handleOpenDetailModal}
          style={{
            fontWeight: 800,
            fontSize: "14px",
            padding: "8px 24px",
            lineHeight: "18px",
          }}
        >
          View More Details
        </SecondaryButton>
        {auctionEnded ? (
          auctionState !== AUCTION_STATES.LIVE && (
            <PrimaryButton size="medium" style={buttonStyle} onClick={handleOpenRedeemModal}>
              Redeem Fractions
            </PrimaryButton>
          )
        ) : (
          <PrimaryButton size="medium" style={buttonStyle} onClick={handleOpenPlaceBidModal}>
            Place a Bid
          </PrimaryButton>
        )}
      </Box>
      {openDetailModal && (
        <AuctionDetailsModal
          media={media}
          open={openDetailModal}
          onClose={handleCloseDetailModal}
          openPlaceBid={handleOpenPlaceBidModal}
        />
      )}
      {openRedeemModal && (
        <RedeemFractionsModal
          open={openRedeemModal}
          handleClose={handleCloseRedeemModal}
          media={media}
          selectedChain={selectedChain}
          handleRefresh={handleRefresh}
        />
      )}
      {openPlaceBidModal && (
        <BidFractionModal
          open={openPlaceBidModal}
          onClose={handleClosePlaceBidModal}
          previousBid={media.Auctions?.TopBidInfo?.Amount || 0}
          media={media}
          selectedChain={selectedChain}
          handleRefresh={handleRefresh}
        />
      )}
    </>
  );
}
