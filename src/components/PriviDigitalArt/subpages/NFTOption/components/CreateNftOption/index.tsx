import React, { useState } from 'react';
import { createNftOptionStyles } from './index.styles';
import Box from 'shared/ui-kit/Box';
import {BackButton} from "../../../../components/BackButton";
import { Grid, Paper, Button} from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import cls from "classnames";
import { Dropdown } from "shared/ui-kit/Select/Select";
import { BlockchainNets } from "shared/constants/constants";
import CreateNftOptionCard from "../../../../components/Cards/CreateNftOptionCard";

import CreateNftOptionModal from 'components/PriviDigitalArt/modals/CreateNftOptionModal';

const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

const CreateNftOption = () => {
    const [prevSelectedChain, setPrevSelectedChain] = useState<any>(filteredBlockchainNets[0]);
    const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[0]);
    
    const classes = createNftOptionStyles();
    const [isConnectWallet, setConnectWallet] = useState(false);
    const [checked, setCheckedStatus] = useState({
        stable: true,
        crypto: false,
        nft: false
    });
    
    const handleCheckChange = () => {

    }

    const handleConnectWallet = () => {
        setConnectWallet(true);
    }

    const [openCreateNftOptionModal, setOpenCreateNftOptionModal] = useState<boolean>(false);
    const handleConfirmCreateNftOption = () => {
        setOpenCreateNftOptionModal(false);
    }

    return(
        <>
            <Box className={classes.main}>
                <div className={classes.content}>
                    <BackButton purple/>
                    <div className={classes.titleBar}>
                        <div className={classes.title}>Create NFT Option</div>
                        <div className={classes.subTitle}>Looking your NFT, to be able to sell it as future option</div>
                    </div>
                    <Grid container spacing={4} style={{marginTop:'47px'}}>
                        <Grid item xs={12} sm={12} md={7} style={{display:'flex', alignItems: 'flex-start'}}>
                            {!isConnectWallet && (
                                <>
                                    <img src={require("assets/emojiIcons/icon_bell.png")} className={classes.connectWalletIcon} alt="bell" />
                                    <div className={classes.connectWalletText}>To Sell your NFT as Option you need first to connect your wallet.</div>
                                    <div className={classes.connectWalletButton} onClick={handleConnectWallet}>Connect your Wallet</div>
                                </>
                            )}
                            {isConnectWallet && (
                                <>
                                    <Grid container spacing={2}>
                                        <CreateNftOptionCard />
                                        <CreateNftOptionCard />
                                        <CreateNftOptionCard />
                                        <CreateNftOptionCard />
                                        <CreateNftOptionCard />
                                        <CreateNftOptionCard />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={12} md={5}>
                            <div className={classes.createForm}>
                                <div className={classes.formHeader}>
                                    <div className={classes.formTitle}>RESERVE NFT OFFER</div>
                                    <div className={classes.formSubTitle}>You can only select one NFT</div>
                                </div>
                                <div className={classes.formBody}>
                                    <div className={classes.formInputName}>Reserve Period</div>
                                    <input type="text" className={classes.formInput} placeholder="0.97524"></input>
                                    <div className={classes.formInputName}>Reserve Price</div>
                                    <input type="text" className={classes.formInput} placeholder="0.97524"></input>
                                    <div className={classes.formInputName}>Select Chain</div>
                                    <Dropdown
                                        value={selectedChain.value}
                                        menuList={filteredBlockchainNets}
                                        onChange={e => {
                                        setPrevSelectedChain(selectedChain);
                                        setSelectedChain(filteredBlockchainNets.find(c => c.value === e.target.value));
                                        }}
                                        hasImage
                                    />
                                    <div className={classes.formInputName}>Collateral to Keep %</div>
                                    <input type="text" className={classes.formInput} placeholder="0.97524"></input>
                                    <div className={classes.formInputName}>Collateral Type</div>
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={checked.stable}
                                            onChange={(e)=>setCheckedStatus({stable:true,crypto:false,nft:false})}
                                            name="checkedB"
                                            color="primary"
                                            style={{color:'#4218B5'}}
                                        />
                                        }
                                        className={cls({ [classes.checkSelectedOption]: checked.stable === true }, classes.checkDefaultOption)}
                                        label="StableCoin"
                                    />
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={checked.crypto}
                                            onChange={(e)=>setCheckedStatus({stable:false,crypto:true,nft:false})}
                                            name="checkedB"
                                            color="primary"
                                            style={{color:'#4218B5'}}
                                        />
                                        }
                                        className={cls({ [classes.checkSelectedOption]: checked.crypto === true }, classes.checkDefaultOption)}
                                        label="Crypto"
                                    />
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={checked.nft}
                                            onChange={(e)=>setCheckedStatus({stable:false,crypto:false,nft:true})}
                                            name="checkedB"
                                            color="primary"
                                            style={{color:'#4218B5'}}
                                        />
                                        }
                                        className={cls({ [classes.checkSelectedOption]: checked.nft === true }, classes.checkDefaultOption)}
                                        label="NFT Jots"
                                    />
                                    <div className={classes.formDescription}>
                                        Some description here expmaining how this work will
                                    </div>
                                    <div>
                                        <button className={classes.submitButton} onClick={()=>setOpenCreateNftOptionModal(true)}>Continue</button>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </div>
                <CreateNftOptionModal
                    open={openCreateNftOptionModal}
                    handleClose={() => setOpenCreateNftOptionModal(false)}
                    onConfirm={handleConfirmCreateNftOption}
                />
            </Box>
        </>
    )
}

export default CreateNftOption;