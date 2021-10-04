import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Divider, Grid } from "@material-ui/core";
import Box from "shared/ui-kit/Box";
import { Color, PrimaryButton } from "shared/ui-kit";
import PrintChart from "shared/ui-kit/Chart/Chart";
import { syntheticFractionalisedTradeJotPageStyles } from "./index.styles";
import { ReactComponent as ArrowUp } from "assets/icons/arrow_up.svg";
import { ReactComponent as QuickSwapIcon } from "assets/icons/quick-swap-icon.svg";
import Axios from "axios";
import { PriceFeed_URL, PriceFeed_Token } from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import moment from "moment";

const FreeHoursChartConfig = {
  config: {
    data: {
      labels: [] as any[],
      datasets: [
        {
          type: "line",
          label: "",
          data: [] as any[],
          pointRadius: 0,
          // borderJoinStyle: "round",
          // borderCapStyle: "round",
          // borderRadius: Number.MAX_VALUE,
          // lineTension: 0.2,
          // barPercentage: 0.3,
          borderColor: "#9EACF2",
          borderWidth: 2,
          pointBackgroundColor: "#9EACF2",
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      bezierCurve: false,
      chartArea: {
        backgroundColor: "#FFFFFF",
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 5,
          hoverRadius: 5,
        },
        line: {
          tension: 0,
        },
      },

      legend: {
        display: false,
      },

      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 20,
          bottom: 0,
        },
      },

      scales: {
        xAxes: [
          {
            // offset: true,
            display: true,
            gridLines: {
              color: Color.Purple,
              lineWidth: 50,
            },
            ticks: {
              beginAtZero: false,
              fontColor: "#FFF",
              fontFamily: "Agrandir",
            },
          },
        ],
        yAxes: [
          {
            display: true,
            position: "right",
            gridLines: {
              color: Color.Purple,
              drawBorder: false,
            },
            ticks: {
              display: true,
              fontColor: "#FFF",
              beginAtZero: true,
            },
          },
        ],
      },

      tooltips: {
        mode: "label",
        intersect: false,
        callbacks: {
          //This removes the tooltip title
          title: function () {},
          label: function (tooltipItem, data) {
            return `$${tooltipItem.yLabel.toFixed(4)}`;
          },
        },
        //this removes legend color
        displayColors: false,
        yPadding: 10,
        xPadding: 10,
        position: "nearest",
        caretSize: 10,
        backgroundColor: "rgba(255,255,255,0.9)",
        bodyFontSize: 15,
        bodyFontColor: "#303030",
      },

      plugins: {
        datalabels: {
          display: function (context) {
            return context.dataset.data[context.dataIndex] !== 0;
          },
        },
      },
    },
  },
};

