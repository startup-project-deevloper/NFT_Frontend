import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import axios from "axios";

import { ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper, withStyles } from "@material-ui/core";

import { useTypedSelector } from "store/reducers/Reducer";
import { setUser } from "store/actions/User";

import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { ShareWithQRCode } from "shared/ui-kit/Modal/Modals/ShareWithQRCode";
import URL from "shared/functions/getURL";
import { gridColumnCount } from "shared/helpers/grid";
import Box from "shared/ui-kit/Box";

import { ReactComponent as QRCodeIcon } from "assets/icons/qrcode.svg";
import { ReactComponent as InfoIcon } from "assets/icons/info-circle.svg";

import { shareMenuStyles } from "./index.styles";

import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    padding: "8px 0",
    margin: "0 16px",
    fontFamily: "Arial",
    borderBottom: "1px solid #EBEBEB",
    minWidth: 295,
    display: "flex",
    alignItems: "center",
    columnGap: 8,
    lineHeight: "120%",
    color: "#181818",
    "& .share-menu-item": {
      width: "100%",
      display: "flex",
      alignItems: "center",
      columnGap: 8,
      padding: 8,
      borderRadius: 4,
      justifyContent: "center",
      "& .info-icon path": {
        fill: "#A4A4A4",
      },
    },
    "& .item-text": {
      fontSize: 14,
      lineHeight: "120%",
      color: "#1A1B1C",
      whiteSpace: "nowrap",
      overflow: "hidden",
      display: "block",
      textOverflow: "ellipsis",
    },
    "&:hover": {
      background: "transparent",
      "& .share-menu-item": {
        background: "#431AB7",
        "& > .item-text": {
          color: "#FFFFFF",
        },
        "& .info-icon path": {
          fill: "#FFFFFF",
        },
      },
    },
    "& .item-subtext": {
      textAlign: "center",
      color: "#A4A4A4",
    },
    "&:first-child": {
      cursor: "default",
      borderBottom: "none",
      paddingBottom: 0,
    },
    "&:last-child": {
      borderBottom: "none",
    },
  },
})(MenuItem);

type PaperProps = {
  type?: "primary" | "secondary";
};

const CustomPaper = styled(Paper)<PaperProps>`
  && {
    width: 350px;
    min-width: 200px;
    max-width: 350px;
    margin-left: ${props => (props.type === "primary" ? "-335px" : "-340px")};
    margin-top: 10px;
    border-radius: 10px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    position: inherit;
    z-index: 999;
  }
`;

export const ShareMenu = ({
  item,
  openMenu,
  anchorRef,
  handleCloseMenu,
  index = 0,
  isLeftAligned = false,
}) => {
  const classes = shareMenuStyles();

  const [openQrCodeModal, setOpenQrCodeModal] = useState<boolean>(false);
  const [shareLink, setShareLink] = useState<string>("");
  const { shareMediaToSocial } = useShareMedia();

  const [openCopyMessage, setOpenCopyMessage] = useState<boolean>(false);

  const user = useTypedSelector(state => state.user);
  const dispatch = useDispatch();

  const getPrefixURL = () => {
    if (process.env.NODE_ENV === "development") return `http://localhost:3001/#/`;
    return `https://pix.privi.store/#/`;
  };

  const handleShareWithQR = () => {
    setShareLink(`${getPrefixURL()}${item.MediaSymbol || item.id}`);
    handleCloseMenu();
    setOpenQrCodeModal(!openQrCodeModal);
  };

  const hideQRCodeModal = () => {
    setOpenQrCodeModal(false);
  };

  const handleOpenShareModal = () => {
    handleCloseMenu();
    shareMediaToSocial(item?.MediaSymbol, "Media", item.Type);
  };

  function handleListKeyDownShareMenu(e: React.KeyboardEvent) {
    if (e.key === "Tab") {
      e.preventDefault();
      handleCloseMenu();
    }
  }

  const handleUnInterested = () => {
    handleCloseMenu();
    axios
      .post(`${URL()}/user/media/uninterested/${user.id}`, { mediaId: item.MediaSymbol || item.id })
      .then(response => {
        if (response.data.success) {
          dispatch(
            setUser({
              ...user,
              uninterestedMedias: response.data.uninterestedMedias,
            })
          );
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleSilence = () => {
    handleCloseMenu();
    axios
      .post(`${URL()}/user/media/silence/${user.id}`, { mediaId: item.MediaSymbol || item.id })
      .then(response => {
        if (response.data.success) {
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleClickCopy = () => {
    setOpenCopyMessage(true);
    setTimeout(() => {
      setOpenCopyMessage(false);
    }, 3000);
  };

  const handleCloseCopy = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenCopyMessage(false);
  };

  const handleEnablePostNotifications = () => {};

  const handleUnfollow = () => {};

  return (
    <>
      <Popper open={openMenu} anchorEl={anchorRef.current} transition disablePortal className={classes.root}>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === "bottom" ? "center top" : "center bottom",
              position: "inherit",
            }}
          >
            <CustomPaper type={!isLeftAligned && index % gridColumnCount() === 1 ? "primary" : "secondary"}>
              <ClickAwayListener onClickAway={handleCloseMenu}>
                <MenuList autoFocusItem={openMenu} id="menu-list-grow" onKeyDown={handleListKeyDownShareMenu}>
                  <CustomMenuItem>
                    <Box width="100%" display="flex" alignItems="center" justifyContent="flex-end">
                      <button className={classes.optionCloseBtn} onClick={handleCloseMenu}>
                        <img src={require("assets/icons/close.svg")} alt={"x"} />
                      </button>
                    </Box>
                  </CustomMenuItem>
                  <CustomMenuItem>
                    <div className="share-menu-item" onClick={handleUnInterested}>
                      <span className={classes.red}>I'm not interested</span>
                    </div>
                  </CustomMenuItem>
                  <CustomMenuItem
                    onClick={() => {
                      navigator.clipboard.writeText(`${getPrefixURL()}${item.MediaSymbol || item.id}`);
                      handleClickCopy();
                    }}
                  >
                    <div className="share-menu-item">
                      <span className="item-text">Copy link</span>
                    </div>
                  </CustomMenuItem>
                  <CustomMenuItem onClick={handleShareWithQR}>
                    <Box className="share-menu-item" flexDirection="column">
                      <span className="item-text">Share With QR</span>
                      <Box className="item-subtext" mt="16px" mb="16px">
                        Dowload your QR code and use it a simple
                        <br />
                        way to give other acces to this media
                      </Box>
                      <QRCodeIcon className={classes.qrIcon} />
                    </Box>
                  </CustomMenuItem>
                  <CustomMenuItem onClick={handleOpenShareModal}>
                    <div className="share-menu-item">
                      {" "}
                      <span className="item-text">Share on...</span>
                    </div>
                  </CustomMenuItem>
                  <CustomMenuItem onClick={handleEnablePostNotifications}>
                    <div className="share-menu-item">
                      <span className="item-text">Enable post notifications</span>
                    </div>
                  </CustomMenuItem>
                  <CustomMenuItem onClick={handleSilence}>
                    <div className="share-menu-item">
                      <span className="item-text">Silence</span>
                    </div>
                  </CustomMenuItem>
                  <CustomMenuItem onClick={handleUnfollow}>
                    <div className="share-menu-item">
                      <span className="item-text">Stop following</span>
                    </div>
                  </CustomMenuItem>
                </MenuList>
              </ClickAwayListener>
            </CustomPaper>
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
