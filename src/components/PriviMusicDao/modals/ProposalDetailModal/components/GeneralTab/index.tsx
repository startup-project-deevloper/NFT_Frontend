import React from "react";
import { Box } from "@material-ui/core";

import { generalTabStyles } from "./index.styles";

const GeneralTab = (props: any) => {
  const { proposal } = props;

  const classes = generalTabStyles();
  return (
    <Box maxHeight={400} overflow="scroll">
      {proposal.Medias?.map((song: any, index) => (
        <Box key={index} mb={2} className={classes.collectionBox}>
          <Box display="flex" alignItems="center" mb={1}>
            <img src={song?.PhotoImg ?? require("assets/musicDAOImages/no_image.png")} alt="pod-image" />
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
      ))}
    </Box>
  );
};

export default GeneralTab;
