import { useState } from 'react';
import { Icon } from '@/legos';
import { Box } from '@radix-ui/themes';

export const ConvertIconArrow = ({
  swapSelectedTokensPlaces
}: {
  swapSelectedTokensPlaces: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      className="convert-icon-arrow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={swapSelectedTokensPlaces}
    >
      {isHovered ? <Icon icon="transfer" /> : <Icon icon="arrowRight" />}
    </Box>
  );
};
