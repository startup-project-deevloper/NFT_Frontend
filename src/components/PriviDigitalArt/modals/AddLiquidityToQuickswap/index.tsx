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

export default function AddLiquidityOnQuickswap({ open, handleClose = () => {}, JotAddress, usdtBalance, onConfirm, jotsBalance }) {
  const classes = AddLiquidityModalStyles();
  const { account, library, chainId } = useWeb3React();

  const [jots, setJots] = React.useState<number>(0);
  const [inputUsdt, setInputUsdt] = React.useState<number>(0);
  const [selectedChain, setSelectedChain] = React.useState<any>(filteredBlockchainNets[0]);
  const [jotPrice, setJotPrice] = React.useState<number>(0);
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
    if (!open) {
      setInputUsdt(0);
    }
  }, [open])

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
          web3APIHandler.Erc20["USDT"].balanceOf(web3, { account }),
        ];
      }

      const response: any = await Promise.all(promises);
      const data = response[0].data ?? {};
      setUsdt(+response[1])

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
          Add Liquidity to Quickswap
        </Box>
        <Box fontSize="14px" fontWeight="400" mt={1}>
          Add  liquidity to Quicswap Pool to gain share in that pool and increase your revenue
        </Box>
        <InputWithLabelAndTooltip
          inputValue={inputUsdt.toString()}
          onInputValueChange={e => {
            const input = +e.target.value; 
            setInputUsdt(input)
            setJots(jotPrice ? input / jotPrice : 0)
          }}
          overriedClasses={classes.inputLiquidity}
          required
          type="number"
          theme="light"
          minValue={1}
          endAdornment={<div className={classes.purpleText}>USDT</div>}
        />
        <Box display="flex" alignItems="center" justifyContent="space-between" color="#431AB7">
          <Box display="flex" alignItems="center" gridColumnGap="10px" fontSize="14px">
            <span>USDT Balance</span>
            <Box className={classes.usdWrap} display="flex" alignItems="center">
              <Box className={classes.point}></Box>
              <Box fontWeight="700">{typeUnitValue(usdtBalance, 2)} USDT</Box>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" fontSize="16px">
            <Box paddingLeft="12px" style={{ cursor: "pointer" }} onClick={() => {
                setInputUsdt(usdtBalance);
                setJots(jotPrice ? usdtBalance / jotPrice : 0);
              }}>
              Max
            </Box>
          </Box>
        </Box>
        <Box mt={4} color="#431AB7" style={{ fontWeight: 700 }}>Amount of JOTs needed</Box>
        <Box display="flex" alignItems="center" my={1} justifyContent="space-between" style={{
          background: "rgba(158, 172, 242, 0.2)",
          borderRadius: 12,
          padding: 20
        }}>
          <span style={{ color: "#431AB7" }}>JOTs</span>
          <span className={classes.purpleText}>{jots}</span>
        </Box>
        <Box color="#431AB7">JOT Balance <span style={{ fontWeight: 700 }}>{ jotsBalance } JOTs</span></Box>
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
            onClick={() => onConfirm(inputUsdt)}
            disabled={inputUsdt > usdtBalance}
          >
            Confirm
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
}
