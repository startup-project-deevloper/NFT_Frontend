import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import cls from "classnames";

import { useMediaQuery, useTheme } from "@material-ui/core";

import { RootState } from "store/reducers/Reducer";
import { updateTask } from "shared/functions/updateTask";
import { priviPodInitiatePod } from "shared/services/API";
import { BlockchainNets } from "shared/constants/constants";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { Modal, PrimaryButton, SecondaryButton, CircularLoadingIndicator } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import CollabsTab from "./components/CollabsTab/CollabsTab";
import GeneralNFTMediaTab from "./components/GeneralNFTMediaTab/GeneralNFTMediaTab";
import { createPodModalStyles } from "./CreatePodModal.styles";
import useIPFS from "../../../../shared/utils-IPFS/useIPFS";
import { onUploadNonEncrypt } from "../../../../shared/ipfs/upload";

const CreatePodModal = (props: any) => {
  const { showAlertMessage } = useAlertMessage();
  const userSelector = useSelector((state: RootState) => state.user);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [tabCreateNFTMedia, setTabCreateNFTMedia] = useState<number>(0);
  const [pod, setPod] = useState<any>({
    Collabs: [],
    Name: "",
    Description: "",
    Hashtags: [],
  });
  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);

  const [acceptWarning, setAcceptWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const classes = createPodModalStyles({ acceptWarning });

  const { chainId } = useWeb3React();

  const { ipfs, setMultiAddr, uploadWithNonEncryption } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

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
  }, [pod.id, pod.HasPhoto]);

  const afterCreatePod = async podRes => {
    if (podRes.success) {
      const podId = podRes.podId;

      await updateTask(userSelector.id, "Create a Pod");
      props.handleRefresh();
      props.onClose();
      showAlertMessage(`Pod created!`, { variant: "success" });
    } else showAlertMessage(`Error when making the request`, { variant: "error" });
  };

  const createPod = async () => {
    try {
      setIsLoading(true);
      if (validateNFTMediaInfoCreate()) {
        const payload: any = {};
        payload.name = pod.Name;
        payload.description = pod.Description;
        payload.imageUrl = "";
        payload.hashtags = [];
        payload.hasPhoto = !!(photo || photoImg);
        payload.collabs = (pod.Collabs ?? []).map(user => ({ userId: user.urlSlug, address: user.address }));
        payload.creatorAddress = userSelector.address;
        payload.creatorId = userSelector.id;
        payload.network =
          (chainId && BlockchainNets.find(net => net.chainId === chainId)?.value) || BlockchainNets[1].value;
        payload.podType = "PIX";

        let infoImage = await onUploadNonEncrypt(photo, file => uploadWithNonEncryption(file));

        payload.infoImage = infoImage;
        const initiatePodRes = await priviPodInitiatePod(payload);
        await afterCreatePod(initiatePodRes);
        setIsLoading(false);
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
    if (!pod.Name) {
      showAlertMessage(`Name field invalid.`, { variant: "error" });
      return false;
    } else if (!pod.Description) {
      showAlertMessage(`Description field invalid.`, { variant: "error" });
      return false;
    } else return true;
  };

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
      style={{
        maxWidth: "514px",
        padding: acceptWarning
          ? isMobile
            ? "22px 25px 32px"
            : "22px 25px 32px"
          : isMobile
          ? "26px 35px 46px"
          : "26px 35px 46px",
      }}
    >
      <div>
        {!acceptWarning ? (
          <div className={classes.warningScreen}>
            <img src={require("assets/pixImages/pod_modal_logo.svg")} width="120px" alt={"video pod"} />
            <h3>Create a Video Pod</h3>
            <p>
              A pod is a collection of songs that can be fundraised and investable. In this process you will
              create the Pod’s general characteristics and plan all the media it will contain.
            </p>
            <div className={classes.warningContainer}>
              <WarningIcon />
            </div>
            <p>
              Keep in mind that this collection is a Smart Contract.
              <br />
              Once you’ve created the media planning for your
              <br />
              collection you wont be able to change it in the future
            </p>
            <PrimaryButton size="medium" style={{ height: 40, width: "calc(100% - 24px)"}} onClick={() => setAcceptWarning(true)}>
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
            </div>
            {pod && (
              <>
                <div style={{ display: tabCreateNFTMedia === 0 ? "block" : "none" }}>
                  <div className={classes.headerCreatePod}>Create Video Collection</div>
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
                  <div className={classes.headerCreatePod}>Select artists to collab with</div>
                  <CollabsTab pod={pod} setPod={nv => setPod(nv)} />
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
                    style={{ height: 40, width: '44%' }}
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
                        } else {
                          createPod();
                        }
                      }}
                      size="medium"
                      style={{ height: 40, width: '51%' }}
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
