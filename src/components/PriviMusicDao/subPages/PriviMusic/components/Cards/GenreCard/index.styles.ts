import { makeStyles } from "@material-ui/core/styles";

export const genreCardStyles = makeStyles(theme => ({
  card: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    height: 175,
    cursor: 'pointer'
  },
  smallCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0px 0px 16px',
    background: '#ffffff',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    height: 264,
    cursor: 'pointer'
  },
  filter: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: '8px 16px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  smallfilter: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  name: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 40,
    lineHeight: '104.5%',
    color: '#ffffff'
  },
  smallname: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 22,
    lineHeight: '104.5%',
    color: '#ffffff'
  },
  album: {
    width: '100%',
    height: 175.46,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginBottom: 16
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 14,
    lineHeight: '104.5%',
    padding: '0px 20px',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: '#181818'
  },
  description: {
    marginTop: "10px",
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '120%',
    color: '#707582',
    textOverflow: "ellipsis",
    overflow: "hidden",
    height: "30px",
    width: "calc(100% - 40px)",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical"
  }
}));
