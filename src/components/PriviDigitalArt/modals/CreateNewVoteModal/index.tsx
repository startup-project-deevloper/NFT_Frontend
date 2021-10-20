import React, { useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import Axios from "axios";

import { Tooltip, Fade, Hidden } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";

import { Color, Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import URL from "shared/functions/getURL";
import { useAlertMessage } from "shared/hooks/useAlertMessage";

import { ReactComponent as InfoIcon } from "assets/icons/info.svg";
import { useTypedSelector } from "store/reducers/Reducer";

import { newVoteModalStyles } from "./index.styles";
import { priviPodCreatePoll } from "shared/services/API";

const CreateNewVoteModal = (props: any) => {
  const classes = newVoteModalStyles();
  const user = useTypedSelector(state => state.user);
  const { showAlertMessage } = useAlertMessage();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([""]);

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const validateVotesInfo = () => {
    if (title.length <= 5) {
      showAlertMessage("Title field invalid. Minimum 5 characters required.", { variant: "error" });
      return false;
    } else if (description.length <= 5) {
      showAlertMessage("Description field invalid. Minimum 5 characters required.", { variant: "error" });
      return false;
    } else if (!answers.reduce((prev, cur) => prev && cur, "true")) {
      showAlertMessage("All available answers should be valid.", { variant: "error" });
      return false;
    } else if (endDate.getTime() - startDate.getTime() < 0) {
      showAlertMessage("Please check end date.", { variant: "error" });
      return false;
    }
    return true;
  };

  const createNewVotes = async () => {
    if (validateVotesInfo() && props.pod.Id) {
      const body = {
        question: title,
        description: description,
        possibleAnswers: answers,
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
        creatorAddress: user.id,
        podId: props.pod.Id,
        type: "PIX",
      };
      priviPodCreatePoll(body)
        .then(res => {
          console.log(res);
          if (res.success) {
            if (props.postCreated) props.handleRefresh();
            props.handleClose();
          }
        })
        .catch(error => {
          showAlertMessage("Failed to create new poll.", { variant: "error" });
        });
    }
  };

  return (
    <Modal size="daoMedium" isOpen={props.open} onClose={props.handleClose} showCloseIcon>
      <Box className={classes.contentBox}>
        <Box className={classes.flexBox} justifyContent="center">
          <Box className={classes.title}>{props.isVotation ? "Create new votation" : "New Vote"}</Box>
        </Box>
        <Box mt={3.5}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.header1}>Question</Box>
            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
              <InfoIcon style={{ color: "grey", width: "14px" }} />
            </Tooltip>
          </Box>
          <InputWithLabelAndTooltip
            placeHolder="Discussion title"
            type="text"
            theme="music dao"
            inputValue={title}
            onInputValueChange={e => setTitle(e.target.value)}
          />
        </Box>
        <Box mt={4.5} mb={5}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.header1}>Description</Box>
            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
              <InfoIcon style={{ color: "grey", width: "14px" }} />
            </Tooltip>
          </Box>
          <InputWithLabelAndTooltip
            placeHolder="Write Description..."
            type="textarea"
            theme="music dao"
            inputValue={description}
            onInputValueChange={e => setDescription(e.target.value)}
          />
        </Box>
        <Box width={1} borderTop="1px solid #35385622" borderBottom="1px solid #35385622" pb={5}>
          {answers.map((item, index) => (
            <Box mt={4.5} width={1}>
              <Box className={classes.flexBox} justifyContent="space-between">
                <Box className={classes.header1}>{`Answer ${index + 1}`}</Box>
                {index > 0 && (
                  <Box
                    className={classes.header2}
                    onClick={() => {
                      const updatedAnswers = [...answers];
                      updatedAnswers.splice(index, 1);
                      setAnswers(updatedAnswers);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Remove
                  </Box>
                )}
              </Box>
              <InputWithLabelAndTooltip
                placeHolder=""
                type="text"
                theme="music dao"
                inputValue={item}
                onInputValueChange={e => {
                  const updatedAnswers = [...answers];
                  updatedAnswers[index] = e.target.value;
                  setAnswers(updatedAnswers);
                }}
              />
            </Box>
          ))}
          <SecondaryButton
            size="medium"
            className={classes.addAnswerBtn}
            onClick={() => setAnswers(prev => [...prev, ""])}
          >
            <Box
              mr={2}
              style={{
                borderRadius: "16px",
                border: "1px solid black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2px",
              }}
            >
              <img src={require("assets/icons/add_dark.png")} />
            </Box>
            Add Answer
          </SecondaryButton>
        </Box>
        <Box className={classes.flexBox} mt={3}>
          <Box width={1} ml={1}>
            <Box className={classes.header1}>Start Date</Box>
            <Box width={1} className={classes.controlBox} mt={1}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="dense"
                  id="date-picker-inline"
                  minDate={new Date()}
                  value={startDate}
                  onChange={(date, _) => date && setStartDate(new Date(date.getTime()))}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  size="small"
                  className={classes.datepicker}
                />
              </MuiPickersUtilsProvider>
            </Box>
          </Box>
          <Hidden only="xs">
            <Box width={1} ml={1}>
              <Box className={classes.header1}>End Date</Box>
              <Box width={1} className={classes.controlBox} mt={1}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="dense"
                    id="date-picker-inline"
                    minDate={startDate}
                    value={endDate}
                    onChange={(date, _) => date && setEndDate(new Date(date?.getTime()))}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                    size="small"
                    className={classes.datepicker}
                  />
                </MuiPickersUtilsProvider>
              </Box>
            </Box>
          </Hidden>
        </Box>
        <Hidden smUp>
          <Box className={classes.flexBox} mt={3}>
            <Box width={1} ml={1}>
              <Box className={classes.header1}>Start Date</Box>
              <Box width={1} className={classes.controlBox} mt={1}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="dense"
                    id="date-picker-inline"
                    minDate={new Date()}
                    value={startDate}
                    onChange={(date, _) => date && setStartDate(new Date(date.getTime()))}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                    size="small"
                    className={classes.datepicker}
                  />
                </MuiPickersUtilsProvider>
              </Box>
            </Box>
          </Box>
        </Hidden>
        <Box width={1} display="flex" justifyContent="space-between" mt={4}>
          <Hidden smUp>
            <SecondaryButton
              size="medium"
              onClick={props.handleClose}
              isRounded
              style={{ paddingLeft: "48px", paddingRight: "48px", width: "100%" }}
            >
              Cancel
            </SecondaryButton>
          </Hidden>
          <Hidden only="xs">
            <SecondaryButton
              size="medium"
              onClick={props.handleClose}
              isRounded
              style={{ paddingLeft: "48px", paddingRight: "48px" }}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              size="medium"
              onClick={createNewVotes}
              isRounded
              style={{
                paddingLeft: "48px",
                paddingRight: "48px",
                marginLeft: "24px",
                background: Color.MusicDAODark,
              }}
            >
              Post Voting
            </PrimaryButton>
          </Hidden>
        </Box>
        <Hidden smUp>
          <Box width={1} display="flex" justifyContent="center" mt={4}>
            <PrimaryButton
              size="medium"
              onClick={createNewVotes}
              isRounded
              style={{
                paddingLeft: "48px",
                paddingRight: "48px",
                width: "100%",
                background: Color.MusicDAODark,
              }}
            >
              Post Voting
            </PrimaryButton>
          </Box>
        </Hidden>
      </Box>
    </Modal>
  );
};

export default CreateNewVoteModal;
