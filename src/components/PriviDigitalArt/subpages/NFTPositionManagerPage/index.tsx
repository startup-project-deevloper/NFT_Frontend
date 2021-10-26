import React, { useState, useContext } from "react";
import { useSelector } from "react-redux";
import Axios from "axios";
import cls from "classnames";
import { useMediaQuery, useTheme } from "@material-ui/core";

import { useHistory, useLocation } from "react-router";
import Box from "shared/ui-kit/Box";
import DigitalArtContext from "shared/contexts/DigitalArtContext";
import { useNFTPositionManagerPageStyles } from "./index.styles";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import CollateralisedLoans from "./components/CollateralisedLoans";
import FractionalLoans from "./components/FractionalLoans";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { onGetNonDecrypt } from "shared/ipfs/get";
import URL from "shared/functions/getURL";
import { getUser } from "store/selectors";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";

const Tabs = ["collateralised loans", "Fractional  Loans"];

const NFTPositionManagerPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));

  const classes = useNFTPositionManagerPageStyles();
  const history = useHistory();
  const location: any = useLocation<Location>();
  const initTab = location.state?.tabId ?? 0;

  const { setOpenFilters } = useContext(DigitalArtContext);
  const userSelector = useSelector(getUser);
  const [selectedTab, setSelectedTab] = useState<number>(initTab);

  const [positions, setPositions] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  React.useEffect(() => {
    setOpenFilters(false);
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  const getImageIPFS = async (cid: string) => {
    let files = await onGetNonDecrypt(cid, (fileCID, download) =>
      downloadWithNonDecryption(fileCID, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.content);
      return "data:image/png;base64," + base64String;
    }
    return "";
  };

  React.useEffect(() => {
    if (userSelector?.id && ipfs) {
      loadData();
    }
  }, [userSelector, ipfs]);

  const loadData = () => {
    setIsDataLoading(true);
    Axios.get(
      `${URL()}/nftLoan/getUserNFTLoans/${userSelector.address}`
    )
      .then(async ({ data }) => {
        if (data.success) {
          const postionsData = await Promise.all(
            data.data?.map(async nft => {
              const cidUrl = nft.media?.cid ? await getImageIPFS(nft.media?.cid) : "";
              if (cidUrl) {
                nft.media["cidUrl"] = cidUrl;
              }
              return nft;
            })
          );
          setPositions(postionsData || []);
        }
      })
      .catch(e => {
        console.log(e);
      })
      .finally(() => {
        setIsDataLoading(false);
      });
  };

  return (
    <>
      <div className={classes.main}>
        <div className={classes.content}>
          <img src={require("assets/icons3d/vault.png")} alt="" className={classes.absoluteImage} />
          <Box pl={4}>
            <BackButton purple overrideFunction={() => history.push("/loan")} />
            <h2>✨ Manage Your Loans</h2>
          </Box>

          <Box
            mt={isMobile ? 5 : 7}
            width="100%"
            padding={isMobile ? "0 15px" : "0 42px"}
            style={{ borderBottom: "1px solid #431AB720" }}
          >
            <Box display="flex" width="100%">
              {Tabs.map((tab, index) => (
                <div
                  key={`tab-${index}`}
                  className={cls({ [classes.selectedTab]: index === selectedTab }, classes.tab)}
                  onClick={() => {
                    setSelectedTab(index);
                  }}
                >
                  {tab.toUpperCase()}
                </div>
              ))}
            </Box>
          </Box>

          {selectedTab === 0 && (
            <CollateralisedLoans positions={positions} isDataLoading={isDataLoading} loadData={loadData} />
          )}
          {selectedTab === 1 && <FractionalLoans />}
        </div>
      </div>
    </>
  );
};

export default React.memo(NFTPositionManagerPage);
