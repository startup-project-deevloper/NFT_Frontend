import { useWeb3React } from "@web3-react/core";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import Web3 from "web3";
import ProposalDetailModal from "components/PriviDigitalArt/modals/ProposalDetailModal";
import React, { useState } from "react";
import { BlockchainNets } from "shared/constants/constants";
import { Color, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Avatar from "shared/ui-kit/Avatar";
import Box from "shared/ui-kit/Box";
import { FundCardStyles } from "./index.styles";
import { useSelector } from "react-redux";
import { priviPodVoteForPodProposal, priviPodExecutePod } from "shared/services/API";
import { RootState } from "store/reducers/Reducer";
import TransactionProgressModal from "../../../modals/TransactionProgressModal";

export const FundCard = props => {
  const { podId, proposal, pod, handleRefresh } = props;

  const classes = FundCardStyles();
  const [openDetailModal, setOpenDetailModal] = React.useState<boolean>(false);
  const userSelector = useSelector((state: RootState) => state.user);

  const { account, library } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();
  const creator = pod.CreatorsData.find(creator => creator.id === proposal.Proposer);

  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);

  const handleAccept = async () => {
    setOpenTransactionModal(true);

    const web3APIHandler = BlockchainNets[1].apiHandler;
    const web3 = new Web3(library.provider);

    const voteContractResponse = await web3APIHandler.PodManager.voteForPodProposal(
      web3,
      account!,
      {
        id: parseInt(proposal.Id),
      },
      setHash
    );

    if (!voteContractResponse.success) {
      showAlertMessage("Failed to accept the proposal", { variant: "error" });
      setTransactionSuccess(false);
      return;
    }

    setTransactionSuccess(true);

    const voteAPIresponse = await priviPodVoteForPodProposal({
      podId,
      id: proposal.Id,
      voter: userSelector.id,
      status: true,
    });

    if (!voteAPIresponse.success) {
      showAlertMessage("Failed to accept the proposal", { variant: "error" });
      setOpenDetailModal(false);
      return;
    }

    showAlertMessage("Accepted the proposal successfully", { variant: "success" });
    setOpenDetailModal(false);

    if (!voteAPIresponse.data.accepted) {
      return;
    }

    // TODO: Send notification to all collabs

    showAlertMessage("The Proposal has been accepted.", { variant: "success" });

    handleExecute();
  };

  const handleExecute = async () => {
    setOpenTransactionModal(true);

    const web3APIHandler = BlockchainNets[1].apiHandler;
    const web3 = new Web3(library.provider);

    const executeContractResponse = await web3APIHandler.PodManager.executePodProposal(
      web3,
      account!,
      {
        id: parseInt(proposal.Id),
      },
      setHash
    );

    if (!executeContractResponse) {
      showAlertMessage("Failed to execute the proposal. Trying again now. Please wait.", {
        variant: "error",
      });
      setTransactionSuccess(false);

      return;
    }

    setTransactionSuccess(true);

    const podAddress = executeContractResponse.data.podAddress;

    await priviPodExecutePod({
      podId,
      podAddress,
      podType: 'PIX'
    });

    showAlertMessage("The Proposal has been executed.", { variant: "success" });
    handleRefresh();
  };

  const handleDecline = async () => {
    const response = await priviPodVoteForPodProposal({
      podId,
      id: proposal.Id,
      voter: userSelector.id,
      status: false,
    });

    if (response.success) {
      showAlertMessage("Declined the proposal successfully", { variant: "success" });
      setOpenDetailModal(false);
      handleRefresh();
    } else {
      showAlertMessage("Failed to declined the proposal", { variant: "error" });
      setOpenDetailModal(false);
    }
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.flexBox} style={{ borderBottom: "1px dashed #18181822" }} pb={2}>
        <PrimaryButton size="small" style={{ background: Color.MusicDAOGreen }}>
          Withdraw
        </PrimaryButton>
        <Box display="flex" alignItems="center">
          <Box className={classes.header1} mr={1}>
            Pending
          </Box>
          <PendingIcon />
        </Box>
      </Box>
      <Box className={classes.flexBox} style={{ borderBottom: "1px dashed #18181822" }} py={2}>
        <Box display="flex">
          <Avatar
            size={34}
            rounded
            bordered
            image={require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")}
          />
          <Box ml={1}>
            <Box className={classes.header2}>{proposal.creator}</Box>
            <Box className={classes.header3}>{`@${proposal.creatorId}`}</Box>
          </Box>
        </Box>
        <Box ml={1} textAlign="end">
          <Box className={classes.header2} style={{ color: "#707582" }}>
            Amount to withdraw
          </Box>
          <Box className={classes.header2}>
            {`pUSD ${proposal.value}`}
            <span style={{ color: "#707582" }}>{`($${proposal.value})`}</span>
          </Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <SecondaryButton size="medium" isRounded onClick={handleDecline}>
          Decline
        </SecondaryButton>
        <PrimaryButton
          size="medium"
          isRounded
          onClick={handleAccept}
          style={{ background: Color.MusicDAOGreen, width: "40%" }}
        >
          Accept & Sign
        </PrimaryButton>
      </Box>
      {openTranactionModal ? (
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
      ) : (
        <ProposalDetailModal
          {...props}
          open={openDetailModal}
          onClose={() => setOpenDetailModal(false)}
          handleAccept={handleAccept}
          handleDecline={handleDecline}
        />
      )}
    </Box>
  );
};

const PendingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d)">
      <g clip-path="url(#clip0)">
        <rect x="1.88477" y="1" width="17" height="17" rx="8.5" fill="#54658F" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10.3681 4.23975C7.49465 4.23975 5.15625 6.57827 5.15625 9.45155C5.15625 12.3248 7.49478 14.6633 10.3681 14.6633C13.2413 14.6633 15.5799 12.3248 15.5799 9.45155C15.5799 6.57827 13.2413 4.23975 10.3681 4.23975ZM6.88933 9.01735H13.8299C13.9464 9.01535 14.059 9.05987 14.1421 9.14143C14.2251 9.22348 14.2721 9.33505 14.2721 9.45163C14.2721 9.56821 14.2251 9.67977 14.1421 9.76133C14.059 9.84289 13.9464 9.88791 13.8299 9.88591H6.88933C6.77276 9.88791 6.66018 9.84289 6.57713 9.76133C6.49408 9.67978 6.44705 9.56821 6.44705 9.45163C6.44705 9.33505 6.49408 9.22349 6.57713 9.14143C6.66019 9.05987 6.77275 9.01534 6.88933 9.01735Z"
          fill="white"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d"
        x="0.906233"
        y="0.347645"
        width="18.9571"
        height="18.9571"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="0.326178" />
        <feGaussianBlur stdDeviation="0.489266" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <clipPath id="clip0">
        <path
          d="M1.88477 9.5C1.88477 4.80558 5.69035 1 10.3848 1C15.0792 1 18.8848 4.80558 18.8848 9.5C18.8848 14.1944 15.0792 18 10.3848 18C5.69035 18 1.88477 14.1944 1.88477 9.5Z"
          fill="white"
        />
      </clipPath>
    </defs>
  </svg>
);
