import React from "react";
import { Color, Modal, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { makeStyles } from "@material-ui/core/styles";
import { Divider, Grid, TextField } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  labelArtists: {
    marginTop: 30,
    color: Color.MusicDAOGreen,
    cursor: "pointer",
  },
  button: {
    border: "none !important",
    background: "#2D3047 !important",
    color: "white !important",
  },
  divider: {
    width: "100%",
    height: 0,
    border: "1px dashed #181818",
    opacity: 0.2,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  labelFundEvenly: {
    cursor: "pointer",
    color: "#4218B5",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    border: "1.41667px solid #FFFFFF",
    filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2))",
  },
  formControlInput: {
    "& div.MuiOutlinedInput-root": {
      fontFamily: "Agrandir",
      background: "rgba(218, 230, 229, 0.4)",
      border: "1px solid #DADADB",
      boxSizing: "border-box",
      borderRadius: "8px",
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
    },
  },
  buttonAddWalletAddress: {
    margin: "20px 0",
    background: "linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D",
    border: "none !important",
  },
}));

const DUMMY_ARTIST = {
  name: `50 Cent`,
  id: `@piptycent`,
  address: "",
};

type TFunds = {
  artist: {
    name: string;
    id: string;
    address: string;
  };
  share: number;
};

export default function CreateProposalModal(props) {
  const styles = useStyles();
  const [step, setStep] = React.useState(0);
  const [funds, setFunds] = React.useState<TFunds[]>([]);
  const [showAddressInput, setShowAddressInput] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState("");
  const [shareAmount, setShareAmount] = React.useState(0);

  const handleSubmit = () => {
    console.log(funds);
    setStep(2);
  };

  const handleAddWalletAddress = () => {
    if (walletAddress) {
      setShowAddressInput(false);
      setFunds([
        ...funds,
        {
          artist: DUMMY_ARTIST,
          share: shareAmount,
        },
      ]);
      setWalletAddress("");
      setShareAmount(0);
    } else {
      setShowAddressInput(true);
      setWalletAddress("");
      setShareAmount(0);
    }
  };

  const handleChatWithArtists = () => {};

  const totalShares = React.useMemo(() => {
    return funds.reduce((prev, curr) => prev + curr.share, 0);
  }, [funds]);

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
      style={{
        maxWidth: "653px",
        padding: step === 1 ? "51px 38px" : "71px 58px 63px",
      }}
    >
      {step === 0 && (
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <img src={require("assets/musicDAOImages/hands.svg")} />
          <h2>
            <strong>Distributioon Proposal</strong>
          </h2>
          <p>
            In the next steps you will be claiming your share of <strong>Claimable Song Name</strong>. Since
            there are other 4 artists that are part of this pod you have to decide and assign the percentage
            of the share that each one of you will receive.
          </p>
          <SecondaryButton size="medium" onClick={() => setStep(1)} isRounded className={styles.button}>
            Ok, Let’s Do it
          </SecondaryButton>
          <p className={styles.labelArtists} onClick={handleChatWithArtists}>
            I Have to Discuss With Artists First
          </p>
        </Box>
      )}
      {step === 1 && (
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <h3>Distribution Proposal</h3>
          <Box width="100%">
            <p>🤑 Funds Raised</p>
            <h2>
              USDp 856.35&nbsp;<span style={{ fontSize: 12, color: "#707582" }}>($858)</span>
            </h2>
            <Box className={styles.divider} />
          </Box>
          <Box width="100%">
            <p className={styles.labelFundEvenly}>Distribute Funds Evenly</p>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <p>Artist</p>
              <p>Share %</p>
            </Box>
            <Grid container direction="column" spacing={2}>
              {funds.map((fund, index) => (
                <Grid item key={`fund-${index}`} container spacing={2}>
                  <Grid item xs={12} sm={7}>
                    <Box display="flex" alignItems="center">
                      <img src={require("assets/musicDAOImages/avatar.svg")} className={styles.avatar} />
                      <Box display="flex" flexDirection="column" style={{ marginLeft: 16 }}>
                        <div>{fund.artist.name}</div>
                        <div style={{ color: Color.MusicDAOGreen }}>{fund.artist.id}</div>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <p>USDp 171&nbsp;($171)</p>
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <TextField
                      type="number"
                      value={fund.share}
                      variant="outlined"
                      className={styles.formControlInput}
                      onChange={({ target: { value } }) => {
                        const temp = [...funds];
                        temp[index].share = parseInt(value);
                        setFunds(temp);
                      }}
                    />
                  </Grid>
                </Grid>
              ))}
            </Grid>
            {showAddressInput && (
              <Grid container style={{ marginTop: 16 }} spacing={2}>
                <Grid item xs={12} sm={10}>
                  <TextField
                    className={styles.formControlInput}
                    placeholder="Paste address here"
                    fullWidth
                    value={walletAddress}
                    variant="outlined"
                    onChange={({ target: { value } }) => setWalletAddress(value)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    type="number"
                    value={shareAmount}
                    variant="outlined"
                    className={styles.formControlInput}
                    onChange={({ target: { value } }) => setShareAmount(parseInt(value))}
                  />
                </Grid>
              </Grid>
            )}
            <SecondaryButton
              size="small"
              onClick={() => handleAddWalletAddress()}
              isRounded
              className={styles.buttonAddWalletAddress}
            >
              + Add Wallet Address
            </SecondaryButton>
            <Box className={styles.divider} />
            <Grid container style={{ color: totalShares > 100 ? "#F43E5F" : Color.MusicDAOGreen }}>
              <Grid item xs={12} sm={7}>
                <Box display="flex" alignItems="center">
                  <img
                    src={require(`assets/musicDAOImages/${totalShares > 100 ? "warning" : "success"}.svg`)}
                    style={{ marginRight: 8 }}
                  />
                  {totalShares > 100 ? "Total can’t be more than 100%" : "Everything looks good"}
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                pUSD 1024
              </Grid>
              <Grid item xs={6} sm={2}>
                {totalShares}%
              </Grid>
            </Grid>
            <Divider style={{ marginTop: 16, marginBottom: 16 }} />
          </Box>
          <p style={{ textAlign: "center", color: Color.MusicDAOLightBlue }}>
            Before funds get distrubuted among artists, they will have to approve and sign this distribution
            proposal.
          </p>
          <SecondaryButton
            size="medium"
            onClick={() => handleSubmit()}
            isRounded
            className={styles.button}
            style={{ marginTop: 40 }}
          >
            Submit Proposal
          </SecondaryButton>
          <Box
            display="flex"
            alignItems="center"
            className={styles.labelArtists}
            onClick={handleChatWithArtists}
          >
            <img src={require(`assets/musicDAOImages/chat.svg`)} style={{ marginRight: 8 }} />
            Start Discussion Chat With Artists
          </Box>
        </Box>
      )}
      {step === 2 && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          textAlign="center"
        >
          <img src={require("assets/musicDAOImages/pen.svg")} />
          <h2>
            <strong>Approval Request Sent</strong>
          </h2>
          <p>We have sent a notification to the artists to review your funds distribution proposal.</p>
          <p>We’ll keep you posted on the status of this transaction.</p>
          <SecondaryButton
            size="medium"
            onClick={() => props.onClose()}
            isRounded
            className={styles.button}
            style={{ marginTop: 100 }}
          >
            View Proposal on Pod
          </SecondaryButton>
        </Box>
      )}
    </Modal>
  );
}
