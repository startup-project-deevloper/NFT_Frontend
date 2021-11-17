import React, { useState, useEffect } from "react";
import { useMediaQuery, useTheme } from "@material-ui/core";
import cls from "classnames";
import { useHistory, useParams } from "react-router";

import { useNFTOptionsStyles } from "./index.styles";
import Box from "shared/ui-kit/Box";
import { SecondaryButton } from "shared/ui-kit";

import ExploreOption from "./components/Explore/ExploreOption";

const NFTOption = () => {
  const theme = useTheme();
  const history = useHistory();
  const { id } = useParams();
  const classes = useNFTOptionsStyles();
  const [selectedTab, setSelectedTab] = useState<"explore">("explore");

  useEffect(() => {
    if (id === "explore") {
      setSelectedTab("explore");
    }
  }, id);

  const handleExploreClick = () => {
    setSelectedTab("explore");
    // history.push("/fractionalise");
  };
  return (
    <>
      <Box className={classes.main}>
        <div className={classes.content}>
          <div className={classes.titleBar}>
            <Box display="flex" flexDirection="column">
              <div className={classes.title}>Not your average NFT marketplace</div>
              <div className={classes.subTitle}>Rent, borrow and reserve to buy later.</div>
            </Box>
            <SecondaryButton
              size="medium"
              className={classes.manageButton}
              onClick={() => {
                history.push("/reserve/manage_nft");
              }}
            >
              <span style={{ margin: "auto", paddingTop: "6px" }}>Manage Your NFTs</span>
            </SecondaryButton>
          </div>
          <Box width="100%" borderBottom="2px solid rgba(196,196,196,0.4)">
            <div className={classes.subTitleSection}>
              <div
                className={cls(
                  { [classes.selectedTabSection]: selectedTab === "explore" },
                  classes.tabSection
                )}
                onClick={handleExploreClick}
              >
                <span>EXPLORE ALL</span>
              </div>
            </div>
          </Box>

          {selectedTab === "explore" && <ExploreOption />}
        </div>
      </Box>
    </>
  );
};

export default NFTOption;
