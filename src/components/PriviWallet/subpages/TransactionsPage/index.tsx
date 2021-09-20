import React, { useState, useEffect } from "react";
import cls from "classnames";

import { Grid } from "@material-ui/core";

import PrintChart from "shared/ui-kit/Chart/Chart";
import { useTypedSelector } from "store/reducers/Reducer";
import TransHistory from "components/PriviWallet/components/TransHistory";
import Box from "shared/ui-kit/Box";
import * as WalletAPIProvider from "shared/services/API/WalletAPI";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { transactionPageStyles } from "./index.styles";
import { MediaEarningsConfig } from "../HomePage/components/ChartsConfig";

const DayLabels: any[] = [
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
];
const WeekLabels: any[] = ["Sun", "Mon", "Tue", "Wen", "Thu", "Fri", "Sat"];
const MonthLabels: any[] = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
];
const YearLabels: any[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const configurer = (config: any, ref: CanvasRenderingContext2D): object => {
  for (let index = 0; index < config.data.datasets.length; index++) {
    let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight);
    gradient.addColorStop(1, `rgba(110, 108, 228, 0.4)`);
    gradient.addColorStop(0.5, `rgba(110, 108, 228, 0)`);
    config.data.datasets[index].backgroundColor = gradient;
  }

  return config;
};

