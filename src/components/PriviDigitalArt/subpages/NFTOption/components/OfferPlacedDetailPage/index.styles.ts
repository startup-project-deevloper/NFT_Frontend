import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/ui-kit";

export const OfferPlacedDetailPageStyles = makeStyles(theme => ({
  content: {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minHeight: "calc(100vh - 104px)",
    maxHeight: "calc(100vh - 104px)",
    overflowX: "hidden",
    position: "relative",
    padding: "45px 40px",
    "& .chartjs-render-monitor": {
      borderRadius: "8px",
    },
    [theme.breakpoints.down('xs')]: {
      padding: "16px 16px 45px 16px",
    }
  },
  detailImg: {
    width: "100%",
    objectFit: "fill",
    borderRadius: 16,
    cursor: 'pointer'
  },
  creatorName: {
    maxWidth: 124,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontFamily: 'Agrandir',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '30px !important',
    lineHeight: '39px',
    color: '#1A1B1C',
    mixBlendMode: 'normal',
  },
  artist: {
    "& + &": {
      marginLeft: -12,
    },
  },
  rateIcon: {
    marginRight: 4,
    background: Color.Yellow,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  divider: {
    border: "1px solid #EBEBEB",
    margin: "24px 0px",
  },
  fruitsContainer: {
    marginRight: "10px",
    "& > div > div": {
      background: "#9EACF2",
      width: 30,
      height: 30,
      borderRadius: 15,
      padding: 5,
      filter: "drop-shadow(0px 1.5px 6px rgba(0, 0, 0, 0.2))",
      "& img": {
        width: 21,
      },
    },
  },
  followBtn: {
    border: "0.7px solid #CBCBCB !important",
    borderRadius: "4px !important",
    width: "130px !important",
    fontSize: "14px !important",
    fontFamily: 'Agrandir',
    fontStyle: 'normal',
    fontWeight: 800,
    lineHeight: '18px',
    textAlign: 'center',
    color: '#000000',
    position: "relative",
    [theme.breakpoints.down('sm')]: {
      marginTop: 15,
    }
  },
  checkOnBtn: {
    border: "0.7px solid #CBCBCB !important",
    borderRadius: "4px !important",
    width: "130px !important",
    fontSize: "14px !important",
    fontFamily: 'Agrandir',
    fontStyle: 'normal',
    fontWeight: 800,
    lineHeight: '18px',
    textAlign: 'center',
    color: '#000000',
    position: "relative",
    [theme.breakpoints.down('sm')]: {
      marginTop: 15,
    }
  },
  checkOrderbookBtn: {
    border: "0.7px solid #CBCBCB !important",
    borderRadius: "4px !important",
    width: "155px !important",
    fontSize: "14px !important",
    fontFamily: 'Agrandir',
    fontStyle: 'normal',
    fontWeight: 800,
    lineHeight: '18px',
    textAlign: 'center',
    color: '#000000',
    position: "relative",
    [theme.breakpoints.down('sm')]: {
      marginTop: 15,
    }
  },
  label: {
    color: "#1A1B1C",
    fontSize: "18px",
    marginBottom: "24px",
    lineHeight: "104.5%",
  },
  description: {
    color: "#707582",
    fontSize: "14px",
    lineHeight: "21px",
  },
  secondary: {
    color: "#431AB7 !important",
    border: "1px solid #431AB7 !important",
    background: "white !important",
    borderRadius: '4px !important',
    height: '40px !important',
    padding: '0px 38px !important',
    marginLeft: 24,
    [theme.breakpoints.down('sm')]: {
      padding: '0px 20px !important',
      marginLeft: 12
    }
  },
  primary: {
    color: "white !important",
    border: "1px solid #431AB7 !important",
    background: "#431AB7 !important",
    height: '40px !important',
    padding: '0px 27px !important',
    borderRadius: '4px !important',
    [theme.breakpoints.down('sm')]: {
      padding: '0px 20px !important',
    }
  },
  detailPrimary: {
    fontSize: '14px !important',
    color: "white !important",
    border: "1px solid #431AB7 !important",
    background: "#431AB7 !important",
    height: '34px !important',
    lineHeight: '34px !important',
    padding: '0px 27px !important',
    borderRadius: '4px !important',
    [theme.breakpoints.down('sm')]: {
      padding: '0px 8px !important',
      minWidth: 160
    }
  },
  detailSecondary: {
    color: "#431AB7 !important",
    border: "1px solid #DDFF57 !important",
    background: "#DDFF57 !important",
    fontSize: '14px !important',
    height: '34px !important',
    lineHeight: '34px !important',
    padding: '0px 27px !important',
    borderRadius: '4px !important',
    [theme.breakpoints.down('sm')]: {
      padding: '0px 20px !important',
    }
  },
  debtTitle: {
    color: "#181818",
    fontSize: "14px",
    lineHeight: "120%",
    marginRight: "8px",
    [theme.breakpoints.down('sm')]: {
      fontSize: 11,
      marginRight: 3,
    }
  },
  debt: {
    color: "#431AB7",
    fontFamily: "Agrandir GrandLight",
    fontSize: "18px",
    lineHeight: "104.5%",
    fontWeight: 300,
    display: "flex",
    alignItems: "center",
    "& span": {
      fontFamily: "Agrandir",
      marginLeft: "8px",
      color: "#A4A4A4",
      fontSize: "11px",
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      "& span": {
        fontSize: 9,
        marginLeft: 3
      }
    }
  },
  greenBox: {
    borderRadius: "8px",
    background: "#DDFF57",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "32px 60px",
    color: "#431AB7",
    flexDirection: 'row',
    "& label": {
      fontSize: "14px",
      lineHeight: "120%",
    },
    "& h3": {
      margin: "8px 0px 0px",
      fontFamily: "Agrandir GrandLight",
      fontSize: "24px",
      fontWeight: 800,
      lineHeight: "104.5%",
    },
    [theme.breakpoints.down('sm')]: {
      padding: '32px 24px',
      "& label": {
        fontSize: 11,
      },
      "& h3": {
        fontSize: 16,
      },
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      padding: '32px 16px',
    }
  },
  mediaName: {
    marginRight: 18,
    color: "#1A1B1C",
    fontSize: "30px",
    lineHeight: "39px",
    [theme.breakpoints.down('sm')]: {
      fontSize: 20,
      marginRight: 8,
    }
  },
  chain: {
    width: 24,
  },
  blue: {
    color: "#9EACF2",
  },
  ellipsis: {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    [theme.breakpoints.down(550)]: {
      width: 100,
    },
    [theme.breakpoints.down(410)]: {
      width: 80,
    },
    [theme.breakpoints.down(380)]: {
      width: 65,
    },
  },
  avatar: {
    backgroundColor: "#c4c4c4",
    width: 40,
    minWidth: 40,
    height: 40,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "50%",
    marginRight: 8,
    cursor: "pointer"
  },
  transactionsSection: {
    width: '100%'
  },
  transactionsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    width: '100%',
    marginBottom: 12,
    marginTop: 50
  },
  transactionsTable: {
    width: "100%",
    borderRadius: "16px",
    zIndex: 2,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",

    "& .MuiTableContainer-root": {
      borderRadius: 16,
      overflowX: 'auto',
      "&::-webkit-scrollbar-thumb": {
        background: "rgb(193 193 193)",
      }
    },

    "& .MuiTableCell-head": {
      background: "#9EACF2",
    },

    "&.position-table .MuiTable-root": {
      "& td, & th": {
        borderRadius: '0px !important',
        paddingRight: 0,
        paddingLeft: 16,
        [theme.breakpoints.down('md')]: {
          fontSize: 12,
          padding: 8,
          paddingRight: 0,
        },
        [theme.breakpoints.down('sm')]: {
          fontSize: 10,
        },
        "&:last-child": {
          paddingRight: 16,
          [theme.breakpoints.down('md')]: {
            paddingRight: 8,
          },
        }
      }
    },
  },
  detailHeaderText: {
    fontFamily: 'Agrandir',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px !important',
    lineHeight: '120%',    
    color: '#431AB7 !important',
  },  
  detailBodyText: {
    fontFamily: 'Agrandir',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '18px !important',
    lineHeight: '23px',    
    color: '#181818 !important',
  },
  priceBox: {
    background: 'rgba(158, 172, 242, 0.16)',
    border: '1px solid rgba(158, 172, 242, 0.2)',
    boxSizing: 'border-box',
    borderRadius: '8px',
    marginTop:'45px',
    padding:'23px'
  },
  priceBoxName: {
    fontFamily: 'Agrandir',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '16px',
    lineHeight: '104.5%',
    color: '#181818',
  },
  priceBoxPrice: {
    fontFamily: 'Agrandir',
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '18px',
    lineHeight: '104.5%',
    color: '#431AB7',
  },
  primaryButton: {
    width:'50%',
    background: '#431AB7',
    borderRadius: '8px',
    transform: 'rotate(0.11deg)',
    padding: '20px 0px 14px 0px',
    cursor:'pointer',
    fontFamily: 'Agrandir',
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '16px',
    lineHeight: '21px',
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#FFFFFF',
    marginRight:'5px',
  },
  secondaryButton: {
    width:'50%',
    background: '#ffffff',
    border: '1px solid #431AB7',
    borderRadius: '8px',
    transform: 'rotate(0.11deg)',
    padding: '20px 0px 14px 0px',
    cursor:'pointer',
    fontFamily: 'Agrandir',
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '16px',
    lineHeight: '21px',
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#431AB7',
    marginLeft:'5px',
  },
  offersCountBox: {
    marginTop: '40px',
    position: 'relative'
  },
  offersText: {
    fontFamily: 'Agrandir',
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '18px',
    textAlign: 'center',
    color: '#431AB7',
    marginLeft: '20px'
  },
  coinFlipHistorySection: {
    border: "1px solid #9EACF2",
    background: "#ffffff",
    marginTop: 11,
    borderRadius: 20,
  },
  typo8: {
    fontSize: 18,
    fontWeight: 800,
    lineHeight: "104.5%",
    fontFamily: "Agrandir",
    marginTop: 36,
    marginLeft: 50,
    color: "rgba(67, 26, 183, 1)",
    [theme.breakpoints.down("md")]: {
      marginLeft: 30,
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 20,
      marginLeft: 12,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
      marginLeft: 8,
    },
  },
  table: {
    marginTop: 24,
    minHeight: 320,
    "& .MuiTableContainer-root": {
      boxShadow: "unset",
    },
    "& .MuiTableCell-root": {
      fontFamily: "Agrandir",
      padding: "9px 16px",
      [theme.breakpoints.down("sm")]: {
        padding: "8px 12px",
      },
      [theme.breakpoints.down("xs")]: {
        padding: "8px",
      },
      "&:first-child": {
        textAlign:'left'
      },
    },
    "& .MuiTableRow-head": {
      background: Color.GrayInputBackground,
      "& .MuiTableCell-head": {
        background: "#ffffff",
        fontSize: 18,
        fontWeight: 700,
        fontFamily: "Agrandir",
        color: "rgba(67, 26, 183, 1)",
        [theme.breakpoints.down("sm")]: {
          fontSize: 14,
        },
        [theme.breakpoints.down("xs")]: {
          fontSize: 12,
        },
      },
    },
    "& .MuiTableRow-root": {
      "& .MuiTableCell-body": {
        fontSize: 14,
        [theme.breakpoints.down("sm")]: {
          fontSize: 12,
        },
        [theme.breakpoints.down("xs")]: {
          fontSize: 9,
        },
      },
    },
    "& tr th": {
        color:'#707582 !important',
        fontSize:'16px !important',
        fontWeight: '600 !important',
        textAlign:'center'
    },
    "& tr td:first-child": {
        color:'#431AB7 !important',
    },
    "& tr td": {
        color:'#1A1B1C !important',
        fontSize:'16px !important',
        fontWeight: '600 !important',
        textAlign:'center'
    },


    [theme.breakpoints.down("sm")]: {
      minHeight: 200,
    },
  },
  explorerImg: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "5px 24px",
    border: "1px solid rgba(67, 26, 183, 1)",
    borderRadius: 6,
    width: 120,
    height: 40,
    margin: "auto",
    [theme.breakpoints.down("sm")]: {
      width: 76,
    },
    [theme.breakpoints.down("xs")]: {
      width: 49,
    },
  },
  offersCount: {
    background: '#EFF2FD',
    borderRadius: '18px',
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    fontSize: '12px',
    color: '#431AB7',
    padding:'4px 17px',
    marginLeft: '9px'
  }
}));
