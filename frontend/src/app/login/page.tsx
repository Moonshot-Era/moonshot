'use client';

import Image from 'next/image';
import { Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Button, Icon } from '@/legos';
import cubistLogo from '../../assets/images/cubist_logo.svg';
import { SplashScreen } from '@/components/SplashScreen/SplashScreen';
import { useRouter } from 'next/navigation';
import { QUERY_PARAM_CULTURE_REF } from '@/utils';

export default function Login({ searchParams }: ServerPageProps) {
  const router = useRouter();
  const cultureRef = searchParams[QUERY_PARAM_CULTURE_REF];

  const handleGoogleLogin = () => {
    router.push(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/google?${
        cultureRef ? `${QUERY_PARAM_CULTURE_REF}=${cultureRef}` : ''
      }`,
    );
  };

  return (
    <>
      <SplashScreen />
      <Flex
        className="main-wrapper"
        height="100vh"
        direction="column"
        align="center"
        justify="center"
      >
        <div className="login-figure1"></div>
        <div className="login-figure2"></div>
        <div className="login-figure3"></div>
        <div className="login-figure4"></div>
        <Flex
          direction="column"
          align="center"
          justify="center"
          flexGrow="1"
          gap="8"
        >
          <Flex direction="column" align="center">
            <Text size="8" weight="bold">
              Moonshot
            </Text>
            <Text size="3" weight="medium">
              Trade Culture
            </Text>
          </Flex>

          <Flex direction="column" gap="4" width="100%">
            <Button className="bg-white" onClick={handleGoogleLogin}>
              <Icon icon="google" width={16} />
              <Text size="2" weight="medium">
                Sign in with Google
              </Text>
            </Button>
          </Flex>
        </Flex>
        <Flex direction="row" position="absolute" bottom="50px">
          <Text size="1">Powered by</Text>
          <Image src={cubistLogo} alt="cubist-logo" />
        </Flex>
      </Flex>
    </>
  );
}
