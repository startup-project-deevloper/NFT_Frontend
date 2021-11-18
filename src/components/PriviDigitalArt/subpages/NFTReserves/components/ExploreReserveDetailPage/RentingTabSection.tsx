import React, { useState } from "react";

import { PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import MakeRentalOfferModal from "components/PriviDigitalArt/modals/MakeRentalOfferModal";
import { exploreOptionDetailPageStyles } from "./index.styles";
import { TagIcon, HistoryIcon } from "./index";

import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";

export default ({ offerData, historyData }) => {
  const classes = exploreOptionDetailPageStyles();
  const [openMakeRentalModal, setOpenMakeRentalModal] = useState<boolean>(false);

  const offerTableHeaders: Array<CustomTableHeaderInfo> = [
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
      headerName: "ETHERSCAN",
      headerAlign: "center",
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
              <div className={classes.typo8}><TagIcon /><span>Rental offers</span></div>
              <PrimaryButton
                size="small"
                className={classes.pricingButton}
                onClick={() => setOpenMakeRentalModal(true)}
              >
                MAKE RENTAL OFFER
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
                      cell: item.estimated
                    },
                    {
                      cell: item.time,
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
              <div className={classes.typo8}><HistoryIcon /><span>Rental History</span></div>
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
      <MakeRentalOfferModal
        open={openMakeRentalModal}
        handleClose={() => setOpenMakeRentalModal(false)}
        onConfirm={() => setOpenMakeRentalModal(false)}
      />
    </>
  )
}