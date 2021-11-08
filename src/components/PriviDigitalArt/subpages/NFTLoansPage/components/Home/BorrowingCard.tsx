import React, { useEffect, useState } from 'react';
import cls from 'classnames';
import { Typography, Grid, Divider } from '@material-ui/core';

import { useNFTLoansPageStyles } from "../../index.styles";

const BorrowingCard = ({ markets }) => {
  const classes = useNFTLoansPageStyles();
  const [topMarkets, setTopMarkets] = useState<any[]>([])
  const [totalLent, setTotalLent] = useState<number>(0)
  const [dailyVolume, setDailyVolume] = useState<number>(0)
  const [lenders, setLenders] = useState<number>(0)

  useEffect(() => {
    let _totalLent = 0
    let _dailyVolume = 0
    let _topMarkets: any = JSON.parse(JSON.stringify(markets))
    if (_topMarkets.length >= 2)
      for (let i = 0; i < _topMarkets.length - 1; i++) {
        for (let j = i + 1; j < _topMarkets.length; j++) {
          if (
            _topMarkets[i].token_info.priceInUsd
            * (
              _topMarkets[i].market_info.borrowList.length > 0
                ? _topMarkets[i].market_info.borrowList[0].total_borrow
                : 0)
            <
            _topMarkets[j].token_info.priceInUsd
            * (
              _topMarkets[j].market_info.borrowList.length > 0
                ? _topMarkets[j].market_info.borrowList[0].total_borrow
                : 0)
          ) {
            _topMarkets[i] = markets[j]
            _topMarkets[j] = markets[i]
          }
        }
      }
    if (_topMarkets.length <= 3) {
      setTopMarkets(_topMarkets)
    } else {
      setTopMarkets(_topMarkets.slice(0, 3))
    }
    for (let i = 0; i < markets.length; i++) {
      _totalLent += (
        markets[i].token_info.priceInUsd * (
          markets[i].market_info.borrowList.length > 0
            ? markets[i].market_info.borrowList[0].total_reserves
            : 0
        )
      )
      if (markets[i].market_info.borrowList.length > 1) {
        _dailyVolume += (markets[i].market_info.borrowList[0].total_reserves - markets[i].market_info.borrowList[1].total_reserves)
      } else if (markets[i].market_info.borrowList.length > 1) {
        _dailyVolume += markets[i].market_info.borrowList[0].total_reserves
      }
    }
    setDailyVolume(_dailyVolume)
    setTotalLent(_totalLent)
  }, [markets])

  return (
    <div className={classes.cardContainer}>
      <Typography className={classes.cardHeader}>
        Borrowing
      </Typography>
      <Typography className={classes.cardCaption}>
        Top {topMarkets.length}
      </Typography>
      <div className={classes.topContainer}>
        {topMarkets.map((token, index) => {
          return (
            <div key={token.token_info.Name}>
              <Grid
                container
                alignItems='center'
                wrap='nowrap'
                className={classes.tokenContainer}>
                <Grid item lg={8} md={6} sm={5} xs={5} container alignItems='center'>
                  <img
                    src={token.token_info.ImageUrl}
                    className={classes.tokenImage}
                  />
                  <Typography>{token.token_info.Name.toUpperCase()}</Typography>
                </Grid>
                <Grid item lg={2} md={3} sm={3} xs={3}>
                  <Typography className={cls(classes.tokenLabel, classes.tokenDetail)}>{`${token.market_info.borrow_apy * 100}% APR`}</Typography>
                </Grid>
                <Grid item lg={2} md={3} sm={4} xs={4} container justify='flex-end'>
                  <Typography className={cls(classes.tokenLabel, classes.tokenDetail)}>{`${token.market_info.borrowList.length > 0 ? token.market_info.borrowList[0].total_borrow : 0} ${token.token_info.Symbol}`}</Typography>
                </Grid>
              </Grid>
              {index < topMarkets.length - 1 &&
                <Divider className={classes.divider} />
              }
            </div>
          )
        })}
      </div>
      <div>
        <Typography className={classes.cardCaption}>
          Total lent
        </Typography>
        <Typography className={classes.cardValue}>
          ${totalLent}
        </Typography>
      </div>
      <Divider className={cls(classes.divider, classes.volumeDivider)} />
      <Grid container justify='space-between' wrap='nowrap'>
        <Grid item xs={6}>
          <Typography className={classes.cardCaption}>
            24h Lend Volume
          </Typography>
          <Typography className={classes.cardValue}>
            ${dailyVolume}
          </Typography>
        </Grid>
        <Grid container direction='column' alignItems='flex-end'>
          <Typography className={classes.cardCaption}>
            # of lenders
          </Typography>
          <Typography className={classes.cardValue}>
            {lenders}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default BorrowingCard;