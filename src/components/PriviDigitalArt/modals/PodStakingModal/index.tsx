import React, { useState, useEffect } from "react";
import { makeStyles, responsiveFontSizes } from "@material-ui/core";
import { Color, Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { PrimaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { BlockchainNets } from "shared/constants/constants";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import { toDecimals } from "shared/functions/web3";
import { priviPodStakeTokens } from "shared/services/API";
import TransactionProgressModal from "../TransactionProgressModal";

const useStyles = makeStyles(() => ({
  root: {
    width: "755px !important",
    padding: "40px 40px 50px !important",
    fontFamily: "Montserrat",

    "& label": {
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "16px",
      lineHeight: "104.5%",
      color: "#2D3047",
      opacity: 0.9,
      marginBottom: "16px",
      display: "flex",
    },
  },
  title: {
    fontFamily: "Agrandir Grand",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "22px",
    lineHeight: "130%",
    textAlign: "center",
    color: Color.Black,
  },
  desc: {
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "16px",
    lineHeight: "150%",
    textAlign: "center",
    color: Color.GrayDark,
    padding: "0 48px",
  },
  label: {
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "16px",
    lineHeight: "104.5%",
    color: "#2D3047",
    opacity: 0.9,
    marginBottom: "16px",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "18px",
    lineHeight: "120%",
    color: "#181818",
    padding: "9px 20px",
    border: "1px solid #A4A4A4",
    borderRadius: "8px",
    height: 50,
    "& input": {
      padding: 0,
    },
  },
  selectorContainter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "18px",
    lineHeight: "120%",
    color: "#181818",
    padding: "9px 20px",
    border: "1px solid #A4A4A4",
    borderRadius: "8px",
    height: 50,
  },
  greenBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: Color.Violet,
    borderRadius: "12px",
    padding: "32px 48px",
    textAlign: "center",
    textTransform: "uppercase",
  },
  greenText: {
    fontFamily: "Agrandir Grand",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "28px",
    lineHeight: "104.5%",
    textTransform: "uppercase",
    color: Color.GreenLight,
  },
  amount: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "22px",
    lineHeight: "104.5%",
    color: Color.White,
  },
  inputContainerWhite: {
    fontFamily: "Agrandir Grand",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "28px",
    lineHeight: "120%",
    color: Color.Purple,
    padding: "9px 20px",
    border: "1px solid #A4A4A4",
    textAlign: "end",
    borderRadius: "8px",
    height: 50,
  },
  fees: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontSize: "14px",
    lineHeight: "120%",
    color: Color.GrayDark,
  },
  divider: {
    width: 1,
    height: 50,
    background: "#DAE6E5",
  },
}));

const TOKENLIST = [
  {
    value: "pod",
    name: "Pod Token",
  },
  {
    value: "copyright",
    name: "Copyright Fractions",
  },
];

