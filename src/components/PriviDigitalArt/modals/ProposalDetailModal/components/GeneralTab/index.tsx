import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";

import useIPFS from "shared/utils-IPFS/useIPFS";
import { onGetNonDecrypt } from "shared/ipfs/get";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";

import { generalTabStyles } from "./index.styles";

const GeneralTab = (props: any) => {
  const { proposal } = props;

  const classes = generalTabStyles();

  const [mediasPhotos, setMediasPhotos] = useState<any[]>([]);

  const { downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    if (proposal) {
      getImages();
    }
  }, [proposal]);

  const getImages = async () => {
    let i: number = 0;
    let photos: any = {};
    for (let media of proposal.Medias) {
      if (media?.InfoImage?.newFileCID && media?.InfoImage?.metadata?.properties?.name) {
        let img = await getImageIPFS(media.InfoImage.newFileCID, media.InfoImage.metadata.properties.name);
        photos[i + "-photo"] = img;
      }
    }
    setMediasPhotos(photos);
  };

  const getImageIPFS = async (cid: string, fileName: string) => {
    let files = await onGetNonDecrypt(cid, fileName, (fileCID, fileName, download) =>
      downloadWithNonDecryption(fileCID, fileName, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.buffer);
      return "data:image/png;base64," + base64String;
    }
    return "";
  };

  return (
    <Box maxHeight={400} overflow="scroll">
      {proposal.Medias?.map((song: any, index) => {
        return (
          <Box key={index} mb={2} className={classes.collectionBox}>
            <Box display="flex" alignItems="center" mb={1}>
              <img
                style={{ borderRadius: "5px" }}
                src={
                  mediasPhotos && mediasPhotos[index + "-photo"]
                    ? mediasPhotos[index + "-photo"]
                    : require("assets/musicDAOImages/no_image.png")
                }
                alt="pod-image"
              />
              <Box display="flex" flexDirection="column" ml={4}>
                <Box className={classes.label}>{song?.Title || "No Title"}</Box>
                <Box display="flex" alignItems="center">
                  <Box fontSize={14} color={"#2D3047"} fontWeight={500}>
                    {song.Genre || "No Genre"}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default GeneralTab;
