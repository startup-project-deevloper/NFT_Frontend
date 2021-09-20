import React, { useEffect, useState } from "react";

import { Fade, Tooltip, Grid } from "@material-ui/core";

// import { BlockchainNets } from "shared/constants/constants";
// import CustomSwitch from "shared/ui-kit/CustomSwitch";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from "shared/ui-kit/Box";
// import { BlockchainTokenSelectSecondary } from "shared/ui-kit/Select/BlockchainTokenSelectSecondary";
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
            theme="music dao"
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
            tooltip={`Type a name to identify your music pod`}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <InputWithLabelAndTooltip
            theme="music dao"
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
            theme="music dao"
          />
        </Grid>
        {/* <Grid item xs={12} md={12}>
          <Box className={classes.label} mb={1}>
            Choose Blockchain Network
          </Box>
          <BlockchainTokenSelectSecondary
            communityToken={props.pod}
            setCommunityToken={props.setPod}
            BlockchainNets={BlockchainNets}
            theme="music dao"
          />
        </Grid> */}
        {/* <Grid item xs={12} md={6}>
          <InputWithLabelAndTooltip
            theme="music dao"
            labelName="Investor share"
            tooltip={`Please provide investor for your community. As the Communities grow, this field will help people discover your community`}
            onInputValueChange={e => {
              props.setPod({ ...props.pod, InvestorShare: e.target.value });
            }}
            type="text"
            inputValue={props.pod.InvestorShare}
            placeHolder="Input share % here"
            disabled={!props.isCreator && !props.creation}
          />
        </Grid>
        <Grid item xs={12} md={6} style={{ paddingLeft: "16px" }}>
          <InputWithLabelAndTooltip
            theme="music dao"
            labelName="Sharing percentage"
            tooltip={`Please provide sharing percentage for your community. As the Communities grow, this field will help people discover your community`}
            onInputValueChange={e => {
              props.setPod({ ...props.pod, SharingPercent: e.target.value });
            }}
            type="text"
            inputValue={props.pod.SharingPercent}
            placeHolder="Input share % here"
            disabled={!props.isCreator && !props.creation}
          />
        </Grid>
        <Grid item xs={12}>
          <InputWithLabelAndTooltip
            theme="music dao"
            labelName="Royalties"
            tooltip={`Please provide Royalties for your community. As the Communities grow, this field will help people discover your community`}
            onInputValueChange={e => {
              props.setPod({ ...props.pod, Royalty: e.target.value });
            }}
            type="text"
            inputValue={props.pod.Royalty}
            placeHolder="Input share % here"
            disabled={!props.isCreator && !props.creation}
          />
        </Grid> */}
        <Grid item xs={12}>
          <InputWithLabelAndTooltip
            labelName="Hashtags"
            placeHolder="Hashtags divided by coma"
            onInputValueChange={e => {
              props.setPod({
                ...props.pod,
                hashtagsString: e.target.value,
                Hashtags: e.target.value.split(","),
              });
            }}
            inputValue={props.pod.hashtagsString}
            type="text"
            theme="music dao"
            tooltip="Please provide at least one hashtag for your community. As the Communities grow, this field will help people discover your community"
          />
          <div className={classes.hashtagsRow} style={{ flexFlow: "wrap", marginTop: "0px" }}>
            {props.pod.Hashtags.map((hashtag, index) => (
              <div
                className={index === 0 ? classes.hashtagPillFilled : classes.hashtagPill}
                style={{ marginTop: "8px" }}
              >
                {props.pod.Hashtags && props.pod.Hashtags[index] ? props.pod.Hashtags[index] : hashtag}
              </div>
            ))}
          </div>
        </Grid>
        {/* <Grid
          item
          xs={12}
          md={12}
          style={{
            borderBottom: "1px solid #34375533",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            color="#181818"
            fontSize="18px"
            justifyContent="space-between"
          >
            Open advertising
            <CustomSwitch
              theme="music dao"
              checked={props.pod.OpenAdvertising}
              onChange={() => {
                if (props.isCreator || props.creation) {
                  let podCopy = { ...props.pod };
                  podCopy.OpenAdvertising = !podCopy.OpenAdvertising;
                  props.setPod(podCopy);
                }
              }}
            />
          </Box>
        </Grid>
        {props.creation ? (
          <Grid item xs={12} md={12}>
            <Box
              display="flex"
              alignItems="center"
              color="#181818"
              fontSize="18px"
              justifyContent="space-between"
            >
              Open investment
              <CustomSwitch
                theme="music dao"
                checked={props.pod.IsInvesting}
                onChange={() => {
                  if (props.isCreator || props.creation) {
                    let podCopy = { ...props.pod };
                    podCopy.IsInvesting = !podCopy.IsInvesting;
                    props.setPod(podCopy);
                  }
                }}
              />
            </Box>
          </Grid>
        ) : null} */}
      </Grid>
    </div>
  );
};

export default GeneralNFTMediaTab;
