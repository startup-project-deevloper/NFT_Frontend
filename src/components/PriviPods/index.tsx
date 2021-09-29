import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import Header from "shared/ui-kit/Header/Header";

import Sidebar from "./components/Sidebar";
import { priviPodsPageStyles } from "./index.styles";
import PriviPodRouter from "./PriviPodRouter";
import Axios from "axios";
import URL from "shared/functions/getURL";
import { useWeb3React } from "@web3-react/core";

export default function PriviPods() {
  const classes = priviPodsPageStyles();
  const history = useHistory();
  const { account } = useWeb3React();

  useEffect(() => {
    const checkStatus = async () => {
      const address = localStorage.getItem("address");
      if ((account && account.length > 0) || address) {
        const res = await Axios.post(`${URL()}/wallet/getEthAddressStatus`, {
          address: account ?? address,
          appName: "PriviPods",
        });

        if (res.data.success === true && res.data.data?.status !== "authorized") {
          history.push("/pods-connect");
        }
      } else {
        history.push("/pods-connect");
      }
    };

    checkStatus();
  }, []);

  return (
    <div className={classes.priviPods}>
      <Header />
      <div className={classes.contentContainer}>
        <Sidebar />
        <div className={classes.mainContainer}>
          {/* <Hidden mdDown>
            <div className={classes.arrows}>
              <button
                onClick={() => {
                  history.goBack();
                }}
                disabled={history.length === 0}
              >
                <img src={require(`assets/icons/${"arrow"}.png`)} />
              </button>

              <button
                onClick={() => {
                  history.goForward();
                }}
                disabled={history.length === 0}
              >
                <img src={require(`assets/icons/${"arrow"}.png`)} />
              </button>
            </div>
          </Hidden> */}
          <PriviPodRouter />
        </div>
      </div>
    </div>
  );
}
