import React, { useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import Axios from "axios";

import { Hidden } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";

import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import { newVoteModalStyles } from "./index.styles";

const CreateNewVoteModal = (props: any) => {
  const classes = newVoteModalStyles();
  const user = useTypedSelector(state => state.user);
  const [status, setStatus] = useState<any>({});

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([""]);
  const [creationProgress, setCreationProgress] = useState(false);

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const validateVotesInfo = () => {
    if (title.length <= 5) {
      setStatus({
        msg: "Title field invalid. Minimum 5 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (description.length <= 5) {
      setStatus({
        msg: "Description field invalid. Minimum 5 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    }
    //  else if (!answers.reduce((prev, cur) => prev && cur, "true")) {
    //   setStatus({
    //     msg: "All available answers should be valid.",
    //     key: Math.random(),
    //     variant: "error",
    //   });
    //   return false;
    // }
    else if (endDate.getTime() - startDate.getTime() < 0) {
      setStatus({
        msg: "Please check end date.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    }
    return true;
  };

  const createNewVotes = () => {
    if (validateVotesInfo()) {
      setCreationProgress(true);
      const body = {
        question: title,
        description: description,
        possibleAnswers: answers,
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
        createdBy: user.id,
        podId: props.pod.PodAddress,
      };

      Axios.post(`${URL()}/mediaPod/polls/addNew`, body)
        .then(res => {
          if (res.data.success) {
            props.postCreated();
            props.handleClose();
          }
          setCreationProgress(false);
        })
        .catch(error => {
          setStatus({
            msg: "Failed to create new Poll.",
            key: Math.random(),
            variant: "error",
          });
          setCreationProgress(false);
        });
    }
  };

  return (
    <Modal size="small" isOpen={props.open} onClose={props.handleClose} showCloseIcon>
      <Box className={classes.contentBox}>
        <Box className={classes.flexBox} justifyContent="center">
          <Box className={classes.title}>Create new votation</Box>
        </Box>
        <Box mt={2}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.header1}>Question</Box>
          </Box>
          <InputWithLabelAndTooltip
            placeHolder="Discussion title"
            type="text"
            inputValue={title}
            onInputValueChange={e => setTitle(e.target.value)}
            style={{ background: "transparent" }}
          />
        </Box>
        <Box mt={1}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.header1}>Description</Box>
          </Box>
          <InputWithLabelAndTooltip
            placeHolder="Write Description..."
            type="textarea"
            inputValue={description}
            onInputValueChange={e => setDescription(e.target.value)}
            style={{ background: "transparent" }}
          />
        </Box>
        <Box
          py={3}
          width={1}
          mt={3}
          style={{ borderTop: "1px solid #35385622", borderBottom: "1px solid #35385622" }}
        >
          {answers.map((item, index) => (
            <Box mt={2} width={1}>
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
                    style={{ cursor: "pointer", color: "#F43E5F" }}
                  >
                    Remove
                  </Box>
                )}
              </Box>
              <InputWithLabelAndTooltip
                placeHolder=""
                type="text"
                inputValue={item}
                onInputValueChange={e => {
                  const updatedAnswers = [...answers];
                  updatedAnswers[index] = e.target.value;
                  setAnswers(updatedAnswers);
                }}
                style={{ background: "transparent" }}
              />
            </Box>
          ))}
          <Box display="flex" justifyContent="center" width={1}>
            <SecondaryButton
              size="medium"
              onClick={() => setAnswers(prev => [...prev, ""])}
              style={{ paddingLeft: "48px", paddingRight: "48px" }}
            >
              Add Answer
            </SecondaryButton>
          </Box>
        </Box>
        <Box className={classes.flexBox} mt={3}>
          <Box width={1} mr={1}>
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
            <Box width={1} mr={1}>
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
        <Box width={1} display="flex" justifyContent="center" mt={4}>
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
              style={{ paddingLeft: "48px", paddingRight: "48px" }}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              size="medium"
              onClick={createNewVotes}
              style={{ paddingLeft: "48px", paddingRight: "48px", marginLeft: "24px", background: "#431AB7" }}
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
              style={{ paddingLeft: "48px", paddingRight: "48px", width: "100%", background: "#431AB7" }}
              disabled={creationProgress}
            >
              Post Voting
            </PrimaryButton>
          </Box>
        </Hidden>
      </Box>
      {status.msg && (
        <AlertMessage
          key={status.key}
          message={status.msg}
          variant={status.variant}
          onClose={() => setStatus({})}
        />
      )}
    </Modal>
  );
};

export default CreateNewVoteModal;
