import { Box, makeStyles } from "@material-ui/core";
import React from "react";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { formatNumber } from "shared/functions/commonFunctions";
import { FontSize, PrimaryButton, SecondaryButton, StyledDivider, Text, Modal, Color } from "shared/ui-kit";
import { format } from "date-fns";
import { OfferTable } from "components/PriviDigitalArt/modals/DigitalArtDetailsModal/AuctionInfo";
import { getBidHistory } from "shared/services/API/FractionalizeAPI";
import { RootState } from "store/reducers/Reducer";
import { useSelector } from "react-redux";

const useAuctionDetailsModalStyles = makeStyles(theme => ({
  root: {
    width: "738px !important",
    display: "flex",
    flexDirection: "column",
    color: "#707582",
    "& label": {
      color: "#1A1B1C",
      fontSize: "14px",
      lineHeight: "120%",
    },
    "& .MuiInput-root": {
      margin: "8px 0px 0px",
      background: "#FFFFFF",
      borderRadius: "8px",
      height: "40px",
      border: "1px solid #A4A4A4",
      fontFamily: "Agrandir",
    },

    "& .MuiTableCell-head": {
      backgroundColor: "#F7F9FE",
      color: "#181818",
      fontSize: "14px",
      fontWeight: 800,
      lineHeight: "120%",
    },

    "& .MuiTableCell-body": {
      color: "#707582",
      background: "transparent",
      paddingTop: "6px",
      paddingBottom: "6px",
      borderBottom: "1px solid #17171718",
      fontSize: "14px",
      lineHeight: "120%",
    },

    "& > div": {
      minHeight: 0,
    },
  },
  title: {
    fontSize: "22px",
    lineHeight: "104.5%",
    color: "#181818",
    marginBottom: "24px",
  },
  header1: {
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "120%",
    color: "#707582",
  },
  header2: {
    fontFamily: "Agrandir Grand",
    color: "#431AB7",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "20px",
    lineHeight: "104.5%",
  },
}));

