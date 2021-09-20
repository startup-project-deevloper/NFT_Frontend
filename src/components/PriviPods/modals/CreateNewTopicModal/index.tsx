import React, { useState } from "react";
import { Grid, makeStyles } from "@material-ui/core";

import { Modal, PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const useStyles = makeStyles(() => ({
    root: {
        background: "#EAE8FA !important",
    },
    titleVotingModal: {
        fontSize: 22,
        fontWeight: 800,
        color: "#181818",
    },
    content: {
        padding: "10px 20px",
    },
    bodyCreateNewTopic: {
        paddingTop: 30,
        paddingBottom: 20,
    },
    createButtonNewTopicDiv: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    createButtonNewTopic: {
        fontSize: 18,
    },
}));

const CreateNewTopicModal = (props: any) => {
    const classes = useStyles();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    return (
        <Modal size="small" isOpen={props.open} onClose={props.onClose} showCloseIcon className={classes.root}>
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
                            />
                        </Grid>
                        <Grid item>
                            <InputWithLabelAndTooltip
                                placeHolder="Write a description..."
                                inputValue={description}
                                labelName="Description"
                                tooltip=""
                                onInputValueChange={e => setDescription(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box className={classes.createButtonNewTopicDiv}>
                    <PrimaryButton
                        size="medium"
                        onClick={() => {
                            props.createNewTopic(title, description);
                            props.onClose();
                        }}
                    >
                        Publish
                    </PrimaryButton>
                </Box>
            </Box>
        </Modal>
    );
};

export default CreateNewTopicModal;
