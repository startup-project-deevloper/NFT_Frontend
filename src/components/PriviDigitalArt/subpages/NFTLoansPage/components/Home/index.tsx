import React, { useState, useEffect, useRef } from "react";
import Axios from "axios";
import { useMediaQuery, useTheme } from "@material-ui/core";
import URL from "shared/functions/getURL";

import cls from "classnames";
import Box from "shared/ui-kit/Box";
import { useNFTLoansPageStyles } from "../../index.styles";
import CollateralisedLoans from "./CollateralisedLoans";
import FractionalLoans from "./FractionalLoans";

const Tabs = ["Collateralised Loans", "Fractional Loans"];

const isProd = process.env.REACT_APP_ENV === "prod";

const NFTLoansHome = ({ setOpenDepositPage }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));

  const classes = useNFTLoansPageStyles();
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const [loadingHotLoans, setLoadingHotLoans] = useState<boolean>(false);
  const [loadingLoans, setLoadingLoans] = useState<boolean>(false);
  const [hotLoans, setHotLoans] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);

  const [loadingMarkets, setLoadingMarkets] = useState<boolean>(false);
  const [markets, setMarkets] = useState<any[]>([]);

  const lastIdRef = useRef<string>("");
  const hasMoreRef = useRef<boolean>(true);

  useEffect(() => {
    loadLoans();
    loadMarkets();
    loadHottestLoans();
  }, []);

  const reload = () => {
    setLoans([]);
    hasMoreRef.current = true;
    lastIdRef.current = "";
    setTimeout(() => {
      loadLoans();
      loadHottestLoans();
    }, 1000);
  };

  const loadLoans = () => {
    setLoadingLoans(true);

    const config = {
      params: {
        lastId: lastIdRef.current,
        mode: isProd ? "main" : "test",
      },
    };

    Axios.get(`${URL()}/nftLoan/getNFTLoans`, config)
      .then(res => {
        const data = res.data;
        if (data.success) {
          const nftLoans = data.data.map(item => {
            if (typeof item.nftData?.metadata === "string") {
              try {
                item.nftData.metadata = JSON.parse(item.nftData?.metadata);
              } catch (e) {
                console.log(e);
              }
            }
            return item;
          });
          const newData = [...nftLoans];
          setLoans(newData);
          lastIdRef.current = data.lastId;
          hasMoreRef.current = data.hasMore;
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoadingLoans(false);
      });
  };

  const loadMarkets = () => {
    // setLoadingMarkets(true);
    // Axios.get(`${URL()}/nftLoan/getFractionalLoans`)
    //   .then(res => {
    //     const data = res.data;
    //     if (data.success) {
    //       setMarkets(data.data.markets);
    //     }
    //   })
    //   .catch(err => console.log(err))
    //   .finally(() => {
    //     setLoadingMarkets(false);
    //   });
  };

  const loadHottestLoans = () => {
    setLoadingHotLoans(true);

    const config = {
      params: {
        mode: isProd ? "main" : "test",
      },
    };
    Axios.get(`${URL()}/nftLoan/getHottestNFTLoans`, config)
      .then(res => {
        const data = res.data;
        if (data.success) {
          const nftLoans = data.data.map(item => {
            if (typeof item.nftData?.metadata === "string") {
              try {
                item.nftData.metadata = JSON.parse(item.nftData.metadata);
              } catch (e) {
                console.log(e);
              }
            }
            return item;
          });
          setHotLoans(nftLoans);
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoadingHotLoans(false);
      });
  };

  const loadMore = () => {
    if (!hasMoreRef.current || loadingLoans) return;
    setLoadingLoans(true);

    const config = {
      params: {
        lastId: lastIdRef.current,
        mode: isProd ? "main" : "test",
      },
    };

    Axios.get(`${URL()}/nftLoan/getNFTLoans`, config)
      .then(res => {
        const data = res.data;
        if (data.success) {
          const nftLoans = data.data.map(item => {
            if (typeof item.nftData?.metadata === "string") {
              try {
                item.nftData.metadata = JSON.parse(item.nftData.metadata);
              } catch (e) {
                console.log(e);
              }
            }
            return item;
          });

          const newData = [...loans, ...nftLoans];
          setLoans(newData);
          lastIdRef.current = data.lastId;
          hasMoreRef.current = data.hasMore;
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoadingLoans(false);
      });
  };

  const handleScroll = async e => {
    if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 42) {
      if (hasMoreRef.current && selectedTab != 1) loadMore();
    }
  };

  return (
    <>
      <Ellipse />
      <div className={classes.content} onScroll={handleScroll}>
        <Box
          display="flex"
          alignItems="center"
          width="100%"
          pl={isMobile ? 0 : "42px"}
          justifyContent={isMobile ? "center" : "flex-start"}
        >
          <h2>✨ NFT Loans</h2>
        </Box>

        <Box
          mt={isMobile ? 5 : 7}
          width="100%"
          padding={isMobile ? "0 15px" : "0 42px"}
          style={{ borderBottom: "1px solid #431AB720" }}
        >
          <Box display="flex" width="100%">
            {Tabs.map((tab, index) => (
              <>
                <div
                  key={`tab-${index}`}
                  className={cls({ [classes.selectedTab]: index === selectedTab }, classes.tab)}
                  onClick={() => {
                    setSelectedTab(index);
                  }}
                >
                  {tab}
                </div>
                {tab === "Fractional Loans" && <span className={classes.comingSoon}>Coming Soon</span>}
              </>
            ))}
          </Box>
        </Box>

        {selectedTab === 0 && (
          <CollateralisedLoans
            setOpenDepositPage={setOpenDepositPage}
            reload={reload}
            hotLoans={hotLoans}
            setHotLoans={setHotLoans}
            loans={loans}
            setLoans={setLoans}
            loadingLoans={loadingLoans}
            loadingHotLoans={loadingHotLoans}
            handleScroll={handleScroll}
          />
        )}
        {selectedTab === 1 && <FractionalLoans loading={loadingMarkets} markets={markets} />}
      </div>
    </>
  );
};

export default React.memo(NFTLoansHome);

const Ellipse = () => {
  const classes = useNFTLoansPageStyles();

  return (
    <svg
      className={classes.ellipse}
      xmlns="http://www.w3.org/2000/svg"
      width="564"
      height="420"
      viewBox="0 0 564 420"
      fill="none"
    >
      <g filter="url(#filter0_f)">
        <ellipse cx="-120" cy="83" rx="504" ry="157" fill="#DDFF5710" />
      </g>
      <defs>
        <filter
          id="filter0_f"
          x="-804"
          y="-254"
          width="1368"
          height="674"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="90" result="effect1_foregroundBlur" />
        </filter>
      </defs>
    </svg>
  );
};
