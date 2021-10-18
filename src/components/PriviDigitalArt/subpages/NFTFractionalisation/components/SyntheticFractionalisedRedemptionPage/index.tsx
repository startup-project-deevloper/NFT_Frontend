import React, { useState, useEffect, useRef } from "react";
import Carousel from "react-elastic-carousel";
import Pagination from "@material-ui/lab/Pagination";

import { createTheme, useMediaQuery } from "@material-ui/core";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { CustomTable, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { SyntheticFractionalisedRedemptionPageStyles } from "./index.styles";
import CollectionNFTCard from "../../../../components/Cards/CollectionNFTCard";
import RedeemJotsModal from "components/PriviDigitalArt/modals/RedeemJotsModal";

const dummyNFTs = [
  {
    MediaName: "NFT Media Name",
    name: "NFT name 1",
  },
  {
    MediaName: "NFT Media Name",
    name: "NFT name 2",
  },
  {
    MediaName: "NFT Media Name",
    name: "NFT name 3",
  },
  {
    MediaName: "NFT Media Name",
    name: "NFT name 4",
  },
];

const ROWS_PER_PAGE = 20;

export default ({ collection }) => {
  const [nfts, setNFTs] = useState(dummyNFTs);
  const classes = SyntheticFractionalisedRedemptionPageStyles();
  const [historyRows, setHistoryRows] = useState<any>([]);
  const [openRedeemJotsModal, setOpenRedeemJotsModal] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<number>(1);

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
      new Array(205).fill([
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

  const handleConfirmRedeem = () => {
    setOpenRedeemJotsModal(false);
  };

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
                6056 USDT
              </Box>
            </Box>
          </Box>
          <Box className={classes.col_half} sx={{ marginY: "15px", paddingY: "5px" }}>
            <Box className={classes.h4} pb={1}>
              Redeption rate
            </Box>
            <Box className={classes.h2} sx={{ fontWeight: 800, fontFamily: "Agrandir Grand !important" }}>
              <span style={{ fontFamily: "Agrandir GrandHeavy", marginRight: "4px" }}>2</span> USDT/JOT
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
        <div className={classes.nftSection}>
          <Carousel
            isRTL={false}
            itemsToShow={itemsToShow}
            pagination={false}
            showArrows={false}
            ref={carouselRef}
            itemPadding={[0, 12]}
          >
            {nfts.map((item: any, i: Number) => (
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
        onConfirm={handleConfirmRedeem}
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

const TableArrowLeftIcon = ({ disabled }: any) => (
  <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.07003 11.4592C5.87919 11.4592 5.70843 11.3864 5.55776 11.2408L0.834264 6.52482C0.678572 6.37917 0.600725 6.20088 0.600725 5.98994C0.600725 5.78402 0.678572 5.60573 0.834264 5.45506L5.53516 0.761701C5.62054 0.676322 5.70717 0.614798 5.79506 0.577131C5.88295 0.539464 5.97461 0.52063 6.07003 0.52063C6.27093 0.52063 6.43917 0.58592 6.57478 0.7165C6.71038 0.847081 6.77818 1.01282 6.77818 1.21371C6.77818 1.31416 6.7606 1.40833 6.72545 1.49622C6.69029 1.58411 6.64007 1.6607 6.57478 1.72599L4.97015 3.35322L2.7588 5.37513L4.43527 5.27426H13.2494C13.4604 5.27426 13.6336 5.3408 13.7693 5.47389C13.9049 5.60699 13.9727 5.779 13.9727 5.98994C13.9727 6.2059 13.9049 6.38042 13.7693 6.51351C13.6336 6.64661 13.4604 6.71315 13.2494 6.71315H4.43527L2.75237 6.61327L4.97015 8.63419L6.57478 10.2614C6.64007 10.3267 6.69029 10.4033 6.72545 10.4912C6.7606 10.5791 6.77818 10.6733 6.77818 10.7737C6.77818 10.9696 6.71038 11.1328 6.57478 11.2634C6.43917 11.394 6.27093 11.4592 6.07003 11.4592Z"
      fill={disabled ? "#2D3047" : "#431AB7"}
    />
  </svg>
);

const TableArrowRightIcon = ({ disabled }: any) => (
  <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.50419 11.4593C8.69503 11.4593 8.86579 11.3864 9.01646 11.2408L13.74 6.52483C13.8956 6.37918 13.9735 6.20089 13.9735 5.98995C13.9735 5.78404 13.8956 5.60575 13.74 5.45508L9.03906 0.761717C8.95368 0.676337 8.86705 0.614814 8.77916 0.577146C8.69127 0.539479 8.59961 0.520645 8.50419 0.520645C8.30329 0.520645 8.13504 0.585935 7.99944 0.716516C7.86384 0.847096 7.79604 1.01283 7.79604 1.21373C7.79604 1.31417 7.81362 1.40834 7.84877 1.49623C7.88393 1.58412 7.93415 1.66071 7.99944 1.726L9.60407 3.35323L11.8154 5.37514L10.139 5.27427H1.32478C1.11384 5.27427 0.940569 5.34082 0.804967 5.47391C0.669364 5.607 0.601562 5.77902 0.601562 5.98995C0.601562 6.20591 0.669364 6.38044 0.804967 6.51353C0.940569 6.64662 1.11384 6.71317 1.32478 6.71317H10.139L11.8218 6.61328L9.60407 8.6342L7.99944 10.2614C7.93415 10.3267 7.88393 10.4033 7.84877 10.4912C7.81362 10.5791 7.79604 10.6733 7.79604 10.7737C7.79604 10.9696 7.86384 11.1328 7.99944 11.2634C8.13504 11.394 8.30329 11.4593 8.50419 11.4593Z"
      fill={disabled ? "#2D3047" : "#431AB7"}
    />
  </svg>
);

const MoreIcon = () => (
  <svg width="19" height="4" viewBox="0 0 19 4" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      id="more"
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2.5 4C3.60457 4 4.5 3.10457 4.5 2C4.5 0.895431 3.60457 0 2.5 0C1.39543 0 0.5 0.895431 0.5 2C0.5 3.10457 1.39543 4 2.5 4ZM11.5 2C11.5 3.10457 10.6046 4 9.5 4C8.39543 4 7.5 3.10457 7.5 2C7.5 0.895431 8.39543 0 9.5 0C10.6046 0 11.5 0.895431 11.5 2ZM18.5 2C18.5 3.10457 17.6046 4 16.5 4C15.3954 4 14.5 3.10457 14.5 2C14.5 0.895431 15.3954 0 16.5 0C17.6046 0 18.5 0.895431 18.5 2Z"
      fill="#2D3047"
    />
  </svg>
);
