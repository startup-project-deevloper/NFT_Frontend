import { makeStyles } from "@material-ui/core";

export const wallStyles = makeStyles(theme => ({
  wallPostOption: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      justifyContent: "flex-start",
      marginTop: theme.spacing(2),
    },
  },
  flexRowInputsImgTitleDesc: {
    display: 'flex'
  },
  infoHeaderImgTitleDesc: {
    fontSize: 18,
    fontWeight: 400,
    color: '#707582'
  },
  textFieldImgTitleDesc: {
    height: 46,
    backgroundColor: '#F7F9FE',
    borderRadius: 6,
    border: '1px solid hsla(212, 25%, 60%, 0.3)',
    marginTop: 8,
    color: '#707582',
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
      color: '#707582',
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
  }
}));
