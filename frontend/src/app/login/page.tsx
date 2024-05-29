import './style.scss';
import { redirect } from 'next/navigation';
import { QUERY_PARAM_CULTURE_REF } from '@/utils';
import { LoginContent } from '@/components/LoginContent/LoginContent';

export default function Login({ searchParams }: ServerPageProps) {
  const cultureRef = searchParams[QUERY_PARAM_CULTURE_REF];

  return <LoginContent cultureRef={cultureRef as string} />;
}
