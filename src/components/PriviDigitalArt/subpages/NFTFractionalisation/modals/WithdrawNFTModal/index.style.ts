import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const useWithdrawNFTModelStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: "700px !important",
    },
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "86px 38px 13px",

      [theme.breakpoints.down('xs')]: {
        padding: "86px 20px",
      }
    },
    title: {
      fontSize: 20,
      fontWeight: 800,
      lineHeight: "104.5%",
      color: "#181818",
    },
    description: {
      fontSize: 16,
      lineHeight: "150%",
      color: "rgba(24, 24, 24, 0.7)",
      textAlign: "center"
    },
    icon: {
      width: 160,
      height: "100%",
      marginBottom: 30,
    },
    proceedBtn: {
      height: 34,
      backgroundColor: "#431AB7",
      color: "white",
      padding: "8px 58px",
      fontSize: 14,
      fontWeight: 800,
      borderRadius: 4,
      width: "50%",

      [theme.breakpoints.down('xs')]: {
        width: '100%',
        padding: 0,
        textAlign: 'center',
      },
    },
    divider: {
      marginLeft: -32,
      marginRight: -32,
    },
  }),
);