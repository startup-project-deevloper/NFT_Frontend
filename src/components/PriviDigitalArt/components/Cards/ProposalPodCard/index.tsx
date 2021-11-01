import { useWeb3React } from "@web3-react/core";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import Web3 from "web3";
import ProposalDetailModal from "components/PriviDigitalArt/modals/ProposalDetailModal";
import React, { useEffect, useState } from "react";
import { BlockchainNets } from "shared/constants/constants";
import { Color, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Avatar from "shared/ui-kit/Avatar";
import Box from "shared/ui-kit/Box";
import { ProposalPodCardStyles } from "./index.styles";
import { useSelector } from "react-redux";
import { priviPodVoteForPodProposal } from "shared/services/API";
import { RootState } from "store/reducers/Reducer";
import TransactionProgressModal from "../../../modals/TransactionProgressModal";
import useIPFS from "../../../../../shared/utils-IPFS/useIPFS";
import getPhotoIPFS from "../../../../../shared/functions/getPhotoIPFS";

export const ProposalPodCard = props => {
  const { podId, proposal, pod, handleRefresh, handleNewProposalModal } = props;

  const usersList = useSelector((state: RootState) => state.usersInfoList);

  const { showAlertMessage } = useAlertMessage();

  const userSelector = useSelector((state: RootState) => state.user);

  const classes = ProposalPodCardStyles();
  const [openDetailModal, setOpenDetailModal] = React.useState<boolean>(false);

  const { account, library } = useWeb3React();

  const creator = pod.CreatorsData.find(creator => creator.id === proposal.Proposer);
  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  const [mediasPhotos, setMediasPhotos] = useState<any[]>([]);
  const [creatorImage, setCreatorImage] = useState<any>(null);

  const [voteStatus, setVoteStatus] = useState<boolean | null>(null);

  useEffect(() => {
    setVoteStatus(proposal && proposal.Votes && proposal.Votes[userSelector.id]);
  }, [proposal]);

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    if (ipfs && Object.keys(ipfs).length !== 0 && usersList && usersList.length > 0 && pod) {
      getImages();
    }
  }, [pod, ipfs, usersList]);

  useEffect(() => {
    if (ipfs && Object.keys(ipfs).length !== 0 && creator && creator.id) {
      getUserPhoto(creator);
    }
  }, [ipfs, creator, usersList]);

  const handleAccept = async () => {
    setOpenTransactionModal(true);

    if (!library) {
      showAlertMessage("Connect your metamask.", { variant: "error" });
      return;
    }

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

    const voteAPIresponse = await priviPodVoteForPodProposal({
      podId,
      id: proposal.Id,
      voter: userSelector.id,
      podAddress: voteContractResponse.data.podAddress,
      status: true,
      type: "PIX",
    });

    setVoteStatus(true);

    if (!voteAPIresponse.success) {
      showAlertMessage("Failed to accept the proposal", { variant: "error" });
      setTransactionSuccess(false);
      setOpenDetailModal(false);
      return;
    }

    setTransactionSuccess(true);

    showAlertMessage("Accepted the proposal successfully", { variant: "success" });

    if (voteContractResponse.data.podAddress) {
      showAlertMessage("The Proposal has been accepted.", { variant: "success" });
      handleRefresh();
    } else {
      handleRefresh();
    }
  };

  const handleDecline = async () => {
    const response = await priviPodVoteForPodProposal({
      podId,
      id: proposal.Id,
      voter: userSelector.id,
      status: false,
      type: "PIX",
    });

    if (response.success) {
      setVoteStatus(false);
      showAlertMessage("Declined the proposal successfully", { variant: "success" });
      setOpenDetailModal(false);
      handleRefresh();
    } else {
      showAlertMessage("Failed to declined the proposal", { variant: "error" });
      setOpenDetailModal(false);
    }
  };

  const getImages = async () => {
    let i: number = 0;
    let photos: any = {};
    for (let creator of pod.CreatorsData) {
      if (creator && creator.id) {
        let creatorFound: any = usersList.find(user => user.id === creator.id);

        if (creatorFound && creatorFound.ipfsImage) {
          photos[i + "-photo"] = creatorFound.ipfsImage;
        }
      }
      i++;
    }
    setMediasPhotos(photos);
  };

  const getUserPhoto = async (creator: any) => {
    let creatorFound = usersList.find(user => user.id === creator.id);

    if (creatorFound && creatorFound.ipfsImage) {
      setCreatorImage(creatorFound.ipfsImage);
    }
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.flexBox} style={{ borderBottom: "1px dashed #18181822" }} pb={2}>
        <PrimaryButton
          size="small"
          style={{
            background: Color.Purple,
            fontWeight: "normal",
            height: 22,
            borderRadius: 6,
            lineHeight: "13px",
          }}
        >
          Copyright Distribution
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
            image={creatorImage ? creatorImage : require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")}
          />
          <Box ml={1}>
            {creator ? (
              <>
                <Box className={classes.header2}>{creator.name || ""}</Box>
                <Box className={classes.header3}>
                  {`@${
                    creator.id.length > 13
                      ? creator.id.substr(0, 13) + "..." + creator.id.substr(creator.id.length - 2, 2)
                      : creator.id
                  }`}
                </Box>
              </>
            ) : null}
          </Box>
        </Box>
        <Box display="flex">
          <Box textAlign="end">
            <Box className={classes.header4}>Go to details to see new distribution</Box>
          </Box>
          <Box display="flex">
            {pod.CreatorsData.map((item, index) => {
              return (
                <Box ml={index > 0 ? -2 : 2}>
                  <Avatar
                    size={34}
                    rounded
                    bordered
                    image={
                      mediasPhotos && mediasPhotos[index + "-photo"]
                        ? mediasPhotos[index + "-photo"]
                        : require(`assets/anonAvatars/ToyFaces_Colored_BG_00${index + 1}.jpg`)
                    }
                  />
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <SecondaryButton
          size="medium"
          isRounded
          onClick={() => {
            setOpenDetailModal(true);
          }}
        >
          Details
        </SecondaryButton>
      </Box>

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
      <ProposalDetailModal
        {...props}
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        handleAccept={handleAccept}
        handleDecline={handleDecline}
        voteStatus={voteStatus}
        handleNewDistributionProposalModal={() => {
          setOpenDetailModal(false);
          handleNewProposalModal();
        }}
      />
    </Box>
  );
};

const PendingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d)">
      <g clip-path="url(#clip0)">
        <rect x="1.88477" y="1" width="17" height="17" rx="8.5" fill="#1A1B1C" />
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
