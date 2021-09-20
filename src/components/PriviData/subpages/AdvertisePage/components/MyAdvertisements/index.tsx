import React from "react";
import { useHistory } from "react-router";
import classnames from "classnames";

import { AdvertiseCard } from "../../../../components/AdvertiseCard";

import Box from "shared/ui-kit/Box";

import imageArrowRight from "assets/icons/arrow_right_white.png";

import { MyAdvertisementsStyles } from "./index.styles";

export default function MyAdvertisements(props) {
  const classes = MyAdvertisementsStyles();
  const history = useHistory();

  const gotoADDetailPage = (id) => {
    history.push(`/data/advertise/${id}`);
  };

  return (
    <div className={classnames(classes.root, props.className)}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <div className={classes.title}>Your Ads</div>
        <div className={classes.otherContent}>
          <span>Show All</span>
          <img src={imageArrowRight} width={14} height={10} className="logo" alt="" />
        </div>
      </Box>
      <Box
        mt={3}
        display="flex"
        justifyContent="space-between"
        flexWrap="wrap"
        gridColumnGap={30}
        gridRowGap={30}
      >
        {[0, 1, 2].map(item => (
          <AdvertiseCard key={item} item={item} handleClick={() => gotoADDetailPage(item)} />
        ))}
      </Box>
    </div>
  );
}
