import { makeStyles } from "@material-ui/core/styles";

export const podCardStyles = makeStyles(theme => ({
  podCard: {
    background: "#ffffff",
    borderRadius: theme.spacing(2),
    position: "relative",
    display: "flex",
    flexDirection: "column",
    color: "#431AB7",
    boxShadow: "0px 4px 8px #9EACF2",
    padding: "24px 16px",
  },

  podImageContent: {
    height: "264px",
    widht: "100%",
    borderRadius: theme.spacing(2),
  },

  podImage: {
    width: "100%",
    cursor: "pointer",
    height: "100%",
    borderRadius: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: "100%",
    border: "2px solid #ffffff",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    transform: "translate(0, 50%)",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  podMainInfo: {
    cursor: "pointer",
    marginTop: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    fontSize: 14,
    "& p": {
      fontSize: "18px",
      fontWeight: 800,
      margin: 0,
    },
  },

  podMainInfoContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    "& div": {
      display: "flex",
      flexDirection: "column",
    },
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    "& div": {
      fontSize: "14px",
    },
  },

  divider: {
    width: "100%",
    height: "1px",
    background: "#000",
    opacity: 0.05,
    margin: "16px 0",
  },
  socialButtons: {
    display: "flex",
    alignItems: "center",
    background: "#FEECD7",
    border: "2px solid #ffffff",
    borderRadius: "32px",
    transform: "translate(0, 50%)",
    columnGap: "4px",
  },
  clickable: {
    cursor: "pointer",
  },
  lightBlueBox: {
    background: "#9EACF2",
    color: "#DDFF57",
    borderRadius: theme.spacing(1),
    fontSize: 12,
    fontWeight: 800,
  },
  redBox: {
    background: "rgba(255,0,0,0.2)",
    color: "rgba(255,0,0)",
    borderRadius: theme.spacing(1),
    fontSize: 12,
    fontWeight: 800,
  },
  greenBox: {
    background: "#DDFF57",
    color: "#431AB7",
    borderRadius: theme.spacing(1),
    fontSize: 12,
    fontWeight: 800,
  },
  orangeBox: {
    background: "rgba(255, 142, 60, 0.2)",
    color: "rgba(255, 142, 60, 1)",
    borderRadius: theme.spacing(1),
    fontSize: 12,
    fontWeight: 800,
  },
  blueBox: {
    background: "#431AB7",
    color: "white",
    borderRadius: theme.spacing(1),
    fontSize: 12,
    fontWeight: 800,
  },
}));
