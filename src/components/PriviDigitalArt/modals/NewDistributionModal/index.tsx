import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import cls from "classnames";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import { useMediaQuery, useTheme } from "@material-ui/core";

import { RootState } from "store/reducers/Reducer";
import { getCryptosRateAsList, priviPodRegisterPodProposal } from "shared/services/API";
import { Modal, PrimaryButton, SecondaryButton, CircularLoadingIndicator } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import CopyRightFractionTab from "./components/CopyRightFractionTab";
import TokenomicsTab from "./components/TokenomicsTab";
import GeneralTab from "./components/GeneralTab";
import { newDistributionModalStyles } from "./index.styles";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import useIPFS from "../../../../shared/utils-IPFS/useIPFS";
import { _arrayBufferToBase64 } from "../../../../shared/functions/commonFunctions";
import { onUploadNonEncrypt } from "../../../../shared/ipfs/upload";
import TransactionProgressModal from "../TransactionProgressModal";

// const startDate = Math.floor(Date.now() / 1000 + 3600 * 24 * 7); // one week later
const startDate = Math.floor(Date.now() / 1000 + 3600 * 25); // 20 mins later

export default function NewDistributionModal(props: any) {
  const userSelector = useSelector((state: RootState) => state.user);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [tabCreateNFTMedia, setTabCreateNFTMedia] = useState<number>(0);
  const [pod, setPod] = useState<any>({ ...props.pod, FundingDate: startDate, TokenDescription: "" });
  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);

  const [tokenPhoto, setTokenPhoto] = useState<any>(null);
  const [tokenPhotoImg, setTokenPhotoImg] = useState<any>(null);
  const [tokenObjList, setTokenObjList] = useState<any[]>([]);
  const [acceptWarning, setAcceptWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const classes = newDistributionModalStyles({ acceptWarning });

  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();

  const [hash, setHash] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(false);

  const { ipfs, setMultiAddr, uploadWithNonEncryption } = useIPFS();

  const [imageIPFSTokenPhoto, setImageIPFSTokenPhoto] = useState({});

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    if (ipfs  && tokenPhoto) {
      uploadPhoto();
    }
  }, [tokenPhoto, ipfs]);

  const uploadPhoto = async () => {
    let infoImage = await onUploadNonEncrypt(tokenPhoto, file => uploadWithNonEncryption(file));
    setImageIPFSTokenPhoto(infoImage);
  };

  useEffect(() => {
    if (pod && pod.id && pod.HasPhoto) {
      setPhotoImg(`${pod.Url}?${Date.now()}`);
    }
    // if (pod && pod.id && pod.HasPhotoToken) {
    //   setTokenPhotoImg(`${pod.UrlToken}?${Date.now()}`);
    // }
  }, [pod.id, pod.HasPhoto]);

  // get token list from backend
  useEffect(() => {
    if (tokenObjList.length === 0 && props.open) {
      getCryptosRateAsList().then(data => {
        const tknObjList: any[] = [];
        data.forEach(rateObj => {
          tknObjList.push({ token: rateObj.token, name: rateObj.name });
        });
        setTokenObjList(tknObjList.filter(item => item.token === "USDT"));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open]);

  const validateForm = () => {
    if (!pod.Medias || pod.Medias.length === 0) {
      showAlertMessage(`Minimum one song required`, { variant: "error" });
      return false;
    } else if (!pod.TokenName || pod.TokenName === "" || pod.TokenName.length < 5) {
      showAlertMessage(`Token Name field invalid. Minimum 5 characters required`, { variant: "error" });
      return false;
    } else if (
      !pod.TokenSymbol ||
      pod.TokenSymbol === "" ||
      pod.TokenSymbol.length < 3 ||
      pod.TokenSymbol > 6
    ) {
      showAlertMessage(`Token ID field invalid. Between 3 and 6 characters required`, { variant: "error" });
      return false;
    } else if (!pod.FundingToken || pod.FundingToken === "") {
      showAlertMessage(`Funding Token field invalid`, { variant: "error" });
      return false;
    } else if (!pod.FundingTarget || pod.FundingTarget <= 0) {
      showAlertMessage(`Funding Target Supply field invalid. Value must be greater than 0`, {
        variant: "error",
      });
      return false;
    } else if (!pod.Royalty || pod.Royalty < 0 || pod.Royalty > 100) {
      showAlertMessage(`Royalty Share field invalid. Value must be between 0 and 100.`, {
        variant: "error",
      });
      return false;
    } else if (!pod.InvestorShare || pod.InvestorShare < 0 || pod.InvestorShare > 100) {
      showAlertMessage(`Investor Share field invalid. Value must be between 0 and 100.`, {
        variant: "error",
      });
      return false;
    } else if (!pod.SharingPercentage || pod.SharingPercentage < 0 || pod.SharingPercentage > 100) {
      showAlertMessage(`Sharing Percentage field invalid. Value must be between 0 and 100.`, {
        variant: "error",
      });
      return false;
    } else if (!pod.FundingPrice || pod.FundingPrice <= 0) {
      showAlertMessage(`Funding Price field invalid. Value must be greater than 0`, { variant: "error" });
      return false;
    } else {
      const creatorsSum = pod.CreatorsData?.map((e: any) => Number(e.sharingPercent ?? 0)).reduce(
        (a: number, b: number) => a + b,
        0
      );
      if (creatorsSum + Number(pod.CopyrightInvestorShare ?? 0) !== 100) {
        showAlertMessage(`All distribution share sum percentage should be 100%`, { variant: "error" });
        return false;
      }
      return true;
    }
  };

  const handleRegisterProposal = React.useCallback(() => {
    (async () => {
      if (validateForm()) {
        setIsLoading(true);
        setOpenTransactionModal(true);

        const targetChain = BlockchainNets.find(net => net.value === pod.blockchainNetwork);
        if (chainId && chainId !== targetChain?.chainId) {
          const isHere = await switchNetwork(targetChain?.chainId || 0);
          if (!isHere) {
            showAlertMessage("Got failed while switching over to target netowrk", { variant: "error" });
            return;
          }
        }

        const web3APIHandler = targetChain.apiHandler;
        const web3 = new Web3(library.provider);

        web3APIHandler.PodManager.registerPodProposal(web3, account!, pod, setHash).then(async resp => {
          if (resp) {
            setTransactionSuccess(true);

            await priviPodRegisterPodProposal({
              podId: props.podId,
              proposal: {
                Id: resp.data.id,
                Medias: pod.Medias.map(media => ({
                  Title: media.Title,
                  Genre: media.Genre,
                  InfoImage: media.InfoImage,
                })),
                TokenName: pod.TokenName,
                TokenSymbol: pod.TokenSymbol,
                TokenDescription: pod.TokenDescription,
                TokenInfoImage: imageIPFSTokenPhoto || null,
                CopyRightSupply: pod.CopyRightSupply,
                CopyRightAllocation: pod.CreatorsData.map(data => data.sharingPercent),
                CopyRightSymbol: pod.CopyRightSymbol,
                CopyrightInvestorShare: pod.CopyrightInvestorShare,
                Royalty: pod.Royalty,
                FundingToken: pod.FundingToken,
                FundingPrice: pod.FundingPrice,
                FundingTarget: pod.FundingTarget,
                FundingDate: pod.FundingDate,
                Proposer: userSelector.id,
                InvestorShare: pod.InvestorShare,
                SharingPercentage: pod.SharingPercentage,
              },
              type: "PIX",
            });
            props.handleRefresh();
            props.onClose();
            setIsLoading(false);
          } else {
            setTransactionSuccess(false);

            showAlertMessage("Failed to create new distribution proposal. Please try again.", {
              variant: "error",
            });
            setIsLoading(false);
          }
        });
      }
    })();
  }, [pod, chainId]);

  return (
    <>
      {openTranactionModal ? (
        <TransactionProgressModal
          open={openTranactionModal}
          onClose={() => {
            setHash("");
            setTransactionSuccess(null);
            setOpenTransactionModal(false);
          }}
          txSuccess={transactionSuccess}
          hash={hash}
        />
      ) : (
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
          <div>
            {!acceptWarning ? (
              <div className={classes.warningScreen}>
                <Box fontSize={50} fontWeight={500}>
                  🤝
                </Box>
                <h3>Distribution Proposal</h3>
                <p>
                  In the next steps you will be claiming your share of <b>Claimable Song Name</b>. Since there
                  are other {pod && pod.Collabs ? pod.Collabs.length : 4} artists that are part of this pod
                  you have to decide and assign the percentage of the share that each one of you will receive.
                </p>
                <PrimaryButton size="medium" onClick={() => setAcceptWarning(true)}>
                  Ok, Let’s Do it
                </PrimaryButton>
                <span>I Have to Discuss With Artists First</span>
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
                    Tokenomics
                  </div>
                  <div
                    className={cls(
                      { [classes.tabHeaderPodMediaSelected]: tabCreateNFTMedia === 2 },
                      classes.tabHeaderPodMedia
                    )}
                    onClick={() => setTabCreateNFTMedia(2)}
                  >
                    Copyright Fractionalisation
                  </div>
                </div>
                {pod && (
                  <>
                    <div style={{ display: tabCreateNFTMedia === 0 ? "block" : "none" }}>
                      <div className={classes.headerCreatePod}>Create Music Collection</div>
                      <GeneralTab pod={pod} setPod={nv => setPod(nv)} />
                    </div>
                    <div style={{ display: tabCreateNFTMedia === 1 ? "block" : "none" }}>
                      <div className={classes.headerCreatePod}>Pod’s Token</div>
                      <TokenomicsTab
                        pod={pod}
                        setPod={setPod}
                        setTokenPhoto={nv => setTokenPhoto(nv)}
                        tokenPhoto={tokenPhoto}
                        setTokenPhotoImg={nv => setTokenPhotoImg(nv)}
                        tokenPhotoImg={tokenPhotoImg}
                        isCreator={false}
                        creation
                        tokenObjList={tokenObjList}
                      />
                    </div>
                    <div style={{ display: tabCreateNFTMedia === 2 ? "block" : "none" }}>
                      <div className={classes.headerCreatePod}>Copyright Fractionalisation</div>
                      <CopyRightFractionTab
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
                            if (tabCreateNFTMedia !== 2) {
                              setTabCreateNFTMedia(tabCreateNFTMedia + 1);
                            } else {
                              console.log(pod);
                              handleRegisterProposal();
                            }
                          }}
                          size="medium"
                          style={{ width: "40%" }}
                        >
                          {tabCreateNFTMedia === 2 ? "Done" : "Next"}
                        </PrimaryButton>
                      )}
                    </Box>
                  </>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
