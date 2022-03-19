import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  wavePortalContractABI,
  wavePortalContractAddress,
} from "../WavePortal/WavePortal.constants";

export function useWavePortalContract() {
  const [wavePortalContract, setWavePortalContract] = useState(null);

  useEffect(() => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        setWavePortalContract(
          new ethers.Contract(
            wavePortalContractAddress,
            wavePortalContractABI,
            signer
          )
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {}
  }, []);

  return { wavePortalContract };
}
