import { Box, Flex } from '@radix-ui/themes';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { Icon } from '@/legos';
import './style.scss';

export const SkeletonExploreList = () => (
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
);
