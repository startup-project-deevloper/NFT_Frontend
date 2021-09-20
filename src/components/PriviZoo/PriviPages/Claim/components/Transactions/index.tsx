import React, { useState, useEffect, useMemo } from "react";
import { Box, Grid } from "@material-ui/core";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { TablePagination } from "components/PriviWallet/components/TransHistory";
import axios from "axios";
import URL from "shared/functions/getURL";
import Moment from "react-moment";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { useTransactionsStyles } from "./index.styles";
import { toFixedDigits } from "../../utils";
const isDev = process.env.REACT_APP_ENV === "dev";

const TABLEHEADER: Array<CustomTableHeaderInfo> = [
  {
    headerName: "Asset",
    headerAlign: "left",
  },
  {
    headerName: "Amount",
    headerAlign: "center",
  },
  {
    headerName: "Total Value",
    headerAlign: "center",
  },
  {
    headerName: "Time",
    headerAlign: "center",
    sortable: true,
  },
  {
    headerName: "BSC Scan",
    headerAlign: "center",
  },
];

export default function Transactions({ transactionsList }) {
  const classes = useTransactionsStyles();
  const [traxRate, setTraxRate] = useState<number>(0);
  const [pixRate, setPixRate] = useState<number>(0);
  const [web3, setWeb3] = useState<any>({});
  const { account, library } = useWeb3React();
  const [ascending, setAscending] = useState<boolean>(false);

  const [seeAll, setSeeAll] = useState<boolean>(false);

  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [page, setPage] = useState<number>(0);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatCurrency = (val, rate) => {
    const value = val * rate;
    return value
      ? `${
          value > 1000000
            ? (value / 1000000).toFixed(2)
            : value > 1000
            ? (value / 1000).toFixed(2)
            : value.toFixed(8)
        }${value > 1000000 ? "M" : value > 1000 ? "K" : ""}`
      : 0;
  };

  const getTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    transactionsList.map(transaction => {
      const row: Array<CustomTableCellInfo> = [];
      row.push({
        cell: (
          <Box display="flex" alignItems="center">
            <img
              src={require(`assets/logos/${transaction.tokenSymbol}_TOKEN.png`)}
              alt="asset"
              className={classes.logoBig}
            />
            {transaction.tokenSymbol}
          </Box>
        ),
        cellAlign: "left",
      });
      row.push({
        cell: `${toFixedDigits(web3.utils.fromWei(transaction.amount.toString(), "ether"))}`,
        cellAlign: "center",
      });
      row.push({
        cell: `$${formatCurrency(
          toFixedDigits(web3.utils.fromWei(transaction.amount.toString(), "ether")),
          transaction.tokenSymbol === "TRAX" ? traxRate : transaction.tokenSymbol === "PIX" ? pixRate : 1
        )}`,
        cellAlign: "center",
      });
      row.push({
        cell: <Moment fromNow>{new Date(transaction.claimedAt) ?? new Date()}</Moment>,
        cellAlign: "center",
      });
      row.push({
        cell: (
          <a
            href={`${isDev ? "https://ropsten.etherscan.io/tx/" : "https://bscscan.com/tx/"}${
              transaction.txHash
            }`}
            target="_blank"
          >
            <img src={require("assets/walletImages/contract.svg")} alt="BSC" className={classes.logoSmall} />
          </a>
        ),
        cellAlign: "center",
      });
      tableData.push(row);
    });

    return tableData;
  };

  const totalClaimedTrax = useMemo(() => {
    const sum = transactionsList
      .filter(transaction => transaction.tokenSymbol === "TRAX")
      .map(transaction => web3.utils.fromWei(transaction.amount.toString(), "ether"))
      .reduce((acc, cur) => parseFloat(acc) + parseFloat(cur), 0);
    return toFixedDigits(sum);
  }, [transactionsList]);

  const totalClaimedPix = useMemo(() => {
    const sum = transactionsList
      .filter(transaction => transaction.tokenSymbol === "PIX")
      .map(transaction => web3.utils.fromWei(transaction.amount.toString(), "ether"))
      .reduce((acc, cur) => parseFloat(acc) + parseFloat(cur), 0);
    return toFixedDigits(sum);
  }, [transactionsList]);

  const totalValue = useMemo(() => {
    const traxValue = totalClaimedTrax * traxRate;
    const pixValue = totalClaimedPix * pixRate;
    const value = traxValue + pixValue;
    return toFixedDigits(
      value
        ? `${
            value > 1000000
              ? (value / 1000000).toFixed(2)
              : value > 1000
              ? (value / 1000).toFixed(2)
              : value.toFixed(8)
          }${value > 1000000 ? "M" : value > 1000 ? "K" : ""}`
        : 0
    );
  }, [totalClaimedTrax, traxRate, totalClaimedPix, pixRate]);

  useEffect(() => {
    axios
      .get(`${URL()}/wallet/getTraxRate`)
      .then(res => {
        if (res.data.success) {
          setTraxRate(res.data.vwap);
        }
      })
      .catch(err => {
        console.log(err);
      });
    axios
      .get(`${URL()}/wallet/getPixRate`)
      .then(res => {
        if (res.data.success) {
          setPixRate(res.data.vwap);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (library) {
      const web3 = new Web3(library.provider);
      setWeb3(web3);
    }
  }, [library]);

  return (
    <div className={classes.root}>
      <Box className={classes.titleContainer}>
        <div className={classes.title2}>Transactions</div>

        <button
          className={classes.seeAllButton}
          onClick={() => setSeeAll(!seeAll)}
          style={seeAll ? { paddingLeft: "18px" } : {}}
        >
          {seeAll ? "Hide" : "Show all"}
          {!seeAll && (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
              <path
                d="M7.90262 10.9386C8.09347 10.9386 8.26423 10.8658 8.4149 10.7201L13.1384 6.00419C13.2941 5.85854 13.3719 5.68025 13.3719 5.46931C13.3719 5.26339 13.2941 5.0851 13.1384 4.93443L8.4375 0.241071C8.35212 0.155692 8.26549 0.0941685 8.1776 0.0565011C8.0897 0.0188337 7.99805 0 7.90262 0C7.70173 0 7.53348 0.0652902 7.39788 0.195871C7.26228 0.326451 7.19448 0.492188 7.19448 0.69308C7.19448 0.793527 7.21205 0.887695 7.24721 0.975586C7.28237 1.06348 7.33259 1.14007 7.39788 1.20536L9.00251 2.83259L11.2139 4.8545L9.53739 4.75363L0.723214 4.75363C0.512277 4.75363 0.339007 4.82017 0.203404 4.95326C0.0678013 5.08636 0 5.25837 0 5.46931C0 5.68527 0.0678013 5.85979 0.203404 5.99289C0.339007 6.12598 0.512277 6.19252 0.723214 6.19252L9.53739 6.19252L11.2203 6.09264L9.00251 8.11356L7.39788 9.74079C7.33259 9.80608 7.28237 9.88267 7.24721 9.97056C7.21205 10.0585 7.19448 10.1526 7.19448 10.2531C7.19448 10.4489 7.26228 10.6122 7.39788 10.7427C7.53348 10.8733 7.70173 10.9386 7.90262 10.9386Z"
                fill="#2D3047"
              />
            </svg>
          )}
        </button>
      </Box>

      <Grid container spacing={1}>
        <Grid item xs={3} sm={3} md={3}>
          <div className={classes.value}>
            {totalClaimedTrax} <span>TRAX</span>
          </div>
          <div className={classes.label}>TOTAL CLAIMED</div>
        </Grid>
        <Grid item xs={3} sm={3} md={3}>
          <div className={classes.value}>
            {totalClaimedPix} <span>PIX</span>
          </div>
          <div className={classes.label}>TOTAL CLAIMED</div>
        </Grid>
        <Grid item xs={6} sm={6} md={6}>
          <div className={classes.value}>
            {totalValue} <span>USD</span>
          </div>
          <div className={classes.label}>TOTAL VALUE</div>
        </Grid>
      </Grid>

      <div className={classes.tableContainer}>
        <CustomTable
          headers={TABLEHEADER}
          rows={getTableData()}
          placeholderText="No transactions to display"
          theme="transaction"
          onSort={_ => setAscending(prev => !prev)}
          sorted={{ Time: !ascending }}
        />
      </div>

      {transactionsList && getTableData() && rowsPerPage && seeAll ? (
        <div className={classes.tablePagination}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            count={getTableData().length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </div>
      ) : null}
    </div>
  );
}
