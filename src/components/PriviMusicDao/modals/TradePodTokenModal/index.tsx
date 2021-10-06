import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Web3 from "web3";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";

import { useTypedSelector } from "store/reducers/Reducer";
import { formatNumber } from "shared/functions/commonFunctions";
import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { Modal } from "shared/ui-kit";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import {
  musicDaoBuyPodTokens,
  musicDaoSellPodTokens,
  musicDaoInvestPod,
  musicDaoGetBuyingPodFundingTokenAmount,
  musicDaoGetSellingPodFundingTokenAmount,
} from "shared/services/API";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from "shared/ui-kit/Box";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { BlockchainNets } from "shared/constants/constants";
import PolygonAPI from "shared/services/API/polygon";
import PolygonConfig from "shared/connectors/polygon/config";
import URL from "shared/functions/getURL";
import { BlockchainTokenSelect } from "shared/ui-kit/Select/BlockchainTokenSelect";

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

const SquareInvestTop = ({ pod, userBalances, fundingQuantity, errors }) => {
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
          <Box>
            {`Available: ${formatNumber(
              userBalances[pod.FundingToken] ? userBalances[pod.FundingToken].Balance : 0,
              pod.FundingToken,
              4
            )}`}
          </Box>
        </Box>
      </Box>
      <Box width={1} ml={1}>
        <Box className={classes.squareContainerLabel}>
          Amount <InfoIcon />
        </Box>
        <InputWithLabelAndTooltip overriedClasses="" type="text" inputValue={`${fundingQuantity}`} disabled />
        <Box className={classes.balance} textAlign="end">
          <Box>{formatNumber(convertTokenToUSD(pod.FundingToken, fundingQuantity), "USD", 4)}</Box>
        </Box>
        {errors.fundingQuantity ? <Box className="error">{errors.fundingQuantity}</Box> : null}
      </Box>
    </Box>
  );
};

