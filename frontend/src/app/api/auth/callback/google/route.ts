import { getCubistUserKey } from '@/services';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const credential = formData.get('credential');

  await getCubistUserKey(credential as string);

  return NextResponse.redirect(process.env.SITE_URL as string);
}
