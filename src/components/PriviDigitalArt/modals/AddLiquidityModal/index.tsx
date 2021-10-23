import React, { useEffect } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import Axios from "axios";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { BlockchainNets } from "shared/constants/constants";
import { toDecimals } from "shared/functions/web3";
import { switchNetwork } from "shared/functions/metamask";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { AddLiquidityModalStyles } from "./index.style";
import { PriceFeed_URL, PriceFeed_Token } from "shared/functions/getURL";
import {typeUnitValue} from "shared/helpers/utils";

const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

export default function AddLiquidityModal({ open, handleClose = () => {}, JotAddress, onConfirm }) {
  const classes = AddLiquidityModalStyles();
  const { account, library, chainId } = useWeb3React();

  const [liquidity, setLiquidity] = React.useState<number>(0);
  const [selectedChain, setSelectedChain] = React.useState<any>(filteredBlockchainNets[0]);
  const [jotsBalance, setJotsBalance] = React.useState<number>(0);
  const [maxJots, setMaxJots] = React.useState<number>(0);

  useEffect(() => {
    if (!open) return;

    if (selectedChain && chainId && selectedChain.chainId !== chainId) {
      (async () => {
        const changed = await switchNetwork(selectedChain.chainId);
        if (!changed) {
          setSelectedChain(filteredBlockchainNets.find(b => b.chainId === chainId));
        }
      })();
    }
  }, [chainId, selectedChain, open]);

  useEffect(() => {
    if (!open) return;

    (async () => {
      const web3APIHandler = selectedChain.apiHandler;
      const web3Config = selectedChain.config;
      const web3 = new Web3(library.provider);

      let promises: any = [];

      if (JotAddress) {
        promises = [
          Axios.get(`${PriceFeed_URL()}/quickswap/pair`, {
            headers: {
              Authorization: `Basic ${PriceFeed_Token()}`,
            },
            params: {
              token1: JotAddress.toLowerCase(),
              token0: web3Config["TOKEN_ADDRESSES"]["USDT"].toLowerCase(),
            },
          }),
          web3APIHandler.Erc20["JOT"].decimals(web3, JotAddress),
          web3APIHandler.Erc20["JOT"].balanceOf(web3, JotAddress, { account }),
          web3APIHandler.Erc20["USDT"].decimals(web3),
          web3APIHandler.Erc20["USDT"].balanceOf(web3, { account }),
        ];
      }

      const response: any = await Promise.all(promises);
      const data = response[0].data ?? {};

      if (data.success) {
        const JotPrice = +data.data?.[0]?.token1Price;
        if (JotPrice !== 0) {
          const usdt = parseInt(toDecimals(response[4], response[3]));

          setJotsBalance(Math.floor(usdt / JotPrice));
        }
      }

      if (JotAddress && response[2]) {
        const jots = parseInt(toDecimals(response[2], response[1]));
        setMaxJots(jots);
      }
    })();
  }, [open, selectedChain]);

  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.container}>
      <Box>
        <Box fontSize="24px" color="#431AB7">
          Add Liquidity
        </Box>
        <Box fontSize="14px" fontWeight="400" mt={1}>
          Add liquidity to the JOT pool and earn on that liquidity.
        </Box>
        <InputWithLabelAndTooltip
          inputValue={liquidity}
          onInputValueChange={e => setLiquidity(e.target.value)}
          overriedClasses={classes.inputLiquidity}
          required
          type="number"
          theme="light"
          minValue={1}
          endAdornment={<div className={classes.purpleText}>JOTs</div>}
        />
        <Box display="flex" alignItems="center" justifyContent="space-between" color="#431AB7">
          <Box display="flex" alignItems="center" gridColumnGap="10px" fontSize="14px">
            <span>Wallet Balance</span>
            <Box className={classes.usdWrap} display="flex" alignItems="center">
              <Box className={classes.point}></Box>
              <Box fontWeight="700">{typeUnitValue(jotsBalance, 1)} JOTs</Box>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" fontSize="16px">
            <span>
              MAX: <b>{typeUnitValue(maxJots, 1)}</b>
            </span>
            <Box paddingLeft="12px" style={{ cursor: "pointer" }} onClick={() => setLiquidity(Math.min(jotsBalance, maxJots))}>
              Add All
            </Box>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" mt={5}>
          <SecondaryButton
            size="medium"
            style={{ color: "#151414", maxWidth: "50px", border: "2px solid #9EACF2" }}
            onClick={handleClose}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            size="medium"
            style={{ background: "#D9F66F", color: "#431AB7", minWidth: "56%" }}
            onClick={() => onConfirm(liquidity)}
            disabled={liquidity > maxJots}
          >
            Confirm
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
}
