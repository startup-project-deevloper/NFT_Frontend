import React, { useEffect, useState } from "react";
import Box from "shared/ui-kit/Box";
import Moment from "react-moment";

import { AuctionDetailStyles, CalenderIcon, ClockIcon } from "./index.styles";

export default ({ nft }) => {
  const classes = AuctionDetailStyles();

  const [endingTime, setEndingTime] = useState<any>();

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
        {endingTime && (
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
        )}
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
            Ends <Moment toNow>{nft.auctionData.endAt}</Moment> (
            <Moment format="ddd, DD MMM-h:mm A">{nft.auctionData.endAt}</Moment>)
          </span>
        </Box>
      </Box>
    </Box>
  );
};