export default function AuctionDetailsModal({ media, open, onClose, openPlaceBid }) {
  const user = useSelector((state: RootState) => state.user);
  const classes = useAuctionDetailsModalStyles();
  const { convertTokenToUSD } = useTokenConversion();

  const [auctionEnded, setAuctionEnded] = React.useState<boolean>(false);
  const [endTime, setEndTime] = React.useState<any>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [bidHistory, setBidHistory] = React.useState<any[]>([]);

  React.useEffect(() => {
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

  const loadData = () => {
    if (media?.MediaSymbol) {
      getBidHistory(media.MediaSymbol).then(resp => {
        console.log(resp);
        if (resp?.success) {
          let data = resp.data;
          data = data.filter(obj => obj.bidderAddress);
          setBidHistory(data);
        }
      });
    }
  };

  React.useEffect(() => {
    loadData();
  }, [media.MediaSymbol]);

  const fractionalizeData = media.FractionalizeData;

  const getDateDiff = (time: number) => {
    const currentDate = new Date().getTime() / 1000;
    const diff = currentDate >= time ? currentDate - time : time - currentDate;
    const days = Math.floor(diff / 86400);
    if (days > 0) return `${days} day${days > 1 ? "s" : ""}.`;
    const hours = Math.floor((diff % 86400) / 3600);
    if (hours > 0) return `${hours} hr${hours > 1 ? "s" : ""}.`;
    const mins = Math.floor(((diff % 86400) % 3600) / 60);
    if (mins > 0) return `${mins} min${mins > 1 ? "s" : ""}.`;
    const secs = Math.floor(((diff % 86400) % 3600) % 60);
    if (secs > 0) return `${secs} sec${secs > 1 ? "s" : ""}.`;
    return "Just Now";
  };

  const handleOpenPlaceBidModal = React.useCallback(() => {
    onClose();
    openPlaceBid();
  }, []);

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <div className={classes.title}>Details</div>

      <Box display="flex" justifyContent="space-between" flexWrap="wrap" gridRowGap={24} gridColumnGap={24}>
        <Box display="flex" flexDirection="column">
          <Box className={classes.header1} mb={1}>
            🤑 Reserve Price
          </Box>
          <div className={classes.header2}>{`${formatNumber(
            fractionalizeData.auctionData?.buyoutPrice ?? 0,
            media.MediaSymbol,
            4
          )}`}</div>
          <Text mt={1} size={FontSize.S}>
            {formatNumber(
              convertTokenToUSD(
                fractionalizeData?.listToken,
                fractionalizeData.auctionData?.buyoutPrice || 0
              ),
              "USD",
              4
            )}
          </Text>
        </Box>
        <Box display="flex" flexDirection="column">
          <Box className={classes.header1} mb={1}>
            🔥 Top bid
          </Box>
          <div className={classes.header2}>{`${formatNumber(
            fractionalizeData?.auctionData?.topBidInfo.bidAmount ?? 0,
            fractionalizeData?.listToken,
            4
          )}`}</div>
          <Text mt={1} size={FontSize.S}>
            {formatNumber(
              convertTokenToUSD(
                fractionalizeData?.listToken,
                fractionalizeData?.auctionData?.topBidInfo.bidAmount ?? 0
              ),
              "USD",
              4
            )}
          </Text>
        </Box>
        <Box display="flex" flexDirection="column">
          <Box className={classes.header1} mb={1}>
            ⏳ {!auctionEnded ? "Auction Ending In" : "Auction Ended"}
          </Box>
          {!auctionEnded && (
            <div className={classes.header2}>{`${String(endTime.days).padStart(2, "0")}d ${String(
              endTime.hours
            ).padStart(2, "0")}h ${String(endTime.minutes).padStart(2, "0")}m ${String(
              endTime.seconds
            ).padStart(2, "0")}s`}</div>
          )}
        </Box>
      </Box>

      <Box width="100%">
        <StyledDivider type="dashed" color={Color.Black} margin={3} />
      </Box>

      <Box display="flex" flexDirection="row" alignItems="center">
        <img
          src={
            fractionalizeData?.listToken
              ? require(`assets/tokenImages/${fractionalizeData.listToken}.png`)
              : "none"
          }
          width={18}
          height={18}
          alt="token"
        />
        <Text ml={1.5}>
          Bidding token is <b>{fractionalizeData?.listToken ?? ""}</b>
        </Text>
      </Box>

      <Box width="100%">
        <StyledDivider type="dashed" color={Color.Black} margin={3} />{" "}
      </Box>

      <Box
        display="flex"
        alignItems={"center"}
        justifyContent="space-between"
        gridColumnGap={12}
        gridRowGap={8}
        flexWrap="wrap"
      >
        <Box display="flex" flexDirection="row" alignItems="center">
          <img src={require("assets/icons/calendar_icon.png")} />
          <Text ml={1}>
            Started <b>{getDateDiff(fractionalizeData?.auctionData?.createdAt / 1000 ?? 0)} ago</b> (
            {format(new Date(fractionalizeData?.auctionData?.createdAt ?? 0), "PPpp")})
          </Text>
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center">
          <img src={require("assets/icons/clock_gray.png")} />
          {auctionEnded ? (
            <Text ml={1}>Ended already</Text>
          ) : (
            <Text ml={1}>
              Ends in{" "}
              <b>
                {getDateDiff(
                  (fractionalizeData?.auctionData?.createdAt +
                    fractionalizeData?.auctionData?.auctionLength * 1000) /
                    1000 ?? 0
                )}
              </b>{" "}
              (
              {format(
                new Date(
                  fractionalizeData?.auctionData?.createdAt +
                    fractionalizeData?.auctionData?.auctionLength * 1000 ?? 0
                ),
                "PPpp"
              )}
              )
            </Text>
          )}
        </Box>
      </Box>

      <Box width="100%">
        <StyledDivider type="solid" color={Color.Black} margin={3} />
      </Box>

      <Text size={FontSize.XL}>{`👋 Total offers: ${bidHistory.length}`}</Text>

      <OfferTable offers={bidHistory} token={fractionalizeData?.listToken} />

      <Box mt={6} display="flex" flexDirection="row" justifyContent="space-between">
        <SecondaryButton
          size="medium"
          onClick={onClose}
          style={{
            fontWeight: 800,
            fontSize: "14px",
            padding: "8px 26px",
            lineHeight: "18px",
            width: "fit-content",
          }}
        >
          Cancel
        </SecondaryButton>
        {media.auctions?.Owner !== user.address && (
          <PrimaryButton
            size="medium"
            onClick={handleOpenPlaceBidModal}
            style={{
              borderColor: "#431AB7",
              background: "#431AB7",
              color: "white",
              fontWeight: 800,
              fontSize: "14px",
              padding: "8px 26px",
              lineHeight: "18px",
              width: "fit-content",
            }}
          >
            Place bid
          </PrimaryButton>
        )}
      </Box>
    </Modal>
  );
}
