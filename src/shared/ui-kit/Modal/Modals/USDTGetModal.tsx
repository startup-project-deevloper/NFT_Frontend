import { Box } from "@material-ui/core";
import React, { FC } from "react";
import { Modal } from "../Modal";
import { usdtGetModalStyles } from "./USDTGetModal.styles";
import { Color, PrimaryButton } from "shared/ui-kit";

declare let window: any;

interface IProps {
  open: boolean;
  onClose: () => void;
  amount: string;
  account: string;
}

export const USDTGetModal: FC<IProps> = (props) => {
  const classes = usdtGetModalStyles();

  const { open, onClose, amount, account } = props;

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
          address: "0xaE502540f0CEa5475D23EbbA48AacD8469bceFe4",
          symbol: "TRAX",
          decimals: 18,
          image:
            "https://uploadsdev.ams3.digitaloceanspaces.com/launchpad/tokenFunding-app-token-photo/7183d138-585a-4886-868d-e83454d81b562WAkNq2M7nIg6Iu0HzBA.gif",
        },
      },
    });
    handleClose();
  };

  return (
    <Modal isOpen={open} onClose={handleClose} showCloseIcon size="small" className={classes.container}>
      <Box display="flex" flexDirection="column" alignItems="center" pt={4} pb={4}>
        <img src={require("assets/pixImages/usdt.png")} alt="PRIVI PIX" width={70} />
        <h1 className={classes.title}>Received {amount}<br /> Test USDT Token</h1>
        <p className={classes.description}>
          You have just received&nbsp;<span>{amount} USDT Test Tokens</span>&nbsp;to try out the Privi
          Exchange features before we rollout the Mainnet version shortly.
          <br />
          <br />
          <strong>Include USDT Testnet Token</strong>&nbsp;on your token list with Metamask. The address is
          <br />
          <span>{account}</span>
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
