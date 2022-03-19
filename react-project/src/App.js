import React, { useState, useEffect } from "react";
import { useConnectWallet } from "./hooks/use-connect-wallet.hook";
import { useSendWave } from "./hooks/use-send-wave.hook";
import { useWavePortalContract } from "./hooks/use-waveportal-contract.hook";

import "./App.css";

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
      setAllWaves((prevState) => {
        if (
          prevState.find(
            (wave) =>
              wave.message === message &&
              wave.address === from &&
              wave.timestamp === timestamp.toNumber()
          )
        )
          return prevState;

        return [
          ...prevState,
          {
            message,
            address: from,
            timestamp: timestamp.toNumber(),
          },
        ];
      });
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
            timestamp: wave.timestamp.toNumber(),
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
          I am Chelo and I work as a Front end developer, connect your Ethereum
          wallet and wave at me!
        </div>
        {totalWaves ? (
          <div className="bio">I have received {totalWaves} waves</div>
        ) : null}

        <div className="bio">
          <span style={{ fontWeight: 700 }}>Note: </span> the contract is
          deployed in the Rinkeby Test Network, so make sure to select it in
          Metamask!
        </div>
        {isRequestingTransaction ? (
          <div className="bio" style={{ fontWeight: 700 }}>
            An approval is required to proceed with the transaction...
          </div>
        ) : null}
        {currentAccount === null ? (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <form
            style={{ display: "flex", flexDirection: "column" }}
            onSubmit={(e) => {
              e.preventDefault();
              sendWave(e.target.message.value);
              e.target.message.value = "";
            }}
          >
            {isLoading || isRequestingTransaction ? (
              <div className="loader"></div>
            ) : null}
            <input
              style={{
                marginTop: 16,
                border: "1px gray solid",
                borderRadius: 4,
                lineHeight: "1.5rem",
              }}
              type="text"
              name="message"
              disabled={isLoading || isRequestingTransaction}
            />
            <button
              className="waveButton"
              type="submit"
              disabled={isLoading || isRequestingTransaction}
            >
              Wave at Me
            </button>
          </form>
        )}

        <h3 style={{ display: "flex", alignItems: "center" }}>
          Waves{" "}
          <span role="img" aria-label="Waves" style={{ marginLeft: 8 }}>
            🌊🌊🌊
          </span>{" "}
        </h3>
        {allWaves.length === 0 ? (
          <p className="bio">
            Be the first to wave at me, an instant reward is awaiting you!
          </p>
        ) : (
          allWaves.map((wave, index) => {
            return (
              <div
                key={`${wave.address}_${wave.timestamp}`}
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
                    }).format(new Date(wave.timestamp * 1000))}
                  </span>
                </div>
                <div style={{ padding: "16px 4px" }}>{wave.message}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
