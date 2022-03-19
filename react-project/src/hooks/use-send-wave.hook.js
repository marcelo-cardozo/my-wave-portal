import { useCallback, useState } from "react";
import { useWavePortalContract } from "./use-waveportal-contract.hook";

export function useSendWave({ onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestingTransaction, setIsRequestingTransaction] = useState(false);
  const { wavePortalContract } = useWavePortalContract();

  const sendWave = useCallback(
    async (message) => {
      if (!wavePortalContract) {
        console.log("Ethereum object doesn't exist!");
        return;
      }

      try {
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
         * Execute the actual wave from your smart contract
         */
        setIsRequestingTransaction(true);
        const waveTxn = await wavePortalContract.wave(message, {
          gasLimit: 300_000,
        });
        setIsRequestingTransaction(false);
        console.log("Mining...", waveTxn.hash);

        setIsLoading(true);
        await waveTxn.wait();
        setIsLoading(false);
        console.log("Mined -- ", waveTxn.hash);

        if (onSuccess) {
          await onSuccess(wavePortalContract);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setIsRequestingTransaction(false);
      }
    },
    [wavePortalContract]
  );

  return { isLoading, isRequestingTransaction, sendWave };
}
