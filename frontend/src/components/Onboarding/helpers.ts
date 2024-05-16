import universeImg from '../../assets/images/onboarding/universe.png';
import chessboardImg from '../../assets/images/onboarding/chessboard1.png';
import chessboard2Img from '../../assets/images/onboarding/chessboard2.png';

export const onboadingData = [
  {
    id: 1,
    title: 'Welcome to Moonshot!',
    description:
      'Create your wallet quickly using any of our single sign on options or your email address. Begin your journey into the exciting world of memecoins with full control and flexibility.',
    bgClassName: 'onboarding-bg-orange',
    labelClassName: 'onboarding-info-label1',
    imgSrc: universeImg,
  },
  {
    id: 2,
    title: 'Invest with confidence',
    description:
      'Your transactions are safeguarded with Cubist’s CubeSigner technology, ensuring all keys are managed within secure hardware from generation to signing. No more risks of insider threats or software breaches.',
    bgClassName: 'onboarding-bg-blue',
    labelClassName: 'onboarding-info-label2',
    imgSrc: chessboardImg,
  },
  {
    id: 3,
    title: 'Explore and Engage',
    description:
      'Invest in whitelisted memes, delve into token lore, and share insights with friends. Engage with the community through our social features and stay informed with real-time notifications.',
    bgClassName: 'onboarding-bg-violet',
    labelClassName: 'onboarding-info-label3',
    imgSrc: chessboard2Img,
  },
];