const TransactionsPage = () => {
  const classes = transactionPageStyles();
  const { showAlertMessage } = useAlertMessage();
  const user = useTypedSelector(state => state.user);
  const { convertTokenToUSD } = useTokenConversion();

  const [transactionConfig, setTransactionConfig] = useState<any>();

  const [status, setStatus] = useState<any>("");

  const [totalTxns, setTotalTxns] = useState<number>(0.0);
  const [incoming, setIncoming] = useState<number>(0.0);
  const [outgoing, setOutgoing] = useState<number>(0.0);

  const [selectedTimeFilter, setSelectedTimeFilter] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<any>([]);

  useEffect(() => {
    setLoading(true);
    const fetchTransactions = async () => {
      try {
        const txs = await WalletAPIProvider.getTransactions(user.address);
        setLoading(false);
        setTransactions(txs);

        let outgoingValue = 0;
        let incomingValue = 0;
        let totalTxnsValue = 0;
        if (txs && txs.length > 0) {
          for (let i = 0; i < txs.length; i++) {
            if (txs[i].Amount) {
              if (txs[i].From && txs[i].From === user.address) {
                outgoingValue += convertTokenToUSD(txs[i].Token, parseFloat(txs[i].Amount));
              } else if (txs[i].To && txs[i].To === user.address) {
                incomingValue += convertTokenToUSD(txs[i].Token, parseFloat(txs[i].Amount));
              }
              totalTxnsValue += convertTokenToUSD(txs[i].Token, parseFloat(txs[i].Amount));
            }
          }
          setOutgoing(outgoingValue);
          setIncoming(incomingValue);
          setTotalTxns(totalTxnsValue);
        }
      } catch (e) {
        showAlertMessage(e.message || "Fetching transaction failed", { variant: "error" });
      } finally {
        setLoading(false);
      }
      setLoading(false);
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    const newTransactionConfig = JSON.parse(JSON.stringify(MediaEarningsConfig));
    newTransactionConfig.config.data.labels =
      selectedTimeFilter === 0
        ? DayLabels
        : selectedTimeFilter === 1
        ? WeekLabels
        : selectedTimeFilter === 2
        ? MonthLabels
        : YearLabels;
    const txnData = filteredTransactionData(selectedTimeFilter);
    newTransactionConfig.config.data.datasets[0].data = txnData;
    newTransactionConfig.configurer = configurer;

    setTransactionConfig(newTransactionConfig);
  }, [selectedTimeFilter, transactions]);

  const filteredTransactionData = selectedTime => {
    if (transactions && transactions.length > 0) {
      if (selectedTime === 0) {
        // a day
        let tnxList = new Array(24).fill(0);
        transactions.forEach(trans => {
          if (trans.Date && datesAreOnSameDay(trans.Date, "day")) {
            const hour = new Date(trans.Date * 1000).getHours();
            tnxList[hour]++;
          }
        });
        return tnxList;
      } else if (selectedTime === 1) {
        // a week
        let tnxList = new Array(7).fill(0);
        transactions.forEach(trans => {
          if (trans.Date && datesAreOnSameDay(trans.Date, "week")) {
            const day = new Date(trans.Date * 1000).getDay();
            tnxList[day]++;
          }
        });
        return tnxList;
      } else if (selectedTime === 2) {
        // a month
        let tnxList = new Array(31).fill(0);
        transactions.forEach(trans => {
          if (trans.Date && datesAreOnSameDay(trans.Date, "month")) {
            const date = new Date(trans.Date * 1000).getDate();
            tnxList[date - 1]++;
          }
        });
        return tnxList;
      } else if (selectedTime === 3) {
        // a year
        let tnxList = new Array(12).fill(0);
        transactions.forEach(trans => {
          if (trans.Date && datesAreOnSameDay(trans.Date, "year")) {
            const month = new Date(trans.Date * 1000).getMonth();
            tnxList[month]++;
          }
        });
        return tnxList;
      }
    }
    return [];
  };

  const datesAreOnSameDay = (transDate, type) => {
    if (type === "day") {
      return (
        new Date(transDate * 1000).getFullYear() === new Date().getFullYear() &&
        new Date(transDate * 1000).getMonth() === new Date().getMonth() &&
        new Date(transDate * 1000).getDate() === new Date().getDate()
      );
    } else if (type === "week") {
      const todayObj = new Date();
      const todayDate = todayObj.getDate();
      const todayDay = todayObj.getDay();

      // get first date of week
      const firstDayOfWeek = new Date(todayObj.setDate(todayDate - todayDay));

      // get last date of week
      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

      // if date is equal or within the first and last dates of the week
      return new Date(transDate * 1000) >= firstDayOfWeek && new Date(transDate * 1000) <= lastDayOfWeek;
    } else if (type === "month") {
      return (
        new Date(transDate * 1000).getFullYear() === new Date().getFullYear() &&
        new Date(transDate * 1000).getMonth() === new Date().getMonth()
      );
    } else if (type === "year") {
      return new Date(transDate * 1000).getFullYear() === new Date().getFullYear();
    }
  };

  return (
    <Box className={classes.container}>
      <LoadingWrapper loading={loading}>
        <Grid container spacing={3}>
          <Grid item sm={12} md={4} style={{ display: "flex", height: "auto", flexDirection: "column" }}>
            <Box
              className={classes.whiteBox}
              justifyContent="center"
              marginBottom="14px"
              padding="30px 35px 20px"
            >
              <Box className={classes.blueHeader}>Total transfered</Box>
              <Box className={classes.balance} mt={"10px"}>
                {`$ ${totalTxns ? totalTxns.toFixed(2) : 0}`}
              </Box>
            </Box>

            <Box className={classes.whiteBox} padding="23px 35px 28px" justifyContent="space-between">
              <div className={classes.txnRow}>
                <TotalTxnsIcon />
                <Box display="flex" flexDirection="column" alignItems="right">
                  <Box className={classes.header3} mb={1}>
                    Total Txns
                  </Box>
                  <Box className={classes.header2}>{transactions ? transactions.length : 0}</Box>
                </Box>
              </div>

              <div className={classes.divider} />

              <div className={classes.txnRow}>
                <IncomingIcon />

                <Box display="flex" flexDirection="column" alignItems="right">
                  <Box className={classes.header3} mb={1}>
                    Incoming
                  </Box>
                  <Box className={classes.header2}>{`$ ${incoming ? incoming.toFixed(2) : 0}`}</Box>
                </Box>
              </div>

              <div className={classes.divider} />

              <div className={classes.txnRow}>
                <OutgoingIcon />

                <Box display="flex" flexDirection="column" alignItems="right">
                  <Box className={classes.header3} mb={1}>
                    Outgoing
                  </Box>
                  <Box className={classes.header2}>{`$ ${outgoing ? outgoing.toFixed(2) : 0}`}</Box>
                </Box>
              </div>
            </Box>
          </Grid>
          <Grid item sm={12} md={8} style={{ display: "flex", height: "auto", flexDirection: "column" }}>
            <Box padding="26px" className={classes.whiteBox} justifyContent="space-between">
              <Box display="flex" alignItems="center" justifyContent="space-between" mb="52px">
                <Box className={classes.header1}>My Transactions</Box>

                <Box className={classes.timeFilters}>
                  {["1D", "7D", "1M", "YTD"].map((filter, index) => (
                    <div
                      className={cls(
                        { [classes.selectedTimeFilter]: index === selectedTimeFilter },
                        classes.timeFilter
                      )}
                      onClick={() => setSelectedTimeFilter(index)}
                      key={`time-${filter}`}
                    >
                      {filter}
                    </div>
                  ))}
                </Box>
              </Box>
              <Box style={{ height: "100%" }}>
                {transactionConfig && <PrintChart config={transactionConfig} canvasHeight={220} />}
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box style={{ marginTop: "52px" }}>
          <TransHistory filter transactions={transactions} />
        </Box>
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </LoadingWrapper>
    </Box>
  );
};

const TotalTxnsIcon = () => {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="18" fill="#CBA163" fillOpacity="0.1" />
      <path
        d="M9 18C9 22.9706 13.0294 27 18 27C22.9706 27 27 22.9706 27 18C27 13.0294 22.9706 9 18 9M9 18C9 13.0294 13.0294 9 18 9M9 18H18M18 9V18M18 18L24.3555 24.3555"
        stroke="#FF8E3C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const IncomingIcon = () => {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="18" fill="#65CB63" fillOpacity="0.1" />
      <path
        d="M18 26L18 10M18 26L12 20M18 26L24 20"
        stroke="#65CB63"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const OutgoingIcon = () => {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="18" fill="#F43E5F" fillOpacity="0.1" />
      <path
        d="M18 10L18 26M18 10L24 16M18 10L12 16"
        stroke="#F43E5F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default TransactionsPage;
