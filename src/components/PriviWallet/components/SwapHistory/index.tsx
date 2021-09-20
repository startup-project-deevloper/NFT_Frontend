import React, { useState, useEffect, useCallback } from "react";

import { swapHistoryStyles } from "./index.styles";
import Box from "shared/ui-kit/Box";
import Moment from "react-moment";
import { resImages, StyledSelectComponent } from "shared/ui-kit/Select/TokenSelect";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import URL from "shared/functions/getURL";
import { BlockchainNets } from "shared/constants/constants";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { Variant } from "shared/ui-kit";

/*const txnTypeMap = {
  PRIVI_credit_creation: "Creation",
  PRIVI_credit_deposit: "Lent",
  PRIVI_credit_borrowing: "Borrowed",
  PRIVI_credit_collateral: "Collateral",
  PRIVI_credit_interest: "Interest",
  PRIVI_credit_withdraw: "Withdraw",
  PRIVI_credit_modified: "Modified",
  PRIVI_risk_taking: "Assume Risk",

  NFT_Pod_Selling: "Sell",
  NFT_Pod_Buying: "Buy",

  POD_Minting: "Mint",
  POD_Buying: "Buy",
};*/

const TABLEHEADER: Array<CustomTableHeaderInfo> = [
  {
    headerName: "Type",
    headerAlign: "left",
    headerWidth: "calc(100% / 6)",
  },
  {
    headerName: "Token",
    headerAlign: "center",
  },
  {
    headerName: "Amount",
    headerAlign: "center",
  },
  {
    headerName: "Chain",
    headerAlign: "center",
  },
  {
    headerName: "Time",
    headerAlign: "center",
    sortable: true,
  },
  {
    headerName: "Explorer",
    headerAlign: "center",
  },
];

export default function SwapHistory(props) {
  const classes = swapHistoryStyles();

  const [datedList, setDatedList] = useState<any[]>([]);

  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortAsc, setSortAsc] = React.useState<boolean>(false);

  useEffect(() => {
    if (props.history && Object.keys(props.history).length > 0) {
      const historySorted = props.history;
      // Object.keys(historySorted).sort((a, b) => b.lastUpdate - a.lastUpdate);

      const sortedList = [] as any;

      Object.keys(historySorted).map(key => {
        sortedList.push({
          type: historySorted[key].action,
          token: historySorted[key].token || "",
          amount: historySorted[key].amount || "",
          date: historySorted[key].lastUpdate || "",
          id: historySorted[key].id,
          chain: historySorted[key].chainId ? BlockchainNets[historySorted[key].chainId].name : "",
        });
      });

      setDatedList(sortedList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.history]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    filteredtransactions()
      ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .sort((a, b) => (sortAsc ? b.Date - a.Date : a.Date - b.Date))
      .map(transaction => {
        const row: Array<CustomTableCellInfo> = [];
        row.push({
          cell: (
            <Box color="#4218B5" fontSize="14px" className={classes.break}>
              {transaction.Type}
            </Box>
          ),
          cellAlign: "left",
        });
        row.push({
          cell: (
            <img
              src={
                transaction.Token && isCrypto(transaction.Token)
                  ? require(`assets/tokenImages/${transaction.Token}.png`)
                  : `${URL()}/wallet/getTokenPhoto/${transaction.Token}`
              }
              width={24}
              height={24}
            />
          ),
          cellAlign: "center",
        });
        row.push({
          cell: transaction.Amount
            ? `${transaction.Amount > 1000000
              ? (transaction.Amount / 1000000).toFixed(2)
              : transaction.Amount > 1000
                ? (transaction.Amount / 1000).toFixed(2)
                : transaction.Amount.toFixed(6)
            } ${transaction.Amount > 1000000 ? "m" : transaction.Amount > 1000 ? "k" : ""}`
            : "N/A",
          cellAlign: "center",
        });
        row.push({
          cell: transaction.Chain ?? "PRIVI",
          cellAlign: "center",
        });
        row.push({
          cell: <Moment format="ddd, DD MMM-h:mm A">{transaction.Date * 1000}</Moment>,
          cellAlign: "center",
        });
        row.push({
          cell: transaction.Id && (
            <a target="_blank" rel="noopener noreferrer" href={"https://priviscan.io/tx/" + transaction.Id}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16.9999 0.999951L6.99995 11M16.9999 0.999951L17 6.99994M16.9999 0.999951L11 0.999939M6.99998 0.999951H1V16.9999H17V10.9999"
                  stroke="#4218B5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          ),
          cellAlign: "center",
        });
        tableData.push(row);
      });

    return tableData;
  };

  const filteredtransactions = useCallback(() => {
    return datedList.filter((tx: any) => {
      if (
        new Date().getFullYear() === selectedDate?.getFullYear() &&
        new Date().getMonth() === selectedDate?.getMonth() &&
        new Date().getDate() === selectedDate?.getDate()
      )
        return true;
      return (
        selectedDate &&
        new Date(tx.date * 1000).getFullYear() >= selectedDate.getFullYear() &&
        new Date(tx.date * 1000).getMonth() >= selectedDate.getMonth() &&
        new Date(tx.date * 1000).getDate() >= selectedDate.getDate()
      );
    });
  }, [datedList, selectedDate]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const isCrypto = token => {
    if (resImages.includes(token)) return true;
    else return false;
  };

  if (datedList.length > 0)
    return (
      <Box mt={"60px"}>
        <Box display="flex" alignItems="center" justifyContent="space-between" className={classes.title}>
          <div className={classes.headerbig}>Recent Swaps</div>
          <DateInput
            width={210}
            height={45}
            format="dd.MM.yyyy"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </Box>
        <Box className={classes.tableContainer} mt="24px">
          <CustomTable
            headers={TABLEHEADER}
            rows={getTableData()}
            placeholderText="No transactions to display"
            onSort={_ => setSortAsc(prev => !prev)}
            sorted={{ Time: !sortAsc }}
            theme="transaction"
            variant={Variant.Transparent}
          />
        </Box>
        {datedList && filteredtransactions() && rowsPerPage ? (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            count={filteredtransactions().length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        ) : null}
      </Box>
    );
  else
    return (
      <div className="centered-info">
        <p>No trading history to show</p>
      </div>
    );
}

const TablePagination = ({
  rowsPerPageOptions,
  count,
  rowsPerPage,
  page,
  onChangePage,
  onChangeRowsPerPage,
}) => {
  const classes = swapHistoryStyles();

  const [totalPages, setTotalPages] = useState<number>(2);

  useEffect(() => {
    if (count && rowsPerPage) setTotalPages(count / rowsPerPage);
  }, [count]);

  useEffect(() => {
    setTotalPages(count / rowsPerPage);
  }, [rowsPerPage]);

  return (
    <div className={classes.pagination}>
      <Box mr="16px">
        <div>Rows per page:</div>
        <StyledSelectComponent
          options={rowsPerPageOptions}
          value={rowsPerPage}
          onChange={onChangeRowsPerPage}
        />
      </Box>

      <Box mr="16px">{`${rowsPerPage * page + 1}-${page + 1 > totalPages ? count : (rowsPerPage * (page + 1))?.toFixed(0)
        } out of ${count}`}</Box>

      <Box mr="16px">
        <button onClick={e => onChangePage(e, page - 1)} disabled={page - 1 === -1}>
          <img src={require("assets/icons/arrow.png")} alt="back" />
        </button>
        <button onClick={e => onChangePage(e, page + 1)} disabled={page + 1 > totalPages}>
          <img src={require("assets/icons/arrow.png")} alt="back" />
        </button>
      </Box>
    </div>
  );
};
