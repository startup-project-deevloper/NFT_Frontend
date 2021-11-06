import { Slider, withStyles } from "@material-ui/core";
import { Color } from "shared/ui-kit";

export const GradientSlider = withStyles({
  root: {
    padding: 0,
  },
  thumb: {
    height: "31px !important",
    width: "42px !important",
    background: "#fff",
    border: "1px solid #431AB7",
    marginTop: "-12px !important",
    borderRadius: 16,
  },
  mark: {
    marginTop: 3,
    backgroundColor: Color.Mint,
  },
  markLabel: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: "104.5%",
    fontFamily: "Agrandir",
    color: "#A3A5BF",
  },
  track: {
    background:
      "linear-gradient(269.98deg, #418DFF -8.82%, #4541FF 20.66%, #4541FF 29.86%, #EF41CB 57.07%, #EF41CB 61.12%), #000000",
    height: 12,
    borderRadius: 0,
  },
  rail: {
    background: "#EFF2FD",
    height: 12,
    borderRadius: 0,
  },
  valueLabel: {
    marginLeft: "28px",
    top: 0,
    marginTop: 9,
    zIndex: 0,
    "& span": {
      background: "transparent",
      color: "#431AB7",
      fontFamily: "Agrandir",
      fontSize: "10px",
      fontWeight: 600,
      lineHeight: "120%",
    },
  },
})(Slider);
