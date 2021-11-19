import React, { useState, useEffect, useMemo } from "react";
import { makeStyles } from "@material-ui/core";
import { useMediaQuery, useTheme } from "@material-ui/core";
import { Color, Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { PrimaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { BlockchainNets } from "shared/constants/constants";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { toDecimals, toNDecimals } from "shared/functions/web3";
import TransactionProgressModal from "../TransactionProgressModal";
import { priviPodCreateCopyrightNFT } from "shared/services/API";
import { getURLfromCID, uploadNFTMetaData } from "shared/functions/ipfs/upload2IPFS";

const useStyles = makeStyles(theme => ({
  root: {
    width: "755px !important",
    // padding: "40px 40px 50px !important",
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
    color: "#2D3047",
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
    },
  },
  desc: {
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "16px",
    lineHeight: "150%",
    textAlign: "center",
    color: "#54658F",
    padding: "0 48px",
    [theme.breakpoints.down("xs")]: {
      padding: "0 24px",
      fontSize: 14,
    },
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
    background: "rgba(218, 230, 229, 0.4)",
    border: "1px solid #7BCBB7",
    borderRadius: "55px",
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
    background: "rgba(218, 230, 229, 0.4)",
    borderRadius: "8px",
    height: 50,
  },
  greenBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D",
    borderRadius: "12px",
    padding: "32px 48px",
    textAlign: "center",
    textTransform: "uppercase",
    [theme.breakpoints.down("xs")]: {
      padding: "32px 32px",
    },
  },
  greenText: {
    fontFamily: "Agrandir Grand",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "28px",
    lineHeight: "104.5%",
    textTransform: "uppercase",
    color: Color.MusicDAOLightBlue,
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
    },
  },
  amount: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "22px",
    lineHeight: "104.5%",
    color: Color.Green,
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
    },
  },
  inputContainerWhite: {
    fontFamily: "Agrandir Grand",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "28px",
    lineHeight: "120%",
    color: Color.MusicDAODark,
    padding: "9px 20px",
    border: "1px solid #F0F5F8",
    textAlign: "end",
    borderRadius: "55px",
    height: 50,
  },
  fees: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontSize: "14px",
    lineHeight: "120%",
    color: "#707582",
  },
  divider: {
    width: 1,
    height: 50,
    background: "#DAE6E5",
  },
  h1: {
    fontWeight: 800,
    fontSize: "26px",
    lineHeight: "32px",
  },
  h2: {
    fontWeight: 600,
    fontSize: "18px",
    lineHeight: "22px",
  },
}));

export default function CreateNFTModal({ open, onClose, handleRefresh, pod }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const classes = useStyles();

  const { showAlertMessage } = useAlertMessage();

  const [podInfo, setPodInfo] = useState<any>();

  const [amount, setAmount] = useState<number>(0);
  const [availableFractions, setAvailableFractions] = useState<number>(0);

  const { account, library, chainId } = useWeb3React();
  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);

  const totalSupply = useMemo(() => {
    return podInfo ? podInfo.fundingTarget / podInfo.fundingTokenPrice : 0;
  }, [podInfo]);

  const share = useMemo(() => {
    return totalSupply ? ((amount / totalSupply) * 100).toFixed(2) : 0;
  }, [amount]);

  useEffect(() => {
    if (!open) return;

    (async () => {
      const targetChain = BlockchainNets.find(net => net.value === "Polygon Chain");
      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0);
        if (!isHere) {
          showAlertMessage("Got failed while switching over to target network", { variant: "error" });
          return;
        }
      }
      const web3APIHandler = targetChain.apiHandler;
      const web3 = new Web3(library.provider);

      const info = await web3APIHandler?.PodManager.getPodInfo(web3, {
        podAddress: pod.PodAddress,
        fundingToken: pod.FundingToken,
      });
      setPodInfo(info);

      const decimals = await web3APIHandler.Erc20["COPYRIGHT"].decimals(web3, info.copyrightToken);
      const balance = await web3APIHandler.Erc20["COPYRIGHT"].balanceOf(web3, info.copyrightToken, {
        account,
      });
      setAvailableFractions(+toDecimals(balance, decimals));
    })();
  }, [open]);

  const handleSubmit = async () => {
    setOpenTransactionModal(true);

    const metadata = {
      name: pod.Name,
      description: pod.Description,
      external_url: `${window.location.href}`,
      image: `${getURLfromCID(pod.InfoImage.newFileCID)}/${pod.InfoImage.metadata.properties.name}`,
    };
    const uri = (await uploadNFTMetaData(metadata)).uri;

    const targetChain = BlockchainNets.find(net => net.value === "Polygon Chain");
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Got failed while switching over to target network", { variant: "error" });
        return;
      }
    }

    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);

    const decimals = await web3APIHandler.Erc20["COPYRIGHT"].decimals(web3, podInfo.copyrightToken);
    const response = await web3APIHandler.Erc20["COPYRIGHT"].combine(
      web3,
      account!,
      podInfo.copyrightToken,
      {
        amount: toNDecimals(amount, decimals),
        uri,
      },
      setHash
    );

    if (response.success) {
      setTransactionSuccess(true);
      await priviPodCreateCopyrightNFT({
        podId: pod.Id,
        owner: account,
        amount,
        tokenAddress: response.data.tokenAddress,
        tokenId: response.data.tokenId,
        share: +share,
        uri,
        type: "PIX",
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
            Create NFT from Media Fractions
          </Box>
          <Box className={classes.desc} mb={4}>
            Create NFT tradeble on Opensea from your <span style={{ color: "#1ABB00" }}>{pod.Name}</span>
          </Box>
          <Box
            style={{
              textAlign: "center",
              background: "#F2FBF6",
              borderRadius: "12px",
              padding: "32px 0",
            }}
          >
            <Box className={classes.h2} mb={1}>
              Available MEDIA FRACTIONS
            </Box>
            <Box className={classes.h1} color="#1ABB00">
              {totalSupply}
            </Box>
          </Box>
          <InputWithLabelAndTooltip
            labelName="Amount of media fractions"
            inputValue={amount.toString()}
            endAdornment={
              <Box style={{ opacity: 0.5, whiteSpace: "nowrap", fontSize: isMobile ? "14px" : "18px" }}>
                ={share}%
              </Box>
            }
            onInputValueChange={e => setAmount(Number(e.target.value))}
            type="number"
            overriedClasses={classes.inputContainer}
            maxValue={availableFractions}
          />
          <Box mt={1} display="flex" alignItems="center">
            <Box style={{ fontSize: 14, flex: 1 }}>Balance: {availableFractions} Media Fractions</Box>
            <Box style={{ fontSize: 14, flex: 1 }} onClick={() => setAmount(availableFractions)}>
              Use Max
            </Box>
          </Box>

          <Box display="flex" justifyContent="center" mt={11}>
            <PrimaryButton
              onClick={handleSubmit}
              size="small"
              style={{
                mixBlendMode: "normal",
                borderRadius: "48px",
                height: "59px",
                padding: "19.5px",
                fontFamily: "Montserrat",
                fontStyle: "normal",
                fontWeight: "bold",
                fontSize: "16px",
                lineHeight: "20px",
                letterSpacing: "-0.04em",
                textAlign: "center",
                background: "#2D3047",
                width: "352px",
              }}
              isRounded
              disabled={amount.toString() === "0"}
            >
              CREATE NFT
            </PrimaryButton>
          </Box>
        </Modal>
      )}
    </>
  );
}
