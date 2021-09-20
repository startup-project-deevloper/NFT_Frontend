import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { default as ElasticCarousel } from "react-elastic-carousel";
import Carousel from "react-spring-3d-carousel";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";

import { Grid, useMediaQuery, useTheme } from "@material-ui/core";

import { ChevronIconLeft } from "shared/ui-kit/Icons/chevronIconDown";
import Box from "shared/ui-kit/Box";
import { NoMetamaskModal } from "shared/ui-kit/Modal/Modals/NoMetamaskModal";
import { useHistory } from "react-router-dom";
import { injected } from "shared/connectors";
import { getUser } from "store/selectors/user";
import { ZOO_APPS_BUNDLE, ZOO_APPS, ZOO_APPS_NAMES, ZOO_CAROUSEL_APPS } from "shared/constants/constants";
import { priviZooPageStyles } from "./index.styles";
import PriviCard from "./components/PriviCard";
import Bottom from "./components/Bottom";

const SamplePriviDataBundle = isMobile => {
  const priviDataBundle: any[] = [];
  ZOO_APPS_BUNDLE.map(data => {
    priviDataBundle.push({
      key: `uuid_${data.name}`,
      content: (
        <PriviCard
          item={{ ...data }}
          hideAvatar={false}
          showMark
          customWidth={isMobile ? "250px" : "340px"}
          showEarlyAccess
        />
      ),
    });
  });
  ZOO_APPS_BUNDLE.map(data => {
    priviDataBundle.push({
      key: `uuid_${data.name}_2`,
      content: (
        <PriviCard
          item={{ ...data }}
          hideAvatar={false}
          showMark
          customWidth={isMobile ? "250px" : "340px"}
          showEarlyAccess
        />
      ),
    });
  });

  return priviDataBundle;
};

