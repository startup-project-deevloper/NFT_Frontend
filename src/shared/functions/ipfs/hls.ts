import Hls from "hls.js";
import ecies from "ecies-parity";
import crypto from "crypto";

import URL from "shared/functions/getIPFSBackendURL";

import { wbDecrypt, s2a } from "./aes_lib";
import { backendPost } from "./post";

// const multiAddr = getIPFSURL();
const sessionPrivateKeyA = sessionStorage.getItem("privateKeyA");
var privateKeyA = sessionPrivateKeyA
  ? Buffer.from(JSON.parse(sessionPrivateKeyA)?.data)
  : crypto.randomBytes(32);
var publicKeyA = ecies.getPublic(privateKeyA);

!sessionPrivateKeyA && sessionStorage.setItem("privateKeyA", JSON.stringify(privateKeyA));

const player = {
  privateKey: privateKeyA,
  publicKey: publicKeyA,
};

let wbPrivateKey;
let previousKeyFile = "",
  keyFileID = 1;

// const getDB = async () => {
//   await MyIPFS.setMultiAddr(multiAddr);
//   console.log('getDB', MyIPFS.orbitdb);
//   db = MyIPFS.orbitdb;
// }
// getDB();

const sessionWbPrivateKey = sessionStorage.getItem("wbPrivateKey");
const getWbPrivateKey = async () => {
  if (!sessionWbPrivateKey) {
    const resp = await backendPost("addPlayerKey", { key: player.publicKey });
    // console.log('getWbPrivateKey', resp)
    wbPrivateKey = resp.privateKey;
    sessionStorage.setItem("wbPrivateKey", wbPrivateKey);
  } else {
    wbPrivateKey = sessionWbPrivateKey;
  }
};

getWbPrivateKey();

function processPlayList(playlist) {
  const userId = sessionStorage.getItem("userId");
  playlist = playlist.replaceAll(`URI="/`, `URI="${URL()}/ipfs/getKeyFile/${userId}/`);
  // console.log("custom Loader", playlist);
  return playlist;
}

const processFragment = data => {
  return data;
};

export class pLoader extends Hls.DefaultConfig.loader {
  constructor(config) {
    super(config);
    var load = this.load.bind(this);
    this.load = function (context, config, callbacks) {
      let { type, url } = context as any;
      keyFileID = 1;
      console.log(`%c-----Player Consumption Log Information-----`, "color : blue");
      console.log("PlayList Loaded", url);
      // console.log("pLoader", { type, url });
      if (type == "manifest") {
        var onSuccess = callbacks.onSuccess;
        callbacks.onSuccess = function (response, stats, context) {
          // console.log({responseData : response.data});
          response.data = processPlayList(response.data);
          onSuccess(response, stats, context, null);
        };
      }
      load(context, config, callbacks);
    };
  }
}

export class fLoader extends Hls.DefaultConfig.loader {
  constructor(config) {
    super(config);
    var load = this.load.bind(this);
    this.load = async (context: any, config, callbacks) => {
      // console.log('Chunk Loaded', context);
      const chunkConsumptionInfo = `${keyFileID++}. Chunk ${context.url
        .split("/")
        .at(-1)} : Duration-${context.frag.duration.toFixed(2)}s \n(${context.url})`;
      console.log(chunkConsumptionInfo);
      // db.log(chunkConsumptionInfo);
      if (previousKeyFile != context.frag.levelkey._uri) {
        previousKeyFile = context.frag.levelkey._uri;
        const temp = previousKeyFile.split("/");
        const keyConsumptionLog = `Key File ${temp[temp.length - 1]} \n${previousKeyFile}`;
        console.log(keyConsumptionLog);
        // db.log(keyConsumptionLog);
        // decrypt here
        let keyData = context.frag.levelkey.key;
        // console.log({ floader: keyData });
        // console.log("fLoader", context, config, callbacks);
        // console.log({ wallet: player.privateKey });
        // ECIES Decrypt
        const newKeyDataBuffer = await ecies.decrypt(player.privateKey, Buffer.from(keyData));
        // console.log("ecies_decrypted buffer", newKeyDataBuffer);
        const eciesDecrypted = [...newKeyDataBuffer];
        // console.log("ecies decrypt, ", { eciesDecrypted });
        // WB_DECRYPT
        const encrypted = Buffer.from(newKeyDataBuffer, "base64").toString("base64");
        // console.log("base64string", encrypted);
        const { decrypted } = (await wbDecrypt(encrypted, wbPrivateKey)) as any;
        // console.log({ decrypted });
        const decryptedArray = s2a(decrypted);
        const newKeyData = [...decryptedArray];
        // console.log("TEST WB_DECRYPT_TEST", { newKeyData });

        context.frag.levelkey.key.set(newKeyData, 0);
        // console.log("afterDecrypt", { newKeyData });
        // console.log({ levelKey: context.frag.levelkey.key });
      }

      // if (context.type == 'manifest') {
      var onSuccess = callbacks.onSuccess;
      callbacks.onSuccess = function (response, stats, context) {
        // response.data = processFragment(response.data);
        // console.log("response.data", response.data);
        onSuccess(response, stats, context, null);
      };
      // console.log("fLoader", context, config, callbacks);
      load(context, config, callbacks);
      // };
    };
  }
}
