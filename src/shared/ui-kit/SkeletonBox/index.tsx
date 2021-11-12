import React from "react";
import { Box, BoxProps } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useStyles } from "./index.style";

interface SkeletonBoxProps extends BoxProps {
  loading: boolean;
  image?: string;
}

const SkeletonImageBox: React.FC<SkeletonBoxProps> = ({ loading, image, children, ...props }: SkeletonBoxProps) => {
  const classes = useStyles()
  if (loading) {
    return (
      <Box
        {...props}
        overflow="hidden"
      >
        <Skeleton animation="wave" variant="rect" width={"100%"} height={"100%"} />
      </Box>
    )
  } else {
    return <Box
      {...props}
      style={{
        ...props.style,
        position: 'relative'
      }}
    >
      <img src={image} className={classes.bgImage} />
      {children}
    </Box>
  }
}

export default SkeletonImageBox;