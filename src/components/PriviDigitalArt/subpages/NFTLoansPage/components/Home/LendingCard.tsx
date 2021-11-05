import React from 'react';
import cls from 'classnames';
import { Typography, Grid, Divider } from '@material-ui/core';

import { useNFTLoansPageStyles } from "../../index.styles";

const LendingCard = () => {
  const classes = useNFTLoansPageStyles();

  const tokenList = [
    { tokenName: 'DAI2', apr: 0.05, amount: 242455, label: 'DAI' },
    { tokenName: 'USDT', apr: 0.05, amount: 242455, label: 'USDT' },
    { tokenName: 'USDC', apr: 0.05, amount: 242455, label: 'USDC' },
  ];

  return (
    <div className={classes.cardContainer}>
      <Typography className={classes.cardHeader}>
        Lending
      </Typography>
      <Typography className={classes.cardCaption}>
        Top 3
      </Typography>
      <div className={classes.topContainer}>
        {tokenList.map((token, index) => {
          return (
            <div key={token.tokenName}>
              <Grid 
                container 
                alignItems='center'
                wrap='nowrap'
                className={classes.tokenContainer}>
                <Grid item lg={8} md={6} sm={5} xs={5} container alignItems='center'>
                  <img
                    src={require(`assets/tokenImages/${token.tokenName}.png`)}
                    className={classes.tokenImage}
                  />
                  <Typography>{token.label}</Typography>
                </Grid>
                <Grid item lg={2} md={3} sm={3} xs={3}>
                  <Typography className={cls(classes.tokenLabel, classes.tokenDetail)}>{`%${token.apr * 100} APR`}</Typography>
                </Grid>
                <Grid item lg={2} md={3} sm={4} xs={4} container justify='flex-end'>
                  <Typography className={cls(classes.tokenLabel, classes.tokenDetail)}>{`${token.apr * 100} ${token.tokenName}`}</Typography>
                </Grid>
              </Grid>
              {index < tokenList.length - 1 &&
                <Divider className={classes.divider} /> 
              }
            </div>
          )
        })}
      </div>
      <div>
        <Typography className={classes.cardCaption}>
          Total Borrowed
        </Typography>
        <Typography className={classes.cardValue}>
          $122 405 555.55
        </Typography>
      </div>
      <Divider className={cls(classes.divider, classes.volumeDivider)} /> 
      <Grid container justify='space-between' wrap='nowrap'>
        <div>
          <Typography className={classes.cardCaption}>
            24h Borrow Volume
          </Typography>
          <Typography className={classes.cardValue}>
            $11 245 556.22
          </Typography>
        </div>
        <Grid container direction='column' alignItems='flex-end'>
          <Typography className={classes.cardCaption}>
            # of borrowers
          </Typography>
          <Typography className={classes.cardValue}>
            245556
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default LendingCard;