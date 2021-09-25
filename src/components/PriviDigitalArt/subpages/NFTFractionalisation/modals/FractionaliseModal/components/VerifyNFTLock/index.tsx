import React, { useState } from 'react';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import Box from 'shared/ui-kit/Box';
import { CopyToClipboard } from "react-copy-to-clipboard";

import { ReactComponent as CopyIcon } from "assets/icons/copy-icon.svg";
import { useVerifyNFTLockStyles } from './index.styles';

export default function VerifyNFTLock({ onClose, onCompleted }) {
  const classes = useVerifyNFTLockStyles();
  const [isProceeding, setIsProceeding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleVerify = () => {
    setIsLoading(true);
    setIsProceeding(true);
    setTimeout(() => {
      setIsLoading(false);
      onCompleted();
    }, 3000);
  }

  const handleLater = () => {
    onClose();
  }

  const hash = "0xf273a38fec99acf1e....eba";

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        {isProceeding ? (
          <>
            <LoadingWrapper loading={isLoading} theme="blue" iconWidth="80px" iconHeight="80px" />
            {isLoading ? (
              <>
                <h1 className={classes.title}>Verifying...</h1>
                <p className={classes.description}>
                  Transaction is proceeding on Polygon Chain. <br/>
                  This can take a moment, please be patient...
                </p>
                <CopyToClipboard text={hash}>
                  <Box mt="20px" display="flex" alignItems="center" justifyContent="center" className={classes.hash}>
                    Hash:
                    <Box color="#4218B5" mr={1} ml={1}>
                      {hash.substr(0, 18) + "..." + hash.substr(hash.length - 3, 3)}
                    </Box>
                    <CopyIcon />
                  </Box>
                </CopyToClipboard>
                <button className={classes.checkBtn}>
                  Check on Ethereum Scan
                </button>
              </>
            ) : (
              <Box className={classes.result}>
                <img className={classes.icon} src={require('assets/icons/lock-success-icon.png')} alt="" />
                <h1 className={classes.title}>Your NFT is Locked!</h1>
                <p className={classes.description}>
                  Your NFT has been locked successfully. <br/>
                  You can see it in My NFT Panel now.
                </p>
                <button className={classes.checkBtn} onClick={handleLater}>Close</button>
              </Box>
            )}
          </>
        ) : (
          <>
            <img className={classes.icon} src={require('assets/icons/verify-nft-icon.png')} alt="" />
            <h1 className={classes.title}>Almost there !<br/> Verify your NFT lock </h1>
            <p className={classes.description}>
              Please verify if your NFT has been locked <br/>
              by clicking the button below.
            </p>
            <button className={classes.btn} onClick={handleVerify}>Verify</button>
          </>
        )}
      </div>
    </div>
  );
}
