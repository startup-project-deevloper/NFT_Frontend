import React, { useEffect, useState } from "react";
import { Color, Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { useOrderBookModalStyles } from "./index.styles";
import { ReactComponent as HistoryIcon } from "assets/icons/history.svg";
import { ReactComponent as OpenseaIcon } from "assets/priviIcons/opensea.svg";
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
          // pointRadius: 0,
          // borderJoinStyle: "round",
          // borderCapStyle: "round",
          borderRadius: 5,
          // lineTension: 0.2,
          // barPercentage: 0.3,
          borderColor: "#9EACF2",
          borderWidth: 0,
          backgroundColor: '#9EACF2',
          // pointBackgroundColor: "#9EACF2",
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
              color: "#9EACF2",
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
    gradient.addColorStop(1, Color.Purple);
    config.data.datasets[0].backgroundColor = gradient;
  }

  return config;
};
const ChartLabels = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16"];

const OrderBookModal = ({ open, onClose }) => {
  const classes = useOrderBookModalStyles();
  const [selectedTab, setSelectedTab] = useState<string>('offers');

  const tableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "NFT ID",
    },
    {
      headerName: "PRICE",
    },
    {
      headerName: "OFFER STRENGTH",
    },
    {
      headerName: "EXPIRATION",
    },
    {
      headerName: "FROM",
    },
    {
      headerName: "URL",
    },
  ];
  const tableData: Array<Array<CustomTableCellInfo>> = [
    [
      {
        cell: <Box color="rgba(67, 26, 183, 1)">{"#4555"}</Box>,
      },
      {
        cell: `0.3 ETH`,
      },
      {
        cell: `99.9% below the floor`,
      },
      {
        cell: '3 Days',
      },
      {
        cell: <Box color={'#431AB7'}>0x1s3...23s</Box>,
      },
      {
        cell: (
          <Box color={'#4A94E2'} display="flex" alignItems="center">
            <OpenseaIcon className={classes.tableIcon} width={24} height={24} style={{ marginRight: 10 }} />
            <span>Opensea</span>
          </Box>
        ),
      },
    ],
    [
      {
        cell: <Box color="rgba(67, 26, 183, 1)">{"#4555"}</Box>,
      },
      {
        cell: `0.3 ETH`,
      },
      {
        cell: `99.9% below the floor`,
      },
      {
        cell: '3 Days',
      },
      {
        cell: <Box color={'#431AB7'}>0x1s3...23s</Box>,
      },
      {
        cell: (
          <Box color={'#4A94E2'} display="flex" alignItems="center">
            <OpenseaIcon className={classes.tableIcon} width={24} height={24} style={{ marginRight: 10 }} />
            <span>Opensea</span>
          </Box>
        ),
      },
    ]
  ];

  const salesTableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "NFT ID",
      headerAlign: "center",
    },
    {
      headerName: "PRICE",
      headerAlign: "center",
    },
    {
      headerName: "FROM",
      headerAlign: "center",
    },
    {
      headerName: "TO",
      headerAlign: "center",
    },
    {
      headerName: "DATE",
      headerAlign: "center",
    },
    {
      headerName: "EXPLORER",
    },
  ];
  const salesTableData: Array<Array<CustomTableCellInfo>> = [
    [
      {
        cell: <Box color="rgba(67, 26, 183, 1)">{"#4555"}</Box>,
        cellAlign: "center",
      },
      {
        cell: `0.3 ETH`,
        cellAlign: "center",
      },
      {
        cell: <Box>0x1s3...23s</Box>,
        cellAlign: "center",
      },
      {
        cell: <Box>0x1s3...23s</Box>,
        cellAlign: "center",
      },
      {
        cell: <Box>10:22, 21.09.2021</Box>,
        cellAlign: "center",
      },
      {
        cell: (
          <Box className={classes.saleTableLinkWithIcon} color={'#4A94E2'} display="flex" alignItems="center">
            <OpenseaIcon className={classes.tableIcon} width={24} height={24} style={{ marginRight: 10 }} />
            <span>Go to Opensea</span>
            <Box> {">"}</Box>
          </Box>
        ),
        cellAlign: "center",
      },
    ],
    [
      {
        cell: <Box color="rgba(67, 26, 183, 1)">{"#4555"}</Box>,
        cellAlign: "center",
      },
      {
        cell: `0.3 ETH`,
        cellAlign: "center",
      },
      {
        cell: <Box>0x1s3...23s</Box>,
        cellAlign: "center",
      },
      {
        cell: <Box>0x1s3...23s</Box>,
        cellAlign: "center",
      },
      {
        cell: <Box>10:22, 21.09.2021</Box>,
        cellAlign: "center",
      },
      {
        cell: (
          <Box className={classes.saleTableLinkWithIcon} color={'#4A94E2'} display="flex" alignItems="center">
            <OpenseaIcon className={classes.tableIcon} width={24} height={24} style={{ marginRight: 10 }} />
            <span>Go to Opensea</span>
            <Box> {">"}</Box>
          </Box>
        ),
        cellAlign: "center",
      },
    ],
    [
      {
        cell: <Box color="rgba(67, 26, 183, 1)">{"#4555"}</Box>,
        cellAlign: "center",
      },
      {
        cell: `0.3 ETH`,
        cellAlign: "center",
      },
      {
        cell: <Box>0x1s3...23s</Box>,
        cellAlign: "center",
      },
      {
        cell: <Box>0x1s3...23s</Box>,
        cellAlign: "center",
      },
      {
        cell: <Box>10:22, 21.09.2021</Box>,
        cellAlign: "center",
      },
      {
        cell: (
          <Box className={classes.saleTableLinkWithIcon} color={'#4A94E2'} display="flex" alignItems="center">
            <OpenseaIcon className={classes.tableIcon} width={24} height={24} style={{ marginRight: 10 }} />
            <span>Go to Opensea</span>
            <Box> {">"}</Box>
          </Box>
        ),
        cellAlign: "center",
      },
    ]
  ];

  const [rewardConfig, setRewardConfig] = useState<any>();
  const PERIODS = ["Price Distribution", "Floor Price"];
  const [period, setPeriod] = useState<string>(PERIODS[0]);

  const getAllValues = React.useCallback(() => {
    const result: number[] = [];
    for (let index = 1; index <= 16; index++) {
      result.push(Math.floor(Math.random() * 100));
    }

    return result;
  }, []);

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

  const handleTabClick = (type) => {
    setSelectedTab(type);
  }

  const handleChangePeriod = (period: string) => () => {
    setPeriod(period);
  };

  return (
    <Modal size="small" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <Box className={classes.container}>
        <h1 className={classes.title}>Order Book</h1>
        <Box className={classes.listingContainer}>
          <Box className={classes.listingTabs}>
            <Box className={`${classes.listingTab} ${selectedTab === 'offers' ? 'selected' : '' }`} onClick={() => handleTabClick('offers')}>
              Buying offers
            </Box>
            <Box className={`${classes.listingTab} ${selectedTab === 'listings' ? 'selected' : '' }`} onClick={() => handleTabClick('listings')}>
              Listings
            </Box>
          </Box>
          <Box className={classes.listingTable}>
            <CustomTable headers={tableHeaders} rows={tableData} placeholderText="No transactions" />
          </Box>
        </Box>
        <Box className={classes.chartContainer}>
          <Box className={classes.controlParentBox}>
            <Box display="flex" flexDirection="column">
              <h2 className={classes.graphTitle}>
                {period === PERIODS[0] ? PERIODS[0] : PERIODS[1] }
              </h2>
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
          <Box flex={1} width={1} className={classes.chartWrapper}>
            {rewardConfig && <PrintChart config={rewardConfig} />}
          </Box>
        </Box>
        <Box className={classes.saleContainer}>
          <Box className={classes.saleTable}>
            <h2 className={classes.subTitle}><HistoryIcon /> Sale history</h2>
            <CustomTable headers={salesTableHeaders} rows={salesTableData} placeholderText="No transactions" />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default OrderBookModal;
