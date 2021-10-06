import { makeStyles } from "@material-ui/core/styles";

export const createNewTopicStyles = makeStyles(theme => ({
  root: {},
  titleVotingModal: {
    fontSize: 22,
    fontWeight: 800,
    color: "#181818",
  },
  content: {
    padding: "10px 20px",
    textAlign: "center",
  },
  bodyCreateNewTopic: {
    paddingTop: 30,
    paddingBottom: 20,
  },
  createButtonNewTopicDiv: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  createButtonNewTopic: {
    fontSize: 18,
  },
  primaryBtn: {
    background: "#431AB7 !important",
  },
}));
