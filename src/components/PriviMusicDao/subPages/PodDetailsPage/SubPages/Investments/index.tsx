import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { FormControl, Grid, makeStyles } from "@material-ui/core";
import PrintChart from "shared/ui-kit/Chart/Chart";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import Box from "shared/ui-kit/Box";
import { Gradient, PrimaryButton } from "shared/ui-kit";
import TradePodTokenModal from "components/PriviMusicDao/modals/TradePodTokenModal";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import Moment from "react-moment";
import { formatNumber, generateMonthLabelsFromDate } from "shared/functions/commonFunctions";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import {
  musicDaoGetPodDistributionInfo,
  musicDaogGetPodPriceHistory,
  musicDaoGetPodInvestmentTransactions,
  musicDaoGetBuySellTransactions,
} from "shared/services/API";
import { BlockchainNets } from "shared/constants/constants";
import PolygonAPI from "shared/services/API/polygon";

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
    headerName: "Type",
    headerAlign: "center",
  },
  {
    headerName: "Token",
    headerAlign: "center",
  },
  {
    headerName: "Quantity",
    headerAlign: "center",
  },
  {
    headerName: "Price",
    headerAlign: "center",
  },
  {
    headerName: "Sender",
    headerAlign: "center",
  },
  {
    headerName: "Receiver",
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
    margin: theme.spacing(1),
    "& *": {
      color: "white !important",
    },
  },
  topHeaderLabel: {
    background: `linear-gradient(270.47deg, #D66DB2 -3.25%, #BB34D1 93.45%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  whiteBox: {
    borderRadius: theme.spacing(2),
    background: "white",
    padding: `${theme.spacing(3)}px ${theme.spacing(4)}px`,
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    fontFamily: "Agrandir Grand",
    color: "#2D3047",
  },
  header1: {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "18px",
    color: "#081831",
  },
  header2: {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "120%",
    color: "#707582",
    textShadow: "2px 2px 12px rgba(0, 0, 0, 0.1)",
  },
  header3: {
    fontFamily: "Agrandir Grand",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "22px",
    lineHeight: "120%",
    color: "#081831",
    textShadow: "2px 2px 12px rgba(0, 0, 0, 0.1)",
  },
  flexBoxHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
  },
  greenBox: {
    display: "flex",
    alignItems: "center",
    background: "linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D",
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    borderRadius: "12px",
  },
  graphBox: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2.5),
    border: `1px solid #E0E4F3`,
    borderRadius: "12px",
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

  tableContainer: {
    "& > div": {
      borderRadius: "16px",
      boxShadow: "none",
    },

    "& *": {
      fontFamily: "Montserrat !important",
    },

    "& tr": {
      "& th:first-child": {
        borderTopLeftRadius: "16px",
      },

      "& th:last-child": {
        borderTopRightRadius: "16px",
      },
    },

    "& tr:last-child": {
      "& td:first-child": {
        borderBottomLeftRadius: "16px",
      },

      "& td:last-child": {
        borderBottomRightRadius: "16px",
      },
    },
  },

  barContainer: {
    background: "rgba(84, 101, 143, 0.3)",
    height: 3,
    borderRadius: "20px",
    width: "100%",
    "& > div": {
      background: "linear-gradient(90deg, #A0D800 39.81%, #0DCC9E 75.56%, rgba(255, 255, 255, 0) 98.84%)",
      height: 3,
      borderRadius: "20px",
    },
  },

  divider: {
    height: 40,
    opacity: 0.1,
    background: "#181818",
    width: "1px",
  },
}));

const TimRangeList: any[] = ["6 Months"];

