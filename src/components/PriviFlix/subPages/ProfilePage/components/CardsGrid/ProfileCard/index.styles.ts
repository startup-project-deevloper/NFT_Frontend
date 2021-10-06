import { makeStyles } from "@material-ui/core/styles";

export const profileCardStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    width: 'calc(100% - 42px)',
    minWidth: 260,
    borderRadius: 16,
    position: 'relative',
    marginRight: 42,
    marginBottom: 42
  },
  topActions: {
    marginBottom: -60,
    display: 'flex',
    zIndex: 3,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    '& img': {
      marginRight: 6,
      height: 20,
      cursor: 'pointer'
    }
  },
  chain: {
    color: 'black',
    fontWeight: 800,
    fontSize: 11,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '7px 14px 6px',
    background: 'conic-gradient( from 111.31deg at 50% 51.67%, #b1ff00 -118.12deg, #00ff15 110.62deg, #b1ff00 241.88deg, #00ff15 470.63deg )',
    borderRadius: 36
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    minWidth: 193,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    position: 'relative'
  },
  aspectRatioWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden'
  },
  image: {
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    marginBottom: -8,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(93.41deg, rgba(0, 255, 21, 0.3) 33.32%, rgba(177, 255, 0, 0.3) 66.18%)'
  },
  socialTokenImg: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#656e7e',
    margin: '20px 0'
  },
  hidden: {
    width: 0,
    opacity: 0,
    minWidth: 0
  },
  content: {
    fontSize: 18,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    flex: 1,
    borderTop: 'none',
    padding: '60px 16px 16px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    color: 'white',
    background: 'hsl(0, 0%, 0%, 0.8)'
  },
  avatar: {
    marginRight: -8,
    border: '2px solid #ffffff',
    filter: 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2))',
    borderRadius: 24,
    width: 32,
    height: 32,
    backgroundColor: '#00ff15',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  creatorsCounter: {
    background: '#ffffff',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 8,
    padding: '4px 3.5px 1px',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 11,
    zIndex: 2,
    color: '#707582'
  },
  bottomContent: {
    width: '100%',
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    background: '#eff2f8',
  },
  cardCover: {
    width: "100%",
    position: "relative",
  },
  cardsGrid: {
    display: 'flex',
    width: 'calc(100% + 40px)',
    marginRight: -40,
    overflowX: 'hidden',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingBottom: 50
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    height: '100%',
    alignSelf: 'flex-start',
    flex: 1,
    width: 0,
    '&:last-child': {
      marginRight: '0 !important'
    }
  },
  noItems: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 24
  },
  '@media (max-width: 900px)': {
    column: {
      width: '100%'
    }
  }
}));
