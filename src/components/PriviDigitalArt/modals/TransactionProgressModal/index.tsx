import { Box, CircularProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Color, Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { useTransactionProgressModalStyles } from "./index.styles";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { useWeb3React } from "@web3-react/core";
import { BlockchainNets } from "shared/constants/constants";

require("dotenv").config();
const isDev = process.env.REACT_APP_ENV === "dev";

export default function TransactionProgressModal({
  open,
  onClose,
  txSuccess,
  hash,
}: {
  open: boolean;
  onClose: () => void;
  txSuccess: boolean | null;
  hash: string;
}) {
  const classes = useTransactionProgressModalStyles();
  const { showAlertMessage } = useAlertMessage();

  //   const url = `${isDev ? "https://mumbai.polygonscan.com/tx/" : "https://mumbai.polygonscan.com/tx/"}${hash}`;
  const [currentChain, setCurrentChain] = useState<any>({});

  const handleOpenTx = () => {
    window.open(transactionUrl, "_blank");
  };

  const { chainId } = useWeb3React();

  useEffect(() => {
    const targetChain = BlockchainNets.find(net => net.chainId === chainId);
    setCurrentChain(targetChain);
  }, [chainId]);

  const transactionUrl = `${currentChain?.scan?.url}/tx/${hash}`;

  return (
    <Modal showCloseIcon isOpen={open} onClose={onClose} className={classes.root} size="small">
      {txSuccess === true ? (
        <img src={require("assets/pixImages/result_success.png")} />
      ) : txSuccess === false ? (
        <img src={require("assets/pixImages/result_fail.png")} />
      ) : (
        <div style={{ position: "relative" }}>
          <img className={classes.loader} src={require("assets/pixImages/loading.png")} />
          <div className={classes.ethImg}>
            <img src={require("assets/pixImages/eth.png")} />
          </div>
        </div>
      )}
      <Box className={classes.title} mt={4}>
        {txSuccess === true
          ? "Transaction successful"
          : txSuccess === false
          ? "Transaction failed"
          : "Transaction in progress"}
      </Box>
      <Box className={classes.header1} mt={1} mb={2}>
        {txSuccess === true
          ? "Everything went well. You can check your transaction link below."
          : txSuccess === false
          ? "Unfortunatelly transaction didn’t went through, please try again later. You can check your transaction link below."
          : " Transaction is proceeding on Polygon Chain. \n This can take a moment, please be patient..."}
      </Box>
      {hash && (
        <>
          <CopyToClipboard
            text={hash}
            onCopy={() => {
              showAlertMessage("Copied to clipboard", { variant: "success" });
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="center" style={{ cursor: "pointer" }}>
              <Box className={classes.header1} mr={2}>
                Hash:
              </Box>
              <Box className={classes.header2} ml={1} mr={1}>
                {hash.substr(0, 18) + "..." + hash.substr(hash.length - 3, 3)}
              </Box>
              <CopyIcon />
            </Box>
          </CopyToClipboard>
          <PrimaryButton
            size="medium"
            style={{ background: Color.MusicDAOGreen, marginTop: "24px" }}
            isRounded
            onClick={handleOpenTx}
          >
            Check on {currentChain?.name} Scan
          </PrimaryButton>
        </>
      )}
    </Modal>
  );
}

const CopyIcon = () => (
  <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.5833 10.0833H14.8333C15.7538 10.0833 16.5 9.37445 16.5 8.5V2.95833C16.5 2.08388 15.7538 1.375 14.8333 1.375H9C8.07953 1.375 7.33333 2.08388 7.33333 2.95833V4.14583M3.16667 15.625H9C9.92047 15.625 10.6667 14.9161 10.6667 14.0417V8.5C10.6667 7.62555 9.92047 6.91667 9 6.91667H3.16667C2.24619 6.91667 1.5 7.62555 1.5 8.5V14.0417C1.5 14.9161 2.24619 15.625 3.16667 15.625Z"
      stroke="#65CB63"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
