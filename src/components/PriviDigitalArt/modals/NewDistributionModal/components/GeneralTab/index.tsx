import React, { useEffect } from "react";
import { Select, MenuItem, Tooltip, Fade } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { generalTabStyles } from "./index.styles";
import { PrimaryButton, StyledDivider } from "shared/ui-kit";
import {
  AddIcon,
  RemoveCollectionIcon,
  EditCollectionIcon,
} from "components/PriviDigitalArt/components/Icons/SvgIcons";
import FileUpload from "shared/ui-kit/Page-components/FileUpload";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import useIPFS from "../../../../../../shared/utils-IPFS/useIPFS";
import { onUploadNonEncrypt } from "../../../../../../shared/ipfs/upload";

const GeneralTab = ({ pod, setPod }) => {
  const classes = generalTabStyles();

  const { showAlertMessage } = useAlertMessage();

  const [photo, setPhoto] = React.useState<any>(null);
  const [photoImg, setPhotoImg] = React.useState<any>(null);
  const [songTitle, setSongTitle] = React.useState<string>("");
  const [songGenre, setSongGenre] = React.useState<any>("pop");
  const [isEditing, setIsEditing] = React.useState<number>(-1);

  const { ipfs, setMultiAddr, uploadWithNonEncryption } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  const savePodMedias = async () => {
    if (!songTitle) {
      showAlertMessage("Song Title is required!", { variant: "error" });
      return;
    } else if (!songGenre) {
      showAlertMessage("Genre is required!", { variant: "error" });
      return;
    }

    let infoImage = await onUploadNonEncrypt(photo, file => uploadWithNonEncryption(file));

    const medias = [...pod.Medias];
    if (isEditing < 0) {
      medias.push({
        Title: songTitle,
        Genre: songGenre,
        InfoImage: infoImage,
        Photo: photo,
        PhotoImg: photoImg,
      });
    } else {
      setIsEditing(-1);
      medias[isEditing] = {
        Title: songTitle,
        Genre: songGenre,
        InfoImage: infoImage,
        Photo: photo,
        PhotoImg: photoImg,
      };
    }

    setPod({ ...pod, Medias: medias });
    setSongTitle("");
    setSongGenre("pop");
    setPhoto(null);
    setPhotoImg(null);
  };

  const handleEdit = index => () => {
    setIsEditing(index);

    const media = pod.Medias[index];
    setSongTitle(media.Title);
    setSongGenre(media.Genre);
    setPhoto(media.Photo);
    setPhotoImg(media.PhotoImg);
  };

  const handleRemove = index => () => {
    const medias = [...pod.Medias];
    medias.splice(index, 1);
    setPod({ ...pod, Medias: medias });
  };

  return (
    <Box>
      <StyledDivider type="solid" margin={4} />
      <div className={classes.title}>Add Song</div>

      <Box className={classes.label} mb={1}>
        <div>Song Image</div>
        <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
          <img src={require("assets/icons/info_music_dao.png")} alt="info" />
        </Tooltip>
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
        theme="music dao"
        extra={true}
      />
      <Box className={classes.label} mb={1} mt="24px">
        <div>Song Title</div>
        <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
          <img src={require("assets/icons/info_music_dao.png")} alt="info" />
        </Tooltip>
      </Box>
      <input
        className={classes.input}
        placeholder="A title for your song"
        value={songTitle}
        onChange={e => setSongTitle(e.target.value)}
      />
      <Box className={classes.label} mb={1} mt="24px">
        <div>Genre</div>
        <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
          <img src={require("assets/icons/info_music_dao.png")} alt="info" />
        </Tooltip>
      </Box>
      <Select className={classes.input} value={songGenre} onChange={e => setSongGenre(e.target.value)}>
        <MenuItem value="pop">Pop Music</MenuItem>
      </Select>

      <Box mt={"29px"} />
      <PrimaryButton size="medium" className={classes.button} onClick={savePodMedias}>
        <AddIcon />
        Add Song
      </PrimaryButton>
      <StyledDivider type="solid" margin={4} />
      <Box mb={2}>
        {pod.Medias.map((song, index) => (
          <Box key={index} mb={2} className={classes.collectionBox}>
            <Box display="flex" alignItems="center" mb={1}>
              <img src={song.PhotoImg ?? require("assets/musicDAOImages/no_image.png")} alt="pod-image" />
              <Box display="flex" flexDirection="column" ml={4}>
                <Box className={classes.label}>{song.Title || "No Title"}</Box>
                <Box display="flex" alignItems="center">
                  <Box fontSize={14} color={"#2D3047"} fontWeight={500} pr={2}>
                    {song.Genre || "No Genre"}
                  </Box>
                  {song && song.MediaSymbol ? (
                    <Box
                      fontSize={14}
                      color={"#2D3047"}
                      fontWeight={500}
                      ml={2}
                      borderLeft="1px solid #00000033"
                    >
                      {song.MediaSymbol || ""}
                    </Box>
                  ) : null}
                </Box>
              </Box>
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <PrimaryButton size="small" className={classes.removeButton} onClick={handleRemove(index)}>
                <RemoveCollectionIcon />
                Remove
              </PrimaryButton>
              <PrimaryButton size="small" className={classes.editButton} onClick={handleEdit(index)}>
                <EditCollectionIcon />
                Editing
              </PrimaryButton>
            </Box>
          </Box>
        ))}
      </Box>

      {isEditing > -1 && (
        <Box display="flex" justifyContent="center" mt={4} mb={2}>
          <PrimaryButton size="medium" className={classes.updateButton} onClick={savePodMedias}>
            Save Changes
          </PrimaryButton>
        </Box>
      )}
    </Box>
  );
};

export default GeneralTab;
