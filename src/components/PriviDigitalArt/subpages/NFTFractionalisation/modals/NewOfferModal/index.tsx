import React, { useState, useEffect } from "react";
import { Modal } from "shared/ui-kit";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { Grid, makeStyles } from "@material-ui/core";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { BlockchainNets } from "shared/constants/constants";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import { switchNetwork } from "shared/functions/metamask";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { createExchange, placeSellingOffer, placeBuyingOffer } from "shared/services/API/FractionalizeAPI";
import { getErc20BalanceFromMoralis } from "shared/services/API/balances/externalAPI";

const useNewOfferModalStyles = makeStyles(theme => ({
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
    color: "#431AB7",
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

export const NewOfferModal = ({ media, type, onClose, handleRefresh }) => {
  const classes = useNewOfferModalStyles();
  const { showAlertMessage } = useAlertMessage();

  const [exchangeName, setExchangeName] = useState<string>("");
  const [fractionAmount, setFractionAmount] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [token, setToken] = useState<string>("USDT");
  const [tokenList, setTokenList] = useState<string[]>([]);
  const {account, library, chainId } = useWeb3React();
  const [available, setAvailable] = useState<string>("0");

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedChain, setSelectedChain] = useState<any>(BlockchainNets.find(b => b.chainId == media?.FractionalizeData?.chainId) ?? BlockchainNets[1]);

  // sync metamask chainId with selected chain
  useEffect(() => {
    if (chainId !== selectedChain.chainId) {
      switchNetwork(selectedChain.chainId).then(changed => {
        if (!changed) showAlertMessage(`Please change your metamask wallet to ${selectedChain.value}`);
      });
    }
  }, [selectedChain.chainId, chainId]);

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

  const validate = () => {
    if (!fractionAmount || !Number(fractionAmount)) {
      showAlertMessage("Invalid amount", {variant: "error"});
      return false;
    }
    else if (!price || !Number(price)) {
      showAlertMessage("Invalid price", {variant: "error"});
      return false;
    }
    else if (type === "Creating" && !exchangeName) {
      showAlertMessage("Empty exchange name", {variant: "error"});
      return false;
    }
    else if (["Creating", "Selling"].includes(type) && Number(fractionAmount) > Number(available)) {
      showAlertMessage("Not enought fraction amount to sell", {variant: "error"});
      return false;
    }
    else if (type === "Creating" && !token) {
      showAlertMessage("Token cant be empty", {variant: "error"});
      return false;
    }
    return true;
  }

  const handleSubmit = async () => {
    if (validate()) {
      const web3 = new Web3(library.provider);
      switch (type) {
        case "Creating":
          setLoading(true);
          var approvalResp = await selectedChain.apiHandler.Erc20["USDT"].Approval(web3, account!, media.FractionalizeData.erc20VaultTokenAddress, "ERC20_TOKEN_EXCHANGE", fractionAmount);
          if (approvalResp?.success) {
            const createResp = await selectedChain.apiHandler.erc20Exchange.CreateERC20TokenExchange(web3, account!, exchangeName, media.FractionalizeData.erc20VaultTokenAddress, token, fractionAmount, price);
            if (createResp?.success) {
              const createData = createResp.data;
              const data = {
                vaultId: media?.FractionalizeData.vaultId,
                exchangeData: {
                  createdAt: Date.now(),
                  ...createData,
                  creatorAddress: account,
                  token,
                },
                sellingOffer: {
                  createdAt: Date.now(),
                  offerId: createData.initialOfferId,
                  token,
                  price,
                  fractionAmount,
                  creatorAddress: account,
                }
              };
              await createExchange(data);
              showAlertMessage("Exchange created successfully", { variant: "success" });
              handleRefresh();
              onClose();
            }
          }
          else showAlertMessage("Contract allowance failed", { variant: "error" });
          setLoading(false);
          break;
        case "Selling":
          setLoading(true);
          var approvalResp = await selectedChain.apiHandler.Erc20["USDT"].Approval(web3, account!, media.FractionalizeData.erc20VaultTokenAddress, "ERC20_TOKEN_EXCHANGE", fractionAmount);
          if (approvalResp?.success) {
            const sellOfferResp = await selectedChain.apiHandler.erc20Exchange.PlaceERC20TokenSellingOffer(web3, account!, media.FractionalizeData?.exchangeData?.exchangeId, fractionAmount, price, token);
            if (sellOfferResp?.success) {
              const data = {
                vaultId: media?.FractionalizeData.vaultId,
                sellingOffer: {
                  createdAt: Date.now(),
                  offerId: sellOfferResp.data,
                  token,
                  price,
                  fractionAmount,
                  creatorAddress: account,
                }
              };
              await placeSellingOffer(data);
              showAlertMessage("Selling offer placed successfully", { variant: "success" });
              handleRefresh();
              onClose();
            }
          }
          else showAlertMessage("Contract allowance failed", { variant: "error" });
          setLoading(false);
          break;
        case "Buying":
          setLoading(true);
          var approvalResp = await selectedChain.apiHandler.Erc20["USDT"].Approval(web3, account!, selectedChain.config.TOKEN_ADDRESSES[token], "ERC20_TOKEN_EXCHANGE", Number(price)*Number(fractionAmount), token);
          if (approvalResp?.success) {
            const sellOfferResp = await selectedChain.apiHandler.erc20Exchange.PlaceERC20TokenBuyingOffer(web3, account!, media.FractionalizeData?.exchangeData?.exchangeId, fractionAmount, price, token);
            if (sellOfferResp?.success) {
              const data = {
                vaultId: media?.FractionalizeData.vaultId,
                buyingOffer: {
                  createdAt: Date.now(),
                  offerId: sellOfferResp.data,
                  token,
                  price,
                  fractionAmount,
                  creatorAddress: account,
                }
              };
              await placeBuyingOffer(data);
              showAlertMessage("Buying offer placed successfully", { variant: "success" });
              handleRefresh();
              onClose();
            }
          }
          else showAlertMessage("Contract allowance failed", { variant: "error" });
          setLoading(false);
          break;
      }
    }
  };

  useEffect(() => {
    if (media.FractionalizeData.exchangeData) {
      setTokenList([media.FractionalizeData.exchangeData.token]);
      setToken(media.FractionalizeData.exchangeData.token);
    }
    else {
      const newTokenList = Object.keys(selectedChain?.config?.TOKEN_ADDRESSES ?? {});
      setTokenList(newTokenList);
      setToken(newTokenList.length ? newTokenList[0] : '');
    }
  }, [selectedChain, media?.FractionalizeData?.exchangeData])

  return (
    <Modal size="small" isOpen={true} onClose={onClose} showCloseIcon className={classes.root}>
      <LoadingScreen
        loading={loading}
        title={`Transaction \nin progress`}
        subTitle={`Transaction is proceeding on ${selectedChain.value}.\nThis can take a moment, please be patient...`}
        handleClose={() => setLoading(false)}
      >
        <div className={classes.title}>{type === "Creating" ? "Create Exchange" : `New ${type} Offer`}</div>
        <Grid container spacing={1}>
          {type === "Creating" && (
            <Grid item xs={12} md={12}>
              <InputWithLabelAndTooltip
                labelName={"Exchange Name"}
                inputValue={exchangeName}
                onInputValueChange={e => {
                  setExchangeName(e.target.value);
                }}
                placeHolder={"My Exchange"}
                required
                theme="light"
                type="text"
              />
            </Grid>
          )}
          <Grid item xs={12} md={12}>
            <InputWithLabelAndTooltip
              labelName={["Creating", "Selling"].includes(type) ? "How many of your Fractions would you want to sell?" : "How many Fractions would you want to buy?"}
              inputValue={fractionAmount}
              onInputValueChange={e => {
                setFractionAmount(e.target.value);
              }}
              placeHolder={"0"}
              minValue={"0"}
              required
              type="number"
              theme="light"
            />
            <div className={classes.balance}>{`Available: ${available}`}</div>
          </Grid>
          <label>
            {`Which price ${type === "Creating"? "and token":""} would you want to ${["Creating", "Selling"].includes(type) ? "sell" : "buy"} each fraction?`}
          </label>
          {type === "Creating" && <Grid item xs={12} md={4}>
            <TokenSelect
              tokens={tokenList}
              value={token}
              onChange={e => {
                setToken(e.target.value as string);
              }}
            />
          </Grid>}

          <Grid item xs={12} md={type === "Creating"? 8: 12}>
            <InputWithLabelAndTooltip
              inputValue={price}
              onInputValueChange={e => {
                setPrice(e.target.value);
              }}
              placeHolder={"0"}
              minValue={"0"}
              required
              type="number"
              theme="light"
            />
          </Grid>
        </Grid>

        <div className={classes.purpleText}>{`You will stake in the offer ${["Creating", "Selling"].includes(type)? fractionAmount:Number(price)*Number(fractionAmount)} ${["Creating", "Selling"].includes(type)? media?.FractionalizeData?.symbol :token}`}</div>
        <img className={classes.image} src={require("assets/icons3d/redeem_table.png")} alt="" />
        <button className={classes.button} onClick={handleSubmit}>
          {type === "Creating" ? "Create" : type === "Selling" ? "Sell" : "Buy"}
        </button>
      </LoadingScreen>
    </Modal>
  );
};
