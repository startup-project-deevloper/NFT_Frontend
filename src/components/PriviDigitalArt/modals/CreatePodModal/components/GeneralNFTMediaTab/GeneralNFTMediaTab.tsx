import React, { useEffect, useState } from "react";

import { Fade, Tooltip, Grid } from "@material-ui/core";

import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from "shared/ui-kit/Box";
import FileUpload from "shared/ui-kit/Page-components/FileUpload";
import { generalNFTMediaTabStyles } from "./GeneralNFTMediaTab.styles";

const GeneralNFTMediaTab = (props: any) => {
  const classes = generalNFTMediaTabStyles();

  //hashtags
  const [canEdit, setCanEdit] = useState<boolean>(true);

  useEffect(() => {
    if (props.canEdit !== undefined) {
      setCanEdit(props.canEdit);
    }
  }, [props.canEdit]);

  return (
    <div className={classes.generalNftMediaTab}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <InputWithLabelAndTooltip
            theme="privi-pix"
            type="text"
            inputValue={props.pod.Name}
            onInputValueChange={e => {
              let podCopy = { ...props.pod };
              podCopy.Name = e.target.value;
              props.setPod(podCopy);
              props.setPod({ ...props.pod, Name: e.target.value });
            }}
            labelName="Pod Name"
            placeHolder="Your name here"
            tooltip={`Type a name to identify your pix pod`}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <InputWithLabelAndTooltip
            theme="privi-pix"
            type="textarea"
            inputValue={props.pod.Description}
            onInputValueChange={e => {
              props.setPod({ ...props.pod, Description: e.target.value });
            }}
            labelName="Description"
            placeHolder="Write your description"
            tooltip={`Describe us what it is about`}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Box className={classes.label} mb={1}>
            <div>Pod Image</div>
            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
              <img src={require("assets/icons/info_music_dao.png")} alt="info" />
            </Tooltip>
          </Box>
          <FileUpload
            photo={props.photo}
            photoImg={props.photoImg}
            setterPhoto={props.setPhoto}
            setterPhotoImg={props.setPhotoImg}
            mainSetter={undefined}
            mainElement={undefined}
            type="image"
            canEdit={props.isCreator || props.creation}
            theme="privi-pix"
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default GeneralNFTMediaTab;
