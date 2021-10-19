import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const useUnlockNFTStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      padding: 50,
      [theme.breakpoints.down("xs")]: {
        padding: "30px 0"
      },
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: '100%',
      maxWidth: 540,
      textAlign: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: 800,
      lineHeight: '104.5%',
      color: '#181818',
    },
    description: {
      fontSize: 16,
      lineHeight: '150%',
      color: 'rgba(24, 24, 24, 0.7)',
    },
    icon: {
      width: 160,
      height: '100%',
      marginBottom: 30,
    },
    laterBtn: {
      height: 34,
      backgroundColor: 'transparent',
      color: '#431AB7',
      border: '1px solid #431AB7',
      padding: '8px 58px',
      fontSize: 14,
      fontWeight: 800,
      borderRadius: 4,
      marginRight: 10,

      [theme.breakpoints.down('sm')]: {
        width: '100%',
        marginBottom: 10,
        marginRight: 0,
      }
    },
    buttonWrapper: {
      marginTop: 30,
      display: 'flex',
      justifyContent: 'center',

      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
      },
    },
    btn: {
      height: 34,
      backgroundColor: '#431AB7',
      color: 'white',
      padding: '8px 58px',
      fontSize: 14,
      fontWeight: 800,
      borderRadius: 4,

      [theme.breakpoints.down('sm')]: {
        width: '100%',
        marginBottom: 10,
        marginTop: 10,
      }
    },
    proceedBtn: {
      height: 34,
      backgroundColor: '#431AB7',
      color: 'white',
      padding: '8px 58px',
      fontSize: 14,
      fontWeight: 800,
      borderRadius: 4,
      width: '100%',
    },
    checkBtn: {
      height: 40,
      backgroundColor: '#431AB7',
      color: 'white',
      marginTop: 30,
      padding: '11px 32px',
      fontSize: 14,
      fontWeight: 700,
      borderRadius: 4,
    },
    hash: {
      cursor: "pointer",
    },
    result: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }
  }),
);