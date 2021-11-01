import React, { useEffect } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import Axios from "axios";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { RedeemJotsModalStyles } from "./index.style";
import {typeUnitValue} from "shared/helpers/utils";
import { PriceFeed_URL, PriceFeed_Token } from "shared/functions/getURL";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import TransactionResultModal, { CopyIcon } from "../TransactionResultModal";
import CopyToClipboard from "react-copy-to-clipboard";

const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");
export default function RedeemJotsModal({ open, handleClose = () => {}, collection, jotsBalance }) {
  const classes = RedeemJotsModalStyles();
  const { account, library, chainId } = useWeb3React();

  const [jot, setJot] = React.useState<number>(0);
  const [receive, setReceive] = React.useState<number>(0);
  const [maxJots, setMaxJots] = React.useState<number>(0);
  const [selectedChain, setSelectedChain] = React.useState<any>(filteredBlockchainNets[0]);
  const [jotPrice, setJotPrice] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [hash, setHash] = React.useState<string>("");
  const [openTranactionModal, setOpenTranactionModal] = React.useState<boolean>(false);
  const [tnxSuccess, setTnxSuccess] = React.useState<boolean>(false);

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
      const web3Config = selectedChain.config;
      const web3APIHandler = selectedChain.apiHandler;
      const web3 = new Web3(library.provider);
      const { JotAddress } = collection;

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
      const data = response[0]?.data ?? {};

      if (data.success) {
        const JotPrice = +data.data?.[0]?.token1Price;
        if (JotPrice !== 0) {
          setJotPrice(JotPrice);
        }
      }
    })();
  }, [open, selectedChain]);

  const handleCheck = () => {
    window.open(`https://mumbai.polygonscan.com/tx/${hash}`, "_blank");
  }

  const handleConfirm = async () => {
    const web3APIHandler = selectedChain.apiHandler;
    const web3 = new Web3(library.provider);

    const contractResponse = await web3APIHandler.RedemptionPool.redeem(
      web3,
      account!,
      collection,
      {
        amount: +jot,
        setHash
      }
    );
  }

  return (
    <LoadingScreen
      loading={loading}
      title={`Transaction \nin progress`}
      SubTitleRender={() => (
        <>
          <span>Transaction is proceeding on Polygon Chain.</span>
          <br />
          <span>This can take a moment, please be patient...</span>
          {hash && (
            <CopyToClipboard text={hash}>
              <Box
                mt="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                className={classes.hash}
              >
                Hash:
                <Box color="#4218B5" mr={1} ml={1}>
                  {hash.substr(0, 18) + "..." + hash.substr(hash.length - 3, 3)}
                </Box>
                <CopyIcon />
              </Box>
            </CopyToClipboard>
          )}

          {hash && (
            <button className={classes.buttonCheck} onClick={handleCheck}>
              Check on Polygon Scan
            </button>
          )}
        </>
      )}
      handleClose={handleClose}
    >
      <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.container}>
        <Box>
          <Box fontSize="24px" color="#431AB7">
            Redeem JOTs for USDT
          </Box>
          <InputWithLabelAndTooltip
            inputValue={jot.toString()}
            onInputValueChange={e => setJot(+e.target.value)}
            overriedClasses={classes.inputJOT}
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
            </Box>
          </Box>
          <Box className={classes.receiveContainer}>
            <span>You'll receive</span>
            <Box className={classes.usdt}>{jot * jotPrice} USDT</Box>
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
              onClick={() => handleConfirm()}
            >
              Confirm
            </PrimaryButton>
          </Box>
        </Box>
        <TransactionResultModal
          open={openTranactionModal}
          onClose={() => {
            setHash("");
            setOpenTranactionModal(false);
            handleClose();
          }}
          isSuccess={tnxSuccess}
          hash={hash}
        />
      </Modal>
    </LoadingScreen>
  );
}
