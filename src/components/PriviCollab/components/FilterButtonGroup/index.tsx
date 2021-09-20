import React from "react";

import Box, { BoxProps } from "shared/ui-kit/Box";

import { filterButtonGroupStyles } from "./index.styles";

interface FilterButtonGroupProps extends BoxProps {
  categories: string[];
  selected: string;
  onSelectCategory: (category: string) => void;
}

const FilterButtonGroup = ({ categories, selected, onSelectCategory, ...props }: FilterButtonGroupProps) => {
  const classes = filterButtonGroupStyles();

  const handleSelect = (current: string) => () => {
    onSelectCategory(current);
  };

  return (
    <Box display="flex" flexDirection="row" {...props}>
      {categories.map((category, index) => (
        <button
          className={`${classes.normal} ${selected === category && classes.selected}`}
          key={`category-button-${index}`}
          onClick={handleSelect(category)}
        >
          {category}
        </button>
      ))}
    </Box>
  );
};

export default FilterButtonGroup;
