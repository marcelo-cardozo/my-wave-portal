import { useCallback, useEffect, useState } from "react";

export function useConnectWallet() {
  const [currentAccount, setCurrentAccount] = useState();

  const connectWallet = useCallback(async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log({ accounts });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
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
        console.log({ accounts });

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

    checkIfWalletIsConnected();
  }, []);

  return { connectWallet, currentAccount };
}
