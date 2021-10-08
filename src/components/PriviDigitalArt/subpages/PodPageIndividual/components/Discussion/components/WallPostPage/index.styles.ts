import { makeStyles } from "@material-ui/core/styles";

export const wallPostPageStyles = makeStyles(theme => ({
  content: {
    height: `100%`,
    width: "100%",
    paddingBottom: "80px",
    color: "#181818",
  },
  subContent: {
    width: "100%",
    overflowY: "auto",
    scrollbarWidth: "none",
    padding: "30px 168px 150px 168px",
    height: "calc(100vh - 80px)",
    paddingBottom: "80px",
  },
  title: {
    fontSize: "44px",
    fontWeight: 800,
    lineHeight: "120%",
    color: "#181818",
  },
  header1: {
    fontSize: "22px",
    fontWeight: 400,
  },
  header2: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#181818",
    '& pre': {
      whiteSpace: 'unset'
    }
  },
  header3: {
    fontSize: "12px",
    fontWeight: 400,
  },
  header4: {
    fontSize: "14px",
    fontWeight: 400,
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  discussionDetailBox: {
    padding: theme.spacing(5),
    borderRadius: theme.spacing(1.5),
    background: "rgba(158, 172, 242, 0.4)",
    boxShadow: "0px 30px 35px -12px rgba(29, 103, 84, 0.03)",
  },
  avatarBox: {
    position: "relative",
  },
  selectedButtonBox: {
    background: "#DDFF57",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    display: "flex",
    alignItems: "center",
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(1),
    cursor: "pointer",
  },
  tagBox: {
    background: "#431AB7",
    display: "flex",
    alignItems: "center",
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(1),
  },
  imgBox: {
    borderRadius: theme.spacing(3),
    overflow: "hidden",
  },
  iconBox: {
    width: theme.spacing(3),
    cursor: "pointer",
  },
  whiteBox: {
    background: "white",
    boxShadow: "0px 30px 35px -12px rgba(29, 103, 84, 0.03)",
    borderTopLeftRadius: theme.spacing(0.5),
    borderTopRightRadius: theme.spacing(0.5),
  },
  secondButtonBox: {
    position: "relative",
    padding: `${theme.spacing(1)}px ${theme.spacing(10)}px`,
    borderRadius: theme.spacing(4),
    cursor: "pointer",
    border: "1px solid #7977D1",

    "& svg": {
      position: "absolute",
      right: "16px",
      width: "16px",
      transform: "translateY(-150%)",
    },
  },
  reactPlayer: {
    height: '360px !important',
    width: '100% !important',
    borderRadius: "14px",
    transform: "none",
    cursor: "pointer",
    "& video": {
      borderRadius: "14px",
      height: "auto",
    },
    marginTop: theme.spacing(2),
    overflow: "hidden",
  },
  reactPlayerModal: {},
}));
