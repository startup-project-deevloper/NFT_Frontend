import React, { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import Discover from "./subpages/Discover";
import MyCollabs from "./subpages/MyCollabs";
import Requested from "./subpages/Requested";
import Accepted from "./subpages/Accepted";
import CreateCollabModal from "./modals/CreateCollab";

import Header from "shared/ui-kit/Header/Header";
import PriviCollabContext from "shared/contexts/PriviCollabContext";

import { priviCollabPageStyles } from "./index.styles";
import { useWeb3React } from "@web3-react/core";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import URL from "shared/functions/getURL";

enum OpenType {
  Discover = "Discover",
  MyCollabs = "My Collabs",
  Requested = "Requested",
  Accepted = "Accepted",
}

export default function PriviData() {
  const classes = priviCollabPageStyles();
  const [openTab, setOpenTab] = useState<any>(OpenType.Discover);
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);

  const { account } = useWeb3React();
  const history = useHistory();

  useEffect(() => {
    const checkStatus = async () => {
      const address = sessionStorage.getItem("address");
      if ((account && account.length > 0) || address) {
        const res = await Axios.post(`${URL()}/wallet/getEthAddressStatus`, {
          address: account ?? address,
          appName: "PriviCollab",
        });

        if (res.data.success === true && res.data.data?.status !== "authorized") {
          history.push("/collabs-connect");
        }
      } else {
        history.push("/collabs-connect");
      }
    };

    checkStatus();
  }, []);

  return (
    <PriviCollabContext.Provider
      value={{
        openTab: openTab,
        setOpenTab: setOpenTab,
        openCreateModal: openCreateModal,
        setOpenCreateModal: setOpenCreateModal,
      }}
    >
      <div className={classes.priviData}>
        <Header openTab={openTab} />
        <div className={classes.mainContainer}>
          <Sidebar />
          <div className={classes.content}>
            {openTab === OpenType.Discover ? (
              <Discover />
            ) : openTab === OpenType.MyCollabs ? (
              <MyCollabs />
            ) : openTab === OpenType.Requested ? (
              <Requested />
            ) : openTab === OpenType.Accepted ? (
              <Accepted />
            ) : null}
          </div>
        </div>
      </div>
      <CreateCollabModal
        open={openCreateModal}
        handleClose={() => setOpenCreateModal(false)}
        handleRefresh={() => {}}
      />
    </PriviCollabContext.Provider>
  );
}
