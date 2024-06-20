set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_session_data()
 RETURNS TABLE(session_data text, mfa_s text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_user_id uuid;
  encrypted_session_data bytea;
  encrypted_mfa_secret bytea;
  decrypted_session_data TEXT;
  decrypted_mfa_secret TEXT;
  encryption_key TEXT;
BEGIN
  SELECT auth.uid() INTO current_user_id;
  SELECT decrypted_secret INTO encryption_key
  FROM vault.decrypted_secrets
  WHERE key_id = '94b538de-47d6-4116-9f6a-9b1cfbdce5c0';

  IF encryption_key IS NULL THEN
    RETURN QUERY SELECT null, null;
  END IF;

  SELECT sessions.session_data, sessions.mfa_s INTO encrypted_session_data, encrypted_mfa_secret FROM sessions WHERE sessions.user_id = current_user_id;

  IF encrypted_session_data IS NULL OR encrypted_mfa_secret IS NULL THEN
    RETURN QUERY SELECT null, null;
  END IF;

  decrypted_session_data := pgp_sym_decrypt(encrypted_session_data, encryption_key);
  decrypted_mfa_secret := pgp_sym_decrypt(encrypted_mfa_secret, encryption_key);

  RETURN QUERY SELECT decrypted_session_data, decrypted_mfa_secret;
END;
$function$
;
