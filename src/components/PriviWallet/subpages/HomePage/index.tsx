import React, { useState, useEffect, useRef } from "react";
import { Grid } from "@material-ui/core";
import PrintChart from "shared/ui-kit/Chart/Chart";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import TransHistory from "components/PriviWallet/components/TransHistory";
import { homepageStyles } from "./index.styles";
import Box from "shared/ui-kit/Box";
import MyTokensList from "components/PriviWallet/components/MyTokens";
import { useHistory } from "react-router-dom";
import { MediaEarningsConfig, AssetsConfig } from "./components/ChartsConfig";
import cls from "classnames";
import { useBalances } from "shared/hooks/useBalances";
import { useSelector } from "react-redux";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { RootState } from "store/reducers/Reducer";
import { getTotalBalanceHistoryByType } from "shared/services/API"
import { generateMonthLabelsFromDate, generateDayLabelsFromDate } from "shared/functions/commonFunctions"

const configurer = (config: any, ref: CanvasRenderingContext2D): object => {
  for (let index = 0; index < config.data.datasets.length; index++) {
    let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight);
    gradient.addColorStop(1, `rgba(110, 108, 228, 0.4)`);
    gradient.addColorStop(0.5, `rgba(110, 108, 228, 0)`);
    config.data.datasets[index].backgroundColor = gradient;
  }
  return config;
};

/* ["Crypto", "FT", "Social", "NFT"] */
const tokenTypesFilters = ["Crypto", "NFT"];
const timeFilters = ["7D", "1M", "YTD"];
const timeFiltersDay = [7, 30, 365];

