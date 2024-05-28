import universeImg from '../../assets/images/onboarding/universe.png';
import manWithKey from '../../assets/images/onboarding/manWithKey.png';
import astronauts from '../../assets/images/onboarding/astronauts.png';
import chessboard4 from '../../assets/images/onboarding/chessboard4.png';

export const onboardingData = [
  {
    id: 1,
    title: 'Welcome to Moonshot!',
    description:
      'Blast off with Moonshot! Discover and speculate on culture in the vast universe of memes. Fund your account and embark on an exciting journey with total control and flexibility.',
    bgClassName: 'onboarding-bg-orange',
    labelClassName: 'onboarding-info-label1',
    imgSrc: universeImg,
  },
  {
    id: 2,
    title: 'Trade with Confidence',
    description:
      'Navigate the cosmos with confidence. Your self-custodied account means you are the sole explorer—no middlemen. Powered by Cubist’s Cubesigner, your account is secure. Check the FAQ for more details on security.',
    bgClassName: 'onboarding-bg-blue',
    labelClassName: 'onboarding-info-label2',
    imgSrc: manWithKey,
  },
  {
    id: 3,
    title: 'Explore and Engage',
    description:
      'Dive into the galaxy of culture on Moonshot. Trade attention, uncover lore, share insights with friends, and stay updated with real-time notifications.',
    bgClassName: 'onboarding-bg-violet',
    labelClassName: 'onboarding-info-label3',
    imgSrc: astronauts,
  },
  {
    id: 4,
    title: 'Subscribe, Refer, and Earn Experience',
    description:
      'Chart your path to success. Follow other users to learn from their portfolios, trade, refer friends, and earn experience to level up and unlock future rewards!',
    bgClassName: 'onboarding-bg-green',
    labelClassName: 'onboarding-info-label4',
    imgSrc: chessboard4,
  },
];
