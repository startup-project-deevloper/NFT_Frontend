import { makeStyles } from "@material-ui/core/styles";

export const shareMenuStyles = makeStyles(theme => ({
  root: {
    position: "inherit",
    zIndex: 999,
  },
  title: {
    fontSize: 18,
    color: '#1A1B1C'
  },
  optionCloseBtn: {
    width: 14,
    height: 14,
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 0,
    "& > img": {
      width: '14px !important',
    }
  },
  qrIcon: {
    width: 32,
    height: 32,
  },
  emojiText: {
    fontSize: 18,
    lineHeight: '120%'
  },
  description: {
    color: '#A4A4A4',
    width: '100%',
    textAlign: 'center'
  },
  image: {
    width: 32,
    height: 32,
    marginRight: 5
  },
  red:{color: '#ED4956'}
  
}));
