import React from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "shared/ui-kit/Box";
import { MediaSimpleCard } from "components/PriviDigitalArt/components/Cards/MediaSimpleCard";

const COLUMNS_COUNT_BREAK_POINTS = {
  750: 1,
  1200: 2,
};

const GUTTER = "16px";

const useStyles = makeStyles(theme => ({
  cardsGrid: {
    display: "grid",
    gridColumnGap: "20px",
    gridRowGap: "20px",
    width: "100%",
  },
}));

export const Media = ({ medias, pod, handleRefresh }) => {
  const classes = useStyles();

  const [podMedias, setPodMedias] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (medias.length) {
      setPodMedias(medias.filter(media => {
        // if (media.metadataMedia) { // FIXME: Add condition for investors
        //   return false;
        // }
        return true;
      }));
    }
  }, [medias]);

  return (
    <Box width={1} display="flex" flexGrow={1} marginTop={5}>
      {podMedias.length ? (
        <Grid className={classes.cardsGrid}>
          <ResponsiveMasonry columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}>
            <Masonry gutter={GUTTER}>
              {podMedias.map((media, index) => (
                <Box key={index} style={{boxShadow: "0px 4px 8px #9EACF2", borderRadius:"14px"}}>
                  <MediaSimpleCard media={media} pod={pod} handleRefresh={handleRefresh} />
                </Box>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </Grid>
      ) : (
        <p>No medias available</p>
      )}
    </Box>
  );
};
