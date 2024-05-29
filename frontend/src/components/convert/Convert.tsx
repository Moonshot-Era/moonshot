import { Text } from "@radix-ui/themes";
import { TokensPick } from "./TokensPick";
import { useState } from "react";
import { SelectedTokens } from '../ConvertDrawer/types';



export const Convert = () => {
  const [selectedTokens, setSelectedTokens] = useState<SelectedTokens>({
    from: null,
    to: null,
  });

  return (
    <>
      <Text>Convert</Text>
      <TokensPick selectedTokens={selectedTokens} setSelectedTokens={setSelectedTokens} />
    </>
  )
}
