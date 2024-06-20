drop function if exists "public"."get_refresh_token"();

drop function if exists "public"."store_refresh_token"(refresh_token text);

drop function if exists "public"."store_session_data"(session_data text, mfa_s text);

drop function if exists "public"."get_session_data"();

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.store_session_data(session_data text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_user_id uuid;
  encrypted_session_data bytea;
  encryption_key TEXT;
BEGIN
  SELECT auth.uid() INTO current_user_id;

  IF current_user_id IS NULL THEN
     RAISE EXCEPTION 'User not found';
  END IF;
 
  SELECT decrypted_secret INTO encryption_key
  FROM vault.decrypted_secrets
  WHERE key_id = '94b538de-47d6-4116-9f6a-9b1cfbdce5c0';

  encrypted_session_data := pgp_sym_encrypt(session_data, encryption_key);

  INSERT INTO sessions (user_id, session_data)
        VALUES (current_user_id, encrypted_session_data)
                ON CONFLICT (user_id) DO UPDATE
                        SET session_data = EXCLUDED.session_data;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_session_data()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_user_id uuid;
  encrypted_session_data bytea;
  decrypted_session_data TEXT;
  encryption_key TEXT;
BEGIN
  SELECT auth.uid() INTO current_user_id;
  SELECT decrypted_secret INTO encryption_key
  FROM vault.decrypted_secrets
  WHERE key_id = '94b538de-47d6-4116-9f6a-9b1cfbdce5c0';

  IF encryption_key IS NULL THEN
    RETURN null;
  END IF;

  SELECT sessions.session_data INTO encrypted_session_data FROM sessions WHERE sessions.user_id = current_user_id;

  IF encrypted_session_data IS NULL THEN
    RETURN null;
  END IF;

  decrypted_session_data := pgp_sym_decrypt(encrypted_session_data, encryption_key);

  RETURN decrypted_session_data;
END;
$function$
;