export default function PodStakingModal({ open, onClose, handleRefresh, podInfo, pod }) {
  const classes = useStyles();

  const { showAlertMessage } = useAlertMessage();

  const [amount, setAmount] = useState<number>(0);
  const [fees, setFees] = useState<number>(0);
  const [selectedToken, setSelectedToken] = useState<string>(TOKENLIST[0].value);

  const [availablePT, setAvailablePT] = useState<number>(0);
  const [availableFractions, setAvailableFractions] = useState<number>(0);

  const { account, library, chainId } = useWeb3React();
  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);

  useEffect(() => {
    if (!open) return;

    (async () => {
      const targetChain = BlockchainNets.find(net => net.value === "Polygon Chain");
      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0);
        if (!isHere) {
          showAlertMessage("Got failed while switching over to target netowrk", { variant: "error" });
          return;
        }
      }
      const web3APIHandler = targetChain.apiHandler;
      const web3 = new Web3(library.provider);
      const podDecimals = await web3APIHandler.Erc20["POD"].decimals(web3, podInfo.podAddress);
      const podBalance = await web3APIHandler.Erc20["POD"].balanceOf(web3, podInfo.podAddress, {
        account,
      });
      const copyrightDecimals = await web3APIHandler.Erc20["COPYRIGHT"].decimals(
        web3,
        podInfo.copyrightToken
      );
      const copyrightBalance = await web3APIHandler.Erc20["COPYRIGHT"].balanceOf(
        web3,
        podInfo.copyrightToken,
        {
          account,
        }
      );
      setAvailablePT(+toDecimals(podBalance, podDecimals));
      setAvailableFractions(+toDecimals(copyrightBalance, copyrightDecimals));
    })();
  }, [open]);

  const handleSubmit = async () => {
    setOpenTransactionModal(true);

    const targetChain = BlockchainNets.find(net => net.value === "Polygon Chain");
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Got failed while switching over to target netowrk", { variant: "error" });
        return;
      }
    }

    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);

    let response;
    if (selectedToken === TOKENLIST[0].value) {
      response = await web3APIHandler.DistributionManager.stakePodTokens(
        web3,
        account!,
        {
          contractAddress: podInfo.distributionManagerAddress,
          amount,
          token: podInfo.podAddress,
        },
        setHash
      );

      await handleStakeSucceed(response, selectedToken);
    } else {
      response = await web3APIHandler.DistributionManager.stakeCopyrightFractions(
        web3,
        account!,
        {
          contractAddress: podInfo.distributionManagerAddress,
          amount,
          token: podInfo.copyrightToken,
        },
        setHash
      );

      await handleStakeSucceed(response, selectedToken);
    }
  };

  const handleStakeSucceed = async (response, type) => {
    if (response.success) {
      setTransactionSuccess(true);
      await priviPodStakeTokens({
        podId: pod.Id,
        staker: response.data.staker,
        type,
        tokenId: response.data.tokenId,
        amount: response.data.amount,
        podType: "PIX",
      });
      onClose();
      handleRefresh();
    } else {
      setTransactionSuccess(false);
      showAlertMessage("Failed to stake tokens", { variant: "error" });
    }
  };

  return (
    <>
      {openTranactionModal ? (
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
      ) : (
        <Modal size="medium" isOpen={open} onClose={onClose} className={classes.root} showCloseIcon>
          <Box className={classes.title} mt={2} mb={1}>
            POD Staking
          </Box>
          <Box className={classes.desc} mb={4}>
            To stake your POD Tokens input the amount you want to stake in field below and anjoy the APR
          </Box>
          <Box className={classes.greenBox} mb={5}>
            <Box>
              <Box mb={1} className={classes.amount}>
                Available POD Tokens
              </Box>
              <Box className={classes.greenText}>{availablePT.toFixed(2)} PT</Box>
            </Box>
            <Box className={classes.divider} />
            <Box>
              <Box mb={1} className={classes.amount}>
                Available fractions
              </Box>
              <Box className={classes.greenText}>{availableFractions}</Box>
            </Box>
          </Box>
          <Box className={classes.label} mt={2}>
            Token
          </Box>
          <StyledSelect
            className={classes.selectorContainter}
            value={selectedToken}
            onChange={(e: any) => {
              setSelectedToken(e.target.value);
            }}
          >
            {TOKENLIST.map((item, index) => (
              <StyledMenuItem key={index} value={item.value}>
                {item.name}
              </StyledMenuItem>
            ))}
          </StyledSelect>
          <Box display="flex" mt={3}>
            <Box flex={1.2} mr={"26px"}>
              <InputWithLabelAndTooltip
                labelName="Amount to stake"
                inputValue={amount.toString()}
                endAdornment={<Box style={{ opacity: 0.5, whiteSpace: "nowrap" }}>POD Tokens</Box>}
                onInputValueChange={e => setAmount(Number(e.target.value))}
                type="number"
                overriedClasses={classes.inputContainer}
              />
            </Box>
            <Box flex={1} textAlign="right">
              <Box className={classes.label} style={{ color: Color.Violet }}>
                USD Value
              </Box>
              <div className={classes.inputContainerWhite}>{podInfo.fundingTokenPrice * amount}</div>
              <Box className={classes.fees} mt={"12px"}>
                Fees: <b>{fees} USDp</b>
              </Box>
            </Box>
          </Box>

          <Box display="flex" justifyContent="center" mt={11}>
            <PrimaryButton
              onClick={handleSubmit}
              size="small"
              style={{
                mixBlendMode: "normal",
                height: "59px",
                padding: "19.5px",
                fontFamily: "Montserrat",
                fontStyle: "normal",
                fontWeight: "bold",
                fontSize: "16px",
                lineHeight: "20px",
                letterSpacing: "-0.04em",
                textAlign: "center",
                background: Color.Purple,
                width: "100%",
              }}
            >
              Confirm Purchase
            </PrimaryButton>
          </Box>
        </Modal>
      )}
    </>
  );
}
