import React from "react";

import { Grid, Fade, InputBase, Tooltip, IconButton } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { Color, PrimaryButton } from "shared/ui-kit";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import PrintChart from "shared/ui-kit/Chart/Chart";
import { SyntheticFractionalisedTradeFractionsPageStyles } from "./index.styles";
import BuyJotsModal from "../../../../modals/BuyJotsModal";
import EditNFTPriceModal from "../../../../modals/EditNFTPrice";
import EditJOTsSupplyModal from "../../../../modals/EditJOTsSupply";

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
    let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight + 200);
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
  { type: "Buy", tokenAmount: "20 JOTs", value: "O USDC", account: "0xeec9...82f8", time: "2 minutes ago" },
  { type: "Buy", tokenAmount: "20 JOTs", value: "O USDC", account: "0xeec9...82f8", time: "2 minutes ago" },
  { type: "Buy", tokenAmount: "20 JOTs", value: "O USDC", account: "0xeec9...82f8", time: "2 minutes ago" },
  { type: "Buy", tokenAmount: "20 JOTs", value: "O USDC", account: "0xeec9...82f8", time: "2 minutes ago" },
  { type: "Buy", tokenAmount: "20 JOTs", value: "O USDC", account: "0xeec9...82f8", time: "2 minutes ago" },
  { type: "Buy", tokenAmount: "20 JOTs", value: "O USDC", account: "0xeec9...82f8", time: "2 minutes ago" },
];

export const TransactionTable = ({ datas }) => {
  const classes = SyntheticFractionalisedTradeFractionsPageStyles();
  // const usersList = useSelector((state: RootState) => state.usersInfoList);
  // const getUserInfo = (address: string) => usersList.find(u => u.address === address);

  const tableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "Type",
    },
    {
      headerName: "Token Amount",
    },
    {
      headerName: "Value",
    },
    {
      headerName: "Account",
    },
    {
      headerName: "Time",
    },
    {
      headerName: "Poligon Scan",
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
            cell: <Box color="rgba(67, 26, 183, 1)">{row.type || ""}</Box>,
          },
          {
            cell: row.tokenAmount || "",
          },
          {
            cell: row.value || "",
          },
          {
            cell: <Box color="rgba(67, 26, 183, 1)">{row.account || ""}</Box>,
          },
          {
            cell: row.time || "",
          },
          {
            cell: <img src={require(`assets/icons/polygon_scan.png`)} />,
          },
        ];
      });
    }
    setTableData(data);
  }, [datas]);

  return (
    <div className={classes.table}>
      <CustomTable headers={tableHeaders} rows={tableData} placeholderText="No transactions" />
    </div>
  );
};

