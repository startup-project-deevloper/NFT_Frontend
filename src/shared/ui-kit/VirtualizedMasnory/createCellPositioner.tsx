import type { CellMeasurerCache, Positioner } from "react-virtualized";

type createCellPositionerParams = {
  cellMeasurerCache: CellMeasurerCache;
  columnCount: number;
  columnWidth: number;
  spacer?: number;
};

type resetParams = {
  columnCount: number;
  columnWidth: number;
  spacer?: number;
};

export default function createCellPositioner({
  cellMeasurerCache,
  columnCount,
  columnWidth,
  spacer = 0,
}: createCellPositionerParams): Positioner {
  let columnHeights;

  initOrResetDerivedValues();

  function cellPositioner(index) {
    // // Find the shortest column and use it.
    // let columnIndex = 0;
    // for (let i = 1; i < columnHeights.length; i++) {
    //   if (columnHeights[i] < columnHeights[columnIndex]) {
    //     columnIndex = i;
    //   }
    // }

    const columnIndex = index % columnHeights.length;
    const left = columnIndex * (columnWidth + spacer);
    const top = columnHeights[columnIndex] || 0;

    columnHeights[columnIndex] = top + cellMeasurerCache.getHeight(index) + spacer;

    return {
      left,
      top,
    };
  }

  function initOrResetDerivedValues(): void {
    // Track the height of each column.
    // Layout algorithm below always inserts into the shortest column.
    columnHeights = [];
    for (let i = 0; i < columnCount; i++) {
      columnHeights[i] = 0;
    }
  }

  function reset(params: resetParams): void {
    columnCount = params.columnCount;
    columnWidth = params.columnWidth;
    spacer = params.spacer || 0;

    initOrResetDerivedValues();
  }

  cellPositioner.reset = reset;

  return cellPositioner;
}
