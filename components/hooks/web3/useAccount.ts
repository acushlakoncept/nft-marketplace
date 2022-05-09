import { CryptoHookFactory } from "@_types/hooks";
import useSWR from "swr";

type AccountHookFactory = CryptoHookFactory<string, string>

export type UseAccountHook = ReturnType<AccountHookFactory>

export const hookFactory: AccountHookFactory = ({provider}) => (params) => {
  const swrRes = useSWR(provider ? "web3/useAccount" : null,  
  () => {
    return "Test User";
  })

  return swrRes;
}

// export const useAccount = hookFactory({ethereum: undefined, provider: undefined});