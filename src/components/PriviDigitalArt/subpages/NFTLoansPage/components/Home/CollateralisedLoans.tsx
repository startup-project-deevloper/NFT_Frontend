import React, { useState, useEffect, useRef } from "react";
import Axios from "axios";
import { useHistory } from "react-router";
import URL from "shared/functions/getURL";

import { useNFTLoansPageStyles } from "../../index.styles";
import LoanCard from "components/PriviDigitalArt/components/Cards/LoanCard";
import DepositNFT from "components/PriviDigitalArt/modals/DepositNFTModal";
import { COLUMNS_COUNT_BREAK_POINTS_FOUR } from "components/PriviDigitalArt/subpages/ExplorePage";

import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import HowItWorksModal from "components/PriviDigitalArt/modals/HowItWorksModal";

export default ({ setOpenDepositPage }) => {
  const classes = useNFTLoansPageStyles();
  const [openDepositNFTModal, setOpenDepositNFTModal] = useState<boolean>(false);
  const [hotLoans, setHotLoans] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const history = useHistory();

  const [loadingHotLoans, setLoadingHotLoans] = useState<boolean>(false);
  const [loadingLoans, setLoadingLoans] = useState<boolean>(false);

  const [openHowModal, setOpenHowModal] = useState<boolean>(false);

  const lastIdRef = useRef<string>("");
  const hasMoreRef = useRef<boolean>(true);

  useEffect(() => {
    loadLoans();
    loadHottestLoans();
  }, []);

  const handleCloseDepositNFTModal = () => {
    setOpenDepositNFTModal(false);
  };
  const handleOpenDepositNFTModal = () => {
    setOpenDepositNFTModal(true);
  };

  const loadLoans = () => {
    setLoadingLoans(true);

    const config = {
      params: {
        lastId: lastIdRef.current,
      },
    };

    Axios.get(`${URL()}/nftLoan/getNFTLoans`, config)
      .then(res => {
        const data = res.data;
        if (data.success) {
          const nftLoans = data.data;
          const newData = [...nftLoans];
          setLoans(newData);
          lastIdRef.current = data.lastId;
          hasMoreRef.current = data.hasMore;
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoadingLoans(false);
      });
  };

  const handleScroll = React.useCallback(
    async e => {
      if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 42) {
        if (hasMoreRef.current) loadMore();
      }
    },
    [hasMoreRef.current]
  );

  const reload = () => {
    setLoans([]);
    hasMoreRef.current = true;
    lastIdRef.current = "";
    setTimeout(() => {
      loadLoans();
      loadHottestLoans();
    }, 1000);
  };

  const loadHottestLoans = () => {
    setLoadingHotLoans(true);

    Axios.get(`${URL()}/nftLoan/getHottestNFTLoans`)
      .then(res => {
        const data = res.data;
        if (data.success) {
          const nftLoans = data.data;
          setHotLoans(nftLoans);
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoadingHotLoans(false);
      });
  };

  const loadMore = () => {
    if (!hasMoreRef.current || loadingHotLoans) return;
    setLoadingLoans(true);

    const config = {
      params: {
        lastId: lastIdRef.current,
      },
    };

    Axios.get(`${URL()}/nftLoan/getNFTLoans`, config)
      .then(res => {
        const data = res.data;
        if (data.success) {
          const nftLoans = data.data;
          const newData = [...loans, ...nftLoans];
          setLoans(newData);
          lastIdRef.current = data.lastId;
          hasMoreRef.current = data.hasMore;
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoadingLoans(false);
      });
  };

  return (
    <div style={{ width: "100%" }} onScroll={handleScroll}>
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
