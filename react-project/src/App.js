import React, { useState, useEffect } from "react";
import { useConnectWallet } from "./hooks/use-connect-wallet.hook";
import { useSendWave } from "./hooks/use-send-wave.hook";

import "./App.css";
import { useWavePortalContract } from "./hooks/use-waveportal-contract.hook";

export default function App() {
  const [totalWaves, setTotalWaves] = useState();
  const [allWaves, setAllWaves] = useState([]);
  const { connectWallet, currentAccount } = useConnectWallet();
  const { isLoading, isRequestingTransaction, sendWave } = useSendWave({
    onSuccess: async (contract) => {
      const count = await contract.getTotalWaves();
      console.log("Retrieved total wave count...", count.toNumber());
      setTotalWaves(count.toNumber());
    },
  });

  const { wavePortalContract } = useWavePortalContract();

  useEffect(() => {
    function onNewWave(from, message, timestamp) {
      console.log("NewWave", from, message, timestamp);
      setAllWaves((prevState) => [
        ...prevState,
        {
          message,
          address: from,
          timestamp: new Date(timestamp.toNumber() * 1000),
        },
      ]);
    }

    async function initVariables() {
      try {
        let [{ value: countResponse }, { value: allWavesResponse }] =
          await Promise.allSettled([
            wavePortalContract.getTotalWaves(),
            wavePortalContract.getAllWaves(),
          ]);

        setTotalWaves(countResponse.toNumber());
        console.log("Retrieved total wave count...", countResponse.toNumber());
        setAllWaves(
          allWavesResponse.map((wave) => ({
            message: wave.message,
            address: wave.waver,
            timestamp: new Date(wave.timestamp.toNumber() * 1000),
          }))
        );

        wavePortalContract.on("NewWave", onNewWave);
      } catch (error) {
        console.log(error);
      }
    }
    if (wavePortalContract) initVariables();

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, [wavePortalContract]);

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
          <button className="waveButton" onClick={sendWave}>
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

        <h3 style={{ display: "flex", alignItems: "center" }}>
          Waves{" "}
          <span role="img" aria-label="Waves" style={{ marginLeft: 8 }}>
            🌊🌊🌊
          </span>{" "}
        </h3>
        {allWaves.map((wave, index) => {
          return (
            <div
              key={`${wave.address}_${wave.timestamp.getTime()}`}
              style={{
                backgroundColor: "OldLace",
                marginTop: index > 0 ? "16px" : undefined,
                padding: "8px",
                borderRadius: "5px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px gray solid",
                  padding: "16px 4px",
                  color: "gray",
                  fontWeight: 700,
                }}
              >
                <span>{wave.address}</span>
                <span style={{ fontSize: "0.85rem" }}>
                  {new Intl.DateTimeFormat([], {
                    dateStyle: "medium",
                  }).format(wave.timestamp)}
                </span>
              </div>
              <div style={{ padding: "16px 4px" }}>{wave.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