const HomePage = () => {
  const classes = homepageStyles();
  const history = useHistory();

  const user = useSelector((state: RootState) => state.user);
  const userBalances = useSelector((state: RootState) => state.userBalances);
  const { convertTokenToUSD } = useTokenConversion();
  const [assetsRadialConfig, setAssetsRadialConfig] = useState<any>(AssetsConfig);
  const [walletTopBoxFlag, setWalletTopBoxFlag] = useState(true);
  const [dominanceConfig, setDominanceConfig] = useState<any>();

  const balanceHistoryDataRef = useRef<any>();
  const [selectedTokenTypeFilter, setSelectedTokenTypeFilter] = useState<number>(0);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<number>(0);

  const [daily, setDaily] = useState<number>(23);
  const [weekly, setWeekly] = useState<number>(224);
  const [monthly, setMonthly] = useState<number>(22443);
  const [debt, setDebt] = useState<number>(0);
  const { totalBalance } = useBalances();

  // set token type pcts
  useEffect(() => {
    const typeBalanceSum = {};
    for (let obj of Object.values(userBalances)) {
      if (!typeBalanceSum[obj.Type]) typeBalanceSum[obj.Type] = convertTokenToUSD(obj.Token, obj.Balance);
      else typeBalanceSum[obj.Type] += convertTokenToUSD(obj.Token, obj.Balance);
    };
    const labels: any[] = [];
    const data: any[] = [];
    for (let [label, datum] of Object.entries(typeBalanceSum)) {
      labels.push(label);
      data.push(datum);
    }
    const newAssetsConfig = { ...assetsRadialConfig };
    newAssetsConfig.config.data.datasets[0].type = "doughnut";
    newAssetsConfig.config.data.labels = labels;
    newAssetsConfig.config.data.datasets[0].data = data;
    newAssetsConfig.config.data.datasets[0].backgroundColor = ["#7472EF", "#FFC61B", "#6833FE", "#FE83D5"];
    setAssetsRadialConfig(newAssetsConfig);
  }, [userBalances]);

  // get all balance data from a year
  useEffect(() => {
    getTotalBalanceHistoryByType(user.address).then(resp => {
      if (resp?.success) balanceHistoryDataRef.current = resp.data;
    })
  }, [user.address]);

  useEffect(() => {
    const balanceHistoryData = balanceHistoryDataRef.current;
    let balanceHistory: any[] = [];
    if (balanceHistoryData) {
      // filter by type
      balanceHistory = balanceHistoryData[tokenTypesFilters[selectedTokenTypeFilter].toUpperCase()];
      // filter by time
      const daysBefore = timeFiltersDay[selectedTimeFilter];
      const minDayTimestamp = Date.now() - daysBefore * 24 * 3600 * 1000;
      balanceHistory = balanceHistory.filter(point => point.date > minDayTimestamp);
    }
    const values = balanceHistory.map(point => point.balance);
    let labels = balanceHistory.map(point => "");
    if (selectedTimeFilter == 0) labels = generateDayLabelsFromDate(balanceHistory.map(p => p.date), 7);
    else if (selectedTimeFilter == 1) labels = generateDayLabelsFromDate(balanceHistory.map(p => p.date), 15);
    else labels = generateMonthLabelsFromDate(balanceHistory.map(p => p.date));
    const newMediaEarningsConfig = JSON.parse(JSON.stringify(MediaEarningsConfig));
    newMediaEarningsConfig.configurer = configurer;
    newMediaEarningsConfig.config.data.labels = labels;
    newMediaEarningsConfig.config.data.datasets[0].data = values;
    newMediaEarningsConfig.config.data.datasets[0].type = "line";
    newMediaEarningsConfig.config.data.datasets[0].backgroundColor = "#6E6CE4";
    newMediaEarningsConfig.config.data.datasets[0].borderColor = "#6E6CE4";
    newMediaEarningsConfig.config.data.datasets[0].pointBackgroundColor = "#6E6CE4";
    newMediaEarningsConfig.config.data.datasets[0].hoverBackgroundColor = "#6E6CE4";
    setDominanceConfig(newMediaEarningsConfig);
  }, [balanceHistoryDataRef.current, selectedTimeFilter, selectedTokenTypeFilter]);


  const handleWalletTopBoxClose = () => {
    setWalletTopBoxFlag(false);
  };

  const handleClickMyEarnings = () => {
    history.push("/wallet/earnings");
  };

  const handleClickMyWallet = () => {
    history.push("/wallet/manager");
  };

  const handleClickBTC = () => {
    history.push("/wallet/btc");
  };

  return (
    <div className={classes.container}>
      <div className={classes.subContainer}>
        <div className={classes.flexBoxHeader}>
          <div className={classes.totalBalanceBox}>
            <Box>
              <div className={classes.headerTotalBalanceTitle}>Total Balance</div>
              <div className={classes.headerTotalBalanceValue}>${totalBalance?.toLocaleString()}</div>
            </Box>

            <Box>
              <PrimaryButton size="small" onClick={handleClickMyWallet}>
                View My Wallet
              </PrimaryButton>
              <SecondaryButton size="small" onClick={handleClickMyEarnings}>
                My Media Earnings
              </SecondaryButton>
            </Box>
          </div>
          {walletTopBoxFlag && (
            <div className={`${classes.flexBox} ${classes.walletTopBox}`}>
              <img src={require("assets/icons/wallet_top_icon.png")} height="100%" />
              <div className={classes.startNowSection}>
                <div className={classes.topHeaderLabel}>
                  <b>Get Privi</b> using <b>BTC</b> as collateral
                </div>
                <PrimaryButton size="small" onClick={handleClickBTC} style={{ height: 26, marginTop: 11 }}>
                  Start Now
                </PrimaryButton>
              </div>
              <div className={classes.closeButton} onClick={handleWalletTopBoxClose}>
                <img src={require("assets/icons/x_darkblue.png")} className={classes.closeIcon} alt={"x"} />
              </div>
            </div>
          )}
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{ display: "flex" }} sm={4}>
            <Box className={classes.graphBox}>
              <Box className={classes.header1}>All my assets</Box>
              <Box height="100%">
                {assetsRadialConfig && <PrintChart config={assetsRadialConfig} canvasHeight={400} />}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} style={{ display: "flex" }} sm={8}>
            <Box className={classes.graphBox}>
              <Box className={classes.header1} mb="22px">
                Dominance
              </Box>
              <Box display="flex" width="100%" justifyContent="space-between" mb="25px">
                <Box className={classes.mediaFilters}>
                  {tokenTypesFilters.map((filter, index) => (
                    <div
                      className={cls(
                        { [classes.selectedMediaFilter]: index === selectedTokenTypeFilter },
                        classes.mediaFilter
                      )}
                      onClick={() => setSelectedTokenTypeFilter(index)}
                      key={`media-${filter}`}
                    >
                      {filter}
                    </div>
                  ))}
                </Box>

                <Box className={classes.timeFilters}>
                  {timeFilters.map((filter, index) => (
                    <div
                      className={cls(
                        { [classes.selectedTimeFilter]: index === selectedTimeFilter },
                        classes.timeFilter
                      )}
                      onClick={() => setSelectedTimeFilter(index)}
                      key={`time-${filter}`}
                    >
                      {filter}
                    </div>
                  ))}
                </Box>
              </Box>
              <Box style={{ height: "100%" }}>
                {dominanceConfig && <PrintChart config={dominanceConfig} canvasHeight={200} />}
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb="25px">
                <Box display="flex" alignItems="center">
                  <Box mr="46px">
                    <div className={classes.label}>Daily</div>
                    <div className={classes.value}>$ {daily?.toFixed(4)}</div>
                  </Box>
                  <Box mr="46px">
                    <div className={classes.label}>Weekly</div>
                    <div className={classes.value}>$ {weekly?.toFixed(2)}</div>
                  </Box>
                  <Box>
                    <div className={classes.label}>Monthly</div>
                    <div className={classes.value}>$ {monthly?.toFixed(2)}</div>
                  </Box>
                </Box>
                <Box>
                  <div className={classes.label}>Debt</div>
                  <div className={classes.value}>$ {debt?.toFixed(2) ?? "0.00"}</div>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box>
          <MyTokensList />
        </Box>
        <Box style={{ marginTop: "20px" }}>
          <TransHistory />
        </Box>
      </div>
    </div>
  );
};

export default HomePage;
