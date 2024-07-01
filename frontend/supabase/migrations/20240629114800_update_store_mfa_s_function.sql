alter table "public"."profiles" add column "user_name" text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.store_mfa_secret(mfa_secret text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  current_user_id uuid;
  encrypted_token bytea;
  encryption_key TEXT;
BEGIN
  SELECT auth.uid() INTO current_user_id;
 
  SELECT decrypted_secret INTO encryption_key
  FROM vault.decrypted_secrets
  WHERE key_id = '94b538de-47d6-4116-9f6a-9b1cfbdce5c0';

  encrypted_token := pgp_sym_encrypt(mfa_secret, encryption_key);

  INSERT INTO sessions (user_id, mfa_s)
        VALUES (current_user_id, encrypted_token)
                ON CONFLICT (user_id) DO UPDATE
                        SET mfa_s = EXCLUDED.mfa_s;
END;$function$
;