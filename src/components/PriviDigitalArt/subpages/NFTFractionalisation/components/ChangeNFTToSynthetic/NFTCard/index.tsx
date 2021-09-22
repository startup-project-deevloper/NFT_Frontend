import React, { useState } from "react";
import Box from "shared/ui-kit/Box";
import { normalNFTCardStyles } from "../index.styles";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";

export default function NFTCard({ item, handleSelect }) {
  const classes = normalNFTCardStyles();
  const [imageIPFS, setImageIPFS] = useState({});

  return (
    <Box display="flex" flexDirection="column" alignItems="center" onClick={handleSelect}>
      <div className={classes.selectedOuterBox}>
        <div className={`${classes.card} ${item.selected ? classes.selected : ""}`}>
          <div className={classes.innerBox}>
            <Box display="flex" justifyContent="space-between" alignItems="baseline" width={1} className={classes.nftNameContainer}>
              <div className={classes.ntfName}>{item.MediaName}</div>
            </Box>
            <img
              src={
                item?.cid
                  ? imageIPFS
                  : item?.Type && item?.Type !== "DIGITAL_ART_TYPE"
                  ? item?.UrlMainPhoto
                  : item?.UrlMainPhoto ??
                    item?.Url ??
                    item?.url ??
                    require(`assets/backgrounds/nft-card-img.png`)
              }
              alt={item.MediaName}
            />
            <div className={classes.starGroup}>
              <Box fontSize={10.5} mr={"2px"}>
                🌟{" "}
              </Box>
              <Box fontSize={15.74} mr={"2px"} pt={1}>
                🌟{" "}
              </Box>
              <Box fontSize={10.5}>🌟 </Box>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}
