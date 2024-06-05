import { useMutation, useQuery } from "@tanstack/react-query";
import { SelectedTokens } from "./types";
import axios from "axios";

type SwapRoute = {};

const fetchSwapRoutes = (
  inputMint: string,
  outputMint: string,
  amount: string | number,
  slippageBps: number
): Promise<SwapRoute[]> =>
  axios
    .post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/get-swap-routes`, {
      inputMint,
      outputMint,
      amount,
      slippageBps
    })
    .then((response) => response.data?.swapRoutes);


const swapTokens = (swapRoutes: void) =>
  axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/swap-tokens`, {
    swapRoutes
  });

export const useSwapRoutes = (
  { from, to }: SelectedTokens,
  amount: number,
  slippageBps: number,
  isValidAmount: boolean
) => {
  const { data, ...rest } = useQuery({
    queryKey: [
      `getSwapRoutes_${from?.address}_${to?.included?.attributes.address}_${amount}_${slippageBps}`,
    ],
    queryFn: () =>
      fetchSwapRoutes(
        from?.address || '',
        to?.included?.attributes.address || '',
        amount,
        slippageBps
      ),
    enabled: !!(isValidAmount && amount && from && to && slippageBps),
  });

  return { swapRoutes: data, ...rest };
};

export const useSwapMutation = () => {
  const mutation = useMutation({
    // @ts-ignore
    mutationFn: ({ swapRoutes }) => {
      return swapTokens(swapRoutes);
    },
  });

  return mutation;
}
