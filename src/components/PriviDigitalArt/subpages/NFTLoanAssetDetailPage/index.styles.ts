import { makeStyles } from "@material-ui/core";

export const useAssetDetailPageStyles = makeStyles(theme => ({
  root: {
    padding: "40px 48px 48px 80px",
    backgroundImage: `url(${require("assets/pixImages/fractionalise_background.png")})`,
    backgroundRepeat: "inherit",
    backgroundSize: "100% 100%",

    width: "100%",
    height: "100%",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minHeight: "calc(100vh - 80px)",
    maxHeight: "calc(100vh - 80px)",
    overflowX: "hidden",
    position: "relative",
    color: "#431AB7",
    [theme.breakpoints.down("sm")]: {
      padding: "42px 24px 38px",
    },

    [theme.breakpoints.down("xs")]: {
      padding: "22px 16px 24px",
    },

    "& button": {
      height: "auto",
    },
  },
  headerSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 40,
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  assetInfoSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 56,
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  chartSection: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    padding: "5px",
    borderRadius: 20,
    background: "#431AB7",
    marginTop: 64,
  },
  controlParentBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "30px 40px",
    [theme.breakpoints.down("xs")]: {
      padding: 12,
    },
    width: "100%",
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: "#ffffff",
    lineHeight: "130%",
    fontFamily: "Agrandir",
    margin: 0,
    [theme.breakpoints.down(768)]: {
      fontSize: 12,
    },
  },
  controlBox: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "flex-end",
    },
  },
  liquidityBox: {
    display: "flex",
    alignItems: "center",
    background: "#181F3D",
    color: "#F0F5F8",
    borderRadius: 28,
    padding: 5,
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down(768)]: {
      marginTop: 0,
      marginLeft: 0,
    },
    "& button": {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  groupButton: {
    background: "transparent",
    border: "none",
    borderRadius: 28,
    fontSize: 14,
    color: "#FFF",
    padding: "4px 16px",
    height: 35,
    "& + &": {
      marginLeft: 4,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 8,
      height: 16,
    },
  },
  selectedGroupButton: {
    background: "rgba(221, 255, 87, 1)",
    color: "#181818",
  },
  chartWrapper: {
    padding: "30px 20px 30px 20px",
    minHeight: "400px",

    [theme.breakpoints.down(768)]: {
      padding: 0,
      minHeight: "200px",
      "& canvas": {
        width: "100%",
      },
    },
  },
  detailTableSection: {
    width: "100%",
    border: "1px solid #9EACF2",
    borderRadius: 20,
    padding: "30px 0",
    marginTop: 34,
    background: "#ffffff",
  },
  detailItemSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "12px 37px",
    borderBottom: "1px solid #9EACF2",
    [theme.breakpoints.down("xs")]: {
      padding: "12px 16px",
    },
  },
  typo1: {
    fontSize: 27,
    fontWeight: 800,
    fontFamily: "Agrandir",
  },
  typo2: {
    fontSize: 14,
    fontWeight: 400,
    fontFamily: "Agrandir",
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  typo3: {
    fontSize: 18,
    fontWeight: 800,
    fontFamily: "Agrandir",
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
  typo4: {
    fontSize: 17,
    fontWeight: 800,
    fontFamily: "Agrandir",
    paddingLeft: 36,
  },
  typo5: {
    fontSize: 16,
    fontFamily: "Agrandir",
    [theme.breakpoints.down("sm")]: {
      fontSize: 13,
    },
  },
}));
