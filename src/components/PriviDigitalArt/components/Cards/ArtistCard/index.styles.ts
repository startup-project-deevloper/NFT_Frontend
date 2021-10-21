import { makeStyles } from "@material-ui/core/styles";

export const artistCardStyles = makeStyles(theme => ({
  card: {
    borderRadius: 16,
    minWidth: 276,
    height: 368,
    boxShadow: "0px 4px 8px #9EACF2",
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: "relative",
    '& button': {
      border: '1.5px solid #ffffff',
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 14,
    },

    "& > img": {
      position: "absolute",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: 16,
      zIndex: -1
    },

    "& > span": {
      position: "absolute",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: 16,
      zIndex: -1
    }
  },
  filter: {
    width: '100%',
    height: 120,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    background: 'linear-gradient(180deg, rgba(24, 24, 24, 0) 0%, #181818 100%)',
    borderRadius: '0px 0px 16px 16px',
    padding: 16,
    color: 'white',
    fontSize: 14,
    fontWeight: 400
  },
  follow: {
    background: 'white',
    color: '#181818',
  },
  unfollow: {
    background: 'transparent',
    color: 'white'
  },
  loading: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "& .MuiCircularProgress-root": {
      width: "20px !important",
      height: "20px !important",
    }
  },
}));
