import React, { useEffect } from "react";
import axios from "axios";

import { useMediaQuery, useTheme } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import URL from "shared/functions/getURL";
import { modalStyles } from "./index.styles";
import { ReserveTokenSelect } from "shared/ui-kit/Select/ReserveTokenSelect";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { BlockchainNets } from "shared/constants/constants";
import { toDecimals, toNDecimals } from "shared/functions/web3";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import TransactionProgressModal from "../../../../../../Privi-Trax/src/components/PriviMusicDao/modals/TransactionProgressModal";
// import { createSalesSongOffer } from "shared/services/API/PodAPI";

const EditPriceModal = ({open, handleClose, nftDetailData, onConfirm}) => {
  const classes = modalStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));

  const [token, setToken] = React.useState<any>();
  const [tokens, setTokens] = React.useState<any[]>([]);
  const [inputBalance, setInputBalance] = React.useState<string>('');
  const [openTranactionModal, setOpenTransactionModal] = React.useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = React.useState<boolean | null>(null);
  const [isApproved, setIsApproved] = React.useState<boolean>(false);
  const [hash, setHash] = React.useState<string>('');
  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();

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
      let approved = await web3APIHandler.Erc721.approve(web3, account || '', { to: web3Config.CONTRACT_ADDRESSES.OPEN_SALES_MANAGER, tokenId: nftDetailData.tokenId, nftAddress: nftDetailData.nftAddress});
      if (!approved) {
        showAlertMessage(`Can't proceed to approve`, { variant: "error" });
        setTransactionSuccess(false);
        return;
      }
      setIsApproved(true);
      showAlertMessage(`Successfully approved your nft!`, {
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
      onClose();
      onConfirm();
      //   handleRefresh();
    } else {
      setTransactionSuccess(false);
      showAlertMessage("Failed to make a selling offer", { variant: "error" });
    }
  };

  return (
    <Modal size="daoMedium" isOpen={open} onClose={onClose} showCloseIcon>
      <div className={classes.content}>
        <div className={classes.typo1}>Set NFT Sale Price</div>
        <div className={classes.typo2}>Set new price</div>
        <Box display="flex" alignItems="center" my={1}>
          <ReserveTokenSelect
            tokens={tokens}
            value={token?.Address || ''}
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
            onClick={() => { handleConfirm() }}
            disabled={!isApproved || !inputBalance}
          >
            Confirm
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
  );
};

export default EditPriceModal;
