import React, { useState } from "react";
import Box from "shared/ui-kit/Box";

import { Avatar, PrimaryButton, Text } from "shared/ui-kit";

import { CustomTable, CustomTableHeaderInfo } from "shared/ui-kit/Table";

import { useStyles } from "./index.styles";
import SyntheticAuctionBidModal from "components/PriviDigitalArt/subpages/NFTFractionalisation/modals/SyntheticFractionalisationModals/SyntheticAuctionBidModal";

const MarketActivity = ({ nft }) => {
  const classes = useStyles();

  const [openPlaceBidModal, setOpenPlaceBidModal] = useState<boolean>(false);

  const dummyTableData = [
    [
      {
        cell: (
          <Box display="flex" flexDirection="row" alignItems="center">
            <Avatar size="medium" url={require(`assets/anonAvatars/ToyFaces_Colored_BG_001.jpg`)} />
            <Text ml={1.5}>0xas3....1231s</Text>
          </Box>
        ),
      },
      {
        cell: "ETH 1.256",
      },
      {
        cell: "April 23, 2021",
      },
      {
        cell: "12:09pm",
      },
      {
        cell: <img className={classes.explorerImg} src={require("assets/priviIcons/polygon.png")} />,
      },
    ],

    [
      {
        cell: (
          <Box display="flex" flexDirection="row" alignItems="center">
            <Avatar size="medium" url={require(`assets/anonAvatars/ToyFaces_Colored_BG_001.jpg`)} />
            <Text ml={1.5}>0xas3....1231s</Text>
          </Box>
        ),
      },
      {
        cell: "ETH 1.256",
      },
      {
        cell: "April 23, 2021",
      },
      {
        cell: "12:09pm",
      },
      {
        cell: <img className={classes.explorerImg} src={require("assets/priviIcons/polygon.png")} />,
      },
    ],

    [
      {
        cell: (
          <Box display="flex" flexDirection="row" alignItems="center">
            <Avatar size="medium" url={require(`assets/anonAvatars/ToyFaces_Colored_BG_001.jpg`)} />
            <Text ml={1.5}>0xas3....1231s</Text>
          </Box>
        ),
      },
      {
        cell: "ETH 1.256",
      },
      {
        cell: "April 23, 2021",
      },
      {
        cell: "12:09pm",
      },
      {
        cell: <img className={classes.explorerImg} src={require("assets/priviIcons/polygon.png")} />,
      },
    ],

    [
      {
        cell: (
          <Box display="flex" flexDirection="row" alignItems="center">
            <Avatar size="medium" url={require(`assets/anonAvatars/ToyFaces_Colored_BG_001.jpg`)} />
            <Text ml={1.5}>0xas3....1231s</Text>
          </Box>
        ),
      },
      {
        cell: "ETH 1.256",
      },
      {
        cell: "April 23, 2021",
      },
      {
        cell: "12:09pm",
      },
      {
        cell: <img className={classes.explorerImg} src={require("assets/priviIcons/polygon.png")} />,
      },
    ],
  ];
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

  return (
    <div className={classes.offerList}>
      <span className={classes.offerTitle}>👋 Total offers: 21</span>
      <div className={classes.table}>
        <CustomTable headers={tableHeaders} rows={dummyTableData} placeholderText="No offers" />
      </div>
      <a>See All Offers</a>
      <PrimaryButton size="medium" onClick={() => setOpenPlaceBidModal(true)}>
        Place Bid
      </PrimaryButton>

      {openPlaceBidModal && (
        <SyntheticAuctionBidModal
          open={openPlaceBidModal}
          onClose={() => setOpenPlaceBidModal(false)}
          previousBid={0}
          nft={nft}
          handleRefresh={() => {}}
        />
      )}
    </div>
  );
};

export default MarketActivity;
