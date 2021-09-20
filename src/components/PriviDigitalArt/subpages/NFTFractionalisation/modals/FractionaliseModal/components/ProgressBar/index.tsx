import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import { StepButton } from "@material-ui/core";

declare let window: any;
const isDev = process.env.REACT_APP_ENV === "dev";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      "& .MuiStepConnector-alternativeLabel": {
        top: 0,
      },
      "& .MuiStepLabel-alternativeLabel": {
        "&.MuiStepLabel-iconContainer": {
          border: "1px solid #A4A4A4",
          padding: 2,
          borderRadius: "50%",
          background: "#fff",
          zIndex: 99,
        },
        "& svg": {
          width: 40,
          height: 40,
        },
        "& .MuiStepIcon-completed": {
          color: "#4218B5",
          opacity: 0.4,
        },
        "& .MuiStepIcon-active": {
          color: "#4218B5",
        },
      },
      [theme.breakpoints.down("sm")]: {
        padding: 10,

        "& .MuiStepLabel-labelContainer": {
          display: "none",
        },
        "& .MuiStepConnector-alternativeLabel": {
          top: 22,
        },
      },
    },
  })
);

function getSteps() {
  return ["Lock NFT on Ethereum", "Create contract on Polygon"]; //'Verify'
}

interface ProgressBarProps {
  step: number;
  setStep: any;
  completedSteps: number[];
}

export default function ProgressBar({ step = 0, setStep, completedSteps }: ProgressBarProps) {
  const classes = useStyles();
  const steps = getSteps();

  const handleStep = (index: number) => async () => {
    // If previous step is completed, then selectable.
    if (completedSteps.includes(index - 1)) {
      if (index === 1) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: isDev ? "0x13881" : "0x89" }],
          });
        } catch (err) {
          return;
        }
      }
      setStep(index);
    }
  };

  const isStepComplete = (index: number) => {
    return completedSteps.includes(index);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={step} nonLinear alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton onClick={handleStep(index)} completed={isStepComplete(index)}>
              {label}
            </StepButton>
            {/* <StepLabel>{label}</StepLabel> */}
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
