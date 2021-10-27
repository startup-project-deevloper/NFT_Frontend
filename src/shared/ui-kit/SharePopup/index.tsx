import React, { useState } from "react";

import { ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from "@material-ui/core";

import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { ShareWithQRCode } from "shared/ui-kit/Modal/Modals/ShareWithQRCode";

import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

export const SharePopup = ({ item, openMenu, anchorRef, handleCloseMenu }) => {
  const [openQrCodeModal, setOpenQrCodeModal] = useState<boolean>(false);
  const [shareLink, setShareLink] = useState<string>("");
  const { shareMediaToSocial, shareMediaToPrivi } = useShareMedia();

  const [openCopyMessage, setOpenCopyMessage] = useState<boolean>(false);

  const getPrefixURL = () => {
    if (process.env.NODE_ENV === "development") return `http://localhost:3001/#/`;
    return `https://pix.privi.store/#/`;
  };

  const handleShareWithQR = () => {
    if (item?.Type === "SYNTHETIC_FRACTIONALISATION") {
      setShareLink(
        `${getPrefixURL()}fractionalisation/collection/${item.collectionId}/nft/${item.SyntheticID}`
      );
    } else if (item?.Type === "SYNTHETIC_COLLECTION") {
      setShareLink(`${getPrefixURL()}fractionalisation/collection/${item.collectionId}`);
    } else if (item?.Type === "MARKETPLACE") {
      setShareLink(`${getPrefixURL()}marketplace/${item.token_address}/${item.token_id}`);
    } else {
      if (item?.MediaSymbol || item.PodAddress) {
        setShareLink(
          `${getPrefixURL()}${item.PodAddress ? "pod" : "nft"}/${
            item.MediaSymbol || item.PodAddress || item.id
          }`
        );
      } else {
        setShareLink(`${getPrefixURL()}pod_post/${item.id}`);
      }
    }
    handleCloseMenu();
    setOpenQrCodeModal(!openQrCodeModal);
  };

  const hideQRCodeModal = () => {
    setOpenQrCodeModal(false);
  };

  const handleOpenShareModal = () => {
    handleCloseMenu();
    if (item?.Type === "SYNTHETIC_FRACTIONALISATION") {
      shareMediaToSocial(
        "",
        "SYNTHETIC_FRACTIONALISATION",
        "SYNTHETIC_FRACTIONALISATION",
        `fractionalisation/collection/${item.CollectionId}/nft/${item.SyntheticID}`
      );
    } else if (item?.Type === "SYNTHETIC_COLLECTION") {
      shareMediaToSocial(
        "",
        "SYNTHETIC_COLLECTION",
        "SYNTHETIC_COLLECTION",
        `fractionalisation/collection/${item.CollectionId}`
      );
    } else if (item?.Type === "MARKETPLACE") {
      shareMediaToSocial(
        "",
        "MARKETPLACE",
        "MARKETPLACE",
        `marketplace/${item.token_address}/${item.token_id}`
      );
    } else {
      if (item?.MediaSymbol || item.PodAddress) {
        shareMediaToSocial(
          item?.MediaSymbol || item.PodAddress,
          item.MediaSymbol ? "NFT" : "Pod",
          item.MediaSymbol ? item.Type : "PIX-PODS",
          item.MediaSymbol ? "" : `pod/${item.PodAddress}`
        );
      } else if (item?.collection || item?.collection_address) {
        const link = item.collection
          ? `nft/${item.id}?blockchainTag=${item.tag}&collectionTag=${item.collection}`
          : `nft/${item.id}?blockchainTag=${item.tag}`;
        shareMediaToSocial(item.id, "NFT", item.type, link);
      } else {
        shareMediaToSocial(item.id, "Pod_Post", "PIX-PODS", item.MediaSymbol ? "" : `pod_post/${item.id}`);
      }
    }
  };

  const handleOpenPriviShareModal = () => {
    handleCloseMenu();
    shareMediaToPrivi(item);
  };

  const handleCloseCopy = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenCopyMessage(false);
  };

  return (
    <>
      <Popper
        open={openMenu}
        anchorEl={anchorRef.current}
        transition
        disablePortal
        style={{ position: "inherit", zIndex: 9999 }}
        placement="bottom-end"
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleCloseMenu}>
                <MenuList autoFocusItem={openMenu} id="menu-list-grow">
                  <MenuItem onClick={handleOpenPriviShareModal}>
                    <img
                      src={require("assets/icons/spaceship.png")}
                      alt={"spaceship"}
                      style={{ width: 20, height: 20, marginRight: 5 }}
                    />
                    <b style={{ marginRight: 5 }}>{"Share & Earn"}</b> to Privi
                  </MenuItem>
                  <MenuItem onClick={handleOpenShareModal}>
                    <img
                      src={require("assets/icons/butterfly.png")}
                      alt={"spaceship"}
                      style={{ width: 20, height: 20, marginRight: 5 }}
                    />
                    Share on social media
                  </MenuItem>
                  <MenuItem onClick={handleShareWithQR}>
                    <img
                      src={require("assets/icons/qrcode_small.png")}
                      alt={"spaceship"}
                      style={{ width: 20, height: 20, marginRight: 5 }}
                    />
                    Share With QR Code
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      {openCopyMessage && (
        <AlertMessage
          key={Math.random()}
          message={"Link copied successfully!"}
          variant="success"
          onClose={handleCloseCopy}
        />
      )}
      <ShareWithQRCode isOpen={openQrCodeModal} onClose={hideQRCodeModal} shareLink={shareLink} />
    </>
  );
};
