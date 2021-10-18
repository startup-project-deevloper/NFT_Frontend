import React, { useState } from "react";

import cls from "classnames";
import Box from "shared/ui-kit/Box";
import { useNFTLoansPageStyles } from "../../index.styles";
import CollateralisedLoans from "./CollateralisedLoans";

const Tabs = ["Collateralised Loans", "Fractional Loans"];

const NFTLoansHome = ({ setOpenDepositPage }) => {
  const classes = useNFTLoansPageStyles();
  const [selectedTab, setSelectedTab] = useState<number>(0);

  return (
    <>
      <Ellipse />
      <div className={classes.content}>
        <Box display="flex" alignItems="center" width="100%">
          <h2>✨ NFT Loans</h2>
        </Box>
        
        <Box mt={7} width="100%">
          <Box display="flex" width="100%" style={{ borderBottom: "1px solid #431AB720"}}>
            {Tabs.map((tab, index) => (
              <div
                key={`tab-${index}`}
                className={cls({ [classes.selectedTab]: index === selectedTab }, classes.tab)}
                onClick={() => {
                  setSelectedTab(index);
                }}
              >
                {tab}
              </div>
            ))}
          </Box>
        </Box>
        
        {selectedTab === 0 && (
          <CollateralisedLoans
            setOpenDepositPage={setOpenDepositPage}
          />
        )}
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
