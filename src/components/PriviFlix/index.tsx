import { useWeb3React } from "@web3-react/core";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import URL from "shared/functions/getURL";
import Header from "shared/ui-kit/Header/Header";

import { priviFlixPageStyles } from "./index.styles";
import PriviFlixRouter from "./PriviFlixRouter";

export default function PriviFlix() {
  const classes = priviFlixPageStyles();
  const history = useHistory();
  const { account } = useWeb3React();

  useEffect(() => {
    const checkStatus = async () => {
      const address = localStorage.getItem("address");
      if ((account && account.length > 0) || address) {
        const res = await axios.post(`${URL()}/wallet/getEthAddressStatus`, {
          address: account ?? address,
          appName: "PriviFlix",
        });

        if (res.data.success === true && res.data.data?.status !== "authorized") {
          history.push("/flix-connect");
        }
      } else {
        history.push("/flix-connect");
      }
    };

    checkStatus();
  }, []);

  return (
    <div className={classes.priviFlix}>
      <Header />
      <div className={classes.mainContainer}>
        <div className={classes.content}>
          <PriviFlixRouter />
        </div>
      </div>
    </div>
  );
}
