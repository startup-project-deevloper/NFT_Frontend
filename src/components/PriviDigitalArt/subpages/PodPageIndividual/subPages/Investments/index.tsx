import React, { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import Moment from "react-moment";

import { Grid, useMediaQuery, useTheme } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { Color, Gradient, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { formatNumber } from "shared/functions/commonFunctions";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { priviPodGetInvestmentsTransactions, priviPodClaimPodTokens } from "shared/services/API";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { useTypedSelector } from "store/reducers/Reducer";
import { toDecimals } from "shared/functions/web3";
import { useAuth } from "shared/contexts/AuthContext";
import TransactionProgressModal from "../../../../modals/TransactionProgressModal";
import { investmentStyles } from "./index.styles";
import TradePodTokenModal from "components/PriviDigitalArt/modals/TradePodTokenModal";

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

const Investments = ({ pod, podInfo, handleRefresh }) => {
  const classes = investmentStyles();
  const { convertTokenToUSD } = useTokenConversion();
  const userSelector = useTypedSelector(state => state.user);
  const { isSignedin } = useAuth();

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));
  const [investData, setInvestData] = useState<any[]>([]);

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
    () => pod && pod.ClaimedStatus && pod.ClaimedStatus[userSelector.id],
    [pod]
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    priviPodGetInvestmentsTransactions(pod.Id, "PIX").then(resp => {
      if (resp?.success) {
        let amount = 0;
        setInvestData(resp.data);
        resp.data.forEach(item => {
          if (item.From.toLowerCase() === userSelector.address.toLowerCase()) amount += +item.Amount;
        });
        setPaidAmount(amount);
      }
    });
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

        const decimals = await web3APIHandler.Erc20["COPYRIGHT"].decimals(web3, podInfo.copyrightToken);
        const balance = await web3APIHandler.Erc20["COPYRIGHT"].balanceOf(web3, podInfo.copyrightToken, {
          account,
        });
        const amount = Number(toDecimals(balance, decimals));

        await priviPodClaimPodTokens({
          podId: pod.Id,
          amount,
          user: userSelector.id,
          type: "PIX",
        });

        handleRefresh();
      } else {
        setTransactionSuccess(false);

        showAlertMessage("Failed to Claim Media Fractions", { variant: "error" });
        handleRefresh();
      }
    })();
  }, [pod]);

  const getTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    investData.forEach(item => {
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
          <Box color="#65CB63" className={classes.addressBox}>
            {isTablet
              ? `${item.From.substring(0, 6)}...${item.From.substring(
                  item.From.length - 4,
                  item.From.length
                )}`
              : item.From}
          </Box>
        ),
        cellAlign: "center",
      });
      row.push({
        cell: (
          <Box style={{ minWidth: theme.spacing(20) }}>
            <Moment format="ddd, DD MMM-h:mm A">{item.Date * 1000}</Moment>
          </Box>
        ),
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
              <a target="_blank" rel="noopener noreferrer" href={`${podNetwork.scan.url}/tx/${item.Id}`}>
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
    return tableData;
  };

  return (
    <>
      {podInfo && (
        <Box>
          <Box className={classes.flexBox} justifyContent="space-between" px={1} mb={"27px"}>
            <Box className={classes.title}>Investment</Box>
            {!fundingEnded && !isFundingTargetReached && isSignedin && (
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
                  textTransform: "uppercase",
                }}
                isRounded
              >
                Invest
              </PrimaryButton>
            )}
          </Box>
          {!fundingEnded ? <></> : <></>}
          {
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
                      <Box className={classes.header2}>
                        Supply <br /> already sold
                      </Box>
                      <Box className={classes.flexBox}>
                        <Box className={classes.header2} style={{ fontFamily: "Agrandir", fontSize: "18px" }}>
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
                <Box
                  className={classes.greenBox}
                  justifyContent={podInfo.raisedFunds <= 0 ? "space-around" : "space-between"}
                >
                  <Box flex={1} className={classes.flexBox} justifyContent="space-between">
                    <Box display="flex" flexDirection="column" alignItems="center" width={1}>
                      <Box className={classes.header2} style={{ textAlign: "center" }}>
                        Amount of Media Fractions purchased
                      </Box>
                      <Box className={classes.header3} mt={1}>
                        {formatNumber((paidAmount || 0) / podInfo.fundingTokenPrice, pod.TokenSymbol, 4)}
                      </Box>
                    </Box>
                    <Box className={classes.divider} />
                    <Box display="flex" flexDirection="column" alignItems="center" width={1}>
                      <Box className={classes.header2}>Amount paid</Box>
                      <Box className={classes.header3} mt={1}>
                        {formatNumber(paidAmount || 0, pod.FundingToken, 4)}
                      </Box>
                    </Box>
                  </Box>
                </Box>
                {fundingEnded && isFundingTargetReached && !isClaimed && paidAmount > 0 && (
                  <Box className={classes.flexBox} justifyContent="flex-end" mt={2}>
                    <SecondaryButton
                      size="medium"
                      onClick={onClaimPodTokens}
                      style={{ background: Color.MusicDAOGreen, color: "white", border: "none" }}
                      isRounded
                    >
                      CLAIM YOUR MEDIA FRACTIONS
                    </SecondaryButton>
                  </Box>
                )}
                {fundingEnded && !isFundingTargetReached && paidAmount !== 0 && (
                  <Box className={classes.flexBox} justifyContent="flex-end" mt={2}>
                    <SecondaryButton
                      size="medium"
                      onClick={onRedeemBack}
                      style={{ background: "#FF8E3C", color: "white", border: "none" }}
                      isRounded
                    >
                      RETURN BACK THE FUNDS
                    </SecondaryButton>
                  </Box>
                )}
                <Box className={classes.timeBox} mt={2}>
                  <Box className={classes.header2}>Time to finish funding</Box>
                  <Box className={classes.timeValueBox}>
                    <Box className={classes.timeGreenBox}>
                      {fundingEndTime.days} Day{fundingEndTime.days > 1 ? "s" : ""}
                    </Box>
                    <Box className={classes.timeGreenBox} ml={1} color="#65CB63">
                      {fundingEndTime.hours} h
                    </Box>
                    <Box className={classes.timeGreenBox} ml={1} color="#65CB63">
                      {fundingEndTime.minutes} min
                    </Box>
                    <Box className={classes.timeGreenBox} ml={1} color="#65CB63">
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
                  rows={getTableData()}
                  theme="transaction"
                />
              </Box>
            </Box>
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

export default Investments;
