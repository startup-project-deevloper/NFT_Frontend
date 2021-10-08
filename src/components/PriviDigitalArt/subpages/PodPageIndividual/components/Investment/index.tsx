import React, { useState, useEffect } from "react";
import { Box, FormControl, Grid, makeStyles } from "@material-ui/core";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import { Gradient, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { investmentStyles } from "./index.styles";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { formatNumber, generateMonthLabelsFromDate } from "shared/functions/commonFunctions";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import TradePodTokenModal from "components/PriviDigitalArt/subpages/PodPageIndividual/components/Investment/TradePodTokenModal";
import {
  getPodPriceHistory,
  getPodBuySellTransactions,
  getPodDistributionInfo,
  getPodInvestmentTransactions,
} from "shared/services/API";
import Moment from "react-moment";
import PrintChart from "shared/ui-kit/Chart/Chart";

const FreeHoursChartConfig = {
  config: {
    data: {
      labels: [] as any[],
      datasets: [
        {
          type: "bar",
          label: "",
          data: [] as any[],
          pointRadius: 0,
          backgroundColor: "#F9E373",
          borderColor: "#F9E373",
          pointBackgroundColor: "#F9E373",
          hoverBackgroundColor: "#F9E373",
          borderJoinStyle: "round",
          borderCapStyle: "round",
          borderWidth: 3,
          cubicInterpolationMode: "monotone",
          lineTension: 0.1,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      chartArea: {
        backgroundColor: "#F7F9FECC",
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 5,
          hoverRadius: 5,
        },
      },

      legend: {
        display: false,
      },

      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 50,
          bottom: 0,
        },
      },

      scales: {
        xAxes: [
          {
            offset: true,
            display: true,
            gridLines: {
              color: "#ffffff",
              lineWidth: 50,
            },
            ticks: {
              beginAtZero: true,
              fontColor: "#6B6B6B",
              fontFamily: "Agrandir",
            },
          },
        ],
        yAxes: [
          {
            display: true,
            gridLines: {
              color: "#EFF2F8",
            },
            ticks: {
              display: true,
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

const RadialConfig = {
  config: {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [] as any,
          backgroundColor: [] as any,
          hoverOffset: 0,
          labels: [] as any,
        },
      ],
    },
    options: {
      cutoutPercentage: 80,
      animation: false,
      rotation: Math.PI / 2,
      tooltips: { enabled: false },
    },
  },
};

const configurer = (config: any, ref: CanvasRenderingContext2D): object => {
  for (let index = 0; index < config.data.datasets.length; index++) {
    let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight);
    gradient.addColorStop(1, `${config.data.datasets[index].backgroundColor}33`);
    gradient.addColorStop(0.5, `${config.data.datasets[index].backgroundColor}b0`);
    config.data.datasets[index].backgroundColor = gradient;
  }

  return config;
};

const TRANSACTIONTABLEHEADER: Array<CustomTableHeaderInfo> = [
  {
    headerName: "TYPE",
    headerAlign: "center",
  },
  {
    headerName: "TOKEN",
    headerAlign: "center",
  },
  {
    headerName: "QUANTITY",
    headerAlign: "center",
  },
  {
    headerName: "PRICE",
    headerAlign: "center",
  },
  {
    headerName: "SENDER",
    headerAlign: "center",
  },
  {
    headerName: "RECEIVER",
    headerAlign: "center",
  },
  {
    headerName: "DATE",
    headerAlign: "center",
  },
  {
    headerName: "STATUS",
    headerAlign: "center",
  },
  {
    headerName: "PRIVISCAN",
    headerAlign: "center",
  },
];

const INVESTTABLEHEADER: Array<CustomTableHeaderInfo> = [
  {
    headerName: "Quantity",
    headerAlign: "center",
  },
  {
    headerName: "Investment",
    headerAlign: "center",
  },
  {
    headerName: "Address",
    headerAlign: "center",
  },
  {
    headerName: "Date",
    headerAlign: "center",
  },
  {
    headerName: "Status",
    headerAlign: "center",
  },
  {
    headerName: "PRIVISCAN",
    headerAlign: "center",
  },
];

const useStyles = makeStyles(theme => ({
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  shadowBox: {
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    background: Gradient.Green1,
    boxShadow: `0px 2px 14px rgba(0, 0, 0, 0.08)`,
    color: "white",
    margin: theme.spacing(1),
  },
  topHeaderLabel: {
    background: `linear-gradient(270.47deg, #D66DB2 -3.25%, #BB34D1 93.45%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  whiteBox: {
    borderRadius: theme.spacing(2),
    background: "white",
    padding: theme.spacing(4),
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
  },
  header1: {
    fontSize: "14px",
  },
  header2: {
    fontSize: "12px",
  },
  header3: {
    fontSize: "18px",
    fontWeight: 800,
  },
  flexBoxHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
  },
  greenBox: {
    background: "rgba(218, 230, 229, 0.5)",
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    border: "0.76px solid rgba(84, 101, 143, 0.1)",
    borderRadius: theme.spacing(0.5),
  },
  graphBox: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2.5),
    border: `2px solid #18181822`,
    borderRadius: theme.spacing(2),
    margin: theme.spacing(1),
    position: "relative",
    background: "white",
  },
  valueBox: {
    position: "absolute",
    left: "60px",
    top: "70px",
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    boxShadow: `2px 2px 12px rgba(0, 0, 0, 0.1)`,
    background: "white",
  },
  graphHeader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  select: {
    "& > div": {
      paddingBottom: "11px",
      minWidth: "120px",
    },
  },
  colorBox: {
    width: theme.spacing(0.5),
    height: theme.spacing(4.5),
    borderRadius: "2px",
  },
  circle: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#65CB63",
    marginRight: "8px",
  },
  externalLink: {
    verticalAlign: "middle",
  },
}));

const InvestmentHeader = [
  { headerName: "Quantity" },
  { headerName: "Investment" },
  { headerName: "Address" },
  { headerName: "Date" },
  { headerName: "Status" },
  { headerName: "PrivScan" },
];

const TimRangeList: any[] = ["6 Months"];

export default function Investment({ pod, handleRefresh }) {
  const classes2 = useStyles();
  const classes = investmentStyles();
  const { convertTokenToUSD } = useTokenConversion();
  const [selectedTimeRange, setSelectedTimeRange] = useState<any>(TimRangeList[0]);
  const [priceChartConfig, setPriceChartConfig] = useState<any>();
  const [ownershipConfig, setOwnershipConfig] = useState<any>();
  const [transactionTableData, setTransactionTableData] = useState<any[]>([]);
  const [investmentTableData, setInvestmentTableData] = useState<any[]>([]);
  const [lastPrice, setLastPrice] = useState<number>(0);
  const [prevPrice, setPrevPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);

  const [mode, setMode] = useState<string>("invest");
  const [openBuySellModal, setOpenBuySellModal] = useState<boolean>(false);

  const [remainingTime, setRemainingTime] = useState<any>({ day: 0, hour: 0, min: 0, sec: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    if (!pod.IsTrading) {
      // load table
      getPodInvestmentTransactions(pod.PodAddress).then(resp => {
        if (resp?.success) {
          const tableData: Array<Array<CustomTableCellInfo>> = [];
          const data = resp.data;
          data.forEach(item => {
            const row: Array<CustomTableCellInfo> = [];
            row.push({
              cell: <Box>{item.Amount / pod.FundingTokenPrice ?? 1}</Box>,
              cellAlign: "center",
            });
            row.push({
              cell: <Box>{formatNumber(convertTokenToUSD(item.FundingToken, item.Amount), "USD", 2)}</Box>,
              cellAlign: "center",
            });
            row.push({
              cell: <Box color="#65CB63">{item.From}</Box>,
              cellAlign: "center",
            });
            row.push({
              cell: <Moment format="ddd, DD MMM-h:mm A">{item.Date * 1000}</Moment>,
              cellAlign: "center",
            });
            row.push({
              cell: (
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Box width="10px" height="10px" borderRadius="100%" bgcolor="#431AB7" mr={1} />
                  Confirmed
                </Box>
              ),
              cellAlign: "center",
            });
            row.push({
              cell: (
                <Box>
                  {item.Id && (
                    <a target="_blank" rel="noopener noreferrer" href={"https://priviscan.io/tx/" + item.Id}>
                      <img
                        className={classes2.externalLink}
                        src={require("assets/icons/newScreen_black.svg")}
                        alt="link"
                      />
                    </a>
                  )}
                </Box>
              ),
              cellAlign: "center",
            });
            tableData.push(row);
          });
          setInvestmentTableData(tableData);
        }
      });
    } else {
      // load price history
      getPodPriceHistory(pod.PodAddress, 180).then(resp => {
        const points = resp.data;
        const prices: number[] = points.map(obj => obj.price);
        const dates: number[] = points.map(obj => obj.date);
        const labels: string[] = generateMonthLabelsFromDate(dates);
        const newRewardConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
        newRewardConfig.configurer = configurer;
        newRewardConfig.config.data.labels = labels;
        newRewardConfig.config.data.datasets[0].data = prices;
        newRewardConfig.config.data.datasets[0].backgroundColor = "#0FCEA6";
        newRewardConfig.config.data.datasets[0].borderColor = "#0FCEA6";
        newRewardConfig.config.data.datasets[0].pointBackgroundColor = "#0FCEA6";
        newRewardConfig.config.data.datasets[0].hoverBackgroundColor = "#0FCEA6";
        newRewardConfig.config.data.datasets[0].type = "line";
        newRewardConfig.config.options.scales.xAxes[0].offset = false;
        newRewardConfig.config.options.scales.yAxes[0].ticks.display = false;
        setPriceChartConfig(newRewardConfig);

        // set price change
        let newLastPrice = 0;
        let newPrevPrice = 0;
        let newPriceChange = 0;
        if (prices.length > 0) newLastPrice = prices[prices.length - 1];
        if (prices.length > 1) newPrevPrice = prices[prices.length - 2];
        if (newPrevPrice) newPriceChange = (newLastPrice - newPrevPrice) / newPrevPrice;
        setLastPrice(Number(newLastPrice.toFixed(4)));
        setPrevPrice(Number(newPrevPrice.toFixed(4)));
        setPriceChange(Number(newPriceChange.toFixed(2)));
      });
      // load shares distribution
      getPodDistributionInfo(pod.PodAddress).then(resp => {
        if (resp?.success) {
          const data = resp.data;
          const newStakingRadial = JSON.parse(JSON.stringify(RadialConfig));
          newStakingRadial.config.data.datasets[0].labels = ["Pod Owners", "Investors", "Share & Earn"];
          newStakingRadial.config.data.datasets[0].data = [
            (data.creatorSum * pod.Price).toFixed(6),
            (data.investorSum * pod.Price).toFixed(6),
            (data.sharerSum * pod.Price).toFixed(6),
          ];
          newStakingRadial.config.data.datasets[0].backgroundColor = ["#0FCEA6", "#FF78D3", "#F9E373"];
          setOwnershipConfig(newStakingRadial);
        }
      });
      // get buy sell txns
      getPodBuySellTransactions(pod.PodAddress).then(resp => {
        if (resp?.success) {
          const data = resp.data;
          const tableData: Array<Array<CustomTableCellInfo>> = [];
          data.forEach(item => {
            const from = item.From
              ? item.From.substring(0, 8) + "..."
              : pod.PodAddress.substring(0, 8) + "...";
            const to = item.To ? item.To.substring(0, 8) + "..." : pod.PodAddress.substring(0, 8) + "...";
            const row: Array<CustomTableCellInfo> = [];
            row.push({
              cell: <Box>{item.Type.includes("Buy") ? "Buy" : "Sell"}</Box>,
              cellAlign: "center",
            });
            row.push({
              cell: <img src={require(`assets/tokenImages/${item.Token}.png`)} width={24} height={24} />,
              cellAlign: "center",
            });
            row.push({
              cell: <Box>{item.PodAmount}</Box>,
              cellAlign: "center",
            });
            row.push({
              cell: <Box>{item.Amount.toFixed(6)}</Box>,
              cellAlign: "center",
            });
            row.push({
              cell: <Box color="#65CB63">{from}</Box>,
              cellAlign: "center",
            });
            row.push({
              cell: <Box color="#65CB63">{to}</Box>,
              cellAlign: "center",
            });
            row.push({
              cell: <Moment format="ddd, DD MMM-h:mm A">{item.Date * 1000}</Moment>,
              cellAlign: "center",
            });
            row.push({
              cell: (
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Box width="10px" height="10px" borderRadius="100%" bgcolor="#431AB7" mr={1} />
                  Confirmed
                </Box>
              ),
              cellAlign: "center",
            });
            row.push({
              cell: (
                <Box>
                  {item.Id && (
                    <a target="_blank" rel="noopener noreferrer" href={"https://priviscan.io/tx/" + item.Id}>
                      <img
                        className={classes2.externalLink}
                        src={require("assets/icons/newScreen_black.svg")}
                        alt="link"
                      />
                    </a>
                  )}
                </Box>
              ),
              cellAlign: "center",
            });
            tableData.push(row);
          });
          setTransactionTableData(tableData);
        }
      });
    }
  };

  // funding time inverval
  useEffect(() => {
    if (pod.FundingDate && (pod.Status == "FORMATION" || pod.Status == "INVESTING")) {
      const intervalId = setInterval(() => {
        calculateRemainingTime();
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [pod.FundingDate]);

  const calculateRemainingTime = () => {
    const currTimeInSec = Math.floor(Date.now() / 1000);
    const timeDiff = pod.FundingDate - currTimeInSec;
    const day = timeDiff >= 0 ? Math.floor(timeDiff / (3600 * 24)) : 0;
    const hour = timeDiff >= 0 ? Math.floor((timeDiff % (3600 * 24)) / 3600) : 0;
    const min = timeDiff >= 0 ? Math.floor((timeDiff % 3600) / 60) : 0;
    const sec = timeDiff >= 0 ? Math.floor(timeDiff % 60) : 0;
    setRemainingTime({
      day,
      hour,
      min,
      sec,
    });
  };

  return (
    <Box>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <Box fontSize={33} color={"#431AB7"}>
          Investment
        </Box>
        {pod.Status != "FORMATION" ? (
          !pod.IsTrading ? (
            <PrimaryButton
              size="medium"
              onClick={() => {
                setMode("invest");
                setOpenBuySellModal(true);
              }}
              className={classes.button}
            >
              Invest
            </PrimaryButton>
          ) : (
            <Box justifyContent="flex-end" px={2}>
              <SecondaryButton
                size="medium"
                className={classes.button}
                onClick={() => {
                  setMode("sell");
                  setOpenBuySellModal(true);
                }}
              >
                Sell
              </SecondaryButton>
              <PrimaryButton
                size="medium"
                className={classes.button}
                onClick={() => {
                  setMode("buy");
                  setOpenBuySellModal(true);
                }}
              >
                Buy
              </PrimaryButton>
            </Box>
          )
        ) : null}
      </Box>
      {!pod.IsTrading ? (
        <Box bgcolor="rgba(158, 172, 242, 0.16)" borderRadius={16} p={3} mt={3}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box display="flex" flexDirection="row" alignItems="center" width={1}>
              <Box width={1} display="flex" flexDirection="column">
                <Box fontSize={16} color="#181818" mb={1}>
                  Token price
                </Box>
                <Box fontSize={18} fontWeight={800} color="#181818">
                  {formatNumber(
                    convertTokenToUSD(pod.FundingToken ?? "PRIVI", pod.FundingTokenPrice ?? 0),
                    "USD",
                    4
                  )}
                </Box>
              </Box>
              <Box width={1} display="flex" flexDirection="column">
                <Box fontSize={16} color="#181818" mb={1}>
                  Funds raised
                </Box>
                <Box fontSize={22} fontWeight={800} color="#181818">
                  {formatNumber(
                    convertTokenToUSD(pod.FundingToken ?? "PRIVI", pod.RaisedFunds ?? 0),
                    "USD",
                    4
                  )}
                </Box>
              </Box>
            </Box>
            <Box width={1} display="flex" flexDirection="column">
              <Box className={classes.progress} mb={2.5}>
                <Box
                  className={classes.progressBar}
                  style={{ width: `${(pod.RaisedFunds / pod.FundingTokenPrice) * 100}%` }}
                />
              </Box>
              <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                <Box fontSize={16} color="#181818">
                  Supply already sold
                </Box>
                <Box fontSize={18} color="#181818" fontWeight={800}>
                  <span className={classes.highcolor}>{pod.RaisedFunds / pod.FundingTokenPrice}</span>/
                  {pod.FundingTarget ?? 0} Tokens
                </Box>
              </Box>
            </Box>
          </Box>
          <Box width="100%" height="1px" bgcolor="#181818" my={3} />
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
            <Box fontSize={16} color="#707582">
              Time to finish funding
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box fontSize={18} color="#431AB7" fontWeight={800}>
                {remainingTime.day} Day{remainingTime.day > 1 ? "s" : ""}
              </Box>
              <Box className={classes.timer}>
                {remainingTime.hour} h
              </Box>
              <Box className={classes.timer}>
                {remainingTime.min} min
              </Box>
              <Box className={classes.timer}>
                {remainingTime.sec} s
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Grid container>
          <Grid item xs={12} sm={4}>
            <Box className={classes2.shadowBox}>
              <Box className={classes2.header1}>Market Cap</Box>
              <Box className={classes2.title} mt={1}>
                {formatNumber(convertTokenToUSD(pod.FundingToken, pod.Price * pod.SupplyReleased), "USD", 4)}
              </Box>
            </Box>
            <Box className={classes2.graphBox}>
              <Box className={classes2.graphHeader}>
                <Box className={classes2.header1}>Shares Distribution</Box>
              </Box>
              <Grid container style={{ marginTop: "16px" }}>
                <Grid item xs={12} sm={6}>
                  {ownershipConfig && <PrintChart config={ownershipConfig} canvasHeight={250} />}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box style={{ marginLeft: "12px" }}>
                    {ownershipConfig &&
                      ownershipConfig.config.data.datasets[0].labels.map((item, index) => (
                        <Box className={classes2.flexBox} mb={2} key={"labels-" + index}>
                          <Box
                            className={classes2.colorBox}
                            style={{
                              background: ownershipConfig.config.data.datasets[0].backgroundColor[index],
                            }}
                          />
                          <Box ml={2}>
                            <Box className={classes2.header2}>{item}</Box>
                            <Box className={classes2.header1}>
                              ${ownershipConfig.config.data.datasets[0].data[index]}
                            </Box>
                          </Box>
                        </Box>
                      ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Box className={classes2.graphBox} height="400px">
              <Box className={classes2.graphHeader}>
                <Box className={classes2.header1}>Price History</Box>
                <FormControl variant="outlined">
                  <StyledSelect className={classes2.select} value={selectedTimeRange} onChange={v => {}}>
                    {TimRangeList.map((item, index) => (
                      <StyledMenuItem key={index} value={item}>
                        {item}
                      </StyledMenuItem>
                    ))}
                  </StyledSelect>
                </FormControl>
              </Box>
              <Box style={{ height: "100%" }}>
                {priceChartConfig && <PrintChart config={priceChartConfig} />}
              </Box>
              <Box className={classes2.valueBox}>
                <Box className={classes2.header1}>{formatNumber(lastPrice, "USD", 2)}</Box>
                <Box className={classes2.header2} color={lastPrice >= prevPrice ? "#0FCEA6" : "#F43E5F"}>
                  {lastPrice > prevPrice ? "+" : ""}
                  {lastPrice - prevPrice} ({priceChange > 0 ? "+" : ""}
                  {priceChange * 100}%)
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
      {!pod.IsTrading ? (
        <Box className={classes.table} mt={3}>
          <CustomTable
            headers={InvestmentHeader}
            rows={investmentTableData}
            placeholderText="No Revenue Data."
          />
        </Box>
      ) : (
        <Box mt={2} px={1}>
          <CustomTable headers={TRANSACTIONTABLEHEADER} rows={transactionTableData} theme="transaction" />
        </Box>
      )}
      {openBuySellModal && (
        <TradePodTokenModal
          open={openBuySellModal}
          mode={mode}
          setMode={setMode}
          pod={pod}
          handleClose={() => setOpenBuySellModal(false)}
          handleRefresh={handleRefresh}
        />
      )}
    </Box>
  );
}
