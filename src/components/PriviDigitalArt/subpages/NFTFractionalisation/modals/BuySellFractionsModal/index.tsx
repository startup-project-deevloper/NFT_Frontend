import React, { useState, useEffect } from "react";
import { Modal } from "shared/ui-kit";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { makeStyles } from "@material-ui/core";
import { BlockchainNets } from "shared/constants/constants";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import { switchNetwork } from "shared/functions/metamask";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { buyFromOffer, sellFromOffer } from "shared/services/API/FractionalizeAPI";
import { getErc20BalanceFromMoralis } from "shared/services/API/balances/externalAPI";

const useBuySellFractionModalStyles = makeStyles(theme => ({
  root: {
    width: "438px !important",
    display: "flex",
    flexDirection: "column",
    "& label": {
      color: "#1A1B1C",
      fontSize: "14px",
      lineHeight: "120%",
    },
    "& .MuiInput-root": {
      margin: "8px 0px 0px",
      background: "#FFFFFF",
      borderRadius: "8px",
      height: "40px !important",
      minHeight: "40px !important",
      border: "1px solid #A4A4A4",
      fontFamily: "Agrandir",
    },
  },
  title: {
    fontSize: "14px",
    lineHeight: "120%",
    fontWeight: 800,
    color: "#181818",
    alignSelf: "center",
    marginBottom: "24px",
    textAlign: "center",
  },
  balance: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "10px",
    lineHeight: "21px",
    color: "#1A1B1C",
    marginTop: "4px",
    marginBottom: "24px",
  },
  button: {
    background: "#431AB7",
    borderRadius: "4px",
    order: 0,
    flexGrow: 1,
    margin: "24px 0px 0px",
    padding: "8px 32px",
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "18px",
    textAlign: "center",
    color: "#FFFFFF",
  },
  purpleText: {
    textAlign: "center",
    color: "#431AB7",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "21px",
    alignSelf: "center",
    marginTop: "calc(191px / 2 - 20px)",
    marginBottom: "calc(-191px / 2 - 20px)",
    zIndex: 2,
    width: "220px",
    maxWidth: "220px",
  },
  image: {
    zIndex: 1,
    height: "191px",
    width: "286px",
    alignSelf: "center",
  },
}));

export const BuySellFractionModal = ({ type, onClose, media, offer, handleRefresh }) => {
  const classes = useBuySellFractionModalStyles();
  const { showAlertMessage } = useAlertMessage();
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { account, library, chainId } = useWeb3React();
  const [selectedChain, setSelectedChain] = useState<any>(BlockchainNets.find(b => b.chainId == media?.FractionalizeData?.chainId) ?? BlockchainNets[1]);
  const [available, setAvailable] = useState<string>("0");

  // sync metamask chainId with selected chain
  useEffect(() => {
    if (chainId !== selectedChain.chainId) {
      switchNetwork(selectedChain.chainId).then(changed => {
        if (!changed) showAlertMessage(`Please change your metamask wallet to ${selectedChain.value}`);
      });
    }
  });

  // get fraction balance
  useEffect(() => {
    if (media?.FractionalizeData?.erc20VaultTokenAddress) {
      getErc20BalanceFromMoralis(account!, selectedChain.chainId).then(resp => {
        const obj = (resp ?? []).find(t => t.token_address === media.FractionalizeData.erc20VaultTokenAddress.toLowerCase());
        if (obj) {
          const web3 = new Web3(library.provider);
          setAvailable(web3.utils.fromWei(obj.balance));
        }
      })
    }
  }, [media?.FractionalizeData?.erc20VaultTokenAddress, selectedChain.chainId]);

  // smart contract dont allow selecting amount
  useEffect(() => {
    if (offer.fractionAmount) {
      setAmount(offer.fractionAmount);
    }
  }, [offer.fractionAmount]);

  const validate = () => {
    if (type === "Seliing" && Number(amount) > Number(available)) {
      showAlertMessage("Not enought fraction amount to sell", {variant: "error"});
      return false;
    }
    return true;
  }

  const handleSubmit = async () => {
    if (validate()) {
      const web3 = new Web3(library.provider);
      if (type === "Selling") {
        setLoading(true);
          var approvalResp = await selectedChain.apiHandler.Erc20["USDT"].Approval(web3, account!, media.FractionalizeData.erc20VaultTokenAddress, "ERC20_TOKEN_EXCHANGE", amount);
          if (approvalResp?.success) {
            const sellResp = await selectedChain.apiHandler.erc20Exchange.SellERC20TokenFromOffer(web3, account!, media.FractionalizeData.exchangeData.exchangeId, offer.offerId);
            if (sellResp?.success) {
              const data = {
                vaultId: media?.FractionalizeData.vaultId,
                amount,
                offerId: offer?.offerId,
              };
              await sellFromOffer(data);
              showAlertMessage("Fraction sold", { variant: "success" });
              handleRefresh();
              onClose();
            }
          }
          else showAlertMessage("Selling failed", { variant: "error" });
          setLoading(false);
      } 
      else {
        setLoading(true);
          var approvalResp = await selectedChain.apiHandler.Erc20["USDT"].Approval(web3, account!, selectedChain.config.TOKEN_ADDRESSES[media.FractionalizeData.exchangeData.token], "ERC20_TOKEN_EXCHANGE", Number(amount)*Number(offer.price));
          if (approvalResp?.success) {
            const sellResp = await selectedChain.apiHandler.erc20Exchange.BuyERC20TokenFromOffer(web3, account!, media.FractionalizeData.exchangeData.exchangeId, offer.offerId);
            if (sellResp?.success) {
              const data = {
                vaultId: media?.FractionalizeData.vaultId,
                amount,
                offerId: offer?.offerId,
              };
              await sellFromOffer(data);
              showAlertMessage("Fraction sold", { variant: "success" });
              handleRefresh();
              onClose();
            }
          }
          else showAlertMessage("Selling failed", { variant: "error" });
          setLoading(false);
      }
    } 
  };

  return (
    <Modal size="small" isOpen={true} onClose={onClose} showCloseIcon className={classes.root}>
      <LoadingScreen
        loading={loading}
        title={`Transaction \nin progress`}
        subTitle={`Transaction is proceeding on ${selectedChain.value}.\nThis can take a moment, please be patient...`}
        handleClose={() => setLoading(false)}
      >
        <div className={classes.title}>{`${type === "Selling" ? "Sell" : "Buy"} NFT Fractions`}</div>
        <InputWithLabelAndTooltip
          labelName={
            type !== "Selling"
              ? "How many of your Fractions would you want to purchase?"
              : "How many of your Fractions would you want to sell?"
          }
          inputValue={amount}
          // onInputValueChange={e => {
          //   let newAmount = Number(e.target.value);
          //   if (offer?.fractionAmount) newAmount = Math.min(newAmount, Number(offer?.fractionAmount));
          //   setAmount(newAmount.toString());
          // }}
          placeHolder={"0.0"}
          minValue={"0"}
          required
          type="number"
          theme="light"
        />
        <div className={classes.balance}>{`Available: ${available}`}</div>

        <div className={classes.purpleText}>
          {`You will ${type === "Selling" ? "receive a total of" : "need to pay"} ${Number(amount)* (Number(offer?.price) ?? 1)} ${media?.fractionalizeData?.exchangeData?.token ?? "USDT"}`}
        </div>
        <img className={classes.image} src={require("assets/icons3d/redeem_table.png")} alt="" />
        <button className={classes.button} onClick={handleSubmit}>
          {type === "Selling" ? "Sell" : "Buy"} Fractions
        </button>
      </LoadingScreen>
    </Modal>
  );
};
