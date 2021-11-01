import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import USDC from "shared/services/API/web3/contracts/ERC20Tokens/USDC";
import USDT from "shared/services/API/web3/contracts/ERC20Tokens/USDT";
import JOT from "shared/services/API/web3/contracts/ERC20Tokens/JOT";
import { toDecimals, toNDecimals } from "shared/functions/web3";

const syntheticCollectionManager = (network: string) => {
  const metadata = require("shared/connectors/web3/contracts/SyntheticCollectionManager.json");

  const buyJotTokens = async (web3: Web3, account: string, collection: any, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenId, amount, setHash } = payload;
        const { SyntheticCollectionManagerAddress, JotAddress } = collection;

        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);

        const jotAPI = JOT(network);

        const decimals = await jotAPI.decimals(web3, JotAddress);

        console.log("Getting gas....");
        const gas = await contract.methods
          .buyJotTokens(tokenId, toNDecimals(amount, decimals))
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = contract.methods
          .buyJotTokens(tokenId, toNDecimals(amount, decimals))
          .send({ from: account, gas: gas })
          .on("transactionHash", function (hash) {
            setHash(hash);
          })
          .on("receipt", function (receipt) {
            resolve({
              success: true,
              data: {
                hash: receipt.transactionHash,
              },
            });
          });
        console.log("transaction succeed");
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const depositJots = async (web3: Web3, account: string, collection: any, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenId, amount, setHash } = payload;
        const { SyntheticCollectionManagerAddress, JotAddress } = collection;

        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);

        const jotAPI = JOT(network);

        const decimals = await jotAPI.decimals(web3, JotAddress);

        const gas = await contract.methods
          .depositJotTokens(tokenId, toNDecimals(amount, decimals))
          .estimateGas({ from: account });
        const response = contract.methods
          .depositJotTokens(tokenId, toNDecimals(amount, decimals))
          .send({ from: account, gas: gas })
          .on("transactionHash", function (hash) {
            if (setHash) {
              setHash(hash);
            }
          })
          .on("receipt", function (receipt) {
            resolve({
              success: true,
              data: {
                hash: receipt.transactionHash,
              },
            });
          });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const withdrawJots = async (web3: Web3, account: string, collection: any, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenId, amount, setHash } = payload;
        const { SyntheticCollectionManagerAddress, JotAddress } = collection;

        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);

        const jotAPI = JOT(network);

        const decimals = await jotAPI.decimals(web3, JotAddress);

        const gas = await contract.methods
          .withdrawJotTokens(tokenId, toNDecimals(amount, decimals))
          .estimateGas({ from: account });
        const response = contract.methods
          .withdrawJotTokens(tokenId, toNDecimals(amount, decimals))
          .send({ from: account, gas: gas })
          .on("transactionHash", function (hash) {
            if (setHash) {
              setHash(hash);
            }
          })
          .on("receipt", function (receipt) {
            resolve({
              success: true,
              data: {
                hash: receipt.transactionHash,
              },
            });
          });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const getOwnerSupply = (web3: Web3, collection: any, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenId } = payload;
        const { SyntheticCollectionManagerAddress, JotAddress } = collection;

        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);

        const jotAPI = JOT(network);

        const decimals = await jotAPI.decimals(web3, JotAddress);

        contract.methods.getOwnerSupply(tokenId).call((err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          } else {
            resolve(toDecimals(result, decimals));
          }
        });
      } catch (err) {
        console.log(err);
        resolve(null);
      }
    });
  };

  const getSoldSupply = (web3: Web3, collection: any, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenId } = payload;
        const { SyntheticCollectionManagerAddress, JotAddress } = collection;

        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);

        const jotAPI = JOT(network);

        const decimals = await jotAPI.decimals(web3, JotAddress);

        contract.methods.getSoldSupply(tokenId).call((err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          } else {
            resolve(toDecimals(result, decimals));
          }
        });
      } catch (err) {
        console.log(err);
        resolve({ success: false });
      }
    });
  };

  const getContractJotsBalance = (web3: Web3, collection: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { SyntheticCollectionManagerAddress, JotAddress } = collection;

        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);

        const jotAPI = JOT(network);

        const decimals = await jotAPI.decimals(web3, JotAddress);

        contract.methods.getContractJotsBalance().call((err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          } else {
            resolve(toDecimals(result, decimals));
          }
        });
      } catch (err) {
        console.log(err);
        resolve({ success: false });
      }
    });
  };

  const getJotFractionPrice = (web3: Web3, collection: any, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenId } = payload;
        const { SyntheticCollectionManagerAddress, JotAddress } = collection;

        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);

        const USDCAPI = USDC(network);

        const decimals = await USDCAPI.decimals(web3);

        contract.methods.getJotFractionPrice(tokenId).call((err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          } else {
            resolve(toDecimals(result, decimals));
          }
        });
      } catch (err) {
        console.log(err);
        resolve({ success: false });
      }
    });
  };

  const flipJot = async (web3: Web3, account: string, collection: any, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenId, prediction, setFlippingHash } = payload;
        const { SyntheticCollectionManagerAddress } = collection;
        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);

        console.log("Getting gas....");
        const isAllowedToFlipGas = await contract.methods
          .isAllowedToFlip(tokenId)
          .estimateGas({ from: account });

        console.log("Estimated gas....", isAllowedToFlipGas);

        const isAllowedToFlip = await contract.methods
          .isAllowedToFlip(tokenId)
          .call({ from: account, gas: isAllowedToFlipGas });

        console.log("Is Allowed to flip? --", isAllowedToFlip);

        if (!isAllowedToFlip) {
          resolve("not allowed");
        }

        console.log("Getting gas... ", prediction, tokenId);

        const gas = await contract.methods.flipJot(tokenId, prediction).estimateGas({ from: account });
        console.log("polygon gas...", gas);

        const response = await contract.methods
          .flipJot(tokenId, parseInt(prediction))
          .send({ from: account, gas });

        console.log("coinFlipped... ", response);
        setFlippingHash(response.transactionHash);

        const {
          events: {
            CoinFlipped: {
              blockNumber,
              returnValues: { requestId },
            },
          },
        } = response;

        await new Promise(resolve => setTimeout(resolve, 35000));

        await contract.getPastEvents(
          "FlipProcessed",
          {
            fromBlock: blockNumber,
            toBlock: "latest",
          },
          (error, events) => {
            console.log(events);
            const event = events
              .map(res => ({ ...res.returnValues, hash: res.transactionHash }))
              .find(res => res.requestId === requestId);
            resolve(event);
          }
        );
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const updatePriceFraction = async (
    web3: Web3,
    account: string,
    collection: any,
    payload: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenId, price, setHash } = payload;
        const { SyntheticCollectionManagerAddress } = collection;

        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);

        console.log("Getting gas....");
        const gas = await contract.methods.updatePriceFraction(tokenId, price).estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);

        contract.methods
          .updatePriceFraction(tokenId, price)
          .send({ from: account, gas: gas })
          .on("transactionHash", function (hash) {
            setHash(hash);
          })
          .on("receipt", function (receipt) {
            console.log("transaction succeed");
            resolve({
              success: true,
              data: {
                hash: receipt.transactionHash,
              },
            });
          });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const increaseSellingSupply = async (
    web3: Web3,
    account: string,
    collection: any,
    payload: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenId, amount, setHash } = payload;
        const { SyntheticCollectionManagerAddress, JotAddress } = collection;

        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);

        const jotAPI = JOT(network);

        const decimals = await jotAPI.decimals(web3, JotAddress);

        console.log("Getting gas....");
        const gas = await contract.methods
          .increaseSellingSupply(tokenId, toNDecimals(amount, decimals))
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        await contract.methods
          .increaseSellingSupply(tokenId, toNDecimals(amount, decimals))
          .send({ from: account, gas: gas })
          .on("transactionHash", function (hash) {
            setHash(hash);
          })
          .on("receipt", function (receipt) {
            console.log("transaction succeed");
            resolve({
              success: true,
              data: {
                hash: receipt.transactionHash,
              },
            });
          });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const decreaseSellingSupply = async (
    web3: Web3,
    account: string,
    collection: any,
    payload: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenId, amount, setHash } = payload;
        const { SyntheticCollectionManagerAddress, JotAddress } = collection;

        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);

        const jotAPI = JOT(network);

        const decimals = await jotAPI.decimals(web3, JotAddress);

        console.log("Getting gas....");
        const gas = await contract.methods
          .decreaseSellingSupply(tokenId, toNDecimals(amount, decimals))
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        await contract.methods
          .decreaseSellingSupply(tokenId, toNDecimals(amount, decimals))
          .send({ from: account, gas: gas })
          .on("transactionHash", function (hash) {
            setHash(hash);
          })
          .on("receipt", function (receipt) {
            console.log("transaction succeed");
            resolve({
              success: true,
              data: {
                hash: receipt.transactionHash,
              },
            });
          });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const getSellingSupply = async (web3: Web3, collection: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { SyntheticCollectionManagerAddress, JotAddress, SyntheticID } = collection;
        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);

        const jotAPI = JOT(network);

        const decimals = await jotAPI.decimals(web3, JotAddress);

        contract.methods.getSellingSupply(SyntheticID).call((err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          } else {
            console.log("transaction succeed ", result);
            resolve(toDecimals(result, decimals));
          }
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const verifyToken = async (web3: Web3, account: string, collection: any, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenId, setHash } = payload;
        const { SyntheticCollectionManagerAddress } = collection;
        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);
        const gas = await contract.methods.verify(tokenId).estimateGas({ from: account });
        const response = await contract.methods
          .verify(tokenId)
          .send({ from: account, gas: gas })
          .on("transactionHash", function (hash) {
            setHash(hash);
          });

        const {
          events: {
            VerificationRequested: {
              blockNumber,
              returnValues: { requestId },
            },
          },
        } = response;
        console.log("verify response", response);
        await new Promise(resolve => setTimeout(resolve, 15000));

        await contract.getPastEvents(
          "VerifyResponseReceived",
          {
            fromBlock: blockNumber,
            toBlock: "latest",
          },
          (error, events) => {
            console.log("verify events", events);
            const event = events
              .map(res => ({ ...res.returnValues, hash: res.transactionHash }))
              .find(res => res.requestId === requestId);
            resolve({ success: event?.verified ?? false });
          }
        );
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const isVerifiedToken = async (
    web3: Web3,
    account: string,
    collection: any,
    payload: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenId } = payload;
        const { SyntheticCollectionManagerAddress } = collection;

        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);

        const gas = await contract.methods.isVerified(tokenId).estimateGas({ from: account });
        const response = await contract.methods.isVerified(tokenId).send({ from: account, gas: gas });
        console.log("is verified token response", response);
        resolve({
          success: true,
          data: {
            hash: response.transactionHash,
          },
        });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const addLiquidityToPool = async (web3: Web3, account: string, nft: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { SyntheticCollectionManagerAddress, SyntheticID: tokenId } = nft;

        console.log(tokenId);
        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);

        const gas = await contract.methods.addLiquidityToPool(tokenId).estimateGas({ from: account });
        const response = await contract.methods.addLiquidityToPool(tokenId).send({ from: account, gas: gas });

        if (response) {
          console.log(response);
          resolve({ success: true });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const getAccruedReward = async (web3: Web3, collection: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { SyntheticCollectionManagerAddress, JotAddress, SyntheticID } = collection;
        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);

        const jotAPI = JOT(network);

        const decimals = await jotAPI.decimals(web3, JotAddress);

        contract.methods.getAccruedReward(SyntheticID).call((err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          } else {
            console.log("transaction succeed ", result);
            resolve(toDecimals(result, decimals));
          }
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const exchangeOwnerJot = async (web3: Web3, account: string, nft: any, amount: number): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { SyntheticCollectionManagerAddress, JotAddress, SyntheticID: tokenId } = nft;

        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);
        console.log(SyntheticCollectionManagerAddress);
        const gas = await contract.methods.exchangeOwnerJot(tokenId, amount).estimateGas({ from: account });
        console.log(gas);
        const response = await contract.methods
          .exchangeOwnerJot(tokenId, amount)
          .send({ from: account, gas: gas });

        if (response) {
          console.log(response);
          resolve({ success: true });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const exitProtocol = async (web3: Web3, account: string, nft: any, param: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { SyntheticCollectionManagerAddress, SyntheticID } = nft;

        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);
        const gas = await contract.methods.exitProtocol(SyntheticID).estimateGas({ from: account });
        const response = await contract.methods
          .exitProtocol(SyntheticID)
          .send({ from: account, gas: gas })
          .on("transactionHash", function (hash) {
            param.setHash(hash);
          });

        // Temporaily purpose due to oracle issue
        if (response) {
          resolve({ success: true });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const buyBack = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { nft, setHash } = payload;
        const { SyntheticCollectionManagerAddress, SyntheticID } = nft;

        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);
        const gas = await contract.methods.buyback(SyntheticID).estimateGas({ from: account });
        const response = await contract.methods
          .buyback(SyntheticID)
          .send({ from: account, gas: gas })
          .on("transactionHash", function (hash) {
            if (setHash) setHash(hash);
          });

        // Temporaily purpose due to oracle issue
        if (response) {
          resolve({ success: true });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const getAvailableBuyback = (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { nft } = payload;
        const { SyntheticCollectionManagerAddress, SyntheticID, JotAddress } = nft;

        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);
        const jotAPI = JOT(network);

        const decimals = await jotAPI.decimals(web3, JotAddress);

        contract.methods.getAvailableJotsForBuyback(SyntheticID).call((err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          } else {
            resolve({ jots: toDecimals(result[0], decimals), funding: toDecimals(result[1], decimals) });
          }
        });
      } catch (err) {
        console.log(err);
        resolve(null);
      }
    });
  };

  const getBuybackPrice = (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { nft } = payload;
        const { SyntheticCollectionManagerAddress } = nft;

        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);
        const USDTAPI = USDT(network);

        const decimals = await USDTAPI.decimals(web3);

        contract.methods.buybackPrice().call((err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          } else {
            resolve(toDecimals(result, decimals));
          }
        });
      } catch (err) {
        console.log(err);
        resolve(null);
      }
    });
  };

  const getBuybackRequiredAmount = (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { nft } = payload;
        const { SyntheticCollectionManagerAddress, SyntheticID } = nft;

        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);
        const USDTAPI = USDT(network);

        const decimals = await USDTAPI.decimals(web3);

        contract.methods.buybackRequiredAmount(SyntheticID).call((err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          } else {
            resolve(toDecimals(result?.buybackAmount, decimals));
          }
        });
      } catch (err) {
        console.log(err);
        resolve(null);
      }
    });
  };

  const withdrawFundingTokens = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { nft, amount, setHash } = payload;
        const { SyntheticCollectionManagerAddress, SyntheticID } = nft;

        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);

        const USDTAPI = USDT(network);
        const decimals = await USDTAPI.decimals(web3);

        const gas = await contract.methods
          .withdrawFundingTokens(SyntheticID, toNDecimals(amount, decimals))
          .estimateGas({ from: account });
        const response = contract.methods
          .withdrawFundingTokens(SyntheticID, toNDecimals(amount, decimals))
          .send({ from: account, gas: gas })
          .on("transactionHash", function (hash) {
            if (setHash) {
              setHash(hash);
            }
          })
          .on("receipt", function (receipt) {
            resolve({
              success: true,
              data: {
                hash: receipt.transactionHash,
              },
            });
          });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const getliquiditySold = (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { nft } = payload;
        const { SyntheticCollectionManagerAddress, SyntheticID } = nft;

        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);
        const USDTAPI = USDT(network);

        const decimals = await USDTAPI.decimals(web3);

        contract.methods.getliquiditySold(SyntheticID).call((err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          } else {
            resolve(toDecimals(result ?? 0, decimals));
          }
        });
      } catch (err) {
        console.log(err);
        resolve(null);
      }
    });
  };

  const addLiquidityToQuickswap = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { quickSwapAddress, tokenId, amount, setHash } = payload;

        const contract = ContractInstance(web3, metadata.abi, quickSwapAddress);

        const gas = await contract.methods
          .addLiquidityToQuickswap(tokenId, amount)
          .estimateGas({ from: account });
        const response = await contract.methods
          .addLiquidityToQuickswap(tokenId, amount)
          .send({ from: account, gas: gas })
          .on("transactionHash", function (hash) {
            if (setHash) {
              setHash(hash);
            }
          });;;
        const liquidityResponse = response.events?.LiquidiyAdded?.returnValues;

        if (liquidityResponse) {
          resolve({ success: true, share: liquidityResponse.share, shareOff: liquidityResponse.shareOff, amount: liquidityResponse.amount });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const withdrawLiquidityFromQuickswap = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { quickSwapAddress, tokenId, amount, setHash } = payload;

        const contract = ContractInstance(web3, metadata.abi, quickSwapAddress);

        const gas = await contract.methods
          .withdrawLiquidityFromQuickswap(tokenId, amount)
          .estimateGas({ from: account });
        const response = await contract.methods
          .withdrawLiquidityFromQuickswap(tokenId, amount)
          .send({ from: account, gas: gas })
          .on("transactionHash", function (hash) {
            if (setHash) {
              setHash(hash);
            }
          });;;
        const liquidityResponse = response.events?.LiquidiyAdded?.returnValues;

        if (liquidityResponse) {
          resolve({ success: true, share: liquidityResponse.share, shareOff: liquidityResponse.shareOff, amount: liquidityResponse.amount });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const AddLiquidityToFuturePool = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { perpetualPoolLiteAddress, tokenId, amount, setHash } = payload;

        const contract = ContractInstance(web3, metadata.abi, perpetualPoolLiteAddress);

        const gas = await contract.methods
          .AddLiquidityToFuturePool(tokenId, amount)
          .estimateGas({ from: account });
        const response = await contract.methods
          .AddLiquidityToFuturePool(tokenId, amount)
          .send({ from: account, gas: gas })
          .on("transactionHash", function (hash) {
            if (setHash) {
              setHash(hash);
            }
          });
        const liquidityResponse = response.events?.LiquidiyAdded?.returnValues;

        if (liquidityResponse) {
          resolve({ success: true, share: liquidityResponse.share, shareOff: liquidityResponse.shareOff, amount: liquidityResponse.amount });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const withdrawLiquidityFromFuturePool = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { perpetualPoolLiteAddress, tokenId, amount, setHash } = payload;

        const contract = ContractInstance(web3, metadata.abi, perpetualPoolLiteAddress);

        const gas = await contract.methods
          .withdrawLiquidityFromFuturePool(tokenId, amount)
          .estimateGas({ from: account });
        const response = await contract.methods
          .withdrawLiquidityFromFuturePool(tokenId, amount)
          .send({ from: account, gas: gas })
          .on("transactionHash", function (hash) {
            if (setHash) {
              setHash(hash);
            }
          });;
        const liquidityResponse = response.events?.LiquidiyAdded?.returnValues;

        if (liquidityResponse) {
          resolve({ success: true, share: liquidityResponse.share, shareOff: liquidityResponse.shareOff, amount: liquidityResponse.amount });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  return {
    buyJotTokens,
    depositJots,
    withdrawJots,
    updatePriceFraction,
    increaseSellingSupply,
    decreaseSellingSupply,
    flipJot,
    getSellingSupply,
    getOwnerSupply,
    getContractJotsBalance,
    getJotFractionPrice,
    verifyToken,
    isVerifiedToken,
    addLiquidityToPool,
    getSoldSupply,
    getAccruedReward,
    exchangeOwnerJot,
    exitProtocol,
    buyBack,
    getAvailableBuyback,
    getBuybackPrice,
    getBuybackRequiredAmount,
    withdrawFundingTokens,
    getliquiditySold,
    addLiquidityToQuickswap,
    withdrawLiquidityFromQuickswap,
    AddLiquidityToFuturePool,
    withdrawLiquidityFromFuturePool,
  };
};

export default syntheticCollectionManager;
