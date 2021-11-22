import React, { useEffect, useState } from "react";

import ExploreCard from "components/PriviDigitalArt/components/Cards/ExploreCard";
import Box from "shared/ui-kit/Box";
import { Grid } from "@material-ui/core";
import { exploreOptionStyles } from "./index.styles";
import axios from 'axios';
import { NFT_TYPES } from "../../types";
import URL from "shared/functions/getURL";
import { getAllNFTs } from "shared/services/API/ReserveAPI";
import { BlockchainNets } from "shared/constants/constants";
import { useWeb3React } from "@web3-react/core";

const isProd = process.env.REACT_APP_ENV === "prod";
const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

const ExploreOption = () => {
  const classes = exploreOptionStyles();
  const [reservedNftList, setReservedNftList] = useState<any[]>([]);
  const { account, library, chainId } = useWeb3React();
  const [selectedChain, setSelectedChain] = useState<any>(
    filteredBlockchainNets.find(item => item.chainId === chainId) || filteredBlockchainNets[1]
  );

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    // const mockNfts: any[] = [];
    // for (let i = 0; i < 8; i++) {
    //   const typeIndex = Math.floor(Math.random() * NFT_TYPES.length);
    //   mockNfts.push({
    //     id: i,
    //     imageUrl: i + 1,
    //     name: `test${i + 1}`,
    //     ownerAddress: "0x7Fa11671e546dB93f558531c1e3bC5D4FFed29a5",
    //     sellingPrice: 10,
    //     blockingPrice: 1,
    //     blockingPeriod: 90,
    //     rentalPrice: 0.1,
    //     rentalPriceCycle: "Day",
    //     type: NFT_TYPES[typeIndex],
    //   });
    // }
    const response = await getAllNFTs({
      mode: isProd ? "main" : "test",
      network: selectedChain.chainName,
    })
    console.log(response.nfts)
    setReservedNftList(response.nfts);
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
