import { useWeb3React } from "@web3-react/core";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import URL from "shared/functions/getURL";
import Header from "shared/ui-kit/Header/Header";
import { priviDAOStyles } from "./index.styles";
import HomePage from "./subpages/HomePage";
import SearchPage from "./subpages/SearchPage";

export default function PriviDAO() {
  const classes = priviDAOStyles();
  const [openSearcher, setOpenSearcher] = useState<boolean>(false);

  const { account } = useWeb3React();
  const history = useHistory();

  useEffect(() => {
    const checkStatus = async () => {
      const address = localStorage.getItem("address");
      if ((account && account.length > 0) || address) {
        const res = await Axios.post(`${URL()}/wallet/getEthAddressStatus`, {
          address: account ?? address,
          appName: "PriviDAO",
        });

        if (res.data.success === true && res.data.data?.status !== "authorized") {
          history.push("/daos-connect");
        }
      } else {
        history.push("/daos-connect");
      }
    };

    checkStatus();
  }, []);

  return (
    <div className={classes.priviDAO}>
      <Header
        openTab={openSearcher}
        handleOpenSearcher={() => {
          setOpenSearcher(true);
        }}
      />
      <div className={classes.mainContainer}>
        <div className={classes.content}>
          {!openSearcher ? (
            <HomePage />
          ) : (
            <SearchPage
              handleCloseSearcher={() => {
                setOpenSearcher(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
