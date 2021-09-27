import React, { useEffect, useState } from "react";
import cls from "classnames";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { useHistory } from "react-router-dom";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";

import { Divider } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { syntheticCollectionCardStyles } from "./index.styles";

export default function SyntheticCollectionCard({ item }) {
  const classes = syntheticCollectionCardStyles();
  const history = useHistory();
  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();
  const [balance, setBalance] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const targetChain = BlockchainNets[1];

      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0);
        if (!isHere) {
          showAlertMessage(`Got failed while switching over to polygon network`, { variant: "error" });
          return;
        }
      }

      const web3APIHandler = targetChain.apiHandler;
      const web3Config = targetChain.config;
      const web3 = new Web3(library.provider);

      const balanceResponse = await web3APIHandler.SyntheticCollectionManager.getContractJotsBalance(
        web3,
        item
      );

      if (balanceResponse) {
        setBalance(balanceResponse);
      }

      const priceResponse = await web3APIHandler.SyntheticCollectionManager.getJotFractionPrice(web3, item, {
        tokenId: +item.SyntheticID,
      });

      if (priceResponse) {
        setPrice(priceResponse);
      }
    })();
  }, []);

  return (
    <div
      className={classes.card}
      onClick={() => {
        history.push(`/pix/fractionalisation/collection/${item.id}`);
      }}
    >
      <div
        className={cls(classes.image, classes.fixed)}
        style={{
          backgroundImage: `url(${item.imageUrl ?? require(`assets/collectionImages/async-art.png`)})`,
        }}
      />
      <div className={classes.info}>
        <Box className={classes.infoWrapper}>
          <Box className={classes.title}>{item.collectionName}</Box>
          <Divider light />
          <Box className={classes.details}>
            <Box className={classes.detailWrapper}>
              <Box className={classes.detailLabel}>Locked NFTs</Box>
              <Box className={classes.detailInfo}>{item.nfts?.filter(nft => nft.isLocked).length}</Box>
            </Box>
            <Box className={classes.detailWrapper}>
              <Box className={classes.detailLabel}>Fraction Price</Box>
              <Box className={classes.detailInfo}>{price} USDC</Box>
            </Box>
            <Box className={classes.detailWrapper}>
              <Box className={classes.detailLabel}>Implied Valuation</Box>
              <Box className={classes.detailInfo}>${balance}</Box>
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
}
