import React from "react";
import Box from "shared/ui-kit/Box";
import BlockedByMeNFT from "./BlockedByMeNFT";

const BlockedByMe = () => {
  const nfts = [
    {
      nftName: 'Pudgy',
      futurePrice: 3232.456,
      collateral: 223,
      collateralPct: 20
    },
    {
      nftName: 'Pudgy',
      futurePrice: 3232.456,
      collateral: 223,
      collateralPct: 20
    },
    {
      nftName: 'Pudgy',
      futurePrice: 3232.456,
      collateral: 223,
      collateralPct: 20
    },
  ]
  return (
    <Box p={4}>
      {nfts.map((item) => (
        <BlockedByMeNFT item={item} />
      ))}
    </Box>
  )
};

export default BlockedByMe;
