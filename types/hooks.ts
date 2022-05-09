
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers} from "ethers";
import { SWRResponse } from "swr";

export type Web3Dependencies = {
  provider: providers.Web3Provider;
  contract: Contract;
  ethereum: MetaMaskInpageProvider;
}

export type CryptoHookFactory<D = any, P = any> = {
  (d: Partial<Web3Dependencies>): CrytoHandlerHook<D, P>;
}

export type CrytoHandlerHook<D = any, P = any> = (params?: P) => CrytoSWRResponse<D>;

export type CrytoSWRResponse<D = any> = SWRResponse<D>;

// export type CryptoHookFactory<D = any, P = any> = {
//   (d: Partial<Web3Dependencies>): (params: P) => SWRResponse<D>;
// }
