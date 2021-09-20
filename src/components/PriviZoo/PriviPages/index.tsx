import React, { useRef } from "react";
import clsx from "clsx";

import { priviZooSubPageStyles } from './index.styles';
import LeftMenuSidebar from "../components/LeftMenuSidebar";
import HomeRouter from "./HomeRouter";
import { ReactComponent as StarIcon } from "assets/icons/star-solid.svg";
import { ReactComponent as DiscoverIcon } from "assets/icons/discover.svg";
import { ReactComponent as FinaceIcon } from "assets/icons/finances.svg";
import { ReactComponent as SocialIcon } from "assets/icons/cmmunity.svg";
import { ReactComponent as InvestIcon } from "assets/icons/investment.svg";
import { ReactComponent as ProductIcon } from "assets/icons/productivity.svg";
import { ReactComponent as CategoryIcon } from "assets/icons/categories.svg";
import { ReactComponent as MediaIcon } from "assets/icons/media.svg";
import { default as SignInHeader } from "shared/ui-kit/Header/Header";
import Box from 'shared/ui-kit/Box';
import { useLocation } from "react-router-dom";

const LeftSideArray = [
  {
    name: "My Apps",
    icon: StarIcon,
    url: "zoo/myapps/",
  },
  {
    name: "Discover",
    icon: DiscoverIcon,
    url: "zoo/myapps/",
  },
  {
    name: "Media",
    icon: MediaIcon,
    url: "zoo/myapps/",
  },
  {
    name: "DeFi",
    icon: FinaceIcon,
    url: "zoo/myapps/",
  },
  {
    name: "Social",
    icon: SocialIcon,
    url: "zoo/myapps/",
  },
  {
    name: "Investment",
    icon: InvestIcon,
    url: "zoo/myapps/",
  },
  {
    name: "Productivity",
    icon: ProductIcon,
    url: "zoo/myapps/",
  },
  {
    name: "All Categories",
    icon: CategoryIcon,
    url: "zoo/myapps/",
  },
];

const PriviPages = () => {
  const classes = priviZooSubPageStyles();
  const [expanded, setExpanded] = React.useState(false);
  const location = useLocation();
  const scrollRef = useRef<any>();

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [location]);

  const onToggle = () => {
    setExpanded(isExpanded => !isExpanded);
  };

  return (
    <>
      <Box className={classes.container}>
        <div className={classes.subContainer} ref={scrollRef}>
          <Box className={classes.navigationContainer}>
            <Box width={1}>
              <SignInHeader />
            </Box>
          </Box>
          <Box className={classes.root}>
            {/* <Box
              className={clsx(classes.drawer, {
                [classes.drawerOpen]: expanded,
                [classes.drawerClose]: !expanded,
              })}
            >
              <LeftMenuSidebar accordions={LeftSideArray} onToggle={onToggle} expanded={expanded} />
            </Box> */}
            <Box
              className={clsx({
                [classes.contentContainerShift]: expanded,
                [classes.contentContainer]: !expanded,
              })}
            >
              <Box
                id="homeContainer"
                className={clsx({
                  [classes.homeContainerShift]: expanded,
                  [classes.homeContainer]: !expanded,
                })}
              >
                <HomeRouter />
              </Box>
            </Box>
          </Box>
        </div>
      </Box>
    </>
  );
};

export default PriviPages;
