import React from "react";
import Box from "shared/ui-kit/Box";
import BlockedByMeNFT from "./RentedByMeNFT";
import { RentedByMeStyles } from './index.styles';

const RentedByMe = () => {
  const classes = RentedByMeStyles();

  const nfts = [
    {
      nftName: 'Pudgy',
      rentalPrice: 0.0004,
      totalPaid: 2235,
      address: '0xE68BD3778E783B7a1c0fe2A8c11f2dE0eB05fa69',
      isActive: true
    },
    {
      nftName: 'Pudgy',
      rentalPrice: 0.0004,
      totalPaid: 2235,
      address: '0xE68BD3778E783B7a1c0fe2A8c11f2dE0eB05fa69',
      isActive: true
    },
    {
      nftName: 'Pudgy',
      rentalPrice: 0.0004,
      totalPaid: 2235,
      address: '0xE68BD3778E783B7a1c0fe2A8c11f2dE0eB05fa69',
      isActive: true
    },
    {
      nftName: 'Pudgy',
      rentalPrice: 0.0004,
      totalPaid: 2235,
      address: '0xE68BD3778E783B7a1c0fe2A8c11f2dE0eB05fa69',
      isActive: true
    },
    {
      nftName: 'Pudgy',
      rentalPrice: 0.0004,
      totalPaid: 2235,
      address: '0xE68BD3778E783B7a1c0fe2A8c11f2dE0eB05fa69',
      isActive: false
    },
    {
      nftName: 'Pudgy',
      rentalPrice: 0.0004,
      totalPaid: 2235,
      address: '0xE68BD3778E783B7a1c0fe2A8c11f2dE0eB05fa69',
      isActive: false
    },
  ]
  return (
    <Box p={4} pt={0} mb={8}>
      <Box className={classes.title}>Active</Box>
      {nfts.filter(nft => nft.isActive).map((item) => (
        <BlockedByMeNFT item={item} />
      ))}
      <Box className={classes.title}>Expired</Box>
      {nfts.filter(nft => !nft.isActive).map((item) => (
        <BlockedByMeNFT item={item} />
      ))}
    </Box>
  )
};

export default RentedByMe;
