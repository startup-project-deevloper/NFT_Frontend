import React, { useState } from 'react';
import ManageOptionCard from 'components/PriviDigitalArt/components/Cards/ManageOptionCard';
import { manageOptionStyles } from './index.styles';
import Box from "shared/ui-kit/Box";
import { Grid } from '@material-ui/core';
import cls from "classnames";

const ManagefuturesOption = () => {
    const classes = manageOptionStyles();
    const [selectedSubTab, setSelectedSubTab] = useState<"created" | "listed">("listed");

    const handleListedClick = () => {
        setSelectedSubTab("listed");
        // history.push("/fractionalise/synthetic-derivative");
    };
    
    const handleCreatedClick = () => {
        setSelectedSubTab("created");
        // history.push("/fractionalise");
    };
    return (
        <>
            <div className={classes.content}>
                <Box>
                    <div className={classes.subTitleSection}>
                        <div
                        className={cls({ [classes.selectedTabSection]: selectedSubTab === "created" }, classes.tabSection)}
                        onClick={handleCreatedClick}
                        >
                        <span>Created</span>
                        </div>
                        <div
                        className={cls(
                            { [classes.selectedTabSection]: selectedSubTab === "listed" },
                            classes.tabSection
                        )}
                        onClick={handleListedClick}
                        >
                        <span>
                            Listed
                        </span>
                        </div>
                    </div>
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <ManageOptionCard img_url={1}/>
                        <ManageOptionCard img_url={3}/>
                        <ManageOptionCard img_url={4}/>
                        <ManageOptionCard img_url={5}/>
                        <ManageOptionCard img_url={8}/>
                    </Grid>
                </Box>
            </div>
        </>
    )
}

export default ManagefuturesOption