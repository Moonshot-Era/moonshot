'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Box, Flex, Text } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';

import './style.scss';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IconButton } from '@/legos';
import { onboardingData } from './helpers';
import { createBrowserClient } from '@/supabase/client';
import { ROUTES } from '@/utils';

export const OnboardingLayout = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const route = useRouter();

  const handleOnboardingComplete = async () => {
    const supabaseClient = createBrowserClient();
    const { data } = await supabaseClient.auth.getSession();

    if (data.session?.user?.id) {
      await supabaseClient
        .from('profiles')
        .update({
          onboarding_completed: true,
        })
        .eq('user_id', data.session?.user?.id);

      route.replace(ROUTES.home);
    }
  };

  return (
    <Swiper
      modules={[Pagination]}
      direction="horizontal"
      loop={false}
      pagination={{
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
      }}
      onSlideChange={swiper => setActiveSlide(swiper.realIndex)}
    >
      {onboardingData.map(
        (
          { id, bgClassName, description, imgSrc, labelClassName, title },
          index,
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
              {onboardingData.length - 1 === index ? (
                <Box position="absolute" bottom="8">
                  <IconButton icon="home" onClick={handleOnboardingComplete} />
                </Box>
              ) : null}
            </Flex>
          </SwiperSlide>
        ),
      )}
      <div
        className={`swiper-pagination swiper-pagination-bg-${activeSlide}`}
      ></div>
    </Swiper>
  );
};
