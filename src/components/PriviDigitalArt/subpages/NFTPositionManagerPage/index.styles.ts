import { makeStyles } from "@material-ui/core";

export const useNFTPositionManagerPageStyles = makeStyles(theme => ({
  main: {
    position: 'relative',
    width: 'calc(100% - 208px)',
    "@media (max-width: 768px)": {
      width: '100%',
    },
  },
}));
