import { createServerClient } from '@/supabase/server';
import fs from 'fs/promises';
import sharp from 'sharp';

export const uploadAvatarImage = async (imageFile: File) => {
  try {
    const supabaseServerClient = createServerClient();
    const convertedFilePath = await convertToJPG(imageFile);
    const convertedFile = await fs.readFile(convertedFilePath);

    const { data } = await supabaseServerClient.storage
      .from('moonshot_storage')
      .upload(`user_avatar/${imageFile.name}`, convertedFile, {
        cacheControl: '3600',
        upsert: true
      });

    const avatarPath = data?.path;
    if (!avatarPath) {
      throw new Error(`No supabase image path`);
    }
    const { data: avatarUrl } = await supabaseServerClient.storage
      .from('moonshot_storage')
      .createSignedUrl(avatarPath, 60);

    const userId = (await supabaseServerClient.auth.getUser()).data?.user?.id;

    if (avatarUrl && userId) {
      supabaseServerClient
        .from('profiles')
        .update({ avatar_url: avatarUrl.signedUrl })
        .eq('user_id', userId);
    }
    return avatarUrl?.signedUrl || '';
  } catch (err) {
    console.error('Error during uploading avatar:', err);
    throw new Error('Error during uploading avatar: ' + err);
  }
};

const convertToJPG = async (file: File) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const outputPath = 'avatar.jpeg';
    await sharp(buffer).jpeg().toFile(outputPath);
    return outputPath;
  } catch (err) {
    console.error('Error during conversion:', err);
    throw new Error('Error during conversion:' + err);
  }
};
