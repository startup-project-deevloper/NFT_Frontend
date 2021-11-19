import React, { useEffect, useState } from "react";

import { useMediaQuery, useTheme } from "@material-ui/core";

import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import Box from "shared/ui-kit/Box";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { PrimaryButton, SecondaryButton, GradientSlider } from "shared/ui-kit";
import { useManageLoansPageStyles } from "./index.styles";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import URL from "shared/functions/getURL";
import Axios from "axios";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { Grid } from '@material-ui/core';

const SlideMarks = [
  {
    value: 0,
    label: "Borrow limit 0",
  },
  {
    value: 100,
    label: "$00.000",
  },
];

const tableLendingHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerName: "Asset",
  },
  {
    headerName: "APY",
    headerAlign: "center",
  },
  {
    headerName: "Lending",
    headerAlign: "center",
  },
  {
    headerName: "",
    headerAlign: "center",
  },
];

const tableBorrowingHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerName: "Asset",
  },
  {
    headerName: "APY",
    headerAlign: "center",
  },
  {
    headerName: "Lending",
    headerAlign: "center",
  },
  {
    headerName: "",
    headerAlign: "center",
  },
];

const tableLendingData: Array<Array<CustomTableCellInfo>> = [
  [
    {
      cell: (
        <Box color="#431AB7" display="flex" alignItems="center">
          <img src={require("assets/tokenImages/ETH.png")} width={26} />
          <Box ml={1}>ETH</Box>
        </Box>
      ),
    },
    {
      cell: <Box color="#431AB7">2.5%</Box>,
      cellAlign: "center",
    },
    {
      cell: <Box color="#431AB7">0.567 ETH</Box>,
      cellAlign: "center",
    },
    {
      cell: (
        <Box display="flex" alignItems="center">
          <SecondaryButton size="small" style={{ color: "#431AB7", border: "1px solid #431AB7" }}>
            Lend
          </SecondaryButton>
          <SecondaryButton size="small" style={{ color: "#431AB7", border: "1px solid #431AB7" }}>
            Withdraw
          </SecondaryButton>
        </Box>
      ),
    },
  ],
  [
    {
      cell: (
        <Box color="#431AB7" display="flex" alignItems="center">
          <img src={require("assets/tokenImages/USDT.png")} width={26} />
          <Box ml={1}>ETH</Box>
        </Box>
      ),
    },
    {
      cell: <Box color="#431AB7">2.5%</Box>,
      cellAlign: "center",
    },
    {
      cell: <Box color="#431AB7">0.567 ETH</Box>,
      cellAlign: "center",
    },
    {
      cell: (
        <Box display="flex" alignItems="center">
          <SecondaryButton size="small" style={{ color: "#431AB7", border: "1px solid #431AB7" }}>
            Lend
          </SecondaryButton>
          <SecondaryButton size="small" style={{ color: "#431AB7", border: "1px solid #431AB7" }}>
            Withdraw
          </SecondaryButton>
        </Box>
      ),
    },
  ],
];

const tableBorrowingData: Array<Array<CustomTableCellInfo>> = [
  [
    {
      cell: (
        <Box color="#431AB7" display="flex" alignItems="center">
          <img src={require("assets/tokenImages/ETH.png")} width={26} />
          <Box ml={1}>ETH</Box>
        </Box>
      ),
    },
    {
      cell: <Box color="#431AB7">2.5%</Box>,
      cellAlign: "center",
    },
    {
      cell: <Box color="#431AB7">0.567 ETH</Box>,
      cellAlign: "center",
    },
    {
      cell: (
        <Box display="flex" alignItems="center">
          <SecondaryButton size="small" style={{ color: "#431AB7", border: "1px solid #431AB7" }}>
            Borrow
          </SecondaryButton>
          <PrimaryButton size="small" style={{ background: "#431AB7" }}>
            Repay
          </PrimaryButton>
        </Box>
      ),
    },
  ],
  [
    {
      cell: (
        <Box color="#431AB7" display="flex" alignItems="center">
          <img src={require("assets/tokenImages/USDT.png")} width={26} />
          <Box ml={1}>ETH</Box>
        </Box>
      ),
    },
    {
      cell: <Box color="#431AB7">2.5%</Box>,
      cellAlign: "center",
    },
    {
      cell: <Box color="#431AB7">0.567 ETH</Box>,
      cellAlign: "center",
    },
    {
      cell: (
        <Box display="flex" alignItems="center">
          <SecondaryButton size="small" style={{ color: "#431AB7", border: "1px solid #431AB7" }}>
            Borrow
          </SecondaryButton>
          <PrimaryButton size="small" style={{ background: "#431AB7" }}>
            Repay
          </PrimaryButton>
        </Box>
      ),
    },
  ],
];

