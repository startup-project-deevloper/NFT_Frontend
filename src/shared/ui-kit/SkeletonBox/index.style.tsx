import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(() => ({
  bgImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover'
  }
}))