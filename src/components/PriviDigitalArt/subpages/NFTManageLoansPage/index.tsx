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
import LendModal from "../NFTLoanAssetDetailPage/modals/LendModal";
import BorrowModal from "../NFTLoanAssetDetailPage/modals/BorrowModal";
import WithdrawModal from "../NFTLoanAssetDetailPage/modals/WithdrawModal";
import RepayModal from "../NFTLoanAssetDetailPage/modals/RepayModal";
import { getCorrectNumber } from "shared/helpers/number";
import PolygonAPI from "shared/services/API/polygon";

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

const NFTManageLoansPage = () => {
  const classes = useManageLoansPageStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const { account, library, chainId } = useWeb3React();
  const [lendingMarkets, setLendingMarkets] = useState([])
  const [borrowMarkets, setBorrowMarkets] = useState([])
  const [totalLendingPrice, setTotalLendingPrice] = useState(0)
  const [totalBorrowPrice, setTotalBorrowPrice] = useState(0)
  const [tableLendingData, setTableLendingData] = useState<Array<Array<CustomTableCellInfo>>>([])
  const [tableBorrowData, setTableBorrowData] = useState<Array<Array<CustomTableCellInfo>>>([])
  const [loadingMarket, setLoadingMarket] = useState<boolean>(false);
  const [lendModalOpen, setLendModalOpen] = useState<boolean>(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState<boolean>(false);
  const [repayModalOpen, setRepayModalOpen] = useState<boolean>(false);
  const [borrowModalOpen, setBorrowModalOpen] = useState<boolean>(false);
  const [market, setMarket] = useState<any>(null);
  const [refreshed, setRefreshed] = useState<boolean>(false);
  const [borrowPower, setBorrowPower] = useState<number>(0);
  const [borrowLimitUsed, setBorrowLimitUsed] = useState<number>(0);
  const [slideMarks, setSlideMarks] = useState<any>([
    {
      value: 0,
      label: "Borrow limit 0",
    },
    {
      value: 100,
      label: "$00.000",
    },
  ])
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
            setAccountLiquidity()
          }
        })
        .catch(err => console.log(err))
        .finally(() => {
          setLoadingMarket(false)
        })
    }
  }, [account, refreshed])

  const setAccountLiquidity = async () => {
    if (library) {
      const web3 = new Web3(library.provider);
      if (account && web3) {
        const account_liquidity = await PolygonAPI.FractionalLoan.getAccountLiquidity(web3, account);
        const borrow_limit_used = await PolygonAPI.FractionalLoan.getBorrowingLimitUsed(web3, account);
        let _slideMarks = JSON.parse(JSON.stringify(slideMarks));
        _slideMarks[0].label = `Borrow limit ${getCorrectNumber(borrow_limit_used / (10 ** 6), 2)}`
        _slideMarks[1].label = `$${getCorrectNumber((Number(account_liquidity[0]) + Number(borrow_limit_used)) / (10 ** 6), 2)}`
        setSlideMarks(_slideMarks)
        setBorrowPower((Number(account_liquidity[0]) + Number(borrow_limit_used)) / (10 ** 6))
        setBorrowLimitUsed(borrow_limit_used / (10 ** 6))
      }
    }
  }

  useEffect(() => {
    if (lendingMarkets?.length > 0) {
      setTableLendingData(
        lendingMarkets.map((item: any, index: any) => (
          [
            {
              cell: (
                <Box color="#431AB7" display="flex" alignItems="center">
                  <img src={item.token_info.ImageUrl} width={26} />
                  <Box ml={1}>{item.token_info.Symbol}</Box>
                </Box>
              ),
            },
            {
              cell: <Box color="#431AB7">{item.reserve_apy * 100}%</Box>,
              cellAlign: "center",
            },
            {
              cell: <Box color="#431AB7">{getCorrectNumber(item.lending_balance / (10 ** item.token_info.Decimals), 2)} {item.token_info.Symbol}</Box>,
              cellAlign: "center",
            },
            {
              cell: (
                <Box display="flex" alignItems="center">
                  <SecondaryButton size="small" style={{ color: "#431AB7", border: "1px solid #431AB7" }} onClick={() => { setMarket(item); setLendModalOpen(true) }}>
                    Lend
                  </SecondaryButton>
                  <SecondaryButton size="small" style={{ color: "#431AB7", border: "1px solid #431AB7" }} onClick={() => { setMarket(item); setWithdrawModalOpen(true) }}>
                    Withdraw
                  </SecondaryButton>
                </Box>
              ),
            },
          ]
        ))
      )
    }

  }, [lendingMarkets])

  useEffect(() => {
    if (borrowMarkets?.length > 0) {
      setTableBorrowData(
        borrowMarkets.map((item: any, index: any) => (
          [
            {
              cell: (
                <Box color="#431AB7" display="flex" alignItems="center">
                  <img src={item.token_info.ImageUrl} width={26} />
                  <Box ml={1}>{item.token_info.Symbol}</Box>
                </Box>
              ),
            },
            {
              cell: <Box color="#431AB7">{item.borrow_apy * 100}%</Box>,
              cellAlign: "center",
            },
            {
              cell: <Box color="#431AB7">{getCorrectNumber(item.borrow_balance / (10 ** item.token_info.Decimals), 2)} {item.token_info.Symbol}</Box>,
              cellAlign: "center",
            },
            {
              cell: (
                <Box display="flex" alignItems="center">
                  <SecondaryButton size="small" style={{ color: "#431AB7", border: "1px solid #431AB7" }} onClick={() => { setMarket(item); setBorrowModalOpen(true) }}>
                    Borrow
                  </SecondaryButton>
                  <SecondaryButton size="small" style={{ color: "#431AB7", border: "1px solid #431AB7" }} onClick={() => { setMarket(item); setRepayModalOpen(true) }}>
                    Repay
                  </SecondaryButton>
                </Box>
              ),
            },
          ]
        ))
      )
    }

  }, [borrowMarkets])

  const borrowLendSuccess = (amount, isLend) => {
    Axios.post(`${URL()}/nftLoan/updateLoanCounter/${market?.token_info?.Address}`, {
      isLend
    })
      .then(res => {
        const data = res.data;
        // if (data.status)
        setRefreshed(!refreshed)
        // getMarket()
      })
      .catch(err => console.log(err))
      .finally(() => {
      });
  }

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
            <div className={classes.typo1}>{getCorrectNumber(totalLendingPrice, 2)} USDTs</div>
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
            <div className={classes.typo1}>{getCorrectNumber(totalBorrowPrice, 2)} USDTs</div>
          </Box>
        </div>
        <div className={classes.slideSection}>
          <GradientSlider
            marks={slideMarks}
            step={1}
            value={getCorrectNumber(borrowLimitUsed / (borrowPower == 0 ? 1 : borrowPower) * 100, 2)}
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
              <CustomTable headers={tableBorrowingHeaders} rows={tableBorrowData} placeholderText="No data" />
            </Box>
          </Grid>
        </Grid>
        <LendModal
          open={lendModalOpen}
          onClose={() => setLendModalOpen(false)}
          onSuccess={(amount) => { borrowLendSuccess(amount, true) }}
          market={market}
        />
        <BorrowModal
          open={borrowModalOpen}
          onClose={() => setBorrowModalOpen(false)}
          onSuccess={(amount) => { borrowLendSuccess(amount, false) }}
          market={market}
        />
        <WithdrawModal
          open={withdrawModalOpen}
          onClose={() => setWithdrawModalOpen(false)}
          onSuccess={(amount) => { borrowLendSuccess(amount, true) }}
          market={market}
        />
        <RepayModal
          open={repayModalOpen}
          onClose={() => setRepayModalOpen(false)}
          onSuccess={(amount) => { borrowLendSuccess(amount, false) }}
          market={market}
        />
      </LoadingWrapper>
    </div>
  );
};

export default NFTManageLoansPage;
