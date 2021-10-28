import React from "react";
import Box from "shared/ui-kit/Box";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import { collectionNFTCardStyles } from "./index.styles";
import Tooltip from '@material-ui/core/Tooltip';

export default function CollectionNFTCard({
  item,
  handleSelect,
  hiddenHeader = false,
  customWidth = "",
  customHeight = "",
}) {
  const classes = collectionNFTCardStyles({ hiddenHeader, customWidth, customHeight });

  return (
    <Box display="flex" flexDirection="column" alignItems="center" onClick={handleSelect}>
      <div className={classes.card}>
        <div className={classes.innerBox}>
            <Box display="flex" justifyContent="space-between" alignItems="baseline" width={1} mb={"8px"}>
              <Tooltip title={`${item.name} #${item.NftId}`}>
                <div className={classes.ntfName}>{`${item.name} #${item.NftId}`}</div>
              </Tooltip>
              {!hiddenHeader && (
                <div className={classes.verifiedSection}>{item.isVerified ? "Verified" : "Unverified"}</div>
              )}
            </Box>
          <img
            src={item?.Url ? item.Url : require(`assets/backgrounds/digital_art_1.png`)}
            alt={item.MediaName}
          />
          <Box display="flex" flexDirection="column" width={"90%"} mt={"8px"}>
            <Box display="flex" justifyItems="center" justifyContent="space-between" mt={"5px"}>
              <div className={classes.typo1}>Owner</div>
              <div className={classes.typo2}>{`${item.OwnerSupply || 0} JOTs`}</div>
            </Box>
            <Box display="flex" justifyItems="center" justifyContent="space-between" mt={"5px"}>
              <div className={classes.typo1}>Available</div>
              <div className={classes.typo2}>{`${Number(item.SellingSupply) - Number(item.SoldSupply)} JOTs`}</div>
            </Box>
            <Box display="flex" justifyItems="center" justifyContent="space-between" mt={"5px"}>
              <div className={classes.typo1}>Price</div>
              <div className={classes.typo2}>{`${item.Price || 0} USDT/JOT`}</div>
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
