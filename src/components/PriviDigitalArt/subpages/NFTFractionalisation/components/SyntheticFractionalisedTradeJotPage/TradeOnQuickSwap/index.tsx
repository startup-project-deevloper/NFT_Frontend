import React, { useEffect, useState } from "react";
import Web3 from "web3";

import { useMediaQuery, useTheme } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";

import { BlockchainNets } from "shared/constants/constants";

import Box from "shared/ui-kit/Box";
import { TradeOnQuickSwapStyles } from "./index.styles";
import { ReactComponent as QuickSwapIcon } from "assets/icons/quick-swap-icon.svg";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import Web3Config from "shared/connectors/web3/config";
import { getSyntheticCollection } from "shared/services/API/SyntheticFractionalizeAPI";
import { toDecimals, toNDecimals } from "shared/functions/web3";

const IconJOT = (collection, classes) => {
  return (
    <img
      src={collection && collection.imageUrl ? collection.imageUrl : require(`assets/logos/JOT_default.png`)}
      alt="JOT Logo"
      className={classes.jotLogo}
    />
  );
};

export default function TradeOnQuickSwap(props: any) {
  const classes = TradeOnQuickSwapStyles();
  const [collection, setCollection] = useState<any>(null);
  const params: { id?: string } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const [swapButtonName, setSwapButtonName] = useState<string>("Swap");
  const { account, library, chainId } = useWeb3React();

  const [tokenFrom, setTokenFrom] = useState<any>({
    balance: 0,
    price: 1,
    symbol: "JOT",
    decimals: 18,
  });
  const [tokenTo, setTokenTo] = useState<any>({
    balance: 0,
    price: 1,
    symbol: "USDT",
    decimals: 6,
  });

  const [fromBalance, setFromBalance] = useState<number>(0);
  const [toBalance, setToBalance] = useState<number>(0);

  useEffect(() => {
    if (!params.id) return;
    (async () => {
      const response = await getSyntheticCollection(params.id);
      if (response.success) {
        setCollection(response.data);
      }
    })();
  }, [params.id]);

  useEffect(() => {
    if (collection) {
      getJotBalance();
      getUsdtBalance();
    }
  }, [collection]);

  const getJotBalance = async () => {
    (async () => {
      const targetChain = BlockchainNets[1];
      const web3 = new Web3(library.provider);
      const web3APIHandler = targetChain.apiHandler;

      const decimals = await web3APIHandler.Erc20.JOT.decimals(web3, collection.JotAddress, account!);
      const balance = await web3APIHandler.Erc20.JOT.balanceOf(web3, collection.JotAddress, {
        account: account!,
      });

      if (balance && decimals) {
        setTokenFrom({
          ...tokenFrom,
          balance: toDecimals(balance, decimals),
          decimals: decimals,
        });
      }
    })();
  };

  const getUsdtBalance = async () => {
    (async () => {
      const targetChain = BlockchainNets[1];
      const web3 = new Web3(library.provider);
      const web3APIHandler = targetChain.apiHandler;

      const decimals = await web3APIHandler.Erc20.USDT.decimals(web3);
      console.log(decimals);
      const balance = await web3APIHandler.Erc20.USDT.balanceOf(web3, {
        account: account!,
      });

      if (balance && decimals) {
        setTokenTo({
          ...tokenTo,
          balance: toDecimals(balance, decimals),
          decimals: decimals,
        });
      }
    })();
  };

  const handleSwapToken = () => {
    const _tokenFrom = JSON.parse(JSON.stringify(tokenFrom));
    setTokenFrom({
      ...tokenTo,
    });
    setTokenTo({
      ..._tokenFrom,
    });
    setFromBalance(JSON.parse(JSON.stringify(toBalance)));
    setToBalance(JSON.parse(JSON.stringify(fromBalance)));
  };

  const handleSwap = async () => {
    if (!collection || swapButtonName != "Swap") return;
    const targetChain = BlockchainNets[1];
    const web3Config = targetChain.config;
    const web3 = new Web3(library.provider);
    const web3APIHandler = targetChain.apiHandler;

    const amountOut = toNDecimals(toBalance, tokenTo.decimals);
    const amountInMax = toNDecimals(fromBalance, tokenFrom.decimals);
    const path =
      tokenTo.symbol === "USDT"
        ? [collection.JotAddress, web3Config.TOKEN_ADDRESSES["USDT"]]
        : [web3Config.TOKEN_ADDRESSES["USDT"], collection.JotAddress];

    const deadline = Math.floor(Date.now() / 1000 + 3600);

    if (tokenTo.symbol === "USDT")
      await web3APIHandler.Erc20.JOT.approve(
        web3,
        account,
        collection.JotAddress,
        web3Config.CONTRACT_ADDRESSES["QUICKSWAP_FACTORY_MANAGER"],
        amountInMax
      );
    else
      await web3APIHandler.Erc20.USDT.approve(
        web3,
        account,
        web3Config.CONTRACT_ADDRESSES["QUICKSWAP_FACTORY_MANAGER"],
        amountInMax
      );

    const response = await web3APIHandler.QuickSwap.swapTokensForExactTokens(
      web3,
      amountOut,
      amountInMax,
      path,
      account,
      deadline,
      account
    );

    if (response.status) {
    } else {
      setSwapButtonName("Insufficient Amount");
    }

    console.log(response);
  };

  const handleChangeFromBalance = async value => {
    if (!collection) return;
    const _value = !isNaN(Number(value)) && Number(value) != 0 ? Number(value) : 0;
    setFromBalance(_value);
    const targetChain = BlockchainNets[1];
    const web3Config = targetChain.config;
    const web3 = new Web3(library.provider);
    const web3APIHandler = targetChain.apiHandler;
    const amountIn = toNDecimals(_value, tokenFrom.decimals);
    const path =
      tokenTo.symbol === "USDT"
        ? [collection.JotAddress, web3Config.TOKEN_ADDRESSES["USDT"]]
        : [web3Config.TOKEN_ADDRESSES["USDT"], collection.JotAddress];

    if (_value != 0) {
      const response = await web3APIHandler.QuickSwap.getAmountsOut(web3, amountIn, path);
      if (!response.status) {
        setSwapButtonName("INSUFFICIENT INPUT AMOUNT");
      } else {
        setToBalance(Number(toDecimals(response.result[1], tokenTo.decimals)));
        setSwapButtonName("Swap");
      }
    } else {
      setToBalance(0);
    }
  };

  return (
    <Box className={classes.root}>
      {/* back button and title */}
      <Box display="flex" justifyContent="space-between" className={classes.backButtonContainer}>
        <Box className={classes.backBtn}>
          <BackButton purple />
        </Box>
        <Box className={classes.title}>
          <span>Swap on</span>
          <QuickSwapIcon className={classes.swapIcon} />
          Quickswap
        </Box>
      </Box>
      {/* swap box */}
      <Box className={classes.swapBox}>
        {/* from group */}
        <Box width={1} border="1px solid #eee" borderRadius="24px" p={3}>
          {/* firs row - name */}
          <Box className={classes.nameRow}>
            <Box>From</Box>
            <Box>Balance: {tokenFrom.balance}</Box>
          </Box>
          {/* second row - value */}
          <Box className={classes.valueRow}>
            <Box className={classes.inputBox}>
              <input
                placeholder="0.0"
                style={{
                  color: "#1A1B1C",
                  fontSize: isMobile ? "18px" : "24px",
                  maxWidth: isMobile ? "120px" : "200px",
                }}
                value={fromBalance}
                onChange={({ target: { value } }) => {
                  handleChangeFromBalance(value);
                }}
              />
            </Box>
            <Box display="flex" alignItems="center" color="#1A1B1C" fontFamily="Agrandir" fontSize={16}>
              {tokenFrom.symbol === "USDT" ? (
                <IconUSDC />
              ) : (
                <IconJOT collection={collection} classes={classes} />
              )}
              <span style={{ paddingLeft: "10px" }}>
                {tokenFrom.symbol === "USDT" ? "USDT" : collection?.JotSymbol}
              </span>
            </Box>
          </Box>
        </Box>
        {/* arrow down */}
        <Box display="flex" alignItems="center" justifyContent="center" py={2} onClick={handleSwapToken}>
          <ArrowDown />
        </Box>
        {/* to group */}
        <Box width={1} border="1px solid #eee" borderRadius="24px" p={3}>
          {/* firs row - name */}
          <Box className={classes.nameRow}>
            <Box>To</Box>
            <Box></Box>
          </Box>
          {/* second row - value */}
          <Box className={classes.valueRow}>
            <Box color="#C3C5CA">{toBalance}</Box>
            <Box display="flex" alignItems="center" color="#1A1B1C" fontFamily="Agrandir" fontSize={16}>
              {tokenTo.symbol === "USDT" ? (
                <IconUSDC />
              ) : (
                <IconJOT collection={collection} classes={classes} />
              )}
              <span style={{ paddingLeft: "15px" }}>
                {tokenTo.symbol === "USDT" ? "USDT" : collection?.JotSymbol}
              </span>
            </Box>
          </Box>
        </Box>
        {/* price row */}
        <Box
          color="#1A1B1C"
          fontWeight={500}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mx={2}
          mt={2}
        >
          <Box>Price</Box>
          <Box>
            1 {tokenFrom.symbol} = {tokenFrom.price / tokenTo.price}
            {tokenTo.symbol}
          </Box>
        </Box>
        {/* swap button */}
        <Box className={swapButtonName != "Swap" ? classes.disable : classes.swapBtn} onClick={handleSwap}>
          {swapButtonName}
        </Box>
      </Box>
    </Box>
  );
}

