alter table "public"."profiles" add column "rt" text;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

set check_function_bodies = off;

-- store_refresh_token
CREATE OR REPLACE FUNCTION public.store_refresh_token(
	user_id uuid,
	refresh_token text)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
  encrypted_token TEXT;
  encryption_key TEXT;
BEGIN
  SELECT decrypted_secret INTO encryption_key
  FROM vault.decrypted_secrets
  WHERE key_id = '94b538de-47d6-4116-9f6a-9b1cfbdce5c0';

  encrypted_token := pgp_sym_encrypt(refresh_token, encryption_key);

  UPDATE profile SET rt = encrypted_token
  WHERE user_id = user_id;
END;
$BODY$;

ALTER FUNCTION public.store_refresh_token(uuid, text)
    OWNER TO postgres;


GRANT EXECUTE ON FUNCTION public.store_refresh_token(uuid, text) TO authenticated;

GRANT EXECUTE ON FUNCTION public.store_refresh_token(uuid, text) TO postgres;

GRANT EXECUTE ON FUNCTION public.store_refresh_token(uuid, text) TO service_role;


-- get_refresh_token 
CREATE OR REPLACE FUNCTION public.get_refresh_token(user_id uuid)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
  encrypted_token TEXT;
  decrypted_token TEXT;
  encryption_key TEXT;
BEGIN
  SELECT decrypted_secret INTO encryption_key
  FROM vault.decrypted_secrets
  WHERE key_id = '94b538de-47d6-4116-9f6a-9b1cfbdce5c0';

  IF encryption_key IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT rt INTO encrypted_token FROM profile WHERE user_id = user_id;


  IF encrypted_token IS NULL THEN
    RETURN NULL;
  END IF;

  decrypted_token := pgp_sym_decrypt(encrypted_token, encryption_key);

  RETURN decrypted_token;
END;
$function$
;

ALTER FUNCTION public.get_refresh_token(uuid)
    OWNER TO postgres;


GRANT EXECUTE ON FUNCTION public.get_refresh_token(uuid) TO authenticated;

GRANT EXECUTE ON FUNCTION public.get_refresh_token(uuid) TO postgres;

GRANT EXECUTE ON FUNCTION public.get_refresh_token(uuid) TO service_role;