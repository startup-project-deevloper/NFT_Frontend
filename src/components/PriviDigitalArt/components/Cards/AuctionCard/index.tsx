import React, { useState, useEffect } from "react";
import Box from "shared/ui-kit/Box";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import { AuctionCardStyles } from "./index.styles";
import { PrimaryButton } from "shared/ui-kit";
import { getDuration } from "shared/helpers";
import Moment from "react-moment";

export default function AuctionCard({ nft, price, onClick, onStartAuction }) {
  const { NftId: name, MediaName, image, auctionData } = nft;
  const classes = AuctionCardStyles({ isLive: auctionData ? true : false });

  const [isEnded, setIsEnded] = useState<any>(false);
  const [endingTime, setEndingTime] = useState<any>();

  useEffect(() => {
    if (!auctionData) return;

    const timerId = setInterval(() => {
      const now = new Date();
      let delta = Math.floor((auctionData.endAt - now.getTime()) / 1000);
      if (delta < 0) {
        setEndingTime({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        setIsEnded(true);

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
  }, [auctionData]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      onClick={() => {
        auctionData ? onClick() : null;
      }}
    >
      <div className={classes.card}>
        <div className={classes.innerBox}>
          <Box display="flex" justifyContent="space-between" alignItems="baseline" width={1} mb={"10px"}>
            <div className={classes.ntfName}>{name}</div>
            <div className={classes.verifiedSection}>
              {!auctionData
                ? "Auction not started"
                : auctionData.endAt < Date.now()
                ? "Auction Ended"
                : "Live Auction"}
            </div>
          </Box>
          <img src={image ? image : require(`assets/backgrounds/digital_art_1.png`)} alt={MediaName} />
          <Box display="flex" flexDirection="column" width={"90%"} mt={1}>
            <Box display="flex" justifyItems="center" justifyContent="space-between" mt={"4px"}>
              <div className={classes.typo1}>Reserve Price</div>
              <div className={classes.typo2}>{`${price} JOTs`}</div>
            </Box>
          </Box>
          {auctionData ? (
            isEnded ? (
              "Auction already ended"
            ) : (
              <PrimaryButton size="medium">
                <span>Auction Ending In</span>
                <br />
                {endingTime && (
                  <>
                    {endingTime.days}D&nbsp;{String(endingTime.hours).padStart(2, "0")}H&nbsp;
                    {String(endingTime.minutes).padStart(2, "0")}M&nbsp;
                    {String(endingTime.seconds).padStart(2, "0")}S
                  </>
                )}
              </PrimaryButton>
            )
          ) : (
            <PrimaryButton size="medium" onClick={onStartAuction}>
              Start Auction
            </PrimaryButton>
          )}
          <div className={classes.starGroup}>
            <Box fontSize={7.8} mr={"2px"}>
              🌟{" "}
            </Box>
            <Box fontSize={11.7} mr={"2px"} pt={1}>
              🌟{" "}
            </Box>
            <Box fontSize={7.8}>🌟 </Box>
          </div>
        </div>
      </div>
    </Box>
  );
}
