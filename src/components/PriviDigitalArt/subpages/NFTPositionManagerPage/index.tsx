import React, { useState, useContext } from "react";
import PositionsManager from "./components/PositionsManager";
import Box from "shared/ui-kit/Box";
import DigitalArtContext from "shared/contexts/DigitalArtContext";
import { useNFTPositionManagerPageStyles } from "./index.styles";

const NFTPositionManagerPage = () => {
  const classes = useNFTPositionManagerPageStyles();
  const { setOpenFilters } = useContext(DigitalArtContext);

  React.useEffect(() => {
    setOpenFilters(false);
  }, []);

  return (
    <Box className={classes.main}>
      <PositionsManager />
    </Box>
  );
};

export default React.memo(NFTPositionManagerPage);