export default function SyntheticFractionalisedTradeFractionsPage({
  isOwner = false,
  isOwnerShipTab = false,
  collectionId,
  nft,
}: any) {
  const classes = SyntheticFractionalisedTradeFractionsPageStyles();
  const [rewardConfig, setRewardConfig] = React.useState<any>();
  const PERIODS = ["1D", "6D", "YTD"];
  const [period, setPeriod] = React.useState<string>(PERIODS[0]);

  const [transList, setTransList] = React.useState<any[]>(tempHistory);
  const [openBuyJotsModal, setOpenBuyJotsModal] = React.useState<boolean>(false);
  const [openEditPriceModal, setOpenEditPriceModal] = React.useState<boolean>(false);
  const [openEditSupplyModal, setOpenEditSupplyModal] = React.useState<boolean>(false);

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

  const handleCloseBuyJotsModal = () => {
    setOpenBuyJotsModal(false);
  };

  const handleOpenBuyJotsModal = () => {
    setOpenBuyJotsModal(true);
  };

  const handleCloseEditPriceModal = () => {
    setOpenEditPriceModal(false);
  };

  const handleOpenEditPriceModal = () => {
    setOpenEditPriceModal(true);
  };

  const handleCloseEditSupplyModal = () => {
    setOpenEditSupplyModal(false);
  };

  const handleOpenEditSupplyModal = () => {
    setOpenEditSupplyModal(true);
  };

  return (
    <Box className={classes.root}>
      {isOwnerShipTab ? (
        <Box className={classes.outBox}>
          <Box display="flex" flexDirection="column">
            <Box
              className={`${classes.h1} ${classes.ownerTitle}`}
              sx={{ fontWeight: 800, fontFamily: "Agrandir" }}
            >
              Ownership management
            </Box>
            <Box className={classes.boxBody}>
              <Box
                className={classes.col_half}
                sx={{ borderRight: "1px solid #ECE8F8", marginY: "15px", paddingY: "5px" }}
              >
                <Box className={classes.ownerInfo}>
                  <Box className={classes.h4} pb={1} sx={{ justifyContent: "center", alignItems: "center" }}>
                    Your current ownership
                    <Tooltip
                      title="If your ownership reaches 0, you will loose your NFT"
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                      arrow
                    >
                      <IconButton>
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box className={classes.h2} sx={{ justifyContent: "center", fontWeight: 800 }}>
                    100 JOTs
                  </Box>
                  <PrimaryButton
                    className={classes.h4}
                    size="medium"
                    style={{
                      background: "#DDFF57",
                      color: Color.Purple,
                      padding: "0px 25px",
                      maxWidth: 170,
                      marginTop: 28,
                      borderRadius: 4,
                    }}
                  >
                    Add more JOTS
                  </PrimaryButton>
                </Box>
              </Box>
              <Box
                className={classes.col_half}
                sx={{ borderRight: "1px solid #ECE8F8", marginY: "15px", paddingY: "5px" }}
              >
                <Box className={classes.ownerInfo}>
                  <Box className={classes.h4} pb={1} sx={{ justifyContent: "center" }}>
                    Current supply
                  </Box>
                  <Box className={classes.h2} sx={{ justifyContent: "center", fontWeight: 800 }}>
                    10240 JOTs
                  </Box>
                  <PrimaryButton
                    className={classes.h4}
                    size="medium"
                    style={{
                      background: "#DDFF57",
                      color: Color.Purple,
                      padding: "0px 25px",
                      maxWidth: 215,
                      marginTop: 28,
                      borderRadius: 4,
                    }}
                  >
                    Increase JOTS to Sale
                  </PrimaryButton>
                </Box>
              </Box>
              <Box className={classes.col_half} sx={{ marginY: "15px", paddingY: "5px" }}>
                <Box className={classes.ownerInfo}>
                  <Box className={classes.h4} pb={1} sx={{ justifyContent: "center" }}>
                    Current supply
                  </Box>
                  <Box className={classes.h2} sx={{ justifyContent: "center", fontWeight: 800 }}>
                    10240 JOTs
                  </Box>
                  <PrimaryButton
                    className={classes.h4}
                    size="medium"
                    style={{
                      background: "#DDFF57",
                      color: Color.Purple,
                      padding: "0px 25px",
                      maxWidth: 250,
                      marginTop: 28,
                      display: "flex",
                      alignItems: "center",
                      borderRadius: 4,
                    }}
                  >
                    Swap on <img src={require("assets/pixImages/swap_icon.png")} alt="quick swap" /> Quickswap
                  </PrimaryButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <>
          <Box className={classes.outBox}>
            <Box className={classes.boxBody}>
              <Box
                className={classes.col_half}
                sx={{ borderRight: "1px solid #ECE8F8", marginY: "15px", paddingY: "5px" }}
              >
                <Box>
                  <Box className={classes.h4} pb={1} sx={{ justifyContent: "center" }}>
                    Jots SOLD
                  </Box>
                  <Box className={classes.h2} sx={{ justifyContent: "center", fontWeight: 800 }}>
                    2455 JOTs
                  </Box>
                </Box>
              </Box>
              <Box></Box>
              <Box className={classes.col_half} sx={{ marginY: "15px", paddingY: "5px" }}>
                <Box className={classes.h4} pb={1} sx={{ justifyContent: "center" }}>
                  ACCURED INTEREST
                </Box>
                <Box className={classes.h2} sx={{ justifyContent: "center", fontWeight: 800 }}>
                  0.55 USDT
                </Box>
              </Box>
            </Box>
          </Box>
          {isOwner ? (
            <Box className={classes.outBox}>
              <Box p={3} position="relative">
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box
                      borderRadius={16}
                      display="flex"
                      justifyContent="center"
                      height="100%"
                      p={4}
                      bgcolor="rgba(133, 183, 26, 0.1)"
                    >
                      <table>
                        <tbody>
                          <tr>
                            <td>
                              <Box className={classes.h3}>Owner Price</Box>
                            </td>
                            <td>
                              <Box ml={3} className={classes.h3}>
                                Supply
                              </Box>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <Box className={classes.h1} fontWeight={800}>
                                $0.28
                              </Box>
                            </td>
                            <td>
                              <Box ml={3} className={classes.h1} fontWeight={800}>
                                2455 JOTs
                              </Box>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <PrimaryButton
                                className={classes.h4}
                                size="medium"
                                style={{ background: "#DDFF57", color: Color.Purple }}
                                onClick={handleOpenEditPriceModal}
                              >
                                Edit Price
                              </PrimaryButton>
                            </td>
                            <td>
                              <PrimaryButton
                                className={classes.h4}
                                size="medium"
                                style={{ marginLeft: 24, background: "#DDFF57", color: Color.Purple }}
                                onClick={handleOpenEditSupplyModal}
                              >
                                Edit Supply
                              </PrimaryButton>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box
                      borderRadius={16}
                      p={4}
                      height="100%"
                      bgcolor="#431AB71A"
                      display="flex"
                      justifyContent="center"
                    >
                      <table>
                        <tbody>
                          <tr>
                            <td>
                              <Box justifyContent="center" className={classes.h3}>
                                Quickswap Price
                              </Box>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <Box justifyContent="center" className={classes.h1} fontWeight={800}>
                                $0.29
                              </Box>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <PrimaryButton
                                className={classes.h4}
                                size="medium"
                                style={{
                                  background: "#DDFF57",
                                  color: Color.Purple,
                                  width: "100%",
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                Edit Price
                              </PrimaryButton>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Box>
                  </Grid>
                </Grid>
                <img className={classes.crystal} src={require(`assets/icons/crystal.png`)} />
              </Box>
            </Box>
          ) : (
            <Box className={classes.outBox}>
              <Box p={3} position="relative">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box className={`${classes.priceContent} ${classes.priceSecondaryContent}`}>
                      <Box display="flex" justifyContent="center" gridColumnGap={24}>
                        <Box display="flex" flexDirection="column" justifyContent="center" gridRowGap={8}>
                          <Box className={classes.h3}>Owner Price</Box>
                          <Box className={classes.h1} fontWeight={800}>
                            $0.28
                          </Box>
                        </Box>
                        <Box display="flex" flexDirection="column" justifyContent="center" gridRowGap={8}>
                          <Box className={classes.h3}>Supply</Box>
                          <Box className={classes.h1} fontWeight={800}>
                            2455 JOTs
                          </Box>
                        </Box>
                      </Box>
                      <Box display="flex" justifyContent="center">
                        <PrimaryButton
                          className={classes.priceButton}
                          size="medium"
                          style={{
                            background: "#431AB7",
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            color: Color.White,
                          }}
                          onClick={handleOpenBuyJotsModal}
                        >
                          Buy
                        </PrimaryButton>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.priceContent}>
                      <Box display="flex" flexDirection="column" justifyContent="center" gridRowGap={8}>
                        <Box width={1} display="flex" justifyContent="center" className={classes.h3}>
                          Quickswap Price
                        </Box>
                        <Box
                          width={1}
                          display="flex"
                          justifyContent="center"
                          className={classes.h1}
                          fontWeight={800}
                        >
                          $0.28
                        </Box>
                      </Box>
                      <Box
                        display="flex"
                        flexWrap="wrap"
                        justifyContent="center"
                        gridColumnGap={8}
                        gridRowGap={8}
                      >
                        <PrimaryButton
                          className={classes.priceButton}
                          size="medium"
                          style={{ background: "#431AB7", color: Color.White }}
                        >
                          Buy on Quickswap
                        </PrimaryButton>

                        <PrimaryButton
                          className={classes.priceButton}
                          size="medium"
                          style={{ background: "#DDFF57", color: Color.Purple }}
                        >
                          Add liquidity on Quickswap
                        </PrimaryButton>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                <img className={classes.crystal} src={require(`assets/icons/crystal.png`)} />
              </Box>
            </Box>
          )}
        </>
      )}

      <Box className={classes.outBox}>
        <Box className={classes.boxBody}>
          <Box className={classes.chart}>
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
            <Box height={300} width={1} mt={3}>
              {rewardConfig && <PrintChart config={rewardConfig} />}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className={classes.outBox}>
        <Box className={classes.boxBody}>
          <Box width={1} className={classes.tableContainer}>
            <Box className={classes.tableTitle}>Transactions</Box>
            <TransactionTable datas={transList} />
          </Box>
        </Box>
      </Box>
      <BuyJotsModal
        open={openBuyJotsModal}
        handleClose={handleCloseBuyJotsModal}
        collectionId={collectionId}
        nftId={nft?.NftId}
        syntheticId={nft?.SyntheticID}
      />
      <EditNFTPriceModal
        open={openEditPriceModal}
        onClose={handleCloseEditPriceModal}
        collectionId={collectionId}
        nftId={nft?.NftId}
        syntheticId={nft?.SyntheticID}
      />
      <EditJOTsSupplyModal
        open={openEditSupplyModal}
        onClose={handleCloseEditSupplyModal}
        collectionId={collectionId}
        nftId={nft?.NftId}
        syntheticId={nft?.SyntheticID}
      />
    </Box>
  );
}

const InfoIcon = () => (
  <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0.601562 7C0.601562 3.13401 3.73557 0 7.60156 0C11.4676 0 14.6016 3.13401 14.6016 7C14.6016 10.866 11.4676 14 7.60156 14C3.73557 14 0.601562 10.866 0.601562 7Z"
      fill="#431AB7"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M8.14245 4.06089C8.14245 4.47359 7.81573 4.80605 7.39729 4.80605C6.98459 4.80605 6.65213 4.47359 6.65213 4.06089C6.65213 3.64245 6.98459 3.31 7.39729 3.31C7.81573 3.31 8.14245 3.64245 8.14245 4.06089ZM9.19714 9.598C9.19714 9.83301 9.01371 9.99924 8.7787 9.99924H6.44578C6.21077 9.99924 6.02734 9.83301 6.02734 9.598C6.02734 9.37445 6.21077 9.19676 6.44578 9.19676H7.15655V6.56577H6.54322C6.30821 6.56577 6.12479 6.39954 6.12479 6.16453C6.12479 5.94098 6.30821 5.76329 6.54322 5.76329H7.62084C7.91317 5.76329 8.06793 5.96964 8.06793 6.27917V9.19676H8.7787C9.01371 9.19676 9.19714 9.37445 9.19714 9.598Z"
      fill="white"
    />
  </svg>
);
