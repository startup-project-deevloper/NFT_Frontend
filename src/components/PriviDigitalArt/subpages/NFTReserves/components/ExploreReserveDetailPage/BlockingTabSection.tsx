import React from "react";

import { PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { exploreOptionDetailPageStyles } from "./index.styles";
import { TagIcon, HistoryIcon } from "./index";

import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";

export default ({ offerData, historyData }) => {
  const classes = exploreOptionDetailPageStyles();
  const offerTableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "USER",
    },
    {
      headerName: "PRICE",
      headerAlign: "center",
    },
    {
      headerName: "COLLATERAL %",
      headerAlign: "center",
    },
    {
      headerName: "SETTLEMENT",
      headerAlign: "center",
    },
    {
      headerName: "DURATION",
      headerAlign: "center",
    },
    {
      headerName: "ETHERSCAN",
      headerAlign: "center",
    },
  ];
  const historyTableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "USER",
    },
    {
      headerName: "PRICE",
      headerAlign: "center",
    },
    {
      headerName: "PERIOD",
      headerAlign: "center",
    },
    {
      headerName: "COLLATERAL %",
      headerAlign: "center",
    },
    {
      headerName: "ETHERSCAN",
      headerAlign: "center",
    },
  ];

  return (
    <>
      <div className={classes.transactionsSection}>
        <div className={classes.coinFlipHistorySection}>
            <Box display="flex" alignItems="center" justifyContent="space-between" m="36px 30px 0 50px">
              <div className={classes.typo8}><TagIcon /><span>Blocking offers</span></div>
              <PrimaryButton
                size="small"
                className={classes.pricingButton}
              >
                MAKE BLOCKING OFFER
              </PrimaryButton>
            </Box>
            <div className={classes.table}>
                <CustomTable
                  headers={offerTableHeaders}
                  rows={offerData.map(item => [
                    {
                      cell: item.user,
                    },
                    {
                      cell: item.price,
                    },
                    {
                      cell: item.collateral
                    },
                    {
                      cellAlign: "center",
                      cell: item.settlement,
                    },
                    {
                      cellAlign: "center",
                      cell: item.duration,
                    },
                    {
                      cellAlign: "center",
                      cell: (
                        <div>
                        <img src={require("assets/icons/icon_ethscan.png")} />
                        </div>
                      ),
                    },
                  ])}
                  placeholderText="No history"
                />
            </div>
        </div>
      </div>
      <div className={classes.transactionsSection}>
        <div className={classes.coinFlipHistorySection}>
            <Box display="flex" alignItems="center" justifyContent="space-between" m="36px 30px 0 50px">
              <div className={classes.typo8}><HistoryIcon /><span>Blocking History</span></div>
            </Box>
            <div className={classes.table}>
                <CustomTable
                  headers={historyTableHeaders}
                  rows={historyData.map(item => [
                    {
                      cell: item.user,
                    },
                    {
                      cell: item.price,
                    },
                    {
                      cell: item.period,
                    },
                    {
                      cell: item.collateral
                    },
                    {
                      cellAlign: "center",
                      cell: (
                        <div>
                        <img src={require("assets/icons/icon_ethscan.png")} />
                        </div>
                      ),
                    },
                  ])}
                  placeholderText="No history"
                />
            </div>
        </div>
      </div>
    </>
  )
}