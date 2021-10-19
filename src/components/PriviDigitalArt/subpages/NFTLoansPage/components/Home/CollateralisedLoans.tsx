import React, { useState, useRef } from "react";
import { useHistory } from "react-router";

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
    <div style={{ width: "100%", padding: "0 80px" }} onScroll={handleScroll}>
      <Box className={classes.loanTopButtonBox}>
        <Box className={classes.btnGroup}>
          <button className={classes.greenButton} onClick={() => setOpenDepositPage(true)}>
            Deposit your NFT
          </button>
          <button
            className={classes.greenButton}
            style={{ color: "white", background: "#431AB7" }}
            onClick={() => history.push("/loan/positions")}
          >
            Manage your positions
          </button>
        </Box>
        <SecondaryButton
          size="medium"
          onClick={() => setOpenHowModal(true)}
          style={{ color: "#431AB7", border: "1px solid #431AB7" }}
        >
          How it works
        </SecondaryButton>
      </Box>
      <h3>✨ Hottest Loans</h3>
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
      <h3>✨ All</h3>
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
  );
};
