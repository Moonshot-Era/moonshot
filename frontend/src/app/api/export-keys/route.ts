import { NextResponse } from 'next/server';
import { fetchExportKeys } from '@/services';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const oidc = cookies()?.get('pt')?.value;

  if (!oidc) {
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    });
  }

  const exportKeysData = await fetchExportKeys(oidc);

  return NextResponse.json(exportKeysData);
}
