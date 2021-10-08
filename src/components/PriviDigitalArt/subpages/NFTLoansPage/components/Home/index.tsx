import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import { useHistory } from "react-router";

import { Grid, Hidden } from "@material-ui/core";

import LoanCard from "components/PriviDigitalArt/components/Cards/LoanCard";
import DepositNFT from "components/PriviDigitalArt/modals/DepositNFTModal";
import { COLUMNS_COUNT_BREAK_POINTS_FOUR } from "components/PriviDigitalArt/subpages/ExplorePage";
import URL from "shared/functions/getURL";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { useNFTLoansPageStyles } from "../../index.styles";

const NFTLoansHome = ({ setOpenDepositPage }) => {
  const classes = useNFTLoansPageStyles();
  const history = useHistory();

  const [loadingHotLoans, setLoadingHotLoans] = useState<boolean>(false);
  const [loadingLoans, setLoadingLoans] = useState<boolean>(false);

  const [hotLoans, setHotLoans] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const lastIdRef = useRef<string>("");
  const hasMoreRef = useRef<boolean>(true);

  const [openDepositNFTModal, setOpenDepositNFTModal] = useState<boolean>(false);
  const handleCloseDepositNFTModal = () => {
    setOpenDepositNFTModal(false);
  };
  const handleOpenDepositNFTModal = () => {
    setOpenDepositNFTModal(true);
  };

  useEffect(() => {
    loadLoans();
    loadHottestLoans();
  }, []);

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

  return (
    <>
      <Ellipse />
      <div className={classes.content} onScroll={handleScroll}>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%">
          <h2>✨ NFT Loans</h2>
          <h5>Deposit your NFTs and get funds from other users bidding!</h5>
        </Box>
        <Grid container className={classes.cardContainer} alignItems="center" spacing={8}>
          <Hidden only="xs">
            <Grid item md={3} />
          </Hidden>
          <Grid
            item
            md={6}
            xs={12}
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <div className={classes.purpleBox}>
              <img
                src={require("assets/icons/governance.svg")}
                alt="heart eyes"
                style={{ width: "110px", height: "102px" }}
              />
              <div>Deposit your NFT as collateral to get a loan.</div>
            </div>
          </Grid>
          <Hidden only="xs">
            <Grid item md={3} />
          </Hidden>
          <Grid
            item
            md={6}
            xs={12}
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <div className={classes.purpleBox}>
              <div>Users can bid for your NFT, the higher bid the more funds!</div>
            </div>
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <div className={classes.purpleBox}>
              <img
                src={require("assets/icons/wallet_simple.svg")}
                alt="wallet"
                style={{ width: "94px", height: "90px" }}
              />
              <div>
                Once the term has ended, you can recover your NFT by returning the loan and the interest
              </div>
            </div>
          </Grid>
        </Grid>

        <div className={classes.buttonGroup}>
          <button className={classes.greenButton} onClick={() => setOpenDepositPage(true)}>
            Deposit your NFT
          </button>
          <button className={classes.greenButton} onClick={() => history.push("/loan/positions")}>
            Manage your positions
          </button>
        </div>

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
      </div>
    </>
  );
};

export default React.memo(NFTLoansHome);

const Ellipse = () => {
  const classes = useNFTLoansPageStyles();

  return (
    <svg
      className={classes.ellipse}
      xmlns="http://www.w3.org/2000/svg"
      width="564"
      height="420"
      viewBox="0 0 564 420"
      fill="none"
    >
      <g filter="url(#filter0_f)">
        <ellipse cx="-120" cy="83" rx="504" ry="157" fill="#DDFF57" />
      </g>
      <defs>
        <filter
          id="filter0_f"
          x="-804"
          y="-254"
          width="1368"
          height="674"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="90" result="effect1_foregroundBlur" />
        </filter>
      </defs>
    </svg>
  );
};
