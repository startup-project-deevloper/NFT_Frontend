import React, { useMemo, useState } from "react";
import Web3 from "web3";
import { Grid, Fade, InputBase, Tooltip, IconButton, useMediaQuery, TooltipProps } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Moment from "react-moment";

import Box from "shared/ui-kit/Box";
import { Color, PrimaryButton } from "shared/ui-kit";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import PrintChart from "shared/ui-kit/Chart/Chart";
import { SyntheticFractionalisedTradeFractionsPageStyles } from "./index.styles";
import BuyJotsModal from "../../../../modals/BuyJotsModal";
import EditNFTPriceModal from "../../../../modals/EditNFTPrice";
import EditJOTsSupplyModal from "../../../../modals/EditJOTsSupply";
import QuickSwapModal from "../../../../modals/QuickSwapModal";
import BuyBackModel from "../../modals/BuyBackModal";
import {
  getSyntheticNFTTransactions,
  getSyntheticNFTOwnerHistory,
  setSyntheticNFTAuction,
} from "shared/services/API/SyntheticFractionalizeAPI";
import AddJOTsModal from "components/PriviDigitalArt/modals/AddJOTsModal";
import WithdrawJOTsModal from "components/PriviDigitalArt/modals/WithdrawJOTsModal";
import { styled } from "@material-ui/styles";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import { useWeb3React } from "@web3-react/core";
import { BlockchainNets } from "shared/constants/constants";
import Axios from "axios";
import URL, { PriceFeed_URL, PriceFeed_Token } from "shared/functions/getURL";
import { SwitchButton } from "shared/ui-kit/SwitchButton";
import WithdrawFundsModal from "components/PriviDigitalArt/modals/WithdrawFundModal";

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
            offset: false,
            display: true,
            gridLines: {
              color: "#431AB7",
              offsetGridLines: true,
            },
            ticks: {
              beginAtZero: true,
              fontColor: "#FFF",
              fontFamily: "Agrandir",
            },
          },
        ],
        yAxes: [
          {
            display: false,
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
    gradient.addColorStop(0.5, Color.Purple);
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
  const isMobile = useMediaQuery("(max-width:1080px)");
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
      headerName: "Polygon Scan",
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
            cell: `${row.tokenAmount || "0"} JOTs`,
          },
          {
            cell: `${row.value || "0"} USDT`,
          },
          {
            cell: <Box color="rgba(67, 26, 183, 1)">{row.account || ""}</Box>,
          },
          {
            cell: row.time ? <Moment fromNow>{row.time * 1000}</Moment> : "",
          },
          {
            cell: (
              <Box>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={"https://mumbai.polygonscan.com/tx/" + (row.hash ?? "")}
                >
                  <img src={require(`assets/icons/polygon_scan.png`)} />
                </a>
              </Box>
            ),
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
  setNft,
}: any) {
  const history = useHistory();
  const classes = SyntheticFractionalisedTradeFractionsPageStyles();
  const [rewardConfig, setRewardConfig] = React.useState<any>();
  const [ownerHistory, setOwnerHistory] = React.useState<any[]>([]);
  const [currentSupply, setCurrentSupply] = React.useState<any>({
    price: 0,
    date: new Date().getTime(),
  });
  const [soldSupply, setSoldSupply] = React.useState<number>(nft.SoldSupply);

  const [jotPrice, setJotPrice] = React.useState<number>(0);
  const [transList, setTransList] = React.useState<any[]>(tempHistory);
  const [openBuyJotsModal, setOpenBuyJotsModal] = React.useState<boolean>(false);
  const [openEditPriceModal, setOpenEditPriceModal] = React.useState<boolean>(false);
  const [openEditSupplyModal, setOpenEditSupplyModal] = React.useState<boolean>(false);
  const [openAddJOTsModal, setOpenAddJOTsModal] = React.useState<boolean>(false);
  const [openQuickSwapModal, setOpenQuickSwapModal] = React.useState<boolean>(false);
  const [openWithdrawJOTsModal, setOpenWithdrawJOTsModal] = React.useState<boolean>(false);
  const [openBuyBackModal, setOpenBuyBackModal] = React.useState<boolean>(false);
  const [remainingTime, setRemainingTime] = React.useState<number>(-1);
  const [intervalId, setIntervalId] = React.useState<any>(null);
  const [openWithdrawFundsModal, setOpenWithdrawFundsModal] = useState<boolean>(false);

  const { account, library, chainId } = useWeb3React();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isAllowFlipCoin, setIsAllowFlipCoin] = useState<boolean>(false);

  React.useEffect(() => {
    if (!nft) return;
    setSoldSupply(nft.SoldSupply);
    setIsAllowFlipCoin(!!nft.isAllowFlipCoin);
  }, [nft]);

  const isMobileScreen = useMediaQuery("(max-width:1080px)");
  const ownershipJot = +nft.OwnerSupply;
  const maxSupplyJot = +nft.SellingSupply;

  const [ownerSupply, setOwnerSupply] = React.useState<number>(-1);
  const [sellingSupply, setSellingSupply] = React.useState<number>(-1);
  const [liquiditySold, setLiquiditySold] = useState<any>(0);

  React.useEffect(() => {
    fetchOwnerHistory();
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      fetchOwnerHistory();
    }, 30000);
    getJotPrice();
    getLiquidity();

    return () => {
      clearInterval(interval);
    };
  }, [collectionId, nft]);

  const getLiquidity = async () => {
    try {
      const targetChain = BlockchainNets[1];

      const web3APIHandler = targetChain.apiHandler;
      const web3 = new Web3(library.provider);

      const liquiditySold = await web3APIHandler.SyntheticCollectionManager.getliquiditySold(web3, {
        nft,
      });

      if (liquiditySold) {
        setLiquiditySold(liquiditySold);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getJotPrice = async () => {
    const targetChain = BlockchainNets[1];
    const web3Config = targetChain.config;
    Axios.get(`${PriceFeed_URL()}/quickswap/pair`, {
      headers: {
        Authorization: `Basic ${PriceFeed_Token()}`,
      },
      params: {
        token0: web3Config.TOKEN_ADDRESSES["USDT"],
        token1: nft.JotAddress,
      },
    }).then(res => {
      const resp = res.data;

      if (resp.success) {
        const data = resp.data;
        setJotPrice(data.token0Price);
      }
    });
    nft.JotAddress;
  };

  const fetchOwnerHistory = async () => {
    const response = await getSyntheticNFTTransactions(collectionId, nft.SyntheticID);
    if (response.success) {
      setTransList(
        response.data
          .map(txn => ({
            type: "Buy",
            tokenAmount: txn.Amount,
            value: +txn.Amount * (+nft.Price || 1),
            account: txn.To
              ? isMobileScreen
                ? `${txn.To.substr(0, 4)}...${txn.To.substr(txn.To.length - 4, 4)}`
                : txn.To
              : "",
            time: txn.Date,
            hash: txn.Id,
          }))
          .reverse()
      );
    }
    const ownerHisotryResponse = await getSyntheticNFTOwnerHistory(collectionId, nft.SyntheticID);
    if (ownerHisotryResponse.success) {
      const ownerHistoryRes = ownerHisotryResponse.data.reverse();

      let labels: any[] = [];
      let data: any[] = [];
      const curDate = new Date().getDate();
      if (ownerHistoryRes && ownerHistoryRes.length !== ownerHistory.length) {
        if (ownerHistoryRes && ownerHistoryRes.length) {
          ownerHistoryRes
            .filter((item, index) => {
              return index < curDate;
            })
            .forEach((item, index) => {
              labels.push(index + 1);
              data.push(item.supply);
            });

          setCurrentSupply({
            price: ownerHistoryRes[0].supply,
            date: ownerHistoryRes[0].timestamp,
          });
        } else {
          labels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        }
        const newRewardConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
        newRewardConfig.configurer = configurer;
        newRewardConfig.config.data.labels = labels;
        newRewardConfig.config.data.datasets[0].data = data;
        newRewardConfig.config.data.datasets[0].backgroundColor = "#908D87";
        newRewardConfig.config.data.datasets[0].borderColor = "#DDFF57";
        newRewardConfig.config.data.datasets[0].pointBackgroundColor = "#DDFF57";
        newRewardConfig.config.data.datasets[0].hoverBackgroundColor = "#DDFF57";
        newRewardConfig.config.options.scales.xAxes[0].offset = false;
        newRewardConfig.config.options.scales.yAxes[0].ticks.display = true;

        setOwnerHistory(ownerHistoryRes);
        setRewardConfig(newRewardConfig);
      }
    }
  };

  const handleWithdrawFunds = async () => {
    setOpenWithdrawFundsModal(true);
  };

  const handleRefresh = async () => {
    try {
      const targetChain = BlockchainNets[1];

      const web3APIHandler = targetChain.apiHandler;
      const web3 = new Web3(library.provider);

      const ownerSup = await web3APIHandler.SyntheticCollectionManager.getOwnerSupply(web3, nft, {
        tokenId: nft.SyntheticID,
      });

      if (ownerSup) {
        setOwnerSupply(ownerSup);
        setNft({
          ...nft,
          OwnerSupply: ownerSup,
        });
      }

      const sellingSup = await web3APIHandler.SyntheticCollectionManager.getSellingSupply(web3, nft, {
        tokenId: nft.SyntheticID,
      });

      if (sellingSup) {
        setSellingSupply(sellingSup);
        setNft({
          ...nft,
          SellingSupply: sellingSup,
        });
      }

      const soldSupply = await web3APIHandler.SyntheticCollectionManager.getSoldSupply(web3, nft, {
        tokenId: nft.SyntheticID,
      });

      if (soldSupply) {
        setSoldSupply(soldSupply);
        setNft({
          ...nft,
          SoldSupply: soldSupply,
        });
      }

      return { ownerSupply: ownerSup, sellingSupply: sellingSup, soldSupply };
    } catch (err) {
      console.log("error", err);
    }
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

  const handleOpenAddJOTsModal = () => {
    setOpenAddJOTsModal(true);
  };

  const handleOpenWithdrawJOTsModal = () => {
    setOpenWithdrawJOTsModal(true);
  };

  const handleAddLiquidity = async () => {
    setLoading(true);

    const targetChain = BlockchainNets[1];
    const web3 = new Web3(library.provider);
    const web3APIHandler = targetChain.apiHandler;

    const response = await web3APIHandler.SyntheticCollectionManager.addLiquidityToPool(web3, account!, nft);
    if (response.success) {
      getJotPrice();
    } else {
    }
    setLoading(false);
  };

  const handleBuyOnQuickSwap = () => {
    history.push(`/fractionalisation/collection/quick_swap/${collectionId}`);
  };

  const handleBuyBack = () => {
    setOpenBuyBackModal(true);
  };

  const totalJot = 10000;
  const percentage = useMemo(
    () => Number(((ownerSupply === -1 ? ownershipJot : ownerSupply) / totalJot).toFixed(2)) * 100,
    [ownerSupply, ownershipJot, totalJot]
  );

  const handleCloseWithdrawFunds = () => {
    setOpenWithdrawFundsModal(false);
  };

  const handleWithdrawFundsCompleted = () => {
    getLiquidity();
  };

  React.useEffect(() => {
    if (ownershipJot === 0) {
      const fetchRemainingTime = async () => {
        try {
          const targetChain = BlockchainNets[1];
          const web3 = new Web3(library.provider);
          const web3APIHandler = targetChain.apiHandler;

          const response = await web3APIHandler.SyntheticFractionalisationAuctionsManager.getRecoverableTill(
            web3,
            nft,
            {
              tokenId: nft.SyntheticID,
            }
          );
          if (response.success) {
            const time = +response.endTime - Math.floor(Date.now() / 1000) + 60 * 5;
            setRemainingTime(time);
            const intervalId = setInterval(() => {
              setRemainingTime(remainingTime => (remainingTime > 0 ? remainingTime - 1 : remainingTime));
            }, 1000);
            setIntervalId(intervalId);
          }
        } catch (err) {
          console.log("err", err);
        }
      };
      fetchRemainingTime();
    }
  }, [ownershipJot]);

  React.useEffect(() => {
    if (intervalId && remainingTime === 0) {
      clearInterval(intervalId);
      setIntervalId(null);
      setRemainingTime(-1);
    }
    if (remainingTime <= 0 && ownershipJot === 0) {
      (async () => {
        await setSyntheticNFTAuction({ collectionId, syntheticId: nft.SyntheticID });
      })();
    }
  }, [intervalId, remainingTime]);

  const updateFlipCoinSetting = value => {
    setIsAllowFlipCoin(value);
    Axios.post(`${URL()}/syntheticFractionalize/updateFlipCoinSetting`, {
      collectionAddress: nft.collection_id,
      SyntheticID: nft.SyntheticID,
      isAllowFlipCoin: value,
    });
  };

  const remainingDay = remainingTime >= 0 ? Math.floor(remainingTime / (3600 * 24)) : 0;
  const remainingHour = remainingTime >= 0 ? Math.floor((remainingTime % (3600 * 24)) / 3600) : 0;
  const remainingMin = remainingTime >= 0 ? Math.floor((remainingTime % 3600) / 60) : 0;
  const remainingSec = remainingTime >= 0 ? Math.floor(remainingTime % 60) : 0;

  return (
    <Box className={classes.root}>
      {isOwnerShipTab ? (
        <Box className={classes.outBox}>
          <Box display="flex" flexDirection="column">
            {ownerSupply === 0 || (ownerSupply === -1 && ownershipJot === 0) ? (
              isMobileScreen ? (
                <>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box
                      className={`${classes.h1} ${classes.ownerTitle}`}
                      sx={{ fontWeight: 800, fontFamily: "Agrandir" }}
                    >
                      Ownership management
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" mt={2.75}>
                    <Box className={classes.dayBox} mr={0.5}>
                      {remainingDay} Days
                    </Box>
                    <Box className={classes.timeBox} mr={0.5}>
                      {remainingHour}h
                    </Box>
                    <Box className={classes.timeBox} mr={0.5}>
                      {remainingMin}min
                    </Box>
                    <Box className={classes.timeBox}>{remainingSec}s</Box>
                  </Box>
                  <Box className={classes.descMobileBox} mt={3} width="100%">
                    Your position has been liquidated, you can buy back your NFT at 10k JOTS for next 7 days.
                    After that time the NFT will go for an auction.
                  </Box>

                  <Box className={classes.jotButton} mt={2} padding="11px 25px" width="fit-content">
                    Buy Back for 10k Jots
                  </Box>
                </>
              ) : (
                <>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box
                      className={`${classes.h1} ${classes.ownerTitle}`}
                      sx={{ fontWeight: 800, fontFamily: "Agrandir" }}
                    >
                      Ownership management
                    </Box>
                    <Box className={classes.jotButton}>Buy Back for 10k Jots</Box>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Box className={classes.dayBox} mr={0.5}>
                      {remainingDay} Days
                    </Box>
                    <Box className={classes.timeBox} mr={0.5}>
                      {remainingHour}h
                    </Box>
                    <Box className={classes.timeBox} mr={0.5}>
                      {remainingMin}min
                    </Box>
                    <Box className={classes.timeBox}>{remainingSec}s</Box>
                  </Box>
                  <Box className={classes.descBox} mt={4.5}>
                    Your position has been liquidated, you can buy back your NFT at 10k JOTs for next 7 days.
                    After that time the NFT will go for an auction.
                  </Box>
                </>
              )
            ) : (
              <>
                <Box display="flex" flexDirection="column">
                  <Box
                    className={`${classes.h1} ${classes.ownerTitle}`}
                    sx={{ fontWeight: 800, fontFamily: "Agrandir GrandHeavy" }}
                  >
                    Ownership management
                  </Box>
                  <Box className={classes.boxBody}>
                    <Box
                      className={classes.col_half}
                      sx={{ borderRight: "1px solid #ECE8F8", marginY: "15px", paddingY: "5px" }}
                    >
                      <Box className={classes.ownerInfo}>
                        <Box
                          className={classes.h4}
                          pb={1}
                          sx={{ justifyContent: "center", alignItems: "center" }}
                        >
                          Your current ownership
                          <HtmlTooltip
                            title="If your ownership reaches 0, you will loose your NFT"
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            placement="bottom-start"
                            arrow
                          >
                            <IconButton>
                              <InfoIcon />
                            </IconButton>
                          </HtmlTooltip>
                        </Box>
                        <Box className={classes.h2} sx={{ justifyContent: "center", fontWeight: 800 }}>
                          {ownerSupply === -1 ? ownershipJot : ownerSupply} JOTs
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 14,
                          }}
                        >
                          <PrimaryButton
                            className={classes.h4}
                            size="medium"
                            style={{
                              background: Color.White,
                              color: Color.Purple,
                              border: "solid 0.7px",
                              borderColor: Color.Purple,
                              padding: "0px 25px",
                              maxWidth: 170,
                              borderRadius: 4,
                            }}
                            onClick={handleOpenWithdrawJOTsModal}
                          >
                            Withdraw JOTs
                          </PrimaryButton>
                          <PrimaryButton
                            className={classes.h4}
                            size="medium"
                            style={{
                              background: Color.Purple,
                              color: Color.White,
                              padding: "0px 25px",
                              maxWidth: 170,
                              borderRadius: 4,
                            }}
                            onClick={handleOpenAddJOTsModal}
                          >
                            Add more JOTs
                          </PrimaryButton>
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      className={classes.col_half}
                      sx={{ borderRight: "1px solid #ECE8F8", marginY: "15px", paddingY: "5px" }}
                    >
                      <Box className={classes.ownerInfo} style={{ margin: "auto", width: "fit-content" }}>
                        <Box className={classes.h4} pb={1} sx={{ justifyContent: "center" }}>
                          Selling supply
                        </Box>
                        <Box className={classes.h2} sx={{ justifyContent: "center", fontWeight: 800 }}>
                          {sellingSupply === -1 ? maxSupplyJot : sellingSupply} JOTs
                        </Box>
                        <PrimaryButton
                          className={classes.h4}
                          size="medium"
                          style={{
                            background: Color.Purple,
                            color: Color.White,
                            padding: "0px 25px",
                            maxWidth: 215,
                            marginTop: 14,
                            borderRadius: 4,
                          }}
                          onClick={handleOpenEditSupplyModal}
                        >
                          Increase Supply
                        </PrimaryButton>
                      </Box>
                    </Box>
                    <Box className={classes.col_half} sx={{ marginY: "15px", paddingY: "5px" }}>
                      <Box
                        className={classes.ownerInfo}
                        style={{
                          background: "#DDFF57",
                          borderRadius: 12,
                          padding: "21px 0 18px 31px",
                          marginLeft: 18,
                        }}
                      >
                        <Box className={classes.h4} pb={1} sx={{ justifyContent: "center" }}>
                          Current Reserve Price to Buy Back
                        </Box>
                        <Box className={classes.h2} sx={{ justifyContent: "center", fontWeight: 800 }}>
                          {sellingSupply === -1 ? maxSupplyJot : sellingSupply} JOTs
                        </Box>
                        <PrimaryButton
                          className={classes.h4}
                          size="medium"
                          style={{
                            color: Color.White,
                            background: Color.Purple,
                            padding: "0px 25px",
                            maxWidth: 250,
                            marginTop: 14,
                            display: "flex",
                            alignItems: "center",
                            borderRadius: 4,
                          }}
                          onClick={() => setOpenQuickSwapModal(true)}
                        >
                          Buy Back to Withdraw
                        </PrimaryButton>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box
                  className={classes.progressContainer}
                  style={{
                    background: percentage < 33 ? "#FFE8E1" : percentage < 66 ? "#FFF8E1" : "#E1FFEA",
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="space-between" mt={2} mb={1.5}>
                    <Box className={classes.progressTitle} display="flex" alignItems="center">
                      <span>Margin left before Liquidation</span>
                      <span>
                        {ownerSupply === -1 ? ownershipJot : ownerSupply} / <b>{totalJot} JOTs</b>
                      </span>
                    </Box>
                    <Box
                      color={percentage < 33 ? "#FF1F00" : percentage < 66 ? "#FF7C02" : "#2D4236"}
                      fontSize={13}
                    >
                      {percentage < 33
                        ? "Add more JOTs to  your margin , or  you will loose your NFT"
                        : percentage < 66
                        ? "Please monitor closely your your margin, you will loose your NFT if it reaches 0"
                        : "If your margin reaches 0, you will loose your NFT"}
                    </Box>
                  </Box>
                  <Box
                    className={classes.progressBar}
                    style={{
                      border:
                        percentage < 33
                          ? "1px solid rgba(189, 92, 38, 0.5)"
                          : percentage < 66
                          ? "1px solid rgba(189, 92, 38, 0.5)"
                          : "1px solid rgba(38, 189, 139, 0.5)",
                    }}
                  >
                    <Box
                      className={classes.progressed}
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                        background:
                          percentage < 33
                            ? "linear-gradient(100.71deg, #E80000 2.8%, #FF4438 74.66%)"
                            : percentage < 66
                            ? "linear-gradient(96.92deg, #FF7A00 19.32%, #FFC46A 143.47%)"
                            : "linear-gradient(94.62deg, #1AB791 13.81%, #97F84B 196.55%)",
                      }}
                    />
                  </Box>
                  <Box display="flex" className={classes.progressGrid} padding="0 12px" height={5}>
                    {Array(100)
                      .fill(1)
                      .map((_, index) => (
                        <Box flex={1} key={`grid-${index}`} borderLeft="1px solid #717171" />
                      ))}
                  </Box>
                  <Box display="flex" className={classes.progressLabel}>
                    <Box flex={1} style={{ textAlign: "left" }}>
                      Liquidation
                    </Box>
                    <Box flex={1} style={{ textAlign: "center" }}>
                      High Risk
                    </Box>
                    <Box flex={1} style={{ textAlign: "center" }}>
                      Medium Risk
                    </Box>
                    <Box flex={1} style={{ textAlign: "right" }}>
                      Low Risk
                    </Box>
                  </Box>
                </Box>
              </>
            )}
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
                    JOTs SOLD
                  </Box>
                  <Box className={classes.h2} sx={{ justifyContent: "center", fontWeight: 800 }}>
                    {soldSupply ?? 0} JOTs
                  </Box>
                </Box>
              </Box>
              <Box></Box>
              <Box className={classes.col_half} sx={{ marginY: "15px", paddingY: "5px" }}>
                <Box className={classes.h4} pb={1} sx={{ justifyContent: "center" }}>
                  ACCRUED INTEREST
                </Box>
                <Box className={classes.h2} sx={{ justifyContent: "center", fontWeight: 800 }}>
                  {nft.AccruedReward || 0} USDT
                </Box>
              </Box>
            </Box>
          </Box>
          {isOwner ? (
            <Box className={classes.outBox}>
              <Box className={classes.ownerPrice} position="relative">
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box
                      borderRadius={16}
                      display="flex"
                      flexDirection={isMobileScreen ? "column" : "row"}
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
                                ${nft.Price}
                              </Box>
                            </td>
                            <td>
                              <Box ml={3} className={classes.h1} fontWeight={800}>
                                {nft.SellingSupply - nft.SoldSupply} JOTs
                              </Box>
                            </td>
                          </tr>
                          {!isMobileScreen && (
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
                          )}
                        </tbody>
                      </table>
                      {isMobileScreen && (
                        <Box display="flex" flexDirection="column" alignItems="center">
                          <PrimaryButton
                            className={`${classes.h4} ${classes.ownerPriceBtn}`}
                            size="medium"
                            style={{ background: "#DDFF57", color: Color.Purple, width: "220px" }}
                            onClick={handleOpenEditPriceModal}
                          >
                            Edit Price
                          </PrimaryButton>
                          <PrimaryButton
                            className={`${classes.h4} ${classes.ownerPriceBtn}`}
                            size="medium"
                            style={{
                              marginLeft: 24,
                              background: "#DDFF57",
                              color: Color.Purple,
                              width: "220px",
                            }}
                            onClick={handleOpenEditSupplyModal}
                          >
                            Edit Supply
                          </PrimaryButton>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.priceContent}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        width={1}
                        justifyContent="center"
                        gridRowGap={8}
                      >
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
                          {jotPrice ? `$${jotPrice}` : "N/A"}
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
                          style={{ background: "#DDFF57", color: Color.Purple, maxWidth: "220px" }}
                          onClick={handleAddLiquidity}
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
          ) : (
            <Box className={classes.outBox}>
              <Box className={classes.ownerPrice} position="relative">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box className={`${classes.priceContent}`}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        gridColumnGap={24}
                        className={classes.priceInnerContent}
                      >
                        <Box display="flex" flexDirection="column" justifyContent="center" gridRowGap={8}>
                          <Box className={classes.h3}>Owner Price</Box>
                          <Box className={classes.h1} fontWeight={800}>
                            ${nft.Price}
                          </Box>
                        </Box>
                        <Box display="flex" flexDirection="column" justifyContent="center" gridRowGap={8}>
                          <Box className={classes.h3}>Supply</Box>
                          <Box className={classes.h1} fontWeight={800}>
                            {nft.SellingSupply - nft.SoldSupply} JOTs
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
                          disabled={nft.SellingSupply <= nft.SoldSupply}
                        >
                          Buy
                        </PrimaryButton>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.priceContent}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        width={1}
                        justifyContent="center"
                        gridRowGap={8}
                      >
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
                          {jotPrice ? `$${jotPrice}` : "N/A"}
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
                          onClick={handleBuyOnQuickSwap}
                          disabled={!+nft.totalLiquidity}
                        >
                          Buy on Quickswap
                        </PrimaryButton>

                        <PrimaryButton
                          className={classes.priceButton}
                          size="medium"
                          style={{ background: "#DDFF57", color: Color.Purple }}
                          onClick={handleAddLiquidity}
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
      {isOwner && (
        <>
          <Box className={classes.outBox}>
            <Box className={classes.boxBody} justifyContent="space-between">
              <Box
                className={`${classes.h1} ${classes.ownerTitle}`}
                alignItems="center"
                sx={{ fontWeight: 800, fontFamily: "Agrandir GrandHeavy" }}
              >
                <img
                  src={require(`assets/pixImages/coin.PNG`)}
                  width={24}
                  height={24}
                  style={{ marginRight: 8, marginBottom: 4 }}
                />
                Coin Flip Settings
              </Box>
              <Box display="flex" alignItems="center">
                <Box className={classes.h4} sx={{ justifyContent: "center", alignItems: "center" }} mr={3}>
                  Your current ownership
                  <HtmlTooltip
                    title=""
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    placement="bottom-start"
                    arrow
                  >
                    <IconButton>
                      <InfoIcon />
                    </IconButton>
                  </HtmlTooltip>
                </Box>
                <SwitchButton state={isAllowFlipCoin} setState={updateFlipCoinSetting} />
              </Box>
            </Box>
          </Box>
          <Box className={classes.outBox}>
            <Box display="flex" flexDirection="column">
              <Box
                className={`${classes.h1} ${classes.ownerTitle}`}
                sx={{ fontWeight: 800, fontFamily: "Agrandir GrandHeavy" }}
              >
                Revenue
              </Box>
              <Box className={classes.boxBody} style={{ alignItems: "flex-start" }}>
                <Box
                  className={classes.col_half}
                  sx={{ borderRight: "1px solid #ECE8F8", marginTop: "15px", paddingY: "5px" }}
                >
                  <Box className={classes.ownerInfo}>
                    <Box
                      className={classes.h4}
                      pb={1}
                      sx={{ justifyContent: "center", alignItems: "center" }}
                    >
                      Revenue raised from sales
                    </Box>
                    <Box className={classes.h2} sx={{ justifyContent: "center", fontWeight: 800 }}>
                      {liquiditySold} USDT
                    </Box>
                    <PrimaryButton
                      className={classes.h4}
                      size="medium"
                      style={{
                        background: Color.GreenLight,
                        color: Color.Purple,
                        padding: "0px 117px",
                        borderRadius: 4,
                        marginTop: 18,
                      }}
                      disabled={liquiditySold <= 0}
                      onClick={handleWithdrawFunds}
                    >
                      Withdraw Funds
                    </PrimaryButton>
                  </Box>
                </Box>
                <Box
                  className={classes.col_half}
                  sx={{ borderRight: "1px solid #ECE8F8", marginTop: "15px", paddingY: "5px" }}
                >
                  <Box className={classes.ownerInfo} style={{ margin: "auto", width: "fit-content" }}>
                    <Box className={classes.h4} pb={1} sx={{ justifyContent: "center" }}>
                      Liquidity on Quickswap
                    </Box>
                    <PrimaryButton
                      className={classes.h4}
                      size="medium"
                      style={{
                        background: Color.White,
                        color: Color.Purple,
                        border: "solid 0.7px",
                        borderColor: Color.Purple,
                        padding: "0px 60px",
                        marginTop: 14,
                        borderRadius: 4,
                      }}
                      onClick={() => {}}
                    >
                      Add Liquidity
                    </PrimaryButton>
                  </Box>
                </Box>
                <Box className={classes.col_half} sx={{ marginTop: "15px", paddingY: "5px" }}>
                  <Box className={classes.ownerInfo} style={{ margin: "auto", width: "fit-content" }}>
                    <Box className={classes.h4} pb={1} sx={{ justifyContent: "center" }}>
                      Liquidity on Derivatives
                    </Box>
                    <PrimaryButton
                      className={classes.h4}
                      size="medium"
                      style={{
                        background: Color.White,
                        color: Color.Purple,
                        border: "solid 0.7px",
                        borderColor: Color.Purple,
                        padding: "0px 80px",
                        marginTop: 14,
                        borderRadius: 4,
                      }}
                      onClick={() => {}}
                    >
                      Add Liquidity
                    </PrimaryButton>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      )}
      <Box className={classes.boxBody} width={1} mb="10px">
        <Box className={classes.chart}>
          {(!ownerHistory || !ownerHistory.length) && <div className="no-data">There are no data yet.</div>}
          <Box className={classes.controlParentBox}>
            <Box fontSize={18} fontWeight={700} color="white" width="120px">
              Ownership over time
            </Box>
            <Box display="flex" flexDirection="column">
              <h2 className={classes.graphTitle}>{currentSupply.price} USDT</h2>
              <Moment format="DD MMM YYYY" className={classes.graphDesc}>
                {currentSupply.date}
              </Moment>
            </Box>
          </Box>
          <Box height={300} width={1}>
            {rewardConfig && <PrintChart config={rewardConfig} />}
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
        collectionId={collectionId}
        nft={nft}
        handleRefresh={handleRefresh}
        handleClose={() => setOpenBuyJotsModal(false)}
      />
      <EditNFTPriceModal
        open={openEditPriceModal}
        onClose={() => setOpenEditPriceModal(false)}
        collectionId={collectionId}
        nft={nft}
      />
      <EditJOTsSupplyModal
        open={openEditSupplyModal}
        onClose={() => setOpenEditSupplyModal(false)}
        collectionId={collectionId}
        nft={nft}
        handleRefresh={handleRefresh}
      />
      <AddJOTsModal
        open={openAddJOTsModal}
        handleClose={() => setOpenAddJOTsModal(false)}
        collectionId={collectionId}
        nft={nft}
        setNft={setNft}
      />

      <WithdrawJOTsModal
        open={openWithdrawJOTsModal}
        handleClose={() => setOpenWithdrawJOTsModal(false)}
        collectionId={collectionId}
        nft={nft}
        setNft={setNft}
      />
      <WithdrawFundsModal
        open={openWithdrawFundsModal}
        handleClose={handleCloseWithdrawFunds}
        nft={nft}
        maxAmount={liquiditySold}
        onCompleted={handleWithdrawFundsCompleted}
      />
      <QuickSwapModal
        open={openQuickSwapModal}
        handleClose={() => setOpenQuickSwapModal(false)}
        collectionId={collectionId}
        nft={nft}
      />
      <BuyBackModel open={openBuyBackModal} onClose={() => setOpenBuyBackModal(false)} nft={nft} />
      <LoadingScreen
        loading={loading}
        title={`Transaction \nin progress`}
        subTitle={`Transaction is proceeding on ${BlockchainNets[1].value}.\nThis can take a moment, please be patient...`}
        handleClose={() => {}}
      ></LoadingScreen>
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

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  "& .MuiTooltip-tooltip": {
    color: "#431AB7",
    fontSize: "13px",
    lineHeight: "130%",
    background: "#EFF2FD",
    boxShadow: "0px 2px 5px rgba(97, 67, 181, 0.15), 0px 10px 14px rgba(97, 67, 181, 0.21)",
    borderRadius: "16px",
    maxWidth: 250,
    padding: "14px 20px",
  },
  "& .MuiTooltip-arrow": {
    color: "#EFF2FD",
  },
}));
