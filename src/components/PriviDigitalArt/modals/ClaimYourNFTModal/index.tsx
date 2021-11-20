import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { ClaimYourNFTModalStyles } from "./index.style";
import { typeUnitValue } from "shared/helpers/utils";
import { Grid } from "@material-ui/core";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { BlockchainNets } from "shared/constants/constants";

import ExploreCard from "components/PriviDigitalArt/components/Cards/ExploreCard";
import ProcessingPaymentModal from "components/PriviDigitalArt/modals/ProcessingPaymentModal";

export default function ClaimYourNFTModal({ open, claimType, handleClose = () => {}, onConfirm, img_url }) {
  const classes = ClaimYourNFTModalStyles();
  const { account, library, chainId } = useWeb3React();

  const [usdt, setUsdt] = React.useState<number>(0);
  const [soldDays, setSoldDays] = React.useState<number>(0);
  const [disappearDays, setDisappearDays] = React.useState<number>(0);
  const [collateral, setCollateral] = React.useState<number>(0);
  const [usdtBalance, setUsdtBalance] = React.useState<number>(0);

  const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");
  const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[0]);
  const [tokenList, setTokenList] = useState<string[]>(Object.keys(selectedChain.config.TOKEN_ADDRESSES));
  const [reservePriceToken, setReservePriceToken] = useState<string>("ETH");
  const [confirmSuccess, setConfirmSuccess] = useState(false);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [hash, setHash] = useState<string>("0xf273a38fec99acf1e....eba");

  useEffect(() => {
    setTokenList(Object.keys(selectedChain.config.TOKEN_ADDRESSES));
    setReservePriceToken(Object.keys(selectedChain.config.TOKEN_ADDRESSES)[0]);
  }, [selectedChain]);

  useEffect(() => {
    if (!open) {
      setOpenTransactionModal(false);
    }
  }, [open]);

  const handleAddToken = () => {};

  const handleConfirm = () => {
    setOpenTransactionModal(true);
  };

  const nft = {
    imageUrl: img_url,
    name: "test1",
    ownerAddress: "0x7Fa11671e546dB93f558531c1e3bC5D4FFed29a5",
    sellingPrice: 10,
    blockingPrice: 1,
    blockingPeriod: 90,
    rentalPrice: 0.1,
    rentalPriceCycle: "Day",
    type: "LISTED",
  };

  return openTranactionModal ? (
    <ProcessingPaymentModal
      open={openTranactionModal}
      onClose={() => {
        setOpenTransactionModal(false);
      }}
      txSuccess={transactionSuccess}
      hash={hash}
    />
  ) : (
    <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.container}>
      <Box className={classes.card}>
        <ExploreCard nft={nft} />
        {transactionSuccess && (
          <Box className={classes.checkMark}>
            <img src={require("assets/icons/check.svg")} alt="check" />
          </Box>
        )}
      </Box>
      <div className={classes.title}>Claim your Collateral & NFT</div>
      <div className={classes.description}>
        {transactionSuccess
          ? `Congrats, you’ve succesfully ${claimType}ed your NFT [NFT Name] and Collateral. here is summary`
          : `Congrats, you can claim your ${claimType}ed NFT [ NFT name] at [Price]`}
      </div>
      <Box className={classes.infoPanel}>
        <span className={classes.infoLabel}>Collateral to claim</span>
        <Box className={classes.infoValueRow}>
          <span className={classes.infoValue}>2455 USDT</span>
          <div className={classes.divider} />
          <span className={classes.infoValue}>2455 DAI</span>
          <div className={classes.divider} />
          <span className={classes.infoValue}>2455 SHIB</span>
        </Box>
      </Box>
      <PrimaryButton size="medium" onClick={handleConfirm} className={classes.confirmButton}>
        Confirm Claim
      </PrimaryButton>
    </Modal>
  );
}
