import { Text } from "@radix-ui/themes";
import { TokensPick } from "./TokensPick";
import { useState } from "react";

export const Convert = () => {
  const [selectedTokens, setSelectedTokens] = useState({
    from: null,
    to: null,
  })

  return (
    <>
      <Text>Convert</Text>
      <TokensPick selectedTokens={selectedTokens} setSelectedTokens={setSelectedTokens} />
    </>
  )
}
