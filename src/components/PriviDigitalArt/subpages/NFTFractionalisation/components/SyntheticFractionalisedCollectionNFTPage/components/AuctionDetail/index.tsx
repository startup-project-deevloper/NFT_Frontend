import React, { useEffect, useState } from "react";
import Box from "shared/ui-kit/Box";
import Moment from "react-moment";

import { AuctionDetailStyles, CalenderIcon, ClockIcon } from "./index.styles";
import { BlockchainNets } from "shared/constants/constants";
import { useWeb3React } from "@web3-react/core";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { switchNetwork } from "shared/functions/metamask";
import Web3 from "web3";
import { PrimaryButton } from "shared/ui-kit";
import { endSyntheticNFTAuction } from "shared/services/API/SyntheticFractionalizeAPI";
import TransactionResultModal from "components/PriviDigitalArt/modals/TransactionResultModal";
import { RootState } from "store/reducers/Reducer";
import { useSelector } from "react-redux";

export default ({ nft, handleRefresh }) => {
  const classes = AuctionDetailStyles();

  const [isEnded, setIsEnded] = useState<any>(false);
  const [endingTime, setEndingTime] = useState<any>();

  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();

  const [result, setResult] = React.useState<number>(0);
  const [hash, setHash] = useState<string>("");

  const userSelector = useSelector((state: RootState) => state.user);

  const [openClaim, setOpenClaim] = useState<boolean>(false);

  useEffect(() => {
    if (!nft.auctionData) return;

    const timerId = setInterval(() => {
      const now = new Date();
      let delta = Math.floor((nft.auctionData.endAt - now.getTime()) / 1000);
      if (delta < 0) {
        setEndingTime({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        setIsEnded(true);

        if (!nft.auctionData.isAuctionEnded) {
          if (nft.auctionData?.topBidInfo?.bidderInfo.id === userSelector.id) {
            setOpenClaim(true);
          }
        }
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
        setEndingTime({
          days,
          hours,
          minutes,
          seconds,
        });
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [nft.auctionData]);

  const handleEndAuction = async () => {
    try {
      const targetChain = BlockchainNets[1];

      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0);
        if (!isHere) {
          showAlertMessage(`Got failed while switching over to polygon network`, { variant: "error" });
          return;
        }
      }

      const web3APIHandler = targetChain.apiHandler;
      const web3 = new Web3(library.provider);

      const contractResponse = await web3APIHandler.SyntheticNFTAuction.endAuction(
        web3,
        account!,
        nft.auctionData.auctionAddress,
        {
          setHash: setHash,
        }
      );

      if (contractResponse.success) {
        setResult(1);
        await endSyntheticNFTAuction({
          collectionId: nft.collection_id,
          syntheticId: nft.SyntheticID,
        });

        handleRefresh();
      } else {
        setResult(-1);
        showAlertMessage("Failed to end auction", { variant: "error" });
      }
    } catch (e) {
      console.log(e);
      showAlertMessage(`Failed to end auction`, { variant: "error" });
    }
  };

  return (
    <Box className={classes.root} display="flex" flexDirection="column">
      <p>Auction Details</p>
      <Box display="flex" mt="2px" justifyContent="space-between" className={classes.boxWithBorder}>
        <Box display="flex" flexDirection="column" className={classes.boxInfo}>
          <span className={classes.typo1}>🔥 Top bid</span>
          <span className={classes.typo2}>
            {nft.auctionData?.topBidInfo?.bidAmount || nft.auctionData?.buyoutPrice || 0} {nft.JotSymbol}s
          </span>
          <span className={classes.typo3}>
            ${(nft.auctionData?.topBidInfo?.bidAmount || nft.auctionData?.buyoutPrice || 0) * +nft.Price}
          </span>
        </Box>
        {endingTime &&
          (nft.auctionData.isAuctionEnded && isEnded ? (
            <span className={classes.typo2}>Auction Ended</span>
          ) : !nft.auctionData.isAuctionEnded && isEnded ? (
            <Box display="flex" flexDirection="column" alignItems="end">
              <div className={classes.typo2}>Auction Time Ended</div>
              {nft.auctionData.topBidInfo?.bidderInfo.id === userSelector.id && (
                <PrimaryButton size="medium" onClick={() => handleEndAuction()}>
                  Claim
                </PrimaryButton>
              )}
            </Box>
          ) : (
            <Box display="flex" flexDirection="column">
              <span className={classes.typo1}>⏳ Auction Ending In</span>
              <div className={classes.endingTime}>
                <span className={classes.typo2}>{endingTime.days}</span>
                <span className={classes.typo3}>D</span>
                <span className={classes.typo2}>{String(endingTime.hours).padStart(2, "0")}</span>
                <span className={classes.typo3}>H</span>
                <span className={classes.typo2}>{String(endingTime.minutes).padStart(2, "0")}</span>
                <span className={classes.typo3}>M</span>
                <span className={classes.typo2}>{String(endingTime.seconds).padStart(2, "0")}</span>
                <span className={classes.typo3}>S</span>
              </div>
            </Box>
          ))}
      </Box>
      <Box display="flex" className={classes.boxWithBorder}>
        <Box display="flex" alignItems="center">
          <div className={classes.blueCircle} />
          <span className={classes.bidToken}>Bidding token is {nft.JotSymbol}</span>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" className={classes.bottom}>
        <Box display="flex">
          <CalenderIcon />
          <span>
            Started <Moment fromNow>{nft.auctionData.createdAt}</Moment> (
            <Moment format="ddd, DD MMM-h:mm A">{nft.auctionData.createdAt}</Moment>)
          </span>
        </Box>
        <Box display="flex">
          <ClockIcon />
          <span>
            Ends <Moment to={nft.auctionData.endAt}>{Date.now()}</Moment> (
            <Moment format="ddd, DD MMM-h:mm A">{nft.auctionData.endAt}</Moment>)
          </span>
        </Box>
      </Box>

      <TransactionResultModal
        open={result !== 0}
        onClose={() => setResult(0)}
        isSuccess={result === 1}
        hash={hash}
      />
    </Box>
  );
};
