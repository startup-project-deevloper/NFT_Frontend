import { makeStyles } from "@material-ui/core";

export const useNFTLoansPageStyles = makeStyles(theme => ({
  main: {
    position: 'relative',
    width: 'calc(100% - 208px)',
    "@media (max-width: 768px)": {
      width: '100%',
    },
  },
  content: {
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
    padding: "45px 80px",
    "& > div > h2": {
      fontFamily: "Agrandir GrandLight",
      fontWeight: "800",
      fontSize: "40px",
      lineHeight: "104.5%",
      margin: 0,
      color: "#431AB7",
      "& span": {
        fontSize: "18px",
        lineHeight: "23px",
      },
    },
    "& > div > h5": {
      color: "#431AB7",
      fontWeight: "normal",
      fontStyle: "normal",
      fontSize: "18px",
      lineHeight: "104.5%",
      marginTop: "24px",
      marginBottom: "84px",
      textAlign: 'center',
      "& span": {
        fontSize: "18px",
        lineHeight: "23px",
      },
    },
    "& > h3": {
      marginTop: "64px",
      fontSize: "30px",
      lineHeight: "104.5%",
      marginBottom: "16px",
    },
    [theme.breakpoints.down('md')]: {
      padding: '63px 30px',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '63px 20px',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '35px 8px',
    },
  },
  cardContainer: {
    [theme.breakpoints.down('sm')]: {
      padding: "0 25px",
    },
  },
  ellipse: {
    position: "absolute",
    zIndex: 0,
    top: 0,
  },
  ellipse2: {
    position: "absolute",
    zIndex: 0,
    left: "573px",
    top: "122px",
  },
  purpleBox: {
    background: "#E2E6FB",
    boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.1)",
    position: "relative",
    padding: "24px",
    paddingLeft: "64px",
    color: "#431AB7",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: 800,
    minHeight: "75px",
    width: "fit-content",
    "& img": {
      position: "absolute",
      top: "-33px",
      left: "-41px",
    },
  },
  greenButton: {
    color: "#431AB7",
    background: "#DDFF57",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    borderRadius: "4px",
    padding: "12px 48px",
    fontSize: "18px",
    height: 45,
    "&:last-child:not(:first-child)": {
      marginLeft: "40.5px",
    },
    [theme.breakpoints.down('sm')]: {
      padding: "12px 32px",
    },
    [theme.breakpoints.down('xs')]: {
      padding: "12px 48px",
      marginTop: 16,
      "&:last-child:not(:first-child)": {
        marginLeft: "0px",
      },
    }
  },
  artCards: {
    width: "calc(100% + 20px)",
    marginLeft: -10,
    marginTop: -10,
    marginBottom: 38,
    padding: "10px 5px",
    "& > div": {
      width: "100%",
    },
  },
  mediaImageWrapper: {
    height: "80px",
    width: "80px",
    flex: 1,
    marginRight: 16,
    [theme.breakpoints.down('md')]: {
      height: "60px",
      width: "60px",
      marginRight: 8,
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: 8,
      height: "40px",
      width: "40px",
    },
    [theme.breakpoints.down('xs')]: {
      borderRadius: 4,
      height: "20px",
      width: "20px",
      flex: 0
    },
  },
  mediaImage: {
    height: "80px",
    width: "80px",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxSizing: "content-box",
    borderRadius: "16px",
    [theme.breakpoints.down('md')]: {
      height: "60px",
      width: "60px",
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: 8,
      height: "40px",
      width: "40px",
    },
    [theme.breakpoints.down('xs')]: {
      borderRadius: 4,
      height: "25px",
      width: "25px",
    },
  },
  mediaName: {
    color: "#9EACF2",
    textAlign: "left",
    flex: 2,
    [theme.breakpoints.down('xs')]: {
      wordBreak: "break-all"
    },
  },
  mediaTitle: {
    color: "#181818",
    fontSize: "16px",
    lineHeight: "104.5%",
    marginBottom: "4px",
  },
  secondary: {
    border: "1px solid #431AB7 !important",
    marginTop: "8px",
    background: "white !important",
    color: "#431AB7 !important",
  },
  primary: {
    border: "1px solid #431AB7 !importafnt",
    marginTop: "8px",
    color: "white !important",
    background: "#431AB7 !important",
  },
  chain: {
    width: 24,
    height: 24,
    objectFit: "contain",
    borderRadius: "50%",
    [theme.breakpoints.down('xs')]: {
      height: 12,
      width: 12,
    },
  },
  blue: { color: "#9EACF2" },
  tableContainerWithAbsoluteImage: {
    width: "100%",
    zIndex: 2,
    paddingTop: "80px",
    position: "relative",
    marginTop: "-80px",
  },
  tableContainer: {
    borderRadius: "16px",
    width: "100%",
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
      "& th": {
        height: 64,
        lineHeight: "120%",
        [theme.breakpoints.down('xs')]: {
          height: 48,
          letterSpacing: "-0.1px"
        },
      },
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
        [theme.breakpoints.down('xs')]: {
          fontSize: 9,
          paddingLeft: 0,
          paddingTop: 8,
          paddingBottom: 8,
          minWidth: 32,
        },
        [theme.breakpoints.down(370)]: {
          fontSize: 8,
        },
        "&:last-child": {
          paddingRight: 16,
          [theme.breakpoints.down('md')]: {
            paddingRight: 8,
          },
          [theme.breakpoints.down('sm')]: {
            paddingRight: 4,
          },
          [theme.breakpoints.down('xs')]: {
            paddingRight: 0,
          },
        }
      }
    },
  },
  tableAvatarField: {
    marginLeft: 16,
    cursor: "pointer",
    fontWeight: "bold",
    [theme.breakpoints.down('md')]: {
      marginLeft: 8,
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: 4,
    },
    [theme.breakpoints.down('xs')]: {
      width: 64,
    },
  },
  absoluteImage: {
    top: "-25px",
    left: "85%",
    position: "absolute",
    height: "187.96px",
    transform: "rotate(3.22deg)",

    "@media (max-width: 1200px)": {
      display: 'none',
    },
  },
  positionTitle: {
    color: "#431AB7",
    fontSize: "30px",
    marginBottom: "32px",
    marginTop: "40px",

    [theme.breakpoints.down('sm')]: {
      fontSize: 26,
    },
  },
  debtColumn: {
    minWidth: 46,
  },
  buttonGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 76,
    marginBottom: 40,
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      marginTop: 46,
      marginBottom: 64,
    },
  },
  positionButtons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    rowGap: 8,
    flexDirection: "row",
    marginRight: 16,
    [theme.breakpoints.down('md')]: {
      marginRight: 8,
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: "column",
      rowGap: 4,
    },
    "& > button": {
      whiteSpace: "nowrap",
      [theme.breakpoints.down('md')]: {
        fontSize: 12,
      },
      [theme.breakpoints.down('sm')]: {
        marginLeft: '0 !important',
        marginTop: '0 !important',
        height: 25,
        width: '100%',
        lineHeight: '25px',
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: 9,
        fontWeight: 400,
        height: 20,
        lineHeight: '20px',
        minWidth: 'unset',
        padding: '0px 3px'
      },
      [theme.breakpoints.down(370)]: {
        fontSize: 8,
      }
    },
  }
}));
