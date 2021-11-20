import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Axios from "axios";
import URL from "shared/functions/getURL";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { toDecimals, toNDecimals } from "shared/functions/web3";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import TransactionProgressModal from "../TransactionProgressModal";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { ReserveTokenSelect } from "shared/ui-kit/Select/ReserveTokenSelect";
import { MakeRentalOfferModalStyles } from "./index.style";
import { Grid } from "@material-ui/core";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { BlockchainNets } from "shared/constants/constants";

export default function MakeRentalOfferModal({ open, handleClose = () => {}, nftDetailData, onConfirm }) {
  const classes = MakeRentalOfferModalStyles();
  const { activate, account, library, chainId } = useWeb3React();
  // let data = ['1'];
  const [price, setPrice] = React.useState<number>(0);
  const [period, setPeriod] = React.useState<number>(0);
  const [collateral, setCollateral] = useState(0);

  const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");
  const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[0]);
  const [tokenList, setTokenList] = useState<any[]>([]);
  const [reservePriceToken, setReservePriceToken] = useState<any>();

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
      }
    });
  }, []);

  const handleConfirm = async () => {
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
      balance = toDecimals(balance, decimals);
      if (balance < (price || 0)) {
        showAlertMessage(`Insufficient balance to approve`, { variant: "error" });
        setTransactionSuccess(false);
        return;
      }
      const approved = await web3APIHandler.Erc20[reservePriceToken.Symbol].approve(
        web3,
        account!,
        web3Config.CONTRACT_ADDRESSES.RESERVE_MARKETPLACE,
        toNDecimals(price, reservePriceToken.Decimals)
      );
      if (!approved) {
        showAlertMessage(`Can't proceed to approve`, { variant: "error" });
        setTransactionSuccess(false);
        return;
      }
      const tokenId = nftDetailData.tokenId ? nftDetailData.tokenId : 1;
      const collection = nftDetailData.nftAddress;

      const response = await web3APIHandler.ReserveMarketplace.approveReserveToSell(
        web3,
        account!,
        {
          collection,
          tokenId,
          paymentToken: reservePriceToken.Address,
          price,
          collateralPercent: collateral,
          beneficiary: account,
          reservePeriod: period,
          buyerToMatch: "0x0000000000000000000000000000000000000000",
        },
        setHash
      );

      if (response.success) {
        setTransactionSuccess(true);

        // await createBlockingSaleOffer(response.offer)
        handleClose();
        onConfirm();
        //   handleRefresh();
      } else {
        setTransactionSuccess(false);
        showAlertMessage("Failed to make an offer", { variant: "error" });
      }
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
  const handleCloseModal = () => {
    handleClose();
  };

  return (
    <>
      <Modal
        size="medium"
        isOpen={open}
        onClose={handleCloseModal}
        showCloseIcon
        className={classes.container}
      >
        <Box style={{ padding: "25px" }}>
          <Box fontSize="24px" color="#431AB7">
            Edit Blocking Price
          </Box>
          <Grid container spacing={2}>
            <Grid item sm={7}>
              <Box className={classes.nameField}>Blocking Price</Box>
            </Grid>
            <Grid item sm={5}>
              <Box className={classes.nameField}>Token</Box>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item sm={7}>
              <InputWithLabelAndTooltip
                inputValue={price}
                onInputValueChange={e => setPrice(+e.target.value)}
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
            inputValue={period}
            onInputValueChange={e => setPeriod(+e.target.value)}
            overriedClasses={classes.inputJOT}
            required
            type="number"
            theme="light"
            minValue={0}
            endAdornment={<div className={classes.purpleText}>DAYS</div>}
          />
          <Box className={classes.nameField}>Collateral Required</Box>
          <InputWithLabelAndTooltip
            inputValue={collateral}
            onInputValueChange={e => setCollateral(+e.target.value)}
            overriedClasses={classes.inputJOT}
            required
            type="number"
            theme="light"
            minValue={0}
          />
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
            <SecondaryButton size="medium" className={classes.secondaryButton} onClick={handleCloseModal}>
              Cancel
            </SecondaryButton>
            <PrimaryButton size="medium" className={classes.primaryButton} onClick={handleConfirm}>
              Confirm Edits
            </PrimaryButton>
          </Box>
        </Box>
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
          network={selectedChain?.value.replace(" Chain", "") || ""}
        />
      )}
    </>
  );
}
