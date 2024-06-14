import { createServerClient } from '@/supabase/server';
import sharp from 'sharp';

export const uploadAvatarImage = async (imageFile: File) => {
  try {
    const supabaseServerClient = createServerClient();
    const convertedFile = await convertToJPG(imageFile);

    const { data } = await supabaseServerClient.storage
      .from('moonshot_storage')
      .upload(
        `user_avatar/${imageFile.name.split('.')[0] + '.jpg'}`,
        convertedFile,
        {
          cacheControl: '3600',
          upsert: true
        }
      );

    const avatarPath = data?.path;
    if (!avatarPath) {
      throw new Error(`No supabase image path`);
    }
    const { data: avatarUrl } = await supabaseServerClient.storage
      .from('moonshot_storage')
      .createSignedUrl(avatarPath, 60);

    const userId = (await supabaseServerClient.auth.getUser()).data?.user?.id;

    if (avatarUrl && userId) {
      await supabaseServerClient
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
    const jpegBuffer = await sharp(buffer).jpeg().toBuffer();
    return jpegBuffer;
  } catch (err) {
    console.error('Error during conversion:', err);
    throw new Error('Error during conversion:' + err);
  }
};
