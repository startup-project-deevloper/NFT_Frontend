import React, { useState, useEffect } from "react";
import Box from "shared/ui-kit/Box";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { onGetNonDecrypt } from "shared/ipfs/get";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import { collectionNFTCardStyles } from "./index.styles";

export default function CollectionNFTCard({ item, handleSelect, hiddenHeader = false }) {
  const classes = collectionNFTCardStyles({ hiddenHeader });

  return (
    <Box display="flex" flexDirection="column" alignItems="center" onClick={handleSelect}>
      <div className={classes.card}>
        <div className={classes.innerBox}>
          {!hiddenHeader && (
            <Box display="flex" justifyContent="space-between" alignItems="baseline" width={1} mb={"10px"}>
              <div className={classes.ntfName}>{item.name}</div>
              <div className={classes.verifiedSection}>{item.isVerified ? "Verified" : "Unverified"}</div>
            </Box>
          )}
          <img src={require(`assets/backgrounds/digital_art_1.png`)} alt={item.MediaName} />
          <Box display="flex" flexDirection="column" width={"90%"} mt={"4px"}>
            <Box display="flex" justifyItems="center" justifyContent="space-between" mt={"4px"}>
              <div className={classes.typo1}>Owner</div>
              <div className={classes.typo2}>{`${item.owner} JOTS`}</div>
            </Box>
            <Box display="flex" justifyItems="center" justifyContent="space-between" mt={"4px"}>
              <div className={classes.typo1}>Available</div>
              <div className={classes.typo2}>{`${item.available} JOTS`}</div>
            </Box>
            <Box display="flex" justifyItems="center" justifyContent="space-between" mt={"4px"}>
              <div className={classes.typo1}>Price</div>
              <div className={classes.typo2}>{`${item.price} USDT/JOT`}</div>
            </Box>
          </Box>
          <div className={classes.starGroup}>
            <Box fontSize={7.8} mr={"2px"}>
              🌟{" "}
            </Box>
            <Box fontSize={11.7} mr={"2px"} pt={1}>
              🌟{" "}
            </Box>
            <Box fontSize={7.8}>🌟 </Box>
          </div>
        </div>
      </div>
    </Box>
  );
}
