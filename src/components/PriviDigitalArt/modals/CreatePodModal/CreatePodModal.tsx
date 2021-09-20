import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import cls from "classnames";

import { RootState } from "store/reducers/Reducer";
import { getCryptosRateAsList } from "shared/services/API";
import URL from "shared/functions/getURL";
import { updateTask } from "shared/functions/updateTask";
// import { buildJsxFromObject } from "shared/functions/commonFunctions";
// import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { IInitiatePodMedias, IInitiatePod, initiatePod, initiatePodForSubstrate } from "shared/services/API";
import { BlockchainNets } from "shared/constants/constants";
import { useSubstrate } from "shared/connectors/substrate";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import Box from "shared/ui-kit/Box";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { ReactComponent as WarningIcon } from "assets/icons/warning_triangle_fill.svg";

import { createPodModalStyles } from "./CreatePodModal.styles";
import GeneralNFTMediaTab from "./components/GeneralNFTMediaTab/GeneralNFTMediaTab";
import AssistanceNFTMediaTab from "./components/AssistanceNFTMediaTab/AssistanceNFTMediaTab";
import TokenomicsNFTMediaTab from "./components/TokenomicsNFTMediaTab/TokenomicsNFTMediaTab";
import CollabsTab from "./components/CollabsTab/CollabsTab";
import NFTTab from "./components/NFTTab";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";

const startDate = Math.floor(Date.now() / 1000 + 3600 * 24 * 7); // one week later
const dateExpiration = Math.floor(Date.now() / 1000 + 3600 * 24 * 180); // half year later

interface ValidationErrorType {
  tab: "GENERAL" | "COLLABS" | "NFTS" | "TOKENOMICS";
  invalidField: string;
}

