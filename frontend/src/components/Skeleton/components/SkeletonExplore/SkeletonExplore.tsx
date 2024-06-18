import { Box, Flex } from '@radix-ui/themes';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import './style.scss';
import { Icon } from '@/legos';
import { SkeletonExploreList } from './SkeletonExploreList';

export const SkeletonExplore = () => (
  <Flex
    direction="column"
    align="center"
    width="100%"
    overflow="hidden"
    className="main-wrapper"
    pt="70px"
  >
    <Flex
      direction="row"
      justify="between"
      width="100%"
      pt="70px"
      gap="4"
      mb="4"
      className="skeleton-search"
    >
      <Box width="100%">
        <Skeleton />
      </Box>
      <Icon icon="search" />
    </Flex>
    <SkeletonExploreList />
  </Flex>
);
