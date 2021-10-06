import { makeStyles } from "@material-ui/core/styles";

export const bottomStyles = makeStyles(theme => ({
  contentBox: {
    display: "flex",
    justifyContent: "space-between",
    padding: '110px 280px 100px 330px',
    width: "100%",
    [theme.breakpoints.down("md")]: {
      padding: '60px 100px 68px 100px',
    },
    [theme.breakpoints.down("sm")]: {
      padding: '60px 50px',
    },
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      justifyContent: "flex-start",
      padding: '60px 30px',
      "& > div + div": {
        marginTop: 40,
      }
    },
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  header1: {
    fontSize: 22,
    fontWeight: 400,
    cursor: 'pointer',
    fontFamily: 'Agrandir',
    lineHeight: '190%',
    "&:hover": {
      textDecoration: "underline",
    }
  },
  title: {
    fontSize: "35px",
    fontWeight: 800,
    background: "radial-gradient(427.58% 951.54% at 39.31% -84.13%, #000000 0%, #DBDDF0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  title2: {
    fontSize: 30,
    fontWeight: 400,
    fontFamily: 'Agrandir',
    lineHeight: '104.5%',
    marginBottom: 32,
    [theme.breakpoints.down("sm")]: {
      marginBottom: 16,
    },
  },
  bottomBox: {
    display: "flex",
    justifyContent: "center",
    background: "#F7F8FB",
    borderTop: "1px solid #18181822",
  },
  snsBox: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    background: "#D9F66F",
    borderRadius: "50%",
    marginRight: theme.spacing(2),
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
}));
