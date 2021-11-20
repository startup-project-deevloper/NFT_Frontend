import React, { useState, useEffect } from "react";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { MakeNewOfferModalStyles } from "./index.style";
import { typeUnitValue } from "shared/helpers/utils";
import { Grid } from "@material-ui/core";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { BlockchainNets } from "shared/constants/constants";
import URL from "shared/functions/getURL";
import { injected } from "shared/connectors";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import Axios from "axios";
import { ReserveTokenSelect } from "shared/ui-kit/Select/ReserveTokenSelect";
import Web3 from "web3";
import { toDecimals, toNDecimals } from "shared/functions/web3";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import TransactionProgressModal from "../TransactionProgressModal";

export default function MakeNewOfferModal({ open, handleClose, nftDetailData, onConfirm }) {
  const classes = MakeNewOfferModalStyles();
  const { activate, account, library, chainId } = useWeb3React();
  // let data = ['1'];
  const [usdt, setUsdt] = React.useState<number>(0);
  const [price, setPrice] = useState<string | number>();
  const [step, setStep] = useState<number>(0);

  const [soldDays, setSoldDays] = React.useState<number>(0);
  const [disappearDays, setDisappearDays] = React.useState<number>(0);
  const [collateral, setCollateral] = useState(0);

  const [validateError, setValidateError] = useState(false);

  const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");
  const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[0]);
  const [tokenList, setTokenList] = useState<any[]>([]);
  const [reservePriceToken, setReservePriceToken] = useState<any>();
  const [colaterralPriceToken, setColaterralPriceToken] = useState<any>();
  const [collateralPercent, setCollateralPercent] = useState<string | number>();
  const [blockingPeriod, setBlockingPeriod] = useState<string | number>();
  const [totalBalance, setTotalBalance] = React.useState<string>("0");
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [confirmSuccess, setConfirmSuccess] = useState<boolean>(false);
  const [collateralList, setCollateralList] = useState([
    {
      value: 0,
      token: "ETH",
    },
  ]);

  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const { showAlertMessage } = useAlertMessage();

  useEffect(() => {
    Axios.get(`${URL()}/token/getAllTokenInfos`).then(res => {
      const resp = res.data;
      console.log(resp);
      if (resp.success) {
        setTokenList(resp.tokens); // update token list
        setReservePriceToken(resp.tokens[0]);
        setColaterralPriceToken(resp.tokens[0]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setBalance();
  }, [reservePriceToken]);

  const setBalance = async () => {
    if (reservePriceToken) {
      const targetChain = BlockchainNets.find(net => net.value === "Polygon Chain");

      const web3APIHandler = targetChain.apiHandler;
      const web3 = new Web3(library.provider);
      const decimals = await web3APIHandler.Erc20[reservePriceToken?.Symbol || "ETH"].decimals(web3, reservePriceToken.Address);
      const balance = await web3APIHandler.Erc20[reservePriceToken?.Symbol || "ETH"].balanceOf(web3, {
        account,
      });
      console.log(decimals, balance);
      setTotalBalance(toDecimals(balance, decimals));
    }
  };

  const handleApprove = async () => {
    try {
      setOpenTransactionModal(true);
      const targetChain = BlockchainNets.find(net => net.value === "Polygon Chain");
      const web3Config = targetChain.config;
      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0);
        if (!isHere) {
          showAlertMessage("Got failed while switching over to target network", { variant: "error" });
          return;
        }
      }
      const web3APIHandler = targetChain.apiHandler;
      const web3 = new Web3(library.provider);
      let balance = await web3APIHandler.Erc20[reservePriceToken.Symbol].balanceOf(web3, { account });
      let decimals = await web3APIHandler.Erc20[reservePriceToken.Symbol].decimals(web3, { account });
      balance = balance / Math.pow(10, decimals);
      if (balance < (price || 0)) {
        showAlertMessage(`Insufficient balance to approve`, { variant: "error" });
        setTransactionSuccess(false);
        return;
      }
      const approved = await web3APIHandler.Erc20[reservePriceToken.Symbol].approve(
        web3,
        account!,
        web3Config.CONTRACT_ADDRESSES.OPEN_SALES_MANAGER,
        toNDecimals(price, reservePriceToken.Decimals)
      );
      if (!approved) {
        showAlertMessage(`Can't proceed to approve`, { variant: "error" });
        setTransactionSuccess(false);
        return;
      }
      setIsApproved(true);
      showAlertMessage(`Successfully approved ${price} ${reservePriceToken.Symbol}!`, {
        variant: "success",
      });
      setTransactionSuccess(null);
      setOpenTransactionModal(false);
    } catch (error) {
      console.log(error);
      showAlertMessage("Something went wrong. Please try again!", {
        variant: "error",
      });
    } finally {
    }
  };

  const handleConfirm = async () => {
    setOpenTransactionModal(true);
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
    const tokenId = nftDetailData.tokenId ? nftDetailData.tokenId : 1;
    const collection = nftDetailData.nftAddress;

    const response = await web3APIHandler.openSalesManager.approveReserveToBuy(
      web3,
      account!,
      {
        collection,
        tokenId,
        paymentToken: reservePriceToken.Address,
        price: toNDecimals(price, reservePriceToken.Decimals),
        collateralPercent: collateralPercent,
        beneficiary: account,
        reservePeriod: blockingPeriod,
        sellerToMatch: "0x0000000000000000000000000000000000000000",
      },
      setHash
    );

    if (response.success) {
      setTransactionSuccess(true);
      const offerId = web3.utils.keccak256(
        web3.eth.abi.encodeParameters(
          ["address", "uint256", "address", "uint256", "uint80", "address", "uint64", "address"],
          [collection, tokenId, reservePriceToken.Address, toNDecimals(price, reservePriceToken.Decimals), collateralPercent, account, blockingPeriod]
        )
      );

      // await createMakeBlockingOffer({
      //   nftId: nftDetailData.Id,
      //   offerId,
      //   Collection: collection,
      //   TokenId: tokenId,
      //   PaymentToken: reservePriceToken.Address,
      //   Price: toNDecimals(price, reservePriceToken.Decimals),
      //   CollateralPercent: collateralPercent,
      //   Beneficiary: account,
      //   ReservePeriod: blockingPeriod,
      //   Decimals: reservePriceToken.Decimals,
      //   Symbol: reservePriceToken.name,
      // });
      handleClose();
      onConfirm();
      //   handleRefresh();
    } else {
      setTransactionSuccess(false);
      showAlertMessage("Failed to make an offer", { variant: "error" });
    }
  };

  return (
    <>
      <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.container}>
        {!confirmSuccess && (
          <>
            <Box style={{ padding: "25px" }}>
              <Box fontSize="24px" color="#431AB7">
                Make New Blocking Offer
              </Box>
              <Grid container spacing={2}>
                <Grid item sm={7}>
                  <Box className={classes.nameField}>Price Offer</Box>
                </Grid>
                <Grid item sm={5}>
                  <Box className={classes.nameField}>Reserve Token</Box>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={7}>
                  <InputWithLabelAndTooltip
                    inputValue={price}
                    onInputValueChange={e => setPrice(e.target.value)}
                    overriedClasses={classes.inputJOT}
                    required
                    type="number"
                    theme="light"
                    minValue={0}
                  />
                </Grid>
                <Grid item sm={5}>
                  <ReserveTokenSelect
                    tokens={tokenList}
                    value={reservePriceToken?.Address || ""}
                    className={classes.inputJOT}
                    onChange={e => {
                      setReservePriceToken(tokenList.find(v => v.Address === e.target.value));
                    }}
                    style={{ flex: "1" }}
                  />
                </Grid>
              </Grid>
              <Box className={classes.nameField}>Blocking Period</Box>
              <InputWithLabelAndTooltip
                inputValue={blockingPeriod}
                onInputValueChange={e => setBlockingPeriod(e.target.value)}
                overriedClasses={classes.inputJOT}
                required
                type="number"
                theme="light"
                minValue={0}
                endAdornment={<div className={classes.purpleText}>DAYS</div>}
              />
              <Box className={classes.nameField}>Collateral % to Block Price</Box>
              <InputWithLabelAndTooltip
                inputValue={collateral}
                onInputValueChange={e => setCollateral(e.target.value)}
                overriedClasses={classes.inputJOT}
                required
                type="number"
                theme="light"
                minValue={0}
                endAdornment={<div className={classes.purpleText}>%</div>}
              />
              <Box className={classes.nameField}>Collaterall Amount & Token</Box>
              <Grid container spacing={2}>
                <Grid item sm={7}>
                  <InputWithLabelAndTooltip
                    inputValue={collateralPercent}
                    // onInputValueChange={e => setCollateral(e.target.value)}
                    onInputValueChange={e => setCollateralPercent(e.target.value)}
                    overriedClasses={classes.inputJOT}
                    required
                    type="number"
                    theme="light"
                    minValue={0}
                  />
                </Grid>
                <Grid item sm={5}>
                  <ReserveTokenSelect
                    tokens={tokenList}
                    value={colaterralPriceToken?.Address || ""}
                    className={classes.inputJOT}
                    onChange={e => {
                      setColaterralPriceToken(tokenList.find(v => v.Address === e.target.value));
                    }}
                    style={{ flex: "1" }}
                  />
                </Grid>
              </Grid>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                color="#431AB7"
                marginTop="14px"
              >
                <Box display="flex" alignItems="center" gridColumnGap="10px" fontSize="14px">
                  <span>Wallet Balance</span>
                  <Box className={classes.usdWrap} display="flex" alignItems="center">
                    <Box className={classes.point}></Box>
                    <Box fontWeight="700">{totalBalance} {reservePriceToken?.Symbol}</Box>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" fontSize="16px">
                  <span onClick={() => setPrice(totalBalance)}>MAX</span>
                </Box>
              </Box>

              <Box className={classes.nameField}>Offer will disapppear if not accepted within</Box>
              <InputWithLabelAndTooltip
                inputValue={disappearDays}
                onInputValueChange={e => setDisappearDays(e.target.value)}
                overriedClasses={classes.inputJOT}
                required
                type="number"
                theme="light"
                minValue={0}
                endAdornment={<div className={classes.purpleText}>DAYS</div>}
              />
            </Box>
            <Box className={classes.footer}>
              <Box className={classes.totalText}>Total</Box>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box style={{ color: "#431AB7", fontSize: "14px", fontFamily: "Montserrat", fontWeight: 500 }}>
                  Collateral at <span style={{ color: validateError ? "red" : "#431AB7" }}>40%</span> /{" "}
                  <b>50</b>%
                  {validateError && <Box style={{ color: "red" }}>You need to add more collaterall</Box>}
                </Box>
                <Box style={{ color: "#431AB7", fontSize: "14px", fontFamily: "Montserrat", fontWeight: 500 }}>
                  22 225 USDT
                </Box>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="flex-end" mt={3}>
                <SecondaryButton
                  size="medium"
                  className={classes.primaryButton}
                  style={{ backgroundColor: step !== 0 ? "#431AB750" : "#431AB7" }}
                  onClick={handleApprove}
                  disabled={isApproved || !price}
                >
                  {isApproved ? "Approved" : "Approve"}
                </SecondaryButton>
                <PrimaryButton
                  size="medium"
                  className={classes.primaryButton}
                  style={{ backgroundColor: step !== 1 ? "#431AB750" : "#431AB7" }}
                  onClick={handleConfirm}
                  disabled={!isApproved || !price}
                >
                  Confirm Offer
                </PrimaryButton>
              </Box>
            </Box>
          </>
        )}
        {confirmSuccess && (
          <Box
            style={{ padding: "218px 25px 52px" }}
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            flexDirection="column"
          >
            <img src={require("assets/icons/lock-success-icon.png")} width="110px" /> <br />
            <div
              style={{
                fontFamily: "Agrandir GrandHeavy",
                color: "#2D3047",
                fontSize: "22px",
                fontWeight: 800,
                marginTop: "31px",
                textAlign: "center",
              }}
            >
              Your blocking <br />
              offer was sent
            </div>
            <div style={{ color: "#54658F", fontSize: "16px", marginTop: "34px", textAlign: "center" }}>
              You’ve succesfully send blocking offer for <br />
              [NFT NAME]
            </div>
            <PrimaryButton
              size="medium"
              style={{
                background: "#431AB7",
                color: "#ffffff",
                minWidth: "56%",
                fontSize: "14px",
                marginTop: "144px",
              }}
              onClick={handleClose}
            >
              Done
            </PrimaryButton>
          </Box>
        )}
      </Modal>
      {openTranactionModal && (
        <TransactionProgressModal
          open={openTranactionModal}
          onClose={() => {
            setHash("");
            setTransactionSuccess(null);
            setOpenTransactionModal(false);
          }}
          txSuccess={transactionSuccess}
          hash={hash}
          network={ selectedChain?.value.replace(" Chain", "") || ""}
        />
      )}
    </>
  );
}
