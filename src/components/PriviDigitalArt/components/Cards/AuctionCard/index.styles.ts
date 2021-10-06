import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/ui-kit";

export const AuctionCardStyles = makeStyles(theme => ({
  card: {
    background: Color.Purple,
    backdropFilter: "blur(3.59442px)",
    borderRadius: 8.4,
    clipPath: "polygon(100% 0%, 100% 85%,  50% 100%, 0% 85%, 0% 0%)",
    padding: 9,
    height: 420,
    width: "100%",
    minWidth: 165,
    maxWidth: 300,
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      height: 350,
    },
    [theme.breakpoints.down("xs")]: {
      padding: 7,
      height: 270,
    },
  },
  innerBox: {
    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.4) 3.83%, rgba(255, 255, 255, 0) 31.54%), #9EACF2",
    boxShadow: "0px 3px 1.50913px rgba(0, 0, 0, 0.3)",
    borderRadius: 8.4,
    clipPath: "polygon(100% 0%, 100% 85%,  50% 99.5%, 0% 85%, 0% 0%)",
    padding: 11,
    [theme.breakpoints.down("sm")]:{padding:8},
    [theme.breakpoints.down("xs")]:{padding:6},
    // height: 450,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: Color.White,
    "& img": {
      width: "100%",
      height: 223,
      borderRadius: 16.5,
      boxShadow: '0px 29.7482px 23.1375px -22.3112px rgba(63, 83, 183, 0.22)',
      border: "0.82634px solid rgba(0, 0, 0, 0.09)",
      [theme.breakpoints.down("sm")]: {
        height: "180px !important",
        borderRadius: 13,
      },
      [theme.breakpoints.down("xs")]: {
        height: "130px !important",
        borderRadius: 10,
      },
    },
    "& button": {
      width:" calc(100% - 24px)",
      marginTop: "3px",
      background: Color.GreenLight,
      color: Color.Purple,
      lineHeight: 'normal',
      textAlign: ({ isLive }: { isLive: boolean }) => isLive ? 'left' : 'center',
      padding: '8px 13px',
      fontSize: '14px',
      borderRadius:6,
      [theme.breakpoints.down("sm")]:{padding: '7px 10px', fontSize: '12px', borderRadius:4,},
      [theme.breakpoints.down("xs")]:{padding: '5px 7px', fontSize: '8px', borderRadius:4,},
        height: 'auto',
      "& span:first-child": {
        fontSize: '14px',
        fontWeight: 'normal'
      },
      "& span:last-child": {
        fontSize: '18px',
        fontWeight: 'bold'
      }
    }
  },
  starGroup: {
    display: "flex",
    alignItems: "center",
    marginTop: 10,
    [theme.breakpoints.down("sm")]:{marginTop:7},
    [theme.breakpoints.down("xs")]:{marginTop:4},
  },
  ntfName: {
    fontSize: 12,
    [theme.breakpoints.down("sm")]:{fontSize:10},
    [theme.breakpoints.down("xs")]:{fontSize:7},
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "16px",
    textTransform: "capitalize",
    color: '#1A1B1C',
  },
  verifiedSection: {
    background: ({ isLive }: { isLive: boolean }) =>  Color[isLive ? "GreenLight" : "Purple"],
    color: ({ isLive }: { isLive: boolean }) => Color[isLive ? 'Purple' : 'White'],
    borderRadius: 6,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px 8px',
    fontSize: 9,
    [theme.breakpoints.down("sm")]:{fontSize:7},
    [theme.breakpoints.down("xs")]:{fontSize:5},
    fontWeight: 800,
    fontFamily: "Agrandir",
    textTransform: "uppercase",
  },
  typo1: {
    fontSize: 13,
    [theme.breakpoints.down("sm")]:{fontSize:11},
    [theme.breakpoints.down("xs")]:{fontSize:8},
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "17px",
    textTransform: "uppercase",
    color: Color.Purple,
  },
  typo2: {
    fontSize: 12.3,
    [theme.breakpoints.down("sm")]:{fontSize:10},
    [theme.breakpoints.down("xs")]:{fontSize:7},
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "16px",
    textTransform: "uppercase",
    color: Color.White,
  }
}));
