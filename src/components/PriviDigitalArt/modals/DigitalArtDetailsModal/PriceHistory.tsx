import { makeStyles, MenuItem, Select } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { getAuctionBidHistory, getBidHistory, getExchangePriceHistory } from "shared/services/API";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import PrintChart from "shared/ui-kit/Chart/Chart";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { RootState } from "store/reducers/Reducer";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";

const useStyles = makeStyles(theme => ({
  valueBox: {
    borderRadius: theme.spacing(2),
    boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.1)",
    background: "white",
    padding: theme.spacing(2),
    position: "absolute",
    top: theme.spacing(1),
    left: theme.spacing(2),
    minWidth: theme.spacing(30),
    [theme.breakpoints.down("sm")]: {
      minWidth: theme.spacing(25),
      left: theme.spacing(0),
    },
  },
  dropBox: {
    width: "100%",
    borderRadius: theme.spacing(1),
    border: "1px solid #C0C6DC",
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
  },
}));

const DROPVALUES = ["Last 7 days"];

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
          top: 20,
          bottom: 0,
        },
      },

      scales: {
        xAxes: [
          {
            offset: false,
            display: true,
            gridLines: {
              color: "#F7F9FE",
              lineWidth: 75,
              drawBorder: false,
            },
            ticks: {
              beginAtZero: true,
              fontColor: "#6B6B6B",
              fontFamily: "Agrandir",
              display: false,
            },
          },
        ],
        yAxes: [
          {
            display: true,
            gridLines: {
              color: "#EFF2F8",
              drawBorder: false,
            },
            ticks: {
              display: false,
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

const GradientBgPlugin = {
  beforeDraw: function (chart, args, options) {
    const ctx = chart.ctx;
    const canvas = chart.canvas;
    const chartArea = chart.chartArea;

    // Chart background
    var gradientBack = canvas.getContext("2d").createLinearGradient(0, 0, 0, 250);
    gradientBack.addColorStop(0, "rgba(60, 174, 163, 0.7)");
    gradientBack.addColorStop(0.5, "rgba(255, 255, 255, 0)");
    gradientBack.addColorStop(1, "rgba(32, 99, 155, 0.7)");

    ctx.fillStyle = gradientBack;
    ctx.fillRect(
      chartArea.left,
      chartArea.bottom,
      chartArea.right - chartArea.left,
      chartArea.top - chartArea.bottom
    );
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

const PriceHistory = ({ media, makeOffer }) => {
  const user = useSelector((state: RootState) => state.user);
  const { convertTokenToUSD } = useTokenConversion();
  const classes = useStyles();
  const [priceHistory, setPriceHistory] = React.useState<any[]>([]);
  const [bidPriceInfo, setBidPriceInfo] = React.useState<any>({
    lastPrice: 0,
    priceChange: 0,
    priceChangePct: 0,
  });
  const [priceHistoryConfig, setPriceHistoryConfig] = React.useState<any>();
  const [dropDownValue, setDropDownValue] = React.useState<any>(DROPVALUES[0]);

  React.useEffect(() => {
    loadData();
  }, [media.tokenId]);

  React.useEffect(() => {
    // set graph data
    const newConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newConfig.plugins = [GradientBgPlugin];
    newConfig.configurer = configurer;
    newConfig.config.data.labels = priceHistory.map(history => history.date);
    newConfig.config.data.datasets[0].data = priceHistory.map(history => history.price.toFixed(4));
    newConfig.config.data.datasets[0].backgroundColor = "#27E8D9";
    newConfig.config.data.datasets[0].borderColor = "#27E8D9";
    newConfig.config.data.datasets[0].pointBackgroundColor = "#27E8D9";
    newConfig.config.data.datasets[0].hoverBackgroundColor = "#27E8D9";
    setPriceHistoryConfig(newConfig);
    // set price change
    if (priceHistory.length > 1) {
      const p1 = priceHistory[priceHistory.length - 1].price;
      const p2 = priceHistory[priceHistory.length - 2].price;
      setBidPriceInfo({
        lastPrice: p1,
        priceChange: p1 - p2,
        priceChangePct: (100 * (p1 - p2)) / p2,
      });
    }
  }, [priceHistory]);

  const loadData = () => {
    if (media?.auction) {
      getAuctionBidHistory({
        id: media.auction.id,
        type: "PIX",
      }).then(resp => {
        if (resp?.success) setPriceHistory(resp.data);
      });
    } else if (media?.exchange) {
      getExchangePriceHistory(media.exchange.id).then(resp => {
        if (resp?.success) setPriceHistory(resp.data);
      });
    }
  };

  return (
    <Box style={{ position: "relative" }} width={1}>
      <LoadingWrapper loading={!priceHistoryConfig} theme={"blue"}>
        <Box display="flex" style={{ position: "absolute", left: "16px", top: "8px" }}>
          <Box className={classes.valueBox}>
            <Select
              className={classes.dropBox}
              value={dropDownValue}
              onChange={e => setDropDownValue(e.target.value)}
            >
              {DROPVALUES.map((order, index) => (
                <MenuItem key={`order-${index}`} value={order}>
                  <Box>{order}</Box>
                </MenuItem>
              ))}
            </Select>
            <Box mt={2}>
              <Box style={{ fontSize: 18 }}>
                {convertTokenToUSD(
                  media?.Auctions?.TokenSymbol ?? "USDT",
                  bidPriceInfo.lastPrice ?? 0
                ).toFixed(4)}
              </Box>
              <Box
                color={bidPriceInfo.priceChange ?? 0 >= 0 ? "#65CB63" : "#F2A07E"}
                style={{ fontSize: 14 }}
                mt={1}
              >
                {bidPriceInfo.priceChange ?? 0 > 0 ? "+" : ""}
                {convertTokenToUSD(
                  media?.auction?.bidTokenSymbol ?? "USDT",
                  bidPriceInfo.priceChange ?? 0
                ).toFixed(4)}{" "}
                ({bidPriceInfo.priceChangePct ?? 0 > 0 ? "+" : ""}
                {bidPriceInfo.priceChangePct}%)
              </Box>
            </Box>
          </Box>
        </Box>
        {priceHistoryConfig && (
          <Box style={{ height: 400 }}>
            <PrintChart config={priceHistoryConfig} />
          </Box>
        )}
        <Box mt={3} display="flex" flexDirection="row" justifyContent="space-between" mb={1}>
          {/* <SecondaryButton size="medium">Cancel</SecondaryButton> */}
          {media?.auction && media.auction.owner !== user.id && (
            <PrimaryButton size="medium" onClick={makeOffer} style={{ background: "#431AB7" }}>
              Make offer
            </PrimaryButton>
          )}
        </Box>
      </LoadingWrapper>
    </Box>
  );
};

export default PriceHistory;
