import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Modal } from "shared/ui-kit";
import { Box } from "@material-ui/core";
import { BlueLinearProgress } from "shared/ui-kit/LinearProgress";

const fileUploadingModalStyles = makeStyles(theme => ({
  root: {
    width: "600px !important",
  },
  modalContent: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#431AB7",
  },
  progressImageContent: {
    minHeight: 340,
    position: "relative",
  },
  uploadImg: {
    objectFit: "none",
  },
  progressValue: {
    fontFamily: "Agrandir",
    fontSize: 30,
  },
  uploading: {
    fontSize: 32,
    fontWeight: 800,
  },
  description: {
    fontFamily: "Montserrat",
    fontWeight: 500,
    fontSize: 16,
    lineHeight: "150%",
    textAlign: "center",
    color: "#54658F",
    margin: "0 70px",
    [theme.breakpoints.down("xs")]: {
      margin: "0 40px",
    },
  },
  "@keyframes pointmove1": {
    "0%": { top: "50%", left: "50%", width: 0, height: 0 },
    "19%": { width: 0, height: 0 },
    "20%": { width: 9, height: 9 },
    "46%": { width: 9, height: 9 },
    "48%": { width: 0, height: 0 },
    "100%": { top: "28%", left: "70%", width: 0, height: 0 },
  },
  "@keyframes pointmove2": {
    "0%": { top: "50%", left: "50%", width: 0, height: 0 },
    "19%": { width: 0, height: 0 },
    "20%": { width: 9, height: 9 },
    "46%": { width: 9, height: 9 },
    "48%": { width: 0, height: 0 },
    "100%": { top: "67%", left: "70%", width: 0, height: 0 },
  },
  "@keyframes pointmove3": {
    "0%": { top: "55%", left: "49%", width: 0, height: 0 },
    "19%": { width: 0, height: 0 },
    "20%": { width: 9, height: 9 },
    "46%": { width: 9, height: 9 },
    "48%": { width: 0, height: 0 },
    "100%": { top: "78%", left: "49%", width: 0, height: 0 },
  },
  "@keyframes pointmove4": {
    "0%": { top: "51%", left: "49%", width: 0, height: 0 },
    "19%": { width: 0, height: 0 },
    "20%": { width: 9, height: 9 },
    "46%": { width: 9, height: 9 },
    "48%": { width: 0, height: 0 },
    "100%": { top: "65%", left: "29%", width: 0, height: 0 },
  },
  "@keyframes pointmove5": {
    "0%": { top: "48%", left: "48%", width: 0, height: 0 },
    "19%": { width: 0, height: 0 },
    "20%": { width: 9, height: 9 },
    "46%": { width: 9, height: 9 },
    "48%": { width: 0, height: 0 },
    "100%": { top: "31%", left: "29%", width: 0, height: 0 },
  },
  "@keyframes pointmove6": {
    "0%": { top: "50%", left: "49%", width: 0, height: 0 },
    "19%": { width: 0, height: 0 },
    "20%": { width: 9, height: 9 },
    "46%": { width: 9, height: 9 },
    "48%": { width: 0, height: 0 },
    "100%": { top: "10%", left: "49%", width: 0, height: 0 },
  },

  point: {
    // width: 10, height: 10,
    // top: "50%", left: "50%",
    background: "#431AB7",
    borderRadius: "100vh",
    position: "absolute",
  },
  move1: {
    WebkitAnimation: "$pointmove1 3s ease infinite",
    animation: "$pointmove1 3s ease infinite",
    MozAnimation: "$pointmove1 s ease infinite",
  },
  move2: {
    WebkitAnimation: "$pointmove2 3s ease infinite",
    animation: "$pointmove2 3s ease infinite",
    MozAnimation: "$pointmove2 s ease infinite",
  },
  move3: {
    WebkitAnimation: "$pointmove3 3s ease infinite",
    animation: "$pointmove3 3s ease infinite",
    MozAnimation: "$pointmove3 s ease infinite",
  },
  move4: {
    WebkitAnimation: "$pointmove4 3s ease infinite",
    animation: "$pointmove4 3s ease infinite",
    MozAnimation: "$pointmove4 s ease infinite",
  },
  move5: {
    WebkitAnimation: "$pointmove5 3s ease infinite",
    animation: "$pointmove5 3s ease infinite",
    MozAnimation: "$pointmove5 s ease infinite",
  },
  move6: {
    WebkitAnimation: "$pointmove6 3s ease infinite",
    animation: "$pointmove6 3s ease infinite",
    MozAnimation: "$pointmove6 s ease infinite",
  },
}));

const FileUploadingModal = (props: any) => {
  const classes = fileUploadingModalStyles();

  return (
    <Modal size="medium" isOpen={props.open} onClose={props.handleClose} className={classes.root}>
      <Box className={classes.modalContent}>
        <div className={classes.progressImageContent}>
          <img
            src={require("assets/pixImages/file_upload.png")}
            alt="file uploading"
            className={classes.uploadImg}
          />
          <Box className={`${classes.point} ${classes.move1}`} />
          <Box className={`${classes.point} ${classes.move2}`} />
          <Box className={`${classes.point} ${classes.move3}`} />
          <Box className={`${classes.point} ${classes.move4}`} />
          <Box className={`${classes.point} ${classes.move5}`} />
          <Box className={`${classes.point} ${classes.move6}`} />
        </div>
        <BlueLinearProgress
          variant="determinate"
          value={Math.floor(props.progress)}
          style={{ width: "80%" }}
        />
        <Box className={classes.progressValue} pt={2}>
          {props.progress}%
        </Box>
        <Box className={classes.uploading}>{props.isUpload ? "Uploading..." : "Downloading"}</Box>
        <Box className={classes.description} py={2}>
          {props.isUpload
            ? "Your file is being uploaded to decentralised storage right now, Please wait."
            : "Your file is being uploaded right now, Please wait."}
        </Box>
      </Box>
    </Modal>
  );
};

export default FileUploadingModal;
