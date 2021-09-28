import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "shared/contexts/AuthContext";

import Box from "shared/ui-kit/Box";
import { myNFTCardStyles } from "./index.styles";
import { LockNFTModal } from "components/PriviDigitalArt/subpages/NFTFractionalisation/modals/LockNFTModal";
import { VerifyLockNFTModal } from "components/PriviDigitalArt/subpages/NFTFractionalisation/modals/VerifyNFTLockModal";

interface IProps {
  item: any;
  onLockCompleted?: () => void;
}

export default function MyNFTCard({ item, onLockCompleted }: IProps) {
  const classes = myNFTCardStyles();
  const history = useHistory();
  const { isSignedin } = useAuth();
  const [openLockNFT, setOpenLockNFT] = useState<boolean>(false);
  const [openVerifyLockNFT, setOpenVerifyLockNFT] = useState<boolean>(false);

  const handleNFT = () => {
    if (!item?.isLocked) {
      setOpenLockNFT(true);
    } else {
      setOpenVerifyLockNFT(true);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <div className={classes.card}>
        <div className={classes.innerBox}>
          <Box display="flex" justifyContent="space-between" alignItems="baseline" width={1} mb={1}>
            <div className={classes.ntfName}>{item.name}</div>
            {item?.isLocked ? (
              <div className={classes.lockLabel}>
                <span>Locked</span>
              </div>
            ) : (
              <div className={classes.unLockLabel}>
                <span>Unlocked</span>
              </div>
            )}
          </Box>
          <img src={item.image || require("assets/backgrounds/digital_art_1.png")} alt="nft image" />
          <div
            className={classes.nftModalButton}
            style={item?.isLocked ? { background: "#F2C94C" } : { background: "#DDFF57" }}
            onClick={handleNFT}
          >
            {item?.isLocked ? "Verify NFT" : "Lock NFT"}
          </div>
        </div>
      </div>
      <div className={classes.shadow} />
      {openLockNFT && (
        <LockNFTModal
          open={openLockNFT}
          onClose={() => setOpenLockNFT(false)}
          nft={item}
          onLockCompleted={onLockCompleted}
        />
      )}
      {openVerifyLockNFT && (
        <VerifyLockNFTModal open={openVerifyLockNFT} onClose={() => setOpenVerifyLockNFT(false)} nft={item} />
      )}
    </Box>
  );
}