const ArrowDown = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.56503 1V9.54785M5.56503 9.54785L9.76462 5.34827M5.56503 9.54785L1.23828 5.34827"
      stroke="#575A68"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const IconUSDC = () => (
  <svg width="26" height="26" viewBox="0 0 30 29" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0)">
      <path
        d="M14.9545 28.8806C22.8188 28.8806 29.1941 22.5053 29.1941 14.641C29.1941 6.77667 22.8188 0.401367 14.9545 0.401367C7.09015 0.401367 0.714844 6.77667 0.714844 14.641C0.714844 22.5053 7.09015 28.8806 14.9545 28.8806Z"
        fill="#26A17B"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16.6636 15.8721V15.8703C16.5657 15.8774 16.0611 15.9077 14.9353 15.9077C14.0364 15.9077 13.4036 15.881 13.1811 15.8703V15.873C9.72092 15.7208 7.1382 15.1183 7.1382 14.3974C7.1382 13.6774 9.72092 13.0749 13.1811 12.92V15.2731C13.4072 15.2892 14.0551 15.3274 14.9504 15.3274C16.0246 15.3274 16.5631 15.2829 16.6636 15.274V12.9218C20.1167 13.0758 22.6932 13.6783 22.6932 14.3974C22.6932 15.1183 20.1167 15.719 16.6636 15.8721ZM16.6636 12.6771V10.5714H21.482V7.36035H8.36281V10.5714H13.1811V12.6762C9.26525 12.856 6.32031 13.632 6.32031 14.5612C6.32031 15.4903 9.26525 16.2655 13.1811 16.4461V23.1939H16.6636V16.4443C20.5733 16.2646 23.5111 15.4894 23.5111 14.5612C23.5111 13.6329 20.5733 12.8577 16.6636 12.6771Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="28.4793" height="28.4793" fill="white" transform="translate(0.714844 0.401367)" />
      </clipPath>
    </defs>
  </svg>
);
