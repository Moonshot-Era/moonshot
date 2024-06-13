import { NextResponse } from 'next/server';
import { fetchExportKeys, fetchInitiateExportKeys } from '@/services';
import { cookies } from 'next/headers';
import { getMfaSecret } from '@/services/helpers/getMfaSecret';

export async function POST(request: Request) {
  const oidc = cookies()?.get('pt')?.value;
  const totpSecret = await getMfaSecret();

  const response = await request.json();
  let exportKeysData;
  let timestamp;
  if (!oidc) {
    return NextResponse.json({ error: { statusText: 'Forbidden' } });
  }
  try {
    if (response.type === 'initiate') {
      timestamp = await fetchInitiateExportKeys(oidc, totpSecret);
    }

    if (response.type === 'export') {
      exportKeysData = await fetchExportKeys(oidc, totpSecret);
    }

    return NextResponse.json(exportKeysData || timestamp || {});
  } catch (err) {
    return NextResponse.json({ error: err });
  }
}
