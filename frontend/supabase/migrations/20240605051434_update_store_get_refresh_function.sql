CREATE OR REPLACE FUNCTION public.get_refresh_token(user_id uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  param_user_id uuid;
  encrypted_token TEXT;
  decrypted_token TEXT;
  encryption_key TEXT;
BEGIN
  param_user_id = user_id;
  SELECT decrypted_secret INTO encryption_key
  FROM vault.decrypted_secrets
  WHERE key_id = '94b538de-47d6-4116-9f6a-9b1cfbdce5c0';

  IF encryption_key IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT rt INTO encrypted_token FROM profiles WHERE profiles.user_id = param_user_id;

  IF encrypted_token IS NULL THEN
    RETURN NULL;
  END IF;

  decrypted_token := pgp_sym_decrypt(encrypted_token, encryption_key);

  RETURN decrypted_token;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.store_refresh_token(user_id uuid, refresh_token text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  param_user_id uuid;
  encrypted_token TEXT;
  encryption_key TEXT;
BEGIN
  param_user_id = user_id;
  SELECT decrypted_secret INTO encryption_key
  FROM vault.decrypted_secrets
  WHERE key_id = '94b538de-47d6-4116-9f6a-9b1cfbdce5c0';

  encrypted_token := pgp_sym_encrypt(refresh_token, encryption_key);

  UPDATE profiles SET rt = encrypted_token
  WHERE profiles.user_id = param_user_id;
END;
$function$
;