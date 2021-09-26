import { makeStyles } from "@material-ui/core";

export const collectionNFTCardStyles = makeStyles(theme => ({
  card: {
    background: "#431AB7",
    backdropFilter: "blur(3.59442px)",
    borderRadius: 8.4,
    clipPath: "polygon(100% 0%, 100% 85%,  50% 100%, 0% 85%, 0% 0%)",
    padding: 9,
    height:  ({ customHeight }: any) => customHeight ? customHeight : 410,
    width: "100%",
    minWidth: 200,
    maxWidth: 300,
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      height:  ({ customHeight }: any) => customHeight ? customHeight : 350,
      maxWidth: 320,
    },
  },
  innerBox: {
    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.4) 3.83%, rgba(255, 255, 255, 0) 31.54%), #9EACF2",
    boxShadow: "0px 3px 1.50913px rgba(0, 0, 0, 0.3)",
    borderRadius: 8.4,
    clipPath: "polygon(100% 0%, 100% 85%,  50% 99.5%, 0% 85%, 0% 0%)",
    padding: '11px 11px 24px',
    paddingTop: ({ hiddenHeader }: any) => hiddenHeader ? "36px" : "11px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    [theme.breakpoints.down("sm")]: {
      paddingBottom: 20,
    },
    "& img": {
      width: "100%",
      height: ({ hiddenHeader }: any) => hiddenHeader ? "190px" : "210px",
      borderRadius: 16.5,
      boxShadow: '0px 29.7482px 23.1375px -22.3112px rgba(63, 83, 183, 0.22)',
      border: "0.82634px solid rgba(0, 0, 0, 0.09)",
      [theme.breakpoints.down("sm")]: {
        height: 180,
      },
    },
  },
  starGroup: {
    display: "flex",
    alignItems: "center",
    marginTop: 10,
    [theme.breakpoints.down("sm")]: {
      marginTop: -4,
    },
  },
  ntfName: {
    fontSize: 12,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "16px",
    textTransform: "capitalize",
    color: '#1A1B1C',
  },
  verifiedSection: {
    background: '#431AB7',
    border: '0.745618px solid #431AB7',
    borderRadius: 6,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px 8px',
    fontSize: 9,
    fontWeight: 800,
    fontFamily: "Agrandir",
    textTransform: "uppercase",
  },
  typo1: {
    fontSize: 13,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "17px",
    textTransform: "uppercase",
    color: '#431AB7',
    [theme.breakpoints.down("sm")]: {
      fontSize: 11,
    },
  },
  typo2: {
    fontSize: 12.3,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "16px",
    textTransform: "uppercase",
    color: '#ffffff',
    [theme.breakpoints.down("sm")]: {
      fontSize: 11,
    },
  }
}));
