import React, { useEffect } from "react";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { useMediaQuery, useTheme } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { Modal, PrimaryButton } from "shared/ui-kit";
import URL from "shared/functions/getURL";
import { EditSellingPriceModalStyles } from "./index.style";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";
import { toDecimals, toNDecimals } from "shared/functions/web3";
import TransactionProgressModal from "../TransactionProgressModal";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
// import { createSalesSongOffer, deleteSalesSongOffer } from "shared/services/API/PodAPI";
import { ReserveTokenSelect } from "shared/ui-kit/Select/ReserveTokenSelect";

const EditPriceModal = ({ open, handleClose, nftDetailData, onConfirm }) => {
  const classes = EditSellingPriceModalStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));
  const [token, setToken] = React.useState<any>();
  const [tokens, setTokens] = React.useState<any[]>([]);
  const [inputBalance, setInputBalance] = React.useState<string>('');
  const { account, library, chainId } = useWeb3React();
  const [openTranactionModal, setOpenTransactionModal] = React.useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = React.useState<boolean | null>(null);
  const [isApproved, setIsApproved] = React.useState<boolean>(false);
  const [hash, setHash] = React.useState<string>('');
  const [step, setStep] = React.useState<number>(0);
  const { showAlertMessage } = useAlertMessage();

  const getTokenName = (addr) => {
    if (tokens.length == 0)
      return '';
    let token = tokens.find(token => token.Address === addr)
    if (token)
      return token.Symbol
    return '';
  }

  const getTokenPrice = (price, addr) => {
    if (tokens.length == 0)
      return 0;
    let token = tokens.find(token => token.Address === addr)
    if (token)
      return price / (10 ** token.Decimals)
    return 0;
  }

  React.useEffect(() => {
    axios.get(`${URL()}/token/getAllTokenInfos`).then(res => {
      const resp = res.data;
      console.log(resp)
      if (resp.success) {
        setTokens(resp.tokens); // update token list
        setToken(resp.tokens[0]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async () => {
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
      let balance = await web3APIHandler.Erc20[token.Symbol].balanceOf(web3, { account });
      let decimals = await web3APIHandler.Erc20[token.Symbol].decimals(web3, { account });
      balance = balance / Math.pow(10, decimals);
      if (balance < (inputBalance || 0)) {
        showAlertMessage(`Insufficient balance to approve`, { variant: "error" });
        setTransactionSuccess(false);
        return;
      }
      const approved = await web3APIHandler.Erc20[token.Symbol].approve(web3, account!, web3Config.CONTRACT_ADDRESSES.OPEN_SALES_MANAGER, toNDecimals(inputBalance, token.Decimals));
      if (!approved) {
        showAlertMessage(`Can't proceed to approve`, { variant: "error" });
        setTransactionSuccess(false);
        return;
      }
      setIsApproved(true);
      showAlertMessage(`Successfully approved ${inputBalance} ${token.Symbol}!`, {
        variant: "success",
      });
      setTransactionSuccess(null);
      setOpenTransactionModal(false);
    } catch (error) {
      console.log(error);
      showAlertMessage("Something went wrong. Please try again!", {
        variant: "error",
      });
    } finally {
    }

  }

  const handleConfirm = async () => {
    setOpenTransactionModal(true);
    const targetChain = BlockchainNets.find(net => net.value === "Polygon Chain");
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Got failed while switching over to target network", { variant: "error" });
        return;
      }
    }
    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);
    const tokenId = nftDetailData.tokenId ? nftDetailData.tokenId : 1;

    const response = await web3APIHandler.openSalesManager.cancelSaleProposal(
      web3,
      account!,
      {
        collection: nftDetailData.nftAddress,
        tokenId,
        paymentToken: nftDetailData.sellingOffer.PaymentToken,
        price: Number(nftDetailData.sellingOffer.Price),
        owner: account,
      },
      setHash
    );

    if (response.success) {
      setTransactionSuccess(true);
      // await deleteSalesSongOffer({
      //   songId: nftDetailData.Id,
      //   offerId: nftDetailData.offerId
      // });
      setOpenTransactionModal(false)
      setTransactionSuccess(null);
      setHash('')
      setStep(1);
      //   handleRefresh();
    } else {
      setTransactionSuccess(false);
      showAlertMessage("Failed to edit price of offer", { variant: "error" });
    }
  };

  const handleSetSalePrice = async () => {
    setOpenTransactionModal(true);
    const targetChain = BlockchainNets.find(net => net.value === "Polygon Chain");
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Got failed while switching over to target network", { variant: "error" });
        return;
      }
    }
    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);
    const tokenId = nftDetailData.tokenId ? nftDetailData.tokenId : 1;

    const response = await web3APIHandler.openSalesManager.approveSale(
      web3,
      account!,
      {
        collection: nftDetailData.nftAddress,
        tokenId,
        paymentToken: token.Address,
        price: toNDecimals(inputBalance, token.Decimals),
        beneficiary: account,
        buyerToMatch: "0x0000000000000000000000000000000000000000"
      },
      setHash
    );

    if (response.success) {
      setTransactionSuccess(true);
      const offerId = web3.utils.keccak256(
        web3.eth.abi.encodeParameters(
          ["address", "uint256", "address", "uint256", "address"],
          [nftDetailData.nftAddress, tokenId, token.Address, toNDecimals(inputBalance, token.Decimals), account]
        )
      );

      // await createSalesSongOffer({
      //   songId: nftDetailData.Id,
      //   offerId,
      //   Collection: nftDetailData.nftAddress,
      //   Price: toNDecimals(inputBalance, token.Decimals),
      //   PaymentToken: token.Address,
      //   Beneficiary: account,
      // });
      handleClose();
      onConfirm();
      //   handleRefresh();
    } else {
      setTransactionSuccess(false);
      showAlertMessage("Failed to edit a selling offer", { variant: "error" });
    }
  };

  return (
    step == 0 ? (
      <Modal size="daoMedium" isOpen={open} onClose={handleClose} showCloseIcon>
        <div className={classes.content}>
          <div className={classes.typo1}>Are you sure you want to edit price? </div>
          <div className={classes.typo2}>This process will require changes through smart contract that will take few moments. </div>
          <Box width={1} display="flex" justifyContent="center" marginTop="31px">
            <PrimaryButton
              size="medium"
              isRounded
              style={{ width: 250, height: 53, background: "#54658F", marginTop: 52 }}
              onClick={() => { handleClose() }}
            >
              Cancel
            </PrimaryButton>
            <PrimaryButton
              size="medium"
              isRounded
              style={{ width: 250, height: 53, background: "#F43E5F", marginTop: 52 }}
              onClick={handleConfirm}
            >
              Yes, Edit price
            </PrimaryButton>
          </Box>
        </div>
        <TransactionProgressModal
          open={openTranactionModal}
          onClose={() => {
            setHash("");
            setTransactionSuccess(null);
            setOpenTransactionModal(false);
          }}
          txSuccess={transactionSuccess}
          hash={hash}
        />
      </Modal>
    )
      :
      (
        <Modal size="daoMedium" isOpen={open} onClose={handleClose} showCloseIcon>
          <div className={classes.content}>
            <div className={classes.typo1}>Set new Buy Now price</div>
            <div className={classes.priceContainer}>
              <div className={classes.typo4}>CURRENT PRICE</div>
              <Box display="flex" justifyContent="center" marginTop="13px">
                <span className={classes.typo5}>{getTokenPrice(nftDetailData?.sellingOffer.Price, nftDetailData?.sellingOffer.PaymentToken)}</span>
                <span className={classes.typo6}>{getTokenName(nftDetailData?.sellingOffer.PaymentToken)}</span>
              </Box>
            </div>
            <div className={classes.typo2}>Set new price</div>
            <Box display="flex" alignItems="center" my={1}>
              <ReserveTokenSelect
                tokens={tokens}
                value={token?.Address || ""}
                className={classes.tokenSelect}
                onChange={e => {
                  setToken(tokens.find(v => v.Address === e.target.value));
                }}
                style={{ flex: "1" }}
              />
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                className={classes.tokenValue}
                ml={1.5}
                style={{ flex: "2" }}
              >
                <input style={{ maxWidth: 80 }} onChange={(e) => { setInputBalance(e.target.value) }} value={inputBalance} disabled={isApproved} />
              </Box>
            </Box>
            <Box width={1} display="flex" justifyContent="center">
              <PrimaryButton
                size="medium"
                isRounded
                style={{ width: 250, height: 53, background: "#65CB63", marginTop: 52 }}
                onClick={handleApprove}
                disabled={isApproved || !inputBalance}
              >
                {isApproved ? 'Approved' : 'Approve'}
              </PrimaryButton>
              <PrimaryButton
                size="medium"
                isRounded
                style={{ width: 250, height: 53, background: "#65CB63", marginTop: 52 }}
                onClick={handleSetSalePrice}
                disabled={!isApproved || !inputBalance}
              >
                Confirm Change
              </PrimaryButton>
            </Box>
          </div>
          <TransactionProgressModal
            open={openTranactionModal}
            onClose={() => {
              setHash("");
              setTransactionSuccess(null);
              setOpenTransactionModal(false);
            }}
            txSuccess={transactionSuccess}
            hash={hash}
          />
        </Modal>
      )
  );
};

export default EditPriceModal;
