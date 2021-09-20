import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import AppSidebar from "shared/ui-kit/PriviAppSidebar";
import { priviWalletSidebarStyles } from "./index.styles";
import cls from "classnames";
import {
  BridgeIcon,
  DiamondIcon,
  HomeIcon,
  ManagerTransactionsIcon,
  PriviScanIcon,
  SendIcon,
} from "./index.icons";

const TABS = {
  Home: "Home",
  Manager: "Wallet Manager",
  BTC: "Get PRIVI with BTC",
  Transactions: "Transactions",
  Priviscan: "Priviscan",
  Swap: "Privi Bridge",
  Send: "Send Tokens",
  PolygonBridge: "Polygon Bridge",
};

const POLYGON_BRIDGE_URL = process.env.NODE_ENV === 'development' ? 'https://wallet.matic.today/bridge/' : 'https://wallet.matic.network/bridge/';

export default function Sidebar({ handleRefresh }) {
  return <AppSidebar child={<SidebarContent handleRefresh={handleRefresh} />} theme="wallet" />;
}

function SidebarContent({ handleRefresh }) {
  const classes = priviWalletSidebarStyles();

  const [collapseSidebar, setCollapseSidebar] = useState<boolean>(false);

  const history = useHistory();

  return (
    <div className={classes.content}>
      {!collapseSidebar && (
        <div className={classes.options}>
          <ul>
            {Object.keys(TABS).map((key, index) =>
              key === 'PolygonBridge' ? (
                <a
                  className={classes.link}
                  key={`option-${index}`}
                  href={POLYGON_BRIDGE_URL}
                  target="_blank"
                >
                  <PriviScanIcon /> {TABS[key]}
                </a>
              ) : index === 4 ? (
                <a
                  className={cls(
                    {
                      [classes.linkSelected]:
                        history.location.pathname === `/wallet/${key.toLowerCase()}` ||
                        (key === "Home" && history.location.pathname === `/wallet/`),
                    },
                    classes.link
                  )}
                  key={`option-${index}`}
                  href="https://priviscan.io"
                  target="_blank"
                >
                  <PriviScanIcon />
                  PriviScan
                </a>
              ) : (
                <Link
                  key={`option-${index}`}
                  className={cls(
                    {
                      [classes.linkSelected]:
                        history.location.pathname === `/wallet/${key.toLowerCase()}` ||
                        (key === "Home" && history.location.pathname === `/wallet/`),
                    },
                    classes.link
                  )}
                  to={key === "Home" ? `/wallet/` : `/wallet/${key.toLowerCase()}`}
                >
                  {index === 0 ? (
                    <HomeIcon
                      selected={
                        history.location.pathname === `/wallet/${key.toLowerCase()}` ||
                        (key === "Home" && history.location.pathname === `/wallet/`)
                      }
                    />
                  ) : index === 1 || index === 3 ? (
                    <ManagerTransactionsIcon
                      selected={history.location.pathname === `/wallet/${key.toLowerCase()}`}
                    />
                  ) : index === 2 ? (
                    <DiamondIcon
                      selected={history.location.pathname === `/wallet/${key.toLowerCase()}`}
                    />
                  ) : index === 5 ? (
                    <BridgeIcon
                      selected={history.location.pathname === `/wallet/${key.toLowerCase()}`}
                    />
                  ) : (
                    <SendIcon selected={history.location.pathname === `/wallet/${key.toLowerCase()}`} />
                  )}

                  {TABS[key]}
                </Link>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
