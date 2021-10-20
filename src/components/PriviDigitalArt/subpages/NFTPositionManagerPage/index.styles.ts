import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/ui-kit";

export const useNFTPositionManagerPageStyles = makeStyles(theme => ({
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
    padding: "45px 0",
    "& > div > h2": {
      paddingTop: 30,
      fontFamily: "Agrandir GrandHeavy",
      fontWeight: "800",
      fontSize: "40px",
      lineHeight: "104.5%",
      margin: 0,
      color: "#431AB7",
      [theme.breakpoints.down("xs")]: {
        fontSize: "20px",
      },
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
      padding: '15px 0px',
    },
  },
  absoluteImage: {
    top: "-10px",
    left: "85%",
    position: "absolute",
    height: "187.96px",
    transform: "rotate(3.22deg)",

    "@media (max-width: 1200px)": {
      display: 'none',
    },
  },
  tab: {
    fontFamily: "Agrandir GrandHeavy",
    marginRight: 135,
    fontStyle: "normal",
    fontSize: 16,
    lineHeight: "104.5%",
    color: "#431AB760",
    cursor: "pointer",
    border: "none",
    padding: "0 12px 12px",
    [theme.breakpoints.down("sm")]: {
      marginRight: 50,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 10,
      padding: "0 0 10px",
      "&:first-child": {
        marginRight: "30px"
      },
      "&:last-child": {
        marginRight: "0px"
      }
    },
  },
  selectedTab: {
    color: "#431AB7",
    borderBottom: "4px solid #431AB7",
    opacity: 1,
  },
  tableAvatarField: {
    marginLeft: 16,
    cursor: "pointer",
    fontWeight: "bold",
    [theme.breakpoints.down("md")]: {
      marginLeft: 8,
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: 4,
    },
    [theme.breakpoints.down("xs")]: {
      width: 64,
    },
  },
  mediaImageWrapper: {
    height: "73px",
    width: "73px",
    marginRight: 16,
    [theme.breakpoints.down("md")]: {
      height: "60px",
      width: "60px",
      marginRight: 8,
    },
    [theme.breakpoints.down("sm")]: {
      borderRadius: 8,
      height: "40px",
      width: "40px",
    },
    [theme.breakpoints.down("xs")]: {
      borderRadius: 4,
      height: "20px",
      width: "20px",
      flex: 0,
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
    [theme.breakpoints.down("md")]: {
      height: "60px",
      width: "60px",
    },
    [theme.breakpoints.down("sm")]: {
      borderRadius: 8,
      height: "40px",
      width: "40px",
    },
    [theme.breakpoints.down("xs")]: {
      borderRadius: 4,
      height: "25px",
      width: "25px",
    },
  },
  loanMediaTextWrapper: {
    marginLeft: 16,
    maxWidth: '100%',

    [theme.breakpoints.down("sm")]: {
      maxWidth: 120,
    },

    [theme.breakpoints.down("xs")]: {
      marginLeft: 8,
      maxWidth: 75,
    },
  },
  loanMediaNameTag: {
    background: "#431AB7",
    borderRadius: 4,
    fontWeight: "bold",
    fontSize: 10,
    color: "white",
    padding: "5px 9px",
    width: "fit-content",
    marginBottom: 8,
    
    [theme.breakpoints.down("xs")]: {
      padding: "0 5px",
      marginBottom: 4,
    },
  },
  loanMediaName: {
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: "104.5%",

    textAlign: "justify",

    color: "#431AB7",
    marginBottom: 8,
    whiteSpace: "nowrap",
    overflow: 'hidden',
    textOverflow: "ellipsis",

    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
      marginBottom: 4,
    },
  },
  loanMediaNameId: {
    fontSize: 14,
    lineHeight: "104.5%",

    textAlign: "justify",

    color: "#431AB7",

    textShadow: "0px 0px 20px rgba(255, 255, 255, 0.3)",

    [theme.breakpoints.down("xs")]: {
      fontSize: 10,
    },
  },
  positionColumnButtons: {
    display: "flex",
    alignItems: "center",
    rowGap: 4,
    flexDirection: "column",
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
      borderRadius: 4,
      padding: "0 40px",
      marginLeft: '0 !important',
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
        padding: '0px 12px'
      },
      [theme.breakpoints.down(370)]: {
        fontSize: 8,
      }
    }
  },
  primary: {
    border: "1px solid #431AB7 !importafnt",
    marginTop: "8px",
    color: "white !important",
    background: "#431AB7 !important",
  },
  secondary: {
    border: "1px solid #431AB7 !important",
    marginTop: "8px",
    background: "white !important",
    color: "#431AB7 !important",
  },
  loanTopButtonBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "36px 42px",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      marginTop: 24,
      marginBottom: 32,
    },
  },
  btnGroup: {
    display: "flex",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      marginBottom: theme.spacing(2),
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
      marginLeft: "20px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "12px 32px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "12px 48px",
      marginTop: 16,
      "&:last-child:not(:first-child)": {
        marginLeft: "0px",
      },
    },
  },
  tableContainerWithAbsoluteImage: {
    width: "calc(100% - 36px)",
    background: "#F6F5F8",
    padding: "0 8px 20px",
    margin: "24px 18px 0 18px",
    borderRadius: 30,

    [theme.breakpoints.down("xs")]: {
      padding: "0 16px 16px",
    },
  },
  tableLoansContainer: {

    "& .MuiTable-root": {
      borderCollapse: "separate",
      borderSpacing: "0 10px"
    },

    "& .MuiTableHead-root": {

      "& .MuiTableRow-root": {
        backgroundColor: "transparent",
      }
    },

    "& .MuiTableCell-head": {
      background: "transparent !important",
      fontWeight: 600,
      fontSize: 14,
      lineHeight: "120%",
      color: `${Color.Purple} !important`,

      "&:first-child": {
        paddingLeft: 25,
      }
    },
    "& .MuiTableRow-root": {
      backgroundColor: "#white",
      border: "1px solid rgba(158, 172, 242, 0.4)",

      "&:nth-child(odd)": {
        "& td:first-child": {
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,

          [theme.breakpoints.down("xs")]: {
            width: "fit-content",

            "& > div": {
              width: "fit-content"
            },
          },
        },

        "& td:last-child": {
          borderTopRightRadius: 16,
          borderBottomRightRadius: 16,

          "& svg": {
            cursor: "pointer"
          }
        }
      }
    },
  },
  inputJots: {
    margin: "8px 0",
    background: "rgba(144, 155, 255, 0.16)",
    border: "1px solid #431AB7",
    width: "100%",
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
  },
  purpleText: {
    cursor: "pointer",
    color: "#431AB7",
    fontSize: "12px",
    minWidth: "55px",
  },
  usdWrap: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      paddingTop: "0",
    },
  },
  point: {
    background: "#D9F66F",
    width: "13px",
    height: "13px",
    borderRadius: "100%",
    marginRight: 4,
  },
  purpleBg: {
    background: "#F7F9FE",
    border: "1px solid #431AB7",
    borderRadius: 12,
    height: 50,
    margin: "8px 0",
  },
  collapse: {
    padding: "0 6px 42px",
    "& > p": {
      fontFamily: "Agrandir GrandHeavy",
      fontWeight: 800,
      fontSize: "18px",
      lineHeight: "104.5%",
      marginTop: 38,
      color: Color.Purple
    },
    "& > span": {
      fontWeight: "normal",
      fontSize: "14px",
      lineHeight: "120%",
      color: Color.Purple,
      marginTop: 7
    }
  },
  border: {
    height: 1,
    background: "#DCE2FA",
  },
  collapseGap: {
    backgroundColor: "white",
    position: "absolute",
    width: "100%",
    height: 30,
    top: -20,
    left: 0,
    "& div": {
      height: 1,
      width: "100%",
      backgroundColor: "#DCE2FA",
      marginTop: 10
    }

  }
}));
