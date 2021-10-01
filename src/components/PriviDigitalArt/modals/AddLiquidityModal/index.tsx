import React, { useEffect } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { BlockchainNets } from "shared/constants/constants";
import { toDecimals } from "shared/functions/web3";
import { switchNetwork } from "shared/functions/metamask";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { AddLiquidityModalStyles } from "./index.style";

const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

export default function AddLiquidityModal({ open, handleClose = () => {}, JotAddress, onConfirm }) {
  const classes = AddLiquidityModalStyles();
  const { account, library, chainId } = useWeb3React();

  const [liquidity, setLiquidity] = React.useState<number>(0);
  const [usdtBalance, setUsdtBalance] = React.useState<number>(0);
  const [selectedChain, setSelectedChain] = React.useState<any>(filteredBlockchainNets[0]);
  const [jotsBalance, setJotsBalance] = React.useState<number>(0);

  useEffect(() => {
    if (selectedChain && chainId && selectedChain.chainId !== chainId) {
      (async () => {
        const changed = await switchNetwork(selectedChain.chainId);
        if (!changed) {
          setSelectedChain(filteredBlockchainNets.find(b => b.chainId === chainId));
        }
      })();
    }
  }, [chainId, selectedChain]);

  useEffect(() => {
    if (!open) return;

    (async () => {
      const web3APIHandler = selectedChain.apiHandler;
      const web3 = new Web3(library.provider);
      let promises = [
        web3APIHandler.Erc20["USDT"].decimals(web3),
        web3APIHandler.Erc20["USDT"].balanceOf(web3, { account }),
      ];

      if (JotAddress) {
        promises = promises.concat([
          web3APIHandler.Erc20["JOT"].decimals(web3, JotAddress),
          web3APIHandler.Erc20["JOT"].balanceOf(web3, JotAddress, { account }),
        ]);
      }

      const response = await Promise.all(promises);

      if (response[1]) {
        const usdt = parseInt(toDecimals(response[1], response[0]));
        setUsdtBalance(usdt);
      }

      if (JotAddress && response[3]) {
        const jots = parseInt(toDecimals(response[3], response[2]));
        setJotsBalance(jots);
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
          endAdornment={<div className={classes.purpleText}>JOTS</div>}
        />
        <Box display="flex" alignItems="center" justifyContent="space-between" color="#431AB7">
          <Box display="flex" alignItems="center" gridColumnGap="10px" fontSize="14px">
            <span>Wallet Balance</span>
            <Box className={classes.usdWrap} display="flex" alignItems="center">
              <Box className={classes.point}></Box>
              <Box fontWeight="700">{usdtBalance} USDT</Box>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" fontSize="16px">
            <span>
              MAX: <b>{jotsBalance}</b>
            </span>
            <Box paddingLeft="12px" style={{ cursor: "pointer" }} onClick={() => setLiquidity(jotsBalance)}>
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
          >
            Confirm
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
}
