import React, {useEffect} from 'react';

import ExploreOptionCard from 'components/PriviDigitalArt/components/Cards/ExploreOptionCard';
import { exploreOptionStyles } from './index.styles';

import Box from "shared/ui-kit/Box";
import { Grid } from '@material-ui/core';
import axios from 'axios';

import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";
import NFTReservalManagerContract from "shared/connectors/web3/contracts/NFTReservalManagerContract.json";
import URL from "shared/functions/getURL";

const isProd = process.env.REACT_APP_ENV === "prod";

const ExploreOption = () => {

    // const { activate, account, library, chainId } = useWeb3React();
    // console.log("CGI ", account, library);

    // const getData = async() => {
    //     const provider = localStorage.getItem('provider');
    //     const account = '';
    //     const web3 = new Web3(provider);
    //     const NFTReservalManagerContract = new web3.eth.Contract(
    //         contractABI.abi,
    //         contractAddress
    //     );
    //         const [res] = await Promise.all([
    //         NFTReservalManagerContract.methods.createOffer(1).call()
    //     ]);
    //     return res;
    // }

    // useEffect(() => {
    //     // if (account && library && account.length > 0) {
    //         const data = getData();
    //         console.log("CGI data is ", data);
    //     // }    
    // })    
    // const { account, library, chainId } = useWeb3React();
    // console.log(">>", account, library, chainId);

    // const getData = async() => {
    //     const web3 = new Web3(library.provider);
    //     const network = "Polygon";
    //     const contractAddress = config[network].CONTRACT_ADDRESSES.SYNTHETIC_PROTOCOL_ROUTER;
    //     const contract = ContractInstance(web3, NFTReservalManagerContract.abi, contractAddress);
    //     console.log(contract);
    //     const result_data = await contract.methods.getNFTReservals("0xsfksenksj141321");
    
    //     console.log(">>>", result_data);
    // }

    // useEffect(() => {
    //     // if (account && library && account.length > 0) {
    //         const data = getData();
    //         console.log("CGI data is ", data);
    //     // }    
    // })   

    // const response = await Axios.post(`${URL()}/nftOption/getAllNFTOptions`);

    useEffect(() => {
			getData();
    }, []);

		const getData = async () => {
			console.log("getdata");
			const body = {
				type: "PIX",
				mode: isProd ? "main" : "test"
			}

			const response = await axios.get(`${URL()}/nftOption/getAllReservedNFTs`, {params: body});
			
			console.log(">>>>>>>", response);
		}

    const classes = exploreOptionStyles();
    return (
        <>
            <div className={classes.content}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <ExploreOptionCard xs={12} sm={6} md={4} lg={3} img_url={1} nft_name="test1" period="10" price="2300" pct="10"/>
                        <ExploreOptionCard xs={12} sm={6} md={4} lg={3} img_url={2} nft_name="test2" period="20" price="1300" pct="20"/>
                        <ExploreOptionCard xs={12} sm={6} md={4} lg={3} img_url={3} nft_name="test3" period="30" price="1000" pct="15"/>
                        <ExploreOptionCard xs={12} sm={6} md={4} lg={3} img_url={4} nft_name="test4" period="15" price="700" pct="13"/>
                        <ExploreOptionCard xs={12} sm={6} md={4} lg={3} img_url={5} nft_name="test5" period="6" price="1700" pct="30"/>
                        <ExploreOptionCard xs={12} sm={6} md={4} lg={3} img_url={6} nft_name="test6" period="16" price="2200" pct="20"/>
                        <ExploreOptionCard xs={12} sm={6} md={4} lg={3} img_url={7} nft_name="test7" period="10" price="2300" pct="18"/>
                        <ExploreOptionCard xs={12} sm={6} md={4} lg={3} img_url={8} nft_name="test8" period="19" price="1000" pct="5"/>
                    </Grid>
                </Box>
            </div>
        </>
    )
}

export default ExploreOption