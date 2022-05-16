
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers} from "ethers";
import { SWRResponse } from "swr";
import { NftMarketContract } from "./nftMarketContract";

export type Web3Dependencies = {
  provider: providers.Web3Provider;
  contract: NftMarketContract;
  ethereum: MetaMaskInpageProvider;
  isLoading: boolean;
}

export type CryptoHookFactory<D = any, R = any, P = any> = {
  (d: Partial<Web3Dependencies>): CrytoHandlerHook<D, R, P>;
}

export type CrytoHandlerHook<D = any, R = any, P = any> = (params?: P) => CrytoSWRResponse<D, R>;

export type CrytoSWRResponse<D = any, R = any> = SWRResponse<D> & R;

// export type CryptoHookFactory<D = any, P = any> = {
//   (d: Partial<Web3Dependencies>): (params: P) => SWRResponse<D>;
// }
