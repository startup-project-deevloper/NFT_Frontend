import React, { useState } from "react";

import UserCard from "components/PriviDigitalArt/components/Cards/UserCard";
// import UserWideCard from "components/PriviDigitalArt/components/Cards/UserWideCard";
import Box from "shared/ui-kit/Box";
import { usePodPageIndividualStyles } from "../index.styles";

export default function PodArtists({ pod }) {
  const classes = usePodPageIndividualStyles();

  const [openPanel, setOpenPanel] = useState<boolean>(true);

  return (
    <>
      <Box className={classes.artistsBox} justifyContent="space-between" pt={4} mb={3}>
        <Box className={classes.title2}>Artists</Box>
        <Box
          className={classes.title3}
          display="flex"
          alignItems="center"
          onClick={() => setOpenPanel(!openPanel)}
        >
          {openPanel ? (
            <>
              <span>Hide</span>
              <UpArrowIcon />
            </>
          ) : (
            <>
              <span>Show</span>
              <DownArrwoIcon />
            </>
          )}
        </Box>
      </Box>
      {openPanel && (
        <div className={classes.artistsMainContent}>
          {
            // pod.CreatorsData.length > 2
            //   ?
            pod.CreatorsData.map((creator, index) => (
              <UserCard key={`artist-${index}`} userId={creator.id} />
            ))
            // : pod.CreatorsData.map((creator, index) => (
            //     <UserWideCard key={`artist-${index}`} userId={creator.id} />
            //   ))
          }
        </div>
      )}
    </>
  );
}

const UpArrowIcon = () => (
  <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 4L4 1L1 4"
      stroke="#1A1B1C"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const DownArrwoIcon = () => (
  <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 1.60547L4 4.60547L7 1.60547"
      stroke="#1A1B1C"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
