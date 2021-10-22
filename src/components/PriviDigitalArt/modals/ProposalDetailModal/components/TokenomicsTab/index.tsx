import React, {useEffect, useState} from "react";
import { Box, Grid } from "@material-ui/core";

import { tokenomicsTabStyles } from "./index.styles";
import { formatDDMMYY } from "shared/helpers";
import useIPFS from "../../../../../../shared/utils-IPFS/useIPFS";
import {onGetNonDecrypt} from "../../../../../../shared/ipfs/get";
import {_arrayBufferToBase64} from "../../../../../../shared/functions/commonFunctions";

const TokenomicsTab = (props: any) => {
  const { proposal } = props;
  const classes = tokenomicsTabStyles();

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  const [imageIPFS, setImageIPFS] = useState<any>(null);

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    console.log('proposal', proposal);
    if(ipfs  &&
      proposal && proposal.TokenInfoImage &&
      proposal.TokenInfoImage.newFileCID) {
      getImageIPFS(proposal.TokenInfoImage.newFileCID);
    }
  }, [proposal, ipfs]);

  const getImageIPFS = async (cid: string) => {
    let files = await onGetNonDecrypt(cid, (fileCID, download) =>
      downloadWithNonDecryption(fileCID, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.content);
      setImageIPFS("data:image/png;base64," + base64String);
    }
  };


  return (
    <div className={classes.tokenomicsTab}>
      <Box className={classes.headerBox}>
        <img
          src={imageIPFS ? imageIPFS :
            "http://bsmedia.business-standard.com/_media/bs/img/article/2017-05/22/full/1495395416-6262.jpg"
          }
          alt="image"
        />
        <Box>
          <Box className={classes.headerTitle}>
            <Box>
              <p>Pod Token Name</p>
              <p>{proposal.TokenName || 'Token Name'}</p>
            </Box>
            <Box>
              <p>Symbol</p>
              <p>{proposal.TokenSymbol || 'Token Symbol'}</p>
            </Box>
          </Box>
          {
            proposal && proposal.TokenDescription ?
              <span>
                {proposal.TokenDescription}
              </span> : null
          }
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
