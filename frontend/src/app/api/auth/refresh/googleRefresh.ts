export const googleRefreshToken = async (refreshToken: string) => {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.GOOGLE_AUTH_CLIENT_ID!,
      client_secret: process.env.GOOGLE_AUTH_SECRET!,
      redirect_uri: process.env.GOOGLE_AUTH_REDIRECT_URL!,
      grant_type: 'refresh_token'
    })
  });

  return await response.json();
};
