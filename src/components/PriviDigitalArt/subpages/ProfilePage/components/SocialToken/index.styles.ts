import { makeStyles } from "@material-ui/core/styles";

export const socialTokenPageStyles = makeStyles(theme => ({
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    color: '#2D3047',
    background: '#ffffff',
  },
  title: {
    fontSize: 30,
    fontWeight: 800,
    fontFamily: 'Agrandir',
    lineHeight: '39px',
    marginTop: 66,
    marginBottom: 21,
    [theme.breakpoints.down('sm')]: {
      fontSize: 22,
      lineHeight: '29px'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
      lineHeight: '23px'
    }
  },
  NoTokenContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(158, 172, 242, 0.3)',
    boxShadow: '0px 15px 16px -11px rgba(0, 0, 0, 0.02)',
    borderRadius: 20,
    padding: '52px 0 87px',
    marginBottom: 80,
  },
  h1: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: 24,
    lineHeight: "130%",
    paddingTop: 10
  },
  h2: {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: 16,
    lineHeight: "104%",
  },
  h3: {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 14,
    lineHeight: "150%",
    wordBreak: 'break-word'
  },
  typo1: {
    fontSize: 22,
    fontWeight: 800,
    fontFamily: 'Agrandir',
    lineHeight: '28.6px',
    marginTop: 16,
    color: '#431AB7',
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
    }
  },
  typo2: {
    fontSize: 18,
    fontWeight: 500,
    fontFamily: 'Montserrat',
    lineHeight: '27px',
    color: '#1A1B1C',
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
    }
  },
  typo3: {
    fontSize: 18,
    fontWeight: 800,
    fontFamily: 'Agrandir',
    lineHeight: '130%',
    color: '#2D3047',
  },
  typo4: {
    fontSize: 16.35,
    fontWeight: 600,
    fontFamily: 'Montserrat',
    lineHeight: '130%',
    color: '#431AB7',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  typo5: {
    fontSize: 26.16,
    fontWeight: 400,
    fontFamily: 'Agrandir',
    lineHeight: '130%',
    color: '#2D3047',
    textTransform: 'uppercase',
    marginRight: 9
  },
  typo6: {
    fontSize: 26.16,
    fontWeight: 400,
    fontFamily: 'Agrandir',
    lineHeight: '130%',
    color: '#2D304744',
    textTransform: 'uppercase',
  },
  createTokenBtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    fontSize: 16,
    fontWeight: 800,
    fontFamily: 'Agrandir',
    lineHeight: '21px',
    padding: '0 68px',
    borderRadius: 48,
    color: '#1A1B1C',
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    marginTop: 34,
    cursor: 'pointer'
  },
  tokenActionsContent: {
    display: 'flex',
    flexDirection: 'column',
    background: '#EFF2FD',
    boxShadow: '0px 4px 8px #9EACF2',
    borderRadius: 20,
    marginBottom: 23,
    padding: '33px 53px 42px',
    [theme.breakpoints.down('sm')]: {
      padding: '37px 19px 27px'
    },
    // [theme.breakpoints.down('xs')]: {
    //   padding: '37px 19px 27px'
    // }
  },
  tokenActionsBar: {
    display: "flex",
    alignItems: 'center',
    justifyContent: "space-between",
    flexDirection: 'row',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  actionWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 23,
    flexDirection: 'row',
    flex: 7,
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  actionBtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 800,
    fontFamily: 'Agrandir',
    lineHeight: '21px',
    cursor: 'pointer',
    borderRadius: 49,
    padding: '0 100px',
    [theme.breakpoints.down('lg')]: {
      padding: '0 80px'
    },
    [theme.breakpoints.down('md')]: {
      padding: '0 60px'
    },
    [theme.breakpoints.down('sm')]: {
      padding: '0 20px',
      width : "100%"
    },
  },
  airdropTokenBtn: {
    background: '#431AB7',
    [theme.breakpoints.down('xs')]: {
      marginRight: 0,
    }
  },
  allocateTokenBtn: {
    background: '#65CB63',
    [theme.breakpoints.down('xs')]: {
      padding: '0 46px',
      marginLeft: 0,
      marginTop: 20
    }
  },
  metaMaskBtn: {
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    [theme.breakpoints.down('xs')]: {
      padding: '0 46px',
      marginLeft: 0,
      marginTop: 20
    }
  },
  tokenStatsContent: {
    display: 'flex',
    flexDirection: 'column',
    background: '#EFF2FD',
    boxShadow: '0px 4px 8px #9EACF2',
    borderRadius: 20,
    padding: '33px 53px 42px',
    marginBottom: 23,
    [theme.breakpoints.down('xs')]: {
      padding: '33px 21px',
    }
  },
  statsItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  border: {
    height: 57,
    width: 1,
    background: '#E6E6E8'
  },
  withdrawBtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    background: '#ffffff',
    borderRadius: 49,
    fontSize: 16,
    fontWeight: 800,
    fontFamily: 'Agrandir',
    lineHeight: '21px',
    color: '#2D3047',
    border: '1px solid #65CB63',
    width: 240,
    marginTop: 32,
    cursor: 'pointer'
  },
  revenueGraphContent: {
    borderRadius: 20,
    padding: '32px 36px',
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    boxShadow: '0px 25px 36px -11px rgba(0, 0, 0, 0.02)',
    marginBottom: 23,
    [theme.breakpoints.down('xs')]: {
      padding: '32px 19px',
    }
  },
  timeFilters: {
    display: "flex",
    alignItems: "center",
    padding: 0,
    borderRadius: "8px",
    background: "#DAE6E5",
    [theme.breakpoints.down('xs')]: {
      marginTop: 12
    }
  },
  timeFilter: {
    cursor: "pointer",
    padding: "10px 12px",
    color: "#181818",
    fontFamily: "Montserrat",
    fontSize: "14px",
    fontWeight: 500,
  },
  selectedTimeFilter: {
    backgroundColor: '#2D3047',
    borderRadius: "8px",
    color: "#FFFFFF",
    fontWeight: 600,
  },
  tableContent: {
    display: 'flex',
    flexDirection: 'column',
    background: '#EFF2FD',
    boxShadow: '0px 4px 8px #9EACF2',
    borderRadius: 20,
    padding: '20px 0 40px',
    marginBottom: 80,
    "& .MuiTableContainer-root": {
      boxShadow: 'unset',
      "& .MuiTableCell-head": {
        color: '#431AB7',
        background: '#F7F9FE',
        fontSize: 14,
        fontWeight: 600,
        lineHeight: '17px',
        fontFamily: 'Montserrat',
        borderBottom: 'unset'
      },
      "& .MuiTableCell-root": {
        [theme.breakpoints.down('sm')]: {
          padding: '14px'
        },
        [theme.breakpoints.down('xs')]: {
          padding: '4px'
        }
      }
    }
  },
  tableFilters: {
    display: "flex",
    alignItems: "center",
    padding: 0,
    borderRadius: "77px",
    background: "#ffffff",
    width: 290,
  },
  tableFilter: {
    cursor: "pointer",
    padding: "9px 16px",
    color: "#1A1B1C",
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '14.63px'
  },
  selectedTableFilter: {
    backgroundColor: '#431AB7',
    borderRadius: "77px",
    color: "#FFFFFF",
    fontWeight: 600,
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    "& > *": {
      marginTop: theme.spacing(2),
    },
    "& > nav > ul > li > button": {
      color: "#2D3047",
      fontSize: 14,
      fontWeight: 600,
      "&.MuiPaginationItem-page.Mui-selected": {
        opacity: 0.38,
      },
    },
    "& > nav > ul > li > div": {
      color: "#2D3047 !important",
      fontSize: 14,
      fontWeight: 600,
    },
  },
}));
