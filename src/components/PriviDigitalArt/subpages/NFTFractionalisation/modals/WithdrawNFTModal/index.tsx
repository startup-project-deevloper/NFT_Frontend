import React, { useState } from "react";
import { Modal, StyledDivider } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { BlockchainNets } from "shared/constants/constants";

import CreateContract from "./components/CreateContract";
import LockNFT from "./components/LockNFT";
import ProgressBar from "./components/ProgressBar";

import { useWithdrawNFTModelStyles } from "./index.style";

export default function WithdrawNFTModel({ open, onClose, nft }) {
  const classes = useWithdrawNFTModelStyles();
  const [step, setStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { account, library } = useWeb3React();
  const handleCompleteStep = stepIndex => {
    setStep(stepIndex + 1);
    if (completedSteps.includes(stepIndex)) {
      return;
    }
    setCompletedSteps([...completedSteps, stepIndex]);
    if (stepIndex === 0) {
      // onSuccess();
    }
  };

  const withdrawNft = async () => {
    const targetChain = BlockchainNets[1];
    const web3 = new Web3(library.provider);
    const web3APIHandler = targetChain.apiHandler;
    await web3APIHandler.SyntheticCollectionManager.exitProtocol(web3, account, nft)
  }

  return (
    <Modal size="small" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <Box display="flex" flexDirection="column">
        {step < 2 && <ProgressBar step={step} setStep={setStep} completedSteps={completedSteps} />}
        <Box className={classes.divider}>
          <StyledDivider type="solid" color="#DAE6E5" />
        </Box>
        {step === 0 ? (
          <CreateContract
            onClose={onClose}
            onCompleted={nft => {}}
          />
        ) : (
          <LockNFT onClose={onClose} onCompleted={() => handleCompleteStep(1)} />
        )}
      </Box>
    </Modal>
  );
}
