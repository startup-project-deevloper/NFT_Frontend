import React, { useEffect, useState, useRef } from "react";
import { Fade, Tooltip, Grid, TextField } from "@material-ui/core";

import { generalNFTMediaTabStyles } from "./GeneralNFTMediaTab.styles";
import { BlockchainNets } from "shared/constants/constants";
// import CustomSwitch from "shared/ui-kit/CustomSwitch";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from "shared/ui-kit/Box";
import { BlockchainTokenSelectSecondary } from "shared/ui-kit/Select/BlockchainTokenSelectSecondary";
import FileUpload from "shared/ui-kit/Page-components/FileUpload";

const infoIcon = require("assets/icons/info.svg");

const GeneralNFTMediaTab = (props: any) => {
  const classes = generalNFTMediaTabStyles();

  //hashtag
  const [hashTag, setHashTag] = useState<string>("");
  const nameRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.validationError.tab === "GENERAL") {
      if (props.validationError.invalidField === "name") {
        nameRef.current!.scrollIntoView();
      }
      if (props.validationError.invalidField === "description") {
        descriptionRef.current!.scrollIntoView();
      }
    }
  }, [props.validationError]);

  return (
    <div className={classes.generalNftMediaTab}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} ref={nameRef}>
          <InputWithLabelAndTooltip
            theme="privi-pix"
            type="text"
            inputValue={props.pod.Name}
            onInputValueChange={e => {
              let podCopy = { ...props.pod };
              podCopy.Name = e.target.value;
              props.setPod(podCopy);
            }}
            labelName="Pod Name"
            placeHolder="Your name here"
            tooltip={`Type a name to identify your music pod`}
          />
        </Grid>
        <Grid item xs={12} md={12} ref={descriptionRef}>
          <InputWithLabelAndTooltip
            theme="privi-pix"
            type="textarea"
            inputValue={props.pod.Description}
            onInputValueChange={e => {
              let podCopy = { ...props.pod };
              podCopy.Description = e.target.value;
              props.setPod(podCopy);
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
        <Grid item xs={12} md={12}>
          <Box className={classes.label} mb={1}>
            Choose Blockchain Network
          </Box>
          <BlockchainTokenSelectSecondary
            communityToken={props.pod}
            setCommunityToken={props.setPod}
            BlockchainNets={BlockchainNets.filter((_, index) => index > 0)}
            theme="privi-pix"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box className={classes.controlBox}>
            <Box width={1} display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Box className={classes.controlLabel}>Hashtags</Box>
              </Box>
              <Box ml={1} className={classes.infoIcon}>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className={classes.tooltipHeaderInfo}
                  title={`Hashtags`}
                >
                  <img src={infoIcon} alt={"info"} />
                </Tooltip>
              </Box>
            </Box>
            <Box width={1}>
              <div className={classes.hashtagInput}>
                <TextField
                  variant="outlined"
                  onChange={e => {
                    setHashTag(e.target.value);
                  }}
                  value={hashTag}
                  placeholder="#"
                  className={classes.formControlHashInputWide}
                />
                <img
                  className={classes.hashtagInputImg}
                  src={require("assets/icons/add_gray.png")}
                  alt={"add"}
                  onClick={() => {
                    const newHashtag = props.pod.Hashtags ?? [];
                    newHashtag.push(hashTag);
                    props.setPod({
                      ...props.pod,
                      Hashtags: newHashtag,
                    });
                    setHashTag("");
                  }}
                />
              </div>
              <Box display="flex" mt={1}>
                <React.Fragment>
                  {props.pod.Hashtags.map(
                    (item, index) =>
                      item && (
                        <Box
                          className={classes.hashTagBox}
                          key={index}
                          style={{
                            color: "black",
                          }}
                        >
                          {item}
                          <Box
                            position="absolute"
                            right={-8}
                            top={-8}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              const newHashtag = props.pod.Hashtags ?? [];
                              newHashtag.splice(index, 1);
                              props.setPod({
                                ...props.pod,
                                Hashtags: newHashtag,
                              });
                            }}
                          >
                            <svg width="8" height="8" viewBox="0 0 16 16" fill="none">
                              <path
                                d="M15 1L1 15M1.00001 1L15 15"
                                stroke="#707582"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Box>
                        </Box>
                      )
                  )}
                </React.Fragment>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} style={{ paddingLeft: "16px" }}>
          <InputWithLabelAndTooltip
            theme="privi-pix"
            labelName="Sharing Percentage"
            tooltip={`Please provide sharing percentage for your community. As the Communities grow, this field will help people discover your community`}
            onInputValueChange={elem => {
              let podCopy = { ...props.pod };
              podCopy.SharingPercent = elem.target.value;
              props.setPod(podCopy);
            }}
            type="number"
            inputValue={props?.pod?.SharingPercent}
            placeHolder="0"
            disabled={!props.isCreator && !props.creation}
          />
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
              theme="privi-pix"
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
                theme="privi-pix"
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
