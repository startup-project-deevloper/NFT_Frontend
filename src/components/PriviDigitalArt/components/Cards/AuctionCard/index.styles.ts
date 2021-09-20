import { makeStyles } from "@material-ui/core";
import { Color } from "shared/ui-kit";

export const AuctionCardStyles = makeStyles(theme => ({
  card: {
    background: Color.Purple,
    backdropFilter: "blur(3.59442px)",
    borderRadius: 8.4,
    clipPath: "polygon(100% 0%, 100% 80%,  50% 91%, 0% 80%, 0% 0%)",
    padding: 9,
    height: 470,
    width: "100%",
    cursor: "pointer",
  },
  innerBox: {
    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.4) 3.83%, rgba(255, 255, 255, 0) 31.54%), #9EACF2",
    boxShadow: "0px 3px 1.50913px rgba(0, 0, 0, 0.3)",
    borderRadius: 8.4,
    clipPath: "polygon(100% 0%, 100% 80%,  50% 90%, 0% 80%, 0% 0%)",
    padding: 11,
    height: 450,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: Color.White,
    "& img": {
      width: "100%",
      height: 223,
      borderRadius: 16.5,
      boxShadow: '0px 29.7482px 23.1375px -22.3112px rgba(63, 83, 183, 0.22)',
      border: "0.82634px solid rgba(0, 0, 0, 0.09)"
    },
    "& button": {
      width:" calc(100% - 24px)",
      marginTop: "3px",
      background: Color.GreenLight,
      color: Color.Purple,
      lineHeight: 'normal',
      textAlign: ({ isLive }: { isLive: boolean }) => isLive ? 'left' : 'center',
      padding: '8px 13px',
      height: ({ isLive }: { isLive: boolean }) => isLive ? 'auto' : '40px',
      "& span:first-child": {
        fontSize: '14px',
        fontWeight: 'normal'
      }
    }
  },
  starGroup: {
    display: "flex",
    alignItems: "center",
    marginTop: 10
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
    background: ({ isLive }: { isLive: boolean }) =>  Color[isLive ? "GreenLight" : "Purple"],
    color: ({ isLive }: { isLive: boolean }) => Color[isLive ? 'Purple' : 'White'],
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
    color: Color.Purple,
  },
  typo2: {
    fontSize: 12.3,
    fontWeight: 800,
    fontFamily: "Agrandir",
    lineHeight: "16px",
    textTransform: "uppercase",
    color: Color.White,
  }
}));
