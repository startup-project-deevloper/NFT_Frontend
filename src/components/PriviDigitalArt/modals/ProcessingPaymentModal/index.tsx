import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import Box from "shared/ui-kit/Box";
import { Color, Modal, PrimaryButton } from "shared/ui-kit";
import { ReactComponent as CopyIcon } from "assets/icons/copy-icon.svg";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { useProcessingPaymentModalStyles } from "./index.styles";

require("dotenv").config();
const isDev = process.env.REACT_APP_ENV === "dev";

export default function ProcessingPaymentModal({
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
  const classes = useProcessingPaymentModalStyles();
  const { showAlertMessage } = useAlertMessage();

  const url = `${isDev ? "https://mumbai.polygonscan.com/tx/" : "https://mumbai.polygonscan.com/tx/"}${hash}`;

  const handleOpenTx = () => {
    window.open(url, "_blank");
  };

  return (
    <Modal showCloseIcon isOpen={open} onClose={onClose} className={classes.root} size="small">
      {txSuccess === true ? (
        <img src={require("assets/musicDAOImages/result_success.png")} />
      ) : txSuccess === false ? (
        <img src={require("assets/musicDAOImages/result_fail.png")} />
      ) : (
        <LoadingWrapper loading={true} theme="blue" iconWidth="120px" iconHeight="120px"></LoadingWrapper>
      )}
      <Box className={classes.title}>
        {txSuccess === true
          ? "Payment Succesfull"
          : txSuccess === false
          ? "Transaction failed"
          : "Processing Payment"}
      </Box>
      <Box className={classes.header1} mt={1} mb={3}>
        {txSuccess === true ? (
          "You have succesfully paid 2455 USDT for your NFT Reservation"
        ) : txSuccess === false ? (
          <>
            Unfortunatelly transaction didn’t went through, please try again later.
            <br />
            You can check your transaction link below
          </>
        ) : (
          <>
            Transaction is proceeding on Polygon Chain.
            <br />
            This can take a moment, please be patient...
          </>
        )}
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
              <Box className={classes.header1} mr={0.5}>
                Hash:
              </Box>
              <Box className={classes.header2} mr={1}>
                {hash.substr(0, 18) + "..." + hash.substr(hash.length - 3, 3)}
              </Box>
              <CopyIcon style={{ width: "100%" }} />
            </Box>
          </CopyToClipboard>
          <PrimaryButton size="medium" className={classes.scanButton} onClick={handleOpenTx}>
            Check on Polygon Scan
          </PrimaryButton>
        </>
      )}
    </Modal>
  );
}
