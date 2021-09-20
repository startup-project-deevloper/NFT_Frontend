import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Box from "shared/ui-kit/Box";
import { Modal, Variant } from "shared/ui-kit";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";

const TABLEHEADER: Array<CustomTableHeaderInfo> = [
  {
    headerName: "TXN ID",
    headerAlign: "left",
    headerWidth: "80px",
  },
  {
    headerName: "TYPE",
    headerAlign: "left",
    headerWidth: "80px",
  },
  {
    headerName: "SENDER",
    headerAlign: "left",
  },
  {
    headerName: "RECEIVER",
    headerAlign: "left",
  },
  {
    headerName: "VALUE",
    headerAlign: "left",
  },
  {
    headerName: "TOKEN",
    headerAlign: "left",
  },
];

const useStyles = makeStyles({
  date: {
    color: "rgba(101, 110, 126, 0.7)",
  },
  externalLink: {
    verticalAlign: "middle",
  },
  topHeaderLabel: {
    background: `linear-gradient(97.4deg, #23D0C6 14.43%, #00CC8F 85.96%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  container: {
    borderRadius: "8px",
    overflow: "hidden",
  },
});

export const shortenHash = (str: string) => {
  if (str) {
    const part1 = str.slice(0, 6);
    const part2 = str.slice(str.length - 4);
    return `${part1}...${part2}`;
  }
};

const convertDate = value => {
  const date = new Date(value * 1000);
  const minutes = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const seconds = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1; //months from 1-12
  const year = date.getUTCFullYear();
  return `${minutes}:${seconds} - ${day}/${month}/${year}`;
};

export default function PriviScanHistory(props) {
  const classes = useStyles();

  const [datedList, setDatedList] = useState<any>();
  const [selectedHistory, setSelectedHistory] = useState<any>();
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    if (props.history && props.history.length > 0) {
      const historySorted = [...props.history];
      console.log({ historySorted });
      historySorted.sort((a, b) => b.tx.Date - a.tx.Date);
      setDatedList(historySorted);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.history]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleClickHistory = history => {
    setSelectedHistory(history);
    setOpenModal(true);
  };

  const getTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    datedList.map(transaction => {
      const row: Array<CustomTableCellInfo> = [];
      row.push({
        cell: transaction.tx.Type,
        cellAlign: "left",
      });
      row.push({
        cell: transaction.tx.Type,
        cellAlign: "left",
      });
      row.push({
        cell: <Box className={classes.topHeaderLabel}>{shortenHash(transaction.tx.From)}</Box>,
        cellAlign: "left",
      });
      row.push({
        cell: <Box className={classes.topHeaderLabel}>{shortenHash(transaction.tx.To)}</Box>,
        cellAlign: "left",
      });
      row.push({
        cell: transaction.tx.Amount,
        cellAlign: "left",
      });
      row.push({
        cell: <img src={require(`assets/tokenImages/${transaction.tx.Token}.png`)} width={24} height={24} />,
        cellAlign: "left",
      });
      tableData.push(row);
    });

    return tableData;
  };

  return (
    <div className={classes.container}>
      <CustomTable
        headers={TABLEHEADER}
        rows={getTableData()}
        placeholderText="No transactions to display"
        theme="transaction"
        variant={Variant.Transparent}
      />
      {openModal && (
        <Modal
          isOpen={openModal}
          onClose={handleCloseModal}
          showCloseIcon
          size="medium"
        >
          <CustomTable
            headers={TABLEHEADER}
            rows={getTableData()}
            placeholderText="No transactions to display"
            theme="transaction"
            variant={Variant.Transparent}
          />
        </Modal>
      )}
    </div>
  );
}
