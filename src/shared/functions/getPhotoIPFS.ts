import { onGetNonDecrypt } from "../ipfs/get";
import { _arrayBufferToBase64 } from "./commonFunctions";

const getPhotoIPFS = async (
  cid: string,
  fileName: string,
  downloadWithNonDecryption: any,
  type: string = "image/png"
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    if (cid && fileName) {
      let files = await onGetNonDecrypt(cid, fileName, (fileCID, fileName, download) =>
        downloadWithNonDecryption(fileCID, fileName, download)
      );
      if (files && type) {
        let base64String = _arrayBufferToBase64(files.buffer);
        resolve(`data:${type};base64,${base64String}`);
      } else {
        resolve("");
      }
    } else {
      resolve("");
    }
  });
};

export default getPhotoIPFS;
