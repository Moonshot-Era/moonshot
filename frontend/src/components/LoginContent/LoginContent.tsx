'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Flex, Text } from '@radix-ui/themes';

import { Button, Icon } from '@/legos';
import { useWidth } from '@/hooks/useWidth';
import { QUERY_PARAM_CULTURE_REF } from '@/utils';
import cubistLogo from '../../assets/images/cubist_logo.svg';

interface Props {
  cultureRef?: string;
}

export const LoginContent = ({ cultureRef }: Props) => {
  const { mdScreen } = useWidth();

  const router = useRouter();
  const handleGoogleLogin = () => {
    router.push(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/google?${
        cultureRef ? `${QUERY_PARAM_CULTURE_REF}=${cultureRef}` : ''
      }`
    );
  };

  const handleTwitterLogin = () => {
    router.push(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/twitter?${
        cultureRef ? `${QUERY_PARAM_CULTURE_REF}=${cultureRef}` : ''
      }`
    );
  };

  return (
    <>
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
            <Text size={mdScreen ? '4' : '3'} weight="medium">
              Trade Culture
            </Text>
          </Flex>

          <Flex direction="column" gap="4" width="100%">
            <Button className="bg-white" onClick={handleGoogleLogin}>
              <Icon icon="google" width={16} />
              <Text size={mdScreen ? '4' : '2'} weight="medium">
                Sign in with Google
              </Text>
            </Button>
          </Flex>
          <Flex direction="column" gap="4" width="100%">
            <Button className="bg-white" onClick={handleTwitterLogin}>
              <Icon icon="twitter" width={16} />
              <Text size={mdScreen ? '4' : '2'} weight="medium">
                Sign in with Twitter
              </Text>
            </Button>
          </Flex>
        </Flex>
        <Flex direction="row" position="absolute" bottom="50px">
          <Text size={mdScreen ? '3' : '1'}>Powered by</Text>
          <Image src={cubistLogo} alt="cubist-logo" />
        </Flex>
      </Flex>
    </>
  );
};
