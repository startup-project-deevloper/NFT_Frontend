import React, { useEffect } from "react";

import Header from "shared/ui-kit/Header/Header";
import PriviDataRouter from "./PriviDataRouter";

import { priviDataStyles } from "./index.styles";
import Axios from "axios";
import URL from "shared/functions/getURL";
import { useHistory } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";

export default function PriviData() {
  const classes = priviDataStyles();

  const history = useHistory();
  const { account } = useWeb3React();

  useEffect(() => {
    const checkStatus = async () => {
      const address = localStorage.getItem("address");
      if ((account && account.length > 0) || address) {
        const res = await Axios.post(`${URL()}/wallet/getEthAddressStatus`, {
          address: account ?? address,
          appName: "PriviData",
        });

        if (res.data.success === true && res.data.data?.status !== "authorized") {
          history.push("/data-connect");
        }
      } else {
        history.push("/data-connect");
      }
    };

    checkStatus();
  }, []);

  return (
    <div className={classes.priviData}>
      <Header />
      <div className={classes.mainContainer}>
        <div className={classes.content}>
          <PriviDataRouter />
        </div>
      </div>
    </div>
  );
}
