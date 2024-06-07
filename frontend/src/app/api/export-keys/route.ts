import { NextResponse } from 'next/server';
import { fetchExportKeys } from '@/services';
import { cookies } from 'next/headers';
import { getMfaSecret } from '@/services/helpers/getMfaSecret';

export async function POST(request: Request) {
  const oidc = cookies()?.get('pt')?.value;
  const totpSecret = await getMfaSecret();

  if (!oidc) {
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    });
  }

  const exportKeysData = await fetchExportKeys(oidc, totpSecret);

  return NextResponse.json(exportKeysData);
}
