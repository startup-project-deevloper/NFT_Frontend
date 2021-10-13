import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import { useTypedSelector } from "store/reducers/Reducer";
import { formatNumber } from "shared/functions/commonFunctions";
import { Modal } from "shared/ui-kit";
import { priviPodInvestPod } from "shared/services/API";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from "shared/ui-kit/Box";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { BlockchainNets } from "shared/constants/constants";
import { BlockchainTokenSelect } from "shared/ui-kit/Select/BlockchainTokenSelect";
import { switchNetwork } from "shared/functions/metamask";
import { toDecimals, toNDecimals } from "shared/functions/web3";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import TransactionProgressModal from "../TransactionProgressModal";

const useStyles = makeStyles(() => ({
  root: {
    width: "755px !important",
    padding: "40px 40px 50px !important",
    "& .MuiInput-root": {
      background: "rgba(218, 230, 229, 0.4)",
      fontFamily: "Montserrat",
      marginBottom: "0",
      borderRadius: "8px",
    },
    "& .MuiFormControl-root": {
      borderRadius: "8px",
      height: "46px",
      marginTop: 8,

      "& > div > div": {
        borderRadius: "8px",
        padding: "11.5px 18px",
      },
    },
  },
  title: {
    fontFamily: "Agrandir Grand",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "22px",
    lineHeight: "130%",
    color: "#2D3047",
    marginBottom: "18px",
  },
  swapBtnSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "26px",
    marginBottom: "26px",
  },
  swapButton: {
    width: "100%",
    fontSize: 16,
    margin: "16px 0px",
    height: 50,
    "& img": {
      width: 14,
      height: 14,
      marginLeft: 4,
    },
  },
  squareContainer: {
    padding: "20px 0",
    display: "flex",
    alignItems: "flex-start",
  },
  squareContainerLabel: {
    color: "#2D3047",
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "16px",
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  squareContainerInput: {
    marginTop: "8px",
    background: "#F0F5F5",
    borderRadius: "8px",
    padding: "11.5px 18px",
    height: "46px",
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    lineHeight: "104.5%",
    color: "#181818",

    "& img": {
      width: "25px",
      height: "25px",
      marginRight: "7px",
    },
  },
  imageInput: {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "104.5%",
    color: "#181818",
    background: "transparent !important",
  },
  balance: {
    fontWeight: 500,
    fontFamily: "Montserrat",

    marginTop: 8,
    fontSize: 14,
    color: "#2D3047",
  },
  error: {
    color: "red",
  },
  submit: {
    display: "flex",
    marginTop: 28,
    "& button": {
      fontFamily: "Montserrat",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "16px",
      lineHeight: "20px",
      textAlign: "center",
      letterSpacing: "-0.04em",
      textTransform: "uppercase",
      color: "#FFFFFF",
      width: "100%",
      padding: "20.5px 45px",
      height: 59,
      borderRadius: "48px",
    },
  },
  valueBox: {
    padding: "28px 0px",
    borderTop: "1px solid #55669133",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    "&:first-child": {
      borderTop: "none",
    },
  },
  buttonSwap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "50%",
    background: "#2D3047",
    boxSizing: "border-box",
    marginRight: "14px",
    height: "40px",
    minWidth: "40px",
    width: "40px",
    padding: "11px 15px",

    "& img": {
      height: "10px",
      "&:first-child": {
        transform: "rotate(90deg)",
      },
      "&:last-child": {
        transform: "rotate(-90deg)",
      },
    },
  },
  colorBox: {
    background: "rgba(238, 242, 246, 0.5)",
    borderRadius: "12px",
    margin: "15px 0px",
    padding: "0px 24px",
    paddingBottom: "-12px",
  },
  titleLabel: {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "104.5%",
    color: "#181818",
  },
  contentValue: {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "18px",
    lineHeight: "104.5%",
    textAlign: "right",
    color: "#181818",
  },
  contentSmall: {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "120%",
    textAlign: "right",
    color: "#ABB3C4",
    marginTop: 4,
  },
}));

