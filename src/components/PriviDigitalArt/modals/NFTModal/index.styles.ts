import { makeStyles } from "@material-ui/core/styles";

export const sellModalStyles = makeStyles((theme) => ({
  root: {
    width: "620px !important",
  },
  modalContent: {
    paddingTop: 20,
  },
  appbarContainer: {
    marginTop: 22,
  },
  mediaAndPriceSelect: {
    margin: "36px 0px 10px 0px",
    width: "100%",
  },
  headerTitle: {
    fontWeight: 800,
    fontSize: 30,
    lineHeight: '104.5%',
    color: '#431AB7'
  },
  fieldTitle: {
    fontSize: 18,
    lineHeight: '104.5%',
    color: '#181818',
    marginBottom: 8,
  },
  inputContainer: {
    width: "100%",
    borderRadius: 10,
    padding: "12px 18px 10px 10px",
    background: "#f7f9fe",
    border: "1px solid #e0e4f3",
    boxSizing: "border-box",
    fontWeight: 400,
    height: 45,
    marginTop: 4,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "& img": {
      width: 17,
      height: 17,
    },
  },
  row: {
    alignItems: "flex-end",
    display: "flex",
    marginBottom: 15,
  },
  primaryBtn: {
    background: "#431AB7 !important",
  },
  selectorWithToken: {
    background: "#ffffff",
    boxSizing: "border-box",
    borderRadius: 6,
    height: 40,
    margin: 0,
    flex: 1,
    alignSelf: "flex-end",
    "& > .MuiInputBase-root": {
      minHeight: '40px !important',
    },
    [theme.breakpoints.down("sm")]: {
      alignSelf: "unset",
    }
  },
  blockchainContainer: {
    marginBottom: 0,
    marginTop: 0,
    height: 40,
    borderRadius: 6,
    width: '100%',
    minWidth: 140,
    "& .MuiInputBase-root": {
      height: 40,
    }
  },
  dateHourSelect: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
    "& input": {
      padding: 0,
      height: "auto",
      margin: 0,
    },
    "& .col:first-child": {
      marginRight: 32,
    },
    "& .col": {
      width: "50%",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  mediaDisplay: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0px",
    borderTop: "1px solid #eff2f8",
    borderBottom: "1px solid #eff2f8",
    marginTop: 30,
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
  },
  avatarSection: {
    width: 40,
    height: 40,
    backgroundColor: "#f2f2f2",
    marginRight: 20,
    borderRadius: 6,
  },
  buttons: {
    marginTop: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  alertMessageSection: {
    width: "100%",
    "& > * + *": {
      marginTop: 16,
    },
  },
}));
