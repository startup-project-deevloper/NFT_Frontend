import React from 'react'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'
import { useRangeSliderStyles } from './index.styles'

export default function RangeSlider({ value, onChange }) {
  const classes = useRangeSliderStyles();

  return (
    <div className={classes.root}>
      <Slider
        defaultValue={0}
        aria-labelledby="continuous-slider"
        value={value}
        step={0.5}
        onChange={onChange}
      />
    </div>
  );
}