import React, { useState } from "react";
import { format } from "date-fns";
import { Grid } from "@material-ui/core";
import Box from "shared/ui-kit/Box";
import { Color, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { Avatar, Text } from "shared/ui-kit";
import PrintChart from "shared/ui-kit/Chart/Chart";
import { PriceFeed_URL, PriceFeed_Token } from "shared/functions/getURL";
import { SyntheticFractionalisedJotPoolsPageStyles } from "./index.styles";
import AddLiquidityModal from "components/PriviDigitalArt/modals/AddLiquidityModal";
import RemoveLiquidityModal from "components/PriviDigitalArt/modals/RemoveLiquidityModal";
import { ReactComponent as ArrowUp } from "assets/icons/arrow_up.svg";
import { ReactComponent as ArrowDown } from "assets/icons/arrow_down.svg";
import LiquidityModal from "../../modals/LiquidityModal";

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
    let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight + 300);
    gradient.addColorStop(0, config.data.datasets[index].backgroundColor);
    // gradient.addColorStop(0.6, config.data.datasets[index].backgroundColor);
    // gradient.addColorStop(1, `${config.data.datasets[index].backgroundColor}33`);
    gradient.addColorStop(1, Color.Purple);
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

const tempHistory = [
  {
    nft: "NFT Name",
    amount: "0.1 JOTs",
    date: "2021-09-18 03:45:24",
    user: { imageUrl: "", name: "JOT Pool" },
  },
  {
    nft: "NFT Name",
    amount: "0.1 JOTs",
    date: "2021-09-18 03:45:24",
    user: { imageUrl: require(`assets/icons/explorer.png`), name: "@user_name" },
  },
  {
    nft: "NFT Name",
    amount: "0.1 JOTs",
    date: "2021-09-18 03:45:24",
    user: { imageUrl: require(`assets/icons/explorer.png`), name: "JOT Pool" },
  },
  {
    nft: "NFT Name",
    amount: "0.1 JOTs",
    date: "2021-09-18 03:45:24",
    user: { imageUrl: "", name: "@user_name" },
  },
  {
    nft: "NFT Name",
    amount: "0.1 JOTs",
    date: "2021-09-18 03:45:24",
    user: { imageUrl: require(`assets/icons/explorer.png`), name: "JOT Pool" },
  },
  {
    nft: "NFT Name",
    amount: "0.1 JOTs",
    date: "2021-09-18 03:45:24",
    user: { imageUrl: "", name: "JOT Pool" },
  },
];

export const CoinFlipHistoryTable = ({ datas }) => {
  const classes = SyntheticFractionalisedJotPoolsPageStyles();
  // const usersList = useSelector((state: RootState) => state.usersInfoList);
  // const getUserInfo = (address: string) => usersList.find(u => u.address === address);

  const tableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "NFT",
      headerAlign: "center",
    },
    {
      headerName: "WINNER",
      headerAlign: "center",
    },
    {
      headerName: "AMOUNT",
      headerAlign: "center",
    },
    {
      headerName: "DATE",
      headerAlign: "center",
    },
    {
      headerName: "EXPLORER",
      headerAlign: "center",
    },
  ];
  const [tableData, setTableData] = React.useState<Array<Array<CustomTableCellInfo>>>([]);
  React.useEffect(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (datas && datas.length) {
      data = datas.map(row => {
        const user = row.user;
        return [
          {
            cell: row.nft || "",
            cellAlign: "center",
          },
          {
            cell: (
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                className={classes.userField}
              >
                {/* <Avatar size="medium" url={user?.imageUrl ? user?.imageUrl: user?.anonAvatar ? require(`assets/anonAvatars/${user.anonAvatar}`) : "none"} /> */}
                <Avatar size="tiny" url={user?.imageUrl ? user?.imageUrl : "none"} />
                <Text>{user?.name}</Text>
              </Box>
            ),
            cellAlign: "center",
          },
          {
            cell: row.amount || "",
            cellAlign: "center",
          },
          {
            cell: format(new Date(row.date), "hh:kk, dd.MM.yyyy"),
            cellAlign: "center",
          },
          {
            cell: (
              <SecondaryButton
                size="medium"
                className={classes.exploreButton}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: Color.Purple,
                  border: "0.7px solid #9EACF2",
                  borderRadius: "4px",
                  margin: "auto",
                }}
              >
                <img src={require(`assets/icons/explorer.png`)} style={{ width: "24px", height: "24px" }} />
              </SecondaryButton>
            ),
            cellAlign: "center",
          },
        ];
      });
    }
    setTableData(data);
  }, [datas]);

  return (
    <div className={classes.table}>
      <CustomTable headers={tableHeaders} rows={tableData} placeholderText="No auctions" />
    </div>
  );
};

