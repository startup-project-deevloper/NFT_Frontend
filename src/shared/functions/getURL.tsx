/**
 * Determines the back-end URL depending on two factors:
 * - Environment variable NODE_ENV
 * - App parameter REACT_APP_ENV
 *
 * Below are the 4 different options to start the front-end:
 * HTTPS=true SSL_CRT_FILE=server.crt SSL_KEY_FILE=server.key REACT_APP_ENV='dev_ssl' npm start => connect to backend running in localhost using https
 * REACT_APP_ENV='dev' npm start => connect to backend running in localhost using http
 * REACT_APP npm start => connect to backend running in the Server using https
 * REACT_APP npm build => only to deploy the App, to connect to backend running in the Server using https
 *
 * Attention: Depending on the Operating System, the parameters when calling the App may have a different syntaxis
 * Linux, MacOS => REACT_APP_ENV='dev' npm start
 * Windows (cmd.exe) => set "REACT_APP_ENV=dev" && npm start
 *
 * @returns URL to connect to the backend
 */
const URL = (): string => {
  // return process.env.REACT_APP_PRIVI_BACKEND_URL ?? "http://localhost:3000";
  return "http://194.146.57.180:8080";
};

export const PriceFeed_URL = (): string => {
  return process.env.REACT_APP_PRICE_FEED_URL || "http://localhost:3002";
  //return "https://price-feed-dev.privi.store" || "http://localhost:3002"
};

export const PriceFeed_Token = (): string => {
  return process.env.REACT_APP_PRICE_FEED_TOKEN || "SoMeR@nD0MsTrInG";
};

export default URL;
