import { Box } from "@material-ui/core";
import React, { FC } from "react";
import { Modal } from "../Modal";
import { usdtGetModalStyles } from "./USDTGetModal.styles";
import { Color, PrimaryButton } from "shared/ui-kit";

declare let window: any;

interface IProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  account: string;
}

const USDT_ADDRESS = "0x2cA48b8c2d574b282FDAB69545646983A94a3286";

export const USDTGetModal: FC<IProps> = (props) => {
  const classes = usdtGetModalStyles();

  const { open, onClose, amount } = props;

  const handleClose = () => {
    onClose && onClose();
  };

  const onAddTrax = async () => {
    if (!window.ethereum) {
      return;
    }
    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: USDT_ADDRESS,
          symbol: "USDT",
          decimals: 18,
          image:
            "chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/images/contract/usdt.svg",
        },
      },
    });
    handleClose();
  };

  return (
    <Modal isOpen={open} onClose={handleClose} showCloseIcon size="small" className={classes.container}>
      <Box display="flex" flexDirection="column" alignItems="center" pt={4} pb={4}>
        <img src={require("assets/pixImages/usdt.png")} alt="PIX" width={70} />
        <h1 className={classes.title}>Received {amount}<br /> Test USDT Token</h1>
        <p className={classes.description}>
          You have just received&nbsp;<span>{amount} USDT Test Tokens</span>&nbsp;to try out the Pix App features before we rollout the Mainnet version shortly.
          <br />
          <br />
          <strong>Include USDT Testnet Token</strong>&nbsp;on your token list with Metamask. The address is
          <br />
          <span>{USDT_ADDRESS}</span>
        </p>
        <PrimaryButton size="medium" className={classes.button} onClick={onAddTrax}>
          Add USDT to Metamask +
          <img
            src={require("assets/walletImages/metamask.svg")}
            alt=""
            style={{ marginLeft: "8px", height: "24px", width: "24px" }}
          />
        </PrimaryButton>
      </Box>
    </Modal>
  );
};
