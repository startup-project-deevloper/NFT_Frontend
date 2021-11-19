import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
  content: {
    display: "flex",
    flexDirection: "column",
    paddingBottom: 48,
  },
  stakeSection: {
    display: "flex",
    flexDirection: "column",
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  stakingDetailSection: {
    background: "#FFFFFF",
    boxShadow: "0px 30px 35px -12px rgba(29, 103, 84, 0.09)",
    borderRadius: 20,
    padding: "30px 35px 20px",
    marginTop: 38,
  },
  stakingActionSection: {
    background: "linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D",
    borderRadius: 14,
    marginTop: 30,
    padding: "23px 40px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    [theme.breakpoints.down("xs")]: {
      fontSize: 20,
      flexDirection: "column",
    },
  },
  stakeShowMoreSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    cursor: "pointer",
  },
  proposalSection: {
    marginTop: 85,
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    color: "#2D3047",
    fontFamily: "Agrandir",
    [theme.breakpoints.down("xs")]: {
      fontSize: 20,
    },
  },
  typo1: {
    fontSize: 16,
    fontWeight: 600,
    color: "#54658F",
    fontFamily: "Montserrat",
    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
    },
  },
  typo2: {
    fontSize: 20,
    fontWeight: 800,
    color: "#65CB63",
    fontFamily: "Agrandir",
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
    },
  },
  typo3: {
    fontSize: 14,
    fontWeight: 600,
    color: "#65CB63",
    fontFamily: "Montserrat",
    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
    },
  },
  typo4: {
    fontSize: 24,
    fontWeight: 800,
    color: "#2D3047",
    fontFamily: "Agrandir",
    [theme.breakpoints.down("xs")]: {
      fontSize: 20,
    },
  },
  typo5: {
    fontSize: 18,
    fontWeight: 800,
    color: "#2D3047",
    fontFamily: "Agrandir",
    "& span": {
      color: "#2D304740",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 16,
    },
  },
  typo6: {
    fontSize: 16,
    fontWeight: 600,
    color: "#65CB63",
    fontFamily: "Montserrat",
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
    },
  },
  typo7: {
    fontSize: 14,
    fontWeight: 500,
    color: "#54658F",
    fontFamily: "Montserrat",
    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
    },
  },
  typo8: {
    fontSize: 14,
    fontWeight: 700,
    color: "#2D3047",
    fontFamily: "Montserrat",
  },
}));
