import { Box, Flex } from '@radix-ui/themes';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import './style.scss';
import { Icon } from '@/legos';

export const SkeletonExplore = () => (
  <Flex
    direction="column"
    align="center"
    width="100%"
    height="100vh"
    mt="80px"
    className="main-wrapper"
  >
    <Flex
      direction="row"
      justify="between"
      width="100%"
      gap="4"
      mb="4"
      className="skeleton-search"
    >
      <Box width="100%">
        <Skeleton />
      </Box>
      <Icon icon="search" />
    </Flex>
    <Flex width="100%" direction="column" gap="4">
      {Array(10)
        .fill(10)
        .map((item, index) => (
          <Flex
            key={index}
            direction="row"
            align="center"
            justify="between"
            gap="2"
            width="100%"
            height="fit-content"
            className={`border-1 bg-white skeleton-empty-card`}
            p="3"
            pt="2"
          >
            <Flex direction="row" gap="2">
              <Box>
                <Skeleton
                  width={48}
                  height={48}
                  className="skeleton-empty-card-icon"
                />
              </Box>
              <Flex direction="column">
                <Box>
                  <Skeleton width={67} />
                </Box>
                <Box>
                  <Skeleton width={42} height={8} />
                </Box>
              </Flex>
            </Flex>
            <Flex direction="row" align="center" gap="2">
              <Flex direction="column" align="end">
                <Box>
                  <Skeleton width={67} />
                </Box>
                <Box>
                  <Skeleton width={42} height={8} />
                </Box>
              </Flex>
              <Icon icon="chevronRight" />
            </Flex>
          </Flex>
        ))}
    </Flex>
  </Flex>
);
