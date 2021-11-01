import { makeStyles } from "@material-ui/core/styles";

export const createNftOptionStyles = makeStyles(theme => ({
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
        padding: "45px",
        backgroundImage: `url(${require("assets/backgrounds/option_bg.png")})`,
        backgroundRepeat: 'no-repeat',
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
          padding: "35px",
        },
    },
    walletRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        alignItems: "flex-start",
      },
      width: "100%",
      "& div": {
        display: "flex",
        alignItems: "center",
        fontSize: "14px",
        fontWeight: 800,
        lineHeight: "18px",
        color: "#431AB7",
        width: "calc(60% - 24px)",
        [theme.breakpoints.down("md")]: {
          width: "100%",
          marginRight: 0,
          paddingBottom: 25,
        },
        marginRight: "24px",
        "& img": {
          marginRight: "24px",
          width: "32px",
          height: "32px",
        },
      },
      fontFamily: "Agrandir",
      fontStyle: "normal",
      fontWeight: 400,
      marginBottom: "24px",
      "& button": {
        background: "#DDFF57",
        borderRadius: "4px",
        color: "#431AB7",
        fontWeight: 800,
        fontSize: "14px",
        lineHeight: "18px",
        textAlign: "center",
        width: "fit-content",
        [theme.breakpoints.down("md")]: {
          width: "80%"
        },
        [theme.breakpoints.down("xs")]: {
          width: "100%"
        },
        padding: "8px 32px",
      },
      [theme.breakpoints.down(1110)]: {
        "& button": {
          padding: "8px 16px",
          fontSize: "13px",
        },
      },
    },
    titleBar: {
        marginTop:'30px',
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        [theme.breakpoints.down("xs")]: {
          flexDirection: "column",
          alignItems: "flex-start",
        },
    },
    title: {
        fontFamily: "Agrandir",
        fontSize: '24px',
        fontWeight: 800,
        color: "#431AB7",
    },
    subTitle: {
        fontFamily: 'Agrandir',
        fontSize: '16px',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '21px',
        letterSpacing: '0em',
        textAlign: 'left',
        color: "#431AB7",
    },
    connectWalletIcon: {
      width: '30px',
      marginRight: '30px',
    },
    connectWalletText: {
      fontFamily: 'Agrandir',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '14px',
      lineHeight: '18px',
      width: '47.5%',
      color: '#431AB7',
      marginRight:'24px'
    },
    connectWalletButton: {
      padding: '8px 24px',
      background: '#DDFF57',
      borderRadius: '4px',
      fontFamily: 'Agrandir',
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: '14px',
      lineHeight: '18px',
      textAlign: 'center',
      width: '47.5%',
      color: '#431AB7',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    createForm: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '30px 30px 20px',
      border: '1px solid #9EACF2',
      boxSizing: 'border-box',
      borderRadius: '20px',
      textAlign: 'center'
    },
    formHeader: {
      borderBottom: '1px solid #EFF2F8',
      width:'100%',
      height:'100%'
    },
    formTitle: {
      fontFamily: 'Agrandir',
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: '18px',
      lineHeight: '170%',
      textTransform: 'uppercase',
      color: '#431AB7',
    },
    formSubTitle: {
      fontFamily: 'Agrandir',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '120%',
      textAlign: 'center',
      color: '#431AB7',
      mixBlendMode: 'normal',
      marginBottom: '16px'
    },
    formBody: {
      width:'100%'
    },
    formInputName :{
      fontFamily: 'Montserrat',
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: '17px',
      letterSpacing: '0em',
      textAlign: 'left',
      margin:'16px 0px 8px 0px'
    },
    formInput: {
      background: 'rgba(144, 155, 255, 0.16)',
      border: '1px solid #431AB7 !important',
      boxSizing: 'border-box',
      borderRadius: '12px',
      padding:'16px',
      width:'100%',
      fontFamily: 'Agrandir',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '16px',
      lineHeight: '150%',
      letterSpacing: '0.02em',
      color: '#ABB3C4',
    },
    checkDefaultOption: {
      background: '#EDEFFF',
      borderRadius: '12px',
      fontFamily: 'Montserrat',
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '14px',
      lineHeight: '120%',
      color: '#4218B5',
      paddingRight:'10px'
    },
    checkSelectedOption: {
      background: '#C8C7FF',
    },
    formDescription: {
      fontFamily: 'Agrandir',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '150%',
      textAlign: 'center',
      color: '#431AB7',
      mixBlendMode: 'normal',
      background: 'rgba(67, 26, 183, 0.06)',
      border: '1px solid rgba(67, 26, 183, 0.4)',
      boxSizing: 'border-box',
      borderRadius: '8px',
      padding: '16px',
      margin: '16px 0px 40px 0px'
    },
    submitButton: {
      background: '#431AB7',
      borderRadius: '4px',
      width: '50%',
      float: 'right',
    }
}));