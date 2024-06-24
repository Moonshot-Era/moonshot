'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Box, Flex, Text } from '@radix-ui/themes';

import './style.scss';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';

import { ROUTES } from '@/utils';
import { Icon, IconButton } from '@/legos';
import { onboardingData } from './helpers';
import { useWidth } from '@/hooks/useWidth';
import { createBrowserClient } from '@/supabase/client';

export const OnboardingLayout = () => {
  const { mdScreen } = useWidth();

  const [activeSlide, setActiveSlide] = useState(0);
  const route = useRouter();

  const handleOnboardingComplete = async () => {
    const supabaseClient = createBrowserClient();
    const { data } = await supabaseClient.auth.getSession();

    const userId = data.session?.user?.id;

    if (userId) {
      await supabaseClient
        .from('profiles')
        .update({
          onboarding_completed: true
        })
        .eq('user_id', userId);

      route.replace(ROUTES.home);
    }
  };

  return (
    <Flex
      justify="center"
      height="100%"
      className={onboardingData[activeSlide].bgClassName}
    >
      <Flex
        maxWidth="430px"
        maxHeight="844px"
        justify="center"
        pt="33px"
        my="auto"
        mx="0"
      >
        <Swiper
          modules={[Pagination, Navigation]}
          direction="horizontal"
          loop={false}
          pagination={{
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
          }}
          navigation={{
            nextEl: '.swiper-button-next'
          }}
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
        >
          {onboardingData.map(
            (
              { id, bgClassName, description, imgSrc, labelClassName, title },
              index
            ) => (
              <SwiperSlide key={id}>
                <Flex direction="column" align="center" justify="center">
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
                    <Text
                      size={mdScreen ? '5' : '4'}
                      weight="bold"
                      mb="4"
                      mr="2"
                    >
                      {title}
                    </Text>
                    <Text size="3" weight="medium">
                      {description}
                    </Text>
                  </Flex>
                  <div
                    className={`swiper-button-next swiper-button-bg-${activeSlide}`}
                    onClick={() => {
                      if (onboardingData.length - 1 === index) {
                        console.log('test');

                        handleOnboardingComplete();
                      }
                    }}
                  >
                    <Icon icon="chevronRight" color="#000" />
                  </div>
                </Flex>
              </SwiperSlide>
            )
          )}
          <div
            className={`swiper-pagination swiper-pagination-bg-${activeSlide}`}
          ></div>
        </Swiper>
      </Flex>
    </Flex>
  );
};
