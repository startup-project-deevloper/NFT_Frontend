import { makeStyles } from "@material-ui/core/styles";

export const collectionNFTCardStyles = makeStyles(theme => ({
  card: {
    background: "#431AB7",
    backdropFilter: "blur(3.59442px)",
    borderRadius: 8.4,
    clipPath: "polygon(100% 0%, 100% 85%,  50% 100%, 0% 85%, 0% 0%)",
    padding: 9,
    height:  ({ hiddenHeader }: any) => hiddenHeader ? 400 : 410,
    width: "100%",
    minWidth: 165,
    maxWidth: 300,
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      height: ({ hiddenHeader }: any) => hiddenHeader ? 385 : 350,
    },
    [theme.breakpoints.down("xs")]: {
      padding: 7,
      height: ({ hiddenHeader }: any) => hiddenHeader ? 350 : 250,
    },
  },
  innerBox: {
    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.4) 3.83%, rgba(255, 255, 255, 0) 31.54%), #9EACF2",
    boxShadow: "0px 3px 1.50913px rgba(0, 0, 0, 0.3)",
    borderRadius: 8.4,
    clipPath: "polygon(100% 0%, 100% 85%,  50% 99.5%, 0% 85%, 0% 0%)",
    padding: '11px 11px 24px',
    paddingTop: "11px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#fff",
    [theme.breakpoints.down("sm")]: {
      paddingBottom: 20,
    },
    [theme.breakpoints.down("xs")]: {
      padding: '7px 7px 16px',
    },
    "& img": {
      width: "190px",
      height: ({ hiddenHeader }: any) => hiddenHeader ? "190px" : "210px",
      objectFit: 'cover',
      borderRadius: 16.5,
      border: "0.710107px solid rgba(0, 0, 0, 0.09)",
      boxShadow: "0px 25.5639px 19.883px -19.1729px rgba(63, 83, 183, 0.22)",
      [theme.breakpoints.down("sm")]: {
        height: 190,
        borderRadius: 13,
      },
      [theme.breakpoints.down("xs")]: {
        height: ({ hiddenHeader }: any) => hiddenHeader ? "190px" : "130px",
        borderRadius: 10,
      },
    },
  },
  starGroup: {
    display: "flex",
    alignItems: "center",
    marginTop: 10,
  },
  ntfName: {
    fontSize: 12,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "16px",
    textTransform: "capitalize",
    color: '#1A1B1C',
    paddingLeft: 6,
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    margin: ({ hiddenHeader }: any) => hiddenHeader ? "auto" : "0 10px 0 0",
    [theme.breakpoints.down("sm")]: {
      fontSize: 11,
      lineHeight: "12px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 8,
      lineHeight: "9px",
    },
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
    [theme.breakpoints.down("xs")]: {
      fontSize: 7,
      padding: '3px 5px',
    },
  },
  typo1: {
    fontSize: 13,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "17px",
    textTransform: "uppercase",
    color: '#431AB7',
    [theme.breakpoints.down("xs")]: {
      fontSize: 11,
      lineHeight: "9px",
    },
  },
  typo2: {
    fontSize: 12.3,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "16px",
    textTransform: "uppercase",
    color: '#ffffff',
    [theme.breakpoints.down("xs")]: {
      fontSize: 10.5,
      lineHeight: "9px",
    },
  }
}));
