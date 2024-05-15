"use client";

declare global {
  interface Window {
    handleSignInWithGoogle: (response: { credential: string }) => void; // Adjust the type signature as needed
  }
}

interface SocialAuthProps {
  signUpWithToken: (response: FormData) => void;
}

export const SocialAuth = ({ signUpWithToken }: SocialAuthProps) => {
  window.handleSignInWithGoogle = (response) => {
    const formData = new FormData();
    formData.append("token", response.credential);
    signUpWithToken(formData);
  };

  return (
    <>
      <div
        id="g_id_onload"
        data-client_id={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID}
        data-context="signin"
        data-ux_mode="popup"
        data-callback="handleSignInWithGoogle"
        // data-nonce=''
        data-auto_select="true"
        data-itp_support="true"
      ></div>

      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="pill"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
    </>
  );
};
