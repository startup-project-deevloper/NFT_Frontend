import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Divider, Grid } from "@material-ui/core";
import Box from "shared/ui-kit/Box";
import { Color, PrimaryButton } from "shared/ui-kit";
import { syntheticFractionalisedTradeJotPageStyles } from "./index.styles";
import { ReactComponent as QuickSwapIcon } from "assets/icons/quick-swap-icon.svg";
import Axios from "axios";
import { PriceFeed_URL, PriceFeed_Token } from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import moment from "moment";
import PriceGraph from "./PriceGraph";

export default function SyntheticFractionalisedTradeJotPage({ collection }) {
  const history = useHistory();
  const classes = syntheticFractionalisedTradeJotPageStyles();
  const { id } = useParams();
  const UNITS = ["JOTs", "USDT"];
  const [unit, setUnit] = useState<string>(UNITS[0]);
  const [tvl, setTvl] = useState(0);
  const [volume7h, setVolume7h] = useState(0);
  const [volume24h, setVolume24h] = useState(0);
  const [token0Price, setToken0Price] = useState(0);
  const [token1Price, setToken1Price] = useState(0);
  const [loadingTradingInfo, setLoadingTradingInfo] = useState(false);
  const [graphData, setGraphData] = useState<any>(null);

  useEffect(() => {
    fetchTradingInfo();
  }, []);

  useEffect(() => {
    (async () => {
      const promises = [
        Axios.get(`${PriceFeed_URL()}/jot/price/hours?jotAddress=${collection.JotAddress}`, {
          headers: {
            Authorization: `Basic ${PriceFeed_Token()}`,
          },
        }),
        Axios.get(`${PriceFeed_URL()}/jot/price/days?jotAddress=${collection.JotAddress}`, {
          headers: {
            Authorization: `Basic ${PriceFeed_Token()}`,
          },
        }),
        Axios.get(`${PriceFeed_URL()}/jot/price/weeks?jotAddress=${collection.JotAddress}`, {
          headers: {
            Authorization: `Basic ${PriceFeed_Token()}`,
          },
        }),
      ];
      const resp = await Promise.all(promises);
      console.log("graph data", resp);

      setGraphData(resp);
    })();
  }, [collection]);

  const fetchPairData = async (token0, token1) => {
    try {
      const resp = await Axios.get(`${PriceFeed_URL()}/quickswap/trading_info`, {
        headers: {
          Authorization: `Basic ${PriceFeed_Token()}`,
        },
        params: {
          token0,
          token1,
        },
      });
      if (!resp.data.success) {
        return null;
      }
      const tradingInfo = Array.isArray(resp.data.data) ? resp.data.data[0] : resp.data.data;
      return tradingInfo;
    } catch (e) {
      return null;
    }
  };
  const fetchTradingInfo = async () => {
    try {
      setLoadingTradingInfo(true);
      const FUNDING_TOKEN = "0x2cA48b8c2d574b282FDAB69545646983A94a3286";
      const token0 = collection.JotAddress.toLowerCase();
      const token1 = FUNDING_TOKEN.toLowerCase(); // USDC
      let tradingInfo = await fetchPairData(token0, token1);
      if (!tradingInfo || !tradingInfo.pairAddress) {
        tradingInfo = await fetchPairData(token1, token0);
      }
      if (tradingInfo?.pairAddress) {
        setTvl(tradingInfo.tvl);
        setVolume7h(tradingInfo.volume7h || 0);
        setVolume24h(tradingInfo.volume24h || 0);
        setToken0Price(tradingInfo.token0Price || 0);
        setToken1Price(tradingInfo.token1Price || 0);
      }
    } catch (err) {
    } finally {
      setLoadingTradingInfo(false);
    }
  };

  const formatNumber = (num: number, fractionDigits = 5) => {
    return num.toLocaleString(undefined, { minimumFractionDigits: fractionDigits });
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.infoWrap}>
        <LoadingWrapper loading={loadingTradingInfo}>
          {!graphData || graphData[0].data.data.length ? (
            <>
              <Grid item md={3} xs={12}>
                <Box className={classes.leftJots}>
                  <Box className={classes.jotWrapper}>
                    <Box className={classes.jotLabel}>TVL</Box>
                    <Box className={classes.jotTitle}>${formatNumber(tvl)}</Box>
                  </Box>
                  <Divider color="rgba(0, 0, 0, 0.1)" className={classes.jotDivider} />
                  <Box className={classes.jotWrapper}>
                    <Box className={classes.jotLabel}>24h Trading Vol</Box>
                    <Box className={classes.jotTitle}>${formatNumber(volume24h)}</Box>
                  </Box>
                  <Divider color="rgba(0, 0, 0, 0.1)" className={classes.jotDivider} />
                  <Box className={classes.jotWrapper}>
                    <Box className={classes.jotLabel}>7d Trading Vol</Box>
                    <Box className={classes.jotTitle}>${formatNumber(volume7h)}</Box>
                  </Box>
                </Box>
              </Grid>
              {/* chart gird */}
              <Grid item md={9} xs={12}>
                <PriceGraph
                  graphData={graphData}
                  title={
                    unit === "BTC" ? `${formatNumber(token1Price)}USDC` : `${formatNumber(token0Price, 8)}BTC`
                  }
                  subTitle={moment().format("YYYY MMM DD")}
                />
              </Grid>
            </>
          ) : null}
        </LoadingWrapper>
      </Box>
      <Box className={classes.outBox}>
        <Box className={classes.boxBody}>
          <PrimaryButton
            size="medium"
            style={{
              background: "#DDFF57",
              width: "100%",
              color: Color.Purple,
              textTransform: "uppercase",
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              history.push(`/fractionalisation/collection/quick_swap/${id}`);
            }}
          >
            Trade on <QuickSwapIcon className={classes.swapIcon} /> Quickswap
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
}
