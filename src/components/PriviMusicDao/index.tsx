import { useWeb3React } from "@web3-react/core";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import URL from "shared/functions/getURL";
import Header from "shared/ui-kit/Header/Header";

import { priviMusicDaoPageStyles } from "./index.styles";
import PriviMusicDaoRouter from "./PriviMusicDaoRouter";

export default function PriviMusicDao() {
  const classes = priviMusicDaoPageStyles();
  const history = useHistory();
  const { account } = useWeb3React();

  useEffect(() => {
    const checkStatus = async () => {
      const address = sessionStorage.getItem("address");
      if ((account && account.length > 0) || address) {
        const res = await axios.post(`${URL()}/wallet/getEthAddressStatus`, {
          address: account ?? address,
          appName: "PriviTrax",
        });

        if (res.data.success === true && res.data.data?.status !== "authorized") {
          history.push("/trax-connect");
        }
      } else {
        history.push("/trax-connect");
      }
    };

    checkStatus();
  }, []);

  return (
    <div className={classes.priviMusicDao}>
      <Header />
      <div className={classes.mainContainer}>
        <div className={classes.content}>
          <PriviMusicDaoRouter />
        </div>
      </div>
    </div>
  );
}
