import { makeStyles } from "@material-ui/core/styles";

export const pollItemStyles = makeStyles(theme => ({
  itemWrap:{
    background: "linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)",
    padding: 1,
    borderRadius: theme.spacing(2.5),
  },
  item: {
    borderRadius: theme.spacing(2.5),
    background: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "13px 12px",

  },
  endBox: {
    borderRadius: theme.spacing(4),
    // background: "#7F6FFF",
    background: "linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)",
    color: "white",
    fontSize: 12,
    padding: `${theme.spacing(0.5)}px 12px`,
  },
  header1: {
    fontSize: 14,
    fontWeight: 800,
    lineHeight: "140%",
    color: "#7F6FFF",
    textDecoration: "underline",
  },
  header2: {
    fontSize: 14,
    fontWeight: 800,
    wordBreak: 'break-all',
    textAlign: 'left'
  },
  header3: {
    fontSize: 14,
    fontWeight: 400,
    wordBreak: 'break-all',
    textAlign: 'left',
    lineHeight: "140%",
  },
  name: {
    fontSize: 18,
    lineHeighta: 22,
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
    }
  },
  lineBar: {
    height: 2,
    opacity: "0.5",
    alignSelf: "stretch",
    background: "linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)",
    marginTop: 13,
  },
  gradientTxt: {
    background: "linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  checkbox: {
    "& .MuiIconButton-label": {
      "& svg": {
        "& rect:nth-child(1)": {
          stroke: "url(#paint0_linear)",
        },
        "& rect:nth-child(2)": {
          fill: "url(#paint0_linear)",
        }
      }
    }
  },
  progressBar:{
    height: "14px",
    background: "#DDFF57",
  },
}));
