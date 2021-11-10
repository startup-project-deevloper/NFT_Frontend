import React, { useEffect, useState } from "react";
import { Box, Grid } from "@material-ui/core";

import { formatDDMMYY } from "shared/helpers";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { onGetNonDecrypt } from "shared/ipfs/get";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import SkeletonBox from "shared/ui-kit/SkeletonBox";

import { tokenomicsTabStyles } from "./index.styles";

const TokenomicsTab = (props: any) => {
  const { proposal } = props;
  const classes = tokenomicsTabStyles();

  const { downloadWithNonDecryption } = useIPFS();

  const [imageIPFS, setImageIPFS] = useState<any>(null);

  useEffect(() => {
    if (proposal?.TokenInfoImage?.newFileCID && proposal?.TokenInfoImage?.metadata?.properties?.name) {
      getImageIPFS(proposal.TokenInfoImage.newFileCID, proposal.TokenInfoImage.metadata.properties.name);
    }
  }, [proposal]);

  const getImageIPFS = async (cid: string, fileName: string) => {
    let files = await onGetNonDecrypt(cid, fileName, (fileCID, fileName, download) =>
      downloadWithNonDecryption(fileCID, fileName, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.buffer);
      setImageIPFS("data:image/png;base64," + base64String);
    }
  };

  return (
    <div className={classes.tokenomicsTab}>
      <Box className={classes.headerBox}>
        <SkeletonBox
          width="100%"
          height="100%"
          loading={!imageIPFS}
          image={imageIPFS}
          className={classes.imageBox}
          style={{
            backgroundSize: "cover",
          }}
        />
        <Box>
          <Box className={classes.headerTitle}>
            <Box>
              <p>Pod Token Name</p>
              <p>{proposal.TokenName || "Token Name"}</p>
            </Box>
            <Box>
              <p>Symbol</p>
              <p>{proposal.TokenSymbol || "Token Symbol"}</p>
            </Box>
          </Box>
          {proposal && proposal.TokenDescription ? <span>{proposal.TokenDescription}</span> : null}
        </Box>
      </Box>
      <Grid className={classes.valueBox} container spacing={2} wrap={"wrap"}>
        <Grid item md={4} sm={6}>
          <p>Funding Target Supply</p>
          <span>
            {proposal.FundingTarget}&nbsp;{proposal.FundingToken}
          </span>
        </Grid>
        <Grid item md={4} sm={6}>
          <p>Total Supply</p>
          <span>{proposal.CopyRightSupply}</span>
        </Grid>
        <Grid item md={4} sm={6}>
          <p>Funding Price</p>
          <span>
            {proposal.FundingPrice}&nbsp;{proposal.FundingToken}
          </span>
        </Grid>
        <Grid item md={4} sm={6}>
          <p>Investor share</p>
          <span>{proposal.InvestorShare}%</span>
        </Grid>
        <Grid item md={4} sm={6}>
          <p>Sharing percentage</p>
          <span>{proposal.SharingPercentage}%</span>
        </Grid>
        <Grid item md={4} sm={6}>
          <p>Royalty share</p>
          <span>{proposal.Royalty}%</span>
        </Grid>
      </Grid>
      <Box className={classes.footerBox}>
        <span>Funding Date</span>
        <span>{formatDDMMYY(proposal.FundingDate * 1000)}</span>
      </Box>
    </div>
  );
};

export default TokenomicsTab;
