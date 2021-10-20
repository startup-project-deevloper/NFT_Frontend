import React, { FC } from "react";
import { useWeb3React } from "@web3-react/core";
import { Box } from "@material-ui/core";

import { Modal } from "../../Modal";
import { switchNetworkModalStyles } from "./SwitchNetworkModal.styles";
import { Color, PrimaryButton } from "shared/ui-kit";

declare let window: any;
const isDev = process.env.REACT_APP_ENV === "dev";

interface IProps {
  open: boolean;
  onClose: () => void;
  onNext?: () => void;
}

export const SwitchNetworkModal: FC<IProps> = props => {
  const classes = switchNetworkModalStyles();
  const { chainId } = useWeb3React();

  const { open, onClose, onNext } = props;
  const [isSubmitted, setSubmitted] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (open) {
      setSubmitted(false);
    }
  }, [open]);

  // React.useEffect(() => {
  //   if (chainId === 80001 && isSubmitted) {
  //     onNext && onNext();
  //   }
  // }, [chainId]);

  const handleClose = () => {
    onClose && onClose();
  };

  const switchNetwork = (chainId: number): Promise<any> => {
    return new Promise(async resolve => {
      try {
        await (window as any).ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
        resolve(true);
      } catch (error) {
        if (error.code === 4902) {
          try {
            await (window as any).ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${chainId.toString(16)}`,
                  // ...chainInfoMap[chainId],
                },
              ],
            });
            resolve(true);
          } catch (error) {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      }
    });
  };
  
  const onSuccess = async () => {
    // if (chainId != 80001) {
    //   await switchNetwork(80001);
    //   setSubmitted(true);
    // } else {
      onNext && onNext();
    // }
  };

  return (
    <Modal isOpen={open} onClose={handleClose} size="small" className={classes.container}>
      <Box display="flex" flexDirection="column" alignItems="center" pt={2} pb={2}>
        <span className={classes.warning}>⚠️</span>
        <h1 className={classes.title}>Important</h1>
        <p className={classes.description}>
          The platform is running on  <span>RINKEBY and MUMBAI networks</span>, make sure to at no times send any tokens from your <span>MAINNET</span> addresses to any of the addresses here.
        </p>
        <PrimaryButton size="medium" className={classes.button} onClick={onSuccess}>
          I understood it
        </PrimaryButton>
      </Box>
    </Modal>
  );
};
