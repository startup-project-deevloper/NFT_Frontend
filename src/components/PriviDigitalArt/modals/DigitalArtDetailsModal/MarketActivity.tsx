import React, { useEffect, useState } from "react";

import { Text } from "shared/ui-kit";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { getAuctionBidHistory, getAuctionTransactions, getExchangeTransactions } from "shared/services/API";

import { useStyles } from "./index.styles";

const MarketActivity = ({ media }) => {
  const classes = useStyles();
  const tableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "Event",
    },
    {
      headerName: "Token",
    },
    {
      headerName: "Price",
    },
    {
      headerName: "From",
    },
    {
      headerName: "To",
    },
    {
      headerName: "Date",
    },
  ];
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);
  const [transactionHistory, setTransactionHistory] = useState<any>([]);

  useEffect(() => {
    if (media?.auction)
      getAuctionBidHistory({
        id: media.auction.id,
        type: "PIX",
      }).then(resp => {
        console.log(resp);
        if (resp?.success) setTransactionHistory(resp.data);
      });
    else if (media?.exchange)
      getExchangeTransactions(media.ExchangeData.Id).then(resp => {
        if (resp?.success) setTransactionHistory(resp.data);
      });
  }, [media]);

  useEffect(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (transactionHistory && transactionHistory.length) {
      data = transactionHistory.map(info => {
        return [
          {
            cell: <Text>{info.Type ? info.Type.substring(0, 8) + "..." : "-"}</Text>,
          },
          {
            cell: (
              <img
                src={require(`assets/tokenImages/${
                  media.auction
                    ? media.auction.bidTokenSymbol
                    : media.exchange
                    ? media.exchange.offerToken
                    : "USDT"
                }.png`)}
                width={24}
                height={24}
              />
            ),
          },
          {
            cell: info.price,
          },
          {
            cell: info.From ? info.From.substring(0, 8) + "..." : "-",
          },
          {
            cell: info.To ? info.To.substring(0, 8) + "..." : "-",
          },
          {
            cell: info.date,
          },
        ];
      });
    }

    setTableData(data);
  }, [transactionHistory]);

  return (
    <div className={classes.table}>
      <CustomTable headers={tableHeaders} rows={tableData} placeholderText="No offers" />
    </div>
  );
};

export default MarketActivity;
