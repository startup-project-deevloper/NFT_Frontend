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
  onComplete,
  selectedNFT,
  supplyToKeep,
  priceFraction,
}) => {
  const classes = fractionaliseModalStyles();
  const [step, setStep] = useState<number>(0);
  const [syntheticNFT, setSyntheticNFT] = useState<any>();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const handleCompleteStep = stepIndex => {
    if (stepIndex === 2) {
      onComplete()
    }
    setStep(stepIndex + 1);
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
        {step < 3 && <ProgressBar step={step} setStep={setStep} completedSteps={completedSteps} />}
        <Box className={classes.divider}>
          <StyledDivider type="solid" color="#DAE6E5" />
        </Box>
        {step === 0 ? (
          <CreateContract
            onClose={onClose}
            onCompleted={nft => {
              setSyntheticNFT(nft);
              handleCompleteStep(0);
            }}
            selectedNFT={selectedNFT}
            supplyToKeep={supplyToKeep}
            priceFraction={priceFraction}
          />
        ) : step === 1 ? (
          <LockNFT
            onClose={onClose}
            onCompleted={() => handleCompleteStep(1)}
            selectedNFT={selectedNFT}
            syntheticID={syntheticNFT?.SyntheticID}
          />
        ) : (
          <VerifyNFTLock onClose={onClose} onCompleted={() => handleCompleteStep(2)} nft={syntheticNFT} />
        )}
      </Box>
    </Modal>
  );
};
