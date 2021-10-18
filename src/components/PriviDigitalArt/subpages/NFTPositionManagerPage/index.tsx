import React, { useState, useContext } from "react";
import cls from "classnames";

import { useHistory } from "react-router";
import PositionsManager from "./components/PositionsManager";
import Box from "shared/ui-kit/Box";
import DigitalArtContext from "shared/contexts/DigitalArtContext";
import { useNFTPositionManagerPageStyles } from "./index.styles";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";

const Tabs = ["base NFT loans", "Incremental Loans"];

const NFTPositionManagerPage = () => {
  const classes = useNFTPositionManagerPageStyles();
  const history = useHistory();

  const { setOpenFilters } = useContext(DigitalArtContext);

  const [selectedTab, setSelectedTab] = useState<number>(0);

  React.useEffect(() => {
    setOpenFilters(false);
  }, []);

  return (
    <>
      <div className={classes.main}>
        <div className={classes.content}>
          {/* <BackButton dark overrideFunction={() => history.push("/loan")} /> */}
          <img src={require("assets/icons3d/vault.png")} alt="" className={classes.absoluteImage} />
          <Box display="flex" alignItems="center" pl={4}>
            <h2>✨ Manage your positions</h2>
          </Box>

          <Box mt={7} width="100%">
            <Box px={4} display="flex" width="100%" style={{ borderBottom: "1px solid #431AB720" }}>
              {Tabs.map((tab, index) => (
                <div
                  key={`tab-${index}`}
                  className={cls({ [classes.selectedTab]: index === selectedTab }, classes.tab)}
                  onClick={() => {
                    setSelectedTab(index);
                  }}
                >
                  {tab}
                </div>
              ))}
            </Box>
          </Box>

          {selectedTab === 0 && (
            <PositionsManager />
          )}
        </div>
      </div>
    </>
    // <Box className={classes.main}>
    //   <PositionsManager />
    // </Box>
  );
};

export default React.memo(NFTPositionManagerPage);
