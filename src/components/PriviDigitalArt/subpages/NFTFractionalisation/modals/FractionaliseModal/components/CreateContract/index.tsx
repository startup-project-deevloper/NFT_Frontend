import React, { useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import { CopyToClipboard } from "react-copy-to-clipboard";
import Box from 'shared/ui-kit/Box';
import { ReactComponent as CopyIcon } from 'assets/icons/copy-icon.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      padding: 50,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: '100%',
      maxWidth: 540,
      textAlign: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: 800,
      lineHeight: '104.5%',
      color: '#181818',
    },
    description: {
      fontSize: 16,
      lineHeight: '150%',
      color: 'rgba(24, 24, 24, 0.7)',
    },
    icon: {
      width: 160,
      height: '100%',
      marginBottom: 30,
    },
    btn: {
      height: 34,
      backgroundColor: '#431AB7',
      color: 'white',
      width: '100%',
      marginTop: 30,
      fontSize: 14,
      fontWeight: 800,
      borderRadius: 4,
    },
    checkBtn: {
      height: 40,
      backgroundColor: '#431AB7',
      color: 'white',
      marginTop: 30,
      padding: '11px 32px',
      fontSize: 14,
      fontWeight: 700,
      borderRadius: 4,
    },
    hash: {
      cursor: "pointer",
    },
    result: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }
  }),
);

export default function CreateContract({ onClose, onCompleted }) {
  const classes = useStyles();
  const [isProceeding, setIsProceeding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string>('');

  const handleProceed = () => {
    setIsLoading(true);
    setIsProceeding(true);
    setTimeout(() => {
      setHash('0xf273a38fec99acf1efe23423fsfwefwefeba');
      setIsLoading(false);
      onCompleted();
    }, 3000);
  }

  const handleCheck = () => {
    onClose();
  }

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        {isProceeding ? (
          <>
            <LoadingWrapper loading={isLoading} theme="blue" iconWidth="80px" iconHeight="80px"></LoadingWrapper>
            <h1 className={classes.title}>Create contract on Polygon</h1>
            {isLoading ? (
              <p className={classes.description}>
                Transaction is proceeding on Polygon Chain.<br/>
                This can take a moment, please be patient...
              </p>
            ) : (
              <Box className={classes.result}>
                <CopyToClipboard text={hash}>
                  <Box mt="20px" display="flex" alignItems="center" className={classes.hash}>
                    Hash:
                    <Box color="#4218B5" mr={1} ml={1}>
                      {hash.substr(0, 18) + "..." + hash.substr(hash.length - 3, 3)}
                    </Box>
                    <CopyIcon />
                  </Box>
                </CopyToClipboard>
                <button className={classes.checkBtn} onClick={handleCheck}>Check on Polygon Scan</button>
              </Box>
            )}
          </>
        ) : (
          <>
            <img className={classes.icon} src={require('assets/icons/contract-ploygon-icon.png')} alt="" />
            <h1 className={classes.title}>Create contract on Polygon</h1>
            <p className={classes.description}>
              The synthetic fractionalisation of your NFT requires 2 steps.<br/>
              First, contract for your NFT will be created on Polygon.<br/>
              Second, your NFT will be locked in a Vault on Ethereum smart contract.
            </p>
            <button className={classes.btn} onClick={handleProceed}>Proceed</button>
          </>
        )}
      </div>
    </div>
  );
}