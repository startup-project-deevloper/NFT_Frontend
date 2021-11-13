import React, { useState, useEffect } from 'react';
import { createNftOptionStyles } from './index.styles';
import { Grid, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import Box from 'shared/ui-kit/Box';
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import {BackButton} from "../../../../components/BackButton";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import cls from "classnames";
import { Dropdown } from "shared/ui-kit/Select/Select";
import { BlockchainNets } from "shared/constants/constants";
import CreateNftOptionCard from "../../../../components/Cards/CreateNftOptionCard";
import Web3 from "web3";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";
import NFTReservalManagerContract from "shared/connectors/web3/contracts/NFTReservalManagerContract.json";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { injected } from "shared/connectors";
import axios from 'axios';
import Axios from "axios";

import CreateNftOptionProgressModal from "shared/ui-kit/Modal/Modals/CreateNftOptionProgressModal";
import { getNfts } from "shared/services/API";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import NFTCard from "../NFTCard";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import URL from "shared/functions/getURL";

const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");
const isProd = process.env.REACT_APP_ENV === "prod";

const CreateNftOption = () => {
    const classes = createNftOptionStyles();
    const { showAlertMessage } = useAlertMessage();

    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.between(769, 960));
    const isMiniTablet = useMediaQuery(theme.breakpoints.between(700, 769));
    const isMobile = useMediaQuery(theme.breakpoints.down(700));
    
		const user = useSelector((state: RootState) => state.user);
		const [period, setPeriod] = useState<number>(0);
		const [price, setPrice] = useState<number>(0);
		const [pct, setPct] = useState<number>(0);
    const [selectedNFT, setSelectedNFT] = useState<any>();
    const [prevSelectedChain, setPrevSelectedChain] = useState<any>(filteredBlockchainNets[0]);
    const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[1]);
    const [loadingNFTS, setLoadingNFTS] = useState<boolean>(false);
    
		const [hash, setHash] = useState<string>("");
		const [txSuccess, setTxSuccess] = useState<boolean | null>(null);
		const [reserveInProgress, setReserveInProgress] = useState<boolean>(false);
		const [reserveSuccess, setReserveSuccess] = useState<boolean | null>(null);
	
    const [userNFTs, setUserNFTs] = useState<any[]>([]);
    const { activate, account, library, chainId } = useWeb3React();
    const [walletConnected, setWalletConnected] = useState<boolean>(!!account);
    const handleConnectWallet = () => {
        setWalletConnected(true);
    };
    const [checked, setCheckedStatus] = useState({
        stable: true,
        crypto: false,
        nft: false
    });
    console.log(">>>>", walletConnected);
    useEffect(() => {
        loadNFT();
    }, [chainId, walletConnected, selectedChain]);

    const loadNFT = async () => {
        if (walletConnected) {
          setLoadingNFTS(true);
    
          const response = await getNfts({
            mode: isProd ? "main" : "test",
            network: selectedChain.chainName,
          });
          if (response.success) {
            setUserNFTs(response.data);
          } else {
            showAlertMessage(`Can't fetch nfts`);
          }
          setLoadingNFTS(false);
        }
    };
    
    const handleCheckChange = () => {

    }

    const [openCreateNftOptionProgressModal, setOpenCreateNftOptionProgressModal] = useState<boolean>(false);
    
		const handleConfirmCreateNftOption = async () => {
			setOpenCreateNftOptionProgressModal(false);
		}

		const validate = () => {
			if (!selectedNFT) {
				showAlertMessage("Please select a NFT", { variant: "error" });
				return false;
			} else if (!period || period <= 0) {
				showAlertMessage("Please enter a valid period", { variant: "error" });
				return false;
			} else if (!price || price <= 0) {
				showAlertMessage("Please enter a valid price", { variant: "error" });
				return false;
			} else if (!pct || pct <= 0) {
				showAlertMessage("Please enter a valid Collateral to Keep %", { variant: "error" });
				return false;
			}
			return true;
		}

		const handleMetamaskConnect = () => {
	
			activate(injected, undefined, true).catch(error => {
				if (error instanceof UnsupportedChainIdError) {
					activate(injected);
				} else {
					console.info("Connection Error - ", error);
					// setNoMetamask(true);
				}
			});
		};

		const handleCreateOption = async () => {
			if (!walletConnected) {
				showAlertMessage("Please connect your wallet first", { variant: "error" });
				return;
			}
	
			if (!validate()) {
				return;
			}
			console.log("---", selectedNFT, selectedChain, price);
			console.log(library);
			if(library === undefined) {
				handleMetamaskConnect();
				return;
			}
			const web3 = new Web3(library.provider);
			const web3Obj = new Web3(library.provider);
			
			let chain_id = await web3Obj.eth.getChainId();
			console.log("<<<<>>>>>", chain_id);
			const network = selectedChain.name === "ETHEREUM" ? "Ethereum" : "Polygon";
			// const contractAddress = config[network].CONTRACT_ADDRESSES.SYNTHETIC_PROTOCOL_ROUTER;
			const contractAddress = "0x2C556dCc83b8027a6D2379b20c23D797eA28888d";
			console.log(contractAddress);
			// const contractAddress = user.address;
			
			setTxSuccess(null);
			setReserveInProgress(true);

			setOpenCreateNftOptionProgressModal(true);
			const contract = await ContractInstance(web3, NFTReservalManagerContract.abi, contractAddress);
			
      console.log(contract);
			let current_price = 1;
			axios.get('https://api.coingecko.com/api/v3/simple/price?ids=Ethereum&vs_currencies=usd')
      .then(res => {
				console.log(res.data);
			});
			console.log("axios");
			let ct = pct * 1000;
			let collateral_to_keep = 4819 * price * ct;
			console.log("ct>>", ct);
			const reserval = await contract.methods.updateReserval(
				selectedNFT.nftCollection.address, 
				period, 
				selectedChain.config.CONTRACT_ADDRESSES.ERC20_TEST_TOKEN,
				price,
				ct,
				0
			).send({
				from : account,
				gas : 300000
			})
			.on("receipt", async (receipt) => {
				console.log(">>>success", receipt);

				const body = {
					Period : period,
					Price : price,
					Pct : ct,
					Metadata : selectedNFT.nftMetadata,
					Name : selectedNFT.nftName,
					Owner : selectedNFT.nftCollection.address,
					Symbol : selectedNFT.nftCollection.symbol,
					Block_number : receipt.blockNumber,
					Token_address : selectedNFT.nftCollection.address, 
					Token_id : selectedNFT.nftTokenId, 
					Token_url : selectedNFT.nftTokenUrl,
				}

				const response = await Axios.post(`${URL()}/nftOption/createNFTOption`, body);
				// const response = await Axios.post(`${URL()}/nftOption/createNFTOption`, body);
				console.log(">>>---", response.data);

				setHash(receipt.transactionHash);
				setTxSuccess(true);
				setReserveInProgress(false);
				setReserveSuccess(true);
			})
			.on("error", (err) => {
				console.log(">>>err", err);
				setTxSuccess(false);
				setReserveInProgress(false);
				setReserveSuccess(false);
			});
			console.log("reserval ---- ", reserval);
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
                        <Grid item xs={12} sm={12} md={7} >
                            {walletConnected ? (
                                <LoadingWrapper loading={loadingNFTS} theme={"blue"}>
                                    {userNFTs && userNFTs.length > 0 ? (
                                    <Box
                                        width={1}
                                        borderRadius={20}
                                        bgcolor="#EFF2FD"
                                        border="1px solid rgba(67, 26, 183, 0.24)"
                                        boxSizing="border-box"
                                        padding={isTablet || isMiniTablet || isMobile ? "41px 12px" : "41px 29px"}
                                    >
                                        <MasonryGrid
                                        gutter={"12px"}
                                        data={userNFTs}
                                        renderItem={(item, index) => (
                                            <NFTCard
                                            item={item}
                                            key={`item-${index}`}
                                            handleSelect={() => {
                                                if (userNFTs) {
                                                let nftsCopy = [...userNFTs];
                                                const selected = !userNFTs[index].selected;
                                                nftsCopy[index] = {
                                                    ...userNFTs[index],
                                                    selected: !userNFTs[index].selected,
                                                };
                                                // only need one selected
                                                if (selected) {
                                                    for (let i = 0; i < nftsCopy.length; i++) {
                                                    if (i != index) nftsCopy[i].selected = false;
                                                    }
                                                }
                                                setSelectedNFT({ index, ...nftsCopy[index] });
                                                setUserNFTs(nftsCopy);
                                                }
                                            }}
                                            />
                                        )}
                                        columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_TWO}
                                        />
                                    </Box>
                                    ) : (
                                    <Box className={classes.emptyBox}>
                                        <img src={require("assets/pixImages/not_found_wallet.png")} />
                                        <Box className={classes.detailsLabel} mt={1}>
                                        Not NFT found on your wallet.
                                        </Box>
                                    </Box>
                                    )}
                                </LoadingWrapper>
                            ) : (
                                <Grid container className={classes.walletRow}>
                                    <Grid item xs={12} md={6} sm={6}>
																			<div>
																					<img src={require("assets/emojiIcons/icon_bell.png")} alt="bell" />
																					To Sell your NFTs you need first to connect your wallet.
																			</div>
                                    </Grid>
                                    <Grid item xs={12} md={6} sm={6}>
	                                    <button onClick={handleConnectWallet}>Connect Your Wallet</button>
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={12} md={5}>
                            <div className={classes.createForm}>
                                <div className={classes.formHeader}>
                                    <div className={classes.formTitle}>RESERVE NFT OFFER</div>
                                    <div className={classes.formSubTitle}>You can only select one NFT</div>
                                </div>
                                <div className={classes.formBody}>
																	<Grid container style={{textAlign:'left'}}>
																		<Grid item xs={12} md={12}>
																			<Typography>Reserve Period</Typography>
																			<InputWithLabelAndTooltip
																				inputValue={period}
																				minValue={0}
																				required
																				type="number"
																				onInputValueChange={e => setPeriod(Number(e.target.value))}
																				theme="light"
																			/>
																		</Grid>
																		<Grid item xs={12} md={12}>
																			<Typography>Reserve Price</Typography>
																			<InputWithLabelAndTooltip
																				inputValue={price}
																				minValue={0}
																				required
																				type="number"
																				onInputValueChange={e => setPrice(Number(e.target.value))}
																				theme="light"
																			/>
																		</Grid>
																		<Grid item xs={12} md={12}>
																			<Typography>Collateral to Keep %</Typography>
																			<InputWithLabelAndTooltip
																				inputValue={pct}
																				minValue={0}
																				required
																				type="number"
																				onInputValueChange={e => setPct(Number(e.target.value))}
																				theme="light"
																			/>
																		</Grid>
																		<Grid item xs={12} md={12}>
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
																		</Grid>
																		<Grid item xs={12} md={12}>
																			<div className={classes.formDescription}>
																					Some description here expmaining how this work will
																			</div>
																		</Grid>
																		<Grid item xs={12} md={12}>
																			<div>
																					<button className={classes.submitButton} onClick={handleCreateOption}>Create Option</button>
																			</div>
																		</Grid>
																	</Grid>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </div>
                <CreateNftOptionProgressModal
                    open={openCreateNftOptionProgressModal}
                    onClose={() => {
                        setOpenCreateNftOptionProgressModal(false)
                    }}
										reserveInProgress={reserveInProgress}
										reserveSuccess={reserveSuccess}
										hash={hash}
										network={selectedChain?.value}
                />
            </Box>
        </>
    )
}

const COLUMNS_COUNT_BREAK_POINTS_TWO = {
    1180: 2,
    1500: 3,
};

export default CreateNftOption;
