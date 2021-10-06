import { makeStyles } from "@material-ui/core/styles";

export const mediaDetailsModalStyles = makeStyles(theme => ({
  content: {
    backgroundColor: "#1A1A1C !important",
    color: '#ffffff !important',
  },
  title: {
    fontSize: 30,
    fontWeight: 800,
    fontFamily: 'Agrandir',
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
  fruitSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      marginTop: 16
    }
  },
  detailImg: {
    maxHeight: 448,
    borderRadius: 16,
    cursor: "pointer",
    objectFit: "cover",
  },
  creatorName: {
    fontFamily: 'Montserrat',
    fontWeight: 500,
    maxWidth: 124,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: 1.2,
  },
  followBtn: {
    background: "linear-gradient(225.12deg, #F2A07E -33.5%, #FF5954 71.42%)",
    borderRadius: "10px !important",
  },
  artist: {
    "& + &": {
      marginLeft: -12,
    },
  },
  divider: {
    border: "1px solid #ffffff",
    margin: "24px 0px",
  },
  accordion: {
    boxShadow: "none",
    "&::before": {
      backgroundColor: "transparent",
    },
    "& .MuiAccordionSummary-root": {
      minHeight: "unset",
      padding: 0,
      "& .MuiAccordionSummary-content": {
        margin: 0,
      },
      "& .MuiAccordionSummary-expandIcon": {
        margin: 0,
        padding: 0,
      },
    },
    "& .MuiAccordionDetails-root": {
      marginTop: 20,
      padding: 0,
      display: "block",
    },
  },
}));
