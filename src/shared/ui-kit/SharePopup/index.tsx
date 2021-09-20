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
    if (process.env.NODE_ENV === "development") return `http://localhost:3001/#/pix`;
    return `https://www.privi.store/#/pix`;
  };

  const handleShareWithQR = () => {
    if (item?.MediaSymbol || item.PodAddress) {
      setShareLink(
        `${getPrefixURL()}/${item.PodAddress ? "pod" : ""}/${item.MediaSymbol || item.PodAddress || item.id}`
      );
    } else {
      setShareLink(`${getPrefixURL()}/pix/pod_post/${item.id}`);
    }
    handleCloseMenu();
    setOpenQrCodeModal(!openQrCodeModal);
  };

  const hideQRCodeModal = () => {
    setOpenQrCodeModal(false);
  };

  const handleOpenShareModal = () => {
    handleCloseMenu();
    if (item?.MediaSymbol || item.PodAddress) {
      shareMediaToSocial(
        item?.MediaSymbol || item.PodAddress,
        item.MediaSymbol ? "Media" : "Pod",
        item.MediaSymbol ? item.Type : "PIX-PODS",
        item.MediaSymbol ? "" : `pix/pod/${item.PodAddress}`
      );
    } else {
      shareMediaToSocial(item.id, "Pod_Post", "PIX-PODS", item.MediaSymbol ? "" : `pix/pod_post/${item.id}`);
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
