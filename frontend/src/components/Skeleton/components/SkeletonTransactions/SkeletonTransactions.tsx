import { Box, Flex } from '@radix-ui/themes';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import './style.scss';

export const SkeletonTransactions = () => (
  <Flex
    direction="column"
    align="center"
    width="100%"
    height="100vh"
    mt="78px"
    className="main-wrapper"
  >
    <Box mb="32px">
      <Skeleton width={149} height={28} />
    </Box>

    <Flex width="100%" direction="column" gap="2">
      <Box>
        <Skeleton width={95} />
      </Box>
      {Array(2)
        .fill(2)
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
            <Flex direction="column" align="end">
              <Box>
                <Skeleton width={67} />
              </Box>
              <Box>
                <Skeleton width={42} height={8} />
              </Box>
            </Flex>
          </Flex>
        ))}
      <Box>
        <Skeleton width={95} />
      </Box>
      {Array(4)
        .fill(4)
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
            <Flex direction="column" align="end">
              <Box>
                <Skeleton width={67} />
              </Box>
              <Box>
                <Skeleton width={42} height={8} />
              </Box>
            </Flex>
          </Flex>
        ))}
    </Flex>
  </Flex>
);
