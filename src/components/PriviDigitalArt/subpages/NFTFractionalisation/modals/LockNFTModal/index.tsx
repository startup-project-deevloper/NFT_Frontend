import React, { useState } from "react";
import { Modal, StyledDivider } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import LockNFT from "../FractionaliseModal/components/LockNFT";
import VerifyNFTLock from "../FractionaliseModal/components/VerifyNFTLock";
import ProgressBar from "../FractionaliseModal/components/ProgressBar";

import { lockNFTModalStyles } from "./index.styles";

export const LockNFTModal = ({ open, onClose, nft, onLockCompleted, onVerifyCompleted }) => {
  const classes = lockNFTModalStyles();
  const [step, setStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [initialNFT, setInitialNFT] = useState(nft);

  const handleCompleteStep = stepIndex => {
    setStep(stepIndex + 1);
    if (completedSteps.includes(stepIndex)) {
      return;
    }
    setCompletedSteps([...completedSteps, stepIndex]);
    if (stepIndex === 1) {
      onLockCompleted();
    } else if (stepIndex === 2) {
      onVerifyCompleted();
    }
  };

  return (
    <Modal size="small" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <Box display="flex" flexDirection="column">
        {step < 3 && <ProgressBar step={step} setStep={setStep} completedSteps={completedSteps} />}
        <Box className={classes.divider}>
          <StyledDivider type="solid" color="#DAE6E5" />
        </Box>
        {step === 1 ? (
          <LockNFT
            onClose={onClose}
            onCompleted={() => handleCompleteStep(1)}
            needLockLaterBtn={false}
            selectedNFT={nft}
            syntheticID={nft.SyntheticID}
          />
        ) : (
          <VerifyNFTLock onClose={onClose} onCompleted={() => handleCompleteStep(2)} nft={initialNFT} />
        )}
      </Box>
    </Modal>
  );
};
