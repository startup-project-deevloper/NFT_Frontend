import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Grid } from "@material-ui/core";
import Box from "shared/ui-kit/Box";
import { Color, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { Avatar, Text } from "shared/ui-kit";
import PrintChart from "shared/ui-kit/Chart/Chart";
import { SyntheticFractionalisedJotPoolsPageStyles } from "./index.styles";
import AddLiquidityModal from "components/PriviDigitalArt/modals/AddLiquidityModal";
import RemoveLiquidityModal from "components/PriviDigitalArt/modals/RemoveLiquidityModal";
import { ReactComponent as ArrowUp } from "assets/icons/arrow_up.svg";
import { ReactComponent as ArrowDown } from "assets/icons/arrow_down.svg";

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
    },
    {
      headerName: "WINNER",
    },
    {
      headerName: "AMOUNT",
    },
    {
      headerName: "DATE",
    },
    {
      headerName: "EXPLORER",
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
          },
          {
            cell: (
              <Box display="flex" flexDirection="row" alignItems="center">
                {/* <Avatar size="medium" url={user?.imageUrl ? user?.imageUrl: user?.anonAvatar ? require(`assets/anonAvatars/${user.anonAvatar}`) : "none"} /> */}
                <Avatar size="medium" url={user?.imageUrl ? user?.imageUrl : "none"} />
                <Text ml={1.5}>{user?.name}</Text>
              </Box>
            ),
          },
          {
            cell: row.amount || "",
          },
          {
            cell: format(new Date(row.date), "hh:kk, dd.MM.yyyy"),
          },
          {
            cell: (
              <SecondaryButton size="medium" style={{ color: Color.Purple, border: "2px solid #9EACF2" }}>
                <img src={require(`assets/icons/explorer.png`)} style={{ width: "32px", height: "32px" }} />
              </SecondaryButton>
            ),
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
  const classes = SyntheticFractionalisedJotPoolsPageStyles();
  const [rewardConfig, setRewardConfig] = React.useState<any>();
  const PERIODS = ["1D", "6D", "YTD"];
  const [period, setPeriod] = React.useState<string>(PERIODS[0]);

  const [flipHistory, setFlipHistory] = React.useState<any[]>(tempHistory);
  const [openLiquidityModal, setOpenLiquidityModal] = React.useState<boolean>(false);
  const [openRemoveLiquidityModal, setOpenRemoveLiquidityModal] = React.useState<boolean>(false);

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
      <Box className={classes.outBox}>
        <Box className={classes.boxBody}>
          <Box className={classes.infoWrap}>
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
                    <Box className={classes.h3}>5.000 JOTS</Box>
                    <Box className={classes.h5} paddingY={1}>
                      POOL TOTAL ACCRUED REWARD
                    </Box>
                  </Box>
                  <Box className={classes.hWrap2}>
                    <Box className={classes.h3}>0,9983 JOTS</Box>
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
                  <Box flex={1} width={1} mt={3}>
                    {rewardConfig && <PrintChart config={rewardConfig} />}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
          {/* <Box className={classes.editWrap}>
          </Box> */}
          <PrimaryButton
            size="medium"
            className={classes.h5}
            mt={3}
            style={{
              background: "#DDFF57",
              width: "100%",
              height: "60px",
              color: Color.Purple,
              textTransform: "uppercase",
            }}
            onClick={() => setOpenLiquidityModal(true)}
          >
            Add liquidity
          </PrimaryButton>
        </Box>
      </Box>
      <Box className={classes.outBox}>
        <Box className={classes.h2} style={{ padding: "50px 0 30px 50px" }}>
          MY STAKING
        </Box>
        <Grid container className={classes.botRow} style={{ padding: "0 50px 30px 50px" }}>
          <Grid item md={3} xs={12}>
            <Box className={classes.infoItem}>
              <Box className={classes.h5} style={{ fontWeight: 800 }}>
                SHARE AMOUNT
              </Box>
              <Box className={classes.h5} mt={1}>
                11 SHARES
              </Box>
            </Box>
          </Grid>
          <Grid item md={3} xs={12}>
            <Box className={classes.infoItem}>
              <Box className={classes.h5} style={{ fontWeight: 800 }}>
                POOL OWNERSHIP
              </Box>
              <Box className={classes.h5} mt={1}>
                20%
              </Box>
            </Box>
          </Grid>
          <Grid item md={3} xs={12}>
            <Box className={classes.infoItem}>
              <Box className={classes.h5} style={{ fontWeight: 800 }}>
                MY LIQUIDITY VALUE
              </Box>
              <Box className={classes.h5} mt={1}>
                1000 USD
              </Box>
            </Box>
          </Grid>
          <Grid item md={3} xs={12}>
            <Box display="flex" alignItems="center">
              <SecondaryButton
                size="medium"
                style={{ color: Color.Purple, width: "100%", border: "2px solid #9EACF2" }}
              >
                REMOVE
              </SecondaryButton>
              <PrimaryButton
                size="medium"
                style={{ background: Color.Purple, width: "100%" }}
                onClick={() => setOpenLiquidityModal(true)}
              >
                ADD MORE
              </PrimaryButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.outBox}>
        <Box className={classes.h2} style={{ padding: "50px 0 30px 50px" }}>
          Coin flip history
        </Box>
        <CoinFlipHistoryTable datas={flipHistory} />
      </Box>
      {openLiquidityModal && (
        <AddLiquidityModal open={openLiquidityModal} handleClose={() => setOpenLiquidityModal(false)} />
      )}
      <RemoveLiquidityModal
        open={openRemoveLiquidityModal}
        onClose={() => setOpenRemoveLiquidityModal(false)}
        onConfirm={() => setOpenRemoveLiquidityModal(false)}
      />
    </Box>
  );
}
