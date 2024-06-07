alter table "public"."profiles" add column "mfa_s" text;

CREATE OR REPLACE FUNCTION public.get_mfa_secret()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_user_id uuid;
  encrypted_token TEXT;
  decrypted_token TEXT;
  encryption_key TEXT;
BEGIN
  SELECT auth.uid() INTO current_user_id;
  SELECT decrypted_secret INTO encryption_key
  FROM vault.decrypted_secrets
  WHERE key_id = '94b538de-47d6-4116-9f6a-9b1cfbdce5c0';

  IF encryption_key IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT mfa_s INTO encrypted_token FROM profiles WHERE profiles.user_id = current_user_id;

  IF encrypted_token IS NULL THEN
    RETURN NULL;
  END IF;

  decrypted_token := pgp_sym_decrypt(encrypted_token, encryption_key);

  RETURN decrypted_token;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.store_mfa_secret(mfa_secret text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_user_id uuid;
  encrypted_token TEXT;
  encryption_key TEXT;
BEGIN
  SELECT auth.uid() INTO current_user_id;
 
  SELECT decrypted_secret INTO encryption_key
  FROM vault.decrypted_secrets
  WHERE key_id = '94b538de-47d6-4116-9f6a-9b1cfbdce5c0';

  encrypted_token := pgp_sym_encrypt(mfa_secret, encryption_key);

  UPDATE profiles SET mfa_s = encrypted_token
  WHERE profiles.user_id = current_user_id;
END;
$function$
;

GRANT EXECUTE ON FUNCTION public.store_mfa_secret(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.store_mfa_secret(text) TO postgres;
GRANT EXECUTE ON FUNCTION public.store_mfa_secret(text) TO service_role;

GRANT EXECUTE ON FUNCTION public.get_mfa_secret() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_mfa_secret() TO postgres;
GRANT EXECUTE ON FUNCTION public.get_mfa_secret() TO service_role;