const SquareInvestBottom = ({ pod, userBalances, podQuantity, setPodQuantity, errors }) => {
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
          {`Available ${formatNumber(
            userBalances[pod.TokenSymbol] ? userBalances[pod.TokenSymbol].Balance : 0,
            pod.TokenSymbol,
            4
          )}`}
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
  const userBalances = useTypedSelector(state => state.userBalances);
  const { account, library, chainId } = useWeb3React();

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [fundingQuantity, setFundingQuantity] = useState<number>(0);
  const [podQuantity, setPodQuantity] = useState<string>("");

  const [fee, setFee] = useState<number>(0);
  const [podTokens, setPodTokens] = useState<number>(0);

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const [blockChain, setBlockChain] = useState<any>(BlockchainNets[0].name);

  // get pod token to receive in investment each time investing amount changes
  useEffect(() => {
    if (mode && podQuantity) {
      if (mode == "buy") {
        setDisableSubmit(true);
        musicDaoGetBuyingPodFundingTokenAmount(pod.PodAddress, Number(podQuantity))
          .then(resp => {
            if (resp.success) {
              setFundingQuantity(Number(podQuantity) * Number(resp.data));
            }
            setDisableSubmit(false);
          })
          .catch(e => {
            showAlertMessage(e, { variant: "error" });
            setDisableSubmit(false);
          });
      } else if (mode == "sell") {
        setDisableSubmit(true);
        musicDaoGetSellingPodFundingTokenAmount(pod.PodAddress, Number(podQuantity))
          .then(resp => {
            if (resp.success) {
              setFundingQuantity(Number(resp.data) * Number(podQuantity));
            }
            setDisableSubmit(false);
          })
          .catch(e => {
            showAlertMessage(e, { variant: "error" });
            setDisableSubmit(false);
          });
      }
      // investing
      else setFundingQuantity(Number(podQuantity) * pod.FundingTokenPrice ?? 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podQuantity, mode]);

  const handleOpenSignatureModal = () => {
    const values = { podQuantity };
    const validatedErrors = validate(values);
    if (Object.keys(validatedErrors).length === 0) {
      let payload;
      if (mode == "invest")
        payload = {
          Investor: user.address,
          PodAddress: pod.PodAddress,
          Amount: Number(podQuantity),
        };
      else
        payload = {
          Trader: user.address,
          PodAddress: pod.PodAddress,
          Amount: Number(podQuantity),
        };
      if (payload) {
        payloadRef.current = payload;
        setSignRequestModalDetail(buildJsxFromObject(payload));
        setOpenSignRequestModal(true);
      }
    } else {
      setErrors(validatedErrors);
    }
  };

  const closeAndRefresh = () => {
    setTimeout(() => {
      handleClose();
      handleRefresh();
    }, 1000);
  };

  const handleBuyOrSell = async () => {
    const payload = payloadRef.current;
    if (Object.keys(payload).length) {
      if (mode === "buy") {
        setDisableSubmit(true);
        const buyResponse = await musicDaoBuyPodTokens(payload, {});
        setDisableSubmit(false);
        if (buyResponse.success) {
          showAlertMessage(`buy success`, { variant: "success" });
          closeAndRefresh();
        } else {
          showAlertMessage(`buy failed`, { variant: "error" });
        }
      } else if (mode == "sell") {
        setDisableSubmit(true);
        const buyResponse = await musicDaoSellPodTokens(payload, {});
        setDisableSubmit(false);
        if (buyResponse.success) {
          showAlertMessage(`sell success`, { variant: "success" });
          closeAndRefresh();
        } else {
          showAlertMessage(`sell failed`, { variant: "error" });
        }
      } else {
        setDisableSubmit(true);
        let buyResponse;
        if (pod.blockchainNetwork === BlockchainNets[1].name) {
          const web3 = new Web3(library.provider);
          const approveResponse: any = await PolygonAPI.Trax.approve(
            web3,
            account!,
            pod.FundingToken,
            PolygonConfig.CONTRACT_ADDRESSES.POD_MANAGER
          );

          if (approveResponse.success) {
            const contractResponse: any = await PolygonAPI.PodManager.investPod(web3, account!, {
              podAddress: payload.PodAddress,
              token: pod.FundingToken,
              amount: payload.Amount,
            });
            if (contractResponse && contractResponse.success == true) {
              buyResponse = await axios.post(`${URL()}/musicDao/pod/investPod_P`, {
                hash: contractResponse.data.hash,
                payload,
              });
            }
          }
        } else {
          buyResponse = await musicDaoInvestPod(payload, {});
        }
        setDisableSubmit(false);
        if (buyResponse.success || buyResponse.data.success) {
          showAlertMessage(`invest success`, { variant: "success" });
          closeAndRefresh();
        } else {
          showAlertMessage(`invest failed`, { variant: "error" });
        }
      }
    }
  };

  function validate(values: { [key: string]: string }): { [key: string]: string } {
    var errors: { [key: string]: string } = {};
    if (values.podQuantity === null || !Number(values.podQuantity)) {
      errors.podQuantity = "invalid podQuantity";
    } else if (Number(values.podQuantity) === 0) {
      errors.podQuantity = "podQuantity cant be 0";
    } else if (Number(values.podQuantity) < 0) {
      errors.podQuantity = "podQuantity cant be negative";
    } else if (
      userBalances[pod.FundingToken] &&
      Number(values.fundingQuantity) > userBalances[pod.FundingToken].Balance
    ) {
      errors.fundingQuantity = "insufficient fund to invest";
    }
    return errors;
  }

  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} className={classes.root} showCloseIcon>
      <SignatureRequestModal
        open={openSignRequestModal}
        address={user.address}
        transactionFee="0.0000"
        detail={signRequestModalDetail}
        handleOk={handleBuyOrSell}
        handleClose={() => setOpenSignRequestModal(false)}
      />
      <Box className={classes.title}>{mode.charAt(0).toUpperCase() + mode.slice(1)} Media Pod Token</Box>
      {mode === "buy" || mode === "invest" ? (
        <SquareInvestTop
          pod={pod}
          userBalances={userBalances}
          fundingQuantity={fundingQuantity}
          errors={errors}
        />
      ) : (
        <SquareInvestBottom
          pod={pod}
          userBalances={userBalances}
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
            userBalances={userBalances}
            podQuantity={podQuantity}
            setPodQuantity={setPodQuantity}
            errors={errors}
          />
        ) : (
          <SquareInvestTop
            pod={pod}
            userBalances={userBalances}
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
              <Box className={classes.contentValue}>{podTokens} Pod Tokens</Box>
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
              ({formatNumber(convertTokenToUSD(pod.FundingToken, fee + Number(fundingQuantity)), "USD", 4)})
            </Box>
          </Box>
        </Box>
      </Box>

      <Box className={classes.submit}>
        <button
          onClick={handleOpenSignatureModal}
          disabled={disableSubmit}
          style={{
            background: mode === "buy" || mode === "invest" ? "#65CB63" : "#F43E5F",
          }}
        >
          {mode === "invest" ? "Invest" : mode == "buy" ? "Buy Token" : "Sell Position"}
        </button>
      </Box>
    </Modal>
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
