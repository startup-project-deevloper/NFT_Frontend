import React, { useState } from "react";
import { Modal, StyledDivider } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";

import CreateContract from "./components/CreateContract";
import LockNFT from "./components/LockNFT";
import ProgressBar from "./components/ProgressBar";

import { useWithdrawNFTModelStyles } from "./index.style";

export default function WithdrawNFTModel({ open, onClose }) {
  const classes = useWithdrawNFTModelStyles();
  const [step, setStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

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
