import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/ui-kit";

export const optionAcceptedStyles = makeStyles(theme => ({
    subTitleSection2: {
        width: '180px',
        display: 'flex',
        border: '2px solid #431AB7',
        padding: '0px',
        borderRadius: '80px',
        marginBottom: '20px',
        cursor: "pointer",
        fontFamily: 'Montserrat',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '14px',
        lineHeight: '104.5%',
    },
    tabSection2: {
        height: 42,
        padding: '13px 20px'
    },
    selectedTabSection2: {
        background: '#431AB7',
        borderRadius: '19px',
        color: 'white',
    },
    titleBar: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 35px",
        [theme.breakpoints.down("xs")]: {
          flexDirection: "column",
          alignItems: "flex-start",
        },
    },
    title: {
        fontFamily: "Agrandir GrandHeavy",
        fontSize: 40,
        fontWeight: 800,
        color: "#431AB7",
        [theme.breakpoints.down(950)]: {
          fontSize: 28,
        },
        [theme.breakpoints.down("xs")]: {
          paddingBottom: 8,
        },
    },
    manageButton: {
        position: "relative",
        background: "linear-gradient(269.78deg, #418DFF 1.15%, #4541FF 52.53%, #EF41CB 94.95%), #000000",
        borderRadius: "8px !important",
        color: "#fff !important",
        border: "none !important",
        display: "flex",
        alignItems: "center",
        height: "50px !important",
        fontSize: "18px !important",
        padding: "0 50px !important",
        lineHeight: "24px !important",
    },
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
        padding: "30px",
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
          padding: "35px 0px",
        },
    },
    subTitleSection: {
        display: "flex",
        width: "100%",
        fontSize: 18,
        fontWeight: 800,
        fontFamily: "Agrandir",
        color: "#431AB7",
        lineHeight: "23px",
        marginTop: 32,
        padding: "0 20px",
        cursor: "pointer",
        [theme.breakpoints.down(1110)]: {
          fontSize: 15,
        },
        [theme.breakpoints.down(950)]: {
          fontSize: 12,
        },
        [theme.breakpoints.down("xs")]: {
          padding: "0 0",
        },
    },
    tabSection: {
        height: 55,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        margin: "0 40px",
        [theme.breakpoints.down(1250)]: {
          minWidth: 420,
        },
        [theme.breakpoints.down(1110)]: {
          minWidth: 350,
        },
        [theme.breakpoints.down(950)]: {
          minWidth: 275,
          fontSize: 14,
        },
        [theme.breakpoints.down(580)]: {
          minWidth: 165,
          fontSize: 16,
          margin: "0 0",
          padding: "0 24px",
          height: "84px",
          width: "50%",
        },
        borderBottom: "4px solid transparent",
    },
    selectedTabSection: {
        borderBottom: "4px solid #431AB7",
    },
}));