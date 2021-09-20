import React, { useState } from "react";
import axios from "axios";

import { Grid } from "@material-ui/core";

import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { createNewTopicStyles } from "./index.styles";

const CreateNewTopicModal = (props: any) => {
  const classes = createNewTopicStyles();

  const [status, setStatus] = useState<any>({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creationProgress, setCreationProgress] = useState(false);

  const validateTopicInfo = () => {
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
    return true;
  };

  const createNewTopic = () => {
    if (validateTopicInfo()) {
      setCreationProgress(true);
      axios
        .post(`${URL()}/podDiscussion/newChat`, {
          title,
          description,
          podId: props.pod.PodAddress,
          createdBy: props.createdBy,
        })
        .then(resp => {
          if (resp.data.success) {
            props.postCreated();
            props.handleClose();
          }
          setCreationProgress(false);
        })
        .catch(error => {
          setStatus({
            msg: "Failed to create new Topic.",
            key: Math.random(),
            variant: "error",
          });
          setCreationProgress(false);
        });
    }
  };

  return (
    <Modal
      size="small"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
      className={classes.root}
    >
      <Box className={classes.content}>
        <Box className={classes.titleVotingModal}>Create New Topic</Box>
        <Box className={classes.bodyCreateNewTopic}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <InputWithLabelAndTooltip
                placeHolder="Write your post title ..."
                inputValue={title}
                type="text"
                labelName="Title"
                onInputValueChange={e => setTitle(e.target.value)}
                style={{ background: "transparent" }}
              />
            </Grid>
            <Grid item>
              <InputWithLabelAndTooltip
                placeHolder="Write a description..."
                inputValue={description}
                labelName="Description"
                tooltip=""
                onInputValueChange={e => setDescription(e.target.value)}
                style={{ background: "transparent" }}
              />
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.createButtonNewTopicDiv}>
          <SecondaryButton
            size="medium"
            onClick={() => {
              props.handleClose();
            }}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton className={classes.primaryBtn} size="medium" onClick={createNewTopic} disabled={creationProgress}>
            Next
          </PrimaryButton>
        </Box>
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

export default CreateNewTopicModal;
