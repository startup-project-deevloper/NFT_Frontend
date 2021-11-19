import React, { useState, useEffect } from "react";
import { Color, Modal, PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { SellingProposalModalStyles } from "./index.styles";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { useTypedSelector } from "store/reducers/Reducer";
import { ListItem, Select } from "@material-ui/core";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import { priviPodCreateSellingProposal } from "shared/services/API";
import { BlockchainNets } from "shared/constants/constants";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { switchNetwork } from "shared/functions/metamask";
import { toDecimals, toNDecimals } from "shared/functions/web3";
import TransactionProgressModal from "../TransactionProgressModal";
import getPhotoIPFS from "shared/functions/getPhotoIPFS";
import useIPFS from "shared/utils-IPFS/useIPFS";

export const SellingProposalModal = (props: any) => {
  const { open, handleClose, handleRefresh, pod, podInfo } = props;
  const classes = SellingProposalModalStyles();
  const userSelector = useTypedSelector(state => state.user);

  const { showAlertMessage } = useAlertMessage();

  const [songNFTs, setSongNfts] = React.useState<any[]>([]);

  const [step, setStep] = useState<number>(0);
  const [nft, setNFT] = useState<string>();

  const [amount, setAmount] = useState<number>(0);

  const { account, library, chainId } = useWeb3React();
  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTransactionModal, setOpenTransactionModal] = useState<boolean>(false);

  const { downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    if (!pod || !pod.Medias) return;
    (async () => {
      const data = pod.Medias.filter(item => (item.tokenId && !item.status ? true : false));
      const promises = data.map(async item => {
        const image = await getPhotoIPFS(
          item.metadataPhoto.newFileCID,
          item.metadataPhoto.metadata.properties.name,
          downloadWithNonDecryption
        );
        return {
          ...item,
          image,
        };
      });
      const nfts = await Promise.all(promises);
      setSongNfts(nfts);
    })();
  }, [pod]);

  const handleSubmit = async () => {
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
    const web3Config = targetChain.config;
    const web3 = new Web3(library.provider);

    const stableDecimals = await web3APIHandler.Erc20["USDT"].decimals(web3);
    const calldata = web3.eth.abi.encodeFunctionCall(
      {
        name: "approveSale",
        type: "function",
        inputs: [
          {
            type: "uint256",
            name: "tokenId",
          },
          {
            type: "uint256",
            name: "price",
          },
          {
            type: "uint256",
            name: "paymentToken",
          },
        ],
      },
      [nft, toNDecimals(amount, stableDecimals), web3Config.TOKEN_ADDRESSES.USDT]
    );

    const response = await web3APIHandler.StakingGovernance.propose(
      web3,
      account!,
      {
        contractAddress: podInfo.stakingGovernance,
        targets: [podInfo.distributionManagerAddress],
        values: [0],
        calldatas: [calldata],
        description: "Proposal #1: Make this token sellable",
      },
      setHash
    );

    if (response.success) {
      setTransactionSuccess(true);

      const decimals = await web3APIHandler.Erc20["COPYRIGHT"].decimals(web3, podInfo.copyrightToken);
      const blockNumber = await web3APIHandler.StakingGovernance.proposalSnapshot(web3, {
        contractAddress: podInfo.stakingGovernance,
        proposalId: response.data.proposalId,
      });
      const supply = await web3APIHandler.StakingERC721.getPastTotalSupply(web3, {
        contractAddress: podInfo.stakingERC721,
        blockNumber,
      });

      await priviPodCreateSellingProposal({
        podId: pod.Id,
        mediaId: nft,
        amount,
        proposalId: response.data.proposalId,
        description: response.data.description,
        totalSupply: +toDecimals(supply, decimals),
        expireAt: Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
        hash: response.data.hash,
        type: "PIX",
      });
      handleRefresh();
    } else {
      setTransactionSuccess(false);
      showAlertMessage("Failed to stake tokens", { variant: "error" });
    }
    setStep(prev => prev + 1);
  };

  const onClose = () => {
    setStep(0);
    handleClose();
  };

  const firstScreen = () => (
    <Box py={3}>
      <img src={require("assets/emojiIcons/handshake.png")} />
      <Box className={classes.header1} mt={2}>
        Selling Proposal
      </Box>
      <Box className={classes.header2} mt={2} mb={4} color={Color.MusicDAOLightBlue} style={{ opacity: 0.9 }}>
        Send sell proposal to all collaborators to be able to monetize your Song NFT.
      </Box>
      <PrimaryButton
        size="medium"
        onClick={() => setStep(prev => prev + 1)}
        isRounded
        style={{ width: "50%", background: Color.MusicDAODark }}
      >
        Next
      </PrimaryButton>
    </Box>
  );

  const secondScreen = () => (
    <Box py={1}>
      <Box className={classes.header3}>Selling Proposal</Box>
      <Box display="flex" flexDirection="column" alignItems="flex-start" mt={3} mb={5} width={1}>
        <Box className={classes.header4} mb={1}>
          Select NFT
        </Box>
        <Select
          className={`${classes.item} ${classes.nft}`}
          MenuProps={{ classes: { paper: classes.popover } }}
          value={nft}
          onChange={(e: any) => setNFT(e.target.value)}
        >
          {songNFTs &&
            songNFTs.map((nft, index) => (
              <ListItem value={nft.tokenId} key={`list-nft-${index}`}>
                <Box display="flex" alignItems="center" width={1}>
                  <Box flex={2} display="flex" alignItems="center">
                    <img className={classes.image} src={nft.image} alt="avatar" />
                    <Box ml={1} className={classes.listText}>
                      {nft.Title}
                    </Box>
                  </Box>
                  <Box flex={1}>
                    <Box className={classes.selectText}>Select</Box>
                  </Box>
                </Box>
              </ListItem>
            ))}
        </Select>
        <Box className={classes.header4} mt={2} mb={1}>
          Selling Price
        </Box>
        <Box className={`${classes.item} ${classes.price}`}>
          <input value={amount} onChange={e => setAmount(Number(e.target.value))} />
          <Box className={classes.listText}>USDT</Box>
        </Box>
      </Box>
      <PrimaryButton
        size="medium"
        onClick={handleSubmit}
        disabled={!nft || !amount}
        isRounded
        style={{ width: "50%", background: Color.MusicDAODark }}
      >
        Submit Proposal
      </PrimaryButton>
    </Box>
  );

  const thirdScreen = () => (
    <Box py={1}>
      <img src={require("assets/emojiIcons/sign_lock.png")} />
      <Box className={classes.header1} mt={2}>
        Selling Request Sent
      </Box>
      <Box className={classes.header2} my={2} color={Color.MusicDAOLightBlue} style={{ opacity: 0.9 }}>
        We have sent a notification to the artists to review your funds distribution proposal.
      </Box>
      <Box className={classes.header2} mb={4} color={Color.MusicDAOLightBlue} style={{ opacity: 0.9 }}>
        We’ll keep you posted on the status of this transaction.
      </Box>
      <PrimaryButton
        size="medium"
        isRounded
        style={{ width: "50%", background: Color.MusicDAODark }}
        onClick={onClose}
      >
        View Proposal on Pod
      </PrimaryButton>
    </Box>
  );

  return (
    <>
      {openTransactionModal ? (
        <TransactionProgressModal
          open={openTransactionModal}
          onClose={() => {
            setHash("");
            setTransactionSuccess(null);
            setOpenTransactionModal(false);
          }}
          txSuccess={transactionSuccess}
          hash={hash}
        />
      ) : (
        <Modal size="small" isOpen={open} onClose={handleClose} showCloseIcon className={classes.root}>
          {step === 0 ? firstScreen() : step === 1 ? secondScreen() : thirdScreen()}
        </Modal>
      )}
    </>
  );
};
