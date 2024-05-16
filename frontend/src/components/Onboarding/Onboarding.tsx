'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Box, Flex, Text } from '@radix-ui/themes';

import './style.scss';

import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { IconButton } from '@/legos';
import { onboadingData } from './helpers';

export const OnboardingLayout = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <Swiper
      modules={[Pagination]}
      direction="horizontal"
      loop={true}
      pagination={{
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
      }}
      onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
    >
      {onboadingData.map(
        (
          { id, bgClassName, description, imgSrc, labelClassName, title },
          index
        ) => (
          <SwiperSlide key={id}>
            <Flex className={bgClassName} direction="column" align="center">
              <Image
                className="onboarding-image"
                src={imgSrc}
                alt="cubist-logo"
              />
              <Flex
                className="onboarding-info bg-white"
                direction="column"
                p="4"
                mx="7"
              >
                <div className={labelClassName}></div>
                <Text size="4" weight="bold" mb="4">
                  {title}
                </Text>
                <Text size="3" weight="medium">
                  {description}
                </Text>
              </Flex>
              {onboadingData.length - 1 === index ? (
                <Box position="absolute" bottom="8">
                  <Link href="/">
                    <IconButton icon="home" />
                  </Link>
                </Box>
              ) : null}
            </Flex>
          </SwiperSlide>
        )
      )}
      <div
        className={`swiper-pagination swiper-pagination-bg-${activeSlide}`}
      ></div>
    </Swiper>
  );
};