const Investments = ({ pod, handleRefresh }) => {
  const classes = useStyles();
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

  const [fundingEnded, setFundingEnded] = React.useState<boolean>(false);
  const [fundingEndTime, setFundingEndTime] = React.useState<any>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const { account, library } = useWeb3React();

  const podNetwork = BlockchainNets.find(net => net.name === pod.blockchainNetwork) || BlockchainNets[0];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    if (!pod.IsTrading) {
      // load table
      musicDaoGetPodInvestmentTransactions(pod.PodAddress).then(resp => {
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
                <Box className={classes.flexBox}>
                  <Box className={classes.circle}></Box>
                  Confirmed
                </Box>
              ),
              cellAlign: "center",
            });
            row.push({
              cell: (
                <Box>
                  {item.Id && (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`${podNetwork.scan.url}/tx/${item.Id}`}
                    >
                      <img
                        className={classes.externalLink}
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
      musicDaogGetPodPriceHistory(pod.PodAddress, 180).then(resp => {
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
      musicDaoGetPodDistributionInfo(pod.PodAddress).then(resp => {
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
      musicDaoGetBuySellTransactions(pod.PodAddress).then(resp => {
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
              cell: <Box>{item.Amount}</Box>,
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
                <Box className={classes.flexBox}>
                  <Box className={classes.circle}></Box>
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
                        className={classes.externalLink}
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
  React.useEffect(() => {
    if (pod.FundingDate && (pod.Status == "FORMATION" || pod.Status == "INVESTING")) {
      const timerId = setInterval(() => {
        const now = new Date();

        let delta = Math.floor(pod.FundingDate - now.getTime() / 1000);
        if (delta < 0) {
          setFundingEnded(true);
          setFundingEndTime({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          });
          clearInterval(timerId);
        } else {
          let days = Math.floor(delta / 86400);
          delta -= days * 86400;

          // calculate (and subtract) whole hours
          let hours = Math.floor(delta / 3600) % 24;
          delta -= hours * 3600;

          // calculate (and subtract) whole minutes
          let minutes = Math.floor(delta / 60) % 60;
          delta -= minutes * 60;

          // what's left is seconds
          let seconds = delta % 60;
          setFundingEnded(false);
          setFundingEndTime({
            days,
            hours,
            minutes,
            seconds,
          });
        }
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [pod.FundingDate]);

  const onRedeemBack = React.useCallback(() => {
    if (pod.blockchainNetwork === BlockchainNets[1].name) {
      const web3 = new Web3(library.provider);

      const response: any = PolygonAPI.PodWithdrawManager.returnPodTokens(web3, account!, pod.PodAddress);
      if (response.success) {
        console.log(response);
      }
    }
  }, [pod]);

  return (
    <Box mt={3}>
      <Box className={classes.flexBox} justifyContent="space-between" px={1} mb={3}>
        <Box className={classes.title}>Investment</Box>
        {pod.Status != "FORMATION" ? (
          !pod.IsTrading ? (
            <PrimaryButton
              size="small"
              onClick={() => {
                setMode("invest");
                setOpenBuySellModal(true);
              }}
              style={{
                background: Gradient.Green1,
                padding: "11px 48px",
                borderRadius: "46px",
                fontFamily: "Montserrat",
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "18px",
                border: "none",
                height: "auto",
              }}
              isRounded
            >
              Invest
            </PrimaryButton>
          ) : (
            <Box className={classes.flexBox} justifyContent="flex-end" px={2}>
              <PrimaryButton
                size="small"
                onClick={() => {
                  setMode("sell");
                  setOpenBuySellModal(true);
                }}
                style={{
                  background: "#F43E5F",
                  border: "none",
                  height: "auto",
                  padding: "11px 48px",
                  borderRadius: "46px",
                  fontFamily: "Montserrat",
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "18px",
                }}
                isRounded
              >
                SELL
              </PrimaryButton>
              <PrimaryButton
                size="small"
                onClick={() => {
                  setMode("buy");
                  setOpenBuySellModal(true);
                }}
                style={{
                  background: "#65CB63",
                  border: "none",
                  height: "auto",
                  padding: "11px 48px",
                  borderRadius: "46px",
                  fontFamily: "Montserrat",
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "18px",
                  marginLeft: "18px",
                }}
                isRounded
              >
                BUY
              </PrimaryButton>
            </Box>
          )
        ) : null}
      </Box>
      {!pod.IsTrading ? (
        <Box>
          <Box className={classes.whiteBox} mx={1}>
            <Box className={classes.flexBox} justifyContent="space-between">
              <Box>
                <Box className={classes.header2}>Token price</Box>
                <Box className={classes.header3} mt={1}>
                  {formatNumber(
                    convertTokenToUSD(pod.FundingToken ?? "PRIVI", pod.FundingTokenPrice ?? 0),
                    "USD",
                    4
                  )}
                </Box>
              </Box>
              <Box>
                <Box className={classes.header2}>Funds raised </Box>
                <Box className={classes.header3} mt={1}>
                  {formatNumber(
                    convertTokenToUSD(pod.FundingToken ?? "PRIVI", pod.RaisedFunds ?? 0),
                    "USD",
                    4
                  )}
                </Box>
                <Box className={classes.divider} />
              </Box>
              <Box flex={0.2} />
              <Box flex={1}>
                <Box className={classes.barContainer} mb={"12px"}>
                  <Box style={{ width: `${pod.RaisedFunds / pod.FundingTokenPrice}%` }} />
                </Box>
                <Box className={classes.flexBox} justifyContent="space-between">
                  <Box className={classes.header2}>Supply already sold</Box>
                  <Box className={classes.flexBox}>
                    <Box
                      className={classes.header2}
                      style={{ fontFamily: "Agrandir Grand", fontSize: "18px" }}
                    >
                      {pod.RaisedFunds / pod.FundingTokenPrice}/
                    </Box>
                    <Box className={classes.header3} style={{ fontSize: "18px" }}>
                      {pod.FundingTarget ?? 0} {pod.TokenSymbol}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              className={classes.greenBox}
              justifyContent={pod.RaisedFunds <= 0 ? "space-around" : "space-between"}
              mt={2}
            >
              <Box flex={1} className={classes.flexBox} justifyContent="space-between">
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems={pod.RaisedFunds <= 0 ? "flex-start" : "center"}
                >
                  <Box className={classes.header2}>Amount of Pods purchased</Box>
                  <Box className={classes.header3} mt={1}>
                    {pod.SupplyReleased} Pods
                  </Box>
                </Box>
                {pod.RaisedFunds <= 0 && <Box className={classes.divider} />}
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems={pod.RaisedFunds <= 0 ? "center" : "flex-start"}
                >
                  <Box className={classes.header2}>Amount paid</Box>
                  <Box className={classes.header3} mt={1}>
                    {pod.RaisedFunds} Tokens
                  </Box>
                </Box>
              </Box>
              {pod.RaisedFunds <= 0 && (
                <Box flex={1} display="flex" justifyContent="flex-end">
                  <PrimaryButton
                    size="small"
                    onClick={() => {}}
                    style={{
                      background: pod.FundingTarget > pod.RaisedFunds ? "#FF8E3C" : Gradient.Green1,
                      border: "none",
                      height: "auto",
                      padding: "11px 48px",
                      borderRadius: "46px",
                      fontFamily: "Montserrat",
                      fontWeight: 600,
                      fontSize: "14px",
                      lineHeight: "18px",
                    }}
                    isRounded
                  >
                    {pod.FundingTarget > pod.RaisedFunds ? "REDEEM BACK THE FUNDS" : "CLAIM YOUR POD TOKENS"}
                  </PrimaryButton>
                </Box>
              )}
            </Box>
            {pod.RaisedFunds <= 0 && (
              <Box
                mt={3}
                className={classes.flexBox}
                color={pod.FundingTarget > pod.RaisedFunds ? "#F43E5F" : "#65CB63"}
              >
                {pod.FundingTarget > pod.RaisedFunds ? (
                  <RedCross />
                ) : (
                  <img src={require("assets/emojiIcons/confetti.png")} width={"27px"} height="27px" alt="" />
                )}
                <Box ml={2}>
                  {pod.FundingTarget > pod.RaisedFunds
                    ? "Pod did not reach the funding target"
                    : "Pod reached the funding target "}
                </Box>
              </Box>
            )}
          </Box>
          <Box mt={2} px={1} className={classes.tableContainer}>
            <CustomTable headers={INVESTTABLEHEADER} rows={investmentTableData} theme="transaction" />
          </Box>
        </Box>
      ) : (
        <Box>
          <Grid container>
            <Grid item xs={12} sm={4} style={{ display: "flex", flexDirection: "column" }}>
              <Box className={classes.shadowBox}>
                <Box className={classes.header1}>Market Cap</Box>
                <Box style={{ fontSize: "32px" }} className={classes.title} mt={1}>
                  {formatNumber(
                    convertTokenToUSD(pod.FundingToken, pod.Price * pod.SupplyReleased),
                    "USD",
                    4
                  )}
                </Box>
              </Box>
              <Box className={classes.graphBox} flex={1}>
                <Box className={classes.graphHeader}>
                  <Box className={classes.header1}>Shares Distribution</Box>
                </Box>
                <Grid container style={{ marginTop: "16px" }}>
                  <Grid item xs={12} sm={6}>
                    {ownershipConfig && <PrintChart config={ownershipConfig} canvasHeight={250} />}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box style={{ marginLeft: "12px" }}>
                      {ownershipConfig &&
                        ownershipConfig.config.data.datasets[0].labels.map((item, index) => (
                          <Box className={classes.flexBox} mb={2} key={"labels-" + index}>
                            <Box
                              className={classes.colorBox}
                              style={{
                                background: ownershipConfig.config.data.datasets[0].backgroundColor[index],
                              }}
                            />
                            <Box ml={2}>
                              <Box className={classes.header2}>{item}</Box>
                              <Box className={classes.header1}>
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
              <Box className={classes.graphBox} height="400px">
                <Box className={classes.graphHeader}>
                  <Box className={classes.header1}>Price History</Box>
                  <FormControl variant="outlined">
                    <StyledSelect className={classes.select} value={selectedTimeRange} onChange={v => {}}>
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
                <Box className={classes.valueBox}>
                  <Box className={classes.header1}>{formatNumber(lastPrice, "USD", 2)}</Box>
                  <Box className={classes.header2} color={lastPrice >= prevPrice ? "#0FCEA6" : "#F43E5F"}>
                    {lastPrice > prevPrice ? "+" : ""}
                    {lastPrice - prevPrice} ({priceChange > 0 ? "+" : ""}
                    {priceChange * 100}%)
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Box mt={2} px={1}>
            <CustomTable
              headers={[
                ...TRANSACTIONTABLEHEADER,
                { headerName: podNetwork.scan.name, headerAlign: "center" },
              ]}
              rows={transactionTableData}
              theme="transaction"
            />
          </Box>
        </Box>
      )}
      {openBuySellModal && (
        <TradePodTokenModal
          open={openBuySellModal}
          mode={mode}
          setMode={setMode}
          pod={pod}
          handleClose={() => setOpenBuySellModal(false)}
          handleRefresh={() => {
            loadData();
            handleRefresh();
          }}
        />
      )}
    </Box>
  );
};

const RedCross = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
    <path
      d="M16.9993 0.637207C12.6595 0.637207 8.49719 2.36128 5.42855 5.42953C2.35991 8.49777 0.63623 12.6605 0.63623 17.0003C0.63623 21.3401 2.36031 25.5024 5.42855 28.571C8.49679 31.6397 12.6595 33.3634 16.9993 33.3634C21.3391 33.3634 25.5014 31.6393 28.5701 28.571C31.6387 25.5028 33.3624 21.3401 33.3624 17.0003C33.3624 12.6605 31.6383 8.49817 28.5701 5.42953C25.5018 2.36089 21.3391 0.637207 16.9993 0.637207ZM11.1972 9.56269C11.6388 9.56269 12.062 9.74128 12.3714 10.0577L16.9992 14.6869L21.627 10.0577C21.9237 9.75253 22.3273 9.57536 22.752 9.56269C23.427 9.543 24.0443 9.93957 24.3073 10.5611C24.5703 11.1827 24.4254 11.9027 23.9417 12.3723L19.3125 17.0001L23.9417 21.6279C24.2539 21.9345 24.4325 22.3522 24.4339 22.7895C24.4367 23.2268 24.2651 23.6473 23.9558 23.9567C23.6464 24.2661 23.2259 24.4376 22.7886 24.4362C22.3512 24.4334 21.9336 24.2562 21.627 23.9426L16.9992 19.3148L12.3714 23.9426C12.0648 24.2562 11.6472 24.4334 11.2098 24.4362C10.7725 24.4376 10.352 24.2661 10.0426 23.9567C9.73325 23.6474 9.56171 23.2269 9.56452 22.7895C9.56592 22.3522 9.74452 21.9345 10.0567 21.6279L14.686 17.0001L10.0567 12.3723C9.58 11.9083 9.43092 11.2009 9.68123 10.5836C9.93154 9.96625 10.5306 9.56265 11.1972 9.56265L11.1972 9.56269Z"
      fill="#F43E5F"
    />
  </svg>
);

export default Investments;
