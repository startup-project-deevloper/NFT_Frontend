import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/ui-kit";

export const useNFTLoansPageStyles = makeStyles(theme => ({
  main: {
    position: "relative",
    width: "calc(100% - 208px)",
    "@media (max-width: 768px)": {
      width: "100%",
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
      fontFamily: "Agrandir GrandHeavy",
      fontWeight: "800",
      fontSize: "40px",
      lineHeight: "104.5%",
      margin: 0,
      color: "#431AB7",
      [theme.breakpoints.down("xs")]: {
        fontSize: "28px",
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
    [theme.breakpoints.down("md")]: {
      padding: "63px 30px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "63px 20px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "35px 0px",
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
  mediaName: {
    color: "#9EACF2",
    textAlign: "left",
    flex: 2,
    [theme.breakpoints.down("xs")]: {
      wordBreak: "break-all",
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
    [theme.breakpoints.down("xs")]: {
      height: 12,
      width: 12,
    },
  },
  blue: { color: "#9EACF2" },
  tableContainerWithAbsoluteImage: {
    width: "100%",
    background: "#F6F5F8",
    padding: "0 36px 36px",

    [theme.breakpoints.down("xs")]: {
      padding: "0 16px 16px",
    },
  },
  tableLoansContainer: {
    "& .MuiTable-root": {
      borderCollapse: "separate",
      borderSpacing: "0 10px",
    },

    "& .MuiTableHead-root": {
      "& .MuiTableRow-root": {
        backgroundColor: "transparent",
      },
    },

    "& .MuiTableCell-head": {
      background: "transparent",
      fontWeight: 600,
      fontSize: 14,
      lineHeight: "120%",
      color: Color.Purple,

      "&:first-child": {
        paddingLeft: 25,
      },
    },
    "& .MuiTableRow-root": {
      backgroundColor: "#white",
      border: "1px solid rgba(158, 172, 242, 0.4)",

      "& td:first-child": {
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,

        [theme.breakpoints.down("xs")]: {
          width: "fit-content",

          "& > div": {
            width: "fit-content",
          },
        },
      },

      "& td:last-child": {
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
      },
    },
  },
  tableContainer: {
    borderRadius: "16px",
    width: "100%",
    zIndex: 2,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",

    "& .MuiTableContainer-root": {
      borderRadius: 16,
      overflowX: "auto",
      "&::-webkit-scrollbar-thumb": {
        background: "rgb(193 193 193)",
      },
    },

    "& .MuiTableCell-head": {
      background: "#9EACF2",
    },

    "&.position-table .MuiTable-root": {
      "& th": {
        height: 64,
        lineHeight: "120%",
        [theme.breakpoints.down("xs")]: {
          height: 48,
          letterSpacing: "-0.1px",
        },
      },
      "& td, & th": {
        borderRadius: "0px !important",
        paddingRight: 0,
        paddingLeft: 16,
        [theme.breakpoints.down("md")]: {
          fontSize: 12,
          padding: 8,
          paddingRight: 0,
        },
        [theme.breakpoints.down("sm")]: {
          fontSize: 10,
        },
        [theme.breakpoints.down("xs")]: {
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
          [theme.breakpoints.down("md")]: {
            paddingRight: 8,
          },
          [theme.breakpoints.down("sm")]: {
            paddingRight: 4,
          },
          [theme.breakpoints.down("xs")]: {
            paddingRight: 0,
          },
        },
      },
    },
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
  absoluteImage: {
    top: "-25px",
    left: "85%",
    position: "absolute",
    height: "187.96px",
    transform: "rotate(3.22deg)",

    "@media (max-width: 1200px)": {
      display: "none",
    },
  },
  positionTitle: {
    fontSize: "30px",
    marginBottom: "16px",
    paddingTop: "50px",

    [theme.breakpoints.down("sm")]: {
      fontSize: 26,
    },
  },
  debtColumn: {
    minWidth: 46,
  },
  buttonGroup: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginTop: 36,
    marginBottom: 60,
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      marginTop: 46,
      marginBottom: 64,
    },
  },
  positionColumnButtons: {
    display: "flex",
    alignItems: "center",
    rowGap: 4,
    flexDirection: "column",
    marginRight: 16,
    [theme.breakpoints.down("md")]: {
      marginRight: 8,
    },
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      rowGap: 4,
    },
    "& > button": {
      whiteSpace: "nowrap",
      borderRadius: 4,
      padding: "0 40px",
      marginLeft: "0 !important",
      [theme.breakpoints.down("md")]: {
        fontSize: 12,
      },
      [theme.breakpoints.down("sm")]: {
        marginLeft: "0 !important",
        marginTop: "0 !important",
        height: 25,
        width: "100%",
        lineHeight: "25px",
      },
      [theme.breakpoints.down("xs")]: {
        fontSize: 9,
        fontWeight: 400,
        height: 20,
        lineHeight: "20px",
        minWidth: "unset",
        padding: "0px 12px",
      },
      [theme.breakpoints.down(370)]: {
        fontSize: 8,
      },
    },
  },
  positionButtons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    rowGap: 8,
    flexDirection: "row",
    marginRight: 16,
    [theme.breakpoints.down("md")]: {
      marginRight: 8,
    },
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      rowGap: 4,
    },
    "& > button": {
      whiteSpace: "nowrap",
      [theme.breakpoints.down("md")]: {
        fontSize: 12,
      },
      [theme.breakpoints.down("sm")]: {
        marginLeft: "0 !important",
        marginTop: "0 !important",
        height: 25,
        width: "100%",
        lineHeight: "25px",
      },
      [theme.breakpoints.down("xs")]: {
        fontSize: 9,
        fontWeight: 400,
        height: 20,
        lineHeight: "20px",
        minWidth: "unset",
        padding: "0px 3px",
      },
      [theme.breakpoints.down(370)]: {
        fontSize: 8,
      },
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
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      marginRight: 50,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
      padding: "0 0 10px",
      "&:first-child": {
        marginRight: "30px",
      },
      "&:last-child": {
        marginRight: "0px",
      },
    },
  },
  selectedTab: {
    color: "#431AB7",
    borderBottom: "4px solid #431AB7",
    opacity: 1,
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
    overflow: "hidden",
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
  loanMediaTextWrapper: {
    marginLeft: 16,
    maxWidth: "100%",

    [theme.breakpoints.down("sm")]: {
      maxWidth: 120,
    },

    [theme.breakpoints.down("xs")]: {
      marginLeft: 8,
      maxWidth: 75,
    },
  },
  comingSoon: {
    padding: "6px 9px",
    borderRadius: 38,
    fontSize: 11,
    height: 23,
    boxSizing: "border-box",
    marginTop: -26,
    color: "#431AB7",
    background: "#DDFF57",
    left: 607,
    position: "absolute",
    [theme.breakpoints.down(1090)]: {
      left: "66%",
    },
    [theme.breakpoints.down(600)]: {
      left: "290px",
    },
    [theme.breakpoints.down(400)]: {
      left: "280px",
    },
  },
}));
