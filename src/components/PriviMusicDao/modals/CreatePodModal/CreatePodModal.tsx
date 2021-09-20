import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
// import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import cls from "classnames";

import { useMediaQuery, useTheme } from "@material-ui/core";

import { RootState } from "store/reducers/Reducer";
// import { getCryptosRateAsList } from "shared/services/API";
import URL from "shared/functions/getURL";
import { updateTask } from "shared/functions/updateTask";
// import { buildJsxFromObject } from "shared/functions/commonFunctions";
// import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import {
  // IInitiatePodMedias,
  // IInitiatePod,
  musicDAOInitiatePod,
  // initiatePodForSubstrate,
} from "shared/services/API";
import { BlockchainNets } from "shared/constants/constants";
// import { useSubstrate } from "shared/connectors/substrate";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { Modal, PrimaryButton, SecondaryButton, CircularLoadingIndicator } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
// import PolygonAPI from "shared/services/API/polygon";
// import PolygonConfig from "shared/connectors/polygon/config";
import CollabsTab from "./components/CollabsTab/CollabsTab";
import GeneralNFTMediaTab from "./components/GeneralNFTMediaTab/GeneralNFTMediaTab";
// import AssistanceNFTMediaTab from "./components/AssistanceNFTMediaTab/AssistanceNFTMediaTab";
// import TokenomicsNFTMediaTab from "./components/TokenomicsNFTMediaTab/TokenomicsNFTMediaTab";
// import SongsTab from "./components/SongsTab/SongsTab";
import { createPodModalStyles } from "./CreatePodModal.styles";

// const startDate = Math.floor(Date.now() / 1000 + 3600 * 24 * 7); // one week later
// const dateExpiration = Math.floor(Date.now() / 1000 + 3600 * 24 * 180); // half year later

