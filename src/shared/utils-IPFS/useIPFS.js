import { useState, useEffect } from "react";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { saveAs } from "file-saver";
import { encryptFile, decryptContent, getBlob } from "./crypto";
import TimeLogger from "./TimeLogger";
import { sizeToString } from "./functions";

const mapGatewayPeers = {
  1: 'https://peer1.ipfsprivi.com:8080',
  2: 'https://peer2.ipfsprivi.com:8080',
  3: 'https://peer3.ipfsprivi.com:8080',
  4: 'https://peer4.ipfsprivi.com:8080',
  5: 'https://peer5.ipfsprivi.com:8080',
  6: 'https://peer6.ipfsprivi.com:8080'
}

const useIPFS = () => {
  const [ipfs, setIpfs] = useState({});
  const [isConnected, setConnected] = useState(false);
  const [multiAddr, setMultiAddr] = useState("");

  useEffect(() => {
    if (!multiAddr) return;
    if(multiAddr && ipfsHttpClient(multiAddr)) {
      setIpfs(ipfsHttpClient(multiAddr));
    }
    setConnected(true);
  }, [multiAddr]);

  const getFiles = async (fileCID) => {
    if(ipfs && Object.keys(ipfs).length !== 0) {
      const files = [];
      for await (let file of ipfs.ls(fileCID)) {
        files.push(file);
      }
      return files;
    } else {
      return([]);
    }
  };

  const uploadWithFileName = async (file) => {
    const fileDetails = {
      path: file.name,
      content: file,
    };

    const options = {
      wrapWithDirectory: true,
      progress: (prog) => {},
    };

    try {
      const added = await ipfs.add(fileDetails, options);
      return added;
    } catch (err) {
      console.error(err);
    }
  };

  const uploadWithEncryption = async (file) => {
    TimeLogger.start("Encryption");
    const { resultBytes: encryptedBytes, keyData } = await encryptFile(file);
    TimeLogger.end("Encryption");
    const newFile = new File([encryptedBytes], file.name + ".enc");
    let added = await uploadFile(newFile);
    return { added, newFile, keyData };
  };

  const uploadWithNonEncryption = async (file) => {
    let added = await uploadFile(file);
    return { added }
  }

  const uploadFile = async (file) => {
    return new Promise(async (resolve, reject) => {
      TimeLogger.start("Upload2IPFS");
      const added = await uploadWithFileName(file);
      TimeLogger.end("Upload2IPFS");
      resolve(added);
    })
  };

  const downloadWithDecryption = async (fileCID, isEncrypted = false, keyData, download, peerNumber) => {
    // setMultiAddr(mapGatewayPeers[peerNumber || 1]);
    const files = await getFiles(fileCID);
    for await(const file of files) {
      TimeLogger.start("DownloadFromIPFS");
      const ipfsPath = `/ipfs/${file.path}`;
      const chunks = [];
      for await (const chunk of ipfs.cat(ipfsPath)) {
        chunks.push(Buffer.from(chunk));
      }
      let content = Buffer.concat(chunks);
      let fileName = file.name;
      TimeLogger.end("DownloadFromIPFS");

      if (isEncrypted) {
        TimeLogger.start("Decryption");
        content = await decryptContent(content, keyData);

        TimeLogger.end("Decryption");
        fileName = fileName.replace(".enc", "");
      }
      const blob = getBlob(content);
      if(download) {
        saveAs(blob, fileName);
      } else {
        return({blob, content})
      }
    };
  };

  const downloadWithNonDecryption = async (fileCID, download) => {
    // setMultiAddr(mapGatewayPeers[peerNumber]);
    const files = await getFiles(fileCID);
    for await(const file of files) {
      TimeLogger.start("DownloadFromIPFS");
      const ipfsPath = `/ipfs/${file.path}`;
      const chunks = [];
      for await (const chunk of ipfs.cat(ipfsPath)) {
        chunks.push(Buffer.from(chunk));
      }
      let content = Buffer.concat(chunks);
      let fileName = file.name;
      TimeLogger.end("DownloadFromIPFS");
      const blob = getBlob(content);

      if(download) {
        saveAs(blob, fileName);
      } else {
        return({blob, fileName, content});
      }
    };
  };

  const upload = async (file) => {
    try {
      const added = await ipfs.add(file, {
        progress: (prog) => {},
        pin: false,
      });
      return added;
    } catch (err) {
      console.error(err);
    }
  };

  return {
    ipfs,
    setMultiAddr,
    isConnected,
    getFiles,
    uploadWithFileName,
    upload,
    uploadWithEncryption,
    uploadWithNonEncryption,
    downloadWithDecryption,
    downloadWithNonDecryption
  };
};

export default useIPFS;
