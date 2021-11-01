import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { useTypedSelector } from "store/reducers/Reducer";

import CreateMediaModal from "../../modals/CreateMediaModal";
import { SellModal } from "../../modals/SellModal";

import styles from "shared/ui-kit/PriviAppSidebar/index.module.css";
import AppSidebar from "shared/ui-kit/PriviAppSidebar";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import { PrimaryButton } from "shared/ui-kit";
import { Widget } from "@maticnetwork/wallet-widget";

const TABS = [
  "HOME",
  "EXPLORE",
  "MARKETPLACE",
  "PODS",
  "NFT LOANS",
  "SAVED CONTENT",
  "NFT OPTIONS",
  "NFT FRACTIONALISATION",
];

export default function Sidebar({ handleRefresh }) {
  const width = useWindowDimensions().width;

  if (width > 768) return <AppSidebar child={<SidebarContent handleRefresh={handleRefresh} />} theme="art" />;
  else return null;
}

const SidebarContent = ({ handleRefresh }) => {
  const user = useTypedSelector(state => state.user);
  const location = useLocation();
  const history = useHistory();

  const [openCreateContentModal, setOpenCreateContentModal] = useState<boolean>(false);
  const [openSellStartAuctionModal, setOpenSellStartAuctionModal] = useState<boolean>(false);

  const getCurrentActiveTab = () => {
    if (location.pathname.includes("explorer")) {
      return TABS[1];
    } else if (location.pathname.includes("marketplace")) {
      return TABS[2];
    } else if (location.pathname.includes("pods")) {
      return TABS[3];
    } else if (location.pathname.includes("loan")) {
      return TABS[4];
    } else if (location.pathname.includes("like")) {
      return TABS[5];
    } else if (location.pathname.includes("option")) {
      return TABS[6];
    } else if (
      location.pathname.includes("fractionalisation") ||
      location.pathname.includes("fractionalise")
    ) {
      return TABS[7];
    }

    return TABS[0];
  };

  const goToPage = value => {
    if (value === TABS[0]) {
      history.push("/");
    } else if (value === TABS[1]) {
      history.push("/explorer");
    } else if (value === TABS[2]) {
      history.push("/marketplace");
    } else if (value === TABS[3]) {
      history.push("/pods");
    } else if (value === TABS[4]) {
      history.push("/loan");
    } else if (value === TABS[5]) {
      history.push("/like");
    } else if (value === TABS[6]) {
      history.push("/option/explore");
    } else if (value === TABS[7]) {
      history.push("/fractionalise");
    }
  };

  const setBridgeWidget = () => {
    const widget = new Widget({
      target: "",
      appName: "priviPix",
      autoShowTime: 0.1,
      position: "center",
      height: 630,
      width: 540,
      overlay: false,
      network: "testnet",
      closable: true,
    });
    widget.create();
  };
  const handleOpenCreateContentModal = () => {
    setOpenCreateContentModal(true);
  };
  const handleOpenSellStartAuctionModal = () => {
    setOpenSellStartAuctionModal(true);
  };
  const handleCloseCreateContentModal = () => {
    setOpenCreateContentModal(false);
  };
  const handleCloseSellStartAuctionModal = () => {
    setOpenSellStartAuctionModal(false);
  };

  return (
    <div className={styles.content}>
      <div className={styles.options}>
        <ul>
          {TABS.map((key, index) => (
            <li
              key={`option-${index}`}
              className={key === getCurrentActiveTab() ? styles.selected : undefined}
              onClick={() => {
                goToPage(key);
              }}
            >
              {key}
            </li>
          ))}
        </ul>
        <ul>
          <li onClick={handleOpenCreateContentModal}>
            <img src={require("assets/icons/add_green.png")} alt="create content" />
            <span style={{ color: "#DDFF57", fontWeight: 400 }}>Create Content</span>
          </li>
          {/* <PrimaryButton
            size="medium"
            onClick={() => setBridgeWidget()}
            style={{
              backgroundColor: "#DDFF57",
              margin: "14px 0 0 14px",
              padding: "8px 24px",
              display: "flex",
              alignItems: "center",
              color: "#431AB7",
              fontSize: "14px",
              borderRadius: "4px",
            }}
          >
            <img
              src={require("assets/icons/polygon_scan.png")}
              style={{
                width: "24px",
                height: "24px",
                marginRight: "16px",
              }}
            />
            Polygon bridge
          </PrimaryButton> */}
        </ul>
      </div>

      {openCreateContentModal && (
        <CreateMediaModal
          open={openCreateContentModal}
          handleClose={handleCloseCreateContentModal}
          handleRefresh={handleRefresh}
        />
      )}
      {openSellStartAuctionModal && (
        <SellModal
          open={openSellStartAuctionModal}
          onClose={handleCloseSellStartAuctionModal}
          handleRefresh={handleRefresh}
        />
      )}
    </div>
  );
};
