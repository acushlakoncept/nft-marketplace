
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers} from "ethers";
import { SWRResponse } from "swr";

export type Web3Dependencies = {
  provider: providers.Web3Provider;
  contract: Contract;
  ethereum: MetaMaskInpageProvider;
}

export type CrytoSWRResponse = SWRResponse;

export type CrytoHandlerHook = (params: any) => CrytoSWRResponse;

export type CryptoHookFactory = {
  (d: Partial<Web3Dependencies>): CrytoHandlerHook;
}
