import { makeStyles } from "@material-ui/core/styles";

export const mediaDetailsModalStyles = makeStyles(theme => ({
  content: {
    backgroundColor: "#E5E5E5 !important",
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'row',
      alignItems: 'center',
    }
  },
  fruitSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
    [theme.breakpoints.down('sm')]: {
      marginTop: 16
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: 0
    }
  },
  detailImg: {
    width: "100%",
    maxHeight: 448,
    borderRadius: 16,
    cursor: "pointer",
    objectFit: "cover",
  },
  creatorName: {
    maxWidth: 124,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: 1.2,
  },
  followBtn: {
    border: "0.7px solid #CBCBCB !important",
    borderRadius: "4px !important",
  },
  artist: {
    "& + &": {
      marginLeft: -12,
    },
  },
  divider: {
    border: "1px solid #707582",
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
