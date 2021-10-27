import React, { useState, useRef } from "react";
import { useHistory } from "react-router";
import { useMediaQuery, useTheme } from "@material-ui/core";

import { useNFTLoansPageStyles } from "../../index.styles";
import LoanCard from "components/PriviDigitalArt/components/Cards/LoanCard";
import DepositNFT from "components/PriviDigitalArt/modals/DepositNFTModal";
import { COLUMNS_COUNT_BREAK_POINTS_FOUR } from "components/PriviDigitalArt/subpages/ExplorePage";

import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import HowItWorksModal from "components/PriviDigitalArt/modals/HowItWorksModal";

export default ({
  setOpenDepositPage,
  reload,
  hotLoans,
  setHotLoans,
  loans,
  setLoans,
  loadingLoans,
  loadingHotLoans,
  handleScroll
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));

  const classes = useNFTLoansPageStyles();
  const [openDepositNFTModal, setOpenDepositNFTModal] = useState<boolean>(false);
  const history = useHistory();

  const [openHowModal, setOpenHowModal] = useState<boolean>(false);

  const handleCloseDepositNFTModal = () => {
    setOpenDepositNFTModal(false);
  };
  const handleOpenDepositNFTModal = () => {
    setOpenDepositNFTModal(true);
  };

  return (
    <div style={{ width: "100%", fontFamily: "Agrandir" }}>
      <div>
        <Box className={classes.loanTopButtonBox}>
          <Box className={classes.btnGroup}>
            <button className={classes.greenButton} onClick={() => setOpenDepositPage(true)}>
              Deposit your NFT
            </button>
            <button
              className={classes.greenButton}
              style={{ color: "white", background: "#431AB7" }}
              onClick={() => history.push({
                pathname: "/loan/positions",
                state: {
                  tabId: 0,
                }
              })}
            >
              Manage positions
            </button>
            {isMobile && (
              <SecondaryButton
                size="medium"
                onClick={() => setOpenHowModal(true)}
                style={{ color: "#431AB7", border: "0.7px solid #431AB7", boxSizing: "border-box", boxShadow: "0px 8px 20px -12px rgba(79, 95, 17, 0.54)", borderRadius: "4px", padding: "0 32px", marginTop:"16px" }}
              >
                How it works?
              </SecondaryButton>
            )}
          </Box>
          {!isMobile && (
            <SecondaryButton
              size="medium"
              onClick={() => setOpenHowModal(true)}
              style={{ color: "#431AB7", border: "0.7px solid #431AB7", boxSizing: "border-box", boxShadow: "0px 8px 20px -12px rgba(79, 95, 17, 0.54)", borderRadius: "4px", padding: "0 32px" }}
            >
              How it works?
            </SecondaryButton>
          )}
        </Box>
      </div>
      <div style={{ width: "100%", padding: "0 24px", color: "#181818", background: "#F6F5F8", fontFamily: "Agrandir" }}>
        <div className={classes.positionTitle}>✨ Hottest Loans</div>
        <LoadingWrapper loading={loadingHotLoans} theme={"blue"}>
          <div className={classes.artCards}>
            <MasonryGrid
              gutter={"24px"}
              data={hotLoans}
              renderItem={(item, index) => (
                <LoanCard
                  item={item}
                  key={`item-${index}`}
                  setItem={newItem => {
                    const newLoans = [...hotLoans];
                    newLoans[index] = newItem;
                    setHotLoans(newLoans);
                  }}
                />
              )}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
            />
          </div>
        </LoadingWrapper>
        <div className={classes.positionTitle}>✨ All</div>
        <LoadingWrapper loading={loadingLoans} theme={"blue"}>
          <div className={classes.artCards}>
            <MasonryGrid
              gutter={"24px"}
              data={loans}
              renderItem={(item, index) => (
                <LoanCard
                  item={item}
                  key={`item-${index}`}
                  setItem={newItem => {
                    const newLoans = [...loans];
                    newLoans[index] = newItem;
                    setLoans(newLoans);
                  }}
                />
              )}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
            />
          </div>
        </LoadingWrapper>
        <DepositNFT open={openDepositNFTModal} onClose={handleCloseDepositNFTModal} reload={reload} />
        {openHowModal && <HowItWorksModal open={openHowModal} handleClose={() => setOpenHowModal(false)} />}
      </div>
    </div>
  );
};
