import React from "react";
import { Tooltip, Fade } from "@material-ui/core";
import Box from "shared/ui-kit/Box";
import { nftTabStyles } from "./index.styles";
import { FontSize, PrimaryButton, } from "shared/ui-kit";
import { EditIcon, RemoveIcon } from "components/PriviMusicDao/components/Icons/SvgIcons";
import { Text } from "components/PriviMusicDao/components/ui-kit";
import { imageTitleDescriptionStyles } from "shared/ui-kit/Page-components/ImageTitleDescription.styles";
import { useAlertMessage } from "shared/hooks/useAlertMessage";

const NFTTab = ({ pod, setPod }) => {
  const classes = nftTabStyles();
  const { showAlertMessage } = useAlertMessage();

  const [nftTitle, setNFTTitle] = React.useState<string>("");
  const [nftDescription, setNFTDescription] = React.useState<any>("");

  const handleAdd = () => {
    if (!nftTitle) {
      showAlertMessage('NFT Title field is missing.', { variant: "error" });
    } else if (!nftDescription) {
      showAlertMessage('NFT Description field is missing.', { variant: "error" });
    } else {
      const medias = [...pod.Medias];
      medias.push({
        Title: nftTitle,
        Description: nftDescription,
      });
      setPod({ ...pod, Medias: medias });
      setNFTTitle("");
      setNFTDescription("");
    }
  };

  const handleEdit = nftPod => {
    setNFTTitle(nftPod.Title);
    setNFTDescription(nftPod.Description);
  };

  const handleRemove = nftPod => {
    let medias = [...pod.Medias];
    medias = medias.filter(item => item.MediaSymbol !== nftPod.MediaSymbol);
    setPod({ ...pod, Medias: medias });
  };

  return (
    <Box>
      <Box mb={2}>
        {pod.Medias.map((nftPod, index) => (
          <Box key={`nftPod-card-${index}`} className={classes.card}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <img width="150px" height="100%" src={nftPod.PhotoImg} alt="cardimage" />
              <Box display="flex" flexDirection="column" ml={3} width="100%">
                <Text size={FontSize.L} bold mb={1}>
                  {nftPod.Title}
                </Text>
                <Text mb={1}>{nftPod.Description}</Text>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Text>Edit</Text>
                  <div className={classes.editButton} onClick={() => handleEdit(nftPod)}>
                    <EditIcon />
                  </div>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Text>Remove</Text>
                  <div className={classes.editButton} onClick={() => handleRemove(nftPod)}>
                    <RemoveIcon />
                  </div>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      <PrimaryButton size="medium" className={classes.button} onClick={handleAdd}>
        Add NFT
      </PrimaryButton>

      <Box className={classes.label} mb={1} mt="24px">
        <div>NFT Title</div>
        <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
          <img src={require("assets/icons/info_music_dao.png")} alt="info" />
        </Tooltip>
      </Box>
      <input
        className={classes.input}
        placeholder="Title here"
        value={nftTitle}
        onChange={e => setNFTTitle(e.target.value)}
      />
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" my={2}>
        <Box width={"100%"}>
          <Box className={classes.label} mb={1}>
            <div>NFT Description</div>
            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
              <img src={require("assets/icons/info_music_dao.png")} alt="info" />
            </Tooltip>
          </Box>
          <textarea
            className={classes.textarea}
            placeholder="Write a description"
            rows={8}
            onChange={e => setNFTDescription(e.target.value)}
            value={nftDescription}
          >
            {nftDescription}
          </textarea>
        </Box>
      </Box>
    </Box>
  );
};

export default NFTTab;
