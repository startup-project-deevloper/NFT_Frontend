import React, { useState, useMemo } from "react";
import Box from "shared/ui-kit/Box";
import { normalNFTCardStyles } from "../index.styles";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import Tooltip from "@material-ui/core/Tooltip";
import { sanitizeIfIpfsUrl } from "shared/helpers/utils";

export default function NFTCard({ item, handleSelect, isSmall = false }) {
  const classes = normalNFTCardStyles();
  const [imageIPFS, setImageIPFS] = useState({});

  const imgSrc = useMemo(() => {
    let src = item.nftPictureUrl ?? require(`assets/backgrounds/digital_art_1.png`);
    return sanitizeIfIpfsUrl(src);
  }, [item]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" onClick={handleSelect}>
      <div className={isSmall ? classes.selectedSmallOuterBox : classes.selectedOuterBox}>
        <div className={`${classes.card} ${item.selected ? classes.selected : ""}`}>
          <div
            className={isSmall ? classes.selectedInnerBox : classes.innerBox}
            style={{ padding: isSmall ? 6 : 16 }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="baseline"
              width={1}
              className={classes.nftNameContainer}
            >
              <Tooltip title={`${item.nftName ?? ""} #${item.nftTokenId}`}>
                <div
                  className={classes.ntfName}
                  style={{
                    fontSize: isSmall ? 8 : 16,
                    lineHeight: isSmall ? "13px" : "21px",
                    marginBottom: isSmall ? 0 : 8,
                  }}
                >{`${item.nftName ?? ""} #${item.nftTokenId}`}</div>
              </Tooltip>
            </Box>
            <img src={imgSrc} alt={item.nftName} />
            <div className={isSmall ? classes.smallStarGroup : classes.starGroup}>
              <Box fontSize={8.5} mr={"2px"}>
                🌟{" "}
              </Box>
              <Box fontSize={13.74} mr={"2px"} pt={1}>
                🌟{" "}
              </Box>
              <Box fontSize={8.5}>🌟 </Box>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}
