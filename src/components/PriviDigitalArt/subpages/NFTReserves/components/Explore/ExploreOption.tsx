import React, { useEffect, useState } from "react";

import ExploreCard from "components/PriviDigitalArt/components/Cards/ExploreCard";
import Box from "shared/ui-kit/Box";
import { Grid } from "@material-ui/core";
import { exploreOptionStyles } from "./index.styles";

import { NFT_TYPES } from "../../types";

const ExploreOption = () => {
  const classes = exploreOptionStyles();
  const [reservedNftList, setReservedNftList] = useState<any[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const mockNfts: any[] = [];
    for (let i = 0; i < 8; i++) {
      const typeIndex = Math.floor(Math.random() * NFT_TYPES.length);
      mockNfts.push({
        id: i,
        imageUrl: i + 1,
        name: `test${i + 1}`,
        ownerAddress: "0x7Fa11671e546dB93f558531c1e3bC5D4FFed29a5",
        sellingPrice: 10,
        blockingPrice: 1,
        blockingPeriod: 90,
        rentalPrice: 0.1,
        rentalPriceCycle: "Day",
        type: NFT_TYPES[typeIndex],
      });
    }
    setReservedNftList(mockNfts);
  };

  return (
    <>
      <div className={classes.content}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            {reservedNftList.map(nft => (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <ExploreCard nft={nft} key={nft.id} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    </>
  );
};

export default ExploreOption;
