import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useMediaQuery } from "@material-ui/core";

import { Grid } from "@material-ui/core";

import { RootState } from "store/reducers/Reducer";
import { default as ServerURL } from "shared/functions/getURL";
import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { Gradient, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import DiscussionPage from "../Discussion/components/DiscussionPage";
import Box from "shared/ui-kit/Box";
import CreateNewTopicModal from "components/PriviDigitalArt/modals/CreateNewTopicModal";
import DistributionProposalModal from "components/PriviDigitalArt/modals/DistributionProposalModal";
import Avatar from "shared/ui-kit/Avatar";
import { chatStyles } from "./index.styles";
import { ClaimFundsModal } from "components/PriviDigitalArt/modals/ClaimFundsModal";
import Discord from "../../Discord";
import Moment from "react-moment";
import { socket } from "../../../../../Login/Auth";
import ListChats from "./ListChats";

export default function Discussion(props) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const classes = chatStyles();

  const users = useTypedSelector(state => state.usersInfoList);
  const userSelector = useSelector((state: RootState) => state.user);

  const pageDiscussionRef = useRef();

  const [pod, setPod] = useState<any>({});
  const [podInfo, setPodInfo] = useState<any>({});

  //modal controller
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [openClaimFundsModal, setOpenClaimFundsModal] = useState<boolean>(false);

  const [selectedChat, setSelectedChat] = useState<any>({});
  const [selectedChatId, setSelectedChatId] = useState<string>("");

  const [openNewTopic, setOpenNewTopic] = useState<boolean>(false);
  const [openDistributionProposalModal, setOpenDistributionProposalModal] = useState<boolean>(false);

  useEffect(() => {
    if (props.podId) {
      // setIsDataLoading(true);
      if (props.pod && props.pod.PrivateChats && props.podInfo) {
        setPod(props.pod);
        setPodInfo(props.podInfo);
        setDiscussions(props.pod.PrivateChats);
      }
    }
  }, [props.podId, props.pod, props.podInfo, users]);

  const onTopicSelected = val => {
    socket?.emit("subscribe-podDiscussion", {
      podId: props.podId,
      topicId: val.id,
      userId: userSelector.id,
      podType: "PIX",
    });
    setSelectedChatId(val.id);
    setSelectedChat(val);
  };

  const fundedStatus = React.useMemo(
    () =>
      pod &&
      pod.FundingDate &&
      pod.FundingDate <= Math.trunc(Date.now() / 1000) &&
      (pod.RaisedFunds || 0) >= pod.FundingTarget,
    [pod]
  );

  if (props.pod)
    return (
      <Box mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box className={classes.flexBox} justifyContent="space-between" mb={3}>
              <div className={classes.title}>Discussion</div>
              {fundedStatus && (
                <PrimaryButton
                  size="medium"
                  onClick={() => setOpenClaimFundsModal(true)}
                  style={{
                    padding: isMobile ? "0 15px" : "0 30px",
                    fontSize: isMobile ? "13px" : "18px",
                    background: Gradient.Green1,
                  }}
                  isRounded
                >
                  New Withdraw Proposal
                </PrimaryButton>
              )}
            </Box>
            <div className={classes.discussionContent} style={{ paddingRight: 0 }}>
              <LoadingWrapper loading={isDataLoading}>
                <Grid container style={{ height: "100%" }}>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    style={{
                      height: isMobile ? "170px" : "100%",
                      borderRight: isMobile ? "none" : "1px solid #ddd",
                    }}
                  >
                    <Box p={3}>
                      <ListChats
                        discussions={discussions}
                        selectedChat={selectedChatId}
                        onTopicSelected={val => onTopicSelected(val)}
                      />
                    </Box>
                  </Grid>
                  {/* <Box style={{width:"1px", background:"#ccc"}} /> */}
                  <Grid item xs={12} sm={8} style={{ height: isMobile ? "calc(100% - 170px)" : "100%" }}>
                    <Box pb={2} style={{ height: "100%" }}>
                      <Discord
                        podId={props.podId}
                        chatType={"PrivateChat"}
                        chatId={selectedChatId}
                        sidebar={false}
                        theme="dark"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </LoadingWrapper>
            </div>
          </Grid>
        </Grid>
        {openDistributionProposalModal && (
          <DistributionProposalModal
            open={openDistributionProposalModal}
            onClose={() => setOpenDistributionProposalModal(false)}
          />
        )}
        {openClaimFundsModal && (
          <ClaimFundsModal
            open={openClaimFundsModal}
            handleClose={() => setOpenClaimFundsModal(false)}
            openProposal={props.openProposal}
            podId={props.podId}
            pod={pod}
            podInfo={podInfo}
          />
        )}
      </Box>
    );
  else return <p>Error displaying pod data</p>;
}

