import { makeStyles } from "@material-ui/core/styles";

export const EditSellingPriceModalStyles = makeStyles((theme) => ({
  container: {
    padding:'0px !important'
  },
  nameField: {
    margin: '27px 0px 7px 0px',
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    color: '#1A1B1C',
  },
  inputJOT: {
    background: "rgba(144, 155, 255, 0.16)",
    border: "1px solid #431AB7 !important",
    width: "100%",
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
  },
  purpleText: {
    fontFamily: "Agrandir Variable !important",
    cursor: "pointer",
    color: "#431AB7",
    fontSize: "16px",
    minWidth: "55px",
    fontWeight: 700
  },
  primaryButton: {
    color: "#431AB7 !important",
    padding: "0 73px !important",
    height: "40px !important",
    border: "none !important",
    backgroundColor: "#DDFF57 !important",
  },
  secondaryButton: {
    padding: "0 37px !important",
  }
}));
