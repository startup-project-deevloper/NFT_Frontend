import React, { useEffect, useState } from "react";

import { useMediaQuery, useTheme } from "@material-ui/core";

import { useParams } from "react-router-dom";

import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import Box from "shared/ui-kit/Box";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import PrintChart from "shared/ui-kit/Chart/Chart";
import { useAssetDetailPageStyles } from "./index.styles";
import URL from "shared/functions/getURL";
import Axios from "axios";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import LendModal from "./modals/LendModal";
import BorrowModal from "./modals/BorrowModal";

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
          title: function () { },
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

const _DetailsData = [
  {
    attribute: "Price",
    value: "",
  },
  {
    attribute: "Market liquidity",
    value: "",
  },
  {
    attribute: "# of Lenders",
    value: "",
  },
  {
    attribute: "# of Borrowers",
    value: "",
  },
  {
    attribute: "Borrow CAP",
    value: "",
  },
  {
    attribute: "Interest Paid/Day",
    value: "",
  },
  {
    attribute: "Reserves",
    value: "",
  },
  {
    attribute: "Reserves Factor",
    value: "",
  },
  {
    attribute: "Collateral Factor",
    value: "",
  },
  {
    attribute: "Minted",
    value: "",
  },
  {
    attribute: "Exchange Rate",
    value: "",
  },
];

const NFTLoanAssetDetailPage = () => {
  const classes = useAssetDetailPageStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const params: { assetId?: string } = useParams();
  const [rewardConfig, setRewardConfig] = useState<any>();
  const [period, setPeriod] = useState<string>(PERIODS[0]);
  const [market, setMarket] = useState<any>(null);
  const [loadingMarket, setLoadingMarket] = useState<boolean>(false);
  const [DetailsData, setDetailsData] = useState<any>(_DetailsData);
  const [lendModalOpen, setLendModalOpen] = useState<boolean>(false);
  const [borrowModalOpen, setBorrowModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setLoadingMarket(true)
    Axios.get(`${URL()}/nftLoan/getFractionalLoan/${params?.assetId}`)
      .then(res => {
        const data = res.data;
        if (data.success) {
          const _market = data.data.market
          setMarket(_market)

          const _details_data = JSON.parse(JSON.stringify(DetailsData))
          _details_data[0].value = `$${_market?.token_info?.priceInUsd}`
          _details_data[1].value = `0 ${_market?.token_info?.Symbol}`
          _details_data[2].value = (_market?.lender || 0)
          _details_data[3].value = (_market?.borrower || 0)
          _details_data[4].attribute = `${_market?.token_info?.Symbol} Borrow CAP`
          _details_data[4].value = '$0'
          _details_data[5].value = `0 ${_market?.token_info?.Symbol}`
          _details_data[6].value = `${_market?.borrowList.length > 0 ? _market?.borrowList[0].total_reserves : 0} ${_market?.token_info?.Symbol}`
          _details_data[7].value = `${(_market?.reserve_factor || 0) * 100} %`
          _details_data[8].value = `${(_market?.collateralFactor || 0) * 100} %`
          _details_data[9].attribute = `${_market?.token_info?.Name} Minted`
          _details_data[9].value = `${_market?.token_info?.total_supply || 0}`
          _details_data[10].value = `1 ${_market?.token_info?.Symbol} = $${_market?.token_info?.priceInUsd}`
          setDetailsData(_details_data)
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoadingMarket(false);
      })
  }, [params?.assetId])

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
      <LoadingWrapper loading={loadingMarket} theme={"blue"} height="calc(100vh - 100px)">
        <div className={classes.headerSection}>
          <Box display="flex" alignItems="center">
            <img src={market?.token_info?.ImageUrl} width={40} />
            <Box ml={"20px"} mt={0.5}>
              <div className={classes.typo1}>{market?.token_info?.Name}</div>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" mt={isMobile ? 2 : 0}>
            <PrimaryButton
              style={{ background: "#431AB7", minWidth: 148 }}
              size={isMobile ? "small" : "medium"}
              onClick={() => { setBorrowModalOpen(true)}}
            >
              Borrow
            </PrimaryButton>
            <SecondaryButton
              style={{ color: "#431AB7", borderColor: "#431AB7", minWidth: 148 }}
              size={isMobile ? "small" : "medium"}
              onClick={() => { setLendModalOpen(true) }}
            >
              Lend
            </SecondaryButton>
          </Box>
        </div>
        <div className={classes.assetInfoSection}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <div className={classes.typo2}>Total Lending</div>
            <div className={classes.typo3}>${market?.borrowList?.length > 0 ? market?.borrowList[0]?.total_reserves * market?.token_info.priceInUsd : 0}</div>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" mt={isMobile ? 2 : 0}>
            <div className={classes.typo2}>Total Borrowing</div>
            <div className={classes.typo3}>${market?.borrowList?.length > 0 ? market?.borrowList[0]?.total_borrow * market?.token_info.priceInUsd : 0}</div>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" mt={isMobile ? 2 : 0}>
            <div className={classes.typo2}>Lending APY</div>
            <div className={classes.typo3}>{(market?.reserve_apy || 0) * 100}%</div>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" mt={isMobile ? 2 : 0}>
            <div className={classes.typo2}>Borrow APY</div>
            <div className={classes.typo3}>{(market?.borrow_apy || 0) * 100}%</div>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" mt={isMobile ? 2 : 0}>
            <div className={classes.typo2}>Utility Ratio</div>
            <div className={classes.typo3}>{(market?.borrowList?.length > 0 ? market?.borrowList[0]?.total_borrow : 0) / (market?.borrowList?.length > 0 ? (market?.borrowList[0]?.total_reserves == 0 ? 1 : market?.borrowList[0]?.total_reserves) : 1)}</div>
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
              <div className={classes.graphTitle}>{`${period === PERIODS[0] ? PERIODS[0] : PERIODS[1]
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
        <LendModal
          open={lendModalOpen}
          onClose={() => setLendModalOpen(false)}
          onSuccess={() => {}}
          market={market}
        />
        <BorrowModal
          open={borrowModalOpen}
          onClose={() => setBorrowModalOpen(false)}
          onSuccess={() => {}}
          market={market}
        />
      </LoadingWrapper>
    </div>
  );
};

export default NFTLoanAssetDetailPage;
