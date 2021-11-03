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
import { RemoveLiquidityQuickswapStyles } from "./index.style";
import { PriceFeed_URL, PriceFeed_Token } from "shared/functions/getURL";

const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

export default function RemoveLiquidityQuickswap({ open, handleClose = () => {}, JotAddress, usdtBalance, onConfirm, jotsBalance }) {
  const classes = RemoveLiquidityQuickswapStyles();
  const { account, library, chainId } = useWeb3React();

  const [jots, setJots] = React.useState<number>(0);
  const [inputUsdt, setInputUsdt] = React.useState<number>(0);
  const [selectedChain, setSelectedChain] = React.useState<any>(filteredBlockchainNets[0]);
  const [jotPrice, setJotPrice] = React.useState<number>(0);
  const [share, setShare] = React.useState<number>(0);
  const [usdt, setUsdt] = React.useState<number>(0);

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
          })
        ];
      }

      const response: any = await Promise.all(promises);
      const data = response[0].data ?? {};

      if (data.success) {
        const JotPrice = +data.data?.[0]?.token1Price;
        if (JotPrice !== 0) {
          setJotPrice(JotPrice);
        }
      }
    })();
  }, [open, selectedChain]);

  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.container}>
      <Box>
        <Box fontSize="24px" color="#431AB7">
          Remove Liquidity
        </Box>
        <Box fontSize="14px" fontWeight="400" mt={1}>
          Remove liquidity you provided to the Quickswap Pool by entering amount of share you would like to withdraw. 
        </Box>
        <InputWithLabelAndTooltip
          inputValue={share.toString()}
          onInputValueChange={e => {
            const input = +e.target.value; 
            setShare(input)
          }}
          overriedClasses={classes.inputLiquidity}
          required
          type="number"
          theme="light"
          minValue={1}
          endAdornment={<div className={classes.purpleText}>%SHARE</div>}
        />
        <Box mt={2} color="#431AB7" style={{ fontWeight: 700 }}>Liquidity amount to be removed</Box>
        <Box display="flex" flexDirection="column" mt={1} style={{
          background: "rgba(158, 172, 242, 0.2)",
          borderRadius: 12,
          padding: 20
        }}>
          <Box width="100%" display="flex" justifyContent="space-between" pb={2} style={{ borderBottom: "1px solid #431AB710" }}>
            <span style={{ color: "#431AB7" }}>USDT</span>
            <span className={classes.purpleText}>{usdt}</span>
          </Box>
          <Box width="100%" display="flex" justifyContent="space-between" pt={2}>
            <span style={{ color: "#431AB7" }}>JOTs</span>
            <span className={classes.purpleText}>{jots}</span>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" mt={5}>
          <SecondaryButton
            size="medium"
            style={{ color: "#151414", maxWidth: "50px", border: "2px solid #151414" }}
            onClick={handleClose}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            size="medium"
            style={{ background: "#D9F66F", color: "#431AB7", minWidth: "56%" }}
            onClick={() => onConfirm(jots)}
            disabled={inputUsdt > usdtBalance}
          >
            Confirm
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
}
