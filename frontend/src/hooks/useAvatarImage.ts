import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const uploadAvatarImage = (imageFile: File) => {
  const formData = new FormData();
  formData.append('imageFile', imageFile);
  return axios
    .post(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/upload-avatar-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    .then((response) => {
      return response.data.imageUrl;
    })
    .catch();
};

export const useAvatarImage = () => {
  const { data, ...rest } = useMutation({
    mutationKey: ['avatar-image'],
    mutationFn: async (imageFile: File) => {
      if (!imageFile) {
        return null;
      } else {
        return await uploadAvatarImage(imageFile);
      }
    }
  });

  return { imageUrl: data, ...rest };
};