const CreatePodModal = (props: any) => {
  const { showAlertMessage } = useAlertMessage();
  const userSelector = useSelector((state: RootState) => state.user);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [tabCreateNFTMedia, setTabCreateNFTMedia] = useState<number>(0);
  const [pod, setPod] = useState<any>({
    // TokenName: "",
    // TokenSymbol: "",
    // IsInvesting: true,
    // AMM: "Quadratic",
    // Spread: "",
    // FundingTokenPrice: "",
    // MaxPrice: "",
    // FundingToken: "USDT",
    // FundingDate: startDate,
    // FundingTarget: "",
    // InvestorDividend: "",
    // MaxSupply: "",
    // DateExpiration: dateExpiration,
    // Medias: [],

    Collabs: [],
    // AssistanceRequired: false,
    Name: "",
    Description: "",
    Hashtags: [],
    // InvestorShare: "",
    // SharingShare: "",
    // Royalty: "",
    // Offers: [],
    // OpenAdvertising: false,
    // RuleBased: false,
    // Network: BlockchainNets[1].name,
  });
  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);

  // const [tokenPhoto, setTokenPhoto] = useState<any>(null);
  // const [tokenPhotoImg, setTokenPhotoImg] = useState<any>(null);
  // const [tokenObjList, setTokenObjList] = useState<any[]>([]);
  const [acceptWarning, setAcceptWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const classes = createPodModalStyles({ acceptWarning });

  // const payloadRef = useRef<any>({});
  // const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  // const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  // const { api, apiState, keyring, keyringState } = useSubstrate();
  const { chainId } = useWeb3React();

  // default add creator as collaborator
  useEffect(() => {
    if (userSelector.address && !pod.Collabs.find(u => u.address == userSelector.address))
      pod.Collabs.push({
        userId: userSelector.id,
        address: userSelector.address,
        name: userSelector.firstName,
        imageUrl: userSelector.url,
        urlSlug: userSelector.urlSlug,
      });
  }, [userSelector.address]);

  useEffect(() => {
    if (pod && pod.id && pod.HasPhoto) {
      setPhotoImg(`${pod.Url}?${Date.now()}`);
    }
    // if (pod && pod.id && pod.HasPhotoToken) {
    //   setTokenPhotoImg(`${pod.UrlToken}?${Date.now()}`);
    // }
  }, [pod.id, pod.HasPhoto]);

  // get token list from backend
  // useEffect(() => {
  //   if (tokenObjList.length === 0 && props.open) {
  //     getCryptosRateAsList().then(data => {
  //       const tknObjList: any[] = [];
  //       data.forEach(rateObj => {
  //         tknObjList.push({ token: rateObj.token, name: rateObj.name });
  //       });
  //       setTokenObjList(tknObjList);
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.open]);

  // const handleOpenSignatureModal = () => {
  //   if (validateNFTMediaInfoCreate()) {
  //     let podInfo: any = {};
  //     if (pod.IsInvesting)
  //       podInfo = {
  //         Creator: userSelector.address,
  //         TokenName: pod.TokenName,
  //         TokenSymbol: pod.TokenSymbol,
  //         IsInvesting: pod.IsInvesting,
  //         AMM: pod.AMM.toUpperCase(),
  //         Spread: pod.Spread / 100,
  //         FundingTokenPrice: +pod.FundingTokenPrice,
  //         MaxPrice: +pod.MaxPrice,
  //         FundingToken: pod.FundingToken,
  //         FundingDate: +pod.FundingDate,
  //         FundingTarget: pod.FundingTarget,
  //         InvestorShare: pod.InvestorShare,
  //         SharingPercent: pod.SharingPercent,
  //         Royalty: pod.Royalty,
  //         MaxSupply: +pod.MaxSupply,
  //         DateExpiration: +pod.DateExpiration,
  //         Collabs: (pod.Collabs ?? []).map(user => user.address),
  //       };
  //     const medias: IInitiatePodMedias[] = [];
  //     const filteredMedias = pod.Medias.filter(m => m.Title !== "");
  //     for (let media of filteredMedias) {
  //       medias.push({
  //         MediaName: media.Title,
  //         MediaSymbol: media.Title.replace(/\s/g, ""),
  //         Type: "AUDIO_TYPE",
  //         ReleaseDate: 0,
  //         Genre: media.Genre,
  //       });
  //     }
  //     const payload: IInitiatePod = {
  //       PodInfo: podInfo,
  //       Medias: medias,
  //     };
  //     payloadRef.current = payload;
  //     // setSignRequestModalDetail(buildJsxFromObject(payload));
  //     // setOpenSignRequestModal(true);
  //     createPod();
  //   }
  // };

  const afterCreatePod = async podRes => {
    if (podRes.success) {
      const podId = podRes.podId;
      if (photo) {
        await uploadImage(podId);
      }
      await updateTask(userSelector.id, "Create a Pod");
      props.handleRefresh();
      props.onClose();
      showAlertMessage(`Pod created!`, { variant: "success" });
    } else showAlertMessage(`Error when making the request`, { variant: "error" });
  };

  const createPod = async () => {
    try {
      setIsLoading(true);
      // const payload: any = payloadRef.current;
      // if (Object.keys(payload).length) {
      if (validateNFTMediaInfoCreate()) {
        const payload: any = {};
        payload.name = pod.Name;
        payload.description = pod.Description;
        payload.imageUrl = "";
        payload.hashtags = pod.Hashtags;
        payload.hasPhoto = !!(photo || photoImg);
        payload.collabs = (pod.Collabs ?? []).map(user => ({ userId: user.urlSlug, address: user.address }));
        payload.creatorAddress = userSelector.address;
        payload.creatorId = userSelector.id;
        payload.network =
          (chainId && BlockchainNets.find(net => net.chainId === chainId)?.value) || BlockchainNets[1].value;

        // additional info
        // const additionalData: any = {};
        // additionalData.Creator = userSelector.address;
        // additionalData.Name = pod.Name;
        // additionalData.Description = pod.Description;
        // additionalData.SharingPercent = pod.SharingPercent;
        // additionalData.OpenAdvertising = pod.OpenAdvertising;
        // additionalData.MainHashtag = pod.Hashtags.length > 0 ? pod.Hashtags[0] : "";
        // additionalData.Hashtags = pod.Hashtags;
        // additionalData.HasPhoto = !!(photo || photoImg);
        // additionalData.dimensions = pod.dimensions;
        // additionalData.blockchainNetwork = pod.Network;
        // if (pod.Network === BlockchainNets[1].value) {
        //   // Create Media Pod on Substrate Chain
        //   if (!api) return;
        //   const keyringOptions = (keyring as any).getPairs().map(account => ({
        //     key: account.address,
        //     value: account.address,
        //     text: account.meta.name.toUpperCase(),
        //     icon: "user",
        //   }));
        //   const accountAddress = keyringOptions.length > 0 ? keyringOptions[0].value : "";
        //   const accountPair =
        //     accountAddress && keyringState === "READY" && (keyring as any).getPair(accountAddress);
        //   // Polkadot api query test code block
        //   // const now = await api.query.timestamp.now();
        //   // const { nonce, data: balance } = await api.query.system.account(accountAddress);
        //   // console.log(`${now}: balance of ${balance.free} and a nonce of ${nonce}`);
        //   initiatePodForSubstrate(payload, additionalData, api, accountPair).then(initiatePodRes => {
        //     afterCreatePod(initiatePodRes);
        //   });
        // }

        // Create Media Pod on Polygon Chain
        // if (pod.Network === BlockchainNets[1].name) {
        //   if (!account || !library) {
        //     console.error("connect wallet");
        //     return;
        //   }

        //   const web3 = new Web3(library.provider);

        //   const contractResponse: any = await PolygonAPI.PodManager.initiatePod(web3, account!, {
        //     main: payload,
        //     extra: additionalData,
        //   });

        //   const collabs = {};
        //   (pod.Collabs || []).forEach(collab => {
        //     collabs[collab.address] = 0;
        //   });

        //   if (contractResponse.success == true) {
        //     const response = await axios.post(`${URL()}/musicDao/pod/initiatePod_P`, {
        //       hash: contractResponse.hash,
        //       payload: {
        //         ...payload.PodInfo,
        //         Collabs: collabs,
        //         PodAddress: contractResponse.data.podAddress,
        //       },
        //       additionalData,
        //     });

        //     afterCreatePod({ ...response.data, data: contractResponse.data.podAddress });
        //   }
        // }
        // // Create Media Pod on Privi Chain
        // else {
        const initiatePodRes = await musicDAOInitiatePod(payload);
        afterCreatePod(initiatePodRes);
        // }
      } else {
        setIsLoading(false);
      }
    } catch (e) {
      showAlertMessage(e.message, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const validateNFTMediaInfoCreate = () => {
    if (pod.Name.length <= 5) {
      showAlertMessage(`Name field invalid. Minimum 5 characters required`, { variant: "error" });
      return false;
    } else if (pod.Description.length <= 20) {
      showAlertMessage(`Description field invalid. Minimum 20 characters required`, { variant: "error" });
      return false;
      // } else if (pod.IsInvesting && (!pod.TokenName || pod.TokenName === "" || pod.TokenName.length < 5)) {
      //   showAlertMessage(`Token Name field invalid. Minimum 5 characters required`, { variant: "error" });
      //   return false;
      // } else if (
      //   pod.IsInvesting &&
      //   (!pod.TokenSymbol || pod.TokenSymbol === "" || pod.TokenSymbol.length < 3 || pod.TokenSymbol > 6)
      // ) {
      //   showAlertMessage(`Token ID field invalid. Between 3 and 6 characters required`, { variant: "error" });
      //   return false;
      // } else if (pod.IsInvesting && (!pod.TokenDescription || pod.TokenDescription === "")) {
      //   showAlertMessage(`Token description field invalid`, { variant: "error" });
      //   return false;
      // } else if (pod.IsInvesting && (!pod.FundingToken || pod.FundingToken === "")) {
      //   showAlertMessage(`Funding Token field invalid`, { variant: "error" });
      //   return false;
      // } else if (pod.IsInvesting && (!pod.Spread || pod.Spread === "")) {
      //   showAlertMessage(`Trading Spread field invalid`, { variant: "error" });
      //   return false;
      // } else if (pod.IsInvesting && !pod.FundingTokenPrice) {
      //   showAlertMessage(`Funding Price field invalid. Value must be greater than 0`, { variant: "error" });
      //   return false;
      // } else if (pod.IsInvesting && !pod.MaxSupply) {
      //   showAlertMessage(`Maximum Supply field invalid`, { variant: "error" });
      //   return false;
      // } else if (pod.IsInvesting && (!pod.FundingTarget || pod.FundingTarget === "")) {
      //   showAlertMessage(`Funding Target Supply field invalid`, { variant: "error" });
      //   return false;
      // }
      // else if (pod.IsInvesting && !pod.InvestorDividend) {
      //   showAlertMessage(`Investor Share field invalid`, { variant: "error" });
      //   return false;
      // }
      // else if (pod.IsInvesting && (!pod.AMM || pod.AMM === "")) {
      //   showAlertMessage(`AMM field invalid`, { variant: "error" });
      //   return false;
      // } else if (pod.MaxPrice && (!pod.MaxPrice || pod.MaxPrice === "")) {
      //   showAlertMessage(`Maximum Price invalid`, { variant: "error" });
      //   return false;
    } else return true;
  };

  // const validateNFTMediaInfo = async () => {
  //   if (pod.Name.length <= 5) {
  //     showAlertMessage(`Name field invalid. Minimum 5 characters required`, { variant: "error" });
  //     return false;
  //   } else if (pod.Description.length <= 20) {
  //     showAlertMessage(`Description field invalid. Minimum 20 characters required`, { variant: "error" });
  //     return false;
  //   } else return true;
  // };

  // const savePod = async () => {
  //   let validation = await validateNFTMediaInfo();
  //   if (validation) {
  //     // constructing body
  //     let body = { ...pod }; // copy from community
  //     body.MainHashtag = pod.Hashtags.length > 0 ? pod.Hashtags[0] : "";
  //     body.Creator = userSelector.id;

  //     body.HasPhoto = !!(photo || photoImg);

  //     axios
  //       .post(`${URL()}/pod/NFT/saveMediaPod`, body)
  //       .then(async response => {
  //         const resp = response.data;
  //         if (resp.success) {
  //           if (photo || tokenPhoto) {
  //             await uploadImageWIP(resp.data.nftPodId, pod.TokenSymbol);
  //           }

  //           setTimeout(() => {
  //             props.handleRefresh();
  //             props.onClose();
  //           }, 1000);
  //         } else {
  //           showAlertMessage(`Error when making the request`, { variant: "error" });
  //         }
  //         showAlertMessage(`Pod saved!`, { variant: "success" });
  //       })
  //       .catch(error => {
  //         showAlertMessage(`Error when making the request`, { variant: "error" });
  //       });
  //   }
  // };

  //photo functions
  const uploadImage = async imageId => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", photo, imageId);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      if (photo) {
        axios
          .post(`${URL()}/musicDao/changeMediaPodPhoto`, formData, config)
          .then(response => {
            resolve(true);
          })
          .catch(error => {
            resolve(true);
            // alert("Error uploading photo");
          });
      }

      // if (tokenSymbol && tokenSymbol !== "" && tokenPhoto) {
      //   //change token photo (if creating token aswell)
      //   const formTokenData = new FormData();
      //   if (tokenPhoto) {
      //     formTokenData.append("image", tokenPhoto, tokenSymbol);
      //   } else {
      //     formTokenData.append("image", photo, tokenSymbol);
      //   }
      //   axios
      //     .post(`${URL()}/wallet/changeTokenPhoto`, formTokenData, config)
      //     .then(response => {
      //       let body = { dimensions: pod.tokenDimensions ?? pod.dimensions, id: tokenSymbol };
      //       axios.post(`${URL()}/wallet/updateTokenPhotoDimensions`, body).catch(error => {
      //         console.log(error);

      //         alert("Error uploading photo");
      //       });
      //       resolve(true);
      //     })
      //     .catch(error => {
      //       console.log(error);
      //       resolve(true);
      //       // alert("Error uploading token photo");
      //     });
      // }
    });
  };

  //photo functions
  // const uploadImageWIP = async (id, tokenSymbol) => {
  //   return new Promise((resolve, reject) => {
  //     const config = {
  //       headers: {
  //         "content-type": "multipart/form-data",
  //       },
  //     };
  //     if (photo) {
  //       const formData = new FormData();
  //       formData.append("image", photo, id);
  //       axios
  //         .post(`${URL()}/pod/WIP/changePhoto`, formData, config)
  //         .then(response => {
  //           resolve(true);
  //         })
  //         .catch(error => {
  //           console.log(error);

  //           resolve(true);
  //           // alert("Error uploading photo");
  //         });
  //     }
  //     if (tokenPhoto) {
  //       //change token photo (if creating token aswell)
  //       const formTokenData = new FormData();
  //       formTokenData.append("image", tokenPhoto, id);
  //       axios
  //         .post(`${URL()}/pod/WIP/changePhotoToken`, formTokenData, config)
  //         .then(response => {
  //           resolve(true);
  //         })
  //         .catch(error => {
  //           console.log(error);
  //           resolve(true);
  //           // alert("Error uploading token photo");
  //         });
  //     }
  //   });
  // };

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
      style={{
        maxWidth: acceptWarning ? "755px" : "653px",
        padding: acceptWarning
          ? isMobile
            ? "32px 12px 50px"
            : "32px 39px 50px"
          : isMobile
          ? "20px 22px 63px"
          : "20px 58px 63px",
      }}
    >
      {/* <SignatureRequestModal
        open={openSignRequestModal}
        address={userSelector.address}
        transactionFee="0.0000"
        detail={signRequestModalDetail}
        handleOk={createPod}
        handleClose={() => setOpenSignRequestModal(false)}
      /> */}
      <div>
        {!acceptWarning ? (
          <div className={classes.warningScreen}>
            <img src={require("assets/musicDAOImages/pod-modal-logo.png")} width="120px" alt={"music pod"} />
            <h3>Create a Music Pod</h3>
            <p>
              A pod is a collection of medias that can can be fundraised and investable. In this process you
              will create the Pod’s general characteristics and plan all the media it will contain.
            </p>
            <div className={classes.warningContainer}>
              <WarningIcon />
            </div>
            <p>
              Keep in mind that this collection is a Smart Contract.
              <br />
              Once you’ve created the media planning for your collection{" "}
              <b>you wont be able to change it in the future!</b>
            </p>
            <PrimaryButton size="medium" onClick={() => setAcceptWarning(true)}>
              Continue
            </PrimaryButton>
          </div>
        ) : (
          <div className={classes.modalContent}>
            <div className={classes.cardsOptions}>
              <div
                onClick={() => setTabCreateNFTMedia(0)}
                className={cls(
                  { [classes.tabHeaderPodMediaSelected]: tabCreateNFTMedia === 0 },
                  classes.tabHeaderPodMedia
                )}
              >
                General
              </div>
              <div
                className={cls(
                  { [classes.tabHeaderPodMediaSelected]: tabCreateNFTMedia === 1 },
                  classes.tabHeaderPodMedia
                )}
                onClick={() => setTabCreateNFTMedia(1)}
              >
                Collabs
              </div>
              {/* <div
                className={cls(
                  { [classes.tabHeaderPodMediaSelected]: tabCreateNFTMedia === 2 },
                  classes.tabHeaderPodMedia
                )}
                onClick={() => setTabCreateNFTMedia(2)}
              >
                Songs
              </div>
              <div
                className={cls(
                  { [classes.tabHeaderPodMediaSelected]: tabCreateNFTMedia === 3 },
                  classes.tabHeaderPodMedia
                )}
                onClick={() => setTabCreateNFTMedia(3)}
              >
                Tokenomics
              </div> */}
            </div>
            {pod && (
              <>
                <div style={{ display: tabCreateNFTMedia === 0 ? "block" : "none" }}>
                  <div className={classes.headerCreatePod}>Create Music Collection</div>
                  <GeneralNFTMediaTab
                    pod={pod}
                    setPod={nv => setPod(nv)}
                    setPhoto={nv => setPhoto(nv)}
                    photo={photo}
                    setPhotoImg={nv => setPhotoImg(nv)}
                    photoImg={photoImg}
                    creation={true}
                    isCreator={pod.Creator === userSelector.id}
                    next={() => setTabCreateNFTMedia(1)}
                  />
                </div>
                <div style={{ display: tabCreateNFTMedia === 1 ? "block" : "none" }}>
                  <div className={classes.headerCreatePod}>Select Artists to collab with</div>
                  <CollabsTab pod={pod} setPod={nv => setPod(nv)} />
                </div>
                {/* <div style={{ display: tabCreateNFTMedia === 2 ? "block" : "none" }}>
                  <div className={classes.headerCreatePod}>Plan Music Collection</div>
                  <SongsTab pod={pod} setPod={nv => setPod(nv)} />
                </div>
                <div style={{ display: tabCreateNFTMedia === 3 ? "block" : "none" }}>
                  <AssistanceNFTMediaTab pod={pod} setPod={setPod} tokenObjList={tokenObjList} creation />
                  {!pod.AssistanceRequired && (
                    <TokenomicsNFTMediaTab
                      pod={pod}
                      setPod={setPod}
                      handleOpenSignatureModal={handleOpenSignatureModal}
                      setTokenPhoto={nv => setTokenPhoto(nv)}
                      tokenPhoto={tokenPhoto}
                      setTokenPhotoImg={nv => setTokenPhotoImg(nv)}
                      tokenPhotoImg={tokenPhotoImg}
                      isCreator={false}
                      creation
                      tokenObjList={tokenObjList}
                    />
                  )}
                </div> */}
                <Box display="flex" alignItems="center" className={classes.buttons}>
                  <SecondaryButton
                    onClick={() => {
                      if (tabCreateNFTMedia !== 0) {
                        setTabCreateNFTMedia(tabCreateNFTMedia - 1);
                      } else {
                        props.onClose();
                      }
                    }}
                    size="medium"
                  >
                    {tabCreateNFTMedia !== 0 ? "Back" : "Cancel"}
                  </SecondaryButton>

                  {isLoading ? (
                    <CircularLoadingIndicator />
                  ) : (
                    <PrimaryButton
                      onClick={() => {
                        if (tabCreateNFTMedia !== 1) {
                          setTabCreateNFTMedia(tabCreateNFTMedia + 1);
                          // } else if (pod.IsInvesting) {
                          //   handleOpenSignatureModal();
                        } else {
                          createPod();
                        }
                      }}
                      size="medium"
                      style={{ width: "40%" }}
                    >
                      {tabCreateNFTMedia === 1 ? "Create" : "Next"}
                    </PrimaryButton>
                  )}
                </Box>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CreatePodModal;

const WarningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19.4556 16.7688L11.2243 1.69656C11.1043 1.48093 10.9365 1.28875 10.72 1.16875C10.5043 1.04875 10.2643 0.976562 10.0243 0.976562C9.78434 0.976562 9.54434 1.04875 9.32873 1.16875C9.11311 1.28875 8.94434 1.48094 8.82434 1.69656L0.592103 16.7688C0.352103 17.2244 0.352103 17.681 0.616477 18.1132C0.736477 18.3288 0.904285 18.641 1.12086 18.761C1.33649 18.881 1.55305 19.0966 1.79305 19.0966H18.2575C18.4975 19.0966 18.7375 18.881 18.9297 18.761C19.1453 18.641 19.3141 18.401 19.4341 18.1854C19.6957 17.7532 19.6957 17.2254 19.4557 16.7688L19.4556 16.7688ZM8.5601 7.79328C8.5601 7.04889 9.13572 6.44889 9.8801 6.44889C10.6245 6.44889 11.2001 7.04889 11.2001 7.79328V11.8255C11.2001 12.5699 10.6245 13.1699 9.8801 13.1699C9.13572 13.169 8.5601 12.569 8.5601 11.8255V7.79328ZM10.0479 16.5768C9.30353 16.5768 8.70353 15.9768 8.70353 15.2324C8.70353 14.488 9.30353 13.888 10.0479 13.888C10.7923 13.888 11.3923 14.488 11.3923 15.2324C11.3923 15.9768 10.7923 16.5768 10.0479 16.5768Z"
      fill="#FF8E3C"
    />
  </svg>
);
