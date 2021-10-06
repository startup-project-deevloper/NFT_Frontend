import { makeStyles } from "@material-ui/core/styles";
import { Gradient } from "shared/ui-kit";

export const governancePageStyles = makeStyles(theme => ({
  content: {
    background: "#222145",
    height: `calc(100vh - 104px)`,
    paddingBottom: "80px",
  },
  subContent: {
    width: "100%",
    overflowY: "auto",
    scrollbarWidth: "none",
    padding: "60px 168px 150px 168px",
    height: "calc(100vh - 80px)",
    paddingBottom: "80px",
    position: "relative",
  },
  gradient: {
    position: "absolute",
    width: 363,
    height: 485,
    left: 521,
    top: -240,
    transform: "rotate(44deg)",
    filter: "blur(120px)",
    background:
      "linear-gradient(156.41deg, #FA18FF 11.7%, rgba(255, 255, 255, 0) 57.03%), radial-gradient(108.54% 138.74% at 86.8% 29.83%, rgba(238, 238, 238, 0) 0%, rgba(167, 54, 255, 0.096) 26.8%, rgba(14, 0, 255, 0.212) 73.32%, rgba(112, 0, 255, 0.384) 100%)",
  },
  title: {
    fontSize: "44px",
    fontWeight: 800,
    lineHeight: "120%",
    background: Gradient.Magenta,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  header1: {
    fontSize: "22px",
    fontWeight: 800,
    color: "white",
  },
  header2: {
    fontSize: "14px",
    fontWeight: 600,
    color: "white",
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  buttonBox: {
    background: "linear-gradient(0deg, #BA50FC, #BA50FC), #7977D1",
    display: "flex",
    alignItems: "center",
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(4),
    cursor: "pointer",
  },
  secondButtonBox: {
    position: "relative",
    padding: `${theme.spacing(0.5)}px ${theme.spacing(6)}px`,
    borderRadius: theme.spacing(4),
    cursor: "pointer",
    border: "1px solid #7977D1",

    "& img": {
      position: "absolute",
      right: "16px",
      width: "16px",
      transform: "translateY(-125%)",
    },
  },
  voteCards: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    "& > div": {
      width: "100%",
    },
  },
}));
