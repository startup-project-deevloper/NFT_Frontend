import React, { useState } from "react";
import axios from "axios";

import Box from "shared/ui-kit/Box";
import { createPlayListModalStyles } from "./index.styles";
import { Gradient, Modal, PrimaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import URL from "shared/functions/getURL";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import FileUpload from "shared/ui-kit/Page-components/FileUpload";

export default function CreatePlaylistModal({
  open,
  handleClose,
  list = {
    Title: "",
    Description: "",
  },
  handleRefresh = (item: any) => {},
}) {
  //HOOKS
  const [playlist, setPlaylist] = useState<any>(list);

  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const userSelector = useSelector((state: RootState) => state.user);

  const classes = createPlayListModalStyles({ photoImg: photoImg });

  const handleSaveChanges = async () => {
    try {
      if (verify()) {
        if (photo) {
          let now = Date.now();
          const formData = new FormData();
          formData.append("image", photo, "" + now);
          const config = {
            headers: {
              "content-type": "multipart/form-data",
            },
          };
          let resp = await axios.post(`${URL()}/media/changePlaylistPhoto`, formData, config);
          let newPlaylist = { ...playlist };

          if (resp.data.success) {
            const url = resp.data.data;
            newPlaylist.Creator = userSelector.id;
            newPlaylist.HasPhoto = true;
            newPlaylist.ImageUrl = resp.data.data;
            newPlaylist.Private = false;
            resp = await axios.post(`${URL()}/media/createPlaylist`, newPlaylist);
            if (resp.data.success) {
              setPlaylist({ ...newPlaylist });
              setSuccessMsg("Playlist created!");
              handleClickSuccess();
              if (handleRefresh) {
                handleRefresh(newPlaylist);
              }
              handleClose();
            }
          }
        }
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const verify = () => {
    if (!playlist.Title || playlist.Title === "") {
      setErrorMsg("Name field invalid. Please fill in the value.");
      handleClickError();
      return false;
    } else return true;
  };

  const onPhotoChange = (files: any) => {
    setPhoto(files[0]);
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      setPhotoImg(reader.result);
    });
    reader.readAsDataURL(files[0]);
  };

  const handleClickSuccess = () => {
    setOpenSuccess(true);
    setTimeout(() => {
      setOpenSuccess(false);
    }, 3000);
  };

  const handleClickError = () => {
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
    }, 3000);
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess(false);
  };

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon>
      <Box className={classes.content}>
        <Box className={classes.titleBox} my={4}>
          <Box className={classes.title}>Edit Details</Box>
        </Box>
        <Box className={classes.gridBox}>
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
            styleWrapper={{ height: "100%" }}
            isReverse
          />
          <Box className={classes.inputBox}>
            <InputWithLabelAndTooltip
              labelName="Name"
              tooltip=""
              inputValue={playlist.Title}
              type="text"
              placeHolder="Playist Title..."
              onInputValueChange={e => {
                setPlaylist({
                  ...playlist,
                  Title: e.target.value,
                });
              }}
              required
              style={{ background: "rgba(238, 242, 247, 0.5)" }}
            />
            <InputWithLabelAndTooltip
              labelName="Description"
              tooltip=""
              inputValue={playlist.Description}
              placeHolder="Write an optional description..."
              onInputValueChange={e => {
                setPlaylist({
                  ...playlist,
                  Description: e.target.value,
                });
              }}
              required
              style={{ marginBottom: 0, background: "rgba(238, 242, 247, 0.5)", borderRadius: 6 }}
            />
          </Box>
        </Box>
        <Box textAlign="center" width={1} mt={4}>
          <Box className={classes.header1} mb={2} px={4}>
            By continuing, you agree to grant Privi Trax access to the image you select to upload.
            <br /> Make sure you have the right to upload the image.
          </Box>
          <PrimaryButton
            onClick={handleSaveChanges}
            size="medium"
            style={{
              background: Gradient.Green1,
              width: "40%",
              paddingTop: "8px",
              paddingBottom: "8px",
              height: "auto",
            }}
          >
            Save
          </PrimaryButton>
        </Box>
      </Box>

      {openSuccess && (
        <AlertMessage
          key={Math.random()}
          message={successMsg}
          variant="success"
          onClose={handleCloseSuccess}
        />
      )}
      {openError && (
        <AlertMessage key={Math.random()} message={errorMsg} variant="error" onClose={handleCloseError} />
      )}
    </Modal>
  );
}
