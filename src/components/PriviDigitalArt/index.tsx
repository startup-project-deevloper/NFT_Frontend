import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";

import { useMediaQuery } from "@material-ui/core";

import DigitalArtContext, {
  SearchDigitalArtFilters,
  initialDigitalArtFilters,
} from "shared/contexts/DigitalArtContext";
import Header from "shared/ui-kit/Header/Header";
import URL from "shared/functions/getURL";
import Filters from "./components/Filters";
import Sidebar from "./components/Sidebar";
import { priviDigitalArtStyles } from "./index.styles";
import { useWeb3React } from "@web3-react/core";
import MobileMenu from "./components/MobileMenu";
import PriviPixRouter from "./PriviPixRouter";

export default function PriviDigitalArt() {
  const classes = priviDigitalArtStyles();
  const isMobileScreen = useMediaQuery("(max-width:375px)");
  const isTableScreen = useMediaQuery("(max-width:768px)");
  const { account } = useWeb3React();
  const history = useHistory();

  const [openFilters, setOpenFilters] = useState<boolean>(false);
  const [showStatus, setShowStatus] = useState<boolean>(true);
  const [filters, setFilters] = useState<SearchDigitalArtFilters>(initialDigitalArtFilters);
  const [refresh, setRefresh] = useState<boolean>(false);
  const handleRefresh = () => {
    setRefresh(true);
  };

  useEffect(() => {
    const checkStatus = async () => {
      const address = localStorage.getItem("address");
      if ((account && account.length > 0) || address) {
        const res = await Axios.post(`${URL()}/wallet/getEthAddressStatus`, {
          address: account ?? address,
          appName: "PriviPix",
        });

        if (res.data.success === true && res.data.data?.status !== "authorized") {
          history.push("/connect");
        }
      } else {
        history.push("/connect");
      }
    };

    checkStatus();
  }, []);

  return (
    <DigitalArtContext.Provider
      value={{
        openFilters,
        setOpenFilters,
        filters,
        setFilters,
        showStatus,
        setShowStatus,
        refresh,
        setRefresh,
      }}
    >
      <Helmet>
        <title>PIX</title>
      </Helmet>
      <div className={classes.priviDigitalArt}>
        <Header handleOpenSearcher={() => history.push("/explorer/")} handleRefresh={handleRefresh} />
        <div className={classes.mainContainer}>
          <div className={classes.content} style={{ flexDirection: isTableScreen ? "column" : "row" }}>
            {isTableScreen && <MobileMenu />}
            {openFilters ? (
              <Filters filters={filters} onFiltersChange={setFilters} showStatus={showStatus} />
            ) : (
              <Sidebar handleRefresh={handleRefresh} />
            )}
            {(isMobileScreen || isTableScreen) && openFilters ? <></> : <PriviPixRouter />}
          </div>
        </div>
      </div>
    </DigitalArtContext.Provider>
  );
}
