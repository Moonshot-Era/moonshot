import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Box, Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Icon } from '@/legos';

export const SkeletonHome = () => {
  return (
    <Flex
      direction="column"
      align="center"
      width="100%"
      height="100vh"
      maxHeight="100vh"
      className="main-wrapper"
    >
      <Box width="100%" maxWidth="256px" mt="147px" mb="3">
        <Skeleton />
      </Box>
      <Box width="100%" maxWidth="128px" mb="134px">
        <Skeleton />
      </Box>
      <Box width="100%" maxWidth="256px" mb="74px">
        <Skeleton />
      </Box>

      <Flex width="100%" direction="column">
        <Text size={'3'} weight="medium" mb="2">
          My portfolio
        </Text>

        <Flex
          direction="row"
          align="center"
          justify="between"
          gap="8px"
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
      </Flex>
    </Flex>
  );
};
