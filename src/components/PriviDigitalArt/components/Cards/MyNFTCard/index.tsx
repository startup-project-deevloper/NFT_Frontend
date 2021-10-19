import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "shared/contexts/AuthContext";

import Box from "shared/ui-kit/Box";
import { myNFTCardStyles } from "./index.styles";
import { LockNFTModal } from "components/PriviDigitalArt/subpages/NFTFractionalisation/modals/LockNFTModal";
import { UnlockNFTModal } from "components/PriviDigitalArt/subpages/NFTFractionalisation/modals/UnlockNFTModal";
import { VerifyLockNFTModal } from "components/PriviDigitalArt/subpages/NFTFractionalisation/modals/VerifyNFTLockModal";

interface IProps {
  item: any;
  onLockCompleted?: () => void;
  onUnLockCompleted?: () => void;
  onVerifyCompleted?: () => void;
}

export default function MyNFTCard({ item, onLockCompleted, onUnLockCompleted, onVerifyCompleted }: IProps) {
  const classes = myNFTCardStyles();
  const history = useHistory();
  const { isSignedin } = useAuth();
  const [openLockNFT, setOpenLockNFT] = useState<boolean>(false);
  const [openUnLockNFT, setOpenUnLockNFT] = useState<boolean>(false);
  const [openVerifyLockNFT, setOpenVerifyLockNFT] = useState<boolean>(false);

  const handleNFT = () => {
    if (!item?.isLocked) {
      setOpenLockNFT(true);
    } else {
      setOpenVerifyLockNFT(true);
    }
  };

  const handleUnlockNFT = () => {
    if (item?.isWithdrawn && !item?.isUnlocked) {
      setOpenUnLockNFT(true);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" position="relative">
      <div className={classes.card}>
        <div className={classes.innerBox}>
          <Box display="flex" justifyContent="space-between" alignItems="center" width={1} mb={1}>
            <div className={classes.nftName}>{`${item.collectionName} #${item.NftId}`}</div>
            {item?.isVerified ? (
              item?.isWithdrawn ? (
                <div className={classes.unVerifiedLabel}>
                  <span>Unverified</span>
                </div>
              ) : (
                <div className={classes.lockLabel}>
                  <span>Verified</span>
                </div>
              )
            ) : item?.isLocked ? (
              <div className={classes.lockLabel}>
                <span>Locked</span>
              </div>
            ) : (
              <div className={classes.unLockLabel}>
                <span>Unlocked</span>
              </div>
            )}
          </Box>
          <img
            src={item.imageUrl || require("assets/backgrounds/digital_art_1.png")}
            alt="nft image"
            style={{ borderRadius: 16 }}
          />
          {!item?.isVerified && (
            <div
              className={classes.nftModalButton}
              style={
                item?.isLocked
                  ? { background: "#431AB7", color: "#ffffff" }
                  : { background: "#DDFF57", color: "#431AB7" }
              }
              onClick={handleNFT}
            >
              {item?.isLocked ? "Verify NFT" : "Lock NFT"}
            </div>
          )}
          {item?.isVerified && item?.isWithdrawn && !item?.isUnlocked && (
            <div
              className={classes.nftModalButton}
              style={{ background: "#1DCC00", color: "#ffffff" }}
              onClick={handleUnlockNFT}
            >
              Unlock
            </div>
          )}
          <div className={classes.starGroup} style={{ marginTop: item?.isVerified ? "10px" : 0 }}>
            <Box fontSize={5} mr={"2px"}>
              🌟{" "}
            </Box>
            <Box fontSize={7} mr={"2px"} pt={1}>
              🌟{" "}
            </Box>
            <Box fontSize={5}>🌟 </Box>
          </div>
        </div>
      </div>
      {openLockNFT && (
        <LockNFTModal
          open={openLockNFT}
          onClose={() => setOpenLockNFT(false)}
          nft={item}
          onLockCompleted={onLockCompleted}
          onVerifyCompleted={onVerifyCompleted}
        />
      )}
      {openUnLockNFT && (
        <UnlockNFTModal
          open={openUnLockNFT}
          onClose={() => setOpenUnLockNFT(false)}
          nft={item}
          onUnLockCompleted={onUnLockCompleted}
        />
      )}
      {openVerifyLockNFT && (
        <VerifyLockNFTModal
          open={openVerifyLockNFT}
          onClose={() => setOpenVerifyLockNFT(false)}
          nft={item}
          onVerifyCompleted={onVerifyCompleted}
        />
      )}
    </Box>
  );
}
