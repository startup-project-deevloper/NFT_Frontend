import React, { useState, useContext } from "react";
import cls from "classnames";
import { useMediaQuery, useTheme } from "@material-ui/core";

import { useHistory, useLocation } from "react-router";
import Box from "shared/ui-kit/Box";
import DigitalArtContext from "shared/contexts/DigitalArtContext";
import { useNFTPositionManagerPageStyles } from "./index.styles";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import CollateralisedLoans from "./components/CollateralisedLoans";
import FractionalLoans from "./components/FractionalLoans";

const Tabs = ["collateralised loans", "Fractional  Loans"];

const NFTPositionManagerPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));

  const classes = useNFTPositionManagerPageStyles();
  const history = useHistory();
  const location: any = useLocation<Location>();
  const initTab = location.state?.tabId ?? 0;

  const { setOpenFilters } = useContext(DigitalArtContext);

  const [selectedTab, setSelectedTab] = useState<number>(initTab);

  React.useEffect(() => {
    setOpenFilters(false);
  }, []);

  return (
    <>
      <div className={classes.main}>
        <div className={classes.content}>
          <img src={require("assets/icons3d/vault.png")} alt="" className={classes.absoluteImage} />
          <Box pl={4}>
            <BackButton purple overrideFunction={() => history.push("/loan")} />
            <h2>✨ Manage Your Loans</h2>
          </Box>

          <Box mt={isMobile ? 5 : 7} width="100%" padding={isMobile ? "0 15px" : "0 42px"} style={{ borderBottom: "1px solid #431AB720" }}>
            <Box display="flex" width="100%">
              {Tabs.map((tab, index) => (
                <div
                  key={`tab-${index}`}
                  className={cls({ [classes.selectedTab]: index === selectedTab }, classes.tab)}
                  onClick={() => {
                    setSelectedTab(index);
                  }}
                >
                  {tab.toUpperCase()}
                </div>
              ))}
            </Box>
          </Box>

          {selectedTab === 0 && (
            <CollateralisedLoans />
          )}
          {selectedTab === 1 && (
            <FractionalLoans />
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(NFTPositionManagerPage);
