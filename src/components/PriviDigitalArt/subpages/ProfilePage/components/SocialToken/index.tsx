import React, { useState, useEffect } from "react";
import cls from "classnames";
import axios from "axios";
import URL from "shared/functions/getURL";
import { useWeb3React } from "@web3-react/core";
import { format } from "date-fns";
import Web3 from "web3";

import { useMediaQuery, useTheme } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";

import Box from "shared/ui-kit/Box";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
// import PrintChart from "shared/ui-kit/Chart/Chart";
// import { getRandomAvatar } from "shared/services/user/getUserAvatar";
import { Avatar } from "shared/ui-kit";
import { useTypedSelector } from "store/reducers/Reducer";
import { getUnixEpochTimeStamp } from "shared/helpers";
import { BlockchainNets } from "shared/constants/constants";
import { toDecimals } from "shared/functions/web3";
import useIPFS from "../../../../../../shared/utils-IPFS/useIPFS";
import getPhotoIPFS from "../../../../../../shared/functions/getPhotoIPFS";

import TransactionProgressModal from "../../../../modals/TransactionProgressModal";
import CreateSocialTokenModal from "../../../../modals/CreateSocialTokenModal";
import { AirdropTokensModal } from "../../../../modals/AirdropTokensModal/AirdropTokensModal";
import AllocateTokensModal from "../../../../modals/AllocateTokensModal";
import { socialTokenPageStyles } from "./index.styles";

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
          borderRadius: Number.MAX_VALUE,
          borderWidth: 1,
          lineTension: 0.2,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      chartArea: {
        backgroundColor: "#ffffff00",
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
            offset: true,
            display: true,
            gridLines: {
              color: "#ffffff00",
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
            offset: true,
            position: "right",
            gridLines: {
              color: "#ffffff00",
              drawBorder: false,
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

const configurer = (config: any, ref: CanvasRenderingContext2D): object => {
  for (let index = 0; index < config.data.datasets.length; index++) {
    let gradient = ref.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, config.data.datasets[index].backgroundColor);
    gradient.addColorStop(1, `${config.data.datasets[index].backgroundColor}33`);
    config.data.datasets[0].backgroundColor = gradient;
  }

  return config;
};

const AirdropTableHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerAlign: "left",
    headerName: "FROM",
  },
  {
    headerAlign: "center",
    headerName: "AMOUNT",
  },
  {
    headerAlign: "center",
    headerName: "PRICE",
  },
  {
    headerAlign: "center",
    headerName: "DATE",
  },
  {
    headerAlign: "center",
    headerName: "TIME",
  },
];

const TokenTableHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerAlign: "left",
    headerName: "HOLDER",
  },
  {
    headerAlign: "center",
    headerName: "ROLE",
  },
  {
    headerAlign: "center",
    headerName: "AMOUNT",
  },
  {
    headerAlign: "center",
    headerName: "ISSUED",
  },
  {
    headerAlign: "center",
    headerName: "VESTING PERIOD",
  },
];

