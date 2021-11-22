import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/ui-kit";

export const profileEditModalStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "800px !important",
    fontFamily: "Montserrat",
    padding: "48px",
    [theme.breakpoints.down("xs")]: {
      padding: 24
    },
  },
  content: {
    width: "100%",
    height: "100%",
    minHeight: 676,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  infoHeaderEdit: {
    fontSize: 14,
    fontWeight: 400,
    color: "#707582",
  },
  infoIconEdit: {
    width: 12,
    height: 12,
    marginLeft: 3,
    marginTop: -3,
  },
  flexRowInputs: {
    display: "flex",
  },
  snackBar: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  socialFields: {
    "& > div": {
      position: "relative",
      "& > img": {
        position: "absolute",
        right: 0,
        bottom: 0,
      },
    },
  },
  tabWrapper: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "40px",
    [theme.breakpoints.down("xs")]: {
      marginBottom: "20px",
      marginTop: "8px",
    },

    "& .MuiAppBar-root": {
      width: "auto",
    },
    "& .anon-mode": {
      // display: "flex",
      // columnGap: 8,
      // alignItems: "center",
      // marginLeft: "40px",
      [theme.breakpoints.down("xs")]: {
        marginLeft: 0,
        justifyContent: "flex-end",
      },
    },
    "& .option-buttons": {
      borderRadius: 20,
      width: 40,
      height: 24,
      padding: 2,
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
    },
    "& .private-title": {
      fontWeight: "bold",
      fontSize: "13px",
      color: "#707582",
      position: "relative",
    },

    "& .tooltip": {
      marginLeft: 3,
    },
  },
  editButton: {
    display: "flex",
    justifyContent: "center",
    marginTop: "16px",
    "& button": {
      // width: "fit-content",
      backgroundColor: `${Color.Purple} !important`,
    },
    "& button.disabled": {
      opacity: 0.6,
    },
    "& button.btnBody": {
      paddingLeft: 85,
      paddingRight: 85,
    },
  },
  title: {
    fontFamily: "Agrandir",
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: "130%",
    color: "#181818",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
    [theme.breakpoints.down("xs")]: {
      marginBottom: 0,
      marginTop: "24px",
    },
  },

  cardsOptions: {
    alignSelf: "center",
    display: "flex",
    alignItems: "center",
    borderRadius: "100vh",
    border: "2px solid #EBEBEB",
    [theme.breakpoints.down('xs')]: {
      marginTop: 24,
      // marginBottom: 32,
    }
  },

  tabHeaderPodMedia: {
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: 16,
    fontFamily: "Agrandir",
    cursor: "pointer",
    color: "#A4A4A4",
    padding: "10px 17px",
    "&:last-child": {
      marginRight: 0,
    },
    [theme.breakpoints.down('xs')]: {
      padding: 9,
      marginRight: 5,
    }
  },
  tabHeaderPodMediaSelected: {
    color: "#431AB7",
  },
  tooltipHeaderInfo: {
    width: 14,
    height: 14,
    margin: 0,
    marginLeft: 3,
    transform: "translateY(-1px)",
  },
}));
