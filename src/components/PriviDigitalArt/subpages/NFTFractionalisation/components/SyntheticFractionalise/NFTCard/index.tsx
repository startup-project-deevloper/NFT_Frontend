import React, { useState, useEffect, useMemo } from "react";
import Box from "shared/ui-kit/Box";
import { normalNFTCardStyles } from "../index.styles";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { onGetNonDecrypt } from "shared/ipfs/get";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import { sanitizeIfIpfsUrl } from "shared/helpers/utils";
import Tooltip from '@material-ui/core/Tooltip';

export default function NFTCard({ item, handleSelect }) {
  const classes = normalNFTCardStyles();
  const { downloadWithNonDecryption } = useIPFS();
  const [imageIPFS, setImageIPFS] = useState({});

  useEffect(() => {
    if (item?.urlIpfsImage) {
      setImageIPFS(item.urlIpfsImage)
    }
  }, [item]);

  const imgSrc = useMemo(() => {
    let src = item?.cid
      ? imageIPFS
      : item?.Type && item?.Type !== "DIGITAL_ART_TYPE"
      ? item?.UrlMainPhoto
      : item?.UrlMainPhoto ?? item?.Url ?? item?.url ?? require(`assets/backgrounds/digital_art_1.png`);
    return sanitizeIfIpfsUrl(src);
  }, [item, imageIPFS]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" onClick={handleSelect}>
      <div
        className={classes.card}
        style={
          item.selected
            ? {
                clipPath: "polygon(100% 0%, 100% 82%,  50% 94%, 0% 82%, 0% 0%)",
                padding: 5,
              }
            : { clipPath: "polygon(100% 0%, 100% 80%,  50% 91%, 0% 80%, 0% 0%)", padding: 8 }
        }
      >
        <div className={item.selected ? classes.selectedCard : ""}>
          <div className={classes.innerBox}>
            <Box display="flex" justifyContent="center" width={1}>
              <Tooltip title={`${item.MediaName} #${item.BlockchainId}`}>
                <div className={classes.ntfName}>{`${item.MediaName} #${item.BlockchainId}`}</div>
              </Tooltip>
            </Box>
            <img src={imgSrc} alt={item.MediaName} />
            <div className={classes.starGroup}>
              <Box fontSize={10} mr={"2px"}>
                🌟{" "}
              </Box>
              <Box fontSize={14} mr={"2px"} pt={1}>
                🌟{" "}
              </Box>
              <Box fontSize={10}>🌟 </Box>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}
