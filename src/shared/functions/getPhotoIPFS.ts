import {onGetNonDecrypt} from "../ipfs/get";
import {_arrayBufferToBase64} from "./commonFunctions";
import useIPFS from "../utils-IPFS/useIPFS";

const getPhotoIPFS = async (cid: string, downloadWithNonDecryption: any) : Promise<string> => {

  let files = await onGetNonDecrypt(cid, (fileCID, download) =>
    downloadWithNonDecryption(fileCID, download)
  );
  if (files) {
    let base64String = _arrayBufferToBase64(files.content);
    return("data:image/png;base64," + base64String);
  } else {
    return("")
  }
}

export default getPhotoIPFS;