const PriviZoo = () => {
  const classes = priviZooPageStyles();
  const carouselRef = useRef<any>();

  const history = useHistory();
  const userSelector = useSelector(getUser);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [currentSlider, setCurrentSlider] = useState<number>(0);

  const [appIdx, setAppIdx] = useState(0);
  const [noMetamask, setNoMetamask] = useState<boolean>(false);

  const { activate, account, library } = useWeb3React();

  const navigateApps = () => {
    history.push("/zoo/page/apps");
  };

  const handleConnectWallet = () => {
    activate(injected, undefined, true).catch(error => {
      if (error instanceof UnsupportedChainIdError) {
        activate(injected);
      } else {
        console.info("Connection Error - ", error);
        setNoMetamask(true);
      }
    });
  };

  useEffect(() => {
    var index = 0;
    const intevalRef = setInterval(() => {
      setAppIdx(index % ZOO_APPS_NAMES.length);
      index++;
    }, 800);

    return () => {
      clearInterval(intevalRef);
    };
  }, []);

  const goToClaiming = () => {
    history.push("/zoo/claim");
  };

  //  blinding early access
  useEffect(() => {
    var bgColorIdx = 0;

    const intervalRef = setInterval(() => {
      const bgColor = ["#ffa234", "#ef43c9", "#7e85ff", "#7ed1ef", "#bf7eff"];

      const doc: any = document.getElementsByClassName(`earlyAccess-card`);
      if (doc) {
        for (let i = 0, len = doc.length | 0; i < len; i = (i + 1) | 0) {
          doc[i].style.backgroundColor = bgColor[bgColorIdx];
        }
      }

      bgColorIdx = (bgColorIdx + 1) % bgColor.length;
    }, 600);

    return () => {
      clearInterval(intervalRef);
    };
  }, []);

  return (
    <Box className={classes.container}>
      <Box className={classes.subContainer}>
        <Box className={classes.navigationContainer}>
          <>
            <img
              src={require("assets/zooImages/gradient-frame.svg")}
              width="100%"
              className={classes.gradientFrame}
            />
            <a href="https://www.privi.store">
              <img
                src={require("assets/zooImages/privi_zoo_logo_beta.svg")}
                width="100%"
                className={classes.logo}
              />
            </a>
            <img src={require("assets/zooImages/Logo.png")} width="100%" className={classes.backTopLogo} />
            <img src={require("assets/zooImages/Logo.png")} width="100%" className={classes.backLogo} />
            <img
              src={require("assets/zooImages/music-icon.png")}
              width="100%"
              className={classes.backMusic}
            />

            <div className={classes.claimButton} onClick={goToClaiming}>
              <div>
                <ClaimIcon /> <span>Claim IDO Tokens</span>
              </div>
            </div>

            {/* {!account ? (
              <Box className={classes.btnConnectContainer}>
                <button className={classes.btnConnect} onClick={handleConnectWallet}>
                  Connect Wallet
                </button>
              </Box>
            ) : userSelector?.id ? (
              <img
                className={classes.avatar}
                src={getUserAvatar({
                  id: userSelector.id,
                  anon: userSelector.anon,
                  hasPhoto: userSelector.hasPhoto,
                  anonAvatar: userSelector.anonAvatar,
                  url: userSelector.url,
                })}
              />
            ) : null} */}
          </>
          <Box width={1}>
            <Box className={classes.contentBox} zIndex={1}>
              <Box className={classes.topWrapper}>
                <Box className={classes.titleContainer}>
                  <Box className={classes.title}>
                    <img src={require("assets/zooImages/explore.svg")} width="100%" />
                  </Box>
                  <Box className={classes.flexBox}>
                    <div className={classes.priviTitle}>
                      <img src={require("assets/zooImages/privi.png")} width="100%" />
                    </div>
                    <div className={classes.zooTitle}>
                      <img src={require("assets/zooImages/zoo.svg")} width="100%" />
                    </div>
                  </Box>
                  <Box className={classes.titleDescription}>
                    <img src={require("assets/zooImages/description.png")} width="100%" />
                  </Box>
                </Box>
                {/* <button className={classes.myApps} onClick={navigateApps}>
                  MY APPS
                </button> */}
              </Box>
              <Grid container spacing={3}>
                <Grid item md={12} sm={12} xs={12}>
                  <ElasticCarousel
                    isRTL={false}
                    itemsToShow={1}
                    pagination={false}
                    showArrows={false}
                    ref={carouselRef}
                    onChange={(_, pageIndex) => {
                      if (pageIndex !== currentPage) {
                        setCurrentPage(pageIndex);
                      }
                    }}
                  >
                    {ZOO_CAROUSEL_APPS.map((item, index) => (
                      <Box className={classes.musicBox} key={`${index}_elastic_item`}>
                        <Box className={classes.flexBox} justifyContent="space-between">
                          <Box className={classes.title2}>{item.title}</Box>
                        </Box>
                        <Box mb={3}>{item.description}</Box>
                        <img
                          src={item.imageUrl}
                          width="100%"
                          style={{ borderRadius: "15px", width: "75%" }}
                        />
                      </Box>
                    ))}
                  </ElasticCarousel>
                  <Box className={classes.flexBox} justifyContent="space-between">
                    <Box className={`${classes.navIconBox} ${classes.flexBox}`} mt={2}>
                      <Box
                        style={{ transform: "rotate(90deg)" }}
                        onClick={() => {
                          carouselRef.current.goTo(currentPage - 1);
                        }}
                      >
                        <ChevronIconLeft />
                      </Box>
                      <Box
                        style={{ transform: "rotate(-90deg)" }}
                        ml={3}
                        onClick={() => {
                          carouselRef.current.goTo(currentPage + 1);
                        }}
                      >
                        <ChevronIconLeft />
                      </Box>
                    </Box>
                    <Box className={classes.flexBox}>
                      {[1, 2, 3, 4, 5, 6].map(item => (
                        <Box
                          className={`${classes.indexDotBox} ${item === currentPage + 1 ? "selected" : ""}`}
                          key={item}
                          ml={1}
                          onClick={() => {
                            if (item !== currentPage + 1) {
                              carouselRef.current.goTo(item - 1);
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <img
              src={require("assets/backgrounds/3d-grid.png")}
              style={{ marginTop: "-150px", width: "100%" }}
            />
          </Box>
          {/* )} */}
        </Box>
        {/* {!isSignedin ? ( */}
        <Box width={1} style={{ marginBottom: 50 }}>
          <Box className={classes.flexBox} width={1} justifyContent="center">
            <div className={classes.priviBox}>
              <div className={classes.priviBoxTitle}>
                <div className={classes.prevText}>Explore Privi</div>
                <span className={classes.appText} key={Math.random() * 1000}>
                  {ZOO_APPS_NAMES[appIdx]}
                </span>
              </div>
              <Box className={classes.flexBox} justifyContent="space-between">
                <Box
                  style={{ transform: "rotate(90deg)", cursor: "pointer" }}
                  mr={2}
                  onClick={() => setCurrentSlider(prev => prev - 1)}
                >
                  <ChevronIconLeft />
                </Box>
                <Box className={classes.carouselBox}>
                  <Carousel
                    slides={SamplePriviDataBundle(isMobile)}
                    goToSlide={currentSlider}
                    showNavigation={false}
                    offsetRadius={isMobile ? 1 : 3}
                    animationConfig={{ tension: 170, friction: 26 }}
                  />
                </Box>
                <Box
                  style={{ transform: "rotate(-90deg)", cursor: "pointer" }}
                  ml={2}
                  onClick={() => setCurrentSlider(prev => prev + 1)}
                >
                  <ChevronIconLeft />
                </Box>
              </Box>
            </div>
          </Box>
          <Box className={classes.contentBox}>
            <Box className={classes.flexBox}>
              <img src={require("assets/icons/trending_icon_2.png")} width="56px" />
              <Box className={classes.title2}>Trending apps</Box>
            </Box>
            <Box className={classes.flexBox} mt={2} ml={3}>
              <Grid container spacing={3}>
                {ZOO_APPS.map(item => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item.name}>
                    <PriviCard item={{ ...item }} showEarlyAccess />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
          {/* <Box className={classes.contentBox}>
              <Box className={classes.flexBox}>
                <img src={require("assets/icons/privi-suggestions.png")} width="56px" />
                <Box className={classes.title2}>Privi suggestions</Box>
              </Box>
              <Box className={classes.flexBox} mt={2} ml={3} style={{ display: "flex-grid" }}>
                <Grid className={classes.cardsGrid}>
                  <ResponsiveMasonry columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}>
                    <Masonry gutter={GUTTER}>
                      {AppsData.map(item => (
                        <Box key={item.name} mr={2}>
                          <SuggestionCard item={item} />
                        </Box>
                      ))}
                      {AppsData.map(item => (
                        <Box key={item.name} mr={2}>
                          <SuggestionCard item={item} />
                        </Box>
                      ))}
                    </Masonry>
                  </ResponsiveMasonry>
                </Grid>
              </Box>
            </Box> */}
          {/* <Box className={classes.contentBox}>
              <Box className={classes.flexBox}>
                <img src={require("assets/icons/new_release_app.png")} width="56px" />
                <Box className={classes.title2}>New releases</Box>
              </Box>
              <Box className={classes.flexBox} mt={2} ml={3}>
                <Grid className={classes.cardsGrid}>
                  <ResponsiveMasonry columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}>
                    <Masonry gutter={GUTTER}>
                      {AppsData.map(item => (
                        <Box key={item.name}>
                          <SuggestionCard item={item} />
                        </Box>
                      ))}
                    </Masonry>
                  </ResponsiveMasonry>
                </Grid>
              </Box>
            </Box> */}
        </Box>
        {/* ) : (
          <PriviPages />
        )} */}
        <Box>
          <Bottom />
        </Box>
      </Box>
      <NoMetamaskModal open={noMetamask} onClose={() => setNoMetamask(false)} />
    </Box>
  );
};

const ClaimIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M8.00001 15.0177C4.11023 15.0177 0.981384 11.8889 0.981384 7.99909C0.981384 4.10931 4.11023 0.980469 8.00001 0.980469C11.8898 0.980469 15.0186 4.10931 15.0186 7.99909C15.0186 11.8889 11.8898 15.0177 8.00001 15.0177ZM8.00001 2.44268C4.92936 2.44268 2.4436 4.92844 2.4436 7.99909C2.4436 11.0697 4.92936 13.5555 8.00001 13.5555C11.0707 13.5555 13.5564 11.0697 13.5564 7.99909C13.5564 4.92844 11.0707 2.44268 8.00001 2.44268ZM12.9715 7.99909C12.9715 5.2506 10.7485 3.02757 8.00001 3.02757C5.25151 3.02757 3.02848 5.2506 3.02848 7.99909C3.02848 10.7476 5.25151 12.9706 8.00001 12.9706C10.7485 12.9706 12.9715 10.7476 12.9715 7.99909Z"
      fill="black"
    />
    <path
      d="M8.00001 15.0177C4.11023 15.0177 0.981384 11.8889 0.981384 7.99909C0.981384 4.10931 4.11023 0.980469 8.00001 0.980469C11.8898 0.980469 15.0186 4.10931 15.0186 7.99909C15.0186 11.8889 11.8898 15.0177 8.00001 15.0177ZM8.00001 2.44268C4.92936 2.44268 2.4436 4.92844 2.4436 7.99909C2.4436 11.0697 4.92936 13.5555 8.00001 13.5555C11.0707 13.5555 13.5564 11.0697 13.5564 7.99909C13.5564 4.92844 11.0707 2.44268 8.00001 2.44268ZM12.9715 7.99909C12.9715 5.2506 10.7485 3.02757 8.00001 3.02757C5.25151 3.02757 3.02848 5.2506 3.02848 7.99909C3.02848 10.7476 5.25151 12.9706 8.00001 12.9706C10.7485 12.9706 12.9715 10.7476 12.9715 7.99909Z"
      fill="url(#paint0_linear)"
    />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="14.5721"
        y1="7.99908"
        x2="4.21404"
        y2="8.4828"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#AE38FF" />
        <stop offset="1" stopColor="#875EF7" />
      </linearGradient>
    </defs>
  </svg>
);

export default PriviZoo;
