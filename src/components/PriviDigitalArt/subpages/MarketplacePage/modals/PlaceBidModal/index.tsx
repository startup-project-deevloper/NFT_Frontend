import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { PrimaryButton, SecondaryButton, Modal, grid, Divider, Header3 } from "shared/ui-kit";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { formatNumber } from "shared/functions/commonFunctions";
import { placeBidModalStyles } from "./index.styles";
import { useMediaQuery } from "@material-ui/core";

type PlaceBidModalProps = {
  isOpen: boolean;
  onClose: () => void;
  placeBid: (price: number) => void;
  viewDetails: () => void;
  media?: any;
  disableBidBtn?: boolean;
};

export const PlaceBidModal: React.FunctionComponent<PlaceBidModalProps> = ({
  isOpen,
  onClose,
  placeBid,
  viewDetails,
  media,
  disableBidBtn = false,
}) => {
  const classes = placeBidModalStyles();

  const [auction, setAuction] = useState<any>({});
  const [price, setPrice] = useState<string>("");
  const [auctionEnded, setAuctionEnded] = useState<boolean>(false);
  const { convertTokenToUSD } = useTokenConversion();
  const [timeFrame, setTimeFrame] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });

  const handleChangePrice = event => {
    setPrice(event.target.value);
  };

  useEffect(() => {
    const initPrice = Math.max(media.auction.reservePrice ?? 0).toString();
    setPrice(initPrice);

    const interval = setInterval(() => {
      if (!media || !media.auction) return null;

      setAuction(media.auction);

      const currentDate = new Date().getTime() / 1000;
      const diff = media.auction.endTime >= currentDate ? media.auction.endTime - currentDate : 0;
      setTimeFrame({
        days: Math.floor(diff / 86400),
        hours: Math.floor((diff % 86400) / 3600),
        mins: Math.floor(((diff % 86400) % 3600) / 60),
        secs: Math.floor(((diff % 86400) % 3600) % 60),
      });
      if (diff === 0) {
        setAuctionEnded(true);
        clearInterval(interval);
      } else {
        setAuctionEnded(false);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [media]);

  const isTableScreen = useMediaQuery("(max-width:768px)");

  return (
    <Modal size="small" isOpen={isOpen} onClose={onClose} showCloseIcon>
      <ModalHeader>
        <div className={classes.title}>Place a Bid</div>
      </ModalHeader>

      <p className={classes.priceLabel}>Price</p>
      <div className={classes.price}>
        <input
          value={price}
          onChange={handleChangePrice}
          className={classes.priceInput}
          type="number"
          placeholder={Math.max(auction.ReservePrice ?? 0).toString()}
        />
        <span>{auction?.bidTokenSymbol}</span>
      </div>
      <p className={classes.hint}>${convertTokenToUSD(auction.bidTokenSymbol, Number(price) ?? 0)}</p>

      <hr className={classes.dividerDashed} />

      <div className={classes.bidStatus}>
        <div className={classes.topBid}>
          <div className={classes.auctionTitle}>
            <span role="img" aria-label="total offers">
              🔥{" "}
            </span>
            Top bid
          </div>
          <span>{`${formatNumber(
            auction.topBidInfo?.price || auction.reservePrice || 0,
            auction.bidTokenSymbol || "USDT",
            4
          )}`}</span>
          <div className={classes.hint}>
            $
            {convertTokenToUSD(
              auction.bidTokenSymbol || "USDT",
              auction.topBidInfo?.price || auction.reservePrice || 0
            )}
          </div>
        </div>
        <div className={classes.auctionEnding}>
          <div className={classes.auctionTitle}>
            <span role="img" aria-label="total offers">
              ⏳
            </span>{" "}
            {!auctionEnded ? "Auction Ending In" : "Auction Ended"}
          </div>
          {!auctionEnded && (
            <div className={classes.auctionDateCount}>
              <div>
                <span>{String(timeFrame.days).padStart(2, "0")}</span>
                <div className={classes.hint}>Days</div>
              </div>
              <div>
                <span>{String(timeFrame.hours).padStart(2, "0")}</span>
                <div className={classes.hint}>Hours</div>
              </div>
              <div>
                <span>{String(timeFrame.mins).padStart(2, "0")}</span>
                <div className={classes.hint}>Minutes</div>
              </div>
              <div>
                <span>{String(timeFrame.secs).padStart(2, "0")}</span>
                <div className={classes.hint}>Seconds</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Divider />
      <div className={classes.actions} style={{ flexDirection: isTableScreen ? "column" : "row" }}>
        <SecondaryButton size="medium" className={classes.secondary} onClick={viewDetails}>
          View More Details
        </SecondaryButton>
        <PrimaryButton
          disabled={disableBidBtn}
          size="medium"
          className={classes.primary}
          style={{ background: "#431AB7" }}
          onClick={() => placeBid(Number(price || 0))}
        >
          Place A Bid
        </PrimaryButton>
      </div>
    </Modal>
  );
};

const ModalHeader = styled(Header3)`
  margin-bottom: ${grid(3)};
`;
