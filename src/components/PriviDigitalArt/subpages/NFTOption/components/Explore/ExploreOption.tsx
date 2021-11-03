import React from 'react';

import ExploreOptionCard from 'components/PriviDigitalArt/components/Cards/ExploreOptionCard';
import { exploreOptionStyles } from './index.styles';

import Box from "shared/ui-kit/Box";
import { Grid } from '@material-ui/core';

const ExploreOption = () => {
    const classes = exploreOptionStyles();
    return (
        <>
            <div className={classes.content}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <ExploreOptionCard xs={12} sm={6} md={4} lg={3} img_url={1} />
                        <ExploreOptionCard xs={12} sm={6} md={4} lg={3} img_url={2} />
                        <ExploreOptionCard xs={12} sm={6} md={4} lg={3} img_url={3} />
                        <ExploreOptionCard xs={12} sm={6} md={4} lg={3} img_url={4} />
                        <ExploreOptionCard xs={12} sm={6} md={4} lg={3} img_url={5} />
                        <ExploreOptionCard xs={12} sm={6} md={4} lg={3} img_url={6} />
                        <ExploreOptionCard xs={12} sm={6} md={4} lg={3} img_url={7} />
                        <ExploreOptionCard xs={12} sm={6} md={4} lg={3} img_url={8} />
                    </Grid>
                </Box>
            </div>
        </>
    )
}

export default ExploreOption