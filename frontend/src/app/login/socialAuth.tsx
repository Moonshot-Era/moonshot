'use client';

export const SocialAuth = () => {
  return (
    <>
      <script src="https://accounts.google.com/gsi/client" async defer></script>
      <div
        id="g_id_onload"
        data-client_id={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID}
        data-login_uri={`${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/google`}
        data-ux_mode="redirect"
      ></div>
      <div
        className="g_id_signin"
        data-type="standard"
        data-size="large"
        data-theme="outline"
        data-text="sign_in_with"
        data-shape="rectangular"
        data-logo_alignment="left"
      ></div>
    </>
  );
};
