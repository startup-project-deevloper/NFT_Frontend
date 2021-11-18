import React from "react";

import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { CustomTable, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { exploreOptionDetailPageStyles } from "./index.styles";
import { TagIcon, HistoryIcon } from "./index";

export default ({ offerData, historyData, isOwnership }) => {
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
      headerName: "EXPIRATION DATE",
      headerAlign: "center",
    },
    {
      headerName: "ETHERSCAN",
      headerAlign: isOwnership ? "left" : "center",
    },
  ];
  const historyTableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "USER",
    },
    {
      headerName: "PRICE PER SECOND",
      headerAlign: "center",
    },
    {
      headerName: "ESTIMATED COST",
      headerAlign: "center",
    },
    {
      headerName: "RENTAL TIME",
      headerAlign: "center",
    },
    {
      headerName: "DATE",
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
              <div className={classes.typo8}><TagIcon /><span>Buy offers</span></div>
            {
              !isOwnership && (
                <PrimaryButton
                  size="small"
                  className={classes.pricingButton}
                >
                  MAKE BUY OFFER
                </PrimaryButton>
              )
            }
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
                      cell: item.date
                    },
                    {
                      cellAlign: isOwnership ? "left" : "center",
                      cell: (
                        <Box display="flex" alignItems="center" justifyContent={isOwnership ? "space-between" : "center"} ml={isOwnership ? 4.5 : 0}>
                          <img src={require("assets/icons/icon_ethscan.png")} />
                          {
                            isOwnership && (
                              <Box display="flex" alignItems="center" ml={3}>
                                <SecondaryButton size="small" className={classes.secondaryBtn}> DECLINE</SecondaryButton>
                                <PrimaryButton size="small" className={classes.primaryBtn}> ACCEPT</PrimaryButton>
                              </Box>
                            )
                          }
                        </Box>
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
              <div className={classes.typo8}><HistoryIcon /><span>Buy History</span></div>
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
                      cell: item.estimated,
                    },
                    {
                      cell: item.time
                    },
                    {
                      cell: item.date
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