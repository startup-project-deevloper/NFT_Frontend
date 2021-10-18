import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Box from "shared/ui-kit/Box";
import { ReactComponent as CopyIcon } from "assets/icons/copy-icon.svg";
import { FlipCoinModalStyles } from "./index.styles";
import { Modal } from "shared/ui-kit";

const isProd = process.env.REACT_APP_ENV === "prod";
// true - flipping dialog, false - result dialog (finished flipping)
// true - won, false - lost
export default function FlipCoinModal({ open, onClose, isFlipping, flipResult, hash, resultState }) {
  const classes = FlipCoinModalStyles();

  const handleCheckPolygonScan = () => {
    window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${hash}`, "_blank");
  };

  return (
    <Modal size="small" isOpen={open} onClose={onClose} showCloseIcon className={classes.modal}>
      <Box display="flex" flexDirection="column">
        <div className={classes.root}>
          <div className={classes.container}>
            {isFlipping ? (
              <Box className={classes.main}>
                <div className={classes.gifCoin}></div>
                <h1 className={classes.title}>Flipping a Coin</h1>
                <p className={classes.description}>
                  The coin is beeing flipped, it may take a moment to process the results of your flip. Please
                  be patient as it can last up to 30 seconds.
                </p>
                {hash && (
                  <>
                    <CopyToClipboard text={hash}>
                      <Box mt="20px" display="flex" alignItems="center" className={classes.hash}>
                        Hash:
                        <Box color="#4218B5" mr={1} ml={1}>
                          {hash.substr(0, 18) + "..." + hash.substr(hash.length - 3, 3)}
                        </Box>
                        <CopyIcon />
                      </Box>
                    </CopyToClipboard>
                    <button className={classes.checkBtn} onClick={handleCheckPolygonScan}>
                      Check on Polygon Scan
                    </button>
                  </>
                )}
              </Box>
            ) : (
              <>
                {flipResult ? (
                  <Box className={classes.main}>
                    <img
                      className={classes.imgWon}
                      src={
                        resultState === 0
                          ? require("assets/icons/won_0.png")
                          : require("assets/icons/won_1.png")
                      }
                    />
                    <Box width="100%" height="200px"></Box>
                    <h1 className={classes.title}>You have won!</h1>
                    <p className={classes.description}>
                      Congrats! You have guessed correctly and <br />
                      <span className={classes.result}>you have won 0.1 JOTs</span>
                    </p>
                    <button
                      className={classes.checkBtn}
                      onClick={handleCheckPolygonScan}
                      style={{ width: "70%" }}
                    >
                      Check on Polygon Scan
                    </button>
                  </Box>
                ) : (
                  <Box className={classes.main}>
                    <img
                      className={classes.imgLost}
                      src={
                        resultState === 0
                          ? require("assets/icons/lost_0.png")
                          : require("assets/icons/lost_1.png")
                      }
                    />
                    <h1 className={`${classes.title} ${classes.grad}`}>You have lost!</h1>
                    <p className={classes.description}>
                      Unfortunatelly! You have guessed incorrectly <br />
                      and the result was {resultState} <br />
                      <span className={`${classes.result} ${classes.grad}`}>
                        you have lost 0.1 JOTs to the owner
                      </span>
                    </p>
                    <Box display="flex" alignItems="center" width="100%" justifyContent="center">
                      <button className={classes.plainBtn} onClick={onClose} style={{ width: "70%" }}>
                        Close
                      </button>
                    </Box>
                  </Box>
                )}
              </>
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
}
