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
                        <Box display="flex" flexDirection="column">
                            <div className={classes.title}>Not your average NFT marketplace</div>
                            <div className={classes.subTitle}>Rent, borrow and reserve to buy later.</div>
                        </Box>
                        <SecondaryButton
                            size="medium"
                            className={classes.manageButton}
                            onClick={() => {
                            history.push("/option/create_nft_option");
                            }}
                        >
                            <span style={{ margin: 'auto', paddingTop: '6px'}}>Manage Your NFTs</span>
                        </SecondaryButton>
                    </div>
                    <Box width="100%" borderBottom="2px solid rgba(196,196,196,0.4)">
                        <div className={classes.subTitleSection}>
                            <div
                                className={cls({ [classes.selectedTabSection]: selectedTab === "explore" }, classes.tabSection)}
                                onClick={handleExploreClick}
                            >
                            <span>EXPLORE ALL</span>
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