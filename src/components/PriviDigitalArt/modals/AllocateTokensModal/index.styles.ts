import { makeStyles, createStyles, Theme } from "@material-ui/core";
import { Color } from "shared/ui-kit";

export const allocateTokensModalStyles = makeStyles((theme: Theme) => createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: '900px !important',
    },
    title: {
      fontSize: 22,
      fontWeight: 800,
      fontFamily: 'Agrandir',
      lineHeight: "130%",
      color: '#2D3047',
      [theme.breakpoints.down('xs')]: {
        fontSize: 18
      }
    },
    subTitle: {
      fontSize: 18,
      fontWeight: 800,
      fontFamily: 'Agrandir',
      lineHeight: "104.5%",
      color: '#431AB7',
      marginTop: 32,
      [theme.breakpoints.down('xs')]: {
        fontSize: 16
      }
    },
    header: {
      paddingTop: 12,
      paddingBottom: 24,
      borderBottom: '1px solid #DAE6E5',
      width: '100%'
    },
    mainContent: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      height: "100%",
      width: "100%",
      textAlign: "center",
    },
    logoImg: {
      marginBottom: -16,
      marginLeft: 24,
    },
    contentDescription: {
      fontSize: 18,
      fontWeight: 500,
      fontFamily: 'Montserrat',
      lineHeight: "150%",
      textAlign: 'center',
      letterSpacing: '0.02em',
      color: "#54658F",
      marginTop: "8px",
      marginBottom: "31px",
      padding: '0px 200px',
      [theme.breakpoints.down('sm')]: {
        padding: '0px 24px',
      },
      [theme.breakpoints.down('xs')]: {
        padding: '0px',
        fontSize: 14,
      }
    },
    shareSection: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      padding: '0px 101px',
      marginBottom: 8,
      "& label": {
        fontSize: 18,
        fontWeight: 600,
        fontFamily: 'Montserrat',
        lineHeight: '104.5%',
        color: '#2D3047',
        marginBottom: 8,
      },
      [theme.breakpoints.down('sm')]: {
        padding: '0px',
      },
      [theme.breakpoints.down('sm')]: {
        padding: '0px',
        "& label": {
          fontSize: 14
        }
      }
    },
    inputContainer: {
      marginTop: 10.5,
      border: "1px solid #949bab",
      boxSizing: "border-box",
      borderRadius: 48,
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "120%",
      color: "#181818",
      padding: "18.5px 18px",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      "& input": {
        padding: 0,
        fontFamily: "Agrandir",
        width: 300,
      },
      "& img": {
        width: 17,
        height: 17,
      },
    },
    userLabel: {
      fontWeight: 500,
      color: "#431AB7",
      fontFamily: "Agrandir",
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
    },
    addBox: {
      width: 24,
      height: 24,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      background: "#431AB7",
    },
    removeBox: {
      width: 24,
      height: 24,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      background: Color.Red,
      cursor: "pointer",
    },
    disabledInput: {
      background: "#e6e4e470",
    },
    walletAddress: {
      flexGrow: 1,
      border: "none",
      textOverflow: "ellipsis",
      outline: "none",
    },
    tokenAmount: {
      flexGrow: 1,
      border: "none",
      textOverflow: "ellipsis",
      outline: "none",
      width: "calc(100% - 10px)",
      height: 30,
      fontSize: 16,
    },
    userImage: {
      width: 30,
      height: 30,
      minWidth: 30,
      borderRadius: 15,
      backgroundColor: "#656e7e",
      marginRight: 10,
    },
    usersDisplay: {
      display: "flex",
      flexWrap: "wrap",
      width: "100%",
      marginTop: 25,
      marginBottom: 30,
      overflowY: "auto",
      scrollbarWidth: "none",
      "& > div": {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "center",
        borderBottom: "1px solid #eff2f8",
        padding: "12px 0px",
        height: "60px",
        "& span": {
          marginLeft: 5,
          display: "flex",
          alignItems: "center",
          "& img": {
            cursor: "pointer",
            height: 17,
            width: 16,
          },
        },
      },
    },
    leftSideSection: {
      display: "flex",
      alignItems: "center",
      maxWidth: "85%",
      padding: "4px 10px",
      overflow: "hidden",
    },
    avatarSection: {
      width: 34,
      height: 34,
      minWidth: 34,
      borderRadius: "50%",
      marginRight: 12,
      filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.12))",
      border: "3px solid #ffffff",
      backgroundColor: "white",
    },
    userInfoSection: {
      display: "flex",
      fontSize: 14,
      color: "#181818",
    },
    nameSection: {
      fontWeight: "bold",
      marginRight: 8,
    },
    amountSection: {
      color: '#2D3047',
      marginTop: 18,
      paddingBottom: 38,
      borderBottom: '1px solid #DAE6E5',
      fontSize: 18,
      fontWeight: 500,
      fontFamily: 'Montserrat',
      lineHeight: '150%',
      letterSpacing: '0.02em',
      width: '100%',
      "& span": {
        fontWeight: 600
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: 16,
      }
    },
    step2Header: {
      textAlign: "left",
      color: "#181818",
      width: "100%",
      "& h3": {
        fontWeight: 800,
        fontSize: 22,
        marginTop: 40,
        marginBottom: 32,
      },
      "& h4": {
        fontWeight: 800,
        fontSize: 18,
        color: "#000000",
        margin: 0,
      },
      "& p": {
        color: "#707582",
        fontSize: 14,
        margin: 0,
        marginBottom: 35,
      },
    },
    step2UserAmount: {
      borderBottom: "1px solid #eff2f8",
      paddingBottom: 8,
      marginBottom: 16,
      width: "100%",
    },
    step2Title1: {
      fontSize: 16,
      fontWeight: 600,
      color: "#2D3047",
      fontFamily: 'Montserrat',
      height: 35,
      textAlign: "start",
      [theme.breakpoints.down('xs')]: {
        fontSize: 12,
      }
    },
    step2Title2: {
      fontSize: 16,
      fontWeight: 600,
      color: "#431AB7",
      fontFamily: 'Montserrat',
      height: 35,
      textAlign: "start",
      [theme.breakpoints.down('xs')]: {
        fontSize: 12,
      }
    },
    userTKNSection: {
      fontSize: 16,
      color: "#181818",
      textAlign: "start",
    },
    controlButtons: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginTop: 46,
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        alignItems: 'flex-start'
      }
    },
    amountInputContainer: {
      border: "1px solid #949bab",
      borderRadius: 11.36,
      color: "#181818",
      padding: "4px 8px",
    },
  })
);

export const useAutoCompleteStyles = makeStyles({
  root: {
    width: "100%",
  },
  listbox: {
    maxHeight: 168,
  },
  option: {
    height: 52,
  },
});
