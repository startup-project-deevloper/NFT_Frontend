import React, { useState } from "react";
import { Modal, StyledDivider } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import CreateContract from "./components/CreateContract";
import LockNFT from "./components/LockNFT";
import ProgressBar from "./components/ProgressBar";
import VerifyNFTLock from "./components/VerifyNFTLock";
import { fractionaliseModalStyles } from "./index.styles";

export const FractionaliseModal = ({
  open,
  onClose,
  onSuccess,
  selectedNFT,
  supplyToKeep,
  priceFraction,
}) => {
  const classes = fractionaliseModalStyles();
  const [step, setStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleCompleteStep = stepIndex => {
    if (completedSteps.includes(stepIndex)) {
      return;
    }
    setCompletedSteps([...completedSteps, stepIndex]);
    if (stepIndex === 0) {
      onSuccess();
    }
  };

  return (
    <Modal size="small" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <Box display="flex" flexDirection="column">
        <ProgressBar step={step} setStep={setStep} completedSteps={completedSteps} />
        <Box className={classes.divider}>
          <StyledDivider type="solid" color="#DAE6E5" />
        </Box>
        {step === 0 ? (
          <CreateContract
            onClose={onClose}
            onCompleted={() => handleCompleteStep(0)}
            selectedNFT={selectedNFT}
            supplyToKeep={supplyToKeep}
            priceFraction={priceFraction}
          />
        ) : step === 1 ? (
          <LockNFT
            onClose={onClose}
            onCompleted={() => handleCompleteStep(1)}
            needLockLaterBtn={false}
            selectedNFT={selectedNFT}
          />
        ) : (
          <VerifyNFTLock onClose={onClose} onCompleted={() => handleCompleteStep(2)} />
        )}
      </Box>
    </Modal>
  );
};
