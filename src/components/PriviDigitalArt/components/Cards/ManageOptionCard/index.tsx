import React from 'react';

import { useHistory } from 'react-router';
import { optionCardStyles } from './index.style';
import { CardActions, CardContent, Typography, CardMedia, Card } from '@material-ui/core';
import { Button, Grid } from '@material-ui/core';

const ManageOptionCard = ({img_url}) => {
    const history = useHistory();
    const classes = optionCardStyles();
    const handleOpenManageDetail = () => {
        history.push('/option/managefutures/'+img_url);
    }
    return (
        <>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <div className={classes.outerCard} style={{ marginBottom: 0 }} onClick={handleOpenManageDetail}>
                    <div className={classes.innerCardGradient}>
                        <div className={classes.innerCard}>
                            <div className={classes.cardTitle}>
                                <span className={classes.cardNftName}>NFT NAME</span>
                            </div>
                            <div className={classes.cardImg}>
                                <img src={'assets/test/' + img_url + '.png'} style={{width:'100%'}}/>
                            </div>
                            <div className={classes.cardContent}>
                                <div className={classes.cardContentDiv}>
                                    <span className={classes.cardContentText}>OFFERS</span>
                                    <span className={classes.cardContentAmount}>10</span>
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

export default ManageOptionCard;