import { useWeb3React } from "@web3-react/core";
import Axios from "axios";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import URL from "shared/functions/getURL";

import Header from "shared/ui-kit/Header/Header";

export default function PriviExchange() {
  const { account } = useWeb3React();
  const history = useHistory();

  useEffect(() => {
    const checkStatus = async () => {
      const address = localStorage.getItem("address");
      if ((account && account.length > 0) || address) {
        const res = await Axios.post(`${URL()}/wallet/getEthAddressStatus`, {
          address: account ?? address,
          appName: "PriviExchange",
        });

        if (res.data.success === true && res.data.data?.status !== "authorized") {
          history.push("/exchange-connect");
        }
      } else {
        history.push("/exchange-connect");
      }
    };

    checkStatus();
  }, []);

  return (
    <div>
      <Header />
      <div>
        <div></div>
      </div>
    </div>
  );
}
