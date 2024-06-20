import { NextResponse } from 'next/server';
import { fetchExportKeys, fetchInitiateExportKeys } from '@/services';

export async function POST(request: Request) {
  const response = await request.json();
  let exportKeysData;
  let timestamp;

  try {
    if (response.type === 'initiate') {
      timestamp = await fetchInitiateExportKeys();
    }

    if (response.type === 'export') {
      exportKeysData = await fetchExportKeys();
    }

    return NextResponse.json(exportKeysData || timestamp || {});
  } catch (err) {
    return NextResponse.json({ error: err });
  }
}
