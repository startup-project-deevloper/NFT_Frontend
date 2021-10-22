import React from "react";
import Box from "shared/ui-kit/Box";
import { useStyles } from "./index.styles";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";

export default function NFTCard({ item, handleSelect }) {
  const classes = useStyles();

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
              <div className={classes.ntfName}>{item.nftName}</div>
            </Box>
            <img
              src={item?.nftPictureUrl ?? require(`assets/backgrounds/digital_art_1.png`)}
              alt={item.nftName}
            />
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
