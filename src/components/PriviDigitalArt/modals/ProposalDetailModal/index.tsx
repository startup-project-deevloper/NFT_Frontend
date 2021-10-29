import React, { useEffect, useState } from "react";
import cls from "classnames";
import { useMediaQuery, useTheme } from "@material-ui/core";

import { getCryptosRateAsList } from "shared/services/API";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import GeneralTab from "./components/GeneralTab";
import CopyRightFractionTab from "./components/CopyRightFractionTab";
import TokenomicsTab from "./components/TokenomicsTab";
import { proposalDetailModalStyles } from "./index.styles";
import TransactionProgressModal from "../TransactionProgressModal";

const startDate = Math.floor(Date.now() / 1000 + 3600 * 24 * 7); // one week later

const ProposalDetailModal = (props: any) => {
  const { pod, proposal, txnModalOpen, closeTxnModal, txnSuccess, hash, voteStatus } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [currentTab, setCurrentTab] = useState<number>(0);
  const [tokenObjList, setTokenObjList] = useState<any[]>([]);

  const classes = proposalDetailModalStyles();
  // get token list from backend
  useEffect(() => {
    if (tokenObjList.length === 0 && props.open) {
      getCryptosRateAsList().then(data => {
        const tknObjList: any[] = [];
        data.forEach(rateObj => {
          tknObjList.push({ token: rateObj.token, name: rateObj.name });
        });
        setTokenObjList(tknObjList);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open]);

  return (
    <>
      {txnModalOpen ? (
        <TransactionProgressModal
          open={txnModalOpen}
          onClose={closeTxnModal}
          txSuccess={txnSuccess}
          hash={hash}
        />
      ) : (
        <Modal
          size="medium"
          isOpen={props.open}
          onClose={props.onClose}
          showCloseIcon
          style={{
            maxWidth: "755px",
            padding: isMobile ? "30px 22px 36px" : "30px 58px 36px",
          }}
        >
          <div className={classes.headerCreatePod}>Create Music Collection</div>
          <div className={classes.modalContent}>
            <div className={classes.cardsOptions}>
              <div
                onClick={() => setCurrentTab(0)}
                className={cls(
                  { [classes.tabHeaderPodMediaSelected]: currentTab === 0 },
                  classes.tabHeaderPodMedia
                )}
              >
                General
              </div>
              <div
                className={cls(
                  { [classes.tabHeaderPodMediaSelected]: currentTab === 1 },
                  classes.tabHeaderPodMedia
                )}
                onClick={() => setCurrentTab(1)}
              >
                Tokenomics
              </div>
              <div
                className={cls(
                  { [classes.tabHeaderPodMediaSelected]: currentTab === 2 },
                  classes.tabHeaderPodMedia
                )}
                onClick={() => setCurrentTab(2)}
              >
                Copyright Fractionalisation
              </div>
            </div>
            <div style={{ display: currentTab === 0 ? "block" : "none" }}>
              <GeneralTab proposal={proposal} />
            </div>
            <div style={{ display: currentTab === 1 ? "block" : "none" }}>
              <TokenomicsTab proposal={proposal} />
            </div>
            <div style={{ display: currentTab === 2 ? "block" : "none" }}>
              <CopyRightFractionTab proposal={proposal} pod={pod} />
            </div>
            {isMobile && !voteStatus && (
              <PrimaryButton
                size="medium"
                onClick={props.handleNewDistributionProposalModal}
                style={{ marginTop: theme.spacing(4) }}
              >
                Place counter Proposal
              </PrimaryButton>
            )}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              className={classes.buttons}
              mt={4}
            >
              {voteStatus === true ? (
                <>You've accepted the proposal already.</>
              ) : (
                <>
                  {voteStatus === false ? (
                    <>You've declined the proposal already.</>
                  ) : (
                    <>
                      <SecondaryButton size="medium" onClick={props.handleDecline}>
                        Decline
                      </SecondaryButton>
                      <Box display="flex" alignItems="center">
                        {!isMobile && (
                          <PrimaryButton size="medium" onClick={props.handleNewDistributionProposalModal}>
                            Place counter Proposal
                          </PrimaryButton>
                        )}
                        <PrimaryButton size="medium" onClick={props.handleAccept}>
                          Accept & Sign
                        </PrimaryButton>
                      </Box>
                    </>
                  )}
                </>
              )}
            </Box>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProposalDetailModal;
