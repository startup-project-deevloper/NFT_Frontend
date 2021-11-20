import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/ui-kit";

export const ProposalPodCardStyles = makeStyles(theme => ({
  root: {
    background: "#ffffff",
    borderRadius: 18,
    boxShadow: "0px 4px 8px #9EACF2",
    padding: theme.spacing(3),
    margin: theme.spacing(2),
  },
  header1: {
    fontSize: 14,
    fontWeight: 500,
    color: "#1A1B1C",
  },
  header2: {
    fontSize: 16,
    fontWeight: 600,
    color: Color.Black,
    "& > span": {
      opacity: 0.7,
    },
  },
  header3: {
    fontSize: 14,
    fontWeight: 600,
    color: Color.Purple,
  },
  header4: {
    fontSize: 14,
    fontWeight: 500,
    color: "#1A1B1C",
    maxWidth: 180,
  },
  flexBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));