const SquareInvestTop = ({ pod, fundingTokenBalance, fundingQuantity, setFundingQuantity, errors }) => {
  const classes = useStyles();
  const { convertTokenToUSD } = useTokenConversion();

  return (
    <Box className={classes.squareContainer}>
      <Box width={1} mr={1}>
        <Box className={classes.squareContainerLabel}>
          Stablecoin
          <InfoIcon />
        </Box>
        <Box className={classes.squareContainerInput}>
          <img
            src={pod.FundingToken ? require(`assets/tokenImages/${pod.FundingToken}.png`) : "none"}
            alt="ETH"
          />
          <InputWithLabelAndTooltip
            type="text"
            overriedClasses={classes.imageInput}
            inputValue={pod.FundingToken}
            disabled
          />
        </Box>
        <Box className={classes.balance}>
          <Box>{`Available: ${formatNumber(fundingTokenBalance, pod.FundingToken, 4)}`}</Box>
        </Box>
      </Box>
      <Box width={1} ml={1}>
        <Box className={classes.squareContainerLabel}>
          Amount <InfoIcon />
        </Box>
        <InputWithLabelAndTooltip
          overriedClasses=""
          type="text"
          inputValue={fundingQuantity}
          onInputValueChange={e => {
            setFundingQuantity(e.target.value);
          }}
        />
        <Box className={classes.balance} textAlign="end">
          <Box>{formatNumber(convertTokenToUSD(pod.FundingToken, fundingQuantity), "USD", 4)}</Box>
        </Box>
        {errors.fundingQuantity ? <Box className="error">{errors.fundingQuantity}</Box> : null}
      </Box>
    </Box>
  );
};

const SquareInvestBottom = ({ pod, fundingTokenBalance, podQuantity, setPodQuantity, errors }) => {
  const classes = useStyles();
  return (
    <Box className={classes.squareContainer}>
      <Box width={1} mr={1}>
        <Box className={classes.squareContainerLabel}>
          Token <InfoIcon />
        </Box>
        <Box className={classes.squareContainerInput}>
          <img src={require("assets/icons/ETHToken.svg")} alt="BALToken" />
          <InputWithLabelAndTooltip
            type="text"
            overriedClasses={classes.imageInput}
            inputValue={pod.TokenSymbol}
            disabled
          />
        </Box>
        <Box className={classes.balance}>
          {`Available ${formatNumber(fundingTokenBalance, pod.TokenSymbol, 4)}`}
        </Box>
      </Box>
      <Box width={1} ml={1}>
        <Box className={classes.squareContainerLabel}>
          Price <InfoIcon />
        </Box>
        <InputWithLabelAndTooltip
          overriedClasses=""
          type="number"
          inputValue={podQuantity}
          onInputValueChange={v => {
            setPodQuantity(v.target.value);
          }}
        />
        {errors.podQuantity ? <Box className={classes.error}>{errors.podQuantity}</Box> : null}
      </Box>
    </Box>
  );
};

