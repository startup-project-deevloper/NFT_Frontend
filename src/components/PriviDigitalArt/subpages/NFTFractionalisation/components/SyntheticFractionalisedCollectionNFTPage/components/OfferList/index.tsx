import React, { useState, useEffect } from "react";
import Box from "shared/ui-kit/Box";
import Moment from "react-moment";

import { Avatar, PrimaryButton, Text } from "shared/ui-kit";

import { CustomTable, CustomTableHeaderInfo } from "shared/ui-kit/Table";

import { useStyles } from "./index.styles";
import SyntheticAuctionBidModal from "components/PriviDigitalArt/subpages/NFTFractionalisation/modals/SyntheticFractionalisationModals/SyntheticAuctionBidModal";
import { getSyntheticNFTBidHistory } from "shared/services/API/SyntheticFractionalizeAPI";

const isProd = process.env.REACT_APP_ENV === "prod";

const MarketActivity = ({ nft }) => {
  const classes = useStyles();

  const [openPlaceBidModal, setOpenPlaceBidModal] = useState<boolean>(false);

  const tableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "From",
    },
    {
      headerName: "Price",
    },
    {
      headerName: "Date",
    },
    {
      headerName: "Time",
    },
    {
      headerName: "Explorer",
    },
  ];

  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    if (!(nft.collection_id && nft.SyntheticID)) return;

    reload();
  }, [nft]);

  const reload = async () => {
    const response = await getSyntheticNFTBidHistory({
      collectionId: nft.collection_id,
      syntheticId: nft.SyntheticID,
    });
    if (response.success) {
      setTableData(
        response.data.map(item => [
          {
            cell: (
              <Box display="flex" flexDirection="row" alignItems="center">
                <Avatar size="medium" url={item.bidderInfo?.avatar || ""} />
                <Text ml={1.5}>{item.bidderAddress}</Text>
              </Box>
            ),
          },
          {
            cell: `${item.bidAmount} ${nft.JotSymbol}`,
          },
          {
            cell: <Moment format="DD.MM.yyyy">{new Date(item.bidTime)}</Moment>,
          },
          {
            cell: <Moment format="hh:kk">{new Date(item.bidTime)}</Moment>,
          },
          {
            cell: (
              <img
                onClick={() =>
                  window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${item.hash}`, "_blank")
                }
                className={classes.explorerImg}
                src={require("assets/priviIcons/polygon.png")}
              />
            ),
          },
        ])
      );
    }
  };
  return (
    <div className={classes.offerList}>
      <span className={classes.offerTitle}>👋 Total offers: {tableData.length}</span>
      <div className={classes.table}>
        <CustomTable headers={tableHeaders} rows={tableData} placeholderText="No offers" />
      </div>
      <a>See All Offers</a>
      {nft.auctionData?.endAt > Date.now() && (
        <PrimaryButton size="medium" onClick={() => setOpenPlaceBidModal(true)}>
          Place Bid
        </PrimaryButton>
      )}

      {openPlaceBidModal && (
        <SyntheticAuctionBidModal
          open={openPlaceBidModal}
          onClose={() => setOpenPlaceBidModal(false)}
          previousBid={0}
          nft={nft}
          handleRefresh={reload}
        />
      )}
    </div>
  );
};

export default MarketActivity;
