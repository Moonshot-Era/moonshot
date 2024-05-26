import { OnboardingLayout } from '@/components/Onboarding/Onboarding';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';

export default async function Onboarding({ searchParams }: ServerPageProps) {
  await checkProtectedRoute(searchParams);

  return <OnboardingLayout />;
}
