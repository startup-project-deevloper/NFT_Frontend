import { makeStyles } from "@material-ui/core";

export const useClosenessDegreeModalStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "597px !important",
    background: '#1E2026 !important',
    color: "#ffffff !important",
    "& h3": {
      marginTop: 24,
      marginBottom: 28,
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: 18,
      lineHeight: "104.5%",
    },
  },
  urlSlug: {
    fontSize: 14,
    marginTop: 4,
    background: 'linear-gradient(225.12deg, #F2A07E -33.5%, #FF5954 71.42%)',
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  slider: {
    widht: "100%",
  },
  primaryBtn: {
    background: "#FF5954 !important",
  },
}));
