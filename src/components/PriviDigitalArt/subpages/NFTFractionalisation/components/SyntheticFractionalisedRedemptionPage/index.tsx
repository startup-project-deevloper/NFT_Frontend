import React, { useState, useEffect, useRef } from "react";
import Web3 from "web3";
import Carousel from "react-elastic-carousel";
import Pagination from "@material-ui/lab/Pagination";
import axios from 'axios'

import { createTheme, useMediaQuery } from "@material-ui/core";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import URL from "shared/functions/getURL";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { useWeb3React } from "@web3-react/core";
import { BlockchainNets } from "shared/constants/constants";
import { CustomTable, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { SyntheticFractionalisedRedemptionPageStyles } from "./index.styles";
import CollectionNFTCard from "../../../../components/Cards/CollectionNFTCard";
import RedeemJotsModal from "components/PriviDigitalArt/modals/RedeemJotsModal";

const ROWS_PER_PAGE = 20;

export default ({ collection }) => {
  const [nfts, setNFTs] = useState<any[]>([]);
  const classes = SyntheticFractionalisedRedemptionPageStyles();
  const [historyRows, setHistoryRows] = useState<any>([]);
  const [openRedeemJotsModal, setOpenRedeemJotsModal] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<number>(1);
  const [totalLiquidityToRedeem, setTotalLiquidityToRedeem] = useState<number>(0);
  const [jotsToRedeem, setJotsToRedeem] = useState<number>(0);
  const [loadingNFTs, setLoadingNFTs] = useState<boolean>(false);
  const lastIdRef = useRef(null);
  const hasMoreRef = useRef(null);

  const { account, library, chainId } = useWeb3React();
  const theme = createTheme({
    breakpoints: {
      keys: ["xs", "sm", "md", "lg", "xl"],
      values: { xs: 0, sm: 658, md: 769, lg: 860, xl: 1200 },
    },
  });
  const isNormalScreen = useMediaQuery(theme.breakpoints.down(1800));
  const isTablet = useMediaQuery(theme.breakpoints.down(1420));
  const isNarrow = useMediaQuery(theme.breakpoints.down(860));
  const isMobile = useMediaQuery(theme.breakpoints.down(650));

  const itemsToShow = isMobile ? 1 : isNarrow ? 2 : isTablet ? 3 : isNormalScreen ? 4 : 5;
  const carouselRef = useRef<any>();
  const tableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "Type",
      headerAlign: "center",
    },
    {
      headerName: "Token Amount",
      headerAlign: "center",
    },
    {
      headerName: "Redemption  Rate",
      headerAlign: "center",
    },
    {
      headerName: "Account",
      headerAlign: "center",
    },
    {
      headerName: "Time",
      headerAlign: "center",
    },
    {
      headerName: "Polygon Scan",
      headerAlign: "center",
    },
  ];

  const setShowAllNFTs = () => {};

  useEffect(() => {
    setHistoryRows(
      new Array(0).fill([
        {
          cellAlign: "center",
          cell: "Redemption",
        },
        {
          cellAlign: "center",
          cell: "20 JOTs",
        },
        {
          cellAlign: "center",
          cell: "24 55O USDT/JOT",
        },
        {
          cellAlign: "center",
          cell: "0xeec9...82f8",
        },
        {
          cellAlign: "center",
          cell: "2 minutes ago",
        },
        {
          cellAlign: "center",
          cell: (
            <div className={classes.explorerImg} onClick={() => {}}>
              <img src={require("assets/icons/polygon_scan.png")} />
            </div>
          ),
        },
      ])
    );
  }, []);

  useEffect(() => {
    getRedeemData();
    loadNFTs(collection.id)
  }, [])

  const loadNFTs = id => {
    if (!id) return;
    setLoadingNFTs(true);

    const config = {
      lastId: lastIdRef.current,
    };

    axios
      .post(`${URL()}/syntheticFractionalize/getSyntheticCollectionNFTs/${id}`, config)
      .then(res => {
        const data = res.data;
        if (data.success) {
          const newNFTs = data.data;
          const newData: any[] = [...newNFTs];
          setNFTs(newData);
          lastIdRef.current = data.lastId;
          hasMoreRef.current = data.hasMore;
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoadingNFTs(false);
      });
  };

  const getRedeemData = async () => {
    const targetChain = BlockchainNets[1];

    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);
    
    const total = await web3APIHandler.RedemptionPool.getTotalLiquidityToRedeem(web3, collection);

    if (total) {
      setTotalLiquidityToRedeem(total)
    }

    const jotsToRedeem = await web3APIHandler.RedemptionPool.getJotsToRedeem(web3, collection);

    if (jotsToRedeem) {
      setJotsToRedeem(jotsToRedeem)
    }
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.outBox}>
        <Box className={classes.boxBody}>
          <Box
            className={classes.col_half}
            sx={{ borderRight: "1px solid #ECE8F8", marginY: "15px", paddingY: "5px" }}
          >
            <Box>
              <Box className={classes.h4} pb={1}>
                Amount Available to Redeem
              </Box>
              <Box className={classes.h2} sx={{ fontWeight: 800 }}>
                {totalLiquidityToRedeem} USDT
              </Box>
            </Box>
          </Box>
          <Box className={classes.col_half} sx={{ marginY: "15px", paddingY: "5px" }}>
            <Box className={classes.h4} pb={1}>
              Redeption rate
            </Box>
            <Box className={classes.h2} sx={{ fontWeight: 800, fontFamily: "Agrandir Grand !important" }}>
              <span style={{ fontFamily: "Agrandir GrandHeavy", marginRight: "4px" }}>{jotsToRedeem > 0 ? (totalLiquidityToRedeem/jotsToRedeem) : 0}</span> USDT/JOT
            </Box>
          </Box>
          <PrimaryButton
            size="medium"
            style={{
              background: "#431AB7",
              color: "white",
              borderRadius: "8px",
              padding: "0px 87.5px",
              height: "60px",
            }}
            onClick={() => setOpenRedeemJotsModal(true)}
          >
            Redeem
          </PrimaryButton>
        </Box>
      </Box>
      <Box className={classes.outBox} style={{ background: "white" }}>
        <Box className={classes.nftBoxHeader} mb={4}>
          <span>Withdrawn NFT</span>
          <SecondaryButton
            size="medium"
            onClick={() => setShowAllNFTs()}
            className={`${classes.commonBtn} ${classes.showAllBtn}`}
          >
            Show All
            <Box position="absolute" flexDirection="row" top={0} right={0} pr={2}>
              <ArrowLeftIcon />
            </Box>
          </SecondaryButton>
        </Box>
        <LoadingWrapper loading={loadingNFTs} theme={"blue"}>
          <div className={classes.nftSection}>
            <Carousel
              isRTL={false}
              itemsToShow={itemsToShow}
              pagination={false}
              showArrows={false}
              ref={carouselRef}
              itemPadding={[0, 12]}
            >
              {nfts.filter(nft => nft.isWithdrawn).map((item: any, i: Number) => (
                <div
                  key={item.id}
                  style={{
                    width: "100%",
                    paddingBottom: "15px",
                    display: "flex",
                    justifyContent: isMobile
                      ? "center"
                      : nfts.length === 2 && i === 1
                      ? "flex-end"
                      : nfts.length === 3 && i === 1
                      ? "center"
                      : nfts.length === 3 && i === 2
                      ? "flex-end"
                      : "flex-start",
                  }}
                >
                  <CollectionNFTCard
                    item={item}
                    customWidth="232px"
                    customHeight="345px"
                    handleSelect={() => {}}
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </LoadingWrapper>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box
            className={classes.carouselNav}
            onClick={() => {
              carouselRef.current.slidePrev();
            }}
          >
            <svg
              width="20"
              height="16"
              viewBox="0 0 20 16"
              fill="none"
              stroke="#431AB7"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.14546 14.6185L1.29284 7.98003M1.29284 7.98003L8.14546 1.34155M1.29284 7.98003H18.707"
                strokeWidth="1.5122"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Box>
          <Box
            ml={3}
            className={classes.carouselNav}
            onClick={() => {
              carouselRef.current.slideNext();
            }}
          >
            <svg
              width="20"
              height="16"
              viewBox="0 0 20 16"
              fill="none"
              stroke="#431AB7"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.8545 14.6185L18.7072 7.98003M18.7072 7.98003L11.8545 1.34155M18.7072 7.98003H1.29297"
                strokeWidth="1.5122"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Box>
        </Box>
      </Box>
      <Box className={classes.outBox} style={{ background: "white" }}>
        <div className={classes.h2}>Redemption history</div>
        <div className={classes.table}>
          <CustomTable
            headers={tableHeaders}
            rows={historyRows.slice((activePage - 1) * ROWS_PER_PAGE, activePage * ROWS_PER_PAGE)}
            placeholderText="No history"
          />
          <Box display="flex" m={2} justifyContent="center" width="100%" className={classes.pagination}>
            <Pagination
              count={Math.ceil(historyRows.length / ROWS_PER_PAGE)}
              page={activePage}
              onChange={(_, page) => {
                setActivePage(page);
                //   selectedTableFilter === 0 ? getAirdrops() : getAllocations();
              }}
            />
          </Box>
        </div>
      </Box>
      <RedeemJotsModal
        open={openRedeemJotsModal}
        handleClose={() => setOpenRedeemJotsModal(false)}
        collection={collection}
        jotsBalance={totalLiquidityToRedeem}
      />
    </Box>
  );
};

const ArrowLeftIcon = () => (
  <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
    <path
      d="M8.40262 10.9386C8.59347 10.9386 8.76423 10.8658 8.9149 10.7201L13.6384 6.00419C13.7941 5.85854 13.8719 5.68025 13.8719 5.46931C13.8719 5.26339 13.7941 5.0851 13.6384 4.93443L8.9375 0.241071C8.85212 0.155692 8.76549 0.0941685 8.6776 0.0565011C8.5897 0.0188337 8.49805 0 8.40262 0C8.20173 0 8.03348 0.0652902 7.89788 0.195871C7.76228 0.326451 7.69448 0.492188 7.69448 0.69308C7.69448 0.793527 7.71205 0.887695 7.74721 0.975586C7.78237 1.06348 7.83259 1.14007 7.89788 1.20536L9.50251 2.83259L11.7139 4.8545L10.0374 4.75363L1.22321 4.75363C1.01228 4.75363 0.839007 4.82017 0.703404 4.95326C0.567801 5.08636 0.5 5.25837 0.5 5.46931C0.5 5.68527 0.567801 5.85979 0.703404 5.99289C0.839007 6.12598 1.01228 6.19252 1.22321 6.19252L10.0374 6.19252L11.7203 6.09264L9.50251 8.11356L7.89788 9.74079C7.83259 9.80608 7.78237 9.88267 7.74721 9.97056C7.71205 10.0585 7.69448 10.1526 7.69448 10.2531C7.69448 10.4489 7.76228 10.6122 7.89788 10.7427C8.03348 10.8733 8.20173 10.9386 8.40262 10.9386Z"
      fill="#431AB7"
    />
  </svg>
);
