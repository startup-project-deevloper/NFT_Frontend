import { Box } from "@material-ui/core";
import React from "react";
import { Modal } from "shared/ui-kit";
import { useTransactionResultModalStyles } from "./index.styles";
import { CopyToClipboard } from "react-copy-to-clipboard";

require("dotenv").config();
const isProd = process.env.REACT_APP_ENV === "prod";

export default function TransactionResultModal({
  open,
  onClose,
  isSuccess,
  hash,
  network
}: {
  open: boolean;
  onClose: () => void;
  hash?: string;
  isSuccess?: boolean;
  network?: string
}) {
  const classes = useTransactionResultModalStyles();
  const handleCheck = () => {
    if (network) {
      if (network === 'Polygon') {
        window.open(`https://mumbai.polygonscan.com/tx/${hash}`, "_blank");
      } else if (network === 'Ethereum') {
        window.open(`https://rinkeby.etherscan.io/tx/${hash}`, "_blank");
      }
    } else {
      window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${hash}`, "_blank");
    }
  };

  return (
    <Modal showCloseIcon isOpen={open} onClose={onClose} className={classes.root} size="medium">
      <div className={classes.iconContainer}>{isSuccess ? <SuccessIcon /> : <FailIcon />}</div>

      <div className={classes.title}>{isSuccess ? "Transaction successful" : "Transaction Failed"}</div>

      <Box marginX={10} className={classes.text}>
        {isSuccess ? (
          "Everything went well. You can check your transaction link below."
        ) : (
          <>
            Unfortunatelly transaction didn’t went through, please try again later.
            <br /> {hash ? "You can check your transaction link below" : ""}
          </>
        )}
      </Box>
      {hash && (
        <CopyToClipboard text={hash}>
          <Box mt="20px" display="flex" alignItems="center" className={classes.hash}>
            Hash:
            <Box color="#4218B5" mr={1} ml={1}>
              {hash.substr(0, 18) + "..." + hash.substr(hash.length - 3, 3)}
            </Box>
            <CopyIcon />
          </Box>
        </CopyToClipboard>
      )}

      {hash && (
        <button className={classes.buttonCheck} onClick={handleCheck}>
          Check on {network ?? 'Polygon'} Scan
        </button>
      )}
    </Modal>
  );
}

export const FailIcon = () => (
  <svg width="135" height="135" viewBox="0 0 135 135" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      opacity="0.1"
      d="M81.079 133.251C72.4445 135.034 63.5432 135.099 54.8835 133.443C46.2238 131.786 37.9752 128.44 30.6087 123.595C23.2423 118.75 16.9021 112.502 11.9503 105.207C6.99853 97.9124 3.53206 89.7136 1.74884 81.079C-0.0343869 72.4445 -0.0994465 63.5432 1.55737 54.8835C3.21419 46.2238 6.56045 37.9752 11.4051 30.6087C16.2497 23.2422 22.4978 16.9021 29.7927 11.9503C37.0876 6.99853 45.2864 3.53206 53.921 1.74884C62.5555 -0.0343873 71.4568 -0.0994462 80.1165 1.55737C88.7762 3.2142 97.0248 6.56045 104.391 11.4051C111.758 16.2497 118.098 22.4978 123.05 29.7927C128.001 37.0876 131.468 45.2864 133.251 53.921C135.034 62.5555 135.099 71.4568 133.443 80.1165C131.786 88.7762 128.44 97.0248 123.595 104.391C118.75 111.758 112.502 118.098 105.207 123.05C97.9124 128.001 89.7136 131.468 81.079 133.251L81.079 133.251Z"
      stroke="#281136"
      stroke-width="0.722591"
    />
    <path
      opacity="0.05"
      d="M81.079 133.251C72.4445 135.034 63.5432 135.099 54.8835 133.443C46.2238 131.786 37.9752 128.44 30.6087 123.595C23.2423 118.75 16.9021 112.502 11.9503 105.207C6.99853 97.9124 3.53206 89.7136 1.74884 81.079C-0.0343869 72.4445 -0.0994465 63.5432 1.55737 54.8835C3.21419 46.2238 6.56045 37.9752 11.4051 30.6087C16.2497 23.2422 22.4978 16.9021 29.7927 11.9503C37.0876 6.99853 45.2864 3.53206 53.921 1.74884C62.5555 -0.0343873 71.4568 -0.0994462 80.1165 1.55737C88.7762 3.2142 97.0248 6.56045 104.391 11.4051C111.758 16.2497 118.098 22.4978 123.05 29.7927C128.001 37.0876 131.468 45.2864 133.251 53.921C135.034 62.5555 135.099 71.4568 133.443 80.1165C131.786 88.7762 128.44 97.0248 123.595 104.391C118.75 111.758 112.502 118.098 105.207 123.05C97.9124 128.001 89.7136 131.468 81.079 133.251L81.079 133.251Z"
      stroke="#281136"
      stroke-width="0.722591"
    />
    <circle cx="67.5" cy="67.5" r="51.5" fill="#17172D" />
    <circle cx="67.5" cy="67.5" r="51.5" fill="#FBF4F2" />
    <path
      d="M50.1172 86.8501L88.8155 48.1504M50.1178 48.1514L88.8176 86.8497"
      stroke="url(#paint0_linear)"
      stroke-width="8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="9.83119"
        y1="-15.1036"
        x2="60.8936"
        y2="-23.401"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#C22684" />
        <stop offset="1" stop-color="#F84B4B" />
      </linearGradient>
    </defs>
  </svg>
);

export const SuccessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="78" height="78" viewBox="0 0 78 78" fill="none">
    <circle opacity="0.2" cx="38.665" cy="39.3438" r="38.5" fill="#65CB63" />
    <path
      d="M24.8711 39.3125L34.0879 48.5293L52.459 30.1582"
      stroke="#65CB63"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
    <path
      d="M13.5833 9.86458H14.8333C15.7538 9.86458 16.5 9.1557 16.5 8.28125V2.73958C16.5 1.86513 15.7538 1.15625 14.8333 1.15625H9C8.07953 1.15625 7.33333 1.86513 7.33333 2.73958V3.92708M3.16667 15.4063H9C9.92047 15.4063 10.6667 14.6974 10.6667 13.8229V8.28125C10.6667 7.4068 9.92047 6.69792 9 6.69792H3.16667C2.24619 6.69792 1.5 7.4068 1.5 8.28125V13.8229C1.5 14.6974 2.24619 15.4063 3.16667 15.4063Z"
      stroke="#4218B5"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
