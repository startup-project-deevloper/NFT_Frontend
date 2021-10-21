import * as React from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { formatNumber } from "shared/functions/commonFunctions";
import { RootState } from "store/reducers/Reducer";
import {
  Avatar,
  FontSize,
  Header4,
  PrimaryButton,
  SecondaryButton,
  StyledDivider,
  Text,
} from "shared/ui-kit";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import Box from "shared/ui-kit/Box";
import { getBidHistory } from "shared/services/API";

import { useStyles } from "./index.styles";
import { useMediaQuery } from "@material-ui/core";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";

export const OfferTable = ({ offers, token }) => {
  const classes = useStyles();
  const usersList = useSelector((state: RootState) => state.usersInfoList);
  const getUserInfo = (address: string) => usersList.find(u => u.address === address);

  const tableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "FROM",
    },
    {
      headerName: "PRICE",
    },
    {
      headerName: "DATE",
    },
    {
      headerName: "TIME",
    },
  ];
  const [tableData, setTableData] = React.useState<Array<Array<CustomTableCellInfo>>>([]);
  React.useEffect(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (offers && offers.length) {
      data = offers.slice(0, 5).map(row => {
        const user = getUserInfo(row.bidderAddress);
        return [
          {
            cell: (
              <Box display="flex" flexDirection="row" alignItems="center">
                <Avatar size="medium" url={user?.ipfsImage ? user?.ipfsImage: getDefaultAvatar()} />
                <Text ml={1.5}>{user?.name}</Text>
              </Box>
            ),
          },
          {
            cell: token + " " + (row.price ? Math.floor(row.price * 10000)/10000 : 0),
          },
          {
            cell: format(new Date(row.date), "MMMM dd, yyyy"),
          },
          {
            cell: format(new Date(row.date), "p"),
          },
        ];
      });
    }
    setTableData(data);
  }, [offers]);

  return (
    <div className={classes.table}>
      <CustomTable headers={tableHeaders} rows={tableData} placeholderText="No auctions" />
    </div>
  );
};

const AuctionInfo = ({ media, makeOffer }) => {
  const user = useSelector((state: RootState) => state.user);
  const classes = useStyles();
  const [auctionEnded, setAuctionEnded] = React.useState<boolean>(false);
  const { convertTokenToUSD } = useTokenConversion();
  const [timeFrame, setTimeFrame] = React.useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });
  const [bidHistory, setBidHistory] = React.useState<any[]>([]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!media || !media.Auctions) return null;
      const currentDate = new Date().getTime() / 1000;
      const diff = media.Auctions.EndTime >= currentDate ? media.Auctions.EndTime - currentDate : 0;
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

  const auctions = media.Auctions;

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

  const loadData = () => {
    if (media?.MediaSymbol) {
      getBidHistory(media.MediaSymbol, media.Type).then(resp => {
        if (resp?.success) {
          let data = resp.data;
          data = data.filter((obj) => obj.bidderAddress);
          setBidHistory(data);
        }
      })
    }
  }

  React.useEffect(() => {
    loadData();
  }, [media.MediaSymbol]);

  const isTableScreen = useMediaQuery("(max-width:768px)");

  return (
    <div style={{ minHeight: 400 }}>
      <Box display="flex" flexDirection={isTableScreen ? "column" : "row"} justifyContent="space-between" flexWrap="wrap" gridRowGap={24} gridColumnGap={24}>
        <Box display="flex" flexDirection="column" mb={isTableScreen ? 2 : 0}>
          <Text mb={1}>🤑 Initial price</Text>
          <Header4 noMargin>{`${formatNumber(auctions.ReservePrice ?? 0, auctions.TokenSymbol, 4)}`}</Header4>
          <Text mt={1} size={FontSize.S}>
            {formatNumber(convertTokenToUSD(auctions.TokenSymbol, auctions.ReservePrice || 0), "USD", 4)}
          </Text>
        </Box>
        <Box display="flex" flexDirection="column" mb={isTableScreen ? 2 : 0}>
          <Text mb={1}>🔥 Top bid</Text>
          <Header4 noMargin>{`${formatNumber(auctions?.TopBidInfo?.Amount ?? 0, auctions.TokenSymbol, 4)}`}</Header4>
          <Text mt={1} size={FontSize.S}>
            {formatNumber(convertTokenToUSD(auctions.TokenSymbol, auctions?.TopBidInfo?.Amount ?? 0), "USD", 4)}
          </Text>
        </Box>
        <Box display="flex" flexDirection="column">
          <Text mb={1}>⏳ {!auctionEnded ? "Auction Ending In" : "Auction Ended"}</Text>
          {!auctionEnded && (
            <Header4 noMargin>{`${String(timeFrame.days).padStart(2, "0")}d ${String(
              timeFrame.hours
            ).padStart(2, "0")}h ${String(timeFrame.mins).padStart(2, "0")}m ${String(
              timeFrame.secs
            ).padStart(2, "0")}s`}</Header4>
          )}
        </Box>
      </Box>
      <StyledDivider type="dashed" margin={3} />
      <Box display="flex" flexDirection="row" alignItems="center">
        <img
          src={require(`assets/tokenImages/${auctions.TokenSymbol}.png`)}
          width={18}
          height={18}
          alt="token"
        />
        <Text ml={1.5}>
          Bidding token is <b>{auctions.TokenSymbol}</b>
        </Text>
      </Box>
      <StyledDivider type="dashed" margin={3} />
      <Box display="flex" flexDirection={isTableScreen ? "column" : "row"} alignItems={isTableScreen ? "flex-start":"center"} justifyContent="space-between" gridColumnGap={12} gridRowGap={8} flexWrap="wrap">
        <Box display="flex" flexDirection="row" alignItems="center" marginBottom={isTableScreen ? 2 : 0}>
          <img src={require("assets/icons/calendar_icon.png")} />
          <Text ml={1}>
            Started <b>{getDateDiff(auctions.StartTime)} ago</b> (
            {format(new Date(auctions.StartTime * 1000), "PPpp")})
          </Text>
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center">
          <img src={require("assets/icons/clock_gray.png")} />
          {auctionEnded ? (
            <Text ml={1}>Ended already</Text>
          ) : (
            <Text ml={1}>
              Ends in <b>{getDateDiff(auctions.EndTime)}</b> (
              {format(new Date(auctions.EndTime * 1000), "PPpp")})
            </Text>
          )}
        </Box>
      </Box>
      <StyledDivider type="solid" margin={3} />
      <Text size={FontSize.XL}>{`👋 Total offers: ${bidHistory.length}`}</Text>
      <OfferTable offers={bidHistory} token={auctions.TokenSymbol} />
      <Box mt={3} display="flex" flexDirection="row" justifyContent="space-between">
        <SecondaryButton size="medium" className={classes.transparentBtn}>
          Cancel
        </SecondaryButton>
        {media.Auctions.Owner !== user.address && (
          <PrimaryButton size="medium" className={classes.primaryBtn} onClick={makeOffer} style={{background: "#431AB7"}}>
            Make offer
          </PrimaryButton>
        )}
      </Box>
    </div>
  );
};

export default AuctionInfo;
