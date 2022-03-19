import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";
import "./App.css";

const contractAddress = "0x9FfF59eA0dC71f8b32a39D5271dB1980B514bffa";
const contractABI = abi.abi;

export default function App() {
  const [currentAccount, setCurrentAccount] = useState();
  const [totalWaves, setTotalWaves] = useState();
  const [allWaves, setAllWaves] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestingTransaction, setIsRequestingTransaction] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        setCurrentAccount(null);
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
        setCurrentAccount(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    const setupVariables = async () => {
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const wavePortalContract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );

          let [{ value: countResponse }, { value: allWavesResponse }] =
            await Promise.allSettled([
              wavePortalContract.getTotalWaves(),
              wavePortalContract.getAllWaves(),
            ]);

          setTotalWaves(countResponse.toNumber());
          console.log(
            "Retrieved total wave count...",
            countResponse.toNumber()
          );
          setAllWaves(
            allWavesResponse.map((wave) => ({
              message: wave.message,
              address: wave.waver,
              timestamp: new Date(wave.timestamp.toNumber() * 1000),
            }))
          );
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentAccount) setupVariables();
  }, [currentAccount]);

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
         * Execute the actual wave from your smart contract
         */
        setIsRequestingTransaction(true);
        const waveTxn = await wavePortalContract.wave("message");
        setIsRequestingTransaction(false);
        console.log("Mining...", waveTxn.hash);

        setIsLoading(true);
        await waveTxn.wait();
        setIsLoading(false);
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        setTotalWaves(count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setIsRequestingTransaction(false);
    }
  };
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          <span role="img" aria-label="Waving hand">
            👋
          </span>{" "}
          Hey there!
        </div>

        <div className="bio">
          I am Chelo and I work on Front end development, connect your Ethereum
          wallet and wave at me!
        </div>

        {totalWaves != null ? (
          <div className="bio">I have received {totalWaves} waves</div>
        ) : null}

        {isLoading || isRequestingTransaction ? (
          <div className="loader"></div>
        ) : (
          <button className="waveButton" onClick={wave}>
            Wave at Me
          </button>
        )}

        {isRequestingTransaction ? (
          <div className="bio">
            An approval is required to proceed with the transaction...
          </div>
        ) : null}

        {currentAccount === null && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        <h3 style={{ marginBottom: -8 }}>Waves</h3>
        {allWaves.map((wave, index) => {
          return (
            <div
              key={`${wave.address}_${wave.timestamp.toString()}`}
              style={{
                backgroundColor: "OldLace",
                marginTop: "16px",
                padding: "8px",
              }}
            >
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
