import { uploadAvatarImage } from '@/services/helpers/uploadAvatarImage';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const requestData = await request.formData();
  const imageFile = requestData.get('imageFile');

  const imageUrl: string = await uploadAvatarImage(imageFile as File);
  return NextResponse.json({ imageUrl });
}
