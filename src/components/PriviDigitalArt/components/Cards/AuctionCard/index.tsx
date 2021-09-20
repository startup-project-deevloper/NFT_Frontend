import React from "react";
import Box from "shared/ui-kit/Box";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import { AuctionCardStyles } from "./index.styles";
import { PrimaryButton } from "shared/ui-kit";
import { getDuration } from "shared/helpers";

export default function AuctionCard({ auction, onClick }) {
  const { isLive, name, owner, MediaName, image, started_at } = auction;
  const classes = AuctionCardStyles({ isLive: isLive });

  return (
    <Box display="flex" flexDirection="column" alignItems="center" onClick={onClick}>
      <div className={classes.card}>
        <div className={classes.innerBox}>
          <Box display="flex" justifyContent="space-between" alignItems="baseline" width={1} mb={"10px"}>
            <div className={classes.ntfName}>{name}</div>
            <div className={classes.verifiedSection}>{isLive ? "Live auction" : "Auction not started"}</div>
          </Box>
          <img src={image} alt={MediaName} />
          <Box display="flex" flexDirection="column" width={"90%"} mt={1}>
            <Box display="flex" justifyItems="center" justifyContent="space-between" mt={"4px"}>
              <div className={classes.typo1}>Reserve Price</div>
              <div className={classes.typo2}>{`${owner} JOTS`}</div>
            </Box>
          </Box>
          <PrimaryButton size="medium">
            {isLive ? (
              <>
                <span>Auction Ending In</span>
                <br />
                <span>{getDuration(new Date(started_at), new Date())}</span>
              </>
            ) : (
              "Start Auction"
            )}
          </PrimaryButton>
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
