import React, { useState, useEffect } from 'react';
import { useMediaQuery, useTheme } from "@material-ui/core";
import cls from "classnames";
import { useHistory, useParams } from "react-router";

import { useNFTOptionsStyles } from './index.styles';
import Box from 'shared/ui-kit/Box';
import { SecondaryButton } from "shared/ui-kit";

import ExploreOption from './components/Explore/ExploreOption';
import ManagefuturesOption from './components/Managefutures/ManagefuturesOption';

const NFTOption = () => {
    const theme = useTheme();
    const history = useHistory();
    const { id } = useParams();
    console.log("id----", id);
    const classes = useNFTOptionsStyles();
    const [selectedTab, setSelectedTab] = useState<"explore" | "managefutures">("explore");
    
    useEffect(()=>{
        if(id === "explore") {
            setSelectedTab("explore");
        } else {
            setSelectedTab("managefutures");
        }
    }, id)
    const handleManagefuturesClick = () => {
        setSelectedTab("managefutures");
        // history.push("/fractionalise/synthetic-derivative");
    };
    
    const handleExploreClick = () => {
        setSelectedTab("explore");
        // history.push("/fractionalise");
    };
    return (
        <>
            <Box className={classes.main}>
                <div className={classes.content}>
                    <div className={classes.titleBar}>
                        <div className={classes.title}>FUTURE MARKETPLACE</div>
                        <SecondaryButton
                            size="medium"
                            className={classes.manageButton}
                            onClick={() => {
                            history.push("/option/create_nft_option");
                            }}
                        >
                            <span style={{ margin: 'auto', paddingTop: '6px'}}>Sell NFT in Futures</span>
                        </SecondaryButton>
                    </div>
                    <Box width="100%" borderBottom="2px solid rgba(196,196,196,0.4)">
                        <div className={classes.subTitleSection}>
                            <div
                            className={cls({ [classes.selectedTabSection]: selectedTab === "explore" }, classes.tabSection)}
                            onClick={handleExploreClick}
                            >
                            <span>EXPLORE</span>
                            </div>
                            <div
                            className={cls(
                                { [classes.selectedTabSection]: selectedTab === "managefutures" },
                                classes.tabSection
                            )}
                            onClick={handleManagefuturesClick}
                            >
                            <span>
                                MANAGEFUTURES
                            </span>
                            </div>
                        </div>
                    </Box>

                    {selectedTab === 'explore' && (
                        <ExploreOption />
                    )}
                    {selectedTab === 'managefutures' && (
                        <ManagefuturesOption />
                    )}
                </div>
            </Box>
        </>
    )
}

export default NFTOption;