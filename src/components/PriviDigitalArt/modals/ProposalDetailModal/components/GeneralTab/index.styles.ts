import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/ui-kit";

export const generalTabStyles = makeStyles(() => ({
  label: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#2D3047",
    opacity: 0.9,
    fontFamily: "Montserrat",
    fontSize: "16px",
    fontWeight: 600,
    marginBottom: "8px",
  },
  collectionBox: {
    background: "linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8",
    border: "1px solid rgba(84, 101, 143, 0.2)",
    borderRadius: 17,
    padding: "22px 17px 17px 24px",
    "& img": {
      width: 143,
      height: 71,
      objectFit: "cover",
      objectPosition: "center",
    },
    "& + &": {
      marginTop: 12,
    }
  },
}));
