import axios from "axios";
import Web3 from "web3";
import { signWithMetamask, signWithPrivi } from "../WalletSign";
import URL from "shared/functions/getURL";

export async function signInWithMetamaskWallet(address: string, web3: Web3, domain: string, handleClickSign?: any, auth: boolean | string = false): Promise<any> {
  let signature = auth;
  if (!auth)
    signature = await signWithMetamask(address, web3, domain);
  if (handleClickSign)
    await handleClickSign();
  return new Promise<any>((resolve, reject) => {
    axios
    .post(`${URL()}/user/signInWithMetamaskWallet_v2`, { address, signature, domain })
      .then(res => {
        resolve(res.data);
      })
      .catch(async err => {
        // console.log("Error in SignIn.tsx -> fetchUser() : ", err);
        reject("Error");
      });
  })
}

export async function signInWithPriviWallet(address: string, privateKey?: any): Promise<any> {
  let {hash, signature} = await signWithPrivi(address, privateKey);
  hash = Buffer.from(hash).toString('hex');
  return new Promise<any>((resolve, reject) => {
    axios
      .post(`${URL()}/user/signInWithPriviWallet`, { address, hash, signature })
      .then(res => {
        resolve(res.data);
      })
      .catch(async err => {
        // console.log("Error in SignIn.tsx -> fetchUser() : ", err);
        reject("Error");
      });
  })
}

export async function signUpWithMetamaskWallet(address: string, web3: Web3, domain: string): Promise<any> {
  let signature = await signWithMetamask(address, web3, domain);
  return new Promise<any>((resolve, reject) => {
    axios
      .post(`${URL()}/user/signUpWithMetamaskWallet`, {
        firstName: "User",
        email: "priviprivi@gmail.com",
        address,
        signature,
      })
      .then(res => {
        res.data.signature = signature;
        resolve(res.data);
      })
      .catch(async err => {
        //   console.log("Error in SignUp.tsx -> storeUser() : ", err);
        reject("Error");
      });
  });
}

export async function signUpWithPriviWallet(address: string, privateKey?: any): Promise<any> {
  let {hash, signature} = await signWithPrivi(address, privateKey);
  hash = JSON.stringify(hash);
  return new Promise<any>((resolve, reject) => {
    axios
      .post(`${URL()}/user/signUpWithPriviWallet`, {
        firstName: "User",
        email: "priviprivi@gmail.com",
        address,
        hash,
        signature,
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(async err => {
        //   console.log("Error in SignUp.tsx -> storeUser() : ", err);
        reject("Error");
      });
  });
}
