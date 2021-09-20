import { makeStyles } from "@material-ui/core";

const drawerWidth = 35;
export const priviZooSubPageStyles = makeStyles(theme => ({
  container: {
    height: `calc(100vh)`,
  },
  subContainer: {
    width: "100%",
    overflowY: "auto",
    scrollbarWidth: "none",
    height: "calc(100vh)",
  },
  navigationContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
    backgroundSize: "cover",
  },
  root: {
    display: "flex",
  },
  drawer: {
    width: theme.spacing(drawerWidth),
    flexShrink: 0,
    fontSize: theme.spacing(2),
  },
  drawerOpen: {
    width: theme.spacing(drawerWidth),
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: `white !important`,
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    overflowX: "hidden",
    backgroundColor: `white  !important`,
  },
  contentContainer: {
    borderLeft: "1px solid #18181822",
    position: "relative",
    minHeight: "80vh",
    width: `calc(100%)`,
    transition: theme.transitions.create(["width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentContainerShift: {
    borderLeft: "1px solid #18181822",
    position: "relative",
    minHeight: "80vh",
    width: `calc(100% - ${theme.spacing(drawerWidth)}px)`,
    transition: theme.transitions.create(["width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  homeContainer: {},
  homeContainerShift: {},
  footer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
}));
