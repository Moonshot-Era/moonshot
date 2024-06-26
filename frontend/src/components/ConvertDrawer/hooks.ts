import { useMutation, useQuery } from "@tanstack/react-query";
import { FeeDataType, SelectedTokens } from "./types";
import axios from "axios";
import { useDebounce } from '@uidotdev/usehooks';

type SwapRoute = {
  outAmount: number;
};

const fetchSwapRoutes = (
  inputMint: string,
  outputMint: string,
  amount: string | number,
  slippageBps: number
): Promise<SwapRoute> =>
  axios
    .post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/get-swap-routes`, {
      inputMint,
      outputMint,
      amount,
      slippageBps
    })
    .then((response) => response.data?.swapRoutes);

export const swapTokens = (swapRoutes: void, feeData: FeeDataType) =>
  axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/swap-tokens`, {
    swapRoutes,
    feeData
  });

export const useSwapRoutes = (
  { from, to }: SelectedTokens,
  amount: number,
  slippageBps: number,
  isValidAmount: boolean
) => {
  const debouncedAmount = useDebounce(amount, 500);

  const { data, ...rest } = useQuery({
    queryKey: [
      `getSwapRoutes_${from?.address}_${to?.included?.attributes.address}_${debouncedAmount}_${slippageBps}`
    ],
    queryFn: () =>
      fetchSwapRoutes(
        from?.address || from?.included?.attributes.address || '',
        to?.address || to?.included?.attributes.address || '',
        debouncedAmount,
        slippageBps
      ),
    enabled: !!(isValidAmount && amount && from && to && slippageBps),
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  return { swapRoutes: data, ...rest };
};

export const useSwapMutation = () => {
  const mutation = useMutation({
    // @ts-ignore
    mutationFn: ({ swapRoutes, feeData }) => {
      return swapTokens(swapRoutes, feeData);
    }
  });

  return mutation;
};
