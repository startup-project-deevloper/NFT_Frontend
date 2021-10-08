import { makeStyles } from "@material-ui/core/styles";

export const collectionCardStyles = makeStyles(theme => ({
  card: {
    minWidth: 276,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    marginBottom: 20,
    cursor: 'pointer',
    boxShadow: "0px 4px 8px #9EACF2",
    borderRadius: 16,
    position: 'relative'
  },
  image: {
    width: '100%',
    borderRadius: 16,
    height: 'auto',
    minHeight: 276,
    zIndex: 1
  },
  fixed: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#c4c4c4',
    height: 276,
    maxHeight: 276,
  },
  info: {
    top: '89%',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translate(-50%, 0)',
    zIndex: 2,
    height: 53,
    display: 'flex',
    alignItems: 'center',
    width: 'calc(100% - 2 * 16px)',
    background: '#ffffff',
    padding: '8px 16px',
    boxShadow: '1px 4px 4px rgba(176, 176, 176, 0.24)',
    borderRadius: 8,
    justifyContent: 'center'
  },
  avatar: {
    backgroundColor: '#c4c4c4',
    width: 32,
    height: 32,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '50%',
    marginRight: 8,
  },
  black: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '120%',
    color: '#1a1b1c',
  },
  gray: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '120%',
    color: '#a4a4a4'
  }
}));
