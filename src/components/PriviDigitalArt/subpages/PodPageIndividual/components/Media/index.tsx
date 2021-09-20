import React from "react";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { MediaCard } from "./MediaCard";

export default function Media({ medias, creator, pod, handleRefresh, loading }) {
  return (
    <>
      <LoadingWrapper loading={loading} theme={"blue"}>
        {medias.length > 0 && (
          <MasonryGrid
            gutter={"24px"}
            data={medias}
            renderItem={(item, index) => (
              <MediaCard
                media={item}
                key={`${index}-media`}
                creator={creator}
                pod={pod}
                handleRefresh={handleRefresh}
              />
            )}
            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
          />
        )}
      </LoadingWrapper>
    </>
  );
}

const COLUMNS_COUNT_BREAK_POINTS_TWO = {
  650: 1,
  1439: 2,
};

const COLUMNS_COUNT_BREAK_POINTS_THREE = {
  480: 1,
  960: 2,
  1440: 3,
};
