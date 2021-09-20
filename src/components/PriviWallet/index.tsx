import React, { useState, useEffect } from "react";
import { Switch, Route, useRouteMatch, useHistory } from "react-router-dom";

import Header from "shared/ui-kit/Header/Header";
import { priviWalletStyles } from "./index.styles";
import HomePage from "./subpages/HomePage";
import EarningsPage from "./subpages/EarningsPage";
import ManagerPage from "./subpages/ManagerPage";
import SwapPage from "./subpages/SwapPage";
import BTCPage from "./subpages/BTCPage";
import SendTokenPage from "./subpages/SendTokens";
import WalletPage from "./subpages/WalletPage";
import Sidebar from "./components/Sidebar";
import WalletContext from "shared/contexts/WalletContext";
import TransactionsPage from "./subpages/TransactionsPage";
import Axios from "axios";
import URL from "shared/functions/getURL";
import { useWeb3React } from "@web3-react/core";

enum OpenType {
  Home = "HOME",
  Manager = "Wallet Manager",
  BTC = "Get PRIVI with BTC",
  Transactions = "Transactions",
  Priviscan = "PriviScan",
  Swap = "Privi Bridge",
  Send = "Send Tokens",
}

export default function PriviWallet() {
  const classes = priviWalletStyles();
  const history = useHistory();

  const [openTab, setOpenTab] = useState<any>({ type: OpenType.Home });
  const [selectedWallet, setSelectedWallet] = useState<any>();
  let { url } = useRouteMatch();
  //console.log(url);
  const handleRefresh = () => {};

  const { account } = useWeb3React();

  useEffect(() => {
    const checkStatus = async () => {
      const address = sessionStorage.getItem("address");
      if ((account && account.length > 0) || address) {
        const res = await Axios.post(`${URL()}/wallet/getEthAddressStatus`, {
          address: account ?? address,
          appName: "PriviWallet",
        });

        if (res.data.success === true && res.data.data?.status !== "authorized") {
          history.push("/wallet-connect");
        }
      } else {
        history.push("/wallet-connect");
      }
    };

    checkStatus();
  }, []);

  useEffect(() => {
    setSelectedWallet(null);
  }, [openTab]);

  const handleViewWallet = item => {
    setSelectedWallet(item);
    history.push("/wallet/wallet");
  };

  return (
    <WalletContext.Provider
      value={{
        openTab: openTab,
        setOpenTab: setOpenTab,
      }}
    >
      <div className={classes.priviWallet}>
        <div className={classes.headerContainer}>
          <Header openTab={openTab} />
        </div>
        <div className={classes.mainContainer}>
          <Sidebar handleRefresh={handleRefresh} />
          <div className={classes.content}>
            <Switch>
              <Route path={`${url}`} exact>
                <HomePage />
              </Route>
              <Route path={`${url}/earnings`}>
                <EarningsPage />
              </Route>
              <Route path={`${url}/manager`}>
                <ManagerPage onViewWallet={handleViewWallet} />
              </Route>
              <Route path={`${url}/btc`}>
                <BTCPage />
              </Route>
              <Route path={`${url}/swap`}>
                <SwapPage />
              </Route>
              <Route path={`${url}/send`}>
                <SendTokenPage />
              </Route>
              <Route path={`${url}/transactions`}>
                <TransactionsPage />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </WalletContext.Provider>
  );
}
