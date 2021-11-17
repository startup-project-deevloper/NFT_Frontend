import { makeStyles } from "@material-ui/core/styles";

export const CancelOfferModalStyles = makeStyles((theme) => ({
  container: {
    maxWidth: "508px !important",
    padding:'50px 80px 60px !important'
  },
  nameField: {
    marginTop: '8px',
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '14px',
    color: '#1A1B1C',
    lineHeight: '21px',
    textAlign: 'center'
  },
  primaryButton: {
    color: "#fff !important",
    padding: "0 37px !important",
    height: "40px !important",
    border: "none !important"
  }
}));
