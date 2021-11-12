import React, { useEffect, useState, useRef } from "react";
import { Color, Gradient, Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
// import axios from "axios";

// import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
// import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import Box from "shared/ui-kit/Box";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { createSocialToken, ICreateSocialToken, getCryptosRateAsList } from "shared/services/API";
import CreateSocialTokenGeneralTab from "./components/GeneralTab";
// import CreateSocialTokenFundingTokenTab from "./components/FundingTokenTab";
import CreateSocialTokenSupplyTab from "./components/SupplyTab";
import { useCreateTokenStyles } from "./index.styles";

import { BlockchainNets } from "shared/constants/constants";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { toNDecimals } from "shared/functions/web3";
import { switchNetwork } from "shared/functions/metamask";
import useIPFS from "../../../../shared/utils-IPFS/useIPFS";
import { onUploadNonEncrypt } from "../../../../shared/ipfs/upload";

export default function CreateSocialTokenModal({
  handleRefresh,
  handleClose,
  open,
  setTxSuccess,
  setTxModalOpen,
  setTxHash,
}) {
  //REDUX
  const user = useTypedSelector(state => state.user);

  //HOOKS
  const classes = useCreateTokenStyles();
  const { showAlertMessage } = useAlertMessage();

  const [page, setPage] = useState(0);

  //general info
  const [tokenList, setTokenList] = useState<any[]>([]);

  const [socialToken, setSocialToken] = useState<any>({
    Network: BlockchainNets[1].name, //"Ethereum",
  });

  // const payloadRef = useRef<ICreateSocialToken>();
  // const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  // const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const { account, library, chainId } = useWeb3React();

  const { ipfs, setMultiAddr, uploadWithNonEncryption } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  // get token list from backend
  useEffect(() => {
    if (open === true) {
      try {
        getCryptosRateAsList().then(data => {
          const tokenList: any[] = [];
          data.forEach(rateObj => {
            tokenList.push(rateObj.token);
          });
          setTokenList(tokenList);
        });
      } catch (e) {
        showAlertMessage(`Failed getting token list ${e}`, { variant: "error" });
      }
    }
  }, [open]);

  //photo functions
  // const uploadImage = async (tokenId, tokenSymbol) => {
  //   return new Promise((resolve, reject) => {
  //     const formData = new FormData();
  //     formData.append("image", socialToken.photo, tokenId);
  //     const formTokenData = new FormData();
  //     formTokenData.append("image", socialToken.photo, tokenSymbol);
  //     const config = {
  //       headers: {
  //         "content-type": "multipart/form-data",
  //       },
  //     };
  //     axios
  //       .post(`${URL()}/social/changeSocialTokenPhoto`, formTokenData, config)
  //       .then(response => {
  //         resolve(true);
  //       })
  //       .catch(error => {
  //         resolve(true);
  //         console.log(error);
  //         showAlertMessage(`Error uploading photo`, { variant: "error" });
  //       });
  //     //upload token symbol image
  //     axios
  //       .post(`${URL()}/wallet/changeTokenPhoto`, formTokenData, config)
  //       .then(response => {
  //         let body = { dimensions: socialToken.tokenDimensions ?? socialToken.dimensions, id: tokenSymbol };
  //         axios.post(`${URL()}/wallet/updateTokenPhotoDimensions`, body).catch(error => {
  //           showAlertMessage(`Error uploading photo`, { variant: "error" });
  //         });
  //         resolve(true);
  //       })
  //       .catch(error => {
  //         showAlertMessage(`Error uploading photo`, { variant: "error" });
  //         resolve(true);
  //       });
  //   });
  // };

  // const validateSocialTokenInfo = () => {
  //   if (!(socialToken.TokenName && socialToken.TokenName.length >= 5)) {
  //     showAlertMessage(`Name field invalid. Minimum 5 characters required`, { variant: "error" });
  //     return false;
  //   } else if (!(socialToken.TokenSymbol && socialToken.TokenSymbol.length >= 3)) {
  //     showAlertMessage(`Token symbol field invalid. Minimum 3 characters required`, { variant: "error" });
  //     return false;
  //   } else if (!(socialToken.Description && socialToken.Description.length >= 20)) {
  //     showAlertMessage(`Description field invalid. Minimum 20 characters required`, { variant: "error" });
  //     return false;
  //   } else if (!socialToken.FundingToken) {
  //     showAlertMessage(`Funding Token field invalid`, { variant: "error" });
  //     return false;
  //   } else if (!socialToken.TradingSpread) {
  //     showAlertMessage(`Trading Spread field invalid`, { variant: "error" });
  //     return false;
  //   } else if (Number(socialToken.TradingSpread) < 0.1 || Number(socialToken.TradingSpread) > 20) {
  //     showAlertMessage(`Trading Spread must be between 0.1% - 20%`, { variant: "error" });
  //     return false;
  //   } else if (!socialToken.TargetSupply || Number(socialToken.TargetSupply) < 0) {
  //     showAlertMessage(`Target Supply field invalid. Musn't be filled and greater than 0`, {
  //       variant: "error",
  //     });
  //     return false;
  //   } else if (!socialToken.TargetSupply || Number(socialToken.TargetPrice) < 0) {
  //     showAlertMessage(`Target Price field invalid. Must be filled and greater than 0`, { variant: "error" });
  //     return false;
  //   } else if (!socialToken.InitialSupply || Number(socialToken.InitialSupply) < 0) {
  //     showAlertMessage(`Initial Supply field invalid. Must be filled and greater than 0`, {
  //       variant: "error",
  //     });
  //     return false;
  //   } else if (Number(socialToken.InitialSupply) > Number(socialToken.TargetSupply)) {
  //     showAlertMessage(`Initial Supply must be greater than 0 and smaller or equal to the Target Supply`, {
  //       variant: "error",
  //     });
  //     return false;
  //   } else if (!socialToken.AMM || socialToken.AMM === "") {
  //     showAlertMessage("Price Direction is invalid. Must select one", { variant: "error" });
  //     return false;
  //   } else {
  //     return true;
  //   }
  // };

  const handleCreateSocialToken = async () => {
    const targetChain = BlockchainNets.find(net => net.name === socialToken.Network);

    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Got failed while switching over to target netowrk", { variant: "error" });
        return;
      }
    }

    // Upload image to IPFS.
    let metadataPhoto: any = {};
    if (socialToken && socialToken.photo) {
      metadataPhoto = await onUploadNonEncrypt(socialToken.photo, file => uploadWithNonEncryption(file));
      delete socialToken.photo;
      delete socialToken.photoImg;
    }
    const logoUrl = `https://elb.ipfsprivi.com:8080/ipfs/${metadataPhoto.newFileCID}/${metadataPhoto.metadata.properties.name}`;
    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);
    const decimals = 18;
    const contractRes = await web3APIHandler.SocialTokenDeployer.spawn(
      web3,
      account!,
      {
        name: socialToken.TokenName,
        symbol: socialToken.TokenSymbol,
        totalCap: toNDecimals(socialToken.TargetSupply, decimals),
        initialMint: toNDecimals(socialToken.InitialSupply, decimals),
        tax: toNDecimals(socialToken.TradingSpread / 100, decimals),
        taxTo: account,
        logoUrl,
      },
      setTxModalOpen,
      setTxHash,
      handleClose
    );
    if (contractRes.success) {
      setTxSuccess(true);
      const apiRes = await createSocialToken({
        contractAddress: contractRes.data.contractAddress,
        userId: user.id,
        ...socialToken,
        Description: socialToken.Description || "",
        infoImage: metadataPhoto,
      });
      if (apiRes.success) {
        const id = apiRes.data?.id;
        // if (socialToken.photo && id) await uploadImage(apiRes.data.id, socialToken.TokenSymbol);
        showAlertMessage(`Social token created`, { variant: "success" });
        handleRefresh();
      } else showAlertMessage(`Social token creation failed`, { variant: "error" });
    } else {
      setTxSuccess(false);
    }
  };

  const saveProgress = () => {};

  return (
    <Modal
      className={classes.root}
      size="medium"
      isOpen={open}
      onClose={() => {
        handleClose();
      }}
      showCloseIcon
    >
      <div>
        {page === 0 ? (
          <div className={classes.firstPage}>
            <img src={require("assets/pixImages/profile_social_token.png")} alt="money face" />
            <Box className={classes.title} mt={2}>
              Create Social Token
            </Box>
            <div className={classes.label}>Generate own token and see it grow!</div>
            <PrimaryButton
              size="medium"
              isRounded
              onClick={() => setPage(1)}
              style={{ background: "#431AB7", width: "40%", marginTop: 24 }}
            >
              Get started
            </PrimaryButton>
          </div>
        ) : (
          <div className={classes.content}>
            <Box display="flex" alignItems="center" marginBottom="34px" justifyContent="space-between">
              <h5 style={{ margin: 0 }}>{`Create Social Token`}</h5>
            </Box>
            <div className={classes.stepsBorder} />
            <div className={classes.steps}>
              {["General", "Supply"].map((tab, index) => (
                <div className={index + 1 <= page ? classes.selected : undefined} key={`tab-${index}`}>
                  <button onClick={() => setPage(index + 1)}>{index + 1}</button>
                  <span>{tab}</span>
                </div>
              ))}
            </div>
            <div className={classes.divider} />
            {page === 1 ? (
              <CreateSocialTokenGeneralTab socialToken={socialToken} setSocialToken={setSocialToken} />
            ) : (
              //   <CreateSocialTokenFundingTokenTab
              //     socialToken={socialToken}
              //     setSocialToken={setSocialToken}
              //     tokenList={tokenList}
              //   />
              // ) : (
              <CreateSocialTokenSupplyTab socialToken={socialToken} setSocialToken={setSocialToken} />
            )}

            <div className={classes.buttons}>
              {page !== 2 ? (
                <PrimaryButton
                  size="medium"
                  isRounded
                  onClick={() => {
                    setPage(page + 1);
                  }}
                  style={{ background: Color.MusicDAODark, width: "40%", marginLeft: 'auto' }}
                >
                  Next
                </PrimaryButton>
              ) : (
                <PrimaryButton
                  size="medium"
                  isRounded
                  onClick={handleCreateSocialToken}
                  style={{ background: Gradient.Green1, width: "40%", marginLeft: 'auto' }}
                >
                  Create Social Token
                </PrimaryButton>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
