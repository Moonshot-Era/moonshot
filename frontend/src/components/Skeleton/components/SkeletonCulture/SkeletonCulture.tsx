import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Box, Flex, Text } from '@radix-ui/themes';

import './style.scss';

export const SkeletonCulture = () => {
  return (
    <Flex
      direction="column"
      align="center"
      width="100%"
      maxHeight="100vh"
      overflow="hidden"
      className="main-wrapper"
    >
      <Box mt="76px" mb="4">
        <Skeleton width={128} height={28} />
      </Box>
      <Flex
        direction="column"
        width="100%"
        height="275px"
        className={`border-1 bg-white skeleton-empty-card`}
        py="3"
        px="25px"
        mb="4"
      >
        <Box mb="6">
          <Skeleton height={24} />
        </Box>
        <Box>
          <Skeleton height={186} />
        </Box>
      </Flex>
      <Box width="100%" mb="4">
        <Skeleton height={28} />
      </Box>
      <Flex width="100%" direction="column" gap="4">
        <Flex
          direction="column"
          width="100%"
          height="fit-content"
          className={`border-1 bg-white skeleton-empty-card`}
          p="3"
          pt="2"
        >
          <Box>
            <Skeleton width={102} />
          </Box>
          <Flex direction="row" justify="between" align="center">
            <Box>
              <Skeleton width={54} />
            </Box>
            <Box>
              <Skeleton width={71} height={14} />
            </Box>
          </Flex>
        </Flex>
        <Flex
          direction="column"
          width="100%"
          height="fit-content"
          className={`border-1 bg-white skeleton-empty-card`}
          p="3"
          pt="2"
        >
          <Box>
            <Skeleton width={126} />
          </Box>
          <Box>
            <Skeleton width={326} height={80} />
          </Box>
        </Flex>
        <Flex
          direction="column"
          width="100%"
          height="fit-content"
          className={`border-1 bg-white skeleton-empty-card`}
          p="3"
          pt="2"
        >
          <Flex direction="row" justify="between" align="center">
            <Box>
              <Skeleton width={41} />
            </Box>
            <Box>
              <Skeleton width={65} />
            </Box>
          </Flex>
          <Flex direction="row" justify="between" align="center">
            <Box>
              <Skeleton width={84} />
            </Box>
            <Box>
              <Skeleton width={53} />
            </Box>
          </Flex>
          <Flex direction="row" justify="between" align="center">
            <Box>
              <Skeleton width={88} />
            </Box>
            <Box>
              <Skeleton width={40} />
            </Box>
          </Flex>
          <Flex direction="row" justify="between" align="center">
            <Box>
              <Skeleton width={67} />
            </Box>
            <Box>
              <Skeleton width={45} />
            </Box>
          </Flex>
          <Flex direction="row" justify="between" align="center">
            <Box>
              <Skeleton width={90} />
            </Box>
            <Box>
              <Skeleton width={90} />
            </Box>
          </Flex>
          <Flex direction="row" justify="between" align="center">
            <Box>
              <Skeleton width={60} />
            </Box>
            <Box>
              <Skeleton width={34} />
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