export default function SyntheticFractionalisedJotPoolsPage(props: any) {
  const { collection } = props;
  const classes = SyntheticFractionalisedJotPoolsPageStyles();
  const [rewardConfig, setRewardConfig] = React.useState<any>();
  const PERIODS = ["1D", "6D", "YTD"];
  const [period, setPeriod] = React.useState<string>(PERIODS[0]);

  const [flipHistory, setFlipHistory] = React.useState<any[]>(tempHistory);
  const [openLiquidityModal, setOpenLiquidityModal] = React.useState<boolean>(false);
  const [openRemoveLiquidityModal, setOpenRemoveLiquidityModal] = React.useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [openProceedModal, setOpenProceedModal] = useState<boolean>(false);

  // todo: Remove code
  const [liquidity, setLiquidity] = useState<number>(0);

  const isProduction = process.env.REACT_APP_ENV === "Prod";

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
    newRewardConfig.config.data.datasets[0].backgroundColor = "#908D87";
    newRewardConfig.config.data.datasets[0].borderColor = "#DDFF57";
    newRewardConfig.config.data.datasets[0].pointBackgroundColor = "#DDFF57";
    newRewardConfig.config.data.datasets[0].hoverBackgroundColor = "#DDFF57";
    newRewardConfig.config.options.scales.xAxes[0].offset = true;
    newRewardConfig.config.options.scales.yAxes[0].ticks.display = false;

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

  const handleConfirmAddLiquidity = async (amount: string) => {
    // todo: Remove code
    setLiquidity(prev => prev + 1);
    setIsAdd(true);
    setAmount(Number(amount));
    setOpenProceedModal(true);

    setOpenLiquidityModal(false);
  };

  const handleConfirmRemoveLiquidity = async (amount: string) => {
    // todo: Remove code
    setLiquidity(prev => prev - 1);
    setIsAdd(false);
    setAmount(Number(amount));
    setOpenProceedModal(true);

    setOpenRemoveLiquidityModal(false);
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.outBox}>
        <Box className={classes.boxBody}>
          <Box className={classes.infoWrap} display="flex" flexDirection="column">
            <Grid container spacing={4}>
              <Grid item md={3} xs={12}>
                <Box className={classes.leftJots}>
                  <Box className={classes.hWrap1}>
                    <Box className={classes.h1}>0,9983 JOTS</Box>
                    <Box className={classes.h5} paddingY={1}>
                      TRANSACTION VOLUME
                    </Box>
                    <Box className={classes.h6} style={{ color: "#FF1F00" }}>
                      <ArrowDown /> 1.25%
                    </Box>
                  </Box>
                  <Box className={classes.hWrap1}>
                    <Box className={classes.h1}>1.000.000 JOTS</Box>
                    <Box className={classes.h5} paddingY={1}>
                      POOL TOTAL LIQUIDITY
                    </Box>
                    <Box className={classes.h6} style={{ color: "#09C605" }}>
                      <ArrowUp style={{ color: "#ccc" }} /> 5.71%
                    </Box>
                  </Box>
                  <Box className={classes.hWrap2}>
                    <Box className={classes.h1}>5.000 JOTS</Box>
                    <Box className={classes.h5} paddingY={1}>
                      POOL TOTAL ACCRUED REWARD
                    </Box>
                  </Box>
                  <Box className={classes.hWrap2}>
                    <Box className={classes.h1}>0,9983 JOTS</Box>
                    <Box className={classes.h5} paddingY={1}>
                      LIQUIDITY SHARE VALUE
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item md={9} xs={12}>
                <Box className={classes.rightChart}>
                  <Box className={classes.controlParentBox}>
                    <Box display="flex" flexDirection="column">
                      <h2 className={classes.graphTitle}>4245,24 USDC</h2>
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
                  <Box flex={1} width={1} mt={3} className={classes.chartWrapper}>
                    {rewardConfig && <PrintChart config={rewardConfig} />}
                  </Box>
                </Box>
              </Grid>
            </Grid>
            {liquidity === 0 && (
              <Box className={classes.addButtonWrapper}>
                <PrimaryButton
                  size="large"
                  onClick={() => setOpenLiquidityModal(true)}
                  style={{
                    width: "100%",
                    background: "#DDFF57",
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#431AB7",
                  }}
                >
                  ADD LIQUIDITY
                </PrimaryButton>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      {liquidity !== 0 && (
        <Box className={classes.outBox}>
          <Box className={classes.sectionTitle} style={{ padding: "35px 0 30px 50px" }}>
            MY STAKING
          </Box>
          <Grid container className={classes.botRow} style={{ padding: "0 50px 30px 50px" }}>
            <Grid item md={3} xs={12}>
              <Box className={classes.infoItem}>
                <Box className={classes.h1} style={{ fontWeight: 800 }}>
                  SHARE AMOUNT
                </Box>
                <Box className={classes.h3} mt={1}>
                  11 SHARES
                </Box>
              </Box>
            </Grid>
            <Grid item md={3} xs={12}>
              <Box className={classes.infoItem}>
                <Box className={classes.h1} style={{ fontWeight: 800 }}>
                  POOL OWNERSHIP
                </Box>
                <Box className={classes.h3} mt={1}>
                  20%
                </Box>
              </Box>
            </Grid>
            <Grid item md={3} xs={12}>
              <Box className={classes.infoItem}>
                <Box className={classes.h1} style={{ fontWeight: 800 }}>
                  MY LIQUIDITY VALUE
                </Box>
                <Box className={classes.h3} mt={1}>
                  1000 USD
                </Box>
              </Box>
            </Grid>
            <Grid item md={3} xs={12}>
              <Box display="flex" alignItems="center">
                <SecondaryButton
                  size="medium"
                  style={{ color: Color.Purple, width: "100%", border: "2px solid #9EACF2", height: 60 }}
                  onClick={() => setOpenRemoveLiquidityModal(true)}
                >
                  REMOVE
                </SecondaryButton>
                <PrimaryButton
                  size="medium"
                  style={{ background: Color.Purple, width: "100%", height: 60 }}
                  onClick={() => setOpenLiquidityModal(true)}
                >
                  ADD MORE
                </PrimaryButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}

      <Box className={classes.outBox} style={{ paddingBottom: 20 }}>
        <Box className={classes.sectionTitle}>Coin flip history</Box>
        <CoinFlipHistoryTable datas={flipHistory} />
      </Box>
      {openLiquidityModal && (
        <AddLiquidityModal
          open={openLiquidityModal}
          handleClose={() => setOpenLiquidityModal(false)}
          onConfirm={handleConfirmAddLiquidity}
        />
      )}
      <RemoveLiquidityModal
        open={openRemoveLiquidityModal}
        onClose={() => setOpenRemoveLiquidityModal(false)}
        onConfirm={handleConfirmRemoveLiquidity}
      />
      <LiquidityModal
        open={openProceedModal}
        onClose={() => setOpenProceedModal(false)}
        collection={collection}
        amount={amount}
        isAdd={isAdd}
        onCompleted={() => {}}
      />
    </Box>
  );
}