const configurer = (config: any, ref: CanvasRenderingContext2D): object => {
  for (let index = 0; index < config.data.datasets.length; index++) {
    let gradient = ref.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, config.data.datasets[index].backgroundColor);
    gradient.addColorStop(0.8, Color.Purple);
    // gradient.addColorStop(1, `${config.data.datasets[index].backgroundColor}33`);
    gradient.addColorStop(1, Color.Purple);
    config.data.datasets[0].backgroundColor = gradient;
  }

  return config;
};
const DAYLABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SyntheticFractionalisedTradeJotPage({ collection }) {
  const history = useHistory();
  const classes = syntheticFractionalisedTradeJotPageStyles();
  const { id } = useParams();
  const [rewardConfig, setRewardConfig] = useState<any>();
  const PERIODS = ["1h", "1D", "7D"];
  const [period, setPeriod] = useState<string>(PERIODS[0]);
  const UNITS = ["JOTs", "USDT"];
  const [unit, setUnit] = useState<string>(UNITS[0]);
  const [tvl, setTvl] = useState(0);
  const [volume7h, setVolume7h] = useState(0);
  const [volume24h, setVolume24h] = useState(0);
  const [token0Price, setToken0Price] = useState(0);
  const [token1Price, setToken1Price] = useState(0);
  const [loadingTradingInfo, setLoadingTradingInfo] = useState(false);

  useEffect(() => {
    (async () => {
      const newRewardConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
      newRewardConfig.configurer = configurer;
      newRewardConfig.config.data.labels =
        period === PERIODS[0]
          ? getAllHours()
          : period === PERIODS[1]
          ? DAYLABELS.map(item => item.slice(0, 3).toUpperCase())
          : getAllWeeks();
      newRewardConfig.config.data.datasets[0].data =
        period === PERIODS[0]
          ? await getAllValues("hours")
          : period === PERIODS[1]
          ? await getAllValues("days")
          : await getAllValues("weeks");
      newRewardConfig.config.data.datasets[0].backgroundColor = "#908D87";
      newRewardConfig.config.data.datasets[0].borderColor = "#DDFF57";
      newRewardConfig.config.data.datasets[0].pointBackgroundColor = "#DDFF57";
      newRewardConfig.config.data.datasets[0].hoverBackgroundColor = "#DDFF57";
      newRewardConfig.config.options.scales.xAxes[0].offset = true;
      newRewardConfig.config.options.scales.yAxes[0].ticks.display = true;

      setRewardConfig(newRewardConfig);
      fetchTradingInfo();
    })();
  }, [period, unit]);

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
  const getAllMinues = React.useCallback(() => {
    const result: any[] = [];
    for (let index = 0; index <= 11; index++) {
      result.push(5 * index);
    }

    return result;
  }, []);

  const getAllHours = React.useCallback(() => {
    const result: string[] = [];
    for (let index = 1; index <= 23; index++) {
      result.push(index < 10 ? `0${index}` : `${index}`);
    }

    return result;
  }, []);

  const getAllWeeks = React.useCallback(() => {
    const result: string[] = [];
    for (let index = 1; index <= 53; index++) {
      result.push(index < 10 ? `0${index}` : `${index}`);
    }

    return result;
  }, []);

  const getAllValues = React.useCallback(
    async period => {
      try {
        const resp = await Axios.get(
          `${PriceFeed_URL()}/jot/price/${period}?jotAddress=${collection.JotAddress}`,
          {
            headers: {
              Authorization: `Basic ${PriceFeed_Token()}`,
            },
          }
        );
        if (!resp.data.success) {
          return [];
        }
        const data = resp.data.data ?? [];
        // return data.map(item => item.price);

        // Todo: remove dummy data
        return period === PERIODS[0]
          ? getAllHours().map(item => Math.floor(Math.random() * 10000))
          : period === PERIODS[2]
            ? DAYLABELS.map(item => Math.floor(Math.random() * 10000))
            : getAllWeeks().map(item => Math.floor(Math.random() * 10000))
      } catch (e) {
        return [];
      }
    },
    [collection.JotAddress]
  );

  const handleChangePeriod = (period: string) => () => {
    setPeriod(period);
  };
  const handleChangeUnit = (unit: string) => () => {
    setUnit(unit);
  };

  const formatNumber = (num: number, fractionDigits = 5) => {
    return num.toLocaleString(undefined, { minimumFractionDigits: fractionDigits });
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.infoWrap}>
        <Grid container spacing={2}>
          <Grid item md={5} xs={12}>
            <LoadingWrapper loading={loadingTradingInfo}>
              <Box className={classes.leftJots}>
                <Box className={classes.jotWrapper}>
                  <Box className={classes.jotLabel}>TVL</Box>
                  <Box className={classes.jotTitle}>${formatNumber(tvl)}</Box>
                </Box>
                <Divider color="rgba(0, 0, 0, 0.1)" className={classes.jotDivider} />
                <Box className={classes.jotWrapper}>
                  <Box className={classes.jotLabel}>24h Trading Vol</Box>
                  <Box className={classes.jotTitle}>${formatNumber(volume24h)}</Box>
                  <Box className={classes.jotPercent}>
                    <ArrowUp /> 0.32%
                  </Box>
                </Box>
                <Divider color="rgba(0, 0, 0, 0.1)" className={classes.jotDivider} />
                <Box className={classes.jotWrapper}>
                  <Box className={classes.jotLabel}>7d Trading Vol</Box>
                  <Box className={classes.jotTitle}>${formatNumber(volume7h)}</Box>
                  <Box className={classes.jotPercent}>
                    <ArrowUp /> 0.32%
                  </Box>
                </Box>
              </Box>
            </LoadingWrapper>
          </Grid>
          {/* chart gird */}
          <Grid item md={7} xs={12}>
            <Box className={classes.rightChart}>
              {/* top control box */}
              <Box className={classes.controlParentBox}>
                {/* coin + date and unit switch */}
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                  {/* left coin value and date */}
                  <Box display="flex" flexDirection="column">
                    <h2 className={classes.graphTitle}>
                      {unit === "BTC" ? formatNumber(token1Price) : formatNumber(token0Price, 8)}{" "}
                      {unit === "BTC" ? "USDC" : "BTC"}
                    </h2>
                    <p className={classes.graphDesc}>{moment().format("YYYY MMM DD")}</p>
                  </Box>
                </Box>
                {/* right period selector box */}
                <Box className={classes.periodBox}>
                  <Box className={classes.periodButton}>
                    {PERIODS.map((item, index) => (
                      <button
                        key={`period-button-${index}`}
                        className={`${classes.groupButton} ${item === period && classes.selectedGroupButton}`}
                        onClick={handleChangePeriod(item)}
                        style={{ marginLeft: index > 0 ? "8px" : 0 }}
                      >
                        {item}
                      </button>
                    ))}
                  </Box>
                </Box>
              </Box>
              {/* chart */}
              <Box height={300} width={1}>
                {rewardConfig && <PrintChart config={rewardConfig} />}
              </Box>
            </Box>
          </Grid>
        </Grid>
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
              history.push(`/pix/fractionalisation/collection/quick_swap/${id}`);
            }}
          >
            Trade on <QuickSwapIcon className={classes.swapIcon} /> Quickswap
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
}
