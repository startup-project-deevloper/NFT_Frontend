import React, { useState, useEffect } from "react";
import { Modal, StyledDivider } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import RequestChangeNFT from "./components/RequestChangeNFT";
import LockNFT from "./components/LockNFT";
import ProgressBar from "./components/ProgressBar";
import VerifyNFTLock from "./components/VerifyNFTLock";
import { ChangeToSyntheticModalStyles } from "./index.styles";

export default ({
  open,
  onClose,
  onSuccess,
  selectedNFT,
  currentNFT
}) => {
  const classes = ChangeToSyntheticModalStyles();
  const [step, setStep] = useState<number>(0);
  const [syntheticNFT, setSyntheticNFT] = useState<any>();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [curNFT, setCurNFT] = useState<any>();

  const handleCompleteStep = stepIndex => {
    setStep(stepIndex + 1);
    if (completedSteps.includes(stepIndex)) {
      return;
    }
    setCompletedSteps([...completedSteps, stepIndex]);
    if (stepIndex === 0) {
      onSuccess();
    }
  };

  useEffect(() => {
    if (currentNFT.NftId !== selectedNFT.BlockchainId) {
      setCurNFT(currentNFT)
    }
  }, [currentNFT])

  return (
    <Modal size="small" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <Box display="flex" flexDirection="column">
        {step < 3 && <ProgressBar step={step} setStep={setStep} completedSteps={completedSteps} />}
        <Box className={classes.divider}>
          <StyledDivider type="solid" color="#DAE6E5" />
        </Box>
        {step === 0 ? (
          <RequestChangeNFT
            onClose={onClose}
            onCompleted={(nft) => {
              setSyntheticNFT(nft);
              handleCompleteStep(0);
            }}
            selectedNFT={selectedNFT}
            currentNFT={curNFT}
          />
        ) : step === 1 ? (
          <LockNFT
            onClose={onClose}
            onCompleted={() => handleCompleteStep(1)}
            selectedNFT={selectedNFT}
            currentNFT={curNFT}
          />
        ) : (
          <VerifyNFTLock onClose={onClose} onCompleted={() => handleCompleteStep(2)} nft={syntheticNFT} />
        )}
      </Box>
    </Modal>
  );
};
