import React, { useState, useEffect } from "react";

import { Grid, useMediaQuery, useTheme } from "@material-ui/core";

import { priviPodGetSellingProposals } from "shared/services/API";
import { Gradient, PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { ProposalsStyle } from "./index.styles";
import SellProposalCard from "components/PriviDigitalArt/components/Cards/SellProposalCard";
import { SellingProposalModal } from "components/PriviDigitalArt/modals/SellingProposalModal";

const Proposals = ({
  pod,
  podInfo,
  totalStaked,
  handleRefresh,
}: {
  pod: any;
  podInfo: any;
  totalStaked: any;
  handleRefresh: any;
}) => {
  const classes = ProposalsStyle();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [isLoadingProposals, setIsLoadingProposals] = React.useState<boolean>(false);
  const [proposals, setProposals] = React.useState<any[]>([]);

  const [openSellProposalModal, setOpenSellProposalModal] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const response = await priviPodGetSellingProposals(pod.Id, "PIX");
    if (response.success) {
      setProposals(response.data);
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        alignItems={isMobile ? "start" : "center"}
        justifyContent="space-between"
        flexDirection={isMobile ? "column" : "row"}
        mb={2}
      >
        <Box className={classes.title} mb={isMobile ? 2 : 0}>
          Selling Proposals
        </Box>
        <PrimaryButton
          size="medium"
          onClick={() => setOpenSellProposalModal(true)}
          style={{ minWidth: "220px", background: Gradient.Green1 }}
          isRounded
        >
          Create Sell Proposal
        </PrimaryButton>
      </Box>
      <Grid container spacing={2}>
        {proposals.map(item => (
          <Grid item xs={12} sm={6}>
            <SellProposalCard
              proposal={item}
              pod={pod}
              podInfo={podInfo}
              handleRefresh={loadData}
              totalStaked={totalStaked}
            />
          </Grid>
        ))}
      </Grid>

      <SellingProposalModal
        pod={pod}
        podInfo={podInfo}
        open={openSellProposalModal}
        handleRefresh={loadData}
        handleClose={() => setOpenSellProposalModal(false)}
      />
    </Box>
  );
};

export default Proposals;
