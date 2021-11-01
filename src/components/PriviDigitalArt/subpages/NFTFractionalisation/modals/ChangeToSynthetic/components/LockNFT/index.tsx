import React, { useState } from "react";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Box from "shared/ui-kit/Box";
import { ReactComponent as CopyIcon } from "assets/icons/copy-icon.svg";
import { useLockNFTStyles } from "./index.styles";
import Web3 from "web3";
import config from "shared/connectors/ethereum/config";
import { useWeb3React } from "@web3-react/core";
import { BlockchainNets } from "shared/constants/constants";
import axios from "axios";
import URL from "shared/functions/getURL";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { requestChangeNFT, changeNFT } from "shared/services/API/web3/contracts/NFTVaultManager";
import NFTCard from "../../../../components/ChangeNFTToSynthetic/NFTCard";

declare let window: any;
const isProd = process.env.REACT_APP_ENV === "prod";

export default function LockNFT({ onClose, onCompleted, selectedNFT, currentNFT }) {
  console.log('In lockNFT modal... ', selectedNFT, currentNFT)
  const tokenAddress = selectedNFT.tokenAddress
  const tokenToId = selectedNFT?.BlockchainId
  const tokenFromId = currentNFT?.NftId

  const classes = useLockNFTStyles();
  const [isProceeding, setIsProceeding] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();
  const [approveBtn, setApproveBtn] = useState<number>(0);

  const handleProceed = () => {
    setApproveBtn(1)
  }

  const handleChange = async () => {
    if (approveBtn !== 2) return;

    if (chainId !== 1 && chainId !== 4) {
      let changed = await switchNetwork(isProd ? 1 : 4);
      if (!changed) {
        showAlertMessage(`Got failed while switching over to ethereum network`, { variant: "error" });
        return;
      }
    }
    setIsProceeding(true);

    console.log("chainId", chainId, library);
    try {
      const web3 = new Web3(library.provider);
      
      const requestChangeRes = await requestChangeNFT(web3, account!, {
        tokenAddress,
        tokenFromId,
        tokenToId,
        setHash
      })

      if (!requestChangeRes) {
        setIsProceeding(false);
        showAlertMessage(`Lock NFT is failed, please try again later`, { variant: "error" });
        return;
      }

      const lockResponse = await changeNFT(web3, account!, {
        tokenAddress,
        tokenFromId,
        tokenToId,
        setHash
      });

      if (!lockResponse.status) {
        setIsProceeding(false);
        showAlertMessage(`Lock NFT is failed, please try again later`, { variant: "error" });
        return;
      }
      await axios.post(`${URL()}/syntheticFractionalize/lockNFT`, {
        collectionAddress: tokenAddress,
        tokenToId,
      });
      onCompleted();
      setIsProceeding(false);
      setApproveBtn(0)
    } catch (err) {
      console.log("error", err);
      setIsProceeding(false);
      showAlertMessage(`Lock NFT is failed, please try again later`, { variant: "error" });
    }
  }

  const handleApprove = async () => {
    if (approveBtn !== 1) return;

    console.log("chainId", chainId);
    if (chainId !== 1 && chainId !== 4) {
      let changed = await switchNetwork(isProd ? 1 : 4);
      if (!changed) {
        showAlertMessage(`Got failed while switching over to ethereum network`, { variant: "error" });
        return;
      }
    }

    try {
      const targetChain = BlockchainNets.find(net => net.value === "Ethereum Chain");
      const web3APIHandler = targetChain.apiHandler;

      const web3 = new Web3(library.provider);
      const contractAddress = config.CONTRACT_ADDRESSES.NFT_VAULT_MANAGER;
      const response = await web3APIHandler.Erc721.setApprovalForToken(
        web3,
        account!,
        {
          to: contractAddress,
          tokenId: tokenToId,
        },
        tokenAddress
      );

      if (!response.success) {
        showAlertMessage(`Lock NFT is failed, please try again later`, { variant: "error" });
        return;
      }

      setApproveBtn(2)
    } catch (err) {
      console.log("error", err);
      showAlertMessage(`Lock NFT is failed, please try again later`, { variant: "error" });
    }
  };

  const handleLater = () => {
    onClose();
  };

  const handleEtherScan = () => {
    window.open(`https://${!isProd ? "rinkeby." : ""}etherscan.io/tx/${hash}`, "_blank");
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        {isProceeding ? (
          <>
            <Box display="flex" alignItems="center" justifyContent="space-evenly">
              <NFTCard
                item={{
                  tokenAddress: currentNFT.collectionAddress,
                  BlockchainId: currentNFT.NftId,
                  MediaName: currentNFT.name,
                  Url: currentNFT.Url,
                  BlockchainNetwork: "Ethereum Chain"
                }}
                handleSelect={() => {}}
                isSmall
              />
              <CircleSVG />
              <NFTCard
                item={selectedNFT}
                handleSelect={() => {}}
                isSmall
              />
            </Box>
            <Box className={classes.result}>
              <h1 className={classes.title}>Exchange in progress<br /> with the 2 NFT </h1>
              <p className={classes.description}>
                Transaction is proceeding on Ethereum. <br />
                This can take a moment, please be patient...
              </p>
              {hash && (
                <>
                  <CopyToClipboard text={hash}>
                    <Box mt="20px" display="flex" alignItems="center" className={classes.hash}>
                      Hash:
                      <Box color="#4218B5" mr={1} ml={1}>
                        {hash.substr(0, 18) + "..." + hash.substr(hash.length - 3, 3)}
                      </Box>
                      <CopyIcon />
                    </Box>
                  </CopyToClipboard>
                  <button className={classes.checkBtn} onClick={handleEtherScan}>
                    Check on Etherscan
                  </button>
                </>
              )}
            </Box>
          </>
        ) : (
          <>
            <Box display="flex" alignItems="center" justifyContent="space-evenly">
              <NFTCard
                item={{
                  tokenAddress: currentNFT.collectionAddress,
                  BlockchainId: currentNFT.NftId,
                  MediaName: currentNFT.name,
                  Url: currentNFT.Url,
                  BlockchainNetwork: "Ethereum Chain"
                }}
                handleSelect={() => {}}
                isSmall
              />
              <ArrowSVG />
              <NFTCard
                item={selectedNFT}
                handleSelect={() => {}}
                isSmall
              />
            </Box>
            <h1 className={classes.title}>Lock {approveBtn ? 'new ' : ''}NFT on Ethereum</h1>
            <p className={classes.description}>
              Your NFT will be locked in a Vault on Ethereum smart contract. <br />
              Please keep in mind this process can take some time so be patient.
            </p>
            {approveBtn !== 0 ? (
              <Box display="flex" justifyContent="space-evenly">
                <button 
                  className={classes.btn}
                  style={{ padding: "8px 60px", backgroundColor: approveBtn === 1 ? "#431AB7" : "#431AB750" }}
                  onClick={handleApprove}
                >
                  Approve
                </button>
                <button
                  className={classes.btn}
                  onClick={handleChange}
                  style={{ padding: "8px 60px", backgroundColor: approveBtn === 1 ? "#431AB750" : "#431AB7" }}
                >
                  Change
                </button>
              </Box>
            ) : (
              <Box className={classes.buttonWrapper}>
                <button className={classes.laterBtn} onClick={handleLater}>
                  Lock Later & change later
                </button>
                <button className={classes.btn} onClick={handleProceed}>
                  Proceed
                </button>
              </Box>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const ArrowSVG = () => (
  <svg width="50" height="37" viewBox="0 0 50 37" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M31.5 7H0V29.5H31.5V37L50 18.5L31.5 0V7Z" fill="url(#paint0_linear_6758:17315)"/>
    <defs>
      <linearGradient id="paint0_linear_6758:17315" x1="3" y1="37" x2="42.2414" y2="37" gradientUnits="userSpaceOnUse">
        <stop stop-color="white" stop-opacity="0"/>
        <stop offset="0.499361" stop-color="#C14BF8"/>
        <stop offset="0.990202" stop-color="#4BA7F8"/>
      </linearGradient>
    </defs>
  </svg>
)

const CircleSVG = () => (
  <svg width="39" height="41" viewBox="0 0 39 41" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.0214 18.1923H3.11665C1.39804 18.1923 0 16.8035 0 15.0962V6.25C0 4.54269 1.39804 3.15385 3.11665 3.15385C4.83526 3.15385 6.2333 4.54269 6.2333 6.25V6.54635C9.75067 2.72038 14.7462 0.5 20.0356 0.5C25.7302 0.5 31.0463 3.03442 34.6171 7.45308C35.2182 8.19173 35.4452 9.14711 35.2404 10.0715C35.0401 10.9915 34.4346 11.7612 33.5842 12.1858L33.4728 12.2388C32.2351 12.8581 30.699 12.5087 29.8219 11.4073C27.4443 8.41288 23.878 6.69231 20.0356 6.69231C15.9172 6.69231 12.1193 8.69154 9.8041 12H12.0214C13.74 12 15.138 13.3888 15.138 15.0962C15.138 16.8035 13.74 18.1923 12.0214 18.1923ZM35.8833 23.1923H26.9786C25.26 23.1923 23.862 24.5812 23.862 26.2885C23.862 27.9958 25.26 29.3846 26.9786 29.3846H29.1959C26.8807 32.6931 23.0828 34.6923 18.9644 34.6923C15.1264 34.6923 11.5601 32.9717 9.17809 29.9773C8.30098 28.876 6.76937 28.5265 5.52716 29.1458L5.41585 29.1988C4.56545 29.6235 3.95993 30.3975 3.75957 31.3131C3.55922 32.2375 3.78629 33.1885 4.3829 33.9315C7.9537 38.3502 13.2698 40.8846 18.9644 40.8846C24.2538 40.8846 29.2493 38.6642 32.7667 34.8383V35.1346C32.7667 36.8419 34.1647 38.2308 35.8833 38.2308C37.602 38.2308 39 36.8419 39 35.1346V26.2885C39 24.5812 37.602 23.1923 35.8833 23.1923Z" fill="#431AB7"/>
    <path d="M12.0214 18.1923H3.11665C1.39804 18.1923 0 16.8035 0 15.0962V6.25C0 4.54269 1.39804 3.15385 3.11665 3.15385C4.83526 3.15385 6.2333 4.54269 6.2333 6.25V6.54635C9.75067 2.72038 14.7462 0.5 20.0356 0.5C25.7302 0.5 31.0463 3.03442 34.6171 7.45308C35.2182 8.19173 35.4452 9.14711 35.2404 10.0715C35.0401 10.9915 34.4346 11.7612 33.5842 12.1858L33.4728 12.2388C32.2351 12.8581 30.699 12.5087 29.8219 11.4073C27.4443 8.41288 23.878 6.69231 20.0356 6.69231C15.9172 6.69231 12.1193 8.69154 9.8041 12H12.0214C13.74 12 15.138 13.3888 15.138 15.0962C15.138 16.8035 13.74 18.1923 12.0214 18.1923ZM35.8833 23.1923H26.9786C25.26 23.1923 23.862 24.5812 23.862 26.2885C23.862 27.9958 25.26 29.3846 26.9786 29.3846H29.1959C26.8807 32.6931 23.0828 34.6923 18.9644 34.6923C15.1264 34.6923 11.5601 32.9717 9.17809 29.9773C8.30098 28.876 6.76937 28.5265 5.52716 29.1458L5.41585 29.1988C4.56545 29.6235 3.95993 30.3975 3.75957 31.3131C3.55922 32.2375 3.78629 33.1885 4.3829 33.9315C7.9537 38.3502 13.2698 40.8846 18.9644 40.8846C24.2538 40.8846 29.2493 38.6642 32.7667 34.8383V35.1346C32.7667 36.8419 34.1647 38.2308 35.8833 38.2308C37.602 38.2308 39 36.8419 39 35.1346V26.2885C39 24.5812 37.602 23.1923 35.8833 23.1923Z" fill="url(#paint0_linear_6731:101165)"/>
    <defs>
      <linearGradient id="paint0_linear_6731:101165" x1="-29.4719" y1="79.4466" x2="15.0935" y2="6.38944" gradientUnits="userSpaceOnUse">
        <stop offset="0.707022" stop-color="#C0AAFF"/>
        <stop offset="0.984387" stop-color="#431AB7"/>
      </linearGradient>
    </defs>
  </svg>
)