import React, { useState } from "react";
import axios from "axios";

import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import FileUpload from "shared/ui-kit/Page-components/FileUpload";
import QuillEditor from "shared/ui-kit/QuillEditor";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { useTypedSelector } from "store/reducers/Reducer";
import CustomSwitch from "shared/ui-kit/CustomSwitch";
import URL from "shared/functions/getURL";
import { newWallPostModalStyles } from "./index.styles";

const CreateNewWallPostModal = (props: any) => {
  const classes = newWallPostModalStyles();
  const user = useTypedSelector(state => state.user);
  const [status, setStatus] = useState<any>({});

  const [post, setPost] = useState<any>({
    comments: true,
    author: user.id,
    scheduledPost: Date.now(),
    name: "",
    textShort: "",
  });

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [hashTag, setHashTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [postDate, setPostDate] = useState<Date>(new Date());

  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);

  const [video, setVideo] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState<any>(null);
  const [editorState, setEditorState] = useState<any>(null);

  const [scheduledPost, setScheduledPost] = useState<boolean>(true);
  const [enableComments, setEnableComments] = useState<boolean>(true);
  const [enablePriviWall, setEnablePriviWall] = useState<boolean>(true);

  const [creationProgress, setCreationProgress] = useState(false);

  const onChange = editorState => {
    setEditorState(editorState);
  };

  //photo functions
  const uploadPodWallPostImage = async id => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", photo, id);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      axios
        .post(`${URL()}/pod/wall/changePostPhoto`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          reject(true);
        });
    });
  };

  const validatePostInfo = () => {
    if (!title || title.length <= 5) {
      setStatus({
        msg: "Title field invalid. Minimum 5 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!description || description.length <= 5) {
      setStatus({
        msg: "Preview Text field invalid. Minimum 5 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!tags || tags.length <= 0) {
      setStatus({
        msg: "Minimum 1 Hashtag",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!photo) {
      setStatus({
        msg: "Media Image is required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    }
    return true;
  };

  const addHashTag = () => {
    setTags(prev => {
      setHashTag("");
      return [...prev, hashTag];
    });
  };

  const getHashTags = () => {
    return (
      <React.Fragment>
        {tags.map((item, index) => (
          <Box className={classes.tagBox} key={index} mr={1}>
            <Box>{item}</Box>
          </Box>
        ))}
      </React.Fragment>
    );
  };

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      addHashTag();
    }
  }

  const uploadPodWallPostVideo = async id => {
    return new Promise((resolve, reject) => {
      let now = Date.now();
      const formData = new FormData();
      formData.append("video", video, id);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      axios
        .post(`${URL()}/pod/wall/addVideo`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          reject(true);
        });
    });
  };

  const handleNewWallPost = () => {
    if (validatePostInfo()) {
      setCreationProgress(true);
      let body = { ...post };
      body.name = title;
      body.textShort = description;
      body.mainHashtag = tags.length > 0 ? tags[0] : "";
      body.hashtags = tags;
      body.schedulePost = postDate; // integer timestamp eg 1609424040000
      body.description = "";
      body.descriptionArray = editorState ?? {};
      body.selectedFormat = 1; // 0 story 1 wall post
      body.hasPhoto = photo ? true : false;
      body.podId = props.pod.PodAddress;

      axios
        .post(`${URL()}/pod/wall/createPost`, body)
        .then(async response => {
          const resp = response.data;
          if (resp.success) {
            if (photo) {
              await uploadPodWallPostImage(resp.data.id);
            }
            if (video) {
              await uploadPodWallPostVideo(resp.data.id);
            }
            setStatus({
              msg: "Post created",
              key: Math.random(),
              variant: "success",
            });
            setTimeout(() => {
              props.postCreated();
              props.handleClose();
            }, 1000);
          } else {
            setStatus({
              msg: resp.error,
              key: Math.random(),
              variant: "error",
            });
          }
          setCreationProgress(false);
        })
        .catch(error => {
          setStatus({
            msg: "Error when making the request",
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
          <Box className={classes.title}>Create new post</Box>
        </Box>
        <Box mt={2}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.header1}>Title</Box>
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
            <Box className={classes.header1}>Short preview text</Box>
          </Box>
          <InputWithLabelAndTooltip
            placeHolder="Write short preview text..."
            type="textarea"
            inputValue={description}
            onInputValueChange={e => setDescription(e.target.value)}
            style={{ background: "transparent" }}
          />
        </Box>
        <Box mt={1}>
          <Box className={classes.header1}>Hashtags</Box>
          <InputWithLabelAndTooltip
            placeHolder="New tag..."
            type="text"
            inputValue={hashTag}
            onInputValueChange={e => setHashTag(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ background: "transparent" }}
          />
          <Box className={classes.flexBox}>{getHashTags()}</Box>
        </Box>
        <Box display="flex" alignItems="flex-start" mt={3}>
          <Box width={1} mr={1}>
            <Box className={classes.header1} mb={1}>
              Add photo
            </Box>
            <FileUpload
              photo={photo}
              photoImg={photoImg}
              setterPhoto={setPhoto}
              setterPhotoImg={setPhotoImg}
              mainSetter={undefined}
              mainElement={undefined}
              type="image"
              canEdit
              isNewVersion
              theme="privi-pix-blue"
            />
          </Box>
          <Box width={1} ml={1}>
            <Box className={classes.header1} mb={1}>
              Add Video
            </Box>
            <FileUpload
              photo={video}
              photoImg={videoUrl}
              setterPhoto={setVideo}
              setterPhotoImg={setVideoUrl}
              mainSetter={undefined}
              mainElement={undefined}
              type="video"
              canEdit
              isNewVersion
              theme="privi-pix-blue"
            />
          </Box>
        </Box>
        <Box width={1} mt={3}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.header1}>Full Text</Box>
          </Box>
          <Box width={1} mt={1} style={{ background: "rgba(158, 172, 242, 0.4)" }}>
            <QuillEditor editorState={editorState ?? ""} onChange={onChange} />
          </Box>
        </Box>
        <Box width={1} mt={3}>
          <Box className={classes.header1}>Post settings</Box>
          <Box className={classes.flexBox} mt={2} borderBottom="1px solid #00000022" pb={2}>
            <Box className={classes.header2} mr={2} style={{ whiteSpace: "nowrap" }}>
              Schedule post
            </Box>
            <CustomSwitch
              checked={scheduledPost}
              onChange={() => setScheduledPost(prev => !prev)}
              theme="privi-pix"
            />
            {scheduledPost && (
              <Box className={classes.controlBox} ml={2}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="dense"
                    id="date-picker-inline"
                    value={postDate}
                    onChange={(date, _) => {
                      setPostDate(date ? new Date(date.getTime()) : new Date());
                    }}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                    size="small"
                    className={classes.datepicker}
                  />
                </MuiPickersUtilsProvider>
              </Box>
            )}
          </Box>
          <Box
            className={classes.flexBox}
            mt={2}
            borderBottom="1px solid #00000022"
            pb={2}
            justifyContent="space-between"
          >
            <Box className={classes.header2} mr={2} style={{ whiteSpace: "nowrap" }}>
              Enable Comments
            </Box>
            <CustomSwitch
              checked={enableComments}
              onChange={() => setEnableComments(prev => !prev)}
              theme="privi-pix"
            />
          </Box>
        </Box>
        <Box width={1} mt={3}>
          <Box className={classes.flexBox} mt={2} justifyContent="space-between">
            <Box className={classes.header2} mr={2} style={{ whiteSpace: "nowrap" }}>
              Share withYour PRIVI Wall
            </Box>
            <CustomSwitch
              checked={enablePriviWall}
              onChange={() => setEnablePriviWall(prev => !prev)}
              theme="privi-pix"
            />
          </Box>
        </Box>
        <Box width={1} display="flex" justifyContent="space-between" mt={4}>
          <SecondaryButton size="small" onClick={props.handleClose} isRounded>
            Cancel
          </SecondaryButton>
          {/* <PrimaryButton size="small" onClick={props.handleClose} isRounded style={{ background: "#9EACF2" }}>
            Preview Post
          </PrimaryButton> */}
          <PrimaryButton
            size="small"
            onClick={handleNewWallPost}
            isRounded
            style={{ background: "#431AB7" }}
            disabled={creationProgress}
          >
            Publish Post
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

export default CreateNewWallPostModal;
