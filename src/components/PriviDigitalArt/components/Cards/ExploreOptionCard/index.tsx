import React from 'react';

import { optionCardStyles } from './index.style';
import { CardActions, CardContent, Typography, CardMedia, Card } from '@material-ui/core';
import { Button, Grid } from '@material-ui/core';
import { useHistory } from 'react-router';

const ExploreOptionCard = ({xs, sm, md, lg, img_url}) => {
    const history = useHistory();
    const classes = optionCardStyles();
    const handleOpenExplore = () => {
        history.push('/option/explore/' + img_url);
    }
    return (
        <>
            <Grid item xs={xs} sm={sm} md={md} lg={lg}>
                <div className={classes.outerCard} style={{ marginBottom: 0 }} onClick={handleOpenExplore}>
                    <div className={classes.innerCardGradient}>
                        <div className={classes.innerCard}>
                            <div className={classes.cardTitle}>
                                <span className={classes.cardNftName}>NFT NAME</span>
                                <button className={classes.cardOptionButton}>OPTION</button>
                            </div>
                            <div className={classes.cardImg}>
                                <img src={'assets/test/' + img_url + '.png'} style={{width:'100%'}}/>
                            </div>
                            <div className={classes.cardContent}>
                                <div className={classes.cardContentDiv}>
                                    <span className={classes.cardContentText}>Time</span>
                                    <span className={classes.cardContentAmount}>20 Days</span>
                                </div>
                                <div className={classes.cardContentDiv}>
                                    <span className={classes.cardContentText}>FUTURE PRICE</span>
                                    <span className={classes.cardContentAmount}>2000 USDT</span>
                                </div>
                                <div className={classes.cardContentDiv}>
                                    <span className={classes.cardContentText}>COLLATERAL PCT.</span>
                                    <span className={classes.cardContentAmount}>10%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Grid>
        </>
    )
}

export default ExploreOptionCard;