const NFTManageLoansPage = () => {
  const classes = useManageLoansPageStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const { account, library, chainId } = useWeb3React();
  const [lendingMarkets, setLendingMarkets] = useState([])
  const [borrowMarkets, setBorrowMarkets] = useState([])
  const [totalLendingPrice, setTotalLendingPrice] = useState(0)
  const [totalBorrowPrice, setTotalBorrowPrice] = useState(0)
  const [loadingMarket, setLoadingMarket] = useState<boolean>(false);

  useEffect(() => {
    if (account) {
      setLoadingMarket(true)
      Axios.get(`${URL()}/nftLoan/getFractionalLoansByAddress/${account}`)
        .then(async res => {
          const data = res.data;
          if (data.success) {
            const _lendingMarkets = data.data.lendingMarkets
            const _borrowMarkets = data.data.borrowMarkets
            const _total_lending_price = data.data.total_lending_price
            const _total_borrow_price = data.data.total_borrow_price
            setLendingMarkets(_lendingMarkets)
            setBorrowMarkets(_borrowMarkets)
            setTotalLendingPrice(_total_lending_price)
            setTotalBorrowPrice(_total_borrow_price)
          }
        })
        .catch(err => console.log(err))
        .finally(() => {
          setLoadingMarket(false)
        })
    }
  }, [account])
  return (
    <div className={classes.root}>
      <BackButton purple />
      <LoadingWrapper loading={loadingMarket} theme={"blue"} height="calc(100vh - 100px)">
        <div className={classes.headerSection}>Manage Your Loans</div>
        <div className={classes.balanceSection}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box className={classes.typo2} color="#EF41CB" mb={0.5}>
              Lending Balance
            </Box>
            <div className={classes.typo1}>{totalLendingPrice} USDTs</div>
          </Box>
          <div className={classes.netAPYSection}>
            <div className={classes.gradientSection}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <div className={classes.typo2}>Net APY</div>
                <Box className={classes.typo3} mt={1}>
                  0 %
                </Box>
              </Box>
            </div>
          </div>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box className={classes.typo2} color="#4541FF" mb={0.5}>
              Borrow Balance
            </Box>
            <div className={classes.typo1}>{totalBorrowPrice} USDTs</div>
          </Box>
        </div>
        <div className={classes.slideSection}>
          <GradientSlider
            marks={SlideMarks}
            step={1}
            value={56}
            disabled
            // onChange={(event: any, newValue: number | number[]) => {
            //   setClosenessDegree(newValue as number[]);
            // }}
            className={classes.slider}
            valueLabelDisplay="on"
            style={{ width: "90%" }}
          />
        </div>
        <Grid container spacing={3} className={classes.positionSection}>
          <Grid item sm={12} md={6} >
            <Box className={classes.positionCard}>
              <Box ml={4} mb={4} mt={4}>
                <div className={classes.typo3}>Lending positions</div>
              </Box>
              <CustomTable headers={tableLendingHeaders} rows={tableLendingData} placeholderText="No data" />
            </Box>
          </Grid>
          <Grid item sm={12} md={6}>
            <Box className={classes.positionCard}>
              <Box ml={4} mb={4} mt={4}>
                <div className={classes.typo3}>Borrowing positions</div>
              </Box>
              <CustomTable headers={tableBorrowingHeaders} rows={tableBorrowingData} placeholderText="No data" />
            </Box>
          </Grid>
        </Grid>
      </LoadingWrapper>
    </div>
  );
};

export default NFTManageLoansPage;
