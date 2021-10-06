import { makeStyles } from "@material-ui/core/styles";

export const wallStyles = makeStyles(theme => ({
  root: {
    background: '#1E2026 !important',
    color: '#ffffff !important'
  },
  wallPostOption: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down("md")]: {
      marginTop: theme.spacing(2),
    },
    [theme.breakpoints.down("xs")]: {
      justifyContent: "space-between",
      flexDirection: 'column',
      alignItems: 'flex-end',
      marginTop: theme.spacing(2),
    },
  },
  flexRowInputsImgTitleDesc: {
    display: 'flex'
  },
  infoHeaderImgTitleDesc: {
    fontSize: 18,
    fontWeight: 400,
    color: '#ffffff'
  },
  textFieldImgTitleDesc: {
    height: 46,
    backgroundColor: '#F7F9FE',
    borderRadius: 6,
    border: '1px solid hsla(212, 25%, 60%, 0.3)',
    marginTop: 8,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 400,
    paddingLeft: 20,
    marginBottom: 8,
    width: "100%",
    position: "relative",
    cursor: 'pointer',
    '&:focus': {
      outline: 'none'
    },
    '&::placeholder': {
      outline: 'none',
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 400,
    }
  },
  dragImageHereIconImgTitleDesc: {
    marginBottom: 16,
    position: "absolute",
    left: 10,
    top: 10,
    width: 16,
    height: 17,
  },
  manageButton: {
    padding: '0 26px !important',
    borderRadius: '10px !important',
    background: 'linear-gradient(225.12deg, #F2A07E -33.5%, #FF5954 71.42%)',
    height: 40,
    fontSize: 16,
    fontWeight: 800,
    lineHeight: '21px',
    color: '#FFFFFF',
    fontFamily: 'Agrandir'
  },
}));
