import React, { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import Moment from "react-moment";

import { FormControl, Grid } from "@material-ui/core";
import TransactionProgressModal from "components/PriviDigitalArt/modals/TransactionProgressModal";
// import PrintChart from "shared/ui-kit/Chart/Chart";
// import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import Box from "shared/ui-kit/Box";
import { Color, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import TradePodTokenModal from "components/PriviDigitalArt/modals/TradePodTokenModal";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { formatNumber } from "shared/functions/commonFunctions";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { priviPodGetInvestmentsTransactions, priviPodClaimPodTokens } from "shared/services/API";
import { BlockchainNets } from "shared/constants/constants";
import { investmentStyles } from "./index.styles";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { useTypedSelector } from "store/reducers/Reducer";
import { toDecimals } from "shared/functions/web3";

// const FreeHoursChartConfig = {
//   config: {
//     data: {
//       labels: [] as any[],
//       datasets: [
//         {
//           type: "bar",
//           label: "",
//           data: [] as any[],
//           pointRadius: 0,
//           backgroundColor: "#F9E373",
//           borderColor: "#F9E373",
//           pointBackgroundColor: "#F9E373",
//           hoverBackgroundColor: "#F9E373",
//           borderJoinStyle: "round",
//           borderCapStyle: "round",
//           borderWidth: 3,
//           cubicInterpolationMode: "monotone",
//           lineTension: 0.1,
//         },
//       ],
//     },

//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       chartArea: {
//         backgroundColor: "#F7F9FECC",
//       },
//       elements: {
//         point: {
//           radius: 0,
//           hitRadius: 5,
//           hoverRadius: 5,
//         },
//       },

//       legend: {
//         display: false,
//       },

//       layout: {
//         padding: {
//           left: 0,
//           right: 0,
//           top: 50,
//           bottom: 0,
//         },
//       },

//       scales: {
//         xAxes: [
//           {
//             offset: true,
//             display: true,
//             gridLines: {
//               color: "#ffffff",
//               lineWidth: 50,
//             },
//             ticks: {
//               beginAtZero: true,
//               fontColor: "#6B6B6B",
//               fontFamily: "Agrandir",
//             },
//           },
//         ],
//         yAxes: [
//           {
//             display: true,
//             gridLines: {
//               color: "#EFF2F8",
//             },
//             ticks: {
//               display: true,
//               beginAtZero: true,
//             },
//           },
//         ],
//       },

//       tooltips: {
//         mode: "label",
//         intersect: false,
//         callbacks: {
//           //This removes the tooltip title
//           title: function () {},
//           label: function (tooltipItem, data) {
//             return `$${tooltipItem.yLabel.toFixed(4)}`;
//           },
//         },
//         //this removes legend color
//         displayColors: false,
//         yPadding: 10,
//         xPadding: 10,
//         position: "nearest",
//         caretSize: 10,
//         backgroundColor: "rgba(255,255,255,0.9)",
//         bodyFontSize: 15,
//         bodyFontColor: "#303030",
//       },

//       plugins: {
//         datalabels: {
//           display: function (context) {
//             return context.dataset.data[context.dataIndex] !== 0;
//           },
//         },
//       },
//     },
//   },
// };

// const RadialConfig = {
//   config: {
//     type: "doughnut",
//     data: {
//       datasets: [
//         {
//           data: [] as any,
//           backgroundColor: [] as any,
//           hoverOffset: 0,
//           labels: [] as any,
//         },
//       ],
//     },
//     options: {
//       cutoutPercentage: 80,
//       animation: false,
//       rotation: Math.PI / 2,
//       tooltips: { enabled: false },
//     },
//   },
// };

// const configurer = (config: any, ref: CanvasRenderingContext2D): object => {
//   for (let index = 0; index < config.data.datasets.length; index++) {
//     let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight);
//     gradient.addColorStop(1, `${config.data.datasets[index].backgroundColor}33`);
//     gradient.addColorStop(0.5, `${config.data.datasets[index].backgroundColor}b0`);
//     config.data.datasets[index].backgroundColor = gradient;
//   }

//   return config;
// };

// const TRANSACTIONTABLEHEADER: Array<CustomTableHeaderInfo> = [
//   {
//     headerName: "TYPE",
//     headerAlign: "center",
//   },
//   {
//     headerName: "TOKEN",
//     headerAlign: "center",
//   },
//   {
//     headerName: "QUANTITY",
//     headerAlign: "center",
//   },
//   {
//     headerName: "PRICE",
//     headerAlign: "center",
//   },
//   {
//     headerName: "SENDER",
//     headerAlign: "center",
//   },
//   {
//     headerName: "RECEIVER",
//     headerAlign: "center",
//   },
//   {
//     headerName: "DATE",
//     headerAlign: "center",
//   },
//   {
//     headerName: "STATUS",
//     headerAlign: "center",
//   },
// ];

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

// const TimRangeList: any[] = ["6 Months"];

const Investments = ({ pod, podInfo, handleRefresh }) => {
  const classes = investmentStyles();
  const { convertTokenToUSD } = useTokenConversion();
  const userSelector = useTypedSelector(state => state.user);

  // const [selectedTimeRange, setSelectedTimeRange] = useState<any>(TimRangeList[0]);
  // const [priceChartConfig, setPriceChartConfig] = useState<any>();
  // const [ownershipConfig, setOwnershipConfig] = useState<any>();
  // const [transactionTableData, setTransactionTableData] = useState<any[]>([]);
  const [investmentTableData, setInvestmentTableData] = useState<any[]>([]);
  // const [lastPrice, setLastPrice] = useState<number>(0);
  // const [prevPrice, setPrevPrice] = useState<number>(0);
  // const [priceChange, setPriceChange] = useState<number>(0);

  const [mode, setMode] = useState<string>("invest");
  const [openBuySellModal, setOpenBuySellModal] = useState<boolean>(false);

  const [fundingEnded, setFundingEnded] = useState<boolean>(false);
  const [fundingEndTime, setFundingEndTime] = useState<any>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const { showAlertMessage } = useAlertMessage();

  const { account, library, chainId } = useWeb3React();

  const [podTokenBalance, setPodTokenBalance] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);

  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);

  const podNetwork = BlockchainNets.find(net => net.value === pod.blockchainNetwork) || BlockchainNets[0];

  const isFundingTargetReached = React.useMemo(
    () => podInfo && podInfo.raisedFunds >= podInfo.fundingTarget,
    [podInfo]
  );

  const isClaimed = React.useMemo(
    () => pod && pod.ClaimedStatus && pod.ClaimedStatus[userSelector.id] === true,
    [pod]
  );

  useEffect(() => {
    loadData();

    (async () => {
      const targetChain = BlockchainNets.find(net => net.value === pod.blockchainNetwork);
      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0);
        if (!isHere) {
          showAlertMessage("Got failed while switching over to target netowrk", { variant: "error" });
          return;
        }
      }
      const web3APIHandler = targetChain.apiHandler;
      const web3 = new Web3(library.provider);
      const decimals = await web3APIHandler.Erc20["POD"].decimals(web3, podInfo.podAddress);
      const balance = await web3APIHandler.Erc20["POD"].balanceOf(web3, podInfo.podAddress, { account });
      console.log(balance);
      setPodTokenBalance(Number(toDecimals(balance, decimals)));
    })();
  }, []);

  const loadData = () => {
    if (!pod.IsTrading) {
      let amount = 0;
      // load table
      priviPodGetInvestmentsTransactions({ podId: pod.Id, type: "PIX" }).then(resp => {
        if (resp?.success) {
          const tableData: Array<Array<CustomTableCellInfo>> = [];
          const data = resp.data;
          data.forEach(item => {
            const row: Array<CustomTableCellInfo> = [];
            row.push({
              cell: <Box>{+item.Amount / +podInfo.fundingTokenPrice ?? 0}</Box>,
              cellAlign: "center",
            });
            row.push({
              cell: <Box>{formatNumber(convertTokenToUSD(item.FundingToken, item.Amount), "USD", 2)}</Box>,
              cellAlign: "center",
            });
            row.push({
              cell: (
                <Box color={Color.Purple}>
                  {item.From.substring(0, 6) +
                    "..." +
                    item.From.substring(item.From.length - 4, item.From.length)}
                </Box>
              ),
              cellAlign: "center",
            });
            row.push({
              cell: <Moment format="ddd, DD MMM-h:mm A">{item.Date * 1000}</Moment>,
              cellAlign: "center",
            });
            row.push({
              cell: (
                <Box className={classes.flexBox}>
                  <Box className={classes.circle} style={{ background: Color.Purple }}></Box>
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
                      <ScanIcon />
                    </a>
                  )}
                </Box>
              ),
              cellAlign: "center",
            });
            tableData.push(row);

            if (item.From === userSelector.address) amount += +item.Amount;
          });
          setInvestmentTableData(tableData);
          setPaidAmount(amount);
        }
      });
    } else {
    }
  };

  // funding time inverval
  useEffect(() => {
    if (pod.FundingDate) {
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

  const onRedeemBack = useCallback(() => {
    (async () => {
      setOpenTransactionModal(true);
      const targetChain = BlockchainNets.find(net => net.value === pod.blockchainNetwork);
      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0);
        if (!isHere) {
          showAlertMessage("Got failed while switching over to target netowrk", { variant: "error" });
          return;
        }
      }

      const web3APIHandler = targetChain.apiHandler;
      const web3 = new Web3(library.provider);

      const response = await web3APIHandler.PodWithdrawManager.returnPodTokens(
        web3,
        account!,
        {
          podAddress: pod.PodAddress,
        },
        setHash
      );

      if (response.success) {
        handleRefresh();
        setTransactionSuccess(true);
      } else {
        showAlertMessage("Failed to Redeem Tokens", { variant: "error" });
        setTransactionSuccess(false);
        handleRefresh();
      }
    })();
  }, [pod]);

  const onClaimPodTokens = useCallback(() => {
    (async () => {
      setOpenTransactionModal(true);

      const targetChain = BlockchainNets.find(net => net.value === pod.blockchainNetwork);
      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0);
        if (!isHere) {
          showAlertMessage("Got failed while switching over to target netowrk", { variant: "error" });
          return;
        }
      }

      const web3APIHandler = targetChain.apiHandler;
      const web3 = new Web3(library.provider);

      const response = await web3APIHandler.PodManager.claimPodTokens(
        web3,
        account!,
        {
          podAddress: pod.PodAddress,
        },
        setHash
      );

      if (response.success) {
        setTransactionSuccess(true);

        await priviPodClaimPodTokens({
          podId: pod.Id,
          user: userSelector.id,
          type: "PIX",
        });

        handleRefresh();
      } else {
        setTransactionSuccess(false);

        showAlertMessage("Failed to Claim Pod Tokens", { variant: "error" });
        handleRefresh();
      }
    })();
  }, [pod]);

  return (
    <>
      {podInfo && (
        <Box>
          <Box className={classes.flexBox} justifyContent="space-between" px={1} mb={"27px"}>
            <Box className={classes.title}>Investment</Box>
            {!fundingEnded && !isFundingTargetReached && (
              <PrimaryButton
                size="small"
                onClick={() => {
                  setMode("invest");
                  setOpenBuySellModal(true);
                }}
                style={{
                  background: Color.GreenLight,
                  padding: "11px 48px",
                  fontFamily: "Montserrat",
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "18px",
                  border: "none",
                  height: "auto",
                  color: Color.Purple,
                  textTransform: "uppercase",
                }}
                isRounded
              >
                Invest
              </PrimaryButton>
            )}
            {/* {fundingEnded && isFundingTargetReached && (
              <Box className={classes.flexBox} justifyContent="flex-end" px={2}>
                <SecondaryButton
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
                    textTransform: "uppercase",
                  }}
                  isRounded
                >
                  Sell
                </SecondaryButton>
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
                    textTransform: "uppercase",
                  }}
                  isRounded
                >
                  Buy
                </PrimaryButton>
              </Box>
            )} */}
          </Box>
          {!fundingEnded ? <></> : <></>}
          {
            // !(isFundingTargetReached && fundingEnded) ? (
            <Box>
              <Box className={classes.whiteBox} mx={1}>
                <Grid container>
                  <Grid item xs={6} sm={3} md={3} className={classes.whiteBoxPriceItem}>
                    <Box className={classes.header2}>Token price</Box>
                    <Box className={classes.header3} mt={1}>
                      {formatNumber(
                        convertTokenToUSD(pod.FundingToken ?? "PRIVI", podInfo.fundingTokenPrice ?? 0),
                        "USD",
                        4
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3} md={3} className={classes.whiteBoxFundsItem}>
                    <Box className={classes.header2}>Funds raised </Box>
                    <Box className={classes.header3} mt={1}>
                      {formatNumber(
                        convertTokenToUSD(pod.FundingToken ?? "PRIVI", podInfo.raisedFunds ?? 0),
                        "USD",
                        4
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} className={classes.whiteBoxPaddingItem}>
                    <Box className={classes.barContainer} mb={"12px"}>
                      <Box style={{ width: `${(podInfo.raisedFunds / podInfo.fundingTarget) * 100}%` }} />
                    </Box>
                    <Box className={classes.flexBox} justifyContent="space-between">
                      <Box className={classes.header2}>Supply already sold</Box>
                      <Box className={classes.flexBox}>
                        <Box className={classes.header3} style={{ color: Color.Purple }}>
                          {podInfo.raisedFunds ? podInfo.raisedFunds / podInfo.fundingTokenPrice : 0}/
                        </Box>
                        <Box className={classes.header3}>
                          {podInfo.fundingTarget / podInfo.fundingTokenPrice ?? 0}{" "}
                          {pod.TokenSymbol || "Tokens"}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                <Box className={classes.greenBox} justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Box display="flex" flexDirection="column">
                      <Box className={classes.header2} style={{ color: Color.White }}>
                        Amount of Pod purchased
                      </Box>
                      <Box className={classes.header3} mt={1} style={{ color: Color.White }}>
                        {formatNumber(+podTokenBalance || 0, pod.TokenSymbol, 4)}
                      </Box>
                    </Box>
                    <Box display="flex" flexDirection="column" className={classes.amountPaid}>
                      <Box className={classes.header2} style={{ color: Color.White }}>
                        Amount paid
                      </Box>
                      <Box className={classes.header3} mt={1} style={{ color: Color.White }}>
                        {formatNumber(paidAmount, pod.FundingToken, 4)}
                      </Box>
                    </Box>
                  </Box>
                  {isFundingTargetReached && !isClaimed && (
                    <SecondaryButton
                      size="medium"
                      onClick={onClaimPodTokens}
                      className={classes.greenboxButton}
                      disabled={!fundingEnded}
                    >
                      CLAIM YOUR POD TOKENS
                    </SecondaryButton>
                  )}
                  {fundingEnded && !isFundingTargetReached && (
                    <SecondaryButton
                      size="medium"
                      onClick={onRedeemBack}
                      className={classes.greenboxButton}
                    >
                      REDEEM BACK THE FUNDS
                    </SecondaryButton>
                  )}
                </Box>
                <Box className={classes.flexBox} justifyContent="space-between" mt={2}>
                  <Box className={classes.header2}>Time to finish funding</Box>
                  <Box className={classes.flexBox}>
                    <Box className={classes.timeBox}>
                      {fundingEndTime.days} d{fundingEndTime.days > 1 ? "s" : ""}
                    </Box>
                    <Box className={classes.timeBox} ml={1}>
                      {fundingEndTime.hours} h
                    </Box>
                    <Box className={classes.timeBox} ml={1}>
                      {fundingEndTime.minutes} m
                    </Box>
                    <Box className={classes.timeBox} ml={1}>
                      {fundingEndTime.seconds} s
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box mt={2} px={1}>
                <CustomTable
                  headers={[
                    ...INVESTTABLEHEADER,
                    { headerName: podNetwork.scan.name, headerAlign: "center" },
                  ]}
                  rows={investmentTableData}
                  theme="bid"
                />
              </Box>
            </Box>
            // ) : (
            //   <Box>
            //     <Grid container>
            //       <Grid item xs={12} sm={4}>
            //         <Box className={classes.shadowBox}>
            //           <Box className={classes.header1}>Market Cap</Box>
            //           <Box className={classes.title} mt={1}>
            //             {formatNumber(
            //               convertTokenToUSD(pod.FundingToken, pod.Price * pod.SupplyReleased),
            //               "USD",
            //               4
            //             )}
            //           </Box>
            //         </Box>
            //         <Box className={classes.graphBox}>
            //           <Box className={classes.graphHeader}>
            //             <Box className={classes.header1}>Shares Distribution</Box>
            //           </Box>
            //           <Grid container style={{ marginTop: "16px" }}>
            //             <Grid item xs={12} sm={6}>
            //               {ownershipConfig && <PrintChart config={ownershipConfig} canvasHeight={250} />}
            //             </Grid>
            //             <Grid item xs={12} sm={6}>
            //               <Box style={{ marginLeft: "12px" }}>
            //                 {ownershipConfig &&
            //                   ownershipConfig.config.data.datasets[0].labels.map((item, index) => (
            //                     <Box className={classes.flexBox} mb={2} key={"labels-" + index}>
            //                       <Box
            //                         className={classes.colorBox}
            //                         style={{
            //                           background:
            //                             ownershipConfig.config.data.datasets[0].backgroundColor[index],
            //                         }}
            //                       />
            //                       <Box ml={2}>
            //                         <Box className={classes.header2}>{item}</Box>
            //                         <Box className={classes.header1}>
            //                           ${ownershipConfig.config.data.datasets[0].data[index]}
            //                         </Box>
            //                       </Box>
            //                     </Box>
            //                   ))}
            //               </Box>
            //             </Grid>
            //           </Grid>
            //         </Box>
            //       </Grid>
            //       <Grid item xs={12} sm={8}>
            //         <Box className={classes.graphBox} height="400px">
            //           <Box className={classes.graphHeader}>
            //             <Box className={classes.header1}>Price History</Box>
            //             <FormControl variant="outlined">
            //               <StyledSelect className={classes.select} value={selectedTimeRange} onChange={v => {}}>
            //                 {TimRangeList.map((item, index) => (
            //                   <StyledMenuItem key={index} value={item}>
            //                     {item}
            //                   </StyledMenuItem>
            //                 ))}
            //               </StyledSelect>
            //             </FormControl>
            //           </Box>
            //           <Box style={{ height: "100%" }}>
            //             {priceChartConfig && <PrintChart config={priceChartConfig} />}
            //           </Box>
            //           <Box className={classes.valueBox}>
            //             <Box className={classes.header1}>{formatNumber(lastPrice, "USD", 2)}</Box>
            //             <Box className={classes.header2} color={lastPrice >= prevPrice ? "#0FCEA6" : "#F43E5F"}>
            //               {lastPrice > prevPrice ? "+" : ""}
            //               {lastPrice - prevPrice} ({priceChange > 0 ? "+" : ""}
            //               {priceChange * 100}%)
            //             </Box>
            //           </Box>
            //         </Box>
            //       </Grid>
            //     </Grid>
            //     <Box mt={2} px={1}>
            //       <CustomTable
            //         headers={[
            //           ...TRANSACTIONTABLEHEADER,
            //           { headerName: podNetwork.scan.name, headerAlign: "center" },
            //         ]}
            //         rows={transactionTableData}
            //         theme="transaction"
            //       />
            //     </Box>
            //   </Box>
            // )
          }
          <TransactionProgressModal
            open={openTranactionModal}
            onClose={() => {
              setHash("");
              setTransactionSuccess(null);
              setOpenTransactionModal(false);
            }}
            txSuccess={transactionSuccess}
            hash={hash}
          />
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
        </Box>
      )}
    </>
  );
};

const ScanIcon = () => (
  <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17.8071 1.00001L7.42289 11M17.8071 1.00001L17.8072 7.00001M17.8071 1.00001L11.5767 1M7.42293 1.00001H1.19238V17H17.8072V11"
      stroke="#431AB7"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default Investments;