const CrownIcon = () => (
  <svg width="31" height="25" viewBox="0 0 31 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.02311 23.1654L5.03672 23.3298C5.11708 23.812 5.53427 24.1654 6.02311 24.1654V23.1654ZM24.6898 23.1654V24.1654C25.1786 24.1654 25.5958 23.812 25.6762 23.3298L24.6898 23.1654ZM20.0231 13.1654L19.1795 13.7022C19.3329 13.9434 19.5823 14.1074 19.8646 14.1527C20.1469 14.198 20.4351 14.1204 20.6564 13.9393L20.0231 13.1654ZM10.6898 13.1654L10.0565 13.9393C10.2778 14.1204 10.566 14.198 10.8483 14.1527C11.1306 14.1074 11.3799 13.9434 11.5334 13.7022L10.6898 13.1654ZM2.37005 7.32976L5.03672 23.3298L7.00951 23.001L4.34284 7.00097L2.37005 7.32976ZM6.02311 24.1654H24.6898V22.1654H6.02311V24.1654ZM25.6762 23.3298L28.3428 7.32976L26.3701 7.00097L23.7034 23.001L25.6762 23.3298ZM26.7232 6.39141L19.3899 12.3914L20.6564 13.9393L27.9897 7.93932L26.7232 6.39141ZM2.72321 7.93932L10.0565 13.9393L11.323 12.3914L3.98968 6.39141L2.72321 7.93932ZM11.5334 13.7022L16.2001 6.36891L14.5128 5.29516L9.84612 12.6285L11.5334 13.7022ZM14.5128 6.36891L19.1795 13.7022L20.8668 12.6285L16.2001 5.29516L14.5128 6.36891ZM16.3564 3.83203C16.3564 4.38432 15.9087 4.83203 15.3564 4.83203V6.83203C17.0133 6.83203 18.3564 5.48889 18.3564 3.83203H16.3564ZM15.3564 4.83203C14.8042 4.83203 14.3564 4.38432 14.3564 3.83203H12.3564C12.3564 5.48889 13.6996 6.83203 15.3564 6.83203V4.83203ZM14.3564 3.83203C14.3564 3.27975 14.8042 2.83203 15.3564 2.83203V0.832031C13.6996 0.832031 12.3564 2.17518 12.3564 3.83203H14.3564ZM15.3564 2.83203C15.9087 2.83203 16.3564 3.27975 16.3564 3.83203H18.3564C18.3564 2.17518 17.0133 0.832031 15.3564 0.832031V2.83203ZM4.35645 5.16536C4.35645 5.71765 3.90873 6.16536 3.35645 6.16536V8.16536C5.0133 8.16536 6.35645 6.82222 6.35645 5.16536H4.35645ZM3.35645 6.16536C2.80416 6.16536 2.35645 5.71765 2.35645 5.16536H0.356445C0.356445 6.82222 1.69959 8.16536 3.35645 8.16536V6.16536ZM2.35645 5.16536C2.35645 4.61308 2.80416 4.16536 3.35645 4.16536V2.16536C1.69959 2.16536 0.356445 3.50851 0.356445 5.16536H2.35645ZM3.35645 4.16536C3.90873 4.16536 4.35645 4.61308 4.35645 5.16536H6.35645C6.35645 3.50851 5.0133 2.16536 3.35645 2.16536V4.16536ZM28.3564 5.16536C28.3564 5.71765 27.9087 6.16536 27.3564 6.16536V8.16536C29.0133 8.16536 30.3564 6.82222 30.3564 5.16536H28.3564ZM27.3564 6.16536C26.8042 6.16536 26.3564 5.71765 26.3564 5.16536H24.3564C24.3564 6.82222 25.6996 8.16536 27.3564 8.16536V6.16536ZM26.3564 5.16536C26.3564 4.61308 26.8042 4.16536 27.3564 4.16536V2.16536C25.6996 2.16536 24.3564 3.50851 24.3564 5.16536H26.3564ZM27.3564 4.16536C27.9087 4.16536 28.3564 4.61308 28.3564 5.16536H30.3564C30.3564 3.50851 29.0133 2.16536 27.3564 2.16536V4.16536Z"
      fill="#65CB63"
    />
  </svg>
);
