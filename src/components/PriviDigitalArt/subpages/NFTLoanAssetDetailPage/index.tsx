import React, { useEffect, useState } from "react";

import { useMediaQuery, useTheme } from "@material-ui/core";

import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import Box from "shared/ui-kit/Box";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import PrintChart from "shared/ui-kit/Chart/Chart";
import { useAssetDetailPageStyles } from "./index.styles";

const PERIODS = ["Borrowing", "Lending"];

const FreeHoursChartConfig = {
  config: {
    data: {
      labels: [] as any[],
      datasets: [
        {
          type: "line",
          label: "",
          data: [] as any[],
          borderRadius: 7,
          borderWidth: 0,
          backgroundColor: "#DDFF57",
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      bezierCurve: false,
      chartArea: {
        backgroundColor: "#DDFF57",
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
            offset: true,
            display: true,
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
              color: "#7452D322",
              drawBorder: true,
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
    let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight + 300);
    gradient.addColorStop(0, config.data.datasets[index].backgroundColor);
    gradient.addColorStop(1, "#DDFF57");
    config.data.datasets[0].backgroundColor = gradient;
  }

  return config;
};

const ChartLabels = [
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
];

const DetailsData = [
  {
    attribute: "Price",
    value: "$1.00",
  },
  {
    attribute: "Market liquidity",
    value: "2,456,663 USDT",
  },
  {
    attribute: "# of Lenders",
    value: "1235",
  },
  {
    attribute: "# of Borrowers",
    value: "24555",
  },
  {
    attribute: "USDT Borrow CAP",
    value: "$2,456,663",
  },
];

const NFTLoanAssetDetailPage = () => {
  const classes = useAssetDetailPageStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [rewardConfig, setRewardConfig] = useState<any>();
  const [period, setPeriod] = useState<string>(PERIODS[0]);

  useEffect(() => {
    const newRewardConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newRewardConfig.configurer = configurer;
    newRewardConfig.config.data.labels = ChartLabels;
    newRewardConfig.config.data.datasets[0].data = getAllValues();
    newRewardConfig.config.data.datasets[0].backgroundColor = "#DDFF57";
    newRewardConfig.config.options.scales.xAxes[0].offset = true;
    newRewardConfig.config.options.scales.yAxes[0].ticks.display = true;

    setRewardConfig(newRewardConfig);
  }, [period]);

  const getAllValues = React.useCallback(() => {
    const result: number[] = [];
    for (let index = 0; index <= 18; index++) {
      result.push(Math.floor(Math.random() * 100));
    }

    return result;
  }, []);

  const handleChangePeriod = (period: string) => () => {
    setPeriod(period);
  };

  return (
    <div className={classes.root}>
      <BackButton purple />
      <div className={classes.headerSection}>
        <Box display="flex" alignItems="center">
          <img src={require("assets/tokenImages/USDT.png")} width={40} />
          <Box ml={"20px"} mt={0.5}>
            <div className={classes.typo1}>Tether</div>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mt={isMobile ? 2 : 0}>
          <PrimaryButton
            style={{ background: "#431AB7", minWidth: 148 }}
            size={isMobile ? "small" : "medium"}
            onClick={() => {}}
          >
            Borrow
          </PrimaryButton>
          <SecondaryButton
            style={{ color: "#431AB7", borderColor: "#431AB7", minWidth: 148 }}
            size={isMobile ? "small" : "medium"}
            onClick={() => {}}
          >
            Lend
          </SecondaryButton>
        </Box>
      </div>
      <div className={classes.assetInfoSection}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <div className={classes.typo2}>Total Lending</div>
          <div className={classes.typo3}>$245,556,255</div>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" mt={isMobile ? 2 : 0}>
          <div className={classes.typo2}>Total Borrowing</div>
          <div className={classes.typo3}>$245,556,255</div>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" mt={isMobile ? 2 : 0}>
          <div className={classes.typo2}>Lending APY</div>
          <div className={classes.typo3}>3%</div>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" mt={isMobile ? 2 : 0}>
          <div className={classes.typo2}>Borrow APY</div>
          <div className={classes.typo3}>2%</div>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" mt={isMobile ? 2 : 0}>
          <div className={classes.typo2}>Utilisation Ratio</div>
          <div className={classes.typo3}>245556</div>
        </Box>
      </div>
      <div className={classes.chartSection}>
        <div className={classes.controlParentBox}>
          <div className={classes.controlBox}>
            <Box className={classes.liquidityBox}>
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
          </div>
          <Box display="flex" flexDirection="column">
            <div className={classes.graphTitle}>{`${
              period === PERIODS[0] ? PERIODS[0] : PERIODS[1]
            } over time`}</div>
          </Box>
        </div>
        <Box flex={1} width={1} className={classes.chartWrapper}>
          {rewardConfig && <PrintChart config={rewardConfig} />}
        </Box>
      </div>
      <div className={classes.detailTableSection}>
        <div className={classes.typo4}>Details</div>
        <Box width={1} display="flex" flexDirection="column" mt={2}>
          {DetailsData && DetailsData.length > 0 ? (
            DetailsData.map(item => (
              <Box className={classes.detailItemSection}>
                <Box className={classes.typo5} fontWeight={400}>
                  {item.attribute}
                </Box>
                <Box className={classes.typo5} fontWeight={800}>
                  {item.value}
                </Box>
              </Box>
            ))
          ) : (
            <>No Data</>
          )}
        </Box>
      </div>
    </div>
  );
};

export default NFTLoanAssetDetailPage;