const SocialTokenPage = ({ userId, userProfile }: { userId: string; userProfile: any }) => {
  const classes = socialTokenPageStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));

  const user = useTypedSelector(state => state.user);

  const [openCreateSocialTokenModal, setOpenCreateSocialTokenModal] = useState<boolean>(false);
  const [openAirdropTokenModal, setOpenAirdropTokenModal] = useState<boolean>(false);
  const [openAllocateTokenModal, setOpenAllocateTokenModal] = useState<boolean>(false);
  //   const [userRole, setUserRole] = useState(userProfile.role.toLowerCase());

  const [token, setToken] = useState<any>(null);
  // const [selectedTimeFilter, setSelectedTimeFilter] = useState<number>(0);
  const [selectedTableFilter, setSelectedTableFilter] = useState<number>(0);
  const [rewardConfig, setRewardConfig] = React.useState<any>();
  const [tableHeader, setTableHeader] = useState<Array<CustomTableHeaderInfo>>(AirdropTableHeaders);
  const [tableData, setTableData] = React.useState<Array<Array<CustomTableCellInfo>>>([]);
  const [allocationsList, setAllocationList] = React.useState<Array<any>>([]);
  const [airdropList, setAirdropList] = React.useState<Array<any>>([]);
  const [accuredRewardsList, setAccuredRewardsList] = React.useState<Array<any>>([]);

  const [last7DaysAmount, setLast7DaysAmount] = React.useState(0);

  // Transaction Modal
  const [txHash, setTxHash] = useState<string>("");
  const [txModalOpen, setTxModalOpen] = useState<boolean>(false);
  const [txSuccess, setTxSuccess] = useState<boolean | null>(null);

  // Stats
  const [totalAirdropped, setTotalAirdropped] = useState(0);
  const [totalAllocated, setTotalAllocated] = useState(0);

  // Time for streaming of "Issued" value
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTablePages, setTotalTablePages] = useState(1);
  const [tablePageNum, setTablePageNum] = React.useState<number>(1);

  // Token stats from the contract
  const [totalSupply, setTotalSupply] = useState<any>(0);
  const [availableReserves, setAvailableReserves] = useState<any>(0);

  const { library } = useWeb3React();

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  const [imageIPFS, setImageIPFS] = useState(null);

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getUnixEpochTimeStamp(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (token && token.infoImage && token.infoImage.newFileCID && ipfs ) {
      getImageIpfs(token.infoImage.newFileCID);
    }
  }, [token, ipfs]);

  const getImageIpfs = async cid => {
    let imageUrl: any = await getPhotoIPFS(cid, downloadWithNonDecryption);
    setImageIPFS(imageUrl);
  };

  const getChartDatas = React.useCallback(async () => {
    const newRewardConfig1 = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newRewardConfig1.configurer = configurer;

    let hours: any[] = [],
      values: any[] = [];
    try {
      const response = await axios.get(URL() + "/social/getAccuredRewards/" + userId);
      if (response.data.success) {
        response.data.data.forEach(v => {
          const date = new Date(parseInt(v.timestamp));
          hours.push(format(date, "H : mm"));
          values.push(v.data.accumulatedTaxes);
        });
      } else {
        console.log("getAllocations -> Unknown");
      }
    } catch (e) {
      console.log(e);
    }

    newRewardConfig1.config.data.labels = hours;
    newRewardConfig1.config.data.datasets[0].data = values;
    newRewardConfig1.config.data.datasets[0].backgroundColor = "#65CB63";
    newRewardConfig1.config.data.datasets[0].borderColor = "#65CB63";
    newRewardConfig1.config.data.datasets[0].pointBackgroundColor = "#65CB63";
    newRewardConfig1.config.data.datasets[0].hoverBackgroundColor = "#65CB63";

    setRewardConfig(newRewardConfig1);
  }, []);

  useEffect(() => {
    refreshPageData();
  }, []);

  const getTokenStats = async token => {
    if (!window || !(window as any).ethereum) {
      window.alert("Please install MetaMask first.");
      return;
    }

    const targetChain = BlockchainNets.find(net => net.value === "Polygon Chain");

    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);
    const decimals = 18;

    let contractRes: any = null;
    if (web3APIHandler && web3APIHandler.SocialERC20) {
      contractRes = await web3APIHandler.SocialERC20.getTokenStats(web3, {
        contractAddress: token.id,
      });
    }

    if (contractRes && contractRes.success) {
      setAvailableReserves(toDecimals(contractRes.data.availableReserves, decimals));
      setTotalSupply(toDecimals(contractRes.data.totalSupply, 18));
    }
  };

  const refreshPageData = async () => {
    // get owner social token
    const token = await axios
      .get(`${URL()}/social/getOwnSocialToken/${user.id}`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          return resp.data;
        } else {
          return null;
        }
      })
      .catch(err => null);

    if (!token) return;

    setToken(token);

    console.log("token", token);

    getChartDatas();

    getAccuredRewards();

    getTokenStats(token);

    let airdropList: any = [];
    let page = 1;

    while (true) {
      const res = await getAirdrops(page);
      if (res.length === 0) break;
      airdropList = airdropList.concat(res);
      page++;
    }

    setAirdropList(airdropList);
    const totalAirdropped = airdropList.reduce((sum, item) => sum + Number(item.amount), 0);
    setTotalAirdropped(totalAirdropped);

    let allocationsList: any = [];
    page = 1;
    while (true) {
      const res = await getAllocations(page);
      if (res.length === 0) break;
      allocationsList = allocationsList.concat(res);
      page++;
    }

    setAllocationList(allocationsList);
    const totalAllocated = allocationsList.reduce((sum, item) => sum + Number(item.totalAmount), 0);
    setTotalAllocated(totalAllocated);

    setLast7DaysAmount(getLast7DaysAmount(airdropList, allocationsList));
  };

  const getLast7DaysAmount = (airdropList, allocationsList): number => {
    let totalAmount = 0;

    for (let i = 0; i < airdropList.length; i++) {
      if (airdropList[i].date >= Date.now() / 1000 - 7 * 24 * 60 * 60)
        totalAmount += Number(airdropList[i].amount);
    }

    for (let i = 0; i < allocationsList.length; i++) {
      if (allocationsList[i].date >= Date.now() / 1000 - 7 * 24 * 60 * 60)
        totalAmount += Number(allocationsList[i].totalAmount);
    }

    return totalAmount;
  };

  const getAllocations = async (page = 1) => {
    try {
      const response = await axios.get(URL() + "/social/getAllocations/" + userId + "/" + page);
      if (response.data.success) {
        return response.data.data;
      } else {
        return [];
      }
    } catch (e) {
      console.log(e.message);
      return [];
    }
  };

  const getAirdrops = async (page = 1) => {
    try {
      const response = await axios.get(URL() + "/social/getAirdrops/" + userId + "/" + page);
      if (response.data.success) {
        return response.data.data;
      } else {
        return [];
      }
    } catch (e) {
      console.log(e.message);
      return [];
    }
  };

  const getAccuredRewards = async () => {
    try {
      const response = await axios.get(URL() + "/social/getAccuredRewards/" + userId);
      if (response.data.success) {
        setAccuredRewardsList(response.data.data);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const getIssuedValue = (allocation, currentTime) => {
    const iAmount = Number(allocation.immediateAmount);
    const tAmount = Number(allocation.totalAmount);
    return (
      iAmount +
      (tAmount - iAmount) *
        Math.min((currentTime - allocation.date) / (allocation.vestingPeriod - allocation.date), 1)
    ).toFixed(5);
  };

  useEffect(() => {
    if (selectedTableFilter === 0) {
      setTableHeader(AirdropTableHeaders);
      setTableData(
        airdropList?.slice(7 * (tablePageNum - 1), 7 * tablePageNum).map(item => [
          {
            cellAlign: "center",
            cell: (
              <Box display="flex" alignItems="center" justifyContent="left">
                <Avatar url={item.from.avatar} size={"small"} />
                <Box display="flex" flexDirection="column" ml={3}>
                  <Box fontSize={14} fontWeight={500} color="#431AB7">
                    {item.from.name}
                  </Box>
                </Box>
              </Box>
            ),
          },
          {
            cellAlign: "center",
            cell: (
              <Box fontSize={14} fontWeight={500} color="#707582">
                {item.amount}
              </Box>
            ),
          },
          {
            cellAlign: "center",
            cell: (
              <Box fontSize={14} fontWeight={500} color="#707582">
                $5.25
              </Box>
            ),
          },
          {
            cellAlign: "center",
            cell: (
              <Box fontSize={14} fontWeight={500} color="#707582">
                {format(new Date(item.date * 1000), "MMMM dd, yyyy")}
              </Box>
            ),
          },
          {
            cellAlign: "center",
            cell: (
              <Box fontSize={14} fontWeight={500} color="#707582">
                {format(new Date(item.date * 1000), "p")}
              </Box>
            ),
          },
        ])
      );
    } else {
      setTableHeader(TokenTableHeaders);
      setTableData(
        allocationsList?.slice(7 * (tablePageNum - 1), 7 * tablePageNum).map(item => [
          {
            cellAlign: "center",
            cell: (
              <Box display="flex" alignItems="center" justifyContent="left">
                <Avatar url={item.holder.avatar} size={"small"} />
                <Box display="flex" flexDirection="column" ml={3}>
                  <Box fontSize={14} fontWeight={500} color="#65CB63">
                    {item.holder.name}
                  </Box>
                </Box>
              </Box>
            ),
          },
          {
            cellAlign: "center",
            cell: (
              <Box fontSize={14} fontWeight={500} color="#707582">
                Member
              </Box>
            ),
          },
          {
            cellAlign: "center",
            cell: (
              <Box fontSize={14} fontWeight={500} color="#707582">
                {item.totalAmount}
              </Box>
            ),
          },
          {
            cellAlign: "center",
            cell: (
              <Box fontSize={14} fontWeight={500} color="#707582">
                {getIssuedValue(item, currentTime)}
              </Box>
            ),
          },
          {
            cellAlign: "center",
            cell: (
              <Box fontSize={14} fontWeight={500} color="#707582">
                {format(new Date(item.vestingPeriod * 1000), "MMMM dd, yyyy")}
              </Box>
            ),
          },
        ])
      );
    }
  }, [selectedTableFilter, airdropList, allocationsList, currentTime, tablePageNum]);

  useEffect(() => {
    selectedTableFilter === 0
      ? setTotalTablePages(Math.floor(airdropList.length / 7 + 1))
      : setTotalTablePages(Math.floor(allocationsList.length / 7 + 1));

    setTablePageNum(1);
  }, [selectedTableFilter, airdropList]);

  const handleAddTokenToMetamask = async () => {
    if (!token) return;

    try {
      await (window as any).ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: token.id,
            symbol: token.TokenSymbol,
            decimals: 18,
            image: imageIPFS,
          },
        },
      });
    } catch (error) {
      console.log("Adding token error", error);
    }
  };

  return (
    <div className={classes.mainContent}>
      <div className={classes.title}>Social Token Management</div>
      {!token ? (
        <div className={classes.NoTokenContent}>
          <img src={require("assets/pixImages/profile_social_token.png")} alt="social_token" />
          <div className={classes.typo1}>No Token Available</div>
          <div className={classes.typo2}>Create your first social token.</div>
          <div className={classes.createTokenBtn} onClick={() => setOpenCreateSocialTokenModal(true)}>
            Create Social Token
          </div>
        </div>
      ) : (
        <Box display="flex" flexDirection="column" width={1} mb={10}>
          <div className={classes.tokenActionsContent}>
            <Box display="flex" alignItems="center" flexDirection={isMobile ? "column" : "row"}>
              <img
                src={imageIPFS ? imageIPFS : require("assets/pixImages/social_token_mgr.png")}
                alt="social_token"
                style={{
                  paddingRight: "20px",
                  paddingBottom: isMobile ? "15px" : "0",
                  width: isMobile ? "100%" : "160px",
                }}
              />
              <Box>
                <Box display="flex" alignItems="center" justifyContent={isMobile ? "center" : "flex-start"}>
                  <Box>
                    <Box className={classes.h2} style={{ color: "#54658F" }}>
                      Pod Token Name
                    </Box>
                    <Box className={classes.h1} style={{ color: "#2D3047" }}>
                      {token.TokenName}
                    </Box>
                  </Box>
                  <div
                    style={{
                      width: "1px",
                      height: "40px",
                      background: "#ddd",
                      margin: isMobile ? "0 20px" : "0 50px",
                    }}
                  ></div>
                  <Box>
                    <Box className={classes.h2} style={{ color: "#54658F" }}>
                      Symbol
                    </Box>
                    <Box className={classes.h1} style={{ color: "#2D3047" }}>
                      {token.TokenSymbol}
                    </Box>
                  </Box>
                </Box>
                <Box className={classes.h3} style={{ color: "#54658F" }} pt={2}>
                  {token.Description}
                </Box>
              </Box>
            </Box>
            <div
              style={{
                width: "100%",
                height: "1px",
                background: "#ccc",
                marginTop: "10px",
                marginBottom: "25px",
              }}
            ></div>
            <div className={classes.tokenActionsBar}>
              <Box className={classes.typo3} style={{ flex: 2 }} pb={isMobile ? 2 : 0}>
                Token Actions
              </Box>
              <div className={classes.actionWrap}>
                <div
                  className={`${classes.actionBtn} ${classes.airdropTokenBtn}`}
                  onClick={() => setOpenAirdropTokenModal(true)}
                >
                  Airdrop Tokens
                </div>
                <div
                  className={`${classes.actionBtn} ${classes.allocateTokenBtn}`}
                  onClick={() => setOpenAllocateTokenModal(true)}
                >
                  Allocate Tokens
                </div>
                {!isMobile && <div style={{ width: "1px", height: "40px", background: "#E6E6E8" }}></div>}
                <div
                  className={`${classes.actionBtn} ${classes.metaMaskBtn}`}
                  onClick={handleAddTokenToMetamask}
                >
                  Add to Metamask
                </div>
              </div>
            </div>
          </div>
          <div className={classes.tokenStatsContent}>
            <div className={classes.typo3}>Token Stats</div>
            {!isMobile ? (
              <>
                <Box display="flex" alignItems="center" justifyContent="space-between" mt={"37px"}>
                  <div className={classes.statsItem}>
                    <Box display="flex" alignItems="center">
                      <div className={classes.typo5}>{totalSupply}</div>
                      <div className={classes.typo6}>{token.TokenSymbol}</div>
                    </Box>
                    <div className={classes.typo4}>Total Supply</div>
                  </div>
                  <div className={classes.border} />
                  <div className={classes.statsItem}>
                    <Box display="flex" alignItems="center">
                      <div className={classes.typo5}>{totalAirdropped}</div>
                      <div className={classes.typo6}>{token.TokenSymbol}</div>
                    </Box>
                    <div className={classes.typo4}>Airdropped</div>
                  </div>
                  <div className={classes.border} />
                  <div className={classes.statsItem}>
                    <Box display="flex" alignItems="center">
                      <div className={classes.typo5}>{totalAllocated}</div>
                      <div className={classes.typo6}>{token.TokenSymbol}</div>
                    </Box>
                    <div className={classes.typo4}>Allocated</div>
                  </div>
                  {!isTablet && (
                    <>
                      <div className={classes.border} />
                      <div className={classes.statsItem}>
                        <Box display="flex" alignItems="center">
                          <div className={classes.typo5}>{last7DaysAmount}</div>
                          <div className={classes.typo6}>{token.TokenSymbol}</div>
                        </Box>
                        <div className={classes.typo4}>Last 7 days</div>
                      </div>
                      <div className={classes.border} />
                      <div className={classes.statsItem}>
                        <Box display="flex" alignItems="center">
                          <div className={classes.typo5}>{token.TradingSpread}</div>
                          <div className={classes.typo6}>%</div>
                        </Box>
                        <div className={classes.typo4}>TAXation</div>
                      </div>
                    </>
                  )}
                </Box>
                {isTablet && (
                  <Box display="flex" alignItems="center" justifyContent="flex-start" mt={"37px"}>
                    <>
                      <div className={classes.statsItem}>
                        <Box display="flex" alignItems="center">
                          <div className={classes.typo5}>{last7DaysAmount}</div>
                          <div className={classes.typo6}>{token.TokenSymbol}</div>
                        </Box>
                        <div className={classes.typo4}>Last 7 days</div>
                      </div>
                      <Box className={classes.border} mx={7} />
                      <div className={classes.statsItem}>
                        <Box display="flex" alignItems="center">
                          <div className={classes.typo5}>{token.TradingSpread}</div>
                          <div className={classes.typo6}>%</div>
                        </Box>
                        <div className={classes.typo4}>TAXation</div>
                      </div>
                    </>
                  </Box>
                )}
              </>
            ) : (
              <>
                <Box display="flex" alignItems="center" justifyContent="space-between" mt={"37px"}>
                  <div className={classes.statsItem}>
                    <Box display="flex" alignItems="center">
                      <div className={classes.typo5}>{totalSupply}</div>
                      <div className={classes.typo6}>{token.TokenSymbol}</div>
                    </Box>
                    <div className={classes.typo4}>Total Supply</div>
                  </div>
                  <div className={classes.border} />
                  <div className={classes.statsItem}>
                    <Box display="flex" alignItems="center">
                      <div className={classes.typo5}>{totalAirdropped}</div>
                      <div className={classes.typo6}>{token.TokenSymbol}</div>
                    </Box>
                    <div className={classes.typo4}>Airdropped</div>
                  </div>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="space-between" mt={"37px"}>
                  <div className={classes.statsItem}>
                    <Box display="flex" alignItems="center">
                      <div className={classes.typo5}>{totalAllocated}</div>
                      <div className={classes.typo6}>{token.TokenSymbol}</div>
                    </Box>
                    <div className={classes.typo4}>Allocated</div>
                  </div>
                  <div className={classes.border} />
                  <div className={classes.statsItem}>
                    <Box display="flex" alignItems="center">
                      <div className={classes.typo5}>{last7DaysAmount}</div>
                      <div className={classes.typo6}>{token.TokenSymbol}</div>
                    </Box>
                    <div className={classes.typo4}>Last 7 days</div>
                  </div>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="space-between" mt={"37px"}>
                  <div className={classes.statsItem}>
                    <Box display="flex" alignItems="center">
                      <div className={classes.typo5}>{token.TradingSpread}</div>
                      <div className={classes.typo6}>%</div>
                    </Box>
                    <div className={classes.typo4}>TAXation</div>
                  </div>
                </Box>
              </>
            )}

            {/* <div className={classes.withdrawBtn}>Withdraw Revenue</div> */}
          </div>
          {/* <div className={classes.revenueGraphContent}>
            <Box
              display="flex"
              alignItems={isMobile ? "flex-start" : "center"}
              justifyContent="space-between"
              pb={4}
              borderBottom="1px solid #00000011"
              flexDirection={isMobile ? "column" : "row"}
            >
              <div className={classes.typo3}>Revenue over time</div>
              <div className={classes.timeFilters}>
                {["1D", "7D", "1M", "YTD"].map((filter, index) => (
                  <div
                    className={cls(
                      { [classes.selectedTimeFilter]: index === selectedTimeFilter },
                      classes.timeFilter
                    )}
                    onClick={() => setSelectedTimeFilter(index)}
                    key={`time-${filter}`}
                  >
                    {filter}
                  </div>
                ))}
              </div>
            </Box>
            <Box height="300px" width={1}>
              {rewardConfig && <PrintChart config={rewardConfig} />}
            </Box>
          </div> */}
          <div className={classes.tableContent}>
            <Box pl={"37px"} mb={"28px"}>
              <div className={classes.tableFilters}>
                {["Airdrop History", "Token Allocation"].map((filter, index) => (
                  <div
                    className={cls(
                      { [classes.selectedTableFilter]: index === selectedTableFilter },
                      classes.tableFilter
                    )}
                    onClick={() => setSelectedTableFilter(index)}
                    key={`time-${filter}`}
                  >
                    {filter}
                  </div>
                ))}
              </div>
            </Box>
            <CustomTable
              headers={tableHeader}
              rows={tableData}
              placeholderText="No data"
              theme="transaction"
            />
            <div className={classes.pagination}>
              <Pagination
                count={totalTablePages}
                page={tablePageNum}
                onChange={(_, page) => {
                  setTablePageNum(page);
                  //   selectedTableFilter === 0 ? getAirdrops() : getAllocations();
                }}
              />
            </div>
          </div>
        </Box>
      )}
      {openCreateSocialTokenModal && (
        <CreateSocialTokenModal
          open={openCreateSocialTokenModal}
          handleClose={() => setOpenCreateSocialTokenModal(false)}
          handleRefresh={refreshPageData}
          setTxModalOpen={setTxModalOpen}
          setTxHash={setTxHash}
          setTxSuccess={setTxSuccess}
        />
      )}
      {openAirdropTokenModal && (
        <AirdropTokensModal
          open={openAirdropTokenModal}
          handleClose={() => setOpenAirdropTokenModal(false)}
          handleRefresh={refreshPageData}
          community=""
          socialToken={token}
          setTxModalOpen={setTxModalOpen}
          setTxHash={setTxHash}
          setTxSuccess={setTxSuccess}
          availableReserves={availableReserves}
        />
      )}
      {openAllocateTokenModal && (
        <AllocateTokensModal
          open={openAllocateTokenModal}
          handleRefresh={refreshPageData}
          handleClose={() => setOpenAllocateTokenModal(false)}
          socialToken={token}
          setTxModalOpen={setTxModalOpen}
          setTxHash={setTxHash}
          setTxSuccess={setTxSuccess}
          availableReserves={availableReserves}
        />
      )}

      <TransactionProgressModal
        open={txModalOpen}
        onClose={() => {
          setTxSuccess(null);
          setTxModalOpen(false);
        }}
        hash={txHash}
        txSuccess={txSuccess}
      />
    </div>
  );
};

export default SocialTokenPage;
