import { makeStyles } from "@material-ui/core/styles";

export const syntheticCollectionCardStyles = makeStyles(theme => ({
  card: {
    minWidth: 276,
    maxWidth: 370,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    cursor: 'pointer',
    border: "1px solid #E4E5EE",
    backgroundColor: "#FFF",
    boxShadow: "0px 4px 8px #9EACF2",
    borderRadius: 16,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '330px',
    borderRadius: 16,
    objectFit: 'cover'
  },
  fixed: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#c4c4c4',
    height: 330,
    maxHeight: 276,
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    background: '#ffffff',
    padding: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    position: 'relative',
  },
  infoWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10,
  },
  title: {
    color: '#431AB7',
    fontWeight: 800,
    fontSize: 18,
    margin: 0,
    marginBottom: 6,
  },
  details: {
    marginTop: 16,
    display: 'flex',
    justifyContent: 'space-between',
  },
  detailWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailLabel: {
    color: '#707582',
    fontSize: 11,
  },
  detailInfo: {
    color: '#431AB7',
    fontSize: 13,
    fontWeight: 800,
    [theme.breakpoints.down(1200)]: {
      fontSize: 13,
    },
  },
  avatar: {
    position: 'absolute',
    top: -50,
    left: 25,
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