export default function TradePodTokenModal({ open, mode, setMode, pod, handleClose, handleRefresh }) {
  const classes = useStyles();
  const { showAlertMessage } = useAlertMessage();
  const { convertTokenToUSD } = useTokenConversion();
  const user = useTypedSelector(state => state.user);
  const [fundingTokenBalance, setFundingTokenBalance] = useState<number>(0);
  const { account, library, chainId } = useWeb3React();

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [fundingQuantity, setFundingQuantity] = useState<string>("");
  const [podQuantity, setPodQuantity] = useState<string>("");

  const [fee, setFee] = useState<number>(0.001);

  const [blockChain, setBlockChain] = useState<any>(BlockchainNets[0].name);

  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTransactionModal, setOpenTransactionModal] = useState<boolean>(false);

  useEffect(() => {
    if (!pod.FundingToken || !open) return;

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
      const web3Config = targetChain.config;
      const web3 = new Web3(library.provider);

      const decimals = await web3APIHandler.Erc20[pod.FundingToken].decimals(web3);
      const balance = await web3APIHandler.Erc20[pod.FundingToken].balanceOf(web3, { account });
      setFundingTokenBalance(Number(toDecimals(balance, decimals)));
    })();
  }, [pod, open]);

  // get pod token to receive in investment each time investing amount changes
  useEffect(() => {
    if (mode && podQuantity) {
      // if (mode == "buy") {
      //   setDisableSubmit(true);
      //   musicDaoGetBuyingPodFundingTokenAmount(pod.PodAddress, Number(podQuantity))
      //     .then(resp => {
      //       if (resp.success) {
      //         setFundingQuantity(String(Number(podQuantity) * Number(resp.data)));
      //       }
      //       setDisableSubmit(false);
      //     })
      //     .catch(e => {
      //       showAlertMessage(e, { variant: "error" });
      //       setDisableSubmit(false);
      //     });
      // } else if (mode == "sell") {
      //   setDisableSubmit(true);
      //   musicDaoGetSellingPodFundingTokenAmount(pod.PodAddress, Number(podQuantity))
      //     .then(resp => {
      //       if (resp.success) {
      //         setFundingQuantity(String(Number(resp.data) * Number(podQuantity)));
      //       }
      //       setDisableSubmit(false);
      //     })
      //     .catch(e => {
      //       showAlertMessage(e, { variant: "error" });
      //       setDisableSubmit(false);
      //     });
      // }
      // // investing
      // else
      setFundingQuantity(String(Number(podQuantity) * pod.FundingPrice ?? 0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podQuantity, mode]);

  // const handleOpenSignatureModal = () => {
  //   const values = { podQuantity };
  //   const validatedErrors = validate(values);
  //   if (Object.keys(validatedErrors).length === 0) {
  //     let payload;
  //     if (mode == "invest")
  //       payload = {
  //         Investor: user.address,
  //         PodAddress: pod.PodAddress,
  //         Amount: Number(podQuantity),
  //       };
  //     else
  //       payload = {
  //         Trader: user.address,
  //         PodAddress: pod.PodAddress,
  //         Amount: Number(podQuantity),
  //       };
  //     if (payload) {
  //       payloadRef.current = payload;
  //       setSignRequestModalDetail(buildJsxFromObject(payload));
  //       setOpenSignRequestModal(true);
  //     }
  //   } else {
  //     setErrors(validatedErrors);
  //   }
  // };

  const closeAndRefresh = () => {
    setTimeout(() => {
      handleClose();
      handleRefresh();
    }, 1000);
  };

  const handleBuyOrSell = async () => {
    const values = { fundingQuantity };
    const validatedErrors = validate(values);
    let payload;

    if (Object.keys(validatedErrors).length === 0) {
      payload = {
        Trader: user.address,
        PodAddress: pod.PodAddress,
        Amount: Number(fundingQuantity),
      };
    } else {
      setErrors(validatedErrors);
      return;
    }
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
    const web3Config = targetChain.config;
    const web3 = new Web3(library.provider);

    if (Object.keys(payload).length) {
      // if (mode === "buy") {
      //   setDisableSubmit(true);
      //   const buyResponse = await musicDaoBuyPodTokens(payload, {});
      //   setDisableSubmit(false);
      //   if (buyResponse.success) {
      //     showAlertMessage(`buy success`, { variant: "success" });
      //     closeAndRefresh();
      //   } else {
      //     showAlertMessage(`buy failed`, { variant: "error" });
      //   }
      // } else if (mode == "sell") {
      //   setDisableSubmit(true);
      //   const buyResponse = await musicDaoSellPodTokens(payload, {});
      //   setDisableSubmit(false);
      //   if (buyResponse.success) {
      //     showAlertMessage(`sell success`, { variant: "success" });
      //     closeAndRefresh();
      //   } else {
      //     showAlertMessage(`sell failed`, { variant: "error" });
      //   }
      // } else {
      setDisableSubmit(true);
      let buyResponse;
      if (pod.blockchainNetwork === BlockchainNets[1].value) {
        let balance = await web3APIHandler.Erc20[pod.FundingToken].balanceOf(web3, { account });
        let decimals = await web3APIHandler.Erc20[pod.FundingToken].decimals(web3);
        balance = Number(toDecimals(balance, decimals));

        const amount = toNDecimals(+payload.Amount, decimals);

        if (!decimals || !balance) {
          showAlertMessage(`Can't get decimals`, { variant: "error" });
          setDisableSubmit(false);

          return;
        }

        if (balance < +payload.Amount) {
          showAlertMessage(`Insufficient balance to invest the pod`, { variant: "error" });
          setDisableSubmit(false);
          return;
        }

        const approved: any = await web3APIHandler.Erc20[pod.FundingToken].approve(
          web3,
          account!,
          web3Config.CONTRACT_ADDRESSES.POD_MANAGER,
          amount
        );

        if (!approved) {
          showAlertMessage(`Can't proceed to invest the pod`, { variant: "error" });
          setDisableSubmit(false);
          return;
        }

        const contractResponse: any = await web3APIHandler.PodManager.investPod(
          web3,
          account!,
          {
            podAddress: pod.PodAddress,
            amount,
          },
          setHash
        );

        if (!contractResponse) {
          showAlertMessage(`Can't proceed to invest the pod`, { variant: "error" });
          setDisableSubmit(false);
          setTransactionSuccess(false);
          return;
        }

        setTransactionSuccess(true);

        buyResponse = await priviPodInvestPod({
          podId: pod.Id,
          podAddress: pod.PodAddress,
          amount: payload.Amount,
          hash: contractResponse.hash,
          investor: account!,
          type: "PIX",
        });

        setDisableSubmit(false);
        if (buyResponse.success) {
          showAlertMessage(`invest success`, { variant: "success" });
          closeAndRefresh();
        } else {
          showAlertMessage(`invest failed`, { variant: "error" });
        }
      }
      //  else {
      //   buyResponse = await musicDaoInvestPod(payload);

      //   setDisableSubmit(false);
      //   if (buyResponse.success) {
      //     showAlertMessage(`invest success`, { variant: "success" });
      //     closeAndRefresh();
      //   } else {
      //     showAlertMessage(`invest failed`, { variant: "error" });
      //   }
      // }
      // }
    }
  };

  function validate(values: { [key: string]: string }): { [key: string]: string } {
    var errors: { [key: string]: string } = {};
    if (values.fundingQuantity === null || !Number(values.fundingQuantity)) {
      errors.fundingQuantity = "invalid fundingQuantity";
    } else if (Number(values.fundingQuantity) === 0) {
      errors.fundingQuantity = "fundingQuantity cant be 0";
    } else if (Number(values.fundingQuantity) < 0) {
      errors.fundingQuantity = "fundingQuantity cant be negative";
    } else if (Number(values.fundingQuantity) > fundingTokenBalance) {
      errors.fundingQuantity = "insufficient fund to invest";
    }
    return errors;
  }

  return (
    <>
      {openTransactionModal ? (
        <TransactionProgressModal
          open={openTransactionModal}
          onClose={() => {
            setHash("");
            setTransactionSuccess(null);
            setOpenTransactionModal(false);
          }}
          txSuccess={transactionSuccess}
          hash={hash}
        />
      ) : (
        <Modal size="medium" isOpen={open} onClose={handleClose} className={classes.root} showCloseIcon>
          {/* <SignatureRequestModal
     open={openSignRequestModal}
     address={user.address}
     transactionFee="0.0000"
     detail={signRequestModalDetail}
     handleOk={handleBuyOrSell}
     handleClose={() => setOpenSignRequestModal(false)}
   /> */}
          <Box className={classes.title}>{mode.charAt(0).toUpperCase() + mode.slice(1)} Media Pod Token</Box>
          {mode === "buy" || mode === "invest" ? (
            <SquareInvestTop
              pod={pod}
              fundingTokenBalance={fundingTokenBalance}
              fundingQuantity={fundingQuantity}
              setFundingQuantity={setFundingQuantity}
              errors={errors}
            />
          ) : (
            <SquareInvestBottom
              pod={pod}
              fundingTokenBalance={fundingTokenBalance}
              podQuantity={podQuantity}
              setPodQuantity={setPodQuantity}
              errors={errors}
            />
          )}
          {mode !== "invest" && (
            <>
              <Box className={classes.squareContainerLabel}>
                Select chain <InfoIcon />
              </Box>
              <BlockchainTokenSelect
                network={blockChain}
                setNetwork={setBlockChain}
                BlockchainNets={BlockchainNets}
                isReverse
              />
            </>
          )}
          {mode !== "invest" && (
            <Box className={classes.swapBtnSection}>
              <button onClick={() => setMode(mode === "buy" ? "sell" : "buy")} className={classes.buttonSwap}>
                <img src={require("assets/icons/arrow_white.png")} alt="_white" />
                <img src={require("assets/icons/arrow_white.png")} alt="arrow" />
              </button>
              <Box className={classes.balance} color={"#2D3047"} ml={1}>
                Swap to{" "}
                {mode === "buy" ? (
                  <b style={{ color: "#65CB63" }}>sell</b>
                ) : (
                  <b style={{ color: "#F43E5F" }}>buy</b>
                )}{" "}
                instead
              </Box>
            </Box>
          )}
          {mode !== "invest" &&
            (mode === "buy" ? (
              <SquareInvestBottom
                pod={pod}
                fundingTokenBalance={fundingTokenBalance}
                podQuantity={podQuantity}
                setPodQuantity={setPodQuantity}
                errors={errors}
              />
            ) : (
              <SquareInvestTop
                pod={pod}
                setFundingQuantity={setFundingQuantity}
                fundingTokenBalance={fundingTokenBalance}
                fundingQuantity={fundingQuantity}
                errors={errors}
              />
            ))}

          <Box className={classes.colorBox}>
            {mode === "invest" && (
              <Box className={classes.valueBox}>
                <Box className={classes.titleLabel} flex={1}>
                  Pod tokens you'll receive
                </Box>
                <Box textAlign="end" flex={1}>
                  <Box className={classes.contentValue}>
                    {Number(fundingQuantity) / +pod.FundingPrice} Pod Tokens
                  </Box>
                </Box>
              </Box>
            )}
            <Box className={classes.valueBox}>
              <Box className={classes.titleLabel} flex={1}>
                Estimated fee
              </Box>
              <Box textAlign="end" flex={1}>
                <Box className={classes.contentValue}>{`${pod.FundingToken} ${fee}`}</Box>
                <Box className={classes.contentSmall}>
                  ({formatNumber(convertTokenToUSD(pod.FundingToken, fee), "USD", 4)})
                </Box>
              </Box>
            </Box>
            <Box className={classes.valueBox}>
              <Box className={classes.titleLabel} flex={1}>
                Total Cost
              </Box>
              <Box textAlign="end" flex={1}>
                <Box className={classes.contentValue}>{`${pod.FundingToken} ${
                  fee + Number(fundingQuantity)
                }`}</Box>
                <Box className={classes.contentSmall}>
                  (
                  {formatNumber(convertTokenToUSD(pod.FundingToken, fee + Number(fundingQuantity)), "USD", 4)}
                  )
                </Box>
              </Box>
            </Box>
          </Box>

          <Box className={classes.submit}>
            <button
              onClick={handleBuyOrSell}
              disabled={disableSubmit}
              style={{
                background: mode === "buy" || mode === "invest" ? "#65CB63" : "#F43E5F",
              }}
            >
              {mode === "invest" ? "Invest" : mode == "buy" ? "Buy Token" : "Sell Position"}
            </button>
          </Box>
        </Modal>
      )}
    </>
  );
}

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="0.140625" y="0.730469" width="14" height="14" rx="7" fill="#DAE6E5" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.68151 4.78995C7.68151 5.20266 7.35479 5.53511 6.93635 5.53511C6.52365 5.53511 6.19119 5.20266 6.19119 4.78995C6.19119 4.37152 6.52365 4.03906 6.93635 4.03906C7.35479 4.03906 7.68151 4.37152 7.68151 4.78995ZM8.7362 10.3271C8.7362 10.5621 8.55278 10.7283 8.31776 10.7283H5.98484C5.74983 10.7283 5.56641 10.5621 5.56641 10.3271C5.56641 10.1035 5.74983 9.92582 5.98484 9.92582H6.69561V7.29484H6.08229C5.84727 7.29484 5.66385 7.12861 5.66385 6.8936C5.66385 6.67005 5.84727 6.49236 6.08229 6.49236H7.1599C7.45223 6.49236 7.607 6.69871 7.607 7.00824V9.92582H8.31776C8.55278 9.92582 8.7362 10.1035 8.7362 10.3271Z"
      fill="#54658F"
    />
  </svg>
);