const CreatePodModal = (props: any) => {
  const classes = createPodModalStyles();
  const { showAlertMessage } = useAlertMessage();
  const userSelector = useSelector((state: RootState) => state.user);

  const [tabCreateNFTMedia, setTabCreateNFTMedia] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [pod, setPod] = useState<any>({
    TokenName: "",
    TokenSymbol: "",
    IsInvesting: true,
    AMM: "Quadratic",
    Spread: "",
    FundingTokenPrice: "",
    MaxPrice: "",
    FundingToken: "USDT",
    FundingDate: startDate,
    FundingTarget: "",
    InvestorDividend: "",
    MaxSupply: "",
    DateExpiration: dateExpiration,
    Medias: [],
    Hashtags: [],
    Collabs: [],

    AssistanceRequired: false,
    Name: "",
    Description: "",
    Offers: [],
    OpenAdvertising: false,
    RuleBased: false,
    Network: BlockchainNets[1].name, //default Polygon chain
    SharingPercent: "",
  });
  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);

  const [tokenPhoto, setTokenPhoto] = useState<any>(null);
  const [tokenPhotoImg, setTokenPhotoImg] = useState<any>(null);

  const [tokenObjList, setTokenObjList] = useState<any[]>([]);

  const [acceptWarning, setAcceptWarning] = useState(false);

  const payloadRef = useRef<any>({});
  const modalTabs = {
    GENERAL: 0,
    COLLABS: 1,
    NFTS: 2,
    TOKENOMICS: 3,
  };
  const [validationError, setValidationError] = useState<ValidationErrorType>({
    tab: "GENERAL",
    invalidField: "",
  });
  // const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  // const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const { api, keyring, keyringState } = useSubstrate();
  // default add creator as collaborator
  useEffect(() => {
    if (userSelector.address && !pod.Collabs.find(u => u.address == userSelector.address))
      pod.Collabs.push({
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
    if (pod && pod.id && pod.HasPhotoToken) {
      setTokenPhotoImg(`${pod.UrlToken}?${Date.now()}`);
    }
  }, [pod.id, pod.HasPhoto, pod.HasPhotoToken]);

  // get token list from backend
  useEffect(() => {
    if (tokenObjList.length === 0 && props.open) {
      getCryptosRateAsList().then(data => {
        const tknObjList: any[] = [];
        data.forEach(rateObj => {
          tknObjList.push({ token: rateObj.token, name: rateObj.name });
        });
        setTokenObjList(tknObjList);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open]);

  const handleOpenSignatureModal = () => {
    if (validateNFTMediaInfoCreate()) {
      let podInfo: any = {};
      if (pod.IsInvesting)
        podInfo = {
          Creator: userSelector.address,
          TokenName: pod.TokenName,
          TokenSymbol: pod.TokenSymbol,
          IsInvesting: pod.IsInvesting,
          AMM: pod.AMM.toUpperCase(),
          Spread: pod.Spread / 100,
          FundingTokenPrice: +pod.FundingTokenPrice,
          MaxPrice: +pod.MaxPrice,
          FundingToken: pod.FundingToken,
          FundingDate: +pod.FundingDate,
          FundingTarget: +pod.FundingTarget,
          InvestorDividend: +pod.InvestorDividend ?? 0 / 100,
          MaxSupply: +pod.MaxSupply,
          DateExpiration: +pod.DateExpiration,
          Collabs: (pod.Collabs ?? []).map(user => user.address),
        };
      const medias: IInitiatePodMedias[] = [];
      const filteredMedias = pod.Medias.filter(m => m.Title !== "");
      for (let media of filteredMedias) {
        medias.push({
          MediaName: media.Title,
          MediaSymbol: media.Title.replace(/\s/g, ""),
          Type: "DIGITAL_ART_TYPE",
          ReleaseDate: 0,
        });
      }
      const payload: IInitiatePod = {
        PodInfo: podInfo,
        Medias: medias,
      };
      payloadRef.current = payload;
      // setSignRequestModalDetail(buildJsxFromObject(payload));
      // setOpenSignRequestModal(true);
      createPod();
    }
  };

  const afterCreatePod = async podRes => {
    if (podRes.success) {
      const podId = podRes.data;
      if (photo || tokenPhoto) {
        await uploadImage(podId, pod.TokenSymbol);
      }
      await updateTask(userSelector.id, "Create a Pod");
      props.handleRefresh();
      props.handleClose();
      showAlertMessage(`Pod created!`, { variant: "success" });
    } else showAlertMessage(`Error when making the request`, { variant: "error" });
  };

  const createPod = async () => {
    try {
      if (validateNFTMediaInfoCreate()) {
        // payload
        const podInfo = {
          Creator: userSelector.address,
          TokenName: pod.TokenName,
          TokenSymbol: pod.TokenSymbol,
          IsInvesting: pod.IsInvesting,
          AMM: pod.AMM.toUpperCase(),
          Spread: pod.Spread / 100,
          FundingTokenPrice: +pod.FundingTokenPrice,
          MaxPrice: +pod.MaxPrice,
          FundingToken: pod.FundingToken,
          FundingDate: +pod.FundingDate,
          FundingTarget: +pod.FundingTarget,
          InvestorDividend: +pod.InvestorDividend ?? 0 / 100,
          MaxSupply: +pod.MaxSupply,
          DateExpiration: +pod.DateExpiration,
          Collabs: (pod.Collabs ?? []).map(user => user.address),
        };
        const medias: IInitiatePodMedias[] = [];
        const filteredMedias = pod.Medias.filter(m => m.Title !== "");
        for (let media of filteredMedias) {
          medias.push({
            MediaName: media.Title,
            MediaSymbol: media.Title.replace(/\s/g, ""),
            Type: "DIGITAL_ART_TYPE",
            ReleaseDate: 0,
          });
        }
        const payload: IInitiatePod = {
          PodInfo: podInfo,
          Medias: medias,
        };
        // additional info
        const additionalData: any = {};
        additionalData.Creator = userSelector.address;
        additionalData.Name = pod.Name;
        additionalData.Description = pod.Description;
        additionalData.SharingPercent = pod.SharingPercent;
        additionalData.OpenAdvertising = pod.OpenAdvertising;
        additionalData.Hashtags = pod.Hashtags;
        additionalData.MainHashtag = additionalData.Hashtags.length > 0 ? additionalData.Hashtags[0] : "";
        additionalData.HasPhoto = !!(photo || photoImg);
        additionalData.dimensions = pod.dimensions;
        additionalData.blockchainNetwork = pod.Network;
        const mediaInfo = {};
        pod.Medias.forEach(media => {
          mediaInfo[media.Title.replace(/\s/g, "")] = {
            Description: media.Description ?? "",
          };
        });
        additionalData.MediaInfo = mediaInfo;
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
        // Create Media Pod on Privi Chain
        // else {
        setLoading(true);
        const initiatePodRes = await initiatePod(userSelector.address, payload, additionalData);
        afterCreatePod(initiatePodRes);
        setLoading(false);
        // }
      }
    } catch (e) {
      showAlertMessage(e.message, { variant: "error" });
      setLoading(false);
    }
  };

  const validateNFTMediaInfoCreate = () => {
    if (pod.Name.length <= 5) {
      setTabCreateNFTMedia(modalTabs.GENERAL);
      showAlertMessage(`Name field invalid. Minimum 5 characters required`, { variant: "error" });
      setValidationError({
        tab: "GENERAL",
        invalidField: "name",
      });
      return false;
    } else if (pod.Description.length <= 20) {
      setTabCreateNFTMedia(modalTabs.GENERAL);
      showAlertMessage(`Description field invalid. Minimum 20 characters required`, { variant: "error" });
      setValidationError({
        tab: "GENERAL",
        invalidField: "description",
      });
      return false;
    } else if (pod.IsInvesting && (!pod.TokenName || pod.TokenName === "" || pod.TokenName.length < 5)) {
      setTabCreateNFTMedia(modalTabs.TOKENOMICS);
      showAlertMessage(`Token Name field invalid. Minimum 5 characters required`, { variant: "error" });
      setValidationError({
        tab: "TOKENOMICS",
        invalidField: "tokenName",
      });
      return false;
    } else if (
      pod.IsInvesting &&
      (!pod.TokenSymbol || pod.TokenSymbol === "" || pod.TokenSymbol.length < 3 || pod.TokenSymbol > 6)
    ) {
      setTabCreateNFTMedia(modalTabs.TOKENOMICS);
      showAlertMessage(`Token ID field invalid. Between 3 and 6 characters required`, { variant: "error" });
      setValidationError({
        tab: "TOKENOMICS",
        invalidField: "tokenSymbol",
      });
      return false;
    } else if (pod.IsInvesting && (!pod.TokenDescription || pod.TokenDescription === "")) {
      setTabCreateNFTMedia(modalTabs.TOKENOMICS);
      showAlertMessage(`Token description field invalid`, { variant: "error" });
      setValidationError({
        tab: "TOKENOMICS",
        invalidField: "tokenDescription",
      });
      return false;
    } else if (pod.IsInvesting && (!pod.FundingToken || pod.FundingToken === "")) {
      setTabCreateNFTMedia(modalTabs.TOKENOMICS);
      showAlertMessage(`Funding Token field invalid`, { variant: "error" });
      setValidationError({
        tab: "TOKENOMICS",
        invalidField: "fundingToken",
      });
      return false;
    } else if (pod.IsInvesting && (!pod.Spread || pod.Spread === "")) {
      setTabCreateNFTMedia(modalTabs.TOKENOMICS);
      showAlertMessage(`Trading Spread field invalid`, { variant: "error" });
      setValidationError({
        tab: "TOKENOMICS",
        invalidField: "spreadToken",
      });
      return false;
    } else if (pod.IsInvesting && !pod.FundingTokenPrice) {
      setTabCreateNFTMedia(modalTabs.TOKENOMICS);
      showAlertMessage(`Funding Price field invalid. Value must be greater than 0`, { variant: "error" });
      setValidationError({
        tab: "TOKENOMICS",
        invalidField: "fundingPrice",
      });
      return false;
    } else if (pod.IsInvesting && !pod.MaxSupply) {
      setTabCreateNFTMedia(modalTabs.TOKENOMICS);
      showAlertMessage(`Maximum Supply field invalid`, { variant: "error" });
      setValidationError({
        tab: "TOKENOMICS",
        invalidField: "maximumSupply",
      });
      return false;
    } else if (pod.IsInvesting && (!pod.FundingTarget || pod.FundingTarget === "")) {
      setTabCreateNFTMedia(modalTabs.TOKENOMICS);
      showAlertMessage(`Funding Target Supply field invalid`, { variant: "error" });
      setValidationError({
        tab: "TOKENOMICS",
        invalidField: "targetSupply",
      });
      return false;
    } else if (pod.IsInvesting && pod.InvestorDividend == undefined) {
      setTabCreateNFTMedia(modalTabs.TOKENOMICS);
      showAlertMessage(`Investor Share field invalid`, { variant: "error" });
      setValidationError({
        tab: "TOKENOMICS",
        invalidField: "shareField",
      });
      return false;
    } else if (pod.IsInvesting && (!pod.AMM || pod.AMM === "")) {
      setTabCreateNFTMedia(modalTabs.TOKENOMICS);
      showAlertMessage(`AMM field invalid`, { variant: "error" });
      setValidationError({
        tab: "TOKENOMICS",
        invalidField: "ammField",
      });
      return false;
    } else if (pod.MaxPrice && (!pod.MaxPrice || pod.MaxPrice === "")) {
      setTabCreateNFTMedia(modalTabs.TOKENOMICS);
      showAlertMessage(`Maximum Price invalid`, { variant: "error" });
      setValidationError({
        tab: "TOKENOMICS",
        invalidField: "maxPrice",
      });
      return false;
    } else return true;
  };

  //photo functions
  const uploadImage = async (imageId, tokenSymbol) => {
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
          .post(`${URL()}/mediaPod/changeMediaPodPhoto`, formData, config)
          .then(response => {
            resolve(true);
          })
          .catch(error => {
            resolve(true);
          });
      }
      if (pod.Medias[0]?.Photo) {
        const mediasFormData = new FormData();
        mediasFormData.append("image", pod.Medias[0]?.Photo, imageId + " " + pod.Medias[0]?.Title);
        axios
          .post(`${URL()}/mediaPod/changeMediaPodMediasPhoto`, mediasFormData, config)
          .then(response => {
            resolve(true);
          })
          .catch(error => {
            resolve(true);
          });
      }

      if (tokenSymbol && tokenSymbol !== "" && tokenPhoto) {
        //change token photo (if creating token aswell)
        const formTokenData = new FormData();
        if (tokenPhoto) {
          formTokenData.append("image", tokenPhoto, tokenSymbol);
        } else {
          formTokenData.append("image", photo, tokenSymbol);
        }
        axios
          .post(`${URL()}/wallet/changeTokenPhoto`, formTokenData, config)
          .then(response => {
            let body = { dimensions: pod.tokenDimensions ?? pod.dimensions, id: tokenSymbol };
            axios.post(`${URL()}/wallet/updateTokenPhotoDimensions`, body).catch(error => {
              console.log(error);

              alert("Error uploading photo");
            });
            resolve(true);
          })
          .catch(error => {
            console.log(error);
            resolve(true);
            // alert("Error uploading token photo");
          });
      }
    });
  };

  return (
    <LoadingScreen
      loading={loading}
      title={`Transaction \nin progress`}
      subTitle={`Transaction is proceeding on ${pod.Network.replace(
        " Chain",
        ""
      )} Chain.\nThis can take a moment, please be patient...`}
      handleClose={props.handleClose}
    >
      <Modal
        size={"small"}
        isOpen={props.open}
        onClose={props.handleClose}
        showCloseIcon
        className={classes.root}
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
              <img src={require("assets/logos/privi-logo.png")} alt={""} />
              <h3>Create a NFT Pod</h3>
              <p>
                A pod is a collection of NFTs that can be fundraised and investable. In this process you will
                create the Pod’s general characteristics and plan all the media it will contain.
              </p>
              <div className={classes.warningContainer}>
                <WarningIcon />
              </div>
              <p>
                Keep in mind that this collection is a Smart Contract.
                <br />
                Once you’ve created the media planning for your collection you wont be able to change it in
                the future
              </p>
              <PrimaryButton
                className={classes.modalButton}
                size="medium"
                onClick={() => setAcceptWarning(true)}
              >
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
                <div
                  className={cls(
                    { [classes.tabHeaderPodMediaSelected]: tabCreateNFTMedia === 2 },
                    classes.tabHeaderPodMedia
                  )}
                  onClick={() => setTabCreateNFTMedia(2)}
                >
                  NFTs
                </div>
                <div
                  className={cls(
                    { [classes.tabHeaderPodMediaSelected]: tabCreateNFTMedia === 3 },
                    classes.tabHeaderPodMedia
                  )}
                  onClick={() => setTabCreateNFTMedia(3)}
                >
                  Tokenomics
                </div>
              </div>
              {pod && (
                <>
                  {tabCreateNFTMedia === 0 ? (
                    <div>
                      <div className={classes.headerCreatePod}>Create a NFT Collection</div>
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
                        validationError={validationError}
                      />
                    </div>
                  ) : tabCreateNFTMedia === 1 ? (
                    <div>
                      <div className={classes.headerCreatePod}>Select Artists to collab with</div>
                      <CollabsTab pod={pod} setPod={nv => setPod(nv)} />
                    </div>
                  ) : tabCreateNFTMedia === 2 ? (
                    <div>
                      <div className={classes.headerCreatePod}>Plan NFT Collection</div>
                      <NFTTab pod={pod} setPod={nv => setPod(nv)} />
                    </div>
                  ) : (
                    <div style={{ display: tabCreateNFTMedia === 3 ? "block" : "none" }}>
                      <AssistanceNFTMediaTab
                        pod={pod}
                        setPod={setPod}
                        tokenObjList={tokenObjList}
                        creation={true}
                      />
                      {!pod.AssistanceRequired && (
                        <TokenomicsNFTMediaTab
                          pod={pod}
                          setPod={setPod}
                          setTokenPhoto={setTokenPhoto}
                          tokenPhoto={tokenPhoto}
                          setTokenPhotoImg={setTokenPhotoImg}
                          tokenPhotoImg={tokenPhotoImg}
                          isCreator={false}
                          creation={true}
                          tokenObjList={tokenObjList}
                          validationError={validationError}
                        />
                      )}
                    </div>
                  )}
                  <Box display="flex" alignItems="center" className={classes.buttons}>
                    <SecondaryButton
                      onClick={() => {
                        if (tabCreateNFTMedia !== 0) {
                          setTabCreateNFTMedia(tabCreateNFTMedia - 1);
                        } else {
                          props.handleClose();
                        }
                      }}
                      size="small"
                      className={classes.modalButton}
                    >
                      {tabCreateNFTMedia !== 0 ? "Back" : "Cancel"}
                    </SecondaryButton>

                    <PrimaryButton
                      onClick={() => {
                        if (tabCreateNFTMedia == 0 && (!pod.Name || !pod.Description || !photoImg))
                          showAlertMessage("Some fields are missing", { variant: "error" });
                        else if (tabCreateNFTMedia == 2 && (!pod.Medias || !pod.Medias.length))
                          showAlertMessage("Please add some media by clicking 'Add NFT' button", {
                            variant: "error",
                          });
                        else if (tabCreateNFTMedia == 3) createPod();
                        else setTabCreateNFTMedia(tabCreateNFTMedia + 1);
                      }}
                      size="small"
                      className={classes.modalButton}
                    >
                      {tabCreateNFTMedia === 3
                        ? pod.IsInvesting
                          ? "Create Pod"
                          : "Save Pod as Work in Progress"
                        : "Next"}
                    </PrimaryButton>
                  </Box>
                </>
              )}
            </div>
          )}
        </div>
      </Modal>
    </LoadingScreen>
  );
};

export default CreatePodModal;
