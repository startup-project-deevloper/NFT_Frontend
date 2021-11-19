import React, { useState, useEffect, useMemo } from "react";
import { useMediaQuery, useTheme } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import { Color, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import useIPFS from "../../../../../shared/utils-IPFS/useIPFS";
import { useStyles } from "./index.styles";
import Avatar from "shared/ui-kit/Avatar";
import { BlockchainNets } from "shared/constants/constants";
import getPhotoIPFS from "shared/functions/getPhotoIPFS";
import SellProposalVoteModal from "components/PriviDigitalArt/modals/SellProposalVoteModal";
import SellProposalDetailsModal from "components/PriviDigitalArt/modals/SellProposalDetailsModal";

const REQUIRED = 0.51;

export default function SellProposalCard({ proposal, pod, podInfo, totalStaked, handleRefresh }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const classes = useStyles();

  const [openSellProposalVoteModal, setOpenSellProposalVoteModal] = useState<boolean>(false);
  const [openSellProposalDetailsModal, setOpenSellProposalDetailsModal] = useState<boolean>(false);

  const [endingTime, setEndingTime] = useState<any>();

  const { downloadWithNonDecryption } = useIPFS();
  const [ipfsImage, setIpfsImage] = useState<string>();

  const handleOpenScan = () => {
    const selectedChain = BlockchainNets.find(net => net.value === pod.blockchainNetwork);
    window.open(`${selectedChain.scan.url}/tx/${proposal.hash}`, "_blank");
  };

  const quorumRequired = useMemo(
    () => (proposal.totalSupply ? proposal.totalSupply * REQUIRED : 0),
    [proposal]
  );

  useEffect(() => {
    if (!proposal || !proposal.media) return;

    (async () => {
      const image = await getPhotoIPFS(
        proposal.media.metadataPhoto.newFileCID,
        proposal.media.metadataPhoto.metadata.properties.name,
        downloadWithNonDecryption
      );
      setIpfsImage(image);
    })();
  }, [proposal]);

  useEffect(() => {
    if (!proposal || !proposal.expireAt) return;
    const timerId = setInterval(() => {
      let delta = Math.floor(proposal.expireAt - Date.now() / 1000);

      if (delta < 0) {
        setEndingTime({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        clearInterval(timerId);
      } else {
        let days = Math.floor(delta / 86400);
        delta -= days * 86400;

        // calculate (and subtract) whole hours
        let hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        // calculate (and subtract) whole minutes
        let minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        // what's left is seconds
        let seconds = delta % 60;

        setEndingTime({
          days,
          hours,
          minutes,
          seconds,
        });
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [proposal]);

  return (
    <Box className={classes.root}>
      <Box className={classes.flexBox} style={{ borderBottom: "1px dashed #18181822" }} pb={2}>
        {isMobile && (
          <Box display="flex" alignItems="center" mb={2}>
            <Box mr={1}>
              {proposal.status === "success" ? (
                <Box
                  display="flex"
                  alignItems="center"
                  style={{ color: Color.MusicDAOGreen, fontSize: 14, lineHeight: "15px" }}
                >
                  Accepted&nbsp;
                  <img src={require("assets/musicDAOImages/accepted.png")} />
                </Box>
              ) : proposal.status === "failed" ? (
                <Box
                  display="flex"
                  alignItems="center"
                  style={{ color: Color.Red, fontSize: 14, lineHeight: "15px" }}
                >
                  Declined&nbsp;
                  <img src={require("assets/musicDAOImages/declined.png")} />
                </Box>
              ) : (
                <Box display="flex" alignItems="center" className={classes.header1}>
                  Pending&nbsp;
                  <img src={require("assets/musicDAOImages/pending.png")} />
                </Box>
              )}
            </Box>
          </Box>
        )}
        <Box className={classes.buttons}>
          <PrimaryButton size="small" style={{ background: Color.MusicDAOGreen }}>
            Selling Proposal <b>ID #{proposal.proposalId.substr(0, 6)}</b>
          </PrimaryButton>
          <PrimaryButton
            size="small"
            style={{ background: "#65CB6326", color: "#65CB63" }}
            onClick={handleOpenScan}
          >
            <Box display="flex" alignItems="center">
              Check on&nbsp;
              <img src={require("assets/icons/polygon_scan.png")} />
            </Box>
          </PrimaryButton>
        </Box>
        {!isMobile && (
          <Box display="flex" alignItems="center">
            <Box mr={1}>
              {proposal.status === "success" ? (
                <Box
                  display="flex"
                  alignItems="center"
                  style={{ color: Color.MusicDAOGreen, fontSize: 14, lineHeight: "15px" }}
                >
                  Accepted&nbsp;
                  <img src={require("assets/pixImages/accepted.png")} />
                </Box>
              ) : proposal.status === "failed" ? (
                <Box
                  display="flex"
                  alignItems="center"
                  style={{ color: Color.Red, fontSize: 14, lineHeight: "15px" }}
                >
                  Declined&nbsp;
                  <img src={require("assets/pixImages/declined.png")} />
                </Box>
              ) : (
                <Box display="flex" alignItems="center" className={classes.header1}>
                  Pending&nbsp;
                  <img src={require("assets/pixImages/pending.png")} />
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
      <Box className={classes.flexBox} style={{ borderBottom: "1px dashed #18181822" }} py={2}>
        <Box display="flex">
          <Avatar
            size={34}
            rounded
            bordered
            image={
              proposal.proposerInfo?.imageUrl ?? require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")
            }
          />
          <Box ml={1}>
            {proposal.proposerInfo && (
              <>
                <Box className={classes.header2}>{proposal.proposerInfo.name || ""}</Box>
                <Box className={classes.header3}>
                  {proposal.proposerInfo.address.substr(0, 6) +
                    "..." +
                    proposal.proposerInfo.address.substr(-4)}
                </Box>
              </>
            )}
          </Box>
        </Box>
        {endingTime && proposal.status !== "success" && proposal.status !== "failed" && (
          <Box display="flex" flexDirection="column" alignItems="end" mt={isMobile ? 2 : undefined}>
            <Box>Proposal Expires in</Box>
            <Box>
              <strong>
                {endingTime.days > 0 && <span>{String(endingTime.days).padStart(2, "0")}days:</span>}&nbsp;
                {endingTime.hours > 0 && <span>{String(endingTime.hours).padStart(2, "0")}h:</span>}&nbsp;
                {endingTime.minutes > 0 && <span>{String(endingTime.minutes).padStart(2, "0")}m:</span>}&nbsp;
                <span>{String(endingTime.seconds).padStart(2, "0")}s</span>
              </strong>
            </Box>
          </Box>
        )}
      </Box>
      <Box className={classes.flexBox} style={{ borderBottom: "1px dashed #18181822" }} py={2}>
        <Box display="flex" alignItems="center">
          <img
            src={ipfsImage || require("assets/musicDAOImages/no_image.png")}
            style={{ borderRadius: 12, width: 66, height: 64 }}
          />
          <Box ml={2}>
            {proposal.media && (
              <>
                <Box className={classes.header2}>{proposal.media.Title || ""}</Box>
                <Box>
                  {proposal.media.Artist} | {proposal.media.AlbumName}
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        style={{ borderBottom: "1px dashed #18181822" }}
        py={2}
      >
        <span style={{ color: Color.MusicDAOGreen }}>Selling Price</span>&nbsp;&nbsp;
        <span>
          <strong>{proposal.amount} USDT</strong>
        </span>
        &nbsp;
        <span style={{ color: Color.MusicDAOGray }}>(${proposal.amount})</span>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        style={{ borderBottom: "1px dashed #18181822" }}
        py={2}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          flex="1"
          style={{ borderRight: `1px solid ${Color.MusicDAOGray}` }}
        >
          <div>Quorum Required</div>
          <div>
            <strong>
              {quorumRequired.toFixed(2)} {pod.TokenSymbol}
            </strong>
          </div>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" flex="1" flexDirection="column">
          <div>Quorum Reached</div>
          <div>
            <strong>
              {proposal?.voteStates?.forVotes || 0} {pod.TokenSymbol}
            </strong>
          </div>
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <SecondaryButton
          size="medium"
          isRounded
          style={{ backgroundColor: Color.MusicDAODark, border: "transparent", color: "white" }}
          onClick={() => {
            setOpenSellProposalDetailsModal(true);
          }}
        >
          Details & Voting
        </SecondaryButton>
      </Box>
      <SellProposalVoteModal
        proposal={proposal}
        pod={pod}
        podInfo={podInfo}
        votes={proposal?.voteStates || {}}
        totalSupply={proposal.totalSupply}
        totalStaked={totalStaked}
        open={openSellProposalVoteModal}
        handleClose={() => setOpenSellProposalVoteModal(false)}
        handleRefresh={() => handleRefresh()}
      />
      <SellProposalDetailsModal
        proposal={proposal}
        pod={pod}
        open={openSellProposalDetailsModal}
        openVote={() => setOpenSellProposalVoteModal(true)}
        handleClose={() => setOpenSellProposalDetailsModal(false)}
      />
    </Box>
  );
}
