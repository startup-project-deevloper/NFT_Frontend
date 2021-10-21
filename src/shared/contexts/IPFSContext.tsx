import React, { createContext, useEffect, useContext, useState } from "react";
import { create as ipfsHttpClient, IPFSHTTPClient } from "ipfs-http-client";
import { saveAs } from "file-saver";
import { encryptFile, decryptContent, getBlob } from "shared/utils-IPFS/crypto";
import TimeLogger from "shared/utils-IPFS/TimeLogger";
import { sizeToString } from "shared/utils-IPFS/functions";
import getIPFSURL from "shared/functions/getIPFSURL";
import FileUploadingModal from "shared/ui-kit/Modal/Modals/FileUploadingModal";

type IPFSContextType = {
  ipfs: IPFSHTTPClient | undefined;
  progress: any;
  setMultiAddr: any;
  isConnected: boolean;
  isIPFSAvailable: boolean | undefined;
  getFiles: any;
  uploadWithFileName: any;
  upload: any;
  uploadWithEncryption: any;
  uploadWithNonEncryption: any;
  downloadWithDecryption: any;
  downloadWithNonDecryption: any;
};

export const IPFSContext = createContext<IPFSContextType | null>(null);

export const IPFSContextProvider = ({ children }) => {
  const [ipfs, setIpfs] = useState<IPFSHTTPClient>();
  const [isConnected, setConnected] = useState(false);
  const [multiAddr, setMultiAddr] = useState<any>(getIPFSURL());

  const [showUploadingModal, setShowUploadingModal] = useState(false);
  const [progress, setProgress] = useState<any>(0);
  const [isUpload, setIsUpload] = useState(true);

  const isIPFSAvailable = React.useMemo(() => ipfs && isConnected, [ipfs, isConnected]);

  useEffect(() => {
    if (!multiAddr) return;
    if (multiAddr && ipfsHttpClient(multiAddr)) {
      setIpfs(ipfsHttpClient(multiAddr));
    }
    setConnected(true);
  }, [multiAddr]);

  const getFiles = async fileCID => {
    if (ipfs) {
      const files: any[] = [];
      for await (let file of ipfs.ls(fileCID)) {
        files.push(file);
      }
      return files;
    } else {
      return [];
    }
  };

  const uploadWithFileName = async file => {
    if (file) {
      setIsUpload(true);
      setShowUploadingModal(true);
      const fileDetails = {
        path: file && file.name ? file.name : "",
        content: file,
      };

      console.log("File size to Upload", sizeToString(file.size));
      const options = {
        wrapWithDirectory: true,
        progress: prog => {
          const value = ((100.0 * prog) / file.size).toFixed(0);
          setProgress(value);
          console.log(`IPFS Upload: ${value}%`);
        },
      };

      try {
        const added = await ipfs?.add(fileDetails, options);
        console.log("The File is Uploaded Successfully to IPFS");
        setShowUploadingModal(false);
        setProgress(0);
        return added;
      } catch (err) {
        setShowUploadingModal(false);
        setProgress(0);
        console.error(err);
      }
    }
  };

  const uploadWithEncryption = async file => {
    TimeLogger.start("Encryption");
    const result = await encryptFile(file);
    if (result) {
      const { resultBytes, keyData } = result;
      TimeLogger.end("Encryption");
      const newFile = new File([resultBytes], file.name + ".enc");
      let added = await uploadFile(newFile);
      return { added, newFile, keyData };
    }
  };

  const uploadWithNonEncryption = async file => {
    let added = await uploadFile(file);
    return { added };
  };

  const uploadFile = async file => {
    return new Promise(async (resolve, reject) => {
      TimeLogger.start("Upload2IPFS");
      const added = await uploadWithFileName(file);
      TimeLogger.end("Upload2IPFS");
      resolve(added);
    });
  };

  const downloadWithDecryption = async (fileCID, isEncrypted = false, keyData, download, peerNumber) => {
    const files = await getFiles(fileCID);
    for await (const file of files) {
      TimeLogger.start("DownloadFromIPFS");
      const ipfsPath = `/ipfs/${file.path}`;
      const chunks: any[] = [];
      for await (const chunk of ipfs?.cat(ipfsPath) || []) {
        chunks.push(Buffer.from(chunk));
      }
      let content: any = Buffer.concat(chunks);
      let fileName = file.name;
      TimeLogger.end("DownloadFromIPFS");

      if (isEncrypted) {
        TimeLogger.start("Decryption");
        content = await decryptContent(content, keyData);

        TimeLogger.end("Decryption");
        fileName = fileName.replace(".enc", "");
      }
      const blob = getBlob(content);
      if (download) {
        saveAs(blob, fileName);
      } else {
        return { blob, content };
      }
    }
  };

  const downloadWithNonDecryption = async (fileCID, download) => {
    const files = await getFiles(fileCID);
    for await (const file of files) {
      TimeLogger.start("DownloadFromIPFS");
      const ipfsPath = `/ipfs/${file.path}`;
      const chunks: any[] = [];
      for await (const chunk of ipfs?.cat(ipfsPath) || []) {
        chunks.push(Buffer.from(chunk));
      }
      let content = Buffer.concat(chunks);
      let fileName = file.name;
      TimeLogger.end("DownloadFromIPFS");
      const blob = getBlob(content);

      if (download) {
        saveAs(blob, fileName);
        return { blob, fileName, content };
      } else {
        return { blob, fileName, content };
      }
    }
  };

  const upload = async file => {
    try {
      setIsUpload(true);
      setShowUploadingModal(true);
      const added = await ipfs?.add(file, {
        progress: prog => {
          const value = ((100.0 * prog) / file.size).toFixed(0);
          setProgress(value);
          console.log(`IPFS Upload: ${value}%`);
        },
        pin: false,
      });
      console.log("IPFS Upload: 100%");
      setShowUploadingModal(false);
      setProgress(0);
      return added;
    } catch (err) {
      console.error(err);
      setShowUploadingModal(false);
      setProgress(0);
    }
  };

  const context: IPFSContextType = {
    ipfs,
    progress,
    setMultiAddr,
    isConnected,
    isIPFSAvailable,
    getFiles,
    uploadWithFileName,
    upload,
    uploadWithEncryption,
    uploadWithNonEncryption,
    downloadWithDecryption,
    downloadWithNonDecryption,
  };

  return (
    <IPFSContext.Provider value={context}>
      {children}
      {showUploadingModal && (
        <FileUploadingModal open={showUploadingModal} progress={progress} isUpload={isUpload} />
      )}
    </IPFSContext.Provider>
  );
};

export const useContextIPFS = () => {
  const context = useContext(IPFSContext);
  if (!context) {
    throw new Error("useContextIPFS hook must be used inside IPFSContextProvider");
  }

  return context;
};
