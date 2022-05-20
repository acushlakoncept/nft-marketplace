import { CryptoHookFactory } from "@_types/hooks";
import { useEffect } from "react";
import useSWR from "swr";

type UseNetworkResponse = {
  isLoading: boolean;
  isSupported: boolean;
  targetNetwork: string;
  isConnectedToNetwork: boolean;
}

const NETWORKS: {[K: string]: string} = {
  1: "Ethereum Mainnet",
  3: "Ropsten Test Network",
  4: "Rinkeby Test Network",
  5: "Goerli Test Network",
  42: "Kovan Test Network",
  56: "Binance Smart Chain",
  1337: "Ganache"
}

const targetId = process.env.NEXT_PUBLIC_TARGET_CHAIN_ID as string;
const targetNetwork = NETWORKS[targetId];

type NetworkHookFactory = CryptoHookFactory<string, UseNetworkResponse>

export type UseNetworkHook = ReturnType<NetworkHookFactory>

export const hookFactory: NetworkHookFactory = ({provider, isLoading}) => () => {
  const { data, isValidating, ...swr} = useSWR(
    provider ? "web3/useNetwork" : null,  
  async () => {
    const chainId = (await provider!.getNetwork()).chainId;

    if(!chainId) {
      throw "Cannot retrieve network. Please, refresh browser or connect to other one";
    }
      
    return NETWORKS[chainId];
  }, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })

  const isSupported = data === targetNetwork;

  return {
    ...swr,
    data,
    isValidating,
    targetNetwork,
    isSupported,
    isConnectedToNetwork: !isLoading && isSupported,
    isLoading: isLoading as boolean,
  };
}
