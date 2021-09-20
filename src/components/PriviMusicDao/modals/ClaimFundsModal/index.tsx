import React, { useState } from "react";
import { Color, Modal, PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { ClaimFundsModalStyles } from "./index.styles";

export const ClaimFundsModal = (props: any) => {
  const classes = ClaimFundsModalStyles();
  const [step, setStep] = useState<number>(0);

  const firstScreen = () => (
    <Box py={3}>
      <img src={require("assets/emojiIcons/handshake.png")} />
      <Box className={classes.header1} color={Color.MusicDAODark} mt={2}>
        Withdraw Proposal
      </Box>
      <Box className={classes.header2} mt={2} mb={4} color={Color.MusicDAOLightBlue} style={{ opacity: 0.9 }}>
        Send withdrawal proposal to all collaborators to be able to move your funds from this Pod. You can
        withdraw part of your funds to cover costs of productions, artworks for songs and more.
      </Box>
      <PrimaryButton
        size="medium"
        onClick={() => setStep(prev => prev + 1)}
        isRounded
        style={{ width: "50%", background: Color.MusicDAODark }}
      >
        Next
      </PrimaryButton>
    </Box>
  );

  const secondScreen = () => (
    <Box py={1}>
      <Box className={classes.header3} color={Color.MusicDAODark}>
        Withdraw Proposal
      </Box>
      <Box className={classes.greenBox} mt={3} width={1} p={3}>
        <Box className={classes.header4} color={Color.MusicDAOGreen}>
          AVAILABLE FUNDS
        </Box>
        <Box className={classes.header5} color={Color.MusicDAODark}>
          2425 <span>USD</span>
        </Box>
      </Box>
      <Box mt={2}>
        <InputWithLabelAndTooltip
          type="text"
          labelName="Address"
          style={{ background: "rgba(218, 230, 229, 0.4)", border: "1px solid #DADADB" }}
        />
      </Box>
      <Box>
        <InputWithLabelAndTooltip
          type="text"
          labelName="Amount to withdraw"
          style={{ background: "rgba(218, 230, 229, 0.4)", border: "1px solid #DADADB" }}
        />
      </Box>
      <Box className={classes.header2} mt={2} mb={4} color={Color.MusicDAOLightBlue} style={{ opacity: 0.9 }}>
        Before funds get withrawed, they will have to approve and sign this withdraw proposal.
      </Box>
      <PrimaryButton
        size="medium"
        onClick={() => setStep(prev => prev + 1)}
        isRounded
        style={{ width: "50%", background: Color.MusicDAODark }}
      >
        Submit Proposal
      </PrimaryButton>
      <Box display="flex" mt={2} alignItems="center" justifyContent="center">
        <ChatIcon />
        <Box className={classes.header6} color={Color.MusicDAOGreen} ml={1}>
          Start Discussion Chat With Collaborators
        </Box>
      </Box>
    </Box>
  );

  const thirdScreen = () => (
    <Box py={1}>
      <img src={require("assets/emojiIcons/sign_lock.png")} />
      <Box className={classes.header1} color={Color.MusicDAODark} mt={2}>
        Approval Request Sent
      </Box>
      <Box className={classes.header2} my={2} color={Color.MusicDAOLightBlue} style={{ opacity: 0.9 }}>
        We have sent a notification to the artists to review your funds distribution proposal.
      </Box>
      <Box className={classes.header2} mb={4} color={Color.MusicDAOLightBlue} style={{ opacity: 0.9 }}>
        We’ll keep you posted on the status of this transaction.
      </Box>
      <PrimaryButton
        size="medium"
        onClick={() => props.openProposal()}
        isRounded
        style={{ width: "50%", background: Color.MusicDAODark }}
      >
        View Proposal on Pod
      </PrimaryButton>
    </Box>
  );

  return (
    <Modal
      size="small"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
      className={classes.root}
    >
      {step === 0 ? firstScreen() : step === 1 ? secondScreen() : thirdScreen()}
    </Modal>
  );
};

const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.99935 0.163086C7.42039 0.169234 4.96123 1.25204 3.21524 3.15106C1.46924 5.04921 0.596336 7.59052 0.806052 10.1612C1.01585 12.7317 2.28924 15.098 4.31949 16.6888C5.41228 17.7362 6.7033 18.5547 8.11662 19.0964C10.1754 19.8995 12.4325 20.0493 14.5797 19.526C15.1522 19.3961 15.548 18.7729 15.3374 18.3102C15.1722 17.9506 15.1407 17.5625 15.0223 17.1944C15.0223 17.179 15.0223 17.1629 15.0338 17.1475V17.1467C17.2677 15.6851 18.7609 13.329 19.1298 10.6845C19.4979 8.04021 18.7048 5.36583 16.9549 3.34933C15.205 1.33282 12.6691 0.170919 9.99947 0.163246L9.99935 0.163086ZM6.00942 11.1285C5.54988 11.1324 5.13412 10.8565 4.95736 10.4323C4.78061 10.0081 4.87897 9.51857 5.20481 9.19503C5.53064 8.87073 6.02093 8.77697 6.44361 8.95603C6.86704 9.13586 7.1391 9.55392 7.13294 10.0135C7.12679 10.6298 6.62575 11.127 6.00942 11.1285ZM9.98715 11.1285H9.98792C9.53068 11.1247 9.12108 10.8465 8.94971 10.4231C8.77757 10.0004 8.87747 9.51473 9.20176 9.19351C9.52682 8.87229 10.0125 8.77776 10.4336 8.95373C10.8555 9.13048 11.1291 9.54316 11.1283 9.99964C11.1222 10.6252 10.6135 11.1301 9.9879 11.1309L9.98715 11.1285ZM13.9887 11.1285H13.9895C13.5307 11.1316 13.1165 10.8573 12.9397 10.4346C12.763 10.0112 12.8583 9.52396 13.1818 9.1989C13.5053 8.87461 13.9925 8.77701 14.416 8.95299C14.8394 9.1282 15.1153 9.54165 15.1145 9.99966C15.1153 10.6229 14.6119 11.1286 13.9895 11.1309L13.9887 11.1285Z"
      fill="#65CB63"
    />
  </svg>
);
