import React, { useState } from "react";
import { Divider, Grid } from "@material-ui/core";
import Box from "shared/ui-kit/Box";
import { Color, PrimaryButton } from "shared/ui-kit";
import PrintChart from "shared/ui-kit/Chart/Chart";
import { syntheticFractionalisedTradeJotPageStyles } from "./index.styles";
import { ReactComponent as ArrowUp } from 'assets/icons/arrow_up.svg';
import { ReactComponent as QuickSwapIcon } from 'assets/icons/quick-swap-icon.svg';

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
          borderJoinStyle: "round",
          borderCapStyle: "round",
          borderRadius: Number.MAX_VALUE,
          lineTension: 0.2,
          barPercentage: 0.3,
          borderColor: "#DDFF57",
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
        }
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
            offset: true,
            display: true,
            gridLines: {
              color: "#431AB7",
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
              color: "#431AB7",
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
    let gradient = ref.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, config.data.datasets[index].backgroundColor);
    gradient.addColorStop(0.6, config.data.datasets[index].backgroundColor);
    gradient.addColorStop(1, `${config.data.datasets[index].backgroundColor}33`);
    config.data.datasets[0].backgroundColor = gradient;
  }

  return config;
};
const DAYLABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHLABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function SyntheticFractionalisedTradeJotPage(props: any) {
  const classes = syntheticFractionalisedTradeJotPageStyles();
  const [rewardConfig, setRewardConfig] = React.useState<any>();
  const PERIODS = ["1D", "6D", "YTD"];
  const [period, setPeriod] = React.useState<string>(PERIODS[0]);


  React.useEffect(() => {
    const newRewardConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newRewardConfig.configurer = configurer;
    newRewardConfig.config.data.labels =
      period === PERIODS[0]
        ? getAllHours()
        : period === PERIODS[1]
        ? DAYLABELS.map(item => item.slice(0, 3).toUpperCase())
        : MONTHLABELS.map(item => item.slice(0, 3).toUpperCase());
    newRewardConfig.config.data.datasets[0].data =
      period === PERIODS[0]
        ? getAllValues()
        : period === PERIODS[1]
        ? getAllValuesInWeek()
        : getAllValuesInYear();
    newRewardConfig.config.data.datasets[0].backgroundColor = "#0FCEA6";
    newRewardConfig.config.data.datasets[0].borderColor = "#0FCEA600";
    newRewardConfig.config.data.datasets[0].pointBackgroundColor = "#0FCEA6";
    newRewardConfig.config.data.datasets[0].hoverBackgroundColor = "#0FCEA6";
    newRewardConfig.config.options.scales.xAxes[0].offset = true;
    newRewardConfig.config.options.scales.yAxes[0].ticks.display = true;

    setRewardConfig(newRewardConfig);
  }, [period]);

  const getAllHours = React.useCallback(() => {
    const result: string[] = [];
    for (let index = 1; index <= 23; index++) {
      result.push(index < 10 ? `0${index}` : `${index}`);
    }

    return result;
  }, []);

  const getAllValues = React.useCallback(() => {
    const result: number[] = [];
    for (let index = 1; index <= 23; index++) {
      result.push(Math.floor(Math.random() * 10000));
    }

    return result;
  }, []);

  const getAllValuesInWeek = React.useCallback(() => {
    const result: number[] = [];
    for (let index = 0; index < DAYLABELS.length; index++) {
      result.push(Math.floor(Math.random() * 10000));
    }

    return result;
  }, []);

  const getAllValuesInYear = React.useCallback(() => {
    const result: number[] = [];
    for (let index = 0; index < MONTHLABELS.length; index++) {
      result.push(Math.floor(Math.random() * 10000));
    }

    return result;
  }, []);

  const handleChangePeriod = (period: string) => () => {
    setPeriod(period);
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.infoWrap}>
        <Grid container spacing={2}>
          <Grid item md={5} xs={12}>
            <Box className={classes.leftJots}>
              <Box className={classes.jotWrapper}>
                <Box className={classes.jotLabel}>TVL</Box>
                <Box className={classes.jotTitle}>$245,522.21</Box>
              </Box>
              <Divider color="rgba(0, 0, 0, 0.1)" className={classes.jotDivider} />
              <Box className={classes.jotWrapper}>
                <Box className={classes.jotLabel}>24h Trading Vol</Box>
                <Box className={classes.jotTitle}>$245,522.21</Box>
                <Box className={classes.jotPercent}><ArrowUp /> 0.32%</Box>
              </Box>
              <Divider color="rgba(0, 0, 0, 0.1)" className={classes.jotDivider} />
              <Box className={classes.jotWrapper}>
                <Box className={classes.jotLabel}>7d Trading Vol</Box>
                <Box className={classes.jotTitle}>$245,522.21</Box>
                <Box className={classes.jotPercent}><ArrowUp /> 0.32%</Box>
              </Box>
              <Divider color="rgba(0, 0, 0, 0.1)" className={classes.jotDivider} />
              <Box className={classes.jotWrapper}>
                <Box className={classes.jotLabel}>24h Fees</Box>
                <Box className={classes.jotTitle}>$245,522.21</Box>
                <Box className={classes.jotPercent}><ArrowUp /> 0.32%</Box>
              </Box>
            </Box>
          </Grid>
          <Grid item md={7} xs={12}>
            <Box className={classes.rightChart}>
              <Box className={classes.controlParentBox}>
                <Box display="flex" flexDirection="column">
                  <h2 className={classes.graphTitle}>
                    4245,24 USDC
                  </h2>
                  <p className={classes.graphDesc}>12 Sep 2021</p>
                </Box>
                <Box className={classes.controlBox}>
                  <Box className={classes.liquidityBox}>
                    {PERIODS.map((item, index) => (
                      <button
                        key={`period-button-${index}`}
                        className={`${classes.groupButton} ${
                          item === period && classes.selectedGroupButton
                        }`}
                        onClick={handleChangePeriod(item)}
                        style={{ marginLeft: index > 0 ? "8px" : 0 }}
                      >
                        {item}
                      </button>
                    ))}
                  </Box>
                </Box>
              </Box>
              <Box height={300} width={1} mt={3}>
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
              justifyContent: "center"
            }}
          >
            Trade on <QuickSwapIcon className={classes.swapIcon} /> Quickswap
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
}
