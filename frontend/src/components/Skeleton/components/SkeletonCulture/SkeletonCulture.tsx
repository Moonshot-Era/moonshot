import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Box, Flex, Text } from '@radix-ui/themes';

import './style.scss';

const toolbarTitles = ['Convert', 'Deposit', 'Withdraw', 'Share'];

export const SkeletonCulture = () => (
  <Flex
    direction="column"
    align="center"
    width="100%"
    height="100vh"
    mt="76px"
    className="main-wrapper"
  >
    <Box mb="218px">
      <Skeleton width={128} height={28} />
    </Box>
    <Flex width="100%" direction="row" justify="between" mb="4" px="2">
      {toolbarTitles.map((title, index) => (
        <Flex key={index} direction="column" align="center" gap="1">
          <Box>
            <Skeleton
              width={48}
              height={48}
              className="skeleton-empty-card-icon"
            />
          </Box>
          <Text size="1">{title}</Text>
        </Flex>
      ))}
    </Flex>
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
