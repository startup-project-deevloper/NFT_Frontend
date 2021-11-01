import React, { useState } from 'react';
import ManageOptionCard from 'components/PriviDigitalArt/components/Cards/ManageOptionCard';
import { optionAcceptedStyles } from './index.styles';
import Box from "shared/ui-kit/Box";
import { Grid } from '@material-ui/core';
import cls from "classnames";
import { Avatar, Color, FontSize, PrimaryButton, SecondaryButton, Text } from "shared/ui-kit";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import { useHistory } from 'react-router';

const useStyles = makeStyles({
    root: {
      width: 700
    }
});
  
const marks = [
    {
      value: 0,
      label: '0%',
    },
    {
      value: 10,
      label: '10%',
    },
    {
      value: 20,
      label: '20%',
    },
    {
      value: 30,
      label: '30%',
    },
    {
      value: 40,
      label: '40%',
    },
    {
      value: 50,
      label: '50%',
    },
    {
      value: 60,
      label: '60%',
    },
    {
      value: 70,
      label: '70%',
    },
    {
      value: 80,
      label: '80%',
    },
    {
      value: 90,
      label: '90%',
    },
    {
      value: 100,
      label: '100%',
    },
];

const CustomSlider = withStyles({
    rail: {
      border: '2px solid black',
      height: 8,
      borderRadius: 4,
      backgroundImage: "linear-gradient(90deg, #C70000 0%, #FF0F00 15.64%, #FF6B00 32.88%, #FFE600 42.11%, #FFE600 65.18%, #B5F400 75.74%, #B5F400 100%)"
  
    },
    track: {
      height: 8,
      borderRadius: 4,
      backgroundImage: "linear-gradient(90deg, #C70000 0%, #FF0F00 15.64%, #FF6B00 32.88%, #FFE600 42.11%, #FFE600 65.18%, #B5F400 75.74%, #B5F400 100%)"
    },
    root: {
      color: '#4218B5',
      height: 8,
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      marginTop: -8,
      marginLeft: -12,
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 4px)',
    },
    mark: {
      backgroundColor: '#bfbfbf',
      height: 8,
      width: 2,
      marginTop: 10,
    },
})(Slider);
  
const OfferAccepted = () => {
    const classes = optionAcceptedStyles();
    const [selectedSubTab, setSelectedSubTab] = useState<"created" | "listed">("listed");
    const history = useHistory();
    const handleListedClick = () => {
        setSelectedSubTab("listed");
        // history.push("/fractionalise/synthetic-derivative");
    };
    
    const handleCreatedClick = () => {
        setSelectedSubTab("created");
        // history.push("/fractionalise");
    };

    const [sliderValue, setSliderValue] = React.useState(30);

    const handleChange = (event, newValue) => {
        setSliderValue(newValue);
    };

    const handleClick = () => {
      history.push('/option/bought_nft_view');
    }
  
    return (
        <>
            <div className={classes.content} onClick={handleClick}>
                <Box sx={{ flexGrow: 1, width:'100%'}}>
                    <Grid container spacing={2}>
                        <Box width="100%" padding="30px 30px 0px 30px" display="flex" style={{background:"#5F2AF4", borderRadius:'16px'}}>
                            <Box width="20%" sx={{marginRight:'20px'}}>
                                <img src={require('assets/backgrounds/nft-card-img.png')} style={{width:'100%'}}/>
                            </Box>
                            <Box width="100%">
                                <Box>
                                    <Box sx={{color:'white', fontSize:'22px', fontWeight:700}}>Pudgy</Box>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Box>
                                            <Box sx={{color:'white', fontSize:'16px', fontWeight:600}} style={{opacity:'0.8'}}>Future Pice</Box>
                                            <Box sx={{color:'white', fontSize:'18px', fontWeight:700}}>3232.456 USDT</Box>
                                        </Box>
                                        <Box>
                                            <Box sx={{color:'white', fontSize:'16px', fontWeight:600}} style={{opacity:'0.8'}}>Collateral</Box>
                                            <Box sx={{color:'white', fontSize:'18px', fontWeight:700}}>223 USDT</Box>
                                        </Box>
                                        <Box>
                                            <Box sx={{color:'white', fontSize:'16px', fontWeight:600}} style={{opacity:'0.8'}}>Payment in</Box>
                                            <PrimaryButton
                                            size="small"
                                            style={{ background: "#4218B5", color: "#ffffff", padding:'4px 15px'}}
                                            >
                                            4 Days
                                            </PrimaryButton>
                                            <PrimaryButton
                                            size="small"
                                            style={{ background: "#4218B5", color: "#ffffff", padding:'4px 15px'}}
                                            >
                                            22h
                                            </PrimaryButton>
                                            <PrimaryButton
                                            size="small"
                                            style={{ background: "#4218B5", color: "#ffffff", padding:'4px 15px'}}
                                            >
                                            12min
                                            </PrimaryButton>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center" justifyContent="space-between" marginTop="20px">
                                    <Box>
                                        <Box sx={{color:'white', fontSize:'16px', fontWeight:600}} style={{opacity:'0.8'}}>Collateral Pct. </Box>
                                        <Box sx={{color:'white', fontSize:'18px', fontWeight:700}}>20%</Box>
                                    </Box>
                                    <Box width="80%">
                                        <CustomSlider
                                            value={sliderValue}
                                            onChange={handleChange}
                                            aria-labelledby="continuous-slider"
                                            defaultValue={0}
                                            step={1}
                                            marks={marks}
                                            min={0}
                                            max={100}
                                            valueLabelDisplay="auto"
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Box>
            </div>
        </>
    )
}

export default OfferAccepted