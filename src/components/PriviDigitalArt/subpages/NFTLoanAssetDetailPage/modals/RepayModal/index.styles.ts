import { makeStyles } from "@material-ui/core";

export const useRepayModalStyles = makeStyles(theme => ({
  modal: {
    padding: "27px 16px",
    maxWidth: "500px !important",
  },
  title: {
    fontFamily: 'Agrandir',
    fontWeight: 400,
    fontSize: '24px',
    color: '#431AB7',
    marginLeft: '16px'
  },
  content: {
    fontFamily: 'Agrandir',
    fontWeight: 400,
    fontSize: '14px',
    color: '#1A1B1C',
    marginTop: '24px',
    lineHeight: '21px'
  },
  small: {
    fontFamily: 'Agrandir',
    fontWeight: 400,
    fontSize: '14px',
    color: '#431AB7',
    lineHeight: '21px',
    marginRight: '15px'
  },
  smallBold: {
    fontFamily: 'Agrandir',
    fontWeight: 700,
    fontSize: '14px',
    color: '#431AB7',
    lineHeight: '21px'
  },
  rateBox: {
    marginTop: '24px',
    backgroundColor: 'rgba(158, 172, 242, 0.2)',
    borderRadius: '12px',
    padding: '20px 26px'
  },
  buttonContainer: {
    marginTop: '24px'
  },
  placeBtn: {
    fontFamily: 'Agrandir !important',
    background: "#431AB7 !important",
    fontSize: '14px !important',
  },
